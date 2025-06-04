var bundleTotalPrice = 0;

function updateBundleTotal() {
    console.log("updateBundleTotal called");
    bundleTotalPrice = 0;
    jQuery('.thps-product-bundle-checkbox:checked').each(function() {
        var price = jQuery(this).data('price');
        if (price) {
            bundleTotalPrice += parseFloat(price);
        }
    });
    jQuery('.thps-bundle-total-price').text('Total: € ' + bundleTotalPrice.toFixed(2));
    console.log("Bundle total updated:", bundleTotalPrice);
    checkMinimumProducts();
}

function selectBundleItem(checkbox) {
    console.log("selectBundleItem called with checkbox:", checkbox);
    var $checkbox = jQuery(checkbox);
    // Changed from closest('tr') to closest('span') for grid compatibility
    var $itemElement = $checkbox.closest('span.thps-product-item'); 
    if ($checkbox.is(':checked')) {
        $itemElement.addClass('selected-item');
        console.log("Item selected, added selected-item class");
    } else {
        $itemElement.removeClass('selected-item');
        console.log("Item deselected, removed selected-item class");
    }
    updateBundleTotal();
}

function checkMinimumProducts() {
    console.log("checkMinimumProducts called");
    var minProducts = parseInt(jQuery('.thps-product-bundle-container').data('min-products'));
    var selectedProducts = jQuery('.thps-product-bundle-checkbox:checked').length;
    var addToCartButton = jQuery('button.single_add_to_cart_button');
    console.log("Min products:", minProducts, "Selected products:", selectedProducts);

    if (selectedProducts < minProducts) {
        addToCartButton.prop('disabled', true);
        console.log("Add to Cart button disabled");
    } else {
        addToCartButton.prop('disabled', false);
        console.log("Add to Cart button enabled");
    }
}

jQuery(document).ready(function($) {
    console.log("Document ready, initializing JS");

    // Initial total update on page load
    updateBundleTotal();

    // Attach event listener to checkboxes using event delegation
    $(document).on('change', '.thps-product-bundle-checkbox', function() {
        selectBundleItem(this);
    });

    // Prevent form submission if minimum products not met (redundant if button disabled, but good fallback)
    $('form.cart').on('submit', function(e) {
        var minProducts = parseInt($(this).find('.thps-product-bundle-container').data('min-products'));
        var selectedProducts = $(this).find('.thps-product-bundle-checkbox:checked').length;
        if (selectedProducts < minProducts) {
            alert('Please select at least ' + minProducts + ' products.');
            e.preventDefault();
            return false;
        }
        return true;
    });
});

// Initial check when the page loads
jQuery(window).on('load', function() {
    console.log("Window loaded, checking minimum products");
    checkMinimumProducts();
}); 