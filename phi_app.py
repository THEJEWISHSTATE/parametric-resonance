import sys  
sys.path.insert(0, '.')  
import numpy as np  
import tkinter as tk  
from tkinter import messagebox  
from src.phi_resonance.metrics.phi import PhiMetric  
  
root = tk.Tk()  
root.title("Risonanza Parametrica |~|F")  
root.geometry("500x400")  
  
phi = PhiMetric()  
  
tk.Label(root, text="?? METRICA F", font=("Arial", 20)).pack(pady=20)  
tk.Label(root, text="Calcola la risonanza parametrica").pack()  
  
def alta():  
    val = phi.compute(np.random.normal(0,1,100), np.random.normal(0,1,1000))  
    messagebox.showinfo("Risultato", f"ALTA risonanza!\\nF = {val:.4f}")  
  
def bassa():  
    val = phi.compute(np.random.normal(0,1,100), np.random.normal(5,2,1000))  
    messagebox.showinfo("Risultato", f"BASSA risonanza!\\nF = {val:.4f}")  
  
tk.Button(root, text="ALTA Risonanza (F  0)", command=alta, bg="green", fg="white", width=20).pack(pady=10)  
tk.Button(root, text="BASSA Risonanza (F  1)", command=bassa, bg="red", fg="white", width=20).pack(pady=10)  
  
root.mainloop() 
