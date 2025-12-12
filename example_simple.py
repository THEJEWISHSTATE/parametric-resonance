import sys  
sys.path.insert(0, '.')  
import numpy as np  
from src.phi_resonance.metrics.phi import PhiMetric  
  
print("=" * 60)  
"ESEMPIO PRATICO: Risonanza Parametrica"  
"=" * 60  
  
np.random.seed(42)  
  
"# 1. Dati di input (distribuzione target)"  
data = np.random.normal(0.5, 1.0, 1000)  
print(f"Dati: {len(data)} campioni, media={data.mean():.3f}, std={data.std():.3f}")  
  
"# 2. Inizializzazione modello (parametri lontani)"  
params_iniziali = np.random.normal(-2.0, 0.5, 100)  
print(f"Parametri iniziali: media={params_iniziali.mean():.3f}, std={params_iniziali.std():.3f}")  
  
"# 3. Calcola F iniziale"  
phi = PhiMetric(n_bins=25)  
phi_iniziale = phi.compute(params_iniziali, data)  
print(f"F iniziale: {phi_iniziale:.6f}")  
  
"# 4. Simula training (parametri si avvicinano ai dati)"  
print("\nSimulazione training...")  
print("Passo | Media param | F | Stato")  
print("-" * 50)  
  
for step in range(6):  
    alpha = step / 5  
    current_params = np.random.normal(-2.0 + 2.5*alpha, 0.5 + 0.5*alpha, 100)  
    phi_val = phi.compute(current_params, data)  
  
