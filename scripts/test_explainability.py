import sys

def test_explainability_imports():
    print("Verifying Explainability libraries...")
    
    # Check SHAP
    try:
        import shap
        print(f"SHAP Version: {shap.__version__}")
        shap_ok = True
    except ImportError as e:
        print(f"SHAP is NOT available. Error: {e}")
        shap_ok = False
        
    # Check Captum
    try:
        import captum
        print(f"Captum Version: {captum.__version__}")
        captum_ok = True
    except ImportError as e:
        print(f"Captum is NOT available. Error: {e}")
        captum_ok = False
        
    if shap_ok and captum_ok:
        print("Explainability libraries import verification SUCCESSFUL.")
    else:
        print("Explainability libraries import verification FAILED.")

if __name__ == "__main__":
    test_explainability_imports()
