// Gebruik van ES6 modules (voeg type="module" toe aan je script tag in HTML)
import { debounce, showError, clearError, showErrorBoundary, updateProgress } from './utils.js';
import { initModal } from './modal.js';
import { initDropdown } from './dropdown.js';

let Yup;

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyiUh34fDbDyxwUpO99nHYGSTdtuhVDy4_-aYnRKCQN4x4yIMPlbXk_w4bSGkcamHc/exec';
const DEBOUNCE_DELAY = 300;
const ERROR_DISPLAY_DURATION = 5000;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('DOMContentLoaded event fired');
    // Wacht tot Yup is geladen
    await window.yupLoaded;
    console.log('Yup loaded successfully');
    Yup = window.Yup;

    if (!Yup) {
      throw new Error('Yup is not available after loading');
    }

    console.log('Yup version:', Yup.version);

    const formState = {
      hasScrolledTerms: false,
      isSubmitting: false,
      formData: new FormData(),
      errors: new Map()
    };

    const elements = {
      form: document.getElementById('inschrijf-form'),
      dropdownTrigger: document.querySelector('.dropdown-trigger'),
      dropdownContent: document.querySelector('.dropdown-content'),
      afstandOpties: document.querySelectorAll('.afstand-optie'),
      afstandInput: document.getElementById('afstand-input'),
      voorwaardenButton: document.querySelector('.voorwaarden-button'),
      voorwaardenModal: document.querySelector('.voorwaarden-modal'),
      modalClose: document.querySelector('.modal-close'),
      modalBody: document.querySelector('.modal-body'),
      voorwaardenCheckbox: document.getElementById('voorwaarden-checkbox'),
      submitButton: document.querySelector('.submit-button'),
      confirmReadingBtn: document.getElementById('confirmReadingBtn'),
      loadingOverlay: document.querySelector('.loading-overlay'),
      errorBoundary: document.getElementById('error-boundary'),
      progressBar: document.querySelector('.progress-bar')
    };

    const validationSchema = Yup.object().shape({
      naam: Yup.string().required('Vul een geldige naam in').min(2, 'Naam moet minimaal 2 tekens bevatten'),
      email: Yup.string().required('Vul een geldig e-mailadres in').email('E-mailadres is ongeldig'),
      afstand: Yup.string().required('Kies een afstand'),
      rol: Yup.string().required('Kies een rol'),
      voorwaarden: Yup.boolean().oneOf([true], 'Je moet akkoord gaan met de voorwaarden')
    });

    let isFormSubmitted = false;

    const validateForm = async (validateAll = false) => {
      if (!isFormSubmitted && !validateAll) return true;

      formState.errors.clear();
      const formData = new FormData(elements.form);
      const formDataObject = Object.fromEntries(formData.entries());

      try {
        await validationSchema.validate(formDataObject, { abortEarly: false });
        return true;
      } catch (errors) {
        errors.inner.forEach(error => {
          showError(error.path, error.message);
        });
        return false;
      }
    };

    const updateSubmitButtonState = () => {
      const isFormValid = validateForm();
      const isCheckboxChecked = elements.voorwaardenCheckbox.checked;
      
      elements.submitButton.disabled = !isFormValid || !isCheckboxChecked;
      elements.submitButton.classList.toggle('active', isFormValid && isCheckboxChecked);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      isFormSubmitted = true;

      if (!await validateForm(true)) {
        showErrorBoundary('Controleer de gemarkeerde velden');
        return;
      }

      try {
        formState.isSubmitting = true;
        elements.submitButton.classList.add('loading');
        elements.loadingOverlay.classList.add('active');

        const formData = new FormData(elements.form);
        const formDataObject = Object.fromEntries(formData.entries());

        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        const responseData = await response.json();
        showSuccessOverlay(formDataObject);
        
      } catch (error) {
        console.error('Submission error:', error);
        if (error.name === 'TypeError') {
          showErrorBoundary('Netwerkfout: Controleer je internetverbinding.');
        } else {
          showErrorBoundary(error.message || 'Er is iets misgegaan. Probeer het later opnieuw.');
        }
      } finally {
        formState.isSubmitting = false;
        elements.submitButton.classList.remove('loading');
        elements.loadingOverlay.classList.remove('active');
      }
    };

    const showSuccessOverlay = (formData) => {
      const successOverlay = document.getElementById('success-overlay');
      const summaryElement = document.getElementById('submission-summary');
      
      summaryElement.innerHTML = `
        <p><strong>Naam:</strong> ${formData.naam}</p>
        <p><strong>E-mail:</strong> ${formData.email}</p>
        <p><strong>Afstand:</strong> ${formData.afstand} KM</p>
        <p><strong>Rol:</strong> ${formData.rol}</p>
        <p><strong>Bijzonderheden:</strong> ${formData.bijzonderheden || 'Geen'}</p>
      `;

      successOverlay.style.display = 'flex';

      document.getElementById('new-registration').addEventListener('click', () => {
        successOverlay.style.display = 'none';
        resetForm();
      }, { once: true });
    };

    const resetForm = () => {
      isFormSubmitted = false;
      formState.errors.clear();

      elements.form.reset();
      elements.dropdownTrigger.textContent = 'Route';
      elements.afstandInput.value = '';
      elements.voorwaardenCheckbox.checked = false;
      elements.voorwaardenCheckbox.disabled = true;
      formState.hasScrolledTerms = false;

      elements.form.querySelectorAll('input, textarea, select').forEach(input => {
        delete input.dataset.touched;
      });

      document.querySelectorAll('.error-message').forEach(errorElement => {
        errorElement.textContent = '';
      });

      document.querySelectorAll('.input-field').forEach(inputField => {
        inputField.classList.remove('error');
      });

      updateProgress(elements.form, validationSchema, elements.progressBar);
      updateSubmitButtonState();
    };

    const initForm = () => {
      elements.form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('blur', () => {
          input.dataset.touched = 'true';
          clearError(input.name);
          validateForm();
          updateProgress(elements.form, validationSchema, elements.progressBar);
          updateSubmitButtonState();
        });

        input.addEventListener('input', debounce(async () => {
          if (input.dataset.touched === 'true') {
            clearError(input.name);
            await validateForm();
          }
          updateProgress(elements.form, validationSchema, elements.progressBar);
          updateSubmitButtonState();
        }, DEBOUNCE_DELAY));
      });

      elements.voorwaardenCheckbox.addEventListener('change', updateSubmitButtonState);
      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSubmit(e).catch(error => {
          console.error('Error in form submission:', error);
        });
      });
      updateSubmitButtonState();
    };

    try {
      initDropdown(elements);
      initModal(elements, formState);
      initForm();

      if (document.querySelector('[data-tooltip]')) {
        const { initTooltips } = await import('./tooltips.js');
        initTooltips();
      }
    } catch (error) {
      console.error('Initialization error:', error);
      showErrorBoundary('Er is een fout opgetreden bij het laden van het formulier');
    }
  } catch (error) {
    console.error('Error loading Yup or initializing form:', error);
    console.error('Window Yup object:', window.Yup);
    showErrorBoundary('Er is een fout opgetreden bij het laden van het formulier: ' + error.message);
    // Voeg hier code toe om het formulier te verbergen of uit te schakelen
    document.getElementById('inschrijf-form').style.display = 'none';
    document.querySelector('.form-wrapper').innerHTML += '<p>Het formulier kan momenteel niet worden geladen. Probeer het later opnieuw.</p>';
  }
});
