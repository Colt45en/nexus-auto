import { CovenantAudioCore } from "./covenant-audio-core";

export class CovenantAudioOverlay {
  core: CovenantAudioCore;
  container: HTMLDivElement;
  pulseElement: HTMLDivElement;
  textElement: HTMLDivElement;
  animationFrameId: number | null = null;
  isRunning: boolean = false;

  constructor(options: any = {}) {
    this.core = new CovenantAudioCore(options);
    
    this.container = document.createElement("div");
    this.container.id = "covenant-audio-overlay";
    Object.assign(this.container.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "300px",
      padding: "16px",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      fontFamily: "monospace",
      borderRadius: "8px",
      zIndex: "9999",
      pointerEvents: "none",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
      transition: "all 0.3s ease"
    });

    this.pulseElement = document.createElement("div");
    Object.assign(this.pulseElement.style, {
      width: "100%",
      height: "4px",
      borderRadius: "2px",
      backgroundColor: "#3388FF",
      transition: "background-color 0.2s ease, transform 0.1s ease"
    });

    this.textElement = document.createElement("div");
    Object.assign(this.textElement.style, {
      fontSize: "12px",
      whiteSpace: "pre-wrap"
    });

    this.container.appendChild(this.pulseElement);
    this.container.appendChild(this.textElement);
    document.body.appendChild(this.container);
  }

  update(audioData: any) {
    const result = this.core.classify(audioData);
    const drift = this.core.getEthicalDrift();

    // Update pulse visual
    this.pulseElement.style.backgroundColor = result.hexColor;
    this.pulseElement.style.transform = `scaleY(${1 + result.intensity * 2})`;
    
    // Update text
    this.textElement.innerHTML = `
STATE: <span style="color: ${result.hexColor}">${result.ethicalState.toUpperCase()}</span>
RESONANCE: ${result.ethicalResonance.toFixed(2)}
DRIFT: ${drift.trend.toUpperCase()}
    `.trim();

    // Add glow based on intensity
    this.container.style.boxShadow = `0 4px 20px ${result.hexColor}${Math.floor(result.intensity * 255).toString(16).padStart(2, '0')}`;
  }

  startMockLoop() {
    this.isRunning = true;
    const loop = () => {
      if (!this.isRunning) return;
      
      // Generate some mock audio data for demonstration
      const mockData = {
        loudness: Math.random(),
        flux: Math.random(),
        centroid: 100 + Math.random() * 3000,
        frequency: Math.random() * 5000
      };
      
      this.update(mockData);
      this.animationFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  resume() {
    if (!this.isRunning) {
      this.startMockLoop();
    }
  }

  destroy() {
    this.stop();
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
