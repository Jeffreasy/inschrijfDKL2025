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
