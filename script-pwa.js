if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('SW registered', reg.scope))
        .catch(err => console.error('SW failed', err));
    });
  }
  
  const status = document.getElementById('status');
  function updateStatus() {
    status.textContent = navigator.onLine ? 'ออนไลน์' : 'ออฟไลน์';
  }
  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
  updateStatus();