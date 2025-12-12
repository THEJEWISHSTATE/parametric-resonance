import sys  
sys.path.insert(0, '.')  
import numpy as np  
print("Test 1: Import base...")  
try:  
    from src.phi_resonance.metrics.phi import PhiMetric  
    print("SUCCESSO: PhiMetric importato!")  
    phi = PhiMetric()  
    params = np.array([1.0, 2.0, 3.0])  
    data = np.array([1.1, 2.1, 3.1, 4.0, 5.0])  
    result = phi.compute(params, data)  
    print(f"PRIMO VALORE F CALCOLATO: {result}")  
    print("?? CE L'ABBIAMO FATTA!")  
except Exception as e:  
    print(f"ERRORE: {e}") 
