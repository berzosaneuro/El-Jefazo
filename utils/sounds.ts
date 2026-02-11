
const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  alert: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'
};

export const playSound = (type: keyof typeof SOUNDS) => {
  const config = localStorage.getItem('ElJefazoConfig');
  if (config) {
    const parsed = JSON.parse(config);
    if (parsed.soundsEnabled === false) return;
  }
  
  const audio = new Audio(SOUNDS[type]);
  audio.volume = 0.3;
  audio.play().catch(() => {}); // Browser might block until interaction
};
