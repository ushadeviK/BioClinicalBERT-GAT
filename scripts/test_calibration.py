import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from scipy.optimize import minimize

def calculate_ece(probs, labels, n_bins=10):
    """
    Calculate Expected Calibration Error (ECE) for demonstration.
    probs: array of shape (N,) containing the maximum probability for each sample
    labels: array of shape (N,) containing the true binary/multiclass label matching the predictions
    """
    # Find the predicted class and its probability
    pred_labels = np.argmax(probs, axis=1)
    confidences = np.max(probs, axis=1)
    accuracies = (pred_labels == labels)

    ece = 0.0
    bin_boundaries = np.linspace(0, 1, n_bins + 1)
    
    print("\n--- Reliability Diagram Data (Demonstration Only) ---")
    print(f"{'Bin':<10}{'Confidence Range':<20}{'Avg Conf':<12}{'Avg Acc':<12}{'Count':<8}")
    
    for i in range(n_bins):
        bin_lower = bin_boundaries[i]
        bin_upper = bin_boundaries[i + 1]
        
        # Select items in the current bin
        in_bin = (confidences > bin_lower) & (confidences <= bin_upper)
        prop_in_bin = np.mean(in_bin)
        
        if prop_in_bin > 0:
            accuracy_in_bin = np.mean(accuracies[in_bin])
            avg_confidence_in_bin = np.mean(confidences[in_bin])
            ece += prop_in_bin * np.abs(avg_confidence_in_bin - accuracy_in_bin)
            
            print(f"{i+1:<10}[{bin_lower:.2f}, {bin_upper:.2f})    {avg_confidence_in_bin:.4f}      {accuracy_in_bin:.4f}      {np.sum(in_bin):<8}")
        else:
            print(f"{i+1:<10}[{bin_lower:.2f}, {bin_upper:.2f})    {'N/A':<12}{'N/A':<12}0")
            
    return ece

class TemperatureScaler:
    def __init__(self):
        self.temperature = 1.0

    def fit(self, logits, labels):
        """
        Optimize temperature scaling parameter T on validation logits.
        """
        # Convert to PyTorch tensors
        logits_t = torch.tensor(logits, dtype=torch.float32)
        labels_t = torch.tensor(labels, dtype=torch.long)
        
        # Single scalar parameter initialized to 1.0
        temp_param = nn.Parameter(torch.ones(1) * 1.5)
        
        # Loss function
        nll_criterion = nn.CrossEntropyLoss()
        
        # Optimizer
        optimizer = optim.LBFGS([temp_param], lr=0.01, max_iter=50)
        
        def eval_loss():
            optimizer.zero_grad()
            scaled_logits = logits_t / temp_param
            loss = nll_criterion(scaled_logits, labels_t)
            loss.backward()
            return loss
            
        optimizer.step(eval_loss)
        
        self.temperature = float(temp_param.item())
        print(f"Optimized temperature (T): {self.temperature:.4f}")
        return self

    def scale(self, logits):
        return logits / self.temperature

def test_calibration():
    print("==================================================")
    print("   CONFIDENCE CALIBRATION DEMONSTRATION SCRIPT    ")
    print("==================================================")
    print("WARNING: This script uses synthetic demonstration data.")
    print("It is designed only to verify the calibration logic.")
    print("Do NOT use these values as research or final results.")
    print("==================================================")
    
    # 1. Generate synthetic logits (1000 samples, 3 classes)
    np.random.seed(42)
    num_samples = 1000
    num_classes = 3
    
    # Generate some uncalibrated logits
    logits = np.random.randn(num_samples, num_classes) * 2.0
    labels = np.random.randint(0, num_classes, size=num_samples)
    
    # Add strong signal to class labels to simulate a trained model
    for i in range(num_samples):
        # 70% chance of high probability on the correct class
        if np.random.rand() < 0.7:
            logits[i, labels[i]] += 4.0
            
    # Calculate initial probabilities
    probs_uncal = np.exp(logits) / np.sum(np.exp(logits), axis=1, keepdims=True)
    
    print("\n--- Evaluating Uncalibrated Predictions ---")
    ece_uncal = calculate_ece(probs_uncal, labels)
    print(f"Uncalibrated ECE: {ece_uncal:.4f}")
    
    # 2. Fit temperature scaling
    print("\n--- Fitting Temperature Scaling Parameter ---")
    scaler = TemperatureScaler()
    scaler.fit(logits, labels)
    
    # 3. Apply temperature scaling
    logits_cal = scaler.scale(logits)
    probs_cal = np.exp(logits_cal) / np.sum(np.exp(logits_cal), axis=1, keepdims=True)
    
    print("\n--- Evaluating Calibrated Predictions ---")
    ece_cal = calculate_ece(probs_cal, labels)
    print(f"Calibrated ECE: {ece_cal:.4f}")
    
    # Verification assert
    assert ece_cal <= ece_uncal + 0.05, "Calibration did not improve ECE or remain comparable."
    print("\nCalibration logic check: SUCCESSFUL.")

if __name__ == "__main__":
    test_calibration()
