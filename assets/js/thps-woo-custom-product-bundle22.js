// thps-woo-custom-product-bundle22.js

// Assicurati che lo script venga eseguito solo quando il DOM è completamente caricato
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script file loaded: thps-woo-custom-product-bundle22.js');

    // Selettori (assicurati che questi selettori corrispondano ai tuoi elementi HTML)
    // Usiamo una classe generica per selezionare tutte le checkbox pertinenti
    const bundleCheckboxes = document.querySelectorAll('.item-price'); // Tutte le tue checkbox dei "bundle items"
    const bundleTotalDisplay = document.getElementById('bundle-total-display'); // L'elemento dove mostri il totale (es. <span id="bundle-total-display">)
    const addToCartButton = document.querySelector('.add-to-cart-button'); // Il tuo pulsante "Aggiungi al carrello" (es. <button class="add-to-cart-button">)
    const warningMessageContainer = document.getElementById('bundle-warning-message'); // Un elemento dove mostrare il messaggio di avviso (es. <p id="bundle-warning-message" style="display:none; color: red;">)

    const MIN_SELECTIONS_REQUIRED = 6; // Numero minimo di checkbox che devono essere selezionate
    const CART_URL = '/cart/'; // URL del tuo carrello WooCommerce

    // --- Funzioni principali ---

    // 1. Funzione placeholder per `selectBundleItem`
    // Questa funzione è necessaria perché l'HTML la chiama tramite `onclick`.
    // La sua logica principale sarà quella di richiamare le nostre funzioni di gestione.
    window.selectBundleItem = function(checkboxElement, productId) {
        console.log(`selectBundleItem called for product: ${productId}`);
        // La logica principale è gestita dagli event listener aggiunti sotto,
        // ma questa funzione può assicurarsi che il DOM sia pronto e che le funzioni di aggiornamento vengano chiamate.
        // Chiamiamo direttamente le nostre funzioni di gestione.
        updateBundleTotal();
        checkMinSelections();
    };

    // 2. Funzione per aggiornare il totale del bundle
    function updateBundleTotal() {
        console.log('updateBundleTotal called');
        let currentTotal = 0;

        bundleCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                // Prendi il valore dal 'value' dell'input, che dovrebbe essere il prezzo
                const price = parseFloat(checkbox.value);
                if (!isNaN(price)) {
                    currentTotal += price;
                }
            }
        });

        // Aggiorna l'elemento HTML che mostra il totale
        if (bundleTotalDisplay) {
            bundleTotalDisplay.innerText = currentTotal.toFixed(2); // Formatta a 2 decimali
        } else {
            console.warn("Elemento 'bundle-total-display' non trovato. Impossibile aggiornare il totale.");
        }
    }

    // 3. Funzione per verificare il numero minimo di selezioni e mostrare/nascondere il messaggio
    function checkMinSelections() {
        const selectedCount = Array.from(bundleCheckboxes).filter(checkbox => checkbox.checked).length;

        if (selectedCount < MIN_SELECTIONS_REQUIRED) {
            if (warningMessageContainer) {
                warningMessageContainer.innerText = `Devi selezionare almeno ${MIN_SELECTIONS_REQUIRED} ingredienti per creare il tuo profumo.`;
                warningMessageContainer.style.display = 'block'; // Mostra il messaggio
            } else {
                console.warn("Elemento 'bundle-warning-message' non trovato. Impossibile mostrare il messaggio di avviso.");
                // Fallback: Se non hai un container specifico, potresti usare un alert per debug
                // alert(`Devi selezionare almeno ${MIN_SELECTIONS_REQUIRED} ingredienti.`);
            }
            return false; // Indica che le selezioni non sono sufficienti
        } else {
            if (warningMessageContainer) {
                warningMessageContainer.style.display = 'none'; // Nasconde il messaggio
            }
            return true; // Indica che le selezioni sono sufficienti
        }
    }

    // --- Inizializzazione e Listener degli eventi ---

    // Aggiungi un event listener per ogni checkbox
    // Questo è il metodo preferito e più robusto per gestire gli eventi.
    // Si attiva ogni volta che lo stato di una checkbox cambia.
    bundleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateBundleTotal();    // Aggiorna il totale
            checkMinSelections();   // Controlla il numero di selezioni
        });
    });

    // Aggiungi un event listener per il pulsante "Aggiungi al carrello"
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function(event) {
            // Impedisci il comportamento predefinito del form (ricaricamento della pagina)
            event.preventDefault();

            // Prima di reindirizzare, controlla le selezioni
            if (checkMinSelections()) {
                // Se il numero minimo è raggiunto, reindirizza al carrello
                window.location.href = CART_URL;
            }
            // Se non è raggiunto, checkMinSelections() avrà già mostrato il messaggio di avviso
            // e il preventDefault() impedirà il reindirizzamento.
        });
    } else {
        console.warn("Pulsante 'add-to-cart-button' non trovato. Assicurati che il selettore sia corretto.");
    }

    // Esegui le funzioni all'avvio della pagina
    // Questo è utile se ci sono checkbox pre-selezionate al caricamento della pagina,
    // o se un utente ricarica la pagina con selezioni già fatte.
    updateBundleTotal();
    checkMinSelections();
});