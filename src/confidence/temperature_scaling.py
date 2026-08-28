import torch
import torch.nn as nn
import torch.optim as optim

class TemperatureScaler:
    """
    Optimizes and applies temperature scaling to calibrate GNN output logits.
    """
    def __init__(self):
        self.temperature = 1.0

    def fit(self, logits: torch.Tensor, labels: torch.Tensor) -> 'TemperatureScaler':
        """
        Finds the optimal temperature parameter using L-BFGS on validation logits.
        """
        # Ensure logits and labels are PyTorch tensors
        if not isinstance(logits, torch.Tensor):
            logits = torch.tensor(logits, dtype=torch.float32)
        if not isinstance(labels, torch.Tensor):
            labels = torch.tensor(labels, dtype=torch.long)
            
        nll_criterion = nn.CrossEntropyLoss()
        
        # Single learnable scalar value for temperature scaling, initialized to 1.5
        temp_param = nn.Parameter(torch.ones(1) * 1.5)
        optimizer = optim.LBFGS([temp_param], lr=0.01, max_iter=50)
        
        def closure():
            optimizer.zero_grad()
            loss = nll_criterion(logits / temp_param, labels)
            loss.backward()
            return loss
            
        optimizer.step(closure)
        self.temperature = float(temp_param.item())
        
        return self

    def scale(self, logits: torch.Tensor) -> torch.Tensor:
        if not isinstance(logits, torch.Tensor):
            logits = torch.tensor(logits, dtype=torch.float32)
        return logits / self.temperature
