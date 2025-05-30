window.addEventListener('load', () => {
    setTimeout(() => {
      const banner = document.getElementById('loading-banner');
      banner.classList.add('hidden');
      setTimeout(() => banner.remove(), 1000); // optional: remove from DOM after fade
    }, 5000); // 5 seconds
  });