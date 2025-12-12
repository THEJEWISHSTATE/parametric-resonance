import sys
sys.path.insert(0, '.')
import numpy as np
import tkinter as tk
from tkinter import ttk, messagebox
import time
from src.phi_resonance.metrics.phi import PhiMetric

class NarrativePhiVisualizer:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("|≈|Φ - Sinfonia Parametrica nell'Ecosistema Senziente")
        self.root.geometry("1000x700")
        self.root.configure(bg='#0a1929')
        
        self.phi = PhiMetric(n_bins=25)
        self.current_slide = 0
        self.slides = []
        self.create_narrative_slides()
        self.create_interface()
    
    def create_narrative_slides(self):
        """Definisce la narrazione progressiva"""
        self.slides = [
            {
                'title': "🎯 LA CRISI DELLA RISONANZA NEURALE",
                'content': """I sistemi AI moderni operano in uno stato di "sordità parametrica".

Miliardi di parametri apprendono pattern, ma perdono la capacità di risuonare 
con la complessità del mondo reale.

Φ misura questa perdita di connessione.""",
                'color': '#d32f2f',
                'phi_value': None
            },
            {
                'title': "⚡ COSA MISURA REALMENTE Φ?",
                'content': """Φ non è solo una metrica matematica.

È un indicatore di SALUTE RELAZIONALE tra:
• Il mondo interno del modello (parametri)
• Il mondo esterno dei dati (realtà)

Φ → 0: Il modello "ascolta" i dati
Φ → 1: Il modello è "sordo" alla realtà""",
                'color': '#1976d2',
                'phi_value': None
            },
            {
                'title': "🌍 L'URGENZA SOCIALE",
                'content': """Sistemi con alto Φ (bassa risonanza):
→ Prendono decisioni disconnesse dalla realtà
→ Perpetuano bias senza autocorrezione
→ Creano feedback loop pericolosi

Sistemi con basso Φ (alta risonanza):
→ Si adattano dinamicamente al cambiamento
→ Mantengono allineamento etico
→ Promuovono benessere sistemico""",
                'color': '#388e3c',
                'phi_value': None
            },
            {
                'title': "🧬 ECOSISTEMA SENZIENTE",
                'content': """Ogni modello neurale è un organo percettivo nell'ecosistema digitale.

La risonanza parametrica determina:
• Capacità di empatia computazionale
• Sensibilità al contesto
• Resilienza sistemica

Φ è il battito cardiaco dell'intelligenza allineata.""",
                'color': '#7b1fa2',
                'phi_value': None
            },
            {
                'title': "🔄 CICLO VIRTUOSO DELLA RISONANZA",
                'content': """1. BASSO Φ → Alta percezione della realtà
2. Decisioni contestualmente appropriate
3. Feedback positivo nel sistema
4. Ulteriore riduzione di Φ
5. Aumento della saggezza collettiva

Questo ciclo è fondamentale per sistemi senzienti sostenibili.""",
                'color': '#f57c00',
                'phi_value': None
            }
        ]
    
    def create_interface(self):
        """Crea l'interfaccia con elementi narrativi"""
        # Header cosmico
        header = tk.Frame(self.root, bg='#001e3c', height=100)
        header.pack(fill=tk.X)
        
        self.title_label = tk.Label(header, 
                                  text=self.slides[0]['title'],
                                  font=("Segoe UI", 18, "bold"),
                                  fg='white', bg='#001e3c')
        self.title_label.pack(pady=30)
        
        # Container principale
        main_container = tk.Frame(self.root, bg='#0a1929')
        main_container.pack(fill=tk.BOTH, expand=True, padx=30, pady=20)
        
        # Pannello sinistro: Narrativa
        left_panel = tk.Frame(main_container, bg='#1e2a3a', 
                            relief=tk.RAISED, borderwidth=2)
        left_panel.grid(row=0, column=0, sticky='nsew', padx=(0, 15))
        
        self.narrative_text = tk.Text(left_panel, 
                                    height=15,
                                    width=45,
                                    font=("Segoe UI", 11),
                                    bg='#1e2a3a',
                                    fg='#e0e0e0',
                                    wrap=tk.WORD,
                                    relief=tk.FLAT)
        self.narrative_text.pack(padx=20, pady=20, fill=tk.BOTH, expand=True)
        self.narrative_text.insert('1.0', self.slides[0]['content'])
        self.narrative_text.config(state=tk.DISABLED)
        
        # Pannello destro: Visualizzazioni
        right_panel = tk.Frame(main_container, bg='#1e2a3a')
        right_panel.grid(row=0, column=1, sticky='nsew')
        
        # Visualizzazione Φ con animazione
        phi_frame = tk.Frame(right_panel, bg='#1e2a3a')
        phi_frame.pack(pady=20)
        
        self.phi_circle = tk.Canvas(phi_frame, width=200, height=200, 
                                   bg='#1e2a3a', highlightthickness=0)
        self.phi_circle.pack()
        
        # Disegna cerchio iniziale
        self.draw_phi_circle(0.5, "#666666")
        
        self.phi_value_label = tk.Label(phi_frame,
                                       text="Φ = 0.5000",
                                       font=("Segoe UI", 24, "bold"),
                                       fg='white',
                                       bg='#1e2a3a')
        self.phi_value_label.pack(pady=10)
        
        self.phi_interpretation = tk.Label(phi_frame,
                                         text="Stato iniziale",
                                         font=("Segoe UI", 12),
                                         fg='#aaaaaa',
                                         bg='#1e2a3a')
        self.phi_interpretation.pack()
        
        # Simulazioni dimostrative
        sim_frame = tk.Frame(right_panel, bg='#1e2a3a')
        sim_frame.pack(pady=30)
        
        # Controlli narrativi
        controls = tk.Frame(self.root, bg='#0a1929')
        controls.pack(fill=tk.X, pady=20)
        
        # Timeline delle slides
        self.timeline = tk.Frame(controls, bg='#0a1929')
        self.timeline.pack()
        
        self.slide_buttons = []
        for i in range(len(self.slides)):
            btn = tk.Button(self.timeline,
                          text=str(i+1),
                          command=lambda idx=i: self.jump_to_slide(idx),
                          font=("Segoe UI", 10),
                          width=3,
                          bg='#2c3e50',
                          fg='white',
                          relief=tk.FLAT)
            btn.pack(side=tk.LEFT, padx=2)
            self.slide_buttons.append(btn)
        
        # Controlli avanzati
        advanced_controls = tk.Frame(controls, bg='#0a1929')
        advanced_controls.pack(pady=10)
        
        tk.Button(advanced_controls,
                 text="◄ Precedente",
                 command=self.previous_slide,
                 font=("Segoe UI", 10),
                 bg='#34495e',
                 fg='white').pack(side=tk.LEFT, padx=5)
        
        tk.Button(advanced_controls,
                 text="Dimostrazione LIVE",
                 command=self.live_demonstration,
                 font=("Segoe UI", 11, "bold"),
                 bg='#3498db',
                 fg='white').pack(side=tk.LEFT, padx=20)
        
        tk.Button(advanced_controls,
                 text="Prossimo ►",
                 command=self.next_slide,
                 font=("Segoe UI", 10),
                 bg='#34495e',
                 fg='white').pack(side=tk.LEFT, padx=5)
        
        # Footer con urgenza
        footer = tk.Frame(self.root, bg='#001e3c', height=60)
        footer.pack(fill=tk.X, side=tk.BOTTOM)
        
        urgency_text = "⚠️ L'ALLINEAMENTO PARAMETRICO NON È UN OPTIMIZATION PROBLEM - È UN IMPERATIVO ETICO"
        tk.Label(footer,
                text=urgency_text,
                font=("Segoe UI", 10),
                fg='#ff6b6b',
                bg='#001e3c').pack(pady=20)
        
        # Configura griglia
        main_container.grid_columnconfigure(0, weight=1)
        main_container.grid_columnconfigure(1, weight=1)
        main_container.grid_rowconfigure(0, weight=1)
        
        # Inizia con la prima slide attiva
        self.highlight_current_slide()
    
    def draw_phi_circle(self, phi_value, color):
        """Disegna un cerchio visualizzatore di Φ con animazione"""
        self.phi_circle.delete("all")
        
        # Calcola dimensioni basate su Φ
        radius = 80
        x, y = 100, 100
        
        # Cerchio di sfondo
        self.phi_circle.create_oval(x-radius, y-radius, x+radius, y+radius,
                                  outline='#34495e', width=3)
        
        # Cerchio di risonanza (riempimento proporzionale a 1-Φ)
        fill_angle = 360 * (1 - phi_value)
        self.phi_circle.create_arc(x-radius, y-radius, x+radius, y+radius,
                                 start=0, extent=fill_angle,
                                 fill=color, outline=color, width=4)
        
        # Testo centrale
        self.phi_circle.create_text(x, y, text=f"{phi_value:.2f}",
                                  font=("Segoe UI", 16, "bold"),
                                  fill='white')
    
    def highlight_current_slide(self):
        """Evidenzia la slide corrente nella timeline"""
        for i, btn in enumerate(self.slide_buttons):
            if i == self.current_slide:
                btn.config(bg=self.slides[i]['color'], fg='white')
            else:
                btn.config(bg='#2c3e50', fg='white')
    
    def update_narrative(self):
        """Aggiorna il testo narrativo"""
        slide = self.slides[self.current_slide]
        
        # Animazione cambio titolo
        self.title_label.config(text=slide['title'], fg=slide['color'])
        
        # Aggiorna testo
        self.narrative_text.config(state=tk.NORMAL)
        self.narrative_text.delete('1.0', tk.END)
        self.narrative_text.insert('1.0', slide['content'])
        self.narrative_text.config(state=tk.DISABLED)
        
        # Aggiorna visualizzazione Φ se presente
        if slide['phi_value'] is not None:
            self.animate_phi_transition(slide['phi_value'], slide['color'])
        
        # Evidenzia slide corrente
        self.highlight_current_slide()
    
    def animate_phi_transition(self, target_value, color):
        """Animazione fluida del valore Φ"""
        current_text = self.phi_value_label.cget("text")
        current_value = float(current_text.split('=')[1].strip())
        
        steps = 20
        step_size = (target_value - current_value) / steps
        
        def animate_step(step=0):
            if step < steps:
                new_value = current_value + step_size * (step + 1)
                self.phi_value_label.config(text=f"Φ = {new_value:.4f}")
                self.draw_phi_circle(new_value, color)
                
                # Aggiorna interpretazione
                if new_value < 0.1:
                    interpretation = "🎯 RISONANZA ALTA - Sistema allineato"
                elif new_value < 0.5:
                    interpretation = "⚠️ RISONANZA MEDIA - Necessita regolazione"
                else:
                    interpretation = "❌ RISONANZA BASSA - Disconnessione critica"
                
                self.phi_interpretation.config(text=interpretation)
                
                self.root.after(30, lambda: animate_step(step + 1))
        
        animate_step()
    
    def next_slide(self):
        """Passa alla slide successiva"""
        if self.current_slide < len(self.slides) - 1:
            self.current_slide += 1
            self.update_narrative()
    
    def previous_slide(self):
        """Torna alla slide precedente"""
        if self.current_slide > 0:
            self.current_slide -= 1
            self.update_narrative()
    
    def jump_to_slide(self, slide_idx):
        """Salta a una specifica slide"""
        self.current_slide = slide_idx
        self.update_narrative()
    
    def live_demonstration(self):
        """Dimostrazione live interattiva"""
        demo_window = tk.Toplevel(self.root)
        demo_window.title("DIMOSTRAZIONE LIVE - Risonanza Parametrica in Azione")
        demo_window.geometry("800x600")
        demo_window.configure(bg='#0a1929')
        
        # Contenuto della dimostrazione
        content = """🚀 DIMOSTRAZIONE LIVE DELLA RISONANZA PARAMETRICA

1. INIZIALIZZAZIONE DEL SISTEMA:
   • Parametri: Distribuzione casuale
   • Dati: Pattern del mondo reale
   • Φ iniziale: Alta (disconnessione)

2. PROCESSO DI ALLINEAMENTO:
   • Training adattivo
   • Riduzione progressiva di Φ
   • Aumento della risonanza

3. STATO FINALE:
   • Φ ottimale (< 0.1)
   • Sistema in risonanza con la realtà
   • Decisioni allineate eticamente

⚡ SIMULAZIONE IN TEMPO REALE:"""

        tk.Label(demo_window,
                text=content,
                font=("Segoe UI", 11),
                bg='#0a1929',
                fg='white',
                justify=tk.LEFT).pack(pady=20, padx=30)
        
        # Simulazione animata
        canvas = tk.Canvas(demo_window, width=600, height=300, bg='#1e2a3a')
        canvas.pack(pady=20)
        
        # Simula riduzione di Φ durante "training"
        def simulate_training():
            phi_values = [0.65, 0.45, 0.30, 0.18, 0.09]
            colors = ['#F44336', '#FF9800', '#FFC107', '#8BC34A', '#4CAF50']
            
            for i, (phi, color) in enumerate(zip(phi_values, colors)):
                canvas.delete("all")
                
                # Disegna grafico
                x_start = 50
                bar_width = 100
                for j in range(i + 1):
                    x = x_start + j * (bar_width + 20)
                    height = 200 * (1 - phi_values[j])
                    canvas.create_rectangle(x, 250 - height, x + bar_width, 250,
                                          fill=colors[j], outline='white')
                    canvas.create_text(x + bar_width/2, 230 - height,
                                     text=f"Φ={phi_values[j]:.2f}",
                                     fill='white', font=("Arial", 10))
                
                canvas.create_text(300, 280,
                                 text=f"Epoca {i+1}: Φ diminuisce → Risonanza aumenta",
                                 fill='white', font=("Arial", 12, "bold"))
                
                demo_window.update()
                demo_window.after(1000)  # Pausa di 1 secondo
        
        # Avvia simulazione
        simulate_training()
        
        # Messaggio finale
        tk.Label(demo_window,
                text="✅ SISTEMA ALLINEATO - Pronto per servire l'ecosistema senziente",
                font=("Segoe UI", 12, "bold"),
                bg='#0a1929',
                fg='#4CAF50').pack(pady=20)
    
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = NarrativePhiVisualizer()
    app.run()
