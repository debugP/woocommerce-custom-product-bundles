// thps-woo-custom-product-bundle27.js

// Assicurati che lo script venga eseguito solo quando il DOM è completamente caricato
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script file loaded: thps-woo-custom-product-bundle27.js'); // Aggiornato per questa iterazione

    // Selettori (MODIFICATI PER CORRISPONDERE ALL'HTML DEL TUO PLUGIN)
    // 1. Checkbox: usiamo '[name^="price_"]' per essere più robusti e 'input[type="checkbox"]'
    //    e aggiungiamo un controllo sulla classe "item-price "
    const bundleCheckboxes = document.querySelectorAll('input[type="checkbox"].item-price '); // Notare lo spazio finale qui!
    // 2. Totale: ID con underscore
    const bundleTotalDisplay = document.getElementById('bundle_total_display'); // MODIFICATO: da trattino a underscore
    // 3. Pulsante "Add To Cart": confermato che la classe è corretta.
    const addToCartButton = document.querySelector('.add-to-cart-button');
    // 4. Messaggio di avviso: ID con underscore
    const warningMessageContainer = document.getElementById('bundle_warning_message'); // MODIFICATO: da trattino a underscore

    const MIN_SELECTIONS_REQUIRED = 6; // Numero minimo di checkbox che devono essere selezionate
    const CART_URL = '/cart/'; // URL del tuo carrello WooCommerce

    // --- Funzioni principali ---

    // 1. Funzione placeholder per `selectBundleItem`
    window.selectBundleItem = function(checkboxElement, productId) {
        console.log(`selectBundleItem called for product: ${productId}`);
        // Assicurati che l'elemento passato sia effettivamente una checkbox dal bundle
        // (utile se questa funzione è chiamata da HTML legacy o con elementi diversi)
        if (checkboxElement && checkboxElement.classList.contains('item-price')) {
            updateBundleTotal();
            checkMinSelections();
        } else {
            console.warn("selectBundleItem chiamato con un elemento non valido o non bundle.");
        }
    };

    // 2. Funzione per aggiornare il totale del bundle
    function updateBundleTotal() {
        console.log('updateBundleTotal called');
        let currentTotal = 0;

        bundleCheckboxes.forEach(checkbox => {
            // Assicurati che il valore sia numerico prima di sommare
            const price = parseFloat(checkbox.value);
            if (checkbox.checked && !isNaN(price)) {
                currentTotal += price;
            }
        });

        // Aggiorna l'elemento HTML che mostra il totale
        if (bundleTotalDisplay) {
            // Formatta a 2 decimali e aggiorna il testo
            bundleTotalDisplay.innerText = currentTotal.toFixed(2);
        } else {
            console.warn("Elemento 'bundle_total_display' non trovato. Impossibile aggiornare il totale.");
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
                console.warn("Elemento 'bundle_warning_message' non trovato. Impossibile mostrare il messaggio di avviso.");
            }
            // Disabilita il pulsante "Add To Cart" se le selezioni non sono sufficienti
            if (addToCartButton) {
                addToCartButton.disabled = true;
                addToCartButton.style.opacity = '0.5'; // Rendi il pulsante semi-trasparente
                addToCartButton.style.cursor = 'not-allowed';
            }
            return false;
        } else {
            if (warningMessageContainer) {
                warningMessageContainer.style.display = 'none'; // Nasconde il messaggio
            }
            // Abilita il pulsante "Add To Cart" se le selezioni sono sufficienti
            if (addToCartButton) {
                addToCartButton.disabled = false;
                addToCartButton.style.opacity = '1';
                addToCartButton.style.cursor = 'pointer';
            }
            return true;
        }
    }

    // --- Inizializzazione e Listener degli eventi ---

    // Aggiungi un event listener per ogni checkbox
    bundleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateBundleTotal();
            checkMinSelections();
        });
    });

    // Aggiungi un event listener per il pulsante "Aggiungi al carrello"
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function(event) {
            // Impedisci il comportamento predefinito del form (ricaricamento della pagina)
            // SOLO SE le selezioni non sono sufficienti.
            if (!checkMinSelections()) {
                event.preventDefault(); // Impedisce il reindirizzamento
                console.warn("Aggiunta al carrello bloccata: selezioni insufficienti.");
            } else {
                // Se le selezioni sono sufficienti, lascia che il form si comporti normalmente.
                // WooCommerce gestirà l'aggiunta al carrello tramite AJAX o reindirizzamento standard.
                // Se hai una logica AJAX personalizzata nel tuo plugin, assicurati che non interferisca.
                console.log("Selezioni sufficienti. Procedo con l'aggiunta al carrello.");
            }
        });
    } else {
        console.warn("Pulsante 'add-to-cart-button' non trovato. Assicurati che il selettore sia corretto.");
    }


    // Esegui le funzioni all'avvio della pagina
    updateBundleTotal();
    checkMinSelections();
});