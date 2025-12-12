import sys 
import os 
sys.path.insert(0, os.path.abspath('..')) 
 
print("=" * 50) 
print("PHI FRAMEWORK - BASIC DEMO") 
print("=" * 50) 
 
try: 
    import numpy as np 
    print("Step 1: numpy imported OK") 
 
    from src.phi_resonance.metrics.phi import PhiMetric 
    calculator = PhiMetric() 
    print("Step 2: PhiMetric created OK") 
 
    print("Test 1: Identical parameters") 
    a = np.random.randn(30, 30) 
    b = a.copy() 
    phi1 = calculator.compute(a, b) 
    print(f"Phi value: {phi1:.6f}") 
 
    print("Test 2: Different parameters") 
    c = np.random.randn(30, 30) * 100 
    phi2 = calculator.compute(a, c) 
    print(f"Phi value: {phi2:.6f}") 
 
    print("SUMMARY:") 
    print(f"Phi(identical): {phi1:.6f}") 
    print(f"Phi(different): {phi2:.6f}") 
 
    if phi1 < 0.01: 
        print("PASS: Low Phi for identical") 
    else: 
        print(f"CHECK: Phi={phi1:.6f}") 
 
    if phi2 > 0.5: 
        print("PASS: High Phi for different") 
    else: 
        print(f"CHECK: Phi={phi2:.6f}") 
 
    print("DEMO COMPLETED") 
 
except Exception as e: 
    print(f"ERROR: {e}") 
 
print("END") 
