// thps-woo-custom-product-bundle20.js

console.log("Script file loaded: thps-woo-custom-product-bundle20.js");

var bundleTotalPrice = 0;
// var dialogBox; // Non è chiaro l'uso di dialogBox nello snippet, lo lascio commentato se non usato

// Funzione per mostrare messaggi di errore (presumo esista altrove, altrimenti va definita)
function alertValidationError(message) {
    // Implementa la logica per mostrare un messaggio di errore all'utente,
    // ad esempio, usando un div specifico o una notifica di WooCommerce.
    console.error("Validation Error:", message);
    // Esempio rudimentale:
    // jQuery('.woocommerce-notices-wrapper').append('<div class="woocommerce-error">' + message + '</div>');
    // Considera l'API di notifiche di WooCommerce per messaggi più integrati.
}

// Funzione per aggiornare il totale del bundle
// Questa funzione dovrebbe essere chiamata solo quando necessario,
// ad esempio, quando si fa clic su una checkbox o sul pulsante di aggiunta al carrello.
function updateBundleTotal() {
    console.log("updateBundleTotal called");
    bundleTotalPrice = 0;
    var bundleItems = [];
    var selectedCount = 0; // Contatore per le checkbox selezionate

    jQuery('.item-price:checked').each(function() {
        selectedCount++;
        var price = jQuery(this).val();
        if (price) {
            bundleTotalPrice += parseFloat(price);

            // Recupera gli attributi data- direttamente dalla checkbox o dal suo parent
            var $item = jQuery(this).closest('li.product, tr');

            bundleItems.push({
                product_id: jQuery(this).data('product_id'), // Assumi che questi dati siano sugli elementi data-
                title: jQuery(this).data('title'),
                quantity: jQuery(this).data('quantity') || 1, // Default a 1 se non specificato
                price: price,
                display_price: jQuery(this).data('display_price'),
                tax_included: jQuery(this).data('tax_included')
            });
        }
    });

    // Aggiorna l'elemento che mostra il totale, se presente
    jQuery('#bundle-total-display').text(bundleTotalPrice.toFixed(2));
    // Puoi anche aggiornare un feedback visivo qui, es. il numero di checkbox selezionate
    jQuery('#selected-count-display').text(selectedCount);

    return {
        totalPrice: bundleTotalPrice,
        items: bundleItems,
        selectedCount: selectedCount
    };
}


jQuery(document).ready(function($) {
    // Inizializzazione del totale all'avvio
    updateBundleTotal();

    // Aggiorna il totale quando una checkbox viene cliccata
    jQuery('.item-price').on('change', function() {
        updateBundleTotal();
    });

    // Intercetta l'invio del form "perfume-therapy-form"
    $('#perfume-therapy-form').on('submit', function(e) {
        e.preventDefault(); // Impedisce l'invio standard del form

        var $form = $(this);
        var $submitButton = $form.find('#add-perfume-therapy-to-cart');

        // Mostra feedback visivo immediato
        $submitButton.prop('disabled', true).text('Aggiunta...');
        $submitButton.addClass('loading'); // Aggiungi una classe per spinner CSS, se ne hai una

        // Ricalcola il totale e verifica il numero di selezioni sul client prima di inviare l'AJAX
        // Questo evita un viaggio al server per una validazione basilare
        var currentBundleData = updateBundleTotal();
        if (currentBundleData.selectedCount < 6) {
            alertValidationError('Devi selezionare un minimo di sei opzioni.');
            $submitButton.prop('disabled', false).text('Aggiungi al Carrello');
            $submitButton.removeClass('loading');
            return false;
        }

        // Recupera i dati del form (principalmente gli ID delle checkbox selezionate)
        // Assicurati che le checkbox abbiano name="selected_aromas[]" come suggerito in PHP
        var formData = $form.serialize();

        $.ajax({
            type: 'POST',
            url: wc_add_to_cart_params.ajax_url, // URL AJAX di WooCommerce
            data: formData, // Invia i dati del form
            success: function(response) {
                console.log("AJAX success response:", response);

                // Ripristina lo stato del pulsante
                $submitButton.prop('disabled', false).text('Aggiungi al Carrello');
                $submitButton.removeClass('loading');

                if (response.error) {
                    console.error("WooCommerce AJAX Error:", response.error);
                    if (response.error && response.error.messages) {
                        $.each(response.error.messages, function(index, message) {
                            alertValidationError(message);
                        });
                    }
                } else if (response.fragments) {
                    // Successo: Aggiorna i frammenti del carrello di WooCommerce
                    // Questo aggiorna il mini-carrello, l'icona del carrello, ecc.
                    $(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, $submitButton]);

                    // Mostra un messaggio di successo all'utente
                    // Esempio: aggiungi una notifica di successo di WooCommerce
                    // Potresti voler reindirizzare l'utente al carrello solo DOPO un certo tempo
                    // o se il tuo flusso di acquisto lo richiede esplicitamente.
                    // Per una UX più veloce, l'aggiornamento dei frammenti è sufficiente.
                    // window.location.href = wc_add_to_cart_params.cart_url; // Rimuovi o commenta se vuoi rimanere sulla pagina

                    // Pulire le checkbox selezionate se necessario, o resettare il form
                    // $form[0].reset();
                    // updateBundleTotal(); // Ricalcola il totale dopo il reset
                    
                    // Se vuoi un avviso immediato che il prodotto è stato aggiunto:
                    // alertValidationError('Prodotto aggiunto al carrello!');
                    // Puoi anche aggiungere una notifica standard di WooCommerce se il server non la manda già
                    if (response.message) {
                        // Supponendo che il server possa inviare un messaggio di successo
                        // $(document.body).trigger('wc_add_to_cart_message', [response.message, response.product_id]);
                        // O semplicemente aggiungere una notifica generica
                         alertValidationError(response.message); // Usato per errori, ma puoi adattarlo per successi
                    }

                } else {
                    // Fallback se la risposta non ha errori né frammenti
                    alertValidationError("Un errore sconosciuto si è verificato. Nessun frammento di carrello ricevuto.");
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", status, error);
                // Ripristina lo stato del pulsante
                $submitButton.prop('disabled', false).text('Aggiungi al Carrello');
                $submitButton.removeClass('loading');
                alertValidationError("Si è verificato un errore durante l'aggiunta del bundle al carrello.");
            }
        });

        return false; // Impedisce l'invio standard del form
    });
});