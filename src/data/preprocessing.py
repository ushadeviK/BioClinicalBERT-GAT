import re

class TextPreprocessor:
    """
    Handles cleaning of clinical notes and preparing them for tokenization.
    """
    def __init__(self, lowercase=True):
        self.lowercase = lowercase

    def clean_text(self, text: str) -> str:
        if not isinstance(text, str):
            return ""
        
        # Lowercase if set
        if self.lowercase:
            text = text.lower()
            
        # Remove typical de-identification placeholders like [**Name**] if present
        text = re.sub(r'\[\*\*.*?\*\*\]', '', text)

        # Remove multiple spaces, newlines, and carriage returns
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()

    def preprocess_batch(self, texts: list) -> list:
        return [self.clean_text(t) for t in texts]
