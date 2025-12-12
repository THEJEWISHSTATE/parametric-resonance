import sys  
sys.path.insert(0, '.')  
import numpy as np  
from src.phi_resonance.metrics.phi import PhiMetric  
  
print("=" * 70)  
"? VERIFICA FINALE PROGETTO |~|F"  
"=" * 70  
  
np.random.seed(42)  
phi = PhiMetric()  
  
"# Test 1: Distribuzioni identiche (F dovrebbe essere ~0)"  
data = np.random.normal(0, 1, 1000)  
phi1 = phi.compute(data[:100], data)  
  
"# Test 2: Distribuzioni molto diverse"  
phi2 = phi.compute(np.random.normal(5, 2, 100), data)  
  
print(f"F(identiche):  {phi1:.6f}")  
print(f"F(diverse):    {phi2:.6f}")  
  
