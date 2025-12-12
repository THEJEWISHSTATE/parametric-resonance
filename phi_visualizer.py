import sys
sys.path.insert(0, '.')
import numpy as np
import tkinter as tk
from tkinter import messagebox
from src.phi_resonance.metrics.phi import PhiMetric

class PhiVisualizer:
    def __init__(self):
        self.window = tk.Tk()
        self.window.title("Risonanza Parametrica |~|PHI")
        self.window.geometry("700x550")
        self.phi = PhiMetric(n_bins=20)
        self.create_widgets()
    
    def create_widgets(self):
        # Titolo
        title_frame = tk.Frame(self.window, bg="navy")
        title_frame.pack(fill=tk.X, pady=10)
        
        tk.Label(title_frame, text="VISUALIZZATORE METRICA PHI",
                font=("Arial", 20, "bold"), fg="white", bg="navy").pack(pady=10)
        
        tk.Label(title_frame, text="Misura la risonanza tra parametri di modello e dati di input",
                font=("Arial", 11), fg="lightblue", bg="navy").pack()
        
        # Pulsanti dimostrazione
        demo_frame = tk.Frame(self.window)
        demo_frame.pack(pady=20)
        
        tk.Label(demo_frame, text="DIMOSTRAZIONI:",
                font=("Arial", 14, "bold")).grid(row=0, column=0, columnspan=3, pady=10)
        
        b1 = tk.Button(demo_frame, text="ALTA Risonanza (PHI basso)",
                     command=self.demo_alta, bg="#4CAF50", fg="white",
                     font=("Arial", 11), width=20, height=2)
        b1.grid(row=1, column=0, padx=5, pady=5)
        
        b2 = tk.Button(demo_frame, text="MEDIA Risonanza",
                     command=self.demo_media, bg="#FF9800", fg="white",
                     font=("Arial", 11), width=20, height=2)
        b2.grid(row=1, column=1, padx=5, pady=5)
        
        b3 = tk.Button(demo_frame, text="BASSA Risonanza (PHI alto)",
                     command=self.demo_bassa, bg="#F44336", fg="white",
                     font=("Arial", 11), width=20, height=2)
        b3.grid(row=1, column=2, padx=5, pady=5)
        
        # Training simulation
        tk.Button(demo_frame, text="SIMULA TRAINING",
               command=self.demo_training, bg="#2196F3", fg="white",
               font=("Arial", 11), width=62, height=2).grid(row=2, column=0, columnspan=3, pady=15)
        
        # Area risultati
        result_frame = tk.Frame(self.window, relief=tk.RAISED, borderwidth=2)
        result_frame.pack(pady=20, padx=20, fill=tk.X)
        
        tk.Label(result_frame, text="VALORE PHI CALCOLATO:",
                font=("Arial", 14, "bold")).pack(pady=5)
        
        self.phi_value = tk.Label(result_frame, text="0.0000",
                                 font=("Arial", 48, "bold"), fg="#2E7D32")
        self.phi_value.pack()
        
        self.interpretation = tk.Label(result_frame, text="Premi un pulsante per iniziare",
                                      font=("Arial", 12))
        self.interpretation.pack(pady=10)
        
        # Legenda
        legend_frame = tk.Frame(self.window, bg="#FFF9C4")
        legend_frame.pack(pady=10, padx=20, fill=tk.X)
        
        legend_text = "INTERPRETAZIONE:\n"
        legend_text += "• PHI < 0.1: ALTA risonanza (verde)\n"
        legend_text += "• 0.1 <= PHI < 0.5: MEDIA risonanza (arancione)\n"
        legend_text += "• PHI >= 0.5: BASSA risonanza (rosso)\n"
        legend_text += "• Training ideale: PHI diminuisce nel tempo"
        
        tk.Label(legend_frame, text=legend_text, justify=tk.LEFT,
                font=("Arial", 9), bg="#FFF9C4").pack(pady=10, padx=10)
    
    def update_display(self, phi_val):
        self.phi_value.config(text=f"{phi_val:.4f}")
        
        if phi_val < 0.1:
            self.phi_value.config(fg="#4CAF50")
            self.interpretation.config(text="ALTA RISONANZA PARAMETRICA", fg="#4CAF50")
        elif phi_val < 0.5:
            self.phi_value.config(fg="#FF9800")
            self.interpretation.config(text="MEDIA RISONANZA PARAMETRICA", fg="#FF9800")
        else:
            self.phi_value.config(fg="#F44336")
            self.interpretation.config(text="BASSA RISONANZA PARAMETRICA", fg="#F44336")
    
    def demo_alta(self):
        np.random.seed(42)
        val = self.phi.compute(np.random.normal(0, 1, 100), np.random.normal(0, 1, 1000))
        self.update_display(val)
        messagebox.showinfo("Alta Risonanza", f"PHI = {val:.4f}\n\nALTA risonanza parametrica!\n\nI parametri del modello sono distribuiti esattamente come i dati.\n\nCondizione ideale per l'addestramento.")
    
    def demo_media(self):
        np.random.seed(42)
        val = self.phi.compute(np.random.normal(0, 1, 100), np.random.normal(1, 1.5, 1000))
        self.update_display(val)
        messagebox.showinfo("Media Risonanza", f"PHI = {val:.4f}\n\nMedia risonanza parametrica.\n\nI parametri sono parzialmente allineati con i dati.\n\nIl training puo' migliorare la risonanza.")
    
    def demo_bassa(self):
        np.random.seed(42)
        val = self.phi.compute(np.random.normal(0, 1, 100), np.random.normal(5, 2, 1000))
        self.update_display(val)
        messagebox.showinfo("Bassa Risonanza", f"PHI = {val:.4f}\n\nBASSA risonanza parametrica!\n\nI parametri e i dati hanno distribuzioni molto diverse.\n\nConsiglio: ri-inizializzare il modello o modificare l'architettura.")
    
    def demo_training(self):
        np.random.seed(42)
        data = np.random.normal(0.5, 1.0, 1000)
        
        report = "SIMULAZIONE ADDESTRAMENTO RETE NEURALE\n"
        report += "="*50 + "\n\n"
        
        phi_history = []
        for epoch in range(6):
            progress = epoch / 5
            params = np.random.normal(-2.0 + 2.5*progress, 0.5 + 0.5*progress, 100)
            phi_val = self.phi.compute(params, data)
            phi_history.append(phi_val)
            
            report += f"Epoca {epoch+1}: PHI = {phi_val:.4f}"
            if phi_val < 0.1:
                report += "  (ALTA)\n"
            elif phi_val < 0.5:
                report += "  (MEDIA)\n"
            else:
                report += "  (BASSA)\n"
        
        report += "\n" + "="*50 + "\n"
        report += f"PHI iniziale: {phi_history[0]:.4f}\n"
        report += f"PHI finale:   {phi_history[-1]:.4f}\n"
        report += f"Variazione:   {phi_history[-1] - phi_history[0]:+.4f}\n\n"
        
        if phi_history[-1] < phi_history[0]:
            report += "SUCCESSO! La risonanza parametrica e' MIGLIORATA."
        else:
            report += "Il training non ha migliorato la risonanza."
        
        self.update_display(phi_history[-1])
        messagebox.showinfo("Simulazione Training", report)
    
    def run(self):
        self.window.mainloop()

if __name__ == "__main__":
    app = PhiVisualizer()
    app.run()