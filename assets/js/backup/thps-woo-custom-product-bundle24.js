console.log("Script file loaded: thps-woo-custom-product-bundle24.js");

var bundleTotalPrice = 0;
var dialogBox;

function updateBundleTotal() {
    console.log("updateBundleTotal called");
    bundleTotalPrice = 0;
    var bundleItems = [];
    
    // Debug selected items
    console.log("Checking selected items...");
    jQuery('.item-price:checked').each(function() {
        var price = jQuery(this).val();
        console.log("Found checked item with price:", price);
        
        if (price) {
            var parsedPrice = parseFloat(price);
            console.log("Adding price to total:", parsedPrice);
            bundleTotalPrice += parsedPrice;
            
            var $item = jQuery(this).closest('li.product, tr');
            var title = $item.find('.product-name, td:nth-child(2) a').first().text().trim();
            var product_id = $item.find('.product_id').val();
            var display_price = $item.find('.display_price').val();
            var quantity = $item.find('.quantity').val();
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
        var $form = $(this);
        var minProducts = parseInt($form.find('.min_required').val());
        var selectedProducts = $form.find('.item-price:checked').length;
        
        console.log("Form validation - Min products:", minProducts, "Selected products:", selectedProducts);
        
        if (selectedProducts < minProducts) {
            console.log("Validation failed: insufficient products selected");
            e.preventDefault();
            alertValidationError('Please select at least ' + minProducts + ' products.');
            return false;
        }
        
        console.log("Validation passed, preparing form data");
        updateBundleTotal();
        
        // Ensure all bundle data is included
        var bundleItems = JSON.parse($form.find('.bundle_items').val() || '[]');
        console.log("Adding bundle items to form:", bundleItems);
        
        bundleItems.forEach(function(item, index) {
            if (!$form.find('input[name="bundle_item_' + index + '_product_id"]').length) {
                $form.append('<input type="hidden" name="bundle_item_' + index + '_product_id" value="' + item.product_id + '">');
                $form.append('<input type="hidden" name="bundle_item_' + index + '_title" value="' + item.title + '">');
                $form.append('<input type="hidden" name="bundle_item_' + index + '_price" value="' + item.price + '">');
            }
        });
        
        // Add timestamp to prevent caching
        if (!$form.find('input[name="timestamp"]').length) {
            $form.append('<input type="hidden" name="timestamp" value="' + new Date().getTime() + '">');
        }
        
        console.log("Form prepared for submission, proceeding with normal form submit");
        return true;
    });
}); 