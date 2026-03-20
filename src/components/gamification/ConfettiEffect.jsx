import confetti from 'canvas-confetti';

export const triggerConfetti = (type = 'default') => {
  if (type === 'default') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00ff88', '#00c9ff', '#a855f7', '#ec4899']
    });
  } else if (type === 'achievement') {
    const end = Date.now() + (2 * 1000);
    const colors = ['#a855f7', '#f59e0b'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
};
