import torch
import torch.nn as nn
from src.models.bioclinicalbert import BioClinicalBERTEmbedder
from src.models.gat import GATClassifier

class BioClinicalBERTGATModel(nn.Module):
    """
    Combined BioClinicalBERT + Graph Attention Network (GAT) clinical prediction architecture.
    """
    def __init__(self, model_name: str = "emilyalsentzer/Bio_ClinicalBERT", hidden_dim: int = 256, num_classes: int = 5, num_gat_layers: int = 2, dropout: float = 0.2, device: str = "cpu"):
        super(BioClinicalBERTGATModel, self).__init__()
        
        self.device = torch.device(device)
        
        # 1. Text embedding encoder
        self.embedder = BioClinicalBERTEmbedder(model_name=model_name, device=device)
        
        # 2. Graph neural network classifier
        # BioClinicalBERT CLS output feature size is 768
        self.gat = GATClassifier(
            in_features=768,
            hidden_dim=hidden_dim,
            out_features=num_classes,
            num_layers=num_gat_layers,
            dropout=dropout
        )

    def forward(self, texts: list, edge_index: torch.Tensor) -> torch.Tensor:
        """
        Runs text extraction followed by GAT layer convolution.
        """
        # Embed texts -> Node features of shape [num_patients, 768]
        x = self.embedder(texts)
        
        # Pass features and topology through GAT
        logits = self.gat(x, edge_index)
        
        return logits
