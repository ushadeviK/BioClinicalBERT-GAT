import os
import sys
import pytest
import numpy as np
import torch
from fastapi.testclient import TestClient

# Adjust path to find src
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.config.config import Config
from src.data.preprocessing import TextPreprocessor
from src.graph.graph_builder import ClinicalGraphBuilder
from src.models.gat import GATClassifier
from src.confidence.temperature_scaling import TemperatureScaler
from src.confidence.calibration import compute_ece
from backend.main import app

client = TestClient(app)

def test_config():
    """Verify that Config loads environment values and seeds correctly."""
    assert Config.RANDOM_SEED == 42
    Config.set_seed()
    assert isinstance(Config.get_summary(), dict)

def test_text_preprocessor():
    """Verify text preprocessing utilities."""
    preprocessor = TextPreprocessor(lowercase=True)
    raw_note = "  PATIENT  ADMITTED [**Name**] WITH chest pain...  "
    cleaned = preprocessor.clean_text(raw_note)
    assert cleaned == "patient admitted with chest pain..."
    
    batch = ["Note 1", "Note 2"]
    processed_batch = preprocessor.preprocess_batch(batch)
    assert len(processed_batch) == 2
    assert processed_batch[0] == "note 1"

def test_graph_builder():
    """Verify the ClinicalGraphBuilder creates correct edges from features."""
    builder = ClinicalGraphBuilder(similarity_threshold=0.8)
    # 3 nodes, 2 features
    features = torch.tensor([
        [1.0, 0.0],
        [0.9, 0.1],  # Highly similar to node 0
        [0.0, 1.0]   # Different
    ], dtype=torch.float32)
    
    x, edge_index = builder.build_patient_graph(features)
    assert x.shape == features.shape
    # Edges should exist between 0 and 1 (undirected, so 0->1 and 1->0)
    assert edge_index.shape[1] >= 2
    # Node 2 should have no edges with 0 or 1 because similarity is 0
    # Let's check that 2 is not in edge_index
    assert 2 not in edge_index

def test_gat_classifier():
    """Verify the GAT model initialization and forward pass on synthetic data."""
    # 5 nodes, 4 features each
    x = torch.randn(5, 4)
    # Directed cycle
    edge_index = torch.tensor([
        [0, 1, 2, 3, 4],
        [1, 2, 3, 4, 0]
    ], dtype=torch.long)
    
    # 3 classes output
    model = GATClassifier(in_features=4, hidden_dim=8, out_features=3, num_layers=2, heads=2, dropout=0.0)
    model.eval()
    
    with torch.no_grad():
        out = model(x, edge_index)
        
    assert out.shape == (5, 3)

def test_calibration_ece():
    """Verify Expected Calibration Error calculation."""
    # Perfect calibration mock (acc matches confidence)
    probs = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 0.0], [0.0, 1.0]])
    labels = np.array([0, 1, 0, 1])
    ece = compute_ece(probs, labels, n_bins=2)
    assert ece == 0.0

def test_temperature_scaler():
    """Verify that TemperatureScaler optimizes cross entropy loss correctly."""
    logits = torch.tensor([[2.0, 0.5], [0.1, 3.0], [1.5, 0.2]], dtype=torch.float32)
    labels = torch.tensor([0, 1, 0], dtype=torch.long)
    
    scaler = TemperatureScaler()
    scaler.fit(logits, labels)
    
    assert scaler.temperature > 0
    scaled_logits = scaler.scale(logits)
    assert scaled_logits.shape == logits.shape

def test_backend_endpoints():
    """Verify FastAPI backend status endpoints."""
    # GET /
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["project"] == "BioClinicalBERT-GAT"
    
    # GET /health
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
