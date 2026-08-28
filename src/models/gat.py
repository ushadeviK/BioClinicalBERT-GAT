import torch
import torch.nn as nn
import torch.nn.functional as F
try:
    from torch_geometric.nn import GATConv
    PYG_AVAILABLE = True
except ImportError:
    PYG_AVAILABLE = False

class GATClassifier(nn.Module):
    """
    Graph Attention Network (GAT) classifier for disease prediction.
    """
    def __init__(self, in_features: int, hidden_dim: int, out_features: int, num_layers: int = 2, heads: int = 2, dropout: float = 0.2):
        super(GATClassifier, self).__init__()
        
        if not PYG_AVAILABLE:
            raise ImportError("PyTorch Geometric is required for GATClassifier but is not available.")
            
        self.num_layers = num_layers
        self.dropout = dropout
        
        self.convs = nn.ModuleList()
        # First GAT layer
        self.convs.append(GATConv(in_features, hidden_dim, heads=heads, concat=True, dropout=dropout))
        
        # Intermediate GAT layers
        for _ in range(num_layers - 2):
            self.convs.append(GATConv(hidden_dim * heads, hidden_dim, heads=heads, concat=True, dropout=dropout))
            
        # Final prediction layer
        # If concat=True on intermediate layers, input dim is hidden_dim * heads
        in_dim = hidden_dim * heads if num_layers > 1 else in_features
        self.convs.append(GATConv(in_dim, out_features, heads=1, concat=False, dropout=dropout))

    def forward(self, x: torch.Tensor, edge_index: torch.Tensor) -> torch.Tensor:
        """
        Forward pass for the graph neural network.
        """
        for i in range(self.num_layers - 1):
            x = self.convs[i](x, edge_index)
            x = F.elu(x)
            x = F.dropout(x, p=self.dropout, training=self.training)
            
        # Output layer
        logits = self.convs[-1](x, edge_index)
        return logits
