// Importeer Yup als ES module
import * as Yup from 'yup';

// Gebruik van ES6 modules (voeg type="module" toe aan je script tag in HTML)
import { debounce, showError, clearError, showErrorBoundary, updateProgress, printConfirmation } from './utils.js';
import { initModal } from './modal.js';
import { initDropdown } from './dropdown.js';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxDXLlaCyCHbPC5_WKc4zbQ7dxJOLzxIyplU5nVb7lJfEkKAQXFsxm5esX2PcCdc1Z1/exec';
const DEBOUNCE_DELAY = 300;
const ERROR_DISPLAY_DURATION = 5000;

const SUBMISSION_LIMIT = 5; // Max pogingen
const COOLDOWN_PERIOD = 60000; // 1 minuut in milliseconden
let submissionAttempts = 0;
let lastSubmissionTime = 0;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('DOMContentLoaded event fired');

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
      email: Yup.string()
        .required('Vul een geldig e-mailadres in')
        .email('E-mailadres is ongeldig')
        .test('domain', 'Gebruik een geldig e-mailadres', 
          value => value && !value.endsWith('.test'))
        .test('format', 'E-mailadres moet een geldig formaat hebben',
          value => value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)),
      afstand: Yup.string().required('Kies een afstand'),
      rol: Yup.string().required('Kies een rol'),
      begeleiding: Yup.string().required('Geef aan of je begeleiding nodig hebt'),
      voorwaarden: Yup.boolean().oneOf([true], 'Je moet akkoord gaan met de voorwaarden')
    });

    let isFormSubmitted = false;

    const validateForm = async (validateAll = false) => {
      if (!isFormSubmitted && !validateAll) return true;

      formState.errors.clear();
      const formData = new FormData(elements.form);
      const formDataObject = Object.fromEntries(formData.entries());

      formDataObject.voorwaarden = elements.voorwaardenCheckbox.checked;

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
      
      elements.submitButton.disabled = !isCheckboxChecked;
      elements.submitButton.classList.toggle('active', isCheckboxChecked);
    };

    const trackFormSubmission = (formData) => {
      try {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submission', {
            'event_category': 'Inschrijving',
            'event_label': formData.afstand,
            'rol': formData.rol,
            'begeleiding_nodig': formData.begeleiding
          });
        }
      } catch (error) {
        console.error('Analytics error:', error);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Rate limiting check
      const now = Date.now();
      if (submissionAttempts >= SUBMISSION_LIMIT && (now - lastSubmissionTime) < COOLDOWN_PERIOD) {
        showErrorBoundary('Te veel pogingen. Probeer het over een minuut opnieuw.');
        return;
      }

      submissionAttempts++;
      lastSubmissionTime = now;

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
        trackFormSubmission(formDataObject);
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
        <p><strong>Begeleiding nodig:</strong> ${formData.begeleiding}</p>
        <p><strong>Bijzonderheden:</strong> ${formData.bijzonderheden || 'Geen'}</p>
      `;

      successOverlay.style.display = 'flex';

      document.getElementById('new-registration').addEventListener('click', () => {
        successOverlay.style.display = 'none';
        resetForm();
      }, { once: true });

      const actionButtons = document.createElement('div');
      actionButtons.className = 'action-buttons';
      actionButtons.innerHTML = `
        <button id="print-confirmation" class="action-button">Print bevestiging</button>
        <button id="new-registration" class="action-button">Nieuwe inschrijving</button>
      `;

      document.querySelector('.success-content').appendChild(actionButtons);

      document.getElementById('print-confirmation').addEventListener('click', () => {
        printConfirmation(formData);
      });
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

      elements.voorwaardenCheckbox.addEventListener('change', () => {
        clearError('voorwaarden');
        updateSubmitButtonState();
      });
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
    console.error('Error initializing form:', error);
    showErrorBoundary('Er is een fout opgetreden bij het laden van het formulier: ' + error.message);
    document.getElementById('inschrijf-form').style.display = 'none';
    document.querySelector('.form-wrapper').innerHTML += '<p>Het formulier kan momenteel niet worden geladen. Probeer het later opnieuw.</p>';
  }
});
