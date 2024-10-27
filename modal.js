export const initModal = (elements, formState) => {
  const { voorwaardenButton, voorwaardenModal, modalClose, modalBody, confirmReadingBtn, voorwaardenCheckbox } = elements;

  voorwaardenButton.addEventListener('click', () => {
    voorwaardenModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    voorwaardenModal.setAttribute('aria-hidden', 'false');
  });

  modalClose.addEventListener('click', closeModal);

  modalBody.addEventListener('scroll', () => {
    const { scrollTop, clientHeight, scrollHeight } = modalBody;
    if (!formState.hasScrolledTerms && scrollHeight - scrollTop <= clientHeight + 20) {
      formState.hasScrolledTerms = true;
      confirmReadingBtn.disabled = false;
      confirmReadingBtn.setAttribute('aria-disabled', 'false');
    }
  });

  confirmReadingBtn.addEventListener('click', () => {
    voorwaardenCheckbox.checked = true;
    voorwaardenCheckbox.disabled = false;
    voorwaardenCheckbox.setAttribute('aria-disabled', 'false');
    closeModal();
    
    voorwaardenCheckbox.dispatchEvent(new Event('change'));
  });

  voorwaardenModal.addEventListener('click', (e) => {
    if (e.target === voorwaardenModal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && voorwaardenModal.classList.contains('active')) {
      closeModal();
    }
  });

  function closeModal() {
    voorwaardenModal.classList.remove('active');
    document.body.style.overflow = '';
    voorwaardenModal.setAttribute('aria-hidden', 'true');
  }
};
