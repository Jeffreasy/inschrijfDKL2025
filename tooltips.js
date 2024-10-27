export const initTooltips = () => {
  const inputs = document.querySelectorAll('[data-tooltip]');
  let activeTooltip = null;

  inputs.forEach(input => {
    const tooltipText = input.getAttribute('data-tooltip');
    const tooltip = createTooltip(tooltipText);

    input.addEventListener('mouseenter', () => {
      const rect = input.getBoundingClientRect();
      tooltip.style.left = `${rect.left + window.scrollX}px`;
      tooltip.style.top = `${rect.top + window.scrollY - 40}px`;
      tooltip.style.opacity = '1';
      activeTooltip = tooltip;
    });

    input.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
      activeTooltip = null;
    });

    input.addEventListener('focus', () => {
      tooltip.style.opacity = '0';
    });
  });

  window.addEventListener('scroll', () => {
    if (activeTooltip) {
      activeTooltip.style.opacity = '0';
    }
  });
};

function createTooltip(text) {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = text;
  document.body.appendChild(tooltip);
  return tooltip;
}
