import torch
try:
    from torch_geometric.nn import GATConv
    PYG_AVAILABLE = True
except ImportError as e:
    PYG_AVAILABLE = False
    PYG_ERROR = e

def test_gat():
    print("Initializing GAT verification test...")
    if not PYG_AVAILABLE:
        print(f"PyTorch Geometric is not importable. Error: {PYG_ERROR}")
        return

    # Define a tiny synthetic graph
    # 4 nodes, 3 features each
    x = torch.tensor([
        [1.0, 2.0, 3.0],
        [4.0, 5.0, 6.0],
        [7.0, 8.0, 9.0],
        [10.0, 11.0, 12.0]
    ], dtype=torch.float)
    
    # 4 directed edges forming a cycle (0 -> 1 -> 2 -> 3 -> 0)
    edge_index = torch.tensor([
        [0, 1, 2, 3],
        [1, 2, 3, 0]
    ], dtype=torch.long)
    
    print(f"Nodes (features shape): {x.shape}")
    print(f"Edges (edge_index shape): {edge_index.shape}")
    
    # Initialize GATConv layer
    # in_channels = 3 (node features)
    # out_channels = 5 (hidden features)
    # heads = 2 (multi-head attention)
    in_channels = 3
    out_channels = 5
    heads = 2
    
    print(f"Initializing GATConv: in_channels={in_channels}, out_channels={out_channels}, heads={heads}")
    conv = GATConv(in_channels, out_channels, heads=heads)
    
    print("Running forward pass...")
    try:
        out = conv(x, edge_index)
        print(f"GAT output shape: {out.shape}")
        # Expected shape is [num_nodes, out_channels * heads] = [4, 10]
        expected_shape = (4, out_channels * heads)
        if out.shape == expected_shape:
            print("GAT Forward Pass and Output Shape SUCCESSFUL.")
        else:
            print(f"GAT Verification FAILED (unexpected shape {out.shape}, expected {expected_shape}).")
    except Exception as e:
        print(f"GAT Verification FAILED with exception during forward pass: {e}")

if __name__ == "__main__":
    test_gat()
