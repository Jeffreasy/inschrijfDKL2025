module.exports = {
  html: `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inschrijfformulier - Koninklijke loop 2024</title>
</head>
<body>
    <div class="form-wrapper">
        <form id="inschrijf-form" class="signup-form" novalidate>
            <div class="form-progress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar"></div>
            </div>
            <div class="form-field" role="group">
                <label for="naam">Naam: <span class="required" aria-label="verplicht">*</span></label>
                <input type="text" id="naam" name="naam" class="input-field" required>
                <div id="naam-error" class="error-message" aria-live="polite"></div>
            </div>
            <div class="form-field" role="group">
                <label for="email">E-mail: <span class="required" aria-label="verplicht">*</span></label>
                <input type="email" id="email" name="email" class="input-field" required>
                <div id="email-error" class="error-message" aria-live="polite"></div>
            </div>
            <div class="form-field" role="group">
                <label>Kies je afstand: <span class="required" aria-label="verplicht">*</span></label>
                <div class="afstand-dropdown">
                    <button type="button" class="dropdown-trigger">Route</button>
                    <div class="dropdown-content">
                        <button type="button" class="afstand-optie" data-value="2.5">2.5 KM</button>
                        <button type="button" class="afstand-optie" data-value="6">6 KM</button>
                        <button type="button" class="afstand-optie" data-value="10">10 KM</button>
                        <button type="button" class="afstand-optie" data-value="15">15 KM</button>
                    </div>
                </div>
                <input type="hidden" id="afstand-input" name="afstand" required>
                <div id="afstand-error" class="error-message" aria-live="polite"></div>
            </div>
            <div class="form-field" role="group">
                <label>Rol: <span class="required" aria-label="verplicht">*</span></label>
                <div class="radio-group">
                    <label class="radio-label">
                        <input type="radio" name="rol" value="Begeleider" required>
                        <span>Begeleider</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="rol" value="Vrijwilliger" required>
                        <span>Vrijwilliger</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="rol" value="Deelnemer" required>
                        <span>Deelnemer</span>
                    </label>
                </div>
                <div id="rol-error" class="error-message" aria-live="polite"></div>
            </div>
            <div class="form-field" role="group">
                <label>Heb je begeleiding nodig? <span class="required" aria-label="verplicht">*</span></label>
                <div class="radio-group">
                    <label class="radio-label">
                        <input type="radio" name="begeleiding" value="Ja" required>
                        <span>Ja</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="begeleiding" value="Nee" required>
                        <span>Nee</span>
                    </label>
                </div>
                <div id="begeleiding-error" class="error-message" aria-live="polite"></div>
            </div>
            <div class="form-field" role="group">
                <label for="bijzonderheden">Bijzonderheden:</label>
                <textarea id="bijzonderheden" name="bijzonderheden" class="input-field"></textarea>
            </div>
            <div class="voorwaarden-sectie">
                <button type="button" class="voorwaarden-button">Algemene voorwaarden</button>
                <div class="checkbox-field">
                    <input type="checkbox" id="voorwaarden-checkbox" name="voorwaarden" required disabled>
                    <label for="voorwaarden-checkbox">
                        Ik ga akkoord met de voorwaarden <span class="required" aria-label="verplicht">*</span>
                    </label>
                    <div id="voorwaarden-error" class="error-message" aria-live="polite"></div>
                </div>
            </div>
            <div class="submit-button-wrapper">
                <button type="submit" class="submit-button" disabled>
                    <span class="button-text">Inschrijving versturen</span>
                    <span class="loading-spinner"></span>
                </button>
            </div>
        </form>
    </div>
    <div class="voorwaarden-modal" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Algemene Voorwaarden</h2>
            </div>
            <div class="modal-body">
                <!-- Voorwaarden tekst hier -->
            </div>
            <div class="modal-footer">
                <button id="confirmReadingBtn" class="confirm-button" disabled>
                    Ik bevestig dat ik de voorwaarden heb gelezen
                </button>
                <button class="modal-close">Sluiten</button>
            </div>
        </div>
    </div>
    <div id="error-boundary" class="error-boundary" role="alert"></div>
    <div class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Een moment geduld...</p>
    </div>
    <div id="success-overlay" class="success-overlay">
        <div class="success-content">
            <h2>Inschrijving Succesvol!</h2>
            <div id="submission-summary"></div>
            <button id="new-registration" class="action-button">Nieuwe Inschrijving</button>
        </div>
    </div>
</body>
</html>`
}; 