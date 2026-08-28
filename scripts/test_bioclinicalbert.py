import torch
from transformers import AutoTokenizer, AutoModel

def test_bioclinicalbert():
    print("Initializing BioClinicalBERT test...")
    model_name = "emilyalsentzer/Bio_ClinicalBERT"
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device selected: {device}")
    
    print(f"Loading tokenizer: {model_name}...")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    
    print(f"Loading model: {model_name}...")
    model = AutoModel.from_pretrained(model_name)
    model = model.to(device)
    
    sample_text = "Patient was admitted with acute chest pain and shortness of breath."
    print(f"Sample Sentence: '{sample_text}'")
    
    print("Tokenizing input text...")
    inputs = tokenizer(sample_text, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}
    
    print("Running forward pass (inference)...")
    with torch.no_grad():
        outputs = model(**inputs)
        
    # Extract the [CLS] representation (first token, index 0)
    # Shape of last_hidden_state: (batch_size, sequence_length, hidden_size)
    cls_embedding = outputs.last_hidden_state[0, 0]
    
    print(f"CLS Representation shape: {cls_embedding.shape}")
    print(f"Expected hidden dimension: 768")
    
    # Confirm it ran successfully
    if cls_embedding.shape[0] == 768:
        print("BioClinicalBERT Verification SUCCESSFUL.")
    else:
        print("BioClinicalBERT Verification FAILED (unexpected embedding size).")

if __name__ == "__main__":
    test_bioclinicalbert()
