console.log("Script file loaded: thps-woo-custom-product-bundle22.js");

var bundleTotalPrice = 0;
var dialogBox;
var isSubmitting = false;

function updateBundleTotal() {
    console.log("updateBundleTotal called");
    bundleTotalPrice = 0;
    var bundleItems = [];
    jQuery('.item-price:checked').each(function() {
        var price = jQuery(this).val();
        if (price) {
            bundleTotalPrice += parseFloat(price);
            var $item = jQuery(this).closest('li.product, tr');
            var title = $item.find('.product-name, td:nth-child(2) a').first().text().trim();
            var product_id = $item.find('.product_id').val();
            var display_price = $item.find('.display_price').val();
            var quantity = $item.find('.quantity').val();
            var tax_included = $item.find('.tax_included').val();
            var desc = $item.find('.desc').val();
            bundleItems.push({
                product_id: product_id,
                title: title,
                quantity: quantity,
                price: price,
                display_price: display_price,
                tax_included: tax_included,
                desc: desc
            });
        }
    });
    jQuery('.bundle_total_display').text(bundleTotalPrice.toFixed(2));
    jQuery('.bundle_total').val(bundleTotalPrice.toFixed(2));
    jQuery('.bundle_items').val(JSON.stringify(bundleItems));
    console.log("Bundle total updated:", bundleTotalPrice);
    console.log("Bundle items:", bundleItems);
}

function selectBundleItem(checkbox) {
    console.log("selectBundleItem called with checkbox:", checkbox);
    var $checkbox = jQuery(checkbox);
    var $itemElement = $checkbox.closest('li.product, tr');
    if ($checkbox.is(':checked')) {
        $itemElement.addClass('selected-item');
        console.log("Item selected, added selected-item class to:", $itemElement[0].tagName);
    } else {
        $itemElement.removeClass('selected-item');
        console.log("Item deselected, removed selected-item class from:", $itemElement[0].tagName);
    }
    updateBundleTotal();
}

jQuery(document).ready(function($) {
    console.log("Document ready, initializing JS");
    function alertValidationError( message ){
        console.log("alertValidationError called with message:", message);
        $( "#dialog-box-msg" ).html(message);
        dialogBox.dialog( "open" );
    }
    console.log("alertValidationError function defined inside ready");
    dialogBox = $( "#dialog-box" ).dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            OK: function() {
                $(this).dialog("close");
            }
        },
        minWidth: 350,
        maxWidth: 500,
        position: { my: 'center', at: 'center', of: window }
    });
    console.log("jQuery UI Dialog initialized");
    updateBundleTotal();
    $(document).on('change', '.item-price', function() {
        selectBundleItem(this);
    });
    console.log("Attaching form submit handler");
    $('form.thps_product_bundle').on('submit', function(e) {
        console.log("Form submit handler activated");
        if (isSubmitting) {
            console.log("Form already submitting, preventing duplicate submission");
            e.preventDefault();
            return false;
        }
        e.preventDefault();
        var $form = $(this);
        var minProducts = parseInt($form.find('.min_required').val());
        var selectedProducts = $form.find('.item-price:checked').length;
        console.log("Form submit - Min products:", minProducts, "Selected products:", selectedProducts);
        if (selectedProducts < minProducts) {
            console.log("Validation failed: selectedProducts < minProducts");
            alertValidationError('Please select at least ' + minProducts + ' products.');
            return false;
        }
        console.log("Validation passed, preparing for AJAX submission");
        updateBundleTotal();
        var formData = $form.serialize();
        console.log("Form data serialized:", formData);
        console.log("Starting AJAX request to add to cart...");
        isSubmitting = true;
        $.ajax({
            type: 'POST',
            url: wc_add_to_cart_params.ajax_url,
            data: formData + '&action=woocommerce_add_to_cart',
            timeout: 30000, // 30 second timeout
            beforeSend: function() {
                console.log("AJAX beforeSend: showing loading indicator (if any)");
                // Disable submit button if exists
                $form.find('input[type="submit"]').prop('disabled', true);
            },
            success: function(response) {
                console.log("AJAX success response:", response);
                if (response.error) {
                    console.error("WooCommerce AJAX Error:", response.error);
                    if (response.error && response.error.messages) {
                        $.each(response.error.messages, function(index, message) {
                            alertValidationError(message);
                        });
                    }
                    isSubmitting = false;
                    $form.find('input[type="submit"]').prop('disabled', false);
                } else {
                    console.log("Successfully added to cart, redirecting...");
                    // Add a small delay before redirect to ensure server has processed the request
                    setTimeout(function() {
                        window.location.href = wc_add_to_cart_params.cart_url;
                    }, 500);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", status, error);
                console.error("XHR Status:", xhr.status);
                console.error("XHR Response:", xhr.responseText);
                alertValidationError("An error occurred while adding the bundle to the cart. Please try again.");
                isSubmitting = false;
                $form.find('input[type="submit"]').prop('disabled', false);
            },
            complete: function() {
                console.log("AJAX complete: request finished");
            }
        });
        return false;
    });
}); 