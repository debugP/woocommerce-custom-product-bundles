console.log("Script file loaded: thps-woo-custom-product-bundle23.js");

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
        console.log("Validation passed, preparing for form submission");
        updateBundleTotal();
        
        // Add a hidden input for cart refresh
        if (!$form.find('input[name="refresh_cart"]').length) {
            $form.append('<input type="hidden" name="refresh_cart" value="1">');
        }
        
        // Disable submit button if exists
        $form.find('input[type="submit"]').prop('disabled', true);
        isSubmitting = true;
        
        console.log("Submitting form directly...");
        $form.submit();
        return false;
    });
}); 