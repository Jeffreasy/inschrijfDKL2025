export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const showError = (elementId, message) => {
  const errorElement = document.getElementById(`${elementId}-error`);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.closest('.form-field')?.querySelector('.input-field')?.classList.add('error');
  }
};

export const clearError = (elementId) => {
  const errorElement = document.getElementById(`${elementId}-error`);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.closest('.form-field')?.querySelector('.input-field')?.classList.remove('error');
  }
};

export const showErrorBoundary = (message, isError = true) => {
  const errorBoundary = document.getElementById('error-boundary');
  errorBoundary.textContent = message;
  errorBoundary.classList.add('active');
  errorBoundary.style.backgroundColor = isError ? 'var(--error-color)' : 'var(--success-color)';
  setTimeout(() => {
    errorBoundary.classList.remove('active');
  }, 5000);
};

export const updateProgress = (form, validationSchema, progressBar) => {
  const requiredFields = Object.keys(validationSchema.fields).length;
  const filledFields = Object.keys(validationSchema.fields).filter(field => {
    const input = form.querySelector(`[name="${field}"]`);
    return input && input.value;
  }).length;
  
  const progress = (filledFields / requiredFields) * 100;
  progressBar.style.width = `${progress}%`;
};

export const printConfirmation = (formData) => {
  // Creëer een print-vriendelijke versie van de bevestiging
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Inschrijfbevestiging - Koninklijke Loop 2025</title>
      <style>
        @media print {
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6;
            padding: 20px;
          }
          .header { 
            text-align: center; 
            margin-bottom: 2rem;
            border-bottom: 1px solid #ccc;
            padding-bottom: 1rem;
          }
          .details { 
            margin: 2rem 0;
          }
          .details p {
            margin: 0.5rem 0;
          }
          .footer { 
            margin-top: 2rem;
            font-size: 0.9rem;
            border-top: 1px solid #ccc;
            padding-top: 1rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Inschrijfbevestiging Koninklijke Loop 2025</h1>
        <p>Zaterdag 17 mei 2025</p>
      </div>
      <div class="details">
        <p><strong>Naam:</strong> ${formData.naam}</p>
        <p><strong>E-mail:</strong> ${formData.email}</p>
        <p><strong>Afstand:</strong> ${formData.afstand} KM</p>
        <p><strong>Rol:</strong> ${formData.rol}</p>
        <p><strong>Begeleiding nodig:</strong> ${formData.begeleiding}</p>
        <p><strong>Bijzonderheden:</strong> ${formData.bijzonderheden || 'Geen'}</p>
      </div>
      <div class="footer">
        <p>Bewaar deze bevestiging goed. Tot ziens op 17 mei 2025!</p>
        <p>Bij vragen: support@koninklijkeloop.nl</p>
      </div>
    </body>
    </html>
  `;

  // Gebruik requestAnimationFrame voor betere performance
  requestAnimationFrame(() => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wacht tot alle resources geladen zijn
      printWindow.onload = () => {
        printWindow.print();
        // Sluit het venster na het printen (optioneel)
        printWindow.onafterprint = () => printWindow.close();
      };
    }
  });
};

export const trackEvent = (eventName, eventData) => {
  try {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, eventData);
    }

    // Console logging voor debugging
    console.log('Event tracked:', eventName, eventData);

    // Bewaar events lokaal voor foutopsporing
    const events = JSON.parse(localStorage.getItem('form_events') || '[]');
    events.push({
      timestamp: new Date().toISOString(),
      event: eventName,
      data: eventData
    });
    localStorage.setItem('form_events', JSON.stringify(events.slice(-50))); // Bewaar laatste 50 events

  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export const handleError = (error, context = '') => {
  // Log error voor debugging
  console.error(`Error in ${context}:`, error);

  // Track error voor analytics
  trackEvent('error', {
    context,
    message: error.message,
    stack: error.stack
  });

  // Bepaal gebruikersvriendelijke foutmelding
  let userMessage = 'Er is een fout opgetreden. ';
  
  if (error.name === 'NetworkError' || error.message.includes('network')) {
    userMessage += 'Controleer je internetverbinding.';
  } else if (error.name === 'ValidationError') {
    userMessage += 'Controleer de gemarkeerde velden.';
  } else if (error.name === 'TimeoutError') {
    userMessage += 'De server reageert niet. Probeer het later opnieuw.';
  } else {
    userMessage += 'Probeer het later opnieuw.';
  }

  // Toon foutmelding aan gebruiker
  showErrorBoundary(userMessage);

  // Return false voor error handling in calling code
  return false;
};
