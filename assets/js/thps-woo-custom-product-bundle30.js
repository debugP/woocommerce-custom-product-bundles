console.log("Script file loaded: thps-woo-custom-product-bundle29.js");

var bundleTotalPrice = 0;
var dialogBox;

function updateBundleTotal() {
    console.log("updateBundleTotal called");
    bundleTotalPrice = 0;
    var bundleItems = [];
    
    // Debug selected items
    console.log("Checking selected items...");
    jQuery('.item-price:checked').each(function() {
        var $checkbox = jQuery(this);
        var price = $checkbox.val();
        console.log("Found checked item with price:", price);
        
        if (price) {
            var parsedPrice = parseFloat(price);
            console.log("Adding price to total:", parsedPrice);
            bundleTotalPrice += parsedPrice;
            
            var $item = $checkbox.closest('li.product, tr');
            var title = $item.find('.product-name, td:nth-child(2) a').first().text().trim();
            var product_id = $checkbox.attr('onclick').match(/'([^']+)'/)[1]; // Extract product_id from onclick
            var display_price = $item.find('.display_price').val();
            var quantity = $item.find('.quantity').val() || '1';
            var tax_included = $item.find('.tax_included').val();
            var desc = $item.find('.desc').val();
            
            console.log("Item details:", {
                product_id: product_id,
                title: title,
                quantity: quantity,
                price: price,
                display_price: display_price
            });
            
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
    
    // Update display and hidden fields
    console.log("Updating total display to:", bundleTotalPrice.toFixed(2));
    jQuery('.bundle_total_display').text(bundleTotalPrice.toFixed(2));
    jQuery('.bundle_total').val(bundleTotalPrice.toFixed(2));
    jQuery('.bundle_items').val(JSON.stringify(bundleItems));
    
    console.log("Final bundle total:", bundleTotalPrice);
    console.log("Bundle items:", bundleItems);
}

function selectBundleItem(checkbox) {
    console.log("selectBundleItem called with checkbox:", checkbox);
    var $checkbox = jQuery(checkbox);
    var $itemElement = $checkbox.closest('li.product, tr');
    
    if ($checkbox.is(':checked')) {
        $itemElement.addClass('selected-item');
        console.log("Item selected, added selected-item class");
    } else {
        $itemElement.removeClass('selected-item');
        console.log("Item deselected, removed selected-item class");
    }
    
    updateBundleTotal();
}

jQuery(document).ready(function($) {
    console.log("Document ready, initializing JS");
    
    function alertValidationError(message) {
        console.log("alertValidationError called with message:", message);
        $("#dialog-box-msg").html(message);
        dialogBox.dialog("open");
    }
    
    dialogBox = $("#dialog-box").dialog({
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
    
    // Initial update
    console.log("Performing initial bundle total update");
    updateBundleTotal();
    
    // Event handlers
    $(document).on('change', '.item-price', function() {
        console.log("Item price changed");
        selectBundleItem(this);
    });
    
    $('form.thps_product_bundle').on('submit', function(e) {
        console.log("Form submit handler activated");
        e.preventDefault(); // Prevent default form submission
        
        var $form = $(this);
        var minProducts = parseInt($form.find('.min_required').val());
        var selectedProducts = $form.find('.item-price:checked').length;
        
        console.log("Form validation - Min products:", minProducts, "Selected products:", selectedProducts);
        
        if (selectedProducts < minProducts) {
            console.log("Validation failed: insufficient products selected");
            alertValidationError('Please select at least ' + minProducts + ' products.');
            return false;
        }
        
        console.log("Validation passed, preparing form data");
        updateBundleTotal();
        
        // Get bundle items
        var bundleItems = JSON.parse($form.find('.bundle_items').val() || '[]');
        console.log("Adding bundle items to cart:", bundleItems);
        
        // Create a new form for submission
        var $submitForm = $('<form>', {
            'method': 'POST',
            'action': wc_add_to_cart_params.wc_ajax_url.toString().replace('%%endpoint%%', 'add_to_cart')
        });
        
        // Add bundle data as hidden fields
        $submitForm.append($('<input>', {
            'type': 'hidden',
            'name': 'add-to-cart',
            'value': bundleItems[0].product_id
        }));
        
        $submitForm.append($('<input>', {
            'type': 'hidden',
            'name': 'bundle_items',
            'value': JSON.stringify(bundleItems)
        }));
        
        $submitForm.append($('<input>', {
            'type': 'hidden',
            'name': 'bundle_total',
            'value': bundleTotalPrice.toFixed(2)
        }));
        
        // Append form to body and submit
        $('body').append($submitForm);
        $submitForm.submit();
        
        return false;
    });
}); 