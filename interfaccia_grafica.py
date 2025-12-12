import sys 
sys.path.insert(0, '.') 
import numpy as np 
import tkinter as tk 
from tkinter import ttk, messagebox 
import matplotlib.pyplot as plt 
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg 
from src.phi_resonance.metrics.phi import PhiMetric 
 
class PhiVisualizer: 
    def __init__(self, root): 
        self.root = root 
        self.root.title("Visualizzatore Risonanza Parametrica |~|F") 
        self.root.geometry("900x700") 
 
        self.phi_metric = PhiMetric(n_bins=20) 
        self.setup_ui() 
 
    def setup_ui(self): 
        # Titolo 
        title_label = tk.Label(self.root, text="?? VISUALIZZATORE RISONANZA PARAMETRICA |~|F", 
                             font=("Arial", 16, "bold"), fg="blue") 
        title_label.pack(pady=10) 
 
        # Frame per i controlli 
        control_frame = tk.Frame(self.root) 
        control_frame.pack(pady=10) 
 
        # Pulsanti demo 
        tk.Label(control_frame, text="Dimostrazioni rapide:").grid(row=0, column=0, padx=5) 
 
        tk.Button(control_frame, text="1. Distribuzioni SIMILI", 
               command=self.demo_simili, bg="lightgreen", width=20).grid(row=1, column=0, padx=5, pady=5) 
 
        tk.Button(control_frame, text="2. Distribuzioni DIVERSE", 
               command=self.demo_diverse, bg="lightcoral", width=20).grid(row=1, column=1, padx=5, pady=5) 
 
        tk.Button(control_frame, text="3. Simula TRAINING", 
               command=self.demo_training, bg="lightblue", width=20).grid(row=1, column=2, padx=5, pady=5) 
 
        # Frame per i grafici 
        self.graph_frame = tk.Frame(self.root) 
        self.graph_frame.pack(pady=20, fill=tk.BOTH, expand=True) 
 
        # Frame per i risultati 
        self.result_frame = tk.Frame(self.root) 
        self.result_frame.pack(pady=10) 
 
        self.result_label = tk.Label(self.result_frame, text="F = ---", 
                                font=("Arial", 24, "bold"), fg="darkred") 
        self.result_label.pack() 
 
        self.interpret_label = tk.Label(self.result_frame, text="", 
                                     font=("Arial", 14)) 
        self.interpret_label.pack(pady=5) 
 
        # Spiegazione 
        explain_frame = tk.Frame(self.root) 
        explain_frame.pack(pady=10) 
 
 
        tk.Label(explain_frame, text=explanation, justify=tk.LEFT, 
               font=("Arial", 10), bg="lightyellow", padx=10, pady=10).pack() 
 
    def clear_graphs(self): 
        for widget in self.graph_frame.winfo_children(): 
            widget.destroy() 
 
    def plot_distributions(self, params, data, phi_value): 
        self.clear_graphs() 
 
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4)) 
 
        # Grafico distribuzioni 
        ax1.hist(params, alpha=0.7, label="Parametri", bins=20, color="blue") 
        ax1.hist(data, alpha=0.7, label="Dati", bins=20, color="green") 
        ax1.set_xlabel("Valore") 
        ax1.set_ylabel("Frequenza") 
        ax1.set_title("Distribuzioni a confronto") 
        ax1.legend() 
        ax1.grid(True, alpha=0.3) 
 
        # Grafico barra F 
        colors = ["green", "lightgreen", "yellow", "orange", "red"] 
        ax2.barh(["Risonanza"], [phi_value], color=colors[min(int(phi_value * 5), 4)]) 
        ax2.set_xlim(0, 1) 
        ax2.set_xlabel("Valore F") 
        ax2.set_title(f"Metrica F = {phi_value:.3f}") 
        ax2.axvline(x=0.1, color="green", linestyle="--", alpha=0.5) 
        ax2.axvline(x=0.5, color="red", linestyle="--", alpha=0.5) 
 
        canvas = FigureCanvasTkAgg(fig, self.graph_frame) 
        canvas.draw() 
        canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True) 
