// CONTROLS.JS - Gestione UI unificata e sincronizzazione bidirezionale

console.log("🎛️ Controls system loading...");

class UnifiedControls {
    constructor(visualEngine = null, audioEngine = null) {
        this.visualEngine = visualEngine;
        this.audioEngine = audioEngine;
        
        // Riferimenti agli elementi UI
        this.uiElements = this.cacheUIElements();
        
        // Stato iniziale
        this.isClaudePanelVisible = true;
        
        // Inizializza
        this.init();
        
        console.log("✅ Controls system initialized");
    }
    
    cacheUIElements() {
        return {
            // Tua UI - Parametri
            alphaInput: document.getElementById('alphaParam'),
            betaInput: document.getElementById('betaParam'),
            gammaInput: document.getElementById('gammaParam'),
            deltaInput: document.getElementById('deltaParam'),
            
            // Tua UI - Valori display
            alphaValue: document.getElementById('alphaValue'),
            betaValue: document.getElementById('betaValue'),
            gammaValue: document.getElementById('gammaValue'),
            deltaValue: document.getElementById('deltaValue'),
            
            // Tua UI - Volition sliders
            volitionSliders: [
                document.getElementById('volitionSlider0'),
                document.getElementById('volitionSlider1'),
                document.getElementById('volitionSlider2')
            ],
            volitionValues: [
                document.getElementById('volitionValue0'),
                document.getElementById('volitionValue1'),
                document.getElementById('volitionValue2')
            ],
            
            // Tua UI - Pulsanti
            resetBtn: document.getElementById('resetBtn'),
            randomizeBtn: document.getElementById('randomizeBtn'),
            saveBtn: document.getElementById('saveBtn'),
            
            // Claude UI - Sliders
            resonanceSlider: document.getElementById('resonanceSlider'),
            entropySlider: document.getElementById('entropySlider'),
            couplingSlider: document.getElementById('couplingSlider'),
            
            // Claude UI - Valori display
            resonanceValue: document.getElementById('resonanceValue'),
            entropyValue: document.getElementById('entropyValue'),
            couplingValue: document.getElementById('couplingValue'),
            
            // Claude UI - Pulsanti scenari
            harmonicBtn: document.getElementById('harmonicBtn'),
            chaoticBtn: document.getElementById('chaoticBtn'),
            phaseShiftBtn: document.getElementById('phaseShiftBtn'),
            audioToggleBtn: document.getElementById('audioToggleBtn'),
            toggleClaudePanel: document.getElementById('toggleClaudePanel'),
            
            // Display metriche
            coherenceDisplay: document.getElementById('coherenceDisplay'),
            stateDisplay: document.getElementById('stateDisplay'),
            syncDisplay: document.getElementById('syncDisplay'),
            
            // Audio
            audioIndicator: document.getElementById('audioIndicator'),
            audioStatus: document.querySelector('.audio-status'),
            
            // Φ Meter
            phiLabel: document.getElementById('phiLabel'),
            phiValueBar: document.getElementById('phiValueBar'),
            
            // Nodi
            nodesContainer: document.getElementById('nodesContainer')
        };
    }
    
    init() {
        // Setup event listeners
        this.setupEventListeners();
        
        // Inizializza display
        this.updateAllDisplays();
        
        // Carica stato salvato se esiste
        this.loadSavedState();
    }
    
    setupEventListeners() {
        const el = this.uiElements;
        
        // === TUA UI → CLAUDE UI ===
        
        // Parametri α, β, γ, δ
        [el.alphaInput, el.betaInput, el.gammaInput, el.deltaInput].forEach((input, index) => {
            if (input) {
                input.addEventListener('input', (e) => {
                    this.onLegacyParamChange();
                });
            }
        });
        
        // Volition sliders
        el.volitionSliders.forEach((slider, index) => {
            if (slider) {
                slider.addEventListener('input', (e) => {
                    if (el.volitionValues[index]) {
                        el.volitionValues[index].textContent = parseFloat(e.target.value).toFixed(2);
                    }
                    this.onVolitionChange(index, parseFloat(e.target.value));
                });
            }
        });
        
        // Pulsanti tua UI
        if (el.resetBtn) {
            el.resetBtn.addEventListener('click', () => this.onReset());
        }
        
        if (el.randomizeBtn) {
            el.randomizeBtn.addEventListener('click', () => this.onRandomize());
        }
        
        if (el.saveBtn) {
            el.saveBtn.addEventListener('click', () => this.onSave());
        }
        
        // === CLAUDE UI → TUA UI ===
        
        // Resonance, Entropy, Coupling sliders
        if (el.resonanceSlider) {
            el.resonanceSlider.addEventListener('input', (e) => {
                this.onClaudeParamChange('resonance', parseFloat(e.target.value) / 100);
            });
        }
        
        if (el.entropySlider) {
            el.entropySlider.addEventListener('input', (e) => {
                this.onClaudeParamChange('entropy', parseFloat(e.target.value) / 100);
            });
        }
        
        if (el.couplingSlider) {
            el.couplingSlider.addEventListener('input', (e) => {
                this.onClaudeParamChange('coupling', parseFloat(e.target.value) / 100);
            });
        }
        
        // Pulsanti scenari Claude
        if (el.harmonicBtn) {
            el.harmonicBtn.addEventListener('click', () => this.onScenario('harmonic'));
        }
        
        if (el.chaoticBtn) {
            el.chaoticBtn.addEventListener('click', () => this.onScenario('chaotic'));
        }
        
        if (el.phaseShiftBtn) {
            el.phaseShiftBtn.addEventListener('click', () => this.onPhaseShift());
        }
        
        if (el.audioToggleBtn) {
            el.audioToggleBtn.addEventListener('click', () => this.onAudioToggle());
        }
        
        if (el.toggleClaudePanel) {
            el.toggleClaudePanel.addEventListener('click', () => this.toggleClaudePanel());
        }
        
        if (el.audioIndicator) {
            el.audioIndicator.addEventListener('click', () => this.onAudioToggle());
        }
    }
    
    // === MAPPE DI CONVERSIONE ===
    
    // Tua UI → Claude UI
    mapToClaude(alpha, beta, gamma, delta) {
        // α (0-5) → Resonance (0-1)
        const resonance = (alpha / 5);
        
        // δ (0-5) → Entropy (0-1)
        const entropy = (delta * 0.2); // δ/5
        
        // γ (0-5) → Coupling (0-1)
        const coupling = (gamma * 0.2); // γ/5
        
        return {
            resonance: Math.max(0, Math.min(1, resonance)),
            entropy: Math.max(0, Math.min(1, entropy)),
            coupling: Math.max(0, Math.min(1, coupling))
        };
    }
    
    // Claude UI → Tua UI
    mapFromClaude(resonance, entropy, coupling) {
        // Resonance (0-1) → α (0-5)
        const alpha = (resonance * 5);
        
        // Entropy (0-1) → δ (0-5)
        const delta = (entropy * 5);
        
        // Coupling (0-1) → γ (0-5)
        const gamma = (coupling * 5);
        
        return {
            alpha: Math.max(0, Math.min(5, alpha)),
            delta: Math.max(0, Math.min(5, delta)),
            gamma: Math.max(0, Math.min(5, gamma))
        };
    }
    
    // === HANDLERS EVENTI ===
    
    onLegacyParamChange() {
        const el = this.uiElements;
        
        // Leggi valori dalla tua UI
        const alpha = parseFloat(el.alphaInput?.value) || 2.5;
        const beta = parseFloat(el.betaInput?.value) || 1.5;
        const gamma = parseFloat(el.gammaInput?.value) || 2.0;
        const delta = parseFloat(el.deltaInput?.value) || 0.2;
        
        // Aggiorna display valori
        if (el.alphaValue) el.alphaValue.textContent = alpha.toFixed(1);
        if (el.betaValue) el.betaValue.textContent = beta.toFixed(1);
        if (el.gammaValue) el.gammaValue.textContent = gamma.toFixed(1);
        if (el.deltaValue) el.deltaValue.textContent = delta.toFixed(1);
        
        // Converti a parametri Claude
        const claudeParams = this.mapToClaude(alpha, beta, gamma, delta);
        
        // Aggiorna sliders Claude
        if (el.resonanceSlider) {
            el.resonanceSlider.value = Math.round(claudeParams.resonance * 100);
        }
        if (el.entropySlider) {
            el.entropySlider.value = Math.round(claudeParams.entropy * 100);
        }
        if (el.couplingSlider) {
            el.couplingSlider.value = Math.round(claudeParams.coupling * 100);
        }
        
        // Aggiorna display Claude
        this.updateClaudeDisplays();
        
        // Aggiorna Φ meter
        this.updatePhiMeter();
        
        // Notifica engine
        this.notifyEngines();
    }
    
    onClaudeParamChange(param, value) {
        const el = this.uiElements;
        
        // Aggiorna display Claude
        if (param === 'resonance' && el.resonanceValue) {
            el.resonanceValue.textContent = Math.round(value * 100) + '%';
        } else if (param === 'entropy' && el.entropyValue) {
            el.entropyValue.textContent = Math.round(value * 100) + '%';
        } else if (param === 'coupling' && el.couplingValue) {
            el.couplingValue.textContent = Math.round(value * 100) + '%';
        }
        
        // Converti a parametri tua UI
        const legacyParams = this.mapFromClaude(
            param === 'resonance' ? value : parseFloat(el.resonanceSlider?.value || 50) / 100,
            param === 'entropy' ? value : parseFloat(el.entropySlider?.value || 0) / 100,
            param === 'coupling' ? value : parseFloat(el.couplingSlider?.value || 30) / 100
        );
        
        // Aggiorna tua UI
        if (el.alphaInput) {
            el.alphaInput.value = legacyParams.alpha.toFixed(1);
        }
        if (el.deltaInput) {
            el.deltaInput.value = legacyParams.delta.toFixed(1);
        }
        if (el.gammaInput) {
            el.gammaInput.value = legacyParams.gamma.toFixed(1);
        }
        
        // Aggiorna display tua UI
        if (el.alphaValue) el.alphaValue.textContent = legacyParams.alpha.toFixed(1);
        if (el.deltaValue) el.deltaValue.textContent = legacyParams.delta.toFixed(1);
        if (el.gammaValue) el.gammaValue.textContent = legacyParams.gamma.toFixed(1);
        
        // Aggiorna Φ meter
        this.updatePhiMeter();
        
        // Notifica engine
        this.notifyEngines();
    }
    
    onVolitionChange(index, value) {
        // Aggiorna visualizzazione basata su volition
        this.updateNodesVisualization();
        
        // Notifica engine
        if (this.visualEngine) {
            // Puoi passare i valori volition al visual engine
        }
    }
    
    onScenario(scenario) {
        console.log(`🎯 Loading scenario: ${scenario}`);
        
        const el = this.uiElements;
        
        switch(scenario.toLowerCase()) {
            case 'harmonic':
                // Resonance alta, entropy bassa, coupling medio-alto
                if (el.resonanceSlider) el.resonanceSlider.value = 75;
                if (el.entropySlider) el.entropySlider.value = 10;
                if (el.couplingSlider) el.couplingSlider.value = 60;
                break;
                
            case 'chaotic':
                // Resonance bassa, entropy alta, coupling medio
                if (el.resonanceSlider) el.resonanceSlider.value = 25;
                if (el.entropySlider) el.entropySlider.value = 80;
                if (el.couplingSlider) el.couplingSlider.value = 40;
                break;
                
            default:
                if (el.resonanceSlider) el.resonanceSlider.value = 50;
                if (el.entropySlider) el.entropySlider.value = 0;
                if (el.couplingSlider) el.couplingSlider.value = 30;
        }
        
        // Trigger update
        if (el.resonanceSlider) el.resonanceSlider.dispatchEvent(new Event('input'));
        if (el.entropySlider) el.entropySlider.dispatchEvent(new Event('input'));
        if (el.couplingSlider) el.couplingSlider.dispatchEvent(new Event('input'));
        
        // Update state display
        this.updateSystemState();
    }
    
    onPhaseShift() {
        console.log("⚡ Phase shift triggered");
        
        const el = this.uiElements;
        
        // Effetto visivo
        if (el.stateDisplay) {
            el.stateDisplay.textContent = "PHASE SHIFT";
            el.stateDisplay.className = "state-turbulent";
            
            setTimeout(() => {
                this.updateSystemState();
            }, 1000);
        }
        
        // Inverte temporaneamente resonance e entropy
        if (el.resonanceSlider && el.entropySlider) {
            const tempResonance = el.resonanceSlider.value;
            const tempEntropy = el.entropySlider.value;
            
            el.resonanceSlider.value = tempEntropy;
            el.entropySlider.value = tempResonance;
            
            // Trigger update
            el.resonanceSlider.dispatchEvent(new Event('input'));
            el.entropySlider.dispatchEvent(new Event('input'));
            
            // Dopo 500ms, ritorna a valori normali ma modificati
            setTimeout(() => {
                el.resonanceSlider.value = Math.min(100, parseInt(tempResonance) * 1.2);
                el.entropySlider.value = Math.max(0, parseInt(tempEntropy) * 0.8);
                
                el.resonanceSlider.dispatchEvent(new Event('input'));
                el.entropySlider.dispatchEvent(new Event('input'));
            }, 500);
        }
    }
    
    onAudioToggle() {
        const el = this.uiElements;
        
        if (el.audioStatus) {
            const isOn = el.audioStatus.textContent === 'ON';
            el.audioStatus.textContent = isOn ? 'OFF' : 'ON';
            
            if (el.audioIndicator) {
                el.audioIndicator.style.background = isOn 
                    ? 'rgba(255, 107, 107, 0.9)' 
                    : 'rgba(10, 10, 26, 0.9)';
            }
            
            // Notifica audio engine se presente
            if (this.audioEngine) {
                if (isOn) {
                    this.audioEngine.stopAudio();
                } else {
                    this.audioEngine.startAudio();
                }
            }
            
            console.log(`🔊 Audio ${isOn ? 'disabled' : 'enabled'}`);
        }
    }
    
    onReset() {
        console.log("🔄 Resetting system to defaults");
        
        const el = this.uiElements;
        
        // Reset tua UI
        if (el.alphaInput) el.alphaInput.value = 2.5;
        if (el.betaInput) el.betaInput.value = 1.5;
        if (el.gammaInput) el.gammaInput.value = 2.0;
        if (el.deltaInput) el.deltaInput.value = 0.2;
        
        // Reset volition
        el.volitionSliders.forEach((slider, index) => {
            if (slider) slider.value = 0.5;
        });
        
        // Trigger update
        if (el.alphaInput) el.alphaInput.dispatchEvent(new Event('input'));
    }
    
    onRandomize() {
        console.log("🎲 Randomizing system");
        
        const el = this.uiElements;
        
        // Randomizza tua UI
        if (el.alphaInput) el.alphaInput.value = (Math.random() * 5).toFixed(1);
        if (el.betaInput) el.betaInput.value = (Math.random() * 5).toFixed(1);
        if (el.gammaInput) el.gammaInput.value = (Math.random() * 5).toFixed(1);
        if (el.deltaInput) el.deltaInput.value = (Math.random() * 5).toFixed(1);
        
        // Randomizza volition
        el.volitionSliders.forEach((slider, index) => {
            if (slider) slider.value = Math.random().toFixed(2);
        });
        
        // Trigger update
        if (el.alphaInput) el.alphaInput.dispatchEvent(new Event('input'));
    }
    
    onSave() {
        const state = this.getSystemState();
        localStorage.setItem('phiFrameworkState', JSON.stringify(state));
        
        console.log("💾 System state saved:", state);
        alert(`System state saved at ${new Date().toLocaleTimeString()}`);
    }
    
    // === FUNZIONI DI UTILITÀ ===
    
    updateAllDisplays() {
        this.updateClaudeDisplays();
        this.updateLegacyDisplays();
        this.updatePhiMeter();
        this.updateSystemState();
        this.updateNodesVisualization();
    }
    
    updateClaudeDisplays() {
        const el = this.uiElements;
        
        if (el.resonanceValue && el.resonanceSlider) {
            el.resonanceValue.textContent = el.resonanceSlider.value + '%';
        }
        if (el.entropyValue && el.entropySlider) {
            el.entropyValue.textContent = el.entropySlider.value + '%';
        }
        if (el.couplingValue && el.couplingSlider) {
            el.couplingValue.textContent = el.couplingSlider.value + '%';
        }
    }
    
    updateLegacyDisplays() {
        const el = this.uiElements;
        
        if (el.alphaValue && el.alphaInput) {
            el.alphaValue.textContent = el.alphaInput.value;
        }
        if (el.betaValue && el.betaInput) {
            el.betaValue.textContent = el.betaInput.value;
        }
        if (el.gammaValue && el.gammaInput) {
            el.gammaValue.textContent = el.gammaInput.value;
        }
        if (el.deltaValue && el.deltaInput) {
            el.deltaValue.textContent = el.deltaInput.value;
        }
        
        // Volition values
        el.volitionSliders.forEach((slider, index) => {
            if (slider && el.volitionValues[index]) {
                el.volitionValues[index].textContent = parseFloat(slider.value).toFixed(2);
            }
        });
    }
    
    updatePhiMeter() {
        const el = this.uiElements;
        
        if (el.resonanceSlider && el.phiLabel && el.phiValueBar) {
            const phiValue = parseFloat(el.resonanceSlider.value) / 100;
            el.phiLabel.textContent = phiValue.toFixed(3);
            el.phiValueBar.style.width = `${phiValue * 100}%`;
            
            // Aggiorna coherence display
            if (el.coherenceDisplay) {
                el.coherenceDisplay.textContent = phiValue.toFixed(2);
            }
        }
    }
    
    updateSystemState() {
        const el = this.uiElements;
        
        if (el.resonanceSlider && el.stateDisplay) {
            const resonance = parseFloat(el.resonanceSlider.value) / 100;
            const entropy = parseFloat(el.entropySlider?.value || 0) / 100;
            
            let state, className;
            
            if (resonance < 0.3) {
                state = "CHAOTIC";
                className = "state-chaotic";
            } else if (resonance < 0.7) {
                state = "HARMONIC";
                className = "state-harmonic";
            } else {
                state = "RESONANT";
                className = "state-resonant";
            }
            
            // Se entropy è alta, aggiungi warning
            if (entropy > 0.7) {
                state = "TURBULENT";
                className = "state-turbulent";
            }
            
            el.stateDisplay.textContent = state;
            el.stateDisplay.className = className;
            
            // Aggiorna sync display
            if (el.syncDisplay) {
                const syncCount = Math.floor(3 + resonance * 3);
                el.syncDisplay.textContent = `${syncCount}/6`;
            }
        }
    }
    
    updateNodesVisualization() {
        // Simula valori nodi basati su parametri
        const el = this.uiElements;
        const resonance = parseFloat(el.resonanceSlider?.value || 50) / 100;
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < 6; i++) {
            const valueElement = document.getElementById(`nodeValue${i}`);
            const nodeElement = document.getElementById(`node-${i}`);
            
            if (valueElement) {
                // Valore simulato con oscillazione
                const baseValue = 0.5 + Math.sin(time + i) * 0.2 * resonance;
                const volitionEffect = parseFloat(el.volitionValues[i % 3]?.textContent || 0.5) * 0.1;
                const finalValue = Math.max(0, Math.min(1, baseValue + volitionEffect));
                
                valueElement.textContent = finalValue.toFixed(2);
                
                // Effetto visivo sul nodo
                if (nodeElement) {
                    const intensity = finalValue * 50;
                    nodeElement.style.boxShadow = `0 0 ${intensity}px ${intensity/2}px rgba(0, 170, 255, ${0.2 * resonance})`;
                    
                    // Leggera rotazione
                    const rotation = Math.sin(time * 2 + i) * 2;
                    nodeElement.style.transform = `rotate(${rotation}deg)`;
                }
            }
        }
    }
    
    notifyEngines() {
        // Notifica visual engine se presente
        if (this.visualEngine) {
            const resonance = parseFloat(this.uiElements.resonanceSlider?.value || 50) / 100;
            const entropy = parseFloat(this.uiElements.entropySlider?.value || 0) / 100;
            const coupling = parseFloat(this.uiElements.couplingSlider?.value || 30) / 100;
            
            this.visualEngine.updateParameters(resonance, entropy, coupling);
        }
        
        // Notifica audio engine se presente
        if (this.audioEngine && this.audioEngine.isEnabled) {
            const resonance = parseFloat(this.uiElements.resonanceSlider?.value || 50) / 100;
            const entropy = parseFloat(this.uiElements.entropySlider?.value || 0) / 100;
            const coupling = parseFloat(this.uiElements.couplingSlider?.value || 30) / 100;
            
            this.audioEngine.updateParameters(resonance, entropy, coupling);
        }
    }
    
    toggleClaudePanel() {
        const el = this.uiElements;
        const panel = document.querySelector('.claude-control-panel');
        
        if (panel && el.toggleClaudePanel) {
            this.isClaudePanelVisible = !this.isClaudePanelVisible;
            panel.style.display = this.isClaudePanelVisible ? 'block' : 'none';
            el.toggleClaudePanel.textContent = this.isClaudePanelVisible ? '−' : '+';
        }
    }
    
    getSystemState() {
        const el = this.uiElements;
        
        return {
            alpha: parseFloat(el.alphaInput?.value) || 2.5,
            beta: parseFloat(el.betaInput?.value) || 1.5,
            gamma: parseFloat(el.gammaInput?.value) || 2.0,
            delta: parseFloat(el.deltaInput?.value) || 0.2,
            volition: el.volitionSliders.map(slider => parseFloat(slider?.value) || 0.5),
            resonance: parseFloat(el.resonanceSlider?.value) || 50,
            entropy: parseFloat(el.entropySlider?.value) || 0,
            coupling: parseFloat(el.couplingSlider?.value) || 30,
            timestamp: new Date().toISOString()
        };
    }
    
    loadSavedState() {
        try {
            const saved = localStorage.getItem('phiFrameworkState');
            if (!saved) return;
            
            const state = JSON.parse(saved);
            const el = this.uiElements;
            
            // Applica stato salvato
            if (state.alpha && el.alphaInput) el.alphaInput.value = state.alpha;
            if (state.beta && el.betaInput) el.betaInput.value = state.beta;
            if (state.gamma && el.gammaInput) el.gammaInput.value = state.gamma;
            if (state.delta && el.deltaInput) el.deltaInput.value = state.delta;
            
            if (state.volition && Array.isArray(state.volition)) {
                state.volition.forEach((value, index) => {
                    if (el.volitionSliders[index]) {
                        el.volitionSliders[index].value = value;
                    }
                });
            }
            
            if (state.resonance && el.resonanceSlider) el.resonanceSlider.value = state.resonance;
            if (state.entropy && el.entropySlider) el.entropySlider.value = state.entropy;
            if (state.coupling && el.couplingSlider) el.couplingSlider.value = state.coupling;
            
            // Trigger update
            if (el.alphaInput) el.alphaInput.dispatchEvent(new Event('input'));
            
            console.log("📁 Loaded saved state from:", new Date(state.timestamp).toLocaleString());
            
        } catch (error) {
            console.error("❌ Error loading saved state:", error);
        }
    }
}

// Esporta per uso globale
window.UnifiedControls = UnifiedControls;

console.log("🎛️ Controls system loaded");
Messaggio: "feat: add unified controls with bidirectional sync"

Commit new file

File 5: js/scenarios.js
"Add file" → "Create new file"

Percorso: js/scenarios.js

Copia questo:

javascript
// SCENARIOS.JS - Scenari preconfigurati per Φ-Framework

console.log("📂 Scenarios system loading...");

const ParametricScenarios = {
    // Scenario: Harmonic Resonance
    harmonic: {
        name: "Harmonic Resonance",
        description: "Stable, coherent state with high synchronization",
        icon: "🎵",
        color: "#4ecdc4",
        
        parameters: {
            resonance: 0.75,    // Alta risonanza
            entropy: 0.1,       // Bassa entropia
            coupling: 0.6       // Accoppiamento medio-alto
        },
        
        effects: {
            visual: "Smooth waves, synchronized nodes, clear connections",
            audio: "Harmonic frequencies, clean tones",
            behavior: "Stable oscillations, predictable patterns"
        },
        
        onActivate: function(engine) {
            console.log("🎵 Activating Harmonic Resonance scenario");
            
            // Effetti speciali per scenario armonico
            if (engine.visualEngine) {
                // Colori più puliti, movimenti fluidi
            }
            
            return {
                message: "Harmonic resonance established",
                stability: "high",
                syncLevel: 0.8
            };
        }
    },
    
    // Scenario: Chaotic Attractor
    chaotic: {
        name: "Chaotic Attractor",
        description: "High entropy state with emergent complexity",
        icon: "🌪️",
        color: "#ff6b6b",
        
        parameters: {
            resonance: 0.25,    // Bassa risonanza
            entropy: 0.8,       // Alta entropia
            coupling: 0.4       // Accoppiamento medio
        },
        
        effects: {
            visual: "Fractal patterns, turbulent motion, broken connections",
            audio: "Noisy, dissonant, unpredictable",
            behavior: "Emergent complexity, sensitivity to initial conditions"
        },
        
        onActivate: function(engine) {
            console.log("🌪️ Activating Chaotic Attractor scenario");
            
            // Effetti speciali per scenario caotico
            if (engine.visualEngine) {
                // Movimenti erratici, colori contrastanti
            }
            
            return {
                message: "Chaotic attractor engaged",
                stability: "low",
                syncLevel: 0.3
            };
        }
    },
    
    // Scenario: Resonant Cascade
    resonant: {
        name: "Resonant Cascade",
        description: "Extreme resonance leading to exponential feedback",
        icon: "⚡",
        color: "#0af",
        
        parameters: {
            resonance: 0.9,     // Risonanza molto alta
            entropy: 0.05,      // Entropia molto bassa
            coupling: 0.8       // Accoppiamento alto
        },
        
        effects: {
            visual: "Intense glowing, rapid oscillations, strong connections",
            audio: "Loud, resonant, building intensity",
            behavior: "Exponential growth, potential for phase shift"
        },
        
        onActivate: function(engine) {
            console.log("⚡ Activating Resonant Cascade scenario");
            
            // Effetti speciali per scenario risonante
            if (engine.visualEngine) {
                // Luci intense, movimento rapido
            }
            
            return {
                message: "Resonant cascade initiated",
                stability: "critical",
                syncLevel: 0.9
            };
        }
    },
    
    // Scenario: Meditative State
    meditative: {
        name: "Meditative State",
        description: "Low frequency, high coherence meditation state",
        icon: "🧘",
        color: "#a29bfe",
        
        parameters: {
            resonance: 0.6,     // Risonanza media
            entropy: 0.05,      // Entropia molto bassa
            coupling: 0.3       // Accoppiamento basso
        },
        
        effects: {
            visual: "Slow pulsing, gentle waves, minimal movement",
            audio: "Low frequencies, soothing tones",
            behavior: "Stable, calming, focused"
        },
        
        onActivate: function(engine) {
            console.log("🧘 Activating Meditative State scenario");
            
            return {
                message: "Meditative state achieved",
                stability: "very high",
                syncLevel: 0.7
            };
        }
    },
    
    // Scenario: Creative Flow
    creative: {
        name: "Creative Flow",
        description: "Balanced state for creative emergence",
        icon: "🎨",
        color: "#fd79a8",
        
        parameters: {
            resonance: 0.65,    // Risonanza medio-alta
            entropy: 0.3,       // Entropia media
            coupling: 0.5       // Accoppiamento bilanciato
        },
        
        effects: {
            visual: "Flowing patterns, emergent shapes, dynamic connections",
            audio: "Melodic variations, rhythmic patterns",
            behavior: "Flexible, adaptive, novel pattern formation"
        },
        
        onActivate: function(engine) {
            console.log("🎨 Activating Creative Flow scenario");
            
            return {
                message: "Creative flow activated",
                stability: "medium",
                syncLevel: 0.6
            };
        }
    },
    
    // Scenario: Quantum Entanglement
    quantum: {
        name: "Quantum Entanglement",
        description: "Maximum coupling with coherent nodes",
        icon: "🔗",
        color: "#55efc4",
        
        parameters: {
            resonance: 0.7,     // Risonanza alta
            entropy: 0.1,       // Entropia bassa
            coupling: 0.95      // Accoppiamento molto alto
        },
        
        effects: {
            visual: "Nodes moving in perfect sync, thick connection lines",
            audio: "Unison frequencies, beating patterns",
            behavior: "Correlated motion, non-local connections"
        },
        
        onActivate: function(engine) {
            console.log("🔗 Activating Quantum Entanglement scenario");
            
            return {
                message: "Quantum entanglement simulation active",
                stability: "high",
                syncLevel: 0.95
            };
        }
    },
    
    // Scenario: Critical Transition
    critical: {
        name: "Critical Transition",
        description: "At the edge of chaos, maximum complexity",
        icon: "🎭",
        color: "#fdcb6e",
        
        parameters: {
            resonance: 0.5,     // Risonanza bilanciata
            entropy: 0.5,       // Entropia bilanciata
            coupling: 0.5       // Accoppiamento bilanciato
        },
        
        effects: {
            visual: "Complex patterns, phase transitions, critical points",
            audio: "Complex harmonics, near-chaotic patterns",
            behavior: "Maximum computational capacity, edge of chaos"
        },
        
        onActivate: function(engine) {
            console.log("🎭 Activating Critical Transition scenario");
            
            return {
                message: "System at critical point - maximum complexity",
                stability: "critical",
                syncLevel: 0.5
            };
        }
    },
    
    // Utility functions
    getAllScenarios: function() {
        return Object.keys(this)
            .filter(key => typeof this[key] === 'object' && this[key].name)
            .map(key => ({
                id: key,
                ...this[key]
            }));
    },
    
    getScenario: function(id) {
        return this[id] || null;
    },
    
    applyScenario: function(scenarioId, controls) {
        const scenario = this.getScenario(scenarioId);
        if (!scenario) {
            console.error(`Scenario ${scenarioId} not found`);
            return false;
        }
        
        const el = controls.uiElements;
        const params = scenario.parameters;
        
        // Applica parametri
        if (el.resonanceSlider) {
            el.resonanceSlider.value = Math.round(params.resonance * 100);
            el.resonanceValue.textContent = el.resonanceSlider.value + '%';
        }
        
        if (el.entropySlider) {
            el.entropySlider.value = Math.round(params.entropy * 100);
            el.entropyValue.textContent = el.entropySlider.value + '%';
        }
        
        if (el.couplingSlider) {
            el.couplingSlider.value = Math.round(params.coupling * 100);
            el.couplingValue.textContent = el.couplingSlider.value + '%';
        }
        
        // Trigger sync con tua UI
        if (el.resonanceSlider) {
            el.resonanceSlider.dispatchEvent(new Event('input'));
        }
        
        console.log(`✅ Applied scenario: ${scenario.name}`);
        return true;
    },
    
    createScenarioUI: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const scenarios = this.getAllScenarios();
        
        let html = '<div class="scenarios-grid">';
        
        scenarios.forEach(scenario => {
            html += `
                <div class="scenario-card" data-scenario="${scenario.id}" 
                     style="border-color: ${scenario.color}">
                    <div class="scenario-icon">${scenario.icon}</div>
                    <div class="scenario-info">
                        <h4>${scenario.name}</h4>
                        <p>${scenario.description}</p>
                        <div class="scenario-params">
                            <span>Φ: ${Math.round(scenario.parameters.resonance * 100)}%</span>
                            <span>E: ${Math.round(scenario.parameters.entropy * 100)}%</span>
                            <span>C: ${Math.round(scenario.parameters.coupling * 100)}%</span>
                        </div>
                    </div>
                    <button class="btn-scenario-apply" onclick="ParametricScenarios.applyScenario('${scenario.id}', window.controls)">
                        Apply
                    </button>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        // Aggiungi stili se non presenti
        this.addScenarioStyles();
    },
    
    addScenarioStyles: function() {
        if (document.getElementById('scenarios-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'scenarios-styles';
        style.textContent = `
            .scenarios-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 15px;
                margin-top: 20px;
            }
            
            .scenario-card {
                background: rgba(20, 25, 45, 0.7);
                border: 2px solid;
                border-radius: 10px;
                padding: 15px;
                transition: all 0.3s;
            }
            
            .scenario-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
            }
            
            .scenario-icon {
                font-size: 2rem;
                margin-bottom: 10px;
            }
            
            .scenario-info h4 {
                margin: 0 0 8px 0;
                color: #fff;
                font-size: 1.1rem;
            }
            
            .scenario-info p {
                margin: 0 0 10px 0;
                color: #a0a0ff;
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .scenario-params {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }
            
            .scenario-params span {
                background: rgba(0, 0, 0, 0.3);
                padding: 3px 8px;
                border-radius: 5px;
                font-size: 0.8rem;
                font-family: 'Orbitron', monospace;
            }
            
            .btn-scenario-apply {
                background: linear-gradient(135deg, rgba(0, 170, 255, 0.2), rgba(128, 0, 255, 0.2));
                border: 1px solid rgba(0, 170, 255, 0.3);
                color: #a0a0ff;
                padding: 8px 15px;
                border-radius: 6px;
                cursor: pointer;
                font-family: 'Exo 2', sans-serif;
                font-size: 0.85rem;
                width: 100%;
                transition: all 0.2s;
            }
            
            .btn-scenario-apply:hover {
                background: linear-gradient(135deg, rgba(0, 170, 255, 0.3), rgba(128, 0, 255, 0.3));
                border-color: #0af;
                color: #fff;
            }
        `;
        
        document.head.appendChild(style);
    },
    
    // Funzione per generare scenario random
    generateRandomScenario: function() {
        const scenarios = this.getAllScenarios();
        const randomIndex = Math.floor(Math.random() * scenarios.length);
        return scenarios[randomIndex];
    },
    
    // Interpolazione tra scenari
    interpolate: function(scenarioA, scenarioB, factor) {
        factor = Math.max(0, Math.min(1, factor));
        
        const paramsA = scenarioA.parameters;
        const paramsB = scenarioB.parameters;
        
        return {
            resonance: paramsA.resonance * (1 - factor) + paramsB.resonance * factor,
            entropy: paramsA.entropy * (1 - factor) + paramsB.entropy * factor,
            coupling: paramsA.coupling * (1 - factor) + paramsB.coupling * factor
        };
    }
};

// Esporta per uso globale
window.ParametricScenarios = ParametricScenarios;

console.log("📂 Scenarios system loaded");
console.log(`   Available scenarios: ${Object.keys(ParametricScenarios).filter(k => typeof ParametricScenarios[k] === 'object').length}`);
