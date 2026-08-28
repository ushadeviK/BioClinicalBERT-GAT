import os
import random
from pathlib import Path
from dotenv import load_dotenv

# Automatically load environment variables from the project root .env file
root_dir = Path(__file__).resolve().parents[2]
env_path = root_dir / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

class Config:
    """
    Centralized configuration settings for the BioClinicalBERT-GAT project.
    Provides parameters for reproducibility, training, and database connections.
    """
    # Environment & Paths
    ROOT_DIR = root_dir
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/bioclinicalbert_gat")
    MODEL_NAME = os.getenv("MODEL_NAME", "emilyalsentzer/Bio_ClinicalBERT")
    DEVICE = os.getenv("DEVICE", "cpu")
    
    # Reproducibility Settings
    RANDOM_SEED = int(os.getenv("RANDOM_SEED", 42))
    
    # Training Hyperparameters
    BATCH_SIZE = int(os.getenv("BATCH_SIZE", 16))
    LEARNING_RATE = float(os.getenv("LEARNING_RATE", 2e-5))
    NUM_EPOCHS = int(os.getenv("NUM_EPOCHS", 10))
    MAX_SEQ_LENGTH = int(os.getenv("MAX_SEQ_LENGTH", 128))
    
    # GAT Network Hyperparameters
    NUM_GAT_LAYERS = int(os.getenv("NUM_GAT_LAYERS", 2))
    HIDDEN_DIM = int(os.getenv("HIDDEN_DIM", 256))
    DROPOUT = float(os.getenv("DROPOUT", 0.2))
    NUM_CLASSES = int(os.getenv("NUM_CLASSES", 5))  # Default to 5 disease categories
    
    @classmethod
    def set_seed(cls):
        """
        Sets random seed across numpy, random, and torch for reproducibility.
        """
        import numpy as np
        random.seed(cls.RANDOM_SEED)
        np.random.seed(cls.RANDOM_SEED)
        try:
            import torch
            torch.manual_seed(cls.RANDOM_SEED)
            if torch.cuda.is_available():
                torch.cuda.manual_seed_all(cls.RANDOM_SEED)
            # Ensure deterministic operations
            torch.backends.cudnn.deterministic = True
            torch.backends.cudnn.benchmark = False
        except ImportError:
            pass

    @classmethod
    def get_summary(cls):
        return {
            "RANDOM_SEED": cls.RANDOM_SEED,
            "DEVICE": cls.DEVICE,
            "MODEL_NAME": cls.MODEL_NAME,
            "BATCH_SIZE": cls.BATCH_SIZE,
            "LEARNING_RATE": cls.LEARNING_RATE,
            "NUM_EPOCHS": cls.NUM_EPOCHS,
            "MAX_SEQ_LENGTH": cls.MAX_SEQ_LENGTH,
            "NUM_GAT_LAYERS": cls.NUM_GAT_LAYERS,
            "HIDDEN_DIM": cls.HIDDEN_DIM,
            "DROPOUT": cls.DROPOUT,
            "NUM_CLASSES": cls.NUM_CLASSES
        }
