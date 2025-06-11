console.log("Script file loaded: thps-woo-custom-product-bundle16.js");

var bundleTotalPrice = 0;

function updateBundleTotal() {
    console.log("updateBundleTotal called");
    bundleTotalPrice = 0;
    var bundleItems = [];
    
    jQuery('.item-price:checked').each(function() {
        var price = jQuery(this).val();
        if (price) {
            bundleTotalPrice += parseFloat(price);
            
            var $item = jQuery(this).closest('li.product');
            // Ensure correct selectors for grid view
            var title = $item.find('.product-name').text().trim();
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
    // Handle form submission
    $('form.thps_product_bundle').on('submit', function(e) {
        console.log("Form submit handler activated");
        e.preventDefault(); // Prevent default form submission

        var $form = $(this);
        var minProducts = parseInt($form.find('.min_required').val());
        var selectedProducts = $form.find('.item-price:checked').length;
        console.log("Form submit - Min products:", minProducts, "Selected products:", selectedProducts);
        
        if (selectedProducts < minProducts) {
            console.log("Validation failed: selectedProducts < minProducts");
            // Use a simple alert for debugging, or re-implement the modal
            alert('Please select at least ' + minProducts + ' products.');
            return false; // Stop the script here
        }

        console.log("Validation passed, preparing for AJAX submission");

        // Before submitting, ensure bundle total and items are set
        updateBundleTotal();

        // Collect form data, including hidden inputs
        var formData = $form.serialize();
        console.log("Form data serialized:", formData);

        // Perform AJAX request to add to cart
        $.ajax({
            type: 'POST',
            url: wc_add_to_cart_params.ajax_url, // Use WooCommerce AJAX URL
            data: formData + '&action=woocommerce_add_to_cart', // Add action for WooCommerce AJAX
            success: function(response) {
                console.log("AJAX success response:", response);
                if (response.error) {
                    console.error("WooCommerce AJAX Error:", response.error);
                    // Handle errors (e.g., display messages)
                     if (response.error && response.error.messages) {
                         // Display WooCommerce validation messages
                         $.each(response.error.messages, function(index, message) {
                             alert(message); // Or display in a dedicated message area
                         });
                     }
                } else {
                    // Redirect to cart or update cart fragments
                    console.log("Successfully added to cart, redirecting...");
                    window.location.href = wc_add_to_cart_params.cart_url; // Redirect to cart page
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", status, error);
                // Handle AJAX errors
                alert("An error occurred while adding the bundle to the cart.");
            }
        });

        return false; // Prevent standard form submission
    });
}); 