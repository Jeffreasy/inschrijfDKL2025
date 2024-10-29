// Verbeterde iframe resize functie met error handling
function resizeIframe() {
  try {
    const height = document.documentElement.offsetHeight;
    document.documentElement.dataset.lastHeight = height;
    
    // Stuur bericht naar parent met extra informatie
    window.parent.postMessage({ 
      type: 'resize', 
      height: height,
      url: window.location.href,
      ready: true,
      timestamp: Date.now()
    }, '*');
  } catch (error) {
    console.error('Error in resizeIframe:', error);
  }
}

// Gebruik ResizeObserver voor betere performance
let resizeObserver;
try {
  resizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(resizeIframe);
  });
  resizeObserver.observe(document.body);
} catch (error) {
  console.warn('ResizeObserver not supported, falling back to MutationObserver');
  
  // Fallback naar MutationObserver
  const observer = new MutationObserver(() => {
    requestAnimationFrame(resizeIframe);
  });
  
  observer.observe(document.body, { 
    childList: true, 
    subtree: true,
    attributes: true,
    characterData: true
  });
}

// Event listeners met debounce
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    requestAnimationFrame(resizeIframe);
  }, 100);
});

// Initiële resize events
window.addEventListener('load', resizeIframe);
document.addEventListener('DOMContentLoaded', resizeIframe);

// Font loading
if (document.fonts) {
  document.fonts.ready.then(resizeIframe);
}

// Dynamic content handlers
document.addEventListener('input', () => {
  requestAnimationFrame(resizeIframe);
});

document.addEventListener('click', () => {
  requestAnimationFrame(resizeIframe);
});

// Extra handlers voor modale vensters en dropdowns
document.addEventListener('modalOpen', resizeIframe);
document.addEventListener('modalClose', resizeIframe);
document.addEventListener('dropdownToggle', resizeIframe);

// Stuur ready event
window.addEventListener('load', () => {
  window.parent.postMessage({ 
    type: 'formReady',
    height: document.documentElement.offsetHeight
  }, '*');
});