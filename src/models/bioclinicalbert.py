import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel

class BioClinicalBERTEmbedder(nn.Module):
    """
    Wrapper for Emily Alsentzer's BioClinicalBERT to extract clinical text embeddings.
    """
    def __init__(self, model_name: str = "emilyalsentzer/Bio_ClinicalBERT", device: str = "cpu"):
        super(BioClinicalBERTEmbedder, self).__init__()
        self.device = torch.device(device)
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name).to(self.device)
        
    def forward(self, texts: list) -> torch.Tensor:
        """
        Embeds a batch of clinical text.
        Returns the [CLS] token representation of shape (batch_size, 768).
        """
        inputs = self.tokenizer(texts, padding=True, truncation=True, max_length=128, return_tensors="pt")
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            
        # CLS embedding is the first token (index 0) of the last hidden state
        cls_embeddings = outputs.last_hidden_state[:, 0, :]
        return cls_embeddings
