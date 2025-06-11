console.log("Script file loaded: thps-woo-custom-product-bundle9.js");

var bundleTotalPrice = 0;

function updateBundleTotal() {
    console.log("updateBundleTotal called");
    bundleTotalPrice = 0;
    var bundleItems = [];
    
    jQuery('.item-price:checked').each(function() {
        var price = jQuery(this).val();
        if (price) {
            bundleTotalPrice += parseFloat(price);
            
            // Collect bundle item details
            var $item = jQuery(this).closest('li.product');
            var title = $item.find('.product-name').text().trim();
            var quantity = 1;
            
            bundleItems.push({
                title: title,
                quantity: quantity,
                price: price
            });
        }
    });
    
    // Update display
    jQuery('.bundle_total_display').text(bundleTotalPrice.toFixed(2));
    
    // Update hidden inputs
    jQuery('.bundle_total').val(bundleTotalPrice.toFixed(2));
    jQuery('.bundle_items').val(JSON.stringify(bundleItems));
    
    console.log("Bundle total updated:", bundleTotalPrice);
    console.log("Bundle items:", bundleItems);
}

function selectBundleItem(checkbox) {
    console.log("selectBundleItem called with checkbox:", checkbox);
    var $checkbox = jQuery(checkbox);
    var $itemElement = $checkbox.closest('li.product'); 
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

    // Initial total update on page load
    updateBundleTotal();

    // Attach event listener to checkboxes using event delegation
    $(document).on('change', '.item-price', function() {
        selectBundleItem(this);
    });

    console.log("Attaching form submit handler");
    // Prevent form submission if minimum products not met
    $('form.cart').on('submit', function(e) {
        console.log("Form submit handler activated");
        var minProducts = parseInt($(this).find('.min_required').val());
        var selectedProducts = $(this).find('.item-price:checked').length;
        console.log("Form submit - Min products:", minProducts, "Selected products:", selectedProducts);
        
        if (selectedProducts < minProducts) {
            console.log("Minimum products not met, preventing default");
            e.preventDefault();
            alert('Please select at least ' + minProducts + ' products.');
            return false;
        }

        // Before submitting, ensure bundle total and items are set
        updateBundleTotal();
        console.log("Minimum products met, allowing default submission");
        
        return true;
    });
}); 