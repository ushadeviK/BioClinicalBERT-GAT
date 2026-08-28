import sys
import platform
import os

def check_env():
    print(f"OS: {platform.system()} {platform.release()} (Build {platform.version()})")
    print(f"Python: {sys.version.split()[0]}")
    
    # Check PyTorch
    try:
        import torch
        print(f"PyTorch: {torch.__version__}")
        cuda_avail = torch.cuda.is_available()
        print(f"CUDA Available: {cuda_avail}")
        if cuda_avail:
            print(f"CUDA Version: {torch.version.cuda}")
            print(f"GPU: {torch.cuda.get_device_name(0)}")
            print(f"Number of GPUs: {torch.cuda.device_count()}")
            device = "cuda"
        else:
            print("GPU: None (NVIDIA GPU not detected/available)")
            device = "cpu"
        print(f"Device: {device}")
    except ImportError:
        print("PyTorch: NOT INSTALLED")
        print("CUDA Available: False")
        print("Device: cpu")

    # Check Git version
    import subprocess
    try:
        git_ver = subprocess.check_output(["git", "--version"], stderr=subprocess.STDOUT).decode("utf-8").strip()
        print(f"Git: {git_ver}")
    except Exception:
        print("Git: Not found or error running git")

    # Check Node.js and npm
    try:
        node_ver = subprocess.check_output(["node", "--version"], stderr=subprocess.STDOUT).decode("utf-8").strip()
        print(f"Node: {node_ver}")
    except Exception:
        print("Node: Not found")
        
    try:
        npm_ver = subprocess.check_output(["npm", "--version"], stderr=subprocess.STDOUT).decode("utf-8").strip()
        print(f"npm: {npm_ver}")
    except Exception:
        print("npm: Not found")

    # Check major packages
    packages = [
        ("transformers", "Transformers"),
        ("tokenizers", "Tokenizers"),
        ("datasets", "Datasets"),
        ("torch_geometric", "PyTorch Geometric"),
        ("networkx", "NetworkX"),
        ("shap", "SHAP"),
        ("captum", "Captum"),
        ("fastapi", "FastAPI"),
        ("sqlalchemy", "SQLAlchemy")
    ]
    
    print("\nPackage Verification:")
    for pkg_name, label in packages:
        try:
            pkg = __import__(pkg_name)
            ver = getattr(pkg, "__version__", "unknown version")
            print(f"  - {label}: Installed ({ver})")
        except ImportError:
            print(f"  - {label}: NOT INSTALLED")

if __name__ == "__main__":
    check_env()
