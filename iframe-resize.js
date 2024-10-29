// Functie om de iframe hoogte aan te passen
function resizeIframe() {
  const height = document.documentElement.offsetHeight;
  window.parent.postMessage({ 
    type: 'resize', 
    height: height 
  }, '*');
}

// Luister naar DOM wijzigingen
const observer = new MutationObserver(resizeIframe);
observer.observe(document.body, { 
  childList: true, 
  subtree: true,
  attributes: true,
  characterData: true
});

// Luister naar window resize events
window.addEventListener('resize', resizeIframe);

// Initial resize
document.addEventListener('DOMContentLoaded', resizeIframe);

// Extra resize triggers voor dynamische content
window.addEventListener('load', resizeIframe);
document.fonts.ready.then(resizeIframe); 