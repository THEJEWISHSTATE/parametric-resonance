// PHI-ENGINE.JS - Core Claude Engine per Φ-Framework

console.log("🌀 Φ-Engine loading...");

class ParametricResonanceEngine {
    constructor(visualEngine = null, audioEngine = null) {
        this.visualEngine = visualEngine;
        this.audioEngine = audioEngine;
        
        // Parametri di stato
        this.resonance = 0.5;
        this.entropy = 0;
        this.coupling = 0.3;
        
        // Nodi cognitivi (6 nodi)
        this.cognitiveNodes = [
            { id: 0, name: 'Intuition', value: 0.5, weight: 0.8, frequency: 329.63 },
            { id: 1, name: 'Emotion', value: 0.5, weight: 1.2, frequency: 277.18 },
            { id: 2, name: 'Logic', value: 0.5, weight: 0.9, frequency: 246.94 },
            { id: 3, name: 'Memory', value: 0.5, weight: 1.0, frequency: 220.00 },
            { id: 4, name: 'Ethics', value: 0.5, weight: 1.1, frequency: 196.00 },
            { id: 5, name: 'Will', value: 0.5, weight: 1.3, frequency: 164.81 }
        ];
        
        // Stati del sistema
        this.state = 'HARMONIC';
        this.coherence = 0.5;
        this.phase = 0;
        this.time = 0;
        
        // Connessioni tra nodi
        this.connections = this.generateConnections();
        
        console.log("✅ Φ-Engine initialized");
    }
    
    generateConnections() {
        const connections = [];
        
        // Crea connessioni tra tutti i nodi
        for (let i = 0; i < this.cognitiveNodes.length; i++) {
            for (let j = i + 1; j < this.cognitiveNodes.length; j++) {
                const strength = Math.random() * 0.5 + 0.5; // 0.5 - 1.0
                connections.push({
                    from: i,
                    to: j,
                    strength: strength,
                    active: true
                });
            }
        }
        
        return connections;
    }
    
    update(deltaTime) {
        this.time += deltaTime * 0.001; // Converti in secondi
        
        // Aggiorna fase
        this.phase = (this.phase + deltaTime * 0.0001) % (Math.PI * 2);
        
        // Calcola coerenza basata su resonance e coupling
        this.coherence = this.calculateCoherence();
        
        // Aggiorna stato del sistema
        this.updateSystemState();
        
        // Aggiorna valori dei nodi
        this.updateNodeValues();
        
        // Aggiorna connessioni
        this.updateConnections();
        
        // Sincronizza con engine visivo e audio
        this.syncWithEngines();
    }
    
    calculateCoherence() {
        // Coerenza è alta quando resonance è alta e entropy è bassa
        let baseCoherence = this.resonance * (1 - this.entropy * 0.5);
        
        // Aggiungi effetto coupling
        baseCoherence *= (0.7 + this.coupling * 0.3);
        
        // Aggiungi variazione sinusoidale
        const variance = Math.sin(this.time * 2) * 0.1 * this.entropy;
        
        return Math.max(0, Math.min(1, baseCoherence + variance));
    }
    
    updateSystemState() {
        const oldState = this.state;
        
        if (this.coherence < 0.3) {
            this.state = 'CHAOTIC';
        } else if (this.coherence < 0.7) {
            this.state = 'HARMONIC';
        } else {
            this.state = 'RESONANT';
        }
        
        // Se stato cambiato, trigger eventi
        if (oldState !== this.state) {
            this.onStateChange(oldState, this.state);
        }
    }
    
    onStateChange(oldState, newState) {
        console.log(`🔄 State changed: ${oldState} → ${newState}`);
        
        // Puoi aggiungere effetti speciali qui
        if (this.visualEngine) {
            // Effetto visivo per cambio stato
        }
        
        if (this.audioEngine) {
            // Modifica audio per cambio stato
        }
    }
    
    updateNodeValues() {
        const time = this.time;
        
        this.cognitiveNodes.forEach((node, index) => {
            // Valore base con oscillazione sinusoidale
            let baseValue = 0.5;
            
            // Aggiungi oscillazione basata su frequenza naturale del nodo
            const naturalFreq = node.weight * 0.1;
            baseValue += Math.sin(time * naturalFreq + index) * 0.2;
            
            // Modifica basata su resonance
            baseValue += (this.resonance - 0.5) * 0.3;
            
            // Modifica basata su entropy (rumore)
            const noise = (Math.random() - 0.5) * this.entropy * 0.5;
            
            // Modifica basata su coupling (sincronizzazione con altri nodi)
            let couplingEffect = 0;
            this.connections
                .filter(conn => conn.from === index || conn.to === index)
                .forEach(conn => {
                    const otherIndex = conn.from === index ? conn.to : conn.from;
                    const otherValue = this.cognitiveNodes[otherIndex].value;
                    couplingEffect += (otherValue - node.value) * conn.strength * this.coupling * 0.1;
                });
            
            // Calcola valore finale
            node.value = Math.max(0, Math.min(1, 
                baseValue + noise + couplingEffect
            ));
        });
    }
    
    updateConnections() {
        // Aggiorna forza delle connessioni basata su coupling e resonance
        this.connections.forEach(conn => {
            // Connessioni più forti con alto coupling
            conn.active = Math.random() < (0.3 + this.coupling * 0.7);
            
            // Modifica forza basata su resonance
            conn.strength = Math.max(0.1, Math.min(1, 
                conn.strength + (Math.random() - 0.5) * 0.1 * this.resonance
            ));
        });
    }
    
    syncWithEngines() {
        // Sincronizza con visual engine
        if (this.visualEngine) {
            this.visualEngine.updateParameters(
                this.resonance,
                this.entropy,
                this.coupling
            );
        }
        
        // Sincronizza con audio engine
        if (this.audioEngine && this.audioEngine.isEnabled) {
            this.audioEngine.updateParameters(
                this.resonance,
                this.entropy,
                this.coupling
            );
        }
    }
    
    getNodeValues() {
        return this.cognitiveNodes.map(node => node.value);
    }
    
    getSystemMetrics() {
        return {
            state: this.state,
            coherence: this.coherence,
            resonance: this.resonance,
            entropy: this.entropy,
            coupling: this.coupling,
            phase: this.phase,
            nodeSync: this.calculateNodeSync()
        };
    }
    
    calculateNodeSync() {
        // Calcola quanto i nodi sono sincronizzati
        const values = this.cognitiveNodes.map(node => node.value);
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        
        // Deviazione standard normalizzata
        const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
        const sync = 1 - Math.sqrt(variance);
        
        return Math.max(0, Math.min(1, sync));
    }
    
    setParameters(resonance, entropy, coupling) {
        this.resonance = Math.max(0, Math.min(1, resonance));
        this.entropy = Math.max(0, Math.min(1, entropy));
        this.coupling = Math.max(0, Math.min(1, coupling));
        
        // Trigger update immediato
        this.update(16); // ~60fps
    }
    
    loadScenario(scenarioName) {
        console.log(`📂 Loading scenario: ${scenarioName}`);
        
        switch(scenarioName.toLowerCase()) {
            case 'harmonic':
                this.setParameters(0.75, 0.1, 0.6);
                break;
                
            case 'chaotic':
                this.setParameters(0.25, 0.8, 0.4);
                break;
                
            case 'resonant':
                this.setParameters(0.9, 0.05, 0.8);
                break;
                
            default:
                this.setParameters(0.5, 0, 0.3);
        }
        
        return this.getSystemMetrics();
    }
    
    triggerPhaseShift() {
        console.log("⚡ Triggering phase shift...");
        
        // Inverte temporaneamente i parametri
        const oldResonance = this.resonance;
        const oldEntropy = this.entropy;
        
        this.resonance = 1 - oldResonance;
        this.entropy = 1 - oldEntropy;
        
        // Dopo 500ms, ritorna ma con valori leggermente modificati
        setTimeout(() => {
            this.resonance = oldResonance * 0.8 + 0.2;
            this.entropy = oldEntropy * 0.5;
            this.coupling = Math.min(1, this.coupling * 1.2);
        }, 500);
        
        return { phaseShift: true, timestamp: Date.now() };
    }
}

// Esporta per uso globale
window.PhiEngine = ParametricResonanceEngine;

console.log("🌀 Φ-Engine loaded");
