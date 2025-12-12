import sys
import os
sys.path.insert(0, os.path.abspath('.'))

print("=" * 60)
print("🔬 PHI FRAMEWORK - TEST CON PhiMetric (nome corretto!)")
print("=" * 60)

try:
    import numpy as np
    print("✅ 1. numpy importato")
    
    # NOTA: Usa PhiMetric, non PhiCalculator!
    from src.phi_resonance.metrics.phi import PhiMetric
    print("✅ 2. PhiMetric importato (corretto!)")
    
    # Crea un'istanza
    calculator = PhiMetric()
    
    # Test 1: Parametri identici
    print("\n📊 TEST 1: Parametri identici")
    param_identical = np.random.randn(10, 10)
    data_identical = param_identical.copy()
    
    phi_value1 = calculator.compute(param_identical, data_identical)
    print(f"   Φ = {phi_value1:.3f}")
    
    # Test 2: Parametri diversi
    print("\n📊 TEST 2: Parametri diversi")
    param_different = np.random.randn(10, 10)
    data_different = np.random.randn(10, 10)
    
    phi_value2 = calculator.compute(param_different, data_different)
    print(f"   Φ = {phi_value2:.3f}")
    
    # Interpretazione
    print("\n📈 INTERPRETAZIONE:")
    print(f"   • Φ(identici) = {phi_value1:.3f} → atteso: ~0.00-0.10")
    print(f"   • Φ(diversi) = {phi_value2:.3f} → atteso: ~0.50-1.00")
    
    if phi_value1 < 0.2 and phi_value2 > 0.4:
        print("\n🎉 SUCCESSO: Tutti i test passati!")
    else:
        print("\n⚠️ ATTENZIONE: Valori inaspettati")
    
except Exception as e:
    print(f"\n❌ ERRORE: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("🧪 TEST COMPLETATO")
print("=" * 60)
input("\nPremi Invio per uscire...")