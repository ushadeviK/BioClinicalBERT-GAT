import torch

class ClinicalGraphBuilder:
    """
    Constructs patient clinical similarity graphs.
    """
    def __init__(self, similarity_threshold=0.5):
        self.similarity_threshold = similarity_threshold

    def build_patient_graph(self, features: torch.Tensor) -> tuple:
        """
        Builds a simple patient-to-patient graph based on similarity threshold.
        Returns:
            x: Node features (torch.Tensor)
            edge_index: Adjacency representation (torch.Tensor)
        """
        # Node features
        x = features
        num_nodes = x.size(0)
        
        # Calculate cosine similarity matrix
        normalized_x = x / (x.norm(dim=1, keepdim=True) + 1e-8)
        similarity = torch.mm(normalized_x, normalized_x.t())
        
        # Determine edges where similarity is greater than threshold (excluding self-loops)
        adj_matrix = similarity > self.similarity_threshold
        adj_matrix.fill_diagonal_(0)
        
        # Convert to edge_index (coordinate format)
        edge_index = adj_matrix.nonzero().t()
        
        return x, edge_index
