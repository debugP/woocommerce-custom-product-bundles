var bundleTotalPrice = 0;

function updateBundleTotal() {
    console.log("updateBundleTotal called");
    bundleTotalPrice = 0;
    jQuery('.item-price:checked').each(function() {
        var price = jQuery(this).val();
        if (price) {
            bundleTotalPrice += parseFloat(price);
        }
    });
    jQuery('.bundle_total_display').text(bundleTotalPrice.toFixed(2));
    // Update the hidden bundle_total input
    jQuery('.bundle_total').val(bundleTotalPrice.toFixed(2));
    console.log("Bundle total updated:", bundleTotalPrice);
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

    // Prevent form submission if minimum products not met
    $('form.cart').on('submit', function(e) {
        var minProducts = parseInt($(this).find('.min_required').val());
        var selectedProducts = $(this).find('.item-price:checked').length;
        console.log("Form submit - Min products:", minProducts, "Selected products:", selectedProducts);
        
        if (selectedProducts < minProducts) {
            e.preventDefault();
            alert('Please select at least ' + minProducts + ' products.');
            return false;
        }

        // Before submitting, ensure bundle total is set
        var total = 0;
        $(this).find('.item-price:checked').each(function() {
            total += parseFloat($(this).val());
        });
        $(this).find('.bundle_total').val(total.toFixed(2));
        
        return true;
    });
}); 