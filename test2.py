import sys  
sys.path.insert(0, '.')  
import numpy as np  
from src.phi_resonance.metrics.phi import PhiMetric  
  
print("=" * 50)  
"TEST COMPLETO METRICA F"  
"=" * 50  
  
np.random.seed(42)  
  
"# CASO 1: Distribuzioni simili (stessa media e deviazione)"  
print("Caso 1: Distribuzioni simili...")  
params1 = np.random.normal(0, 1, 100)  
data1 = np.random.normal(0, 1, 1000)  
  
"# CASO 2: Distribuzioni diverse (media diversa)"  
print("Caso 2: Distribuzioni diverse...")  
params2 = np.random.normal(0, 1, 100)  
data2 = np.random.normal(5, 2, 1000)  
  
phi = PhiMetric(n_bins=20)  
  
phi1 = phi.compute(params1, data1)  
phi2 = phi.compute(params2, data2)  
  
print()  
print(f"F (simili):     {phi1:.6f}")  
print(f"F (diverse):    {phi2:.6f}")  
  
