// APP.JS - Punto di ingresso principale per Φ-Framework v4.0

console.log("🚀 Inizializzazione Φ-Framework v4.0...");

// Variabili globali
let visualEngine, audioEngine, controls, claudeEngine;
let isInitialized = false;

// Funzione di inizializzazione
async function initUnifiedSystem() {
    initDynamicNodes();
    console.log("🚀 Initializing Unified Φ-Framework v4.0...");
    
    try {
        // 1. Inizializza Canvas Claude
        const canvas = document.getElementById('claudeCanvas');
        if (!canvas) {
            console.error("Canvas non trovato!");
            return;
        }
        
        // Imposta dimensioni canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // 2. Setup dei nodi cognitivi
        setupCognitiveNodes();
        
        // 3. Setup event listeners per controlli
        setupEventListeners();
        
        // 4. Inizializza engine di base
        initializeBasicEngines();
        
        // 5. Avvia loop di animazione
        startAnimationLoop();
        
        // 6. Aggiorna status
        updateStatus("System Active - Φ Resonance Engine Online", "success");
        
        isInitialized = true;
        console.log("✅ Unified system operational");
        
    } catch (error) {
        console.error("❌ Errore durante l'inizializzazione:", error);
        updateStatus("System Error - Falling back to legacy mode", "error");
        
        // Fallback: mostra messaggio ma continua con sistema legacy
        showFallbackMessage();
    }
}

// Setup dei 6 nodi cognitivi
function setupCognitiveNodes() {
    const nodesContainer = document.getElementById('nodesContainer');
    if (!nodesContainer) return;
    
    // I tuoi 6 nodi cognitivi
    const nodes = [
        { id: 0, name: 'Intuition', color: '#4ecdc4' },
        { id: 1, name: 'Emotion', color: '#45b7d1' },
        { id: 2, name: 'Logic', color: '#55efc4' },
        { id: 3, name: 'Memory', color: '#a29bfe' },
        { id: 4, name: 'Ethics', color: '#fd79a8' },
        { id: 5, name: 'Will', color: '#fdcb6e' }
    ];
    
    nodesContainer.innerHTML = '';
    nodes.forEach(node => {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'cognitive-node';
        nodeElement.id = `node-${node.id}`;
        nodeElement.innerHTML = `
            <div class="node-core" style="background: ${node.color}"></div>
            <div class="node-label">${node.name}</div>
            <div class="node-value" id="nodeValue${node.id}">0.50</div>
        `;
        nodesContainer.appendChild(nodeElement);
    });
}

// Setup event listeners per controlli
function setupEventListeners() {
    // Tuoi parametri
    const alphaParam = document.getElementById('alphaParam');
    const betaParam = document.getElementById('betaParam');
    const gammaParam = document.getElementById('gammaParam');
    const deltaParam = document.getElementById('deltaParam');
    
    // Tuoi slider volition
    const volitionSliders = [
        document.getElementById('volitionSlider0'),
        document.getElementById('volitionSlider1'),
        document.getElementById('volitionSlider2')
    ];
    
    // Controlli Claude
    const resonanceSlider = document.getElementById('resonanceSlider');
    const entropySlider = document.getElementById('entropySlider');
    const couplingSlider = document.getElementById('couplingSlider');
    
    // Pulsanti scenari
    const harmonicBtn = document.getElementById('harmonicBtn');
    const chaoticBtn = document.getElementById('chaoticBtn');
    const phaseShiftBtn = document.getElementById('phaseShiftBtn');
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    
    // Aggiorna display valori
    function updateParamDisplays() {
        document.getElementById('alphaValue').textContent = alphaParam.value;
        document.getElementById('betaValue').textContent = betaParam.value;
        document.getElementById('gammaValue').textContent = gammaParam.value;
        document.getElementById('deltaValue').textContent = deltaParam.value;
        
        // Volition values
        volitionSliders.forEach((slider, index) => {
            document.getElementById(`volitionValue${index}`).textContent = 
                parseFloat(slider.value).toFixed(2);
        });
    }
    
    // Mappa parametri tua UI → Claude UI
    function syncToClaudeControls() {
        const alpha = parseFloat(alphaParam.value);
        const delta = parseFloat(deltaParam.value);
        const gamma = parseFloat(gammaParam.value);
        
        // Formule di conversione
        resonanceSlider.value = Math.round((alpha / 5) * 100);
        entropySlider.value = Math.round((delta * 2.5) * 100);
        couplingSlider.value = Math.round((gamma * 0.15) * 100);
        
        // Aggiorna display Claude
        document.getElementById('resonanceValue').textContent = resonanceSlider.value + '%';
        document.getElementById('entropyValue').textContent = entropySlider.value + '%';
        document.getElementById('couplingValue').textContent = couplingSlider.value + '%';
        
        // Aggiorna phi meter
        updatePhiMeter();
    }
    
    // Mappa parametri Claude UI → Tua UI
    function syncToLegacyControls() {
        const resonance = parseFloat(resonanceSlider.value) / 100;
        const entropy = parseFloat(entropySlider.value) / 100;
        const coupling = parseFloat(couplingSlider.value) / 100;
        
        // Formule inverse
        alphaParam.value = (resonance * 5).toFixed(1);
        deltaParam.value = (entropy / 2.5).toFixed(1);
        gammaParam.value = (coupling / 0.15).toFixed(1);
        
        updateParamDisplays();
        updatePhiMeter();
    }
    
    // Aggiorna phi meter
    function updatePhiMeter() {
        const phiValue = parseFloat(resonanceSlider.value) / 100;
        document.getElementById('phiLabel').textContent = phiValue.toFixed(3);
        document.getElementById('phiValueBar').style.width = `${phiValue * 100}%`;
        
        // Aggiorna coherence display
        document.getElementById('coherenceDisplay').textContent = phiValue.toFixed(2);
        
        // Aggiorna stato
        updateStateDisplay(phiValue);
    }
    
    // Aggiorna stato display
    function updateStateDisplay(phi) {
        const stateDisplay = document.getElementById('stateDisplay');
        
        if (phi < 0.3) {
            stateDisplay.textContent = "CHAOTIC";
            stateDisplay.className = "state-chaotic";
        } else if (phi < 0.7) {
            stateDisplay.textContent = "HARMONIC";
            stateDisplay.className = "state-harmonic";
        } else {
            stateDisplay.textContent = "RESONANT";
            stateDisplay.className = "state-resonant";
        }
    }
    
    // Event listeners per i tuoi controlli
    [alphaParam, betaParam, gammaParam, deltaParam].forEach(slider => {
        slider.addEventListener('input', () => {
            updateParamDisplays();
            syncToClaudeControls();
            updateNodesVisualization();
        });
    });
    
    // Event listeners per volition sliders
    volitionSliders.forEach((slider, index) => {
        slider.addEventListener('input', () => {
            document.getElementById(`volitionValue${index}`).textContent = 
                parseFloat(slider.value).toFixed(2);
            updateNodesVisualization();
        });
    });
    
    // Event listeners per controlli Claude
    [resonanceSlider, entropySlider, couplingSlider].forEach(slider => {
        slider.addEventListener('input', () => {
            // Aggiorna valori display
            if (slider.id === 'resonanceSlider') {
                document.getElementById('resonanceValue').textContent = slider.value + '%';
            } else if (slider.id === 'entropySlider') {
                document.getElementById('entropyValue').textContent = slider.value + '%';
            } else if (slider.id === 'couplingSlider') {
                document.getElementById('couplingValue').textContent = slider.value + '%';
            }
            
            syncToLegacyControls();
            updateNodesVisualization();
        });
    });
    
    // Pulsanti scenari
    harmonicBtn?.addEventListener('click', () => {
        setScenario('harmonic');
        updateStatus("Scenario: Harmonic Resonance Activated", "success");
    });
    
    chaoticBtn?.addEventListener('click', () => {
        setScenario('chaotic');
        updateStatus("Scenario: Chaotic Attractor Activated", "warning");
    });
    
    phaseShiftBtn?.addEventListener('click', () => {
        triggerPhaseShift();
        updateStatus("Phase Shift Triggered - System Recalibrating", "warning");
    });
    
    audioToggleBtn?.addEventListener('click', () => {
        toggleAudio();
    });
    
    // Pulsanti tuoi controlli
    document.getElementById('resetBtn')?.addEventListener('click', resetSystem);
    document.getElementById('randomizeBtn')?.addEventListener('click', randomizeSystem);
    document.getElementById('saveBtn')?.addEventListener('click', saveSystemState);
    
    // Toggle panel Claude
    document.getElementById('toggleClaudePanel')?.addEventListener('click', toggleClaudePanel);
    
    // Inizializza display
    updateParamDisplays();
    syncToClaudeControls();
}

// Inizializza engine di base
function initializeBasicEngines() {
    // Per ora, semplice simulazione
    // I moduli avanzati saranno caricati dopo
    
    // Setup canvas context per animazioni basiche
    const canvas = document.getElementById('claudeCanvas');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        
        // Salva context per uso futuro
        window.claudeCanvasCtx = ctx;
        
        // Disegna sfondo iniziale
        drawBackground(ctx);
    }
}

// Loop di animazione
function startAnimationLoop() {
    let lastTime = 0;
    let frameCount = 0;
    let lastFpsUpdate = 0;
    
    function animate(timestamp) {
        // Calcola delta time
        const deltaTime = timestamp - lastTime || 0;
        lastTime = timestamp;
        
        // Update animazioni base
        updateBasicAnimations(timestamp, deltaTime);
        
        // Update nodi UI
        updateNodesDisplay(timestamp);
        
        // Monitor FPS (ogni secondo)
        frameCount++;
        if (timestamp - lastFpsUpdate >= 1000) {
            const fps = Math.round((frameCount * 1000) / (timestamp - lastFpsUpdate));
            monitorPerformance(fps);
            frameCount = 0;
            lastFpsUpdate = timestamp;
        }
        
        // Continua loop
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
}

// Animazioni base del canvas
function updateBasicAnimations(timestamp, deltaTime) {
    const canvas = document.getElementById('claudeCanvas');
    const ctx = window.claudeCanvasCtx;
    
    if (!canvas || !ctx) return;
    
    // Pulisci canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Disegna sfondo dinamico
    drawDynamicBackground(ctx, timestamp);
    
    // Disegna connessioni tra nodi
    drawNodeConnections(ctx);
    
    // Effetti particellari base
    drawParticleEffects(ctx, timestamp);
}

// Disegna sfondo
function drawBackground(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(0.5, '#151530');
    gradient.addColorStop(1, '#0a0a1a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// Sfondo dinamico
function drawDynamicBackground(ctx, timestamp) {
    drawBackground(ctx);
    
    // Effetti di luce
    const time = timestamp * 0.001;
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    
    // Risonanza effect
    const resonance = parseFloat(document.getElementById('resonanceSlider').value) / 100;
    const radius = 100 + Math.sin(time) * 50 * resonance;
    
    const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius * 3
    );
    
    gradient.addColorStop(0, `rgba(0, 170, 255, ${0.1 * resonance})`);
    gradient.addColorStop(1, 'rgba(0, 170, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 3, 0, Math.PI * 2);
    ctx.fill();
}

// Disegna connessioni tra nodi
function drawNodeConnections(ctx) {
    const coupling = parseFloat(document.getElementById('couplingSlider').value) / 100;
    
    // Coordinate fisse per i 6 nodi (disposizione esagonale)
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const radius = 150;
    const nodes = [];
    
    // Calcola posizioni nodi
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        nodes.push({ x, y });
    }
    
    // Disegna connessioni
    ctx.strokeStyle = `rgba(0, 170, 255, ${0.3 * coupling})`;
    ctx.lineWidth = 1 + coupling * 3;
    
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            // Probabilità di connessione basata su coupling
            if (Math.random() < coupling) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }
    }
    
    // Disegna nodi
    nodes.forEach((node, i) => {
        const nodeColor = [
            '#4ecdc4', '#45b7d1', '#55efc4', 
            '#a29bfe', '#fd79a8', '#fdcb6e'
        ][i];
        
        // Effetto pulsante basato su valori volition
        const volitionValue = parseFloat(
            document.getElementById(`volitionValue${i % 3}`).textContent
        );
        const pulse = 1 + Math.sin(Date.now() * 0.005 + i) * 0.2 * volitionValue;
        
        // Nodo interno
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 10 * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Alone
        const gradient = ctx.createRadialGradient(
            node.x, node.y, 10,
            node.x, node.y, 30
        );
        gradient.addColorStop(0, `${nodeColor}80`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 30, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Effetti particellari
function drawParticleEffects(ctx, timestamp) {
    const entropy = parseFloat(document.getElementById('entropySlider').value) / 100;
    const particleCount = Math.floor(entropy * 100);
    
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * ctx.canvas.width;
        const y = Math.random() * ctx.canvas.height;
        const size = Math.random() * 2 * entropy;
        const opacity = Math.random() * 0.5 * entropy;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Aggiorna display dei nodi
function updateNodesDisplay(timestamp) {
    // Simula valori dinamici per i nodi
    const time = timestamp * 0.001;
    const resonance = parseFloat(document.getElementById('resonanceSlider').value) / 100;
    const coupling = parseFloat(document.getElementById('couplingSlider').value) / 100;
    
    for (let i = 0; i < 6; i++) {
        const baseValue = 0.5 + Math.sin(time + i) * 0.2 * resonance;
        const coupledValue = baseValue + (Math.random() - 0.5) * 0.1 * coupling;
        const finalValue = Math.max(0, Math.min(1, coupledValue));
        
        const valueElement = document.getElementById(`nodeValue${i}`);
        if (valueElement) {
            valueElement.textContent = finalValue.toFixed(2);
            
            // Aggiorna nodo UI
            const nodeElement = document.getElementById(`node-${i}`);
            if (nodeElement) {
                const intensity = finalValue * 50;
                nodeElement.style.boxShadow = `0 0 ${intensity}px ${intensity/2}px rgba(0, 170, 255, ${0.2 * resonance})`;
                
                // Rotazione leggera
                const rotation = Math.sin(time * 2 + i) * 2;
                nodeElement.style.transform = `rotate(${rotation}deg)`;
            }
        }
    }
    
    // Aggiorna sync display
    const syncCount = Math.floor(3 + resonance * 3);
    document.getElementById('syncDisplay').textContent = `${syncCount}/6`;
}

// Aggiorna visualizzazione nodi
function updateNodesVisualization() {
    // Aggiorna phi meter
    updatePhiMeter();
    
    // Trigger update immediato
    updateNodesDisplay(Date.now());
}

// Monitoraggio performance
function monitorPerformance(fps) {
    if (fps < 30) {
        console.warn('⚠️ Low FPS detected:', fps);
        // Riduci effetti se necessario
    }
}

// Aggiorna status
function updateStatus(message, type = 'info') {
    const statusElement = document.getElementById('statusText');
    const dotElement = document.querySelector('.status-dot');
    
    if (statusElement) {
        statusElement.textContent = message;
        
        switch(type) {
            case 'success':
                statusElement.style.color = '#4ecdc4';
                if (dotElement) dotElement.style.background = '#4ecdc4';
                break;
            case 'error':
                statusElement.style.color = '#ff6b6b';
                if (dotElement) dotElement.style.background = '#ff6b6b';
                break;
            case 'warning':
                statusElement.style.color = '#fdcb6e';
                if (dotElement) dotElement.style.background = '#fdcb6e';
                break;
            default:
                statusElement.style.color = '#a0a0ff';
                if (dotElement) dotElement.style.background = '#a0a0ff';
        }
    }
}

// Funzioni scenari
function setScenario(scenario) {
    const resonanceSlider = document.getElementById('resonanceSlider');
    const entropySlider = document.getElementById('entropySlider');
    const couplingSlider = document.getElementById('couplingSlider');
    
    switch(scenario) {
        case 'harmonic':
            resonanceSlider.value = 75;
            entropySlider.value = 10;
            couplingSlider.value = 60;
            break;
        case 'chaotic':
            resonanceSlider.value = 25;
            entropySlider.value = 80;
            couplingSlider.value = 40;
            break;
        default:
            resonanceSlider.value = 50;
            entropySlider.value = 0;
            couplingSlider.value = 30;
    }
    
    // Trigger sync
    resonanceSlider.dispatchEvent(new Event('input'));
    entropySlider.dispatchEvent(new Event('input'));
    couplingSlider.dispatchEvent(new Event('input'));
}

function triggerPhaseShift() {
    // Effetto visivo di phase shift
    const canvas = document.getElementById('claudeCanvas');
    if (canvas) {
        canvas.style.filter = 'invert(1)';
        setTimeout(() => {
            canvas.style.filter = '';
        }, 300);
    }
    
    // Reset a valori medi
    document.getElementById('resonanceSlider').value = 50;
    document.getElementById('entropySlider').value = 50;
    document.getElementById('couplingSlider').value = 50;
    
    // Trigger sync
    document.getElementById('resonanceSlider').dispatchEvent(new Event('input'));
}

function toggleAudio() {
    const audioIndicator = document.getElementById('audioIndicator');
    const audioStatus = document.querySelector('.audio-status');
    
    if (audioIndicator && audioStatus) {
        const isOn = audioStatus.textContent === 'ON';
        audioStatus.textContent = isOn ? 'OFF' : 'ON';
        audioIndicator.style.background = isOn 
            ? 'rgba(255, 107, 107, 0.9)' 
            : 'rgba(10, 10, 26, 0.9)';
        
        updateStatus(`Audio ${isOn ? 'Disabled' : 'Enabled'}`, isOn ? 'warning' : 'success');
    }
}

function toggleClaudePanel() {
    const panel = document.querySelector('.claude-control-panel');
    const toggleBtn = document.getElementById('toggleClaudePanel');
    
    if (panel && toggleBtn) {
        const isVisible = panel.style.display !== 'none';
        panel.style.display = isVisible ? 'none' : 'block';
        toggleBtn.textContent = isVisible ? '+' : '−';
    }
}

function resetSystem() {
    // Reset tuoi parametri
    document.getElementById('alphaParam').value = 2.5;
    document.getElementById('betaParam').value = 1.5;
    document.getElementById('gammaParam').value = 2.0;
    document.getElementById('deltaParam').value = 0.2;
    
    // Reset volition
    document.getElementById('volitionSlider0').value = 0.5;
    document.getElementById('volitionSlider1').value = 0.5;
    document.getElementById('volitionSlider2').value = 0.5;
    
    // Trigger sync
    document.getElementById('alphaParam').dispatchEvent(new Event('input'));
    updateStatus("System Reset to Default", "success");
}

function randomizeSystem() {
    // Randomizza tuoi parametri
    document.getElementById('alphaParam').value = (Math.random() * 5).toFixed(1);
    document.getElementById('betaParam').value = (Math.random() * 5).toFixed(1);
    document.getElementById('gammaParam').value = (Math.random() * 5).toFixed(1);
    document.getElementById('deltaParam').value = (Math.random() * 5).toFixed(1);
    
    // Randomizza volition
    document.getElementById('volitionSlider0').value = Math.random().toFixed(2);
    document.getElementById('volitionSlider1').value = Math.random().toFixed(2);
    document.getElementById('volitionSlider2').value = Math.random().toFixed(2);
    
    // Trigger sync
    document.getElementById('alphaParam').dispatchEvent(new Event('input'));
    updateStatus("System Randomized - Exploring Parameters", "warning");
}

function saveSystemState() {
    const state = {
        alpha: document.getElementById('alphaParam').value,
        beta: document.getElementById('betaParam').value,
        gamma: document.getElementById('gammaParam').value,
        delta: document.getElementById('deltaParam').value,
        volition: [
            document.getElementById('volitionSlider0').value,
            document.getElementById('volitionSlider1').value,
            document.getElementById('volitionSlider2').value
        ],
        timestamp: new Date().toISOString()
    };
    
    // Salva in localStorage
    localStorage.setItem('phiFrameworkState', JSON.stringify(state));
    updateStatus("System State Saved to Browser", "success");
    
    // Messaggio temporaneo
    alert(`State saved at ${new Date().toLocaleTimeString()}\n\nValues:\nα: ${state.alpha}\nβ: ${state.beta}\nγ: ${state.gamma}\nδ: ${state.delta}`);
}

function loadSystemState() {
    const saved = localStorage.getItem('phiFrameworkState');
    if (saved) {
        const state = JSON.parse(saved);
        
        document.getElementById('alphaParam').value = state.alpha;
        document.getElementById('betaParam').value = state.beta;
        document.getElementById('gammaParam').value = state.gamma;
        document.getElementById('deltaParam').value = state.delta;
        
        document.getElementById('volitionSlider0').value = state.volition[0];
        document.getElementById('volitionSlider1').value = state.volition[1];
        document.getElementById('volitionSlider2').value = state.volition[2];
        
        // Trigger sync
        document.getElementById('alphaParam').dispatchEvent(new Event('input'));
        updateStatus(`State Loaded from ${new Date(state.timestamp).toLocaleString()}`, "success");
    }
}

// Fallback per errori
function showFallbackMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 107, 107, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        z-index: 10000;
        max-width: 80%;
    `;
    message.innerHTML = `
        <h3>⚠️ Partial System Load</h3>
        <p>Claude Engine failed to initialize, but legacy system is active.</p>
        <p>Check console for details.</p>
        <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px; background: white; color: #ff6b6b; border: none; border-radius: 5px; cursor: pointer;">
            Dismiss
        </button>
    `;
    document.body.appendChild(message);
}

// Gestione resize window
window.addEventListener('resize', () => {
    const canvas = document.getElementById('claudeCanvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Ridisegna
        const ctx = window.claudeCanvasCtx;
        if (ctx) {
            drawBackground(ctx);
        }
    }
});

// Carica stato salvato al load
window.addEventListener('load', () => {
    const saved = localStorage.getItem('phiFrameworkState');// ============================================================================
// FUNZIONE PER INIZIALIZZARE I 6 NODI DINAMICI
// (Ripristina le animazioni mancanti dalla tua UI originale)
// ============================================================================

function initDynamicNodes() {
    const container = document.getElementById('nodesContainer');
    if (!container) return;
    
    // Svuota il container (per sicurezza)
    container.innerHTML = '';
    
    // Definisci i 6 nodi originali con le loro proprietà
    const nodesConfig = [
        { id: 'node0', label: 'Intuition', color: '#7B68EE', frequency: 0.8 },
        { id: 'node1', label: 'Emotion', color: '#FF6B8B', frequency: 1.2 },
        { id: 'node2', label: 'Logic', color: '#20B2AA', frequency: 0.9 },
        { id: 'node3', label: 'Memory', color: '#FFA500', frequency: 1.1 },
        { id: 'node4', label: 'Will', color: '#32CD32', frequency: 0.7 },
        { id: 'node5', label: 'Conflict', color: '#DC143C', frequency: 1.3 }
    ];
    
    // Crea e aggiunge ogni nodo al DOM
    nodesConfig.forEach((node, index) => {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node';
        nodeElement.id = node.id;
        nodeElement.dataset.index = index;
        nodeElement.dataset.frequency = node.frequency;
        
        // Stile base con posizione assoluta (sarà posizionato da CSS/JS)
        nodeElement.style.cssText = `
            position: absolute;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, ${node.color}44, ${node.color});
            border: 2px solid ${node.color}CC;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 12px;
            cursor: pointer;
            user-select: none;
            box-shadow: 0 0 15px ${node.color}88, inset 0 0 10px rgba(255,255,255,0.3);
            transition: all 0.3s ease;
            z-index: 10;
        `;
        
        // Label interna
        const label = document.createElement('span');
        label.textContent = node.label;
        label.style.fontSize = '10px';
        label.style.textAlign = 'center';
        label.style.padding = '4px';
        nodeElement.appendChild(label);
        
        // Aggiungi l'elemento al container
        container.appendChild(nodeElement);
    });
    
    console.log('✅ 6 Nodi dinamici inizializzati');
}

// ============================================================================
// AGGIUNGI LA CHIAMATA ALLA FUNZIONE initUnifiedSystem ESISTENTE
// ============================================================================

// Trova la funzione initUnifiedSystem nel tuo file (di solito è all'inizio)
// e aggiungi initDynamicNodes(); al suo interno

// PER FARLO: Cerca nel file questa riga:
// function initUnifiedSystem() {
// 
// E DOPO la parentesi graffa aperta {, aggiungi:
// initDynamicNodes();
    if (saved) {
        console.log("📁 Saved state found, press 'Load' button to restore");
    }
});

// Inizializza quando la pagina è pronta
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUnifiedSystem);
} else {
    initUnifiedSystem();
}
// ============================================================================
// FUNZIONE PER INIZIALIZZARE I 6 NODI DINAMICI
// (Ripristina le animazioni mancanti dalla tua UI originale)
// ============================================================================

function initDynamicNodes() {
    const container = document.getElementById('nodesContainer');
    if (!container) return;
    
    // Svuota il container (per sicurezza)
    container.innerHTML = '';
    
    // Definisci i 6 nodi originali con le loro proprietà
    const nodesConfig = [
        { id: 'node0', label: 'Intuition', color: '#7B68EE', frequency: 0.8 },
        { id: 'node1', label: 'Emotion', color: '#FF6B8B', frequency: 1.2 },
        { id: 'node2', label: 'Logic', color: '#20B2AA', frequency: 0.9 },
        { id: 'node3', label: 'Memory', color: '#FFA500', frequency: 1.1 },
        { id: 'node4', label: 'Will', color: '#32CD32', frequency: 0.7 },
        { id: 'node5', label: 'Conflict', color: '#DC143C', frequency: 1.3 }
    ];
    
    // Crea e aggiunge ogni nodo al DOM
    nodesConfig.forEach((node, index) => {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node';
        nodeElement.id = node.id;
        nodeElement.dataset.index = index;
        nodeElement.dataset.frequency = node.frequency;
        
        // Stile base con posizione assoluta (sarà posizionato da CSS/JS)
        nodeElement.style.cssText = `
            position: absolute;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, ${node.color}44, ${node.color});
            border: 2px solid ${node.color}CC;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 12px;
            cursor: pointer;
            user-select: none;
            box-shadow: 0 0 15px ${node.color}88, inset 0 0 10px rgba(255,255,255,0.3);
            transition: all 0.3s ease;
            z-index: 10;
        `;
        
        // Label interna
        const label = document.createElement('span');
        label.textContent = node.label;
        label.style.fontSize = '10px';
        label.style.textAlign = 'center';
        label.style.padding = '4px';
        nodeElement.appendChild(label);
        
        // Aggiungi l'elemento al container
        container.appendChild(nodeElement);
    });
    
    console.log('✅ 6 Nodi dinamici inizializzati');
}

// Export per debug
window.PhiFramework = {
    version: '4.0',
    reinitialize: initUnifiedSystem,
    reset: resetSystem,
    randomize: randomizeSystem,
    save: saveSystemState,
    load: loadSystemState
};

// Export per debug
window.PhiFramework = {
    version: '4.0',
    reinitialize: initUnifiedSystem,
    reset: resetSystem,
    randomize: randomizeSystem,
    save: saveSystemState,
    load: loadSystemState
};
