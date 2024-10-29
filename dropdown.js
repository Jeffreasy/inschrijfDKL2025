export const initDropdown = (elements) => {
  const { dropdownTrigger, dropdownContent, afstandOpties, afstandInput } = elements;
  let selectedOption = null;

  // Helper functie om de dropdown te sluiten
  const closeDropdown = () => {
    dropdownContent.classList.remove('active');
    dropdownTrigger.classList.remove('active');
    dropdownTrigger.setAttribute('aria-expanded', 'false');
  };

  // Helper functie om de dropdown te openen
  const openDropdown = () => {
    dropdownContent.classList.add('active');
    dropdownTrigger.classList.add('active');
    dropdownTrigger.setAttribute('aria-expanded', 'true');
  };

  // Toggle dropdown bij klik op trigger
  dropdownTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dropdownContent.classList.contains('active')) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  // Optie selectie
  afstandOpties.forEach(optie => {
    optie.addEventListener('click', (e) => {
      e.preventDefault();
      const value = optie.dataset.value;
      
      // Verwijder selected class van vorige selectie
      if (selectedOption) {
        selectedOption.classList.remove('selected');
      }
      
      // Update UI
      optie.classList.add('selected');
      selectedOption = optie;
      dropdownTrigger.textContent = `${optie.textContent} geselecteerd`;
      afstandInput.value = value;
      
      // Sluit dropdown
      closeDropdown();
      
      // Trigger events
      afstandInput.dispatchEvent(new Event('change', { bubbles: true }));
      afstandInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });

  // Sluit dropdown bij klik buiten
  document.addEventListener('click', (e) => {
    if (!dropdownTrigger.contains(e.target) && !dropdownContent.contains(e.target)) {
      closeDropdown();
    }
  });

  // Keyboard navigatie
  dropdownTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (dropdownContent.classList.contains('active')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
    }
  });

  // Keyboard navigatie voor opties
  let currentFocus = -1;
  
  const setFocus = (index) => {
    // Reset oude focus
    if (currentFocus > -1) {
      afstandOpties[currentFocus]?.classList.remove('focused');
    }
    
    // Set nieuwe focus
    currentFocus = index;
    if (afstandOpties[currentFocus]) {
      afstandOpties[currentFocus].classList.add('focused');
      afstandOpties[currentFocus].focus();
    }
  };

  dropdownContent.addEventListener('keydown', (e) => {
    if (!dropdownContent.classList.contains('active')) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocus(Math.min(currentFocus + 1, afstandOpties.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocus(Math.max(currentFocus - 1, 0));
    } else if (e.key === 'Enter' && currentFocus > -1) {
      e.preventDefault();
      afstandOpties[currentFocus].click();
    }
  });

  // Reset focus bij sluiten dropdown
  dropdownContent.addEventListener('blur', () => {
    if (currentFocus > -1) {
      afstandOpties[currentFocus].classList.remove('focused');
      currentFocus = -1;
    }
  });
};
