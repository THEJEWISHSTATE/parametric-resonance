import numpy as np
from scipy.spatial.distance import cosine

def calculate_phi(theta_A, theta_B):
    """
    Calculate parametric resonance Φ between two parameter sets.
    """
    # Flatten parameter matrices
    vec_A = theta_A.flatten()
    vec_B = theta_B.flatten()
    
    # Normalize
    vec_A_norm = vec_A / (np.linalg.norm(vec_A) + 1e-10)
    vec_B_norm = vec_B / (np.linalg.norm(vec_B) + 1e-10)
    
    # Calculate cosine distance
    cos_dist = cosine(vec_A_norm, vec_B_norm)
    
    # Convert to resonance measure Φ
    phi = cos_dist / 2.0
    
    return phi

# Test if run directly
if __name__ == "__main__":
    # Quick test
    A = np.random.randn(3, 3)
    B = A.copy()
    print(f"Phi(identical): {calculate_phi(A, B):.3f}")
    
    C = np.random.randn(3, 3)
    print(f"Phi(different): {calculate_phi(A, C):.3f}")