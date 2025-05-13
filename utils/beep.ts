// Reuse AudioContext to avoid browser limitations
const myAudioContext = new AudioContext();

interface BeepOptions {
  duration?: number;
  frequency?: number;
  volume?: number;
}

/**
 * Emits a beep sound using the Web Audio API
 * @param options - Configuration object for the beep sound
 * @returns Promise that resolves when the beep completes
 */
export const beep = ({
  duration = 200,
  frequency = 440,
  volume = 100
}: BeepOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const oscillatorNode = myAudioContext.createOscillator();
      const gainNode = myAudioContext.createGain();
      
      oscillatorNode.connect(gainNode);
      gainNode.connect(myAudioContext.destination);

      oscillatorNode.frequency.value = frequency;
      oscillatorNode.type = "square";
      gainNode.gain.value = volume * 0.01;

      const startTime = myAudioContext.currentTime;
      oscillatorNode.start(startTime);
      oscillatorNode.stop(startTime + duration * 0.001);

      oscillatorNode.onended = () => resolve();
    } catch (error: unknown) {
      if (error instanceof Error) {
        reject(error);
      }
      reject(new Error('Unknown error occurred during beep'));
    }
  });
}