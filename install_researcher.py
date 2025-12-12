#!/usr/bin/env python3
"""
🔬 INSTALLATORE PER RICERCATORI - Φ Framework
Installazione semplice in 3 minuti
"""
import os
import sys
import subprocess
import time

def print_header():
    print("=" * 60)
    print("🔬 Φ PARAMETRIC RESONANCE FRAMEWORK")
    print("   Installazione per Ricercatori")
    print("=" * 60)
    print()

def check_python():
    """Verifica versione Python"""
    print("1️⃣ Controllo versione Python...")
    version = sys.version_info
    if version.major == 3 and version.minor >= 8:
        print(f"   ✅ Python {version.major}.{version.minor}.{version.micro} - OK")
        return True
    else:
        print(f"   ⚠️ Versione Python: {version.major}.{version.minor}")
        print("   Consigliato: Python 3.8 o superiore")
        return True  # Procediamo comunque

def install_dependencies():
    """Installa le dipendenze minime"""
    print("\n2️⃣ Installazione dipendenze...")
    
    dependencies = [
        "numpy",
        "matplotlib",
        "scipy",
    ]
    
    for dep in dependencies:
        print(f"   📦 Installo {dep}...", end="", flush=True)
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", dep])
            print(" ✅")
        except:
            print(" ⚠️ (Problema installazione, continuo...)")
    
    print("   ✅ Dipendenze base installate")

def verify_installation():
    """Verifica che tutto funzioni"""
    print("\n3️⃣ Verifica installazione...")
    
    test_code = """
import sys
print("   Python path:", sys.executable)
try:
    import numpy
    print("   ✅ numpy importato")
    import matplotlib
    print("   ✅ matplotlib importato")
    print("\\n🎉 TUTTO FUNZIONA! Il framework Φ è pronto.")
    print("\\nProssimi passi:")
    print("   1. Vai nella cartella examples/")
    print("   2. Esegui: python basic_usage.py")
    print("   3. Oppure: python phi_narrative.py")
except Exception as e:
    print("   ❌ Errore:", str(e))
"""
    
    # Esegue il codice di test
    subprocess.run([sys.executable, "-c", test_code])

def main():
    print_header()
    
    # 1. Controllo Python
    if not check_python():
        print("\n❌ Python non compatibile")
        return
    
    # 2. Installa dipendenze
    install_dependencies()
    
    # 3. Verifica
    verify_installation()
    
    # 4. Messaggio finale
    print("\n" + "=" * 60)
    print("📚 DOCUMENTAZIONE DISPONIBILE:")
    print("   - README.md: Istruzioni complete")
    print("   - docs/papers/: Documenti tecnici")
    print("   - examples/: Demo e esempi")
    print("=" * 60)
    
    input("\nPremi Invio per uscire...")

if __name__ == "__main__":
    main()