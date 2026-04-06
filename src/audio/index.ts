import { CovenantAudioCore } from "./covenant-audio-core";
import { CovenantAudioOverlay } from "./covenant-audio-overlay";
import { mountOnce } from "./mount-once";

export { CovenantAudioCore, CovenantAudioOverlay, mountOnce };

// Auto-mount the overlay as a singleton
export const overlay = mountOnce(() => {
  const instance = new CovenantAudioOverlay();
  // Start the mock loop by default for demonstration
  instance.startMockLoop();
  return instance;
});
