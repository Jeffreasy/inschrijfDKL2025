export const initDropdown = (elements) => {
  const { dropdownTrigger, dropdownContent, afstandOpties, afstandInput } = elements;

  dropdownTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropdownContent.classList.toggle('active');
    dropdownTrigger.setAttribute('aria-expanded', dropdownContent.classList.contains('active'));
  });

  afstandOpties.forEach(optie => {
    optie.addEventListener('click', (e) => {
      e.preventDefault();
      const value = optie.dataset.value;
      dropdownTrigger.textContent = optie.textContent;
      afstandInput.value = value;
      dropdownContent.classList.remove('active');
      dropdownTrigger.setAttribute('aria-expanded', 'false');
      
      // Dispatch both change and input events
      afstandInput.dispatchEvent(new Event('change', { bubbles: true }));
      afstandInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });

  document.addEventListener('click', (e) => {
    if (!dropdownTrigger.contains(e.target) && !dropdownContent.contains(e.target)) {
      dropdownContent.classList.remove('active');
      dropdownTrigger.setAttribute('aria-expanded', 'false');
    }
  });

  // Add keyboard navigation
  dropdownTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      dropdownContent.classList.toggle('active');
      dropdownTrigger.setAttribute('aria-expanded', dropdownContent.classList.contains('active'));
    }
  });

  afstandOpties.forEach(optie => {
    optie.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        optie.click();
      }
    });
  });
};
