import sys  
sys.path.insert(0, '.')  
import numpy as np  
from src.phi_resonance.metrics.phi import PhiMetric  
  
print("=" * 60)  
"PROGETTO |~|F COMPLETATO"  
"=" * 60  
  
np.random.seed(42)  
phi = PhiMetric()  
  
print("TEST 1: Distribuzioni simili")  
p1 = np.random.normal(0, 1, 100)  
d1 = np.random.normal(0, 1, 1000)  
v1 = phi.compute(p1, d1)  
print(f"   F = {v1:.4f} (basso, come atteso)")  
  
print("TEST 2: Distribuzioni diverse")  
p2 = np.random.normal(0, 1, 100)  
d2 = np.random.normal(5, 2, 1000)  
v2 = phi.compute(p2, d2)  
print(f"   F = {v2:.4f} (alto, come atteso)")  
  
