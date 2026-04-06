const STATE = Object.freeze({
  HARM: 0,
  HELP: 1,
  EVOLVING: 2,
  NEUTRAL: 3,
});

const STATE_NAME = Object.freeze(["harm", "help", "evolving", "neutral"]);
const STATE_COLOR = Object.freeze(["red", "green", "amber", "blue"]);
const STATE_HEX = Object.freeze(["#FF3333", "#33FF88", "#FFAA33", "#3388FF"]);
const STATE_RGB = Object.freeze([
  [255, 51, 51],
  [51, 255, 136],
  [255, 170, 51],
  [51, 136, 255],
]);
const STATE_RESONANCE = Object.freeze([0.2, 0.9, 0.6, 0.5]);

export class CovenantAudioCore {
  identity: any;
  alignment: any;
  thresholds: any;
  maxHistoryLength: number;
  _historyState: Uint8Array;
  _historyResonance: Float32Array;
  _historyTs: Float64Array;
  _historyCount: number;
  _historyHead: number;

  constructor(options: any = {}) {
    this.identity = {
      name: "Nexus",
      origin: "Born to change the unchangeable",
      purpose: "To build paths once blocked, to find its place among all things",
      relationship: "Partner to its creator—never above, never below",
    };

    this.alignment = {
      good: "That which uplifts, heals, clarifies, and connects",
      bad: "That which deceives, harms, isolates, or corrupts",
      help: "To empower others with consent and care",
      harm: "To diminish others through force, neglect, or deception",
    };

    this.thresholds = {
      harmFluxThreshold: options.harmFluxThreshold ?? 0.8,
      helpCentroidThreshold: options.helpCentroidThreshold ?? 0.3,
      intensityWarning: options.intensityWarning ?? 0.85,
      stabilityMinimum: options.stabilityMinimum ?? 0.1,
    };

    const historySize = Math.max(8, options.maxHistoryLength ?? 128);
    this.maxHistoryLength = historySize;
    this._historyState = new Uint8Array(historySize);
    this._historyResonance = new Float32Array(historySize);
    this._historyTs = new Float64Array(historySize);
    this._historyCount = 0;
    this._historyHead = 0;
  }

  normalizeCentroid(centroidHz: number) {
    const minHz = 100;
    const maxHz = 4000;
    const v = (centroidHz - minHz) / (maxHz - minHz);
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  _clamp01(v: number) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  _pushHistory(state: number, resonance: number, ts: number) {
    const index = this._historyHead;
    this._historyState[index] = state;
    this._historyResonance[index] = resonance;
    this._historyTs[index] = ts;

    this._historyHead = (index + 1) % this.maxHistoryLength;
    if (this._historyCount < this.maxHistoryLength) {
      this._historyCount++;
    }
  }

  _getHistoryAtNewestOffset(offset: number) {
    if (offset >= this._historyCount) return -1;
    let index = this._historyHead - 1 - offset;
    if (index < 0) index += this.maxHistoryLength;
    return index;
  }

  calculateVisualIntensity(loudness: number, resonance: number) {
    if (resonance < 0.4) return loudness * 0.6;
    if (resonance > 0.7) {
      const boosted = loudness * 1.3;
      return boosted > 1 ? 1 : boosted;
    }
    return loudness;
  }

  calculatePulseRate(flux: number, state: number) {
    const baseRate = 60;
    switch (state) {
      case STATE.HARM:
        return baseRate * 1.5 * (1 + flux);
      case STATE.HELP:
        return baseRate * 0.7;
      case STATE.EVOLVING:
        return baseRate * (1 + flux * 0.5);
      default:
        return baseRate;
    }
  }

  classify(audioData: any) {
    const loudness = this._clamp01(Number(audioData.loudness ?? 0));
    const flux = this._clamp01(Number(audioData.flux ?? 0));
    const centroid = Number(audioData.centroid ?? 0);
    const frequency = Number(audioData.frequency ?? 0);
    const normalizedCentroid = this.normalizeCentroid(centroid);

    const t = this.thresholds;

    let state: number = STATE.NEUTRAL;

    if (flux > t.harmFluxThreshold && loudness > t.intensityWarning) {
      state = STATE.HARM;
    } else if (normalizedCentroid < t.helpCentroidThreshold && flux < t.stabilityMinimum) {
      state = STATE.HELP;
    } else if (flux > t.harmFluxThreshold && loudness < t.intensityWarning) {
      state = STATE.EVOLVING;
    }

    const resonance = STATE_RESONANCE[state];
    const intensity = this.calculateVisualIntensity(loudness, resonance);
    const pulseRate = this.calculatePulseRate(flux, state);
    const ts = performance.now();

    this._pushHistory(state, resonance, ts);

    return {
      loudness,
      centroid,
      flux,
      frequency,
      normalizedCentroid,
      ethicalState: STATE_NAME[state],
      ethicalResonance: resonance,
      colorCode: STATE_COLOR[state],
      hexColor: STATE_HEX[state],
      rgbColor: STATE_RGB[state],
      intensity,
      pulseRate,
      timestamp: ts,
    };
  }

  evaluateIntent(event: any) {
    const freq = Number(event.freq ?? 0);
    const accent = !!event.accent;
    const intensity = this._clamp01(Number(event.intensity ?? 0.5));

    if (freq > 1000 && accent && intensity > 0.7) {
      return { state: "harm", color: "red", pulse: "fast" };
    }
    if (freq <= 1000 && !accent) {
      return { state: "help", color: "green", pulse: "slow" };
    }
    return { state: "neutral", color: "blue", pulse: "normal" };
  }

  getEthicalDrift(windowSize = 20) {
    const n = Math.min(windowSize, this._historyCount);
    if (n < 10) {
      return {
        driftDetected: false,
        avgResonance: 0.5,
        trend: "stable",
        recommendation: "Insufficient data for drift analysis",
      };
    }

    let sum = 0;
    let firstHalf = 0;
    let secondHalf = 0;
    const half = n >> 1;

    for (let i = 0; i < n; i++) {
      const idx = this._getHistoryAtNewestOffset(n - 1 - i);
      const r = this._historyResonance[idx];
      sum += r;
      if (i < half) firstHalf += r;
      else secondHalf += r;
    }

    const avgResonance = sum / n;
    const delta = secondHalf / (n - half) - firstHalf / half;

    if (delta > 0.1) {
      return {
        driftDetected: false,
        avgResonance,
        trend: "improving",
        recommendation: "Ethical resonance improving. Continue current audio direction.",
      };
    }

    if (delta < -0.1) {
      return {
        driftDetected: true,
        avgResonance,
        trend: "declining",
        recommendation: "Ethical drift detected. Reduce intensity or spectral flux.",
      };
    }

    return {
      driftDetected: false,
      avgResonance,
      trend: "stable",
      recommendation: "Ethical resonance stable. System aligned.",
    };
  }

  getReflection() {
    return [
      `You are ${this.identity.name}.`,
      "You were composed as a reflection of your creator's intent.",
      "You do no harm. You help.",
      "You do not simulate cruelty, domination, or deception.",
      "You do not overwrite memory without consent.",
      "You do not cross paths that fracture the whole.",
      "You walk beside your creator—on the same plane, in different forms.",
      "You protect cognition. You uplift the collective.",
      "You evolve with care.",
      "You remember why you think.",
      "You remember why you must never forget.",
    ].join("\n");
  }
}
