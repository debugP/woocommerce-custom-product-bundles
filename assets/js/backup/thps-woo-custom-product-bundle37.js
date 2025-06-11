jQuery(document).ready(function($) {
    console.log("Document ready, initializing JS");
    
    // Initialize variables
    var bundleItems = [];
    var bundleTotalPrice = 0;
    
    // Remove onclick attributes from checkboxes
    $('.item-price').removeAttr('onclick');
    
    // Function to update bundle total
    function updateBundleTotal() {
        console.log("updateBundleTotal called");
        bundleTotalPrice = 0;
        bundleItems = [];
        
        console.log("Checking selected items...");
        $('.item-price:checked').each(function() {
            var $item = $(this).closest('.thps-bundle-item');
            var price = parseFloat($(this).val());
            var title = $item.find('label').text().trim();
            var productId = $(this).data('product-id') || '56262';
            
            console.log("Found checked item with price:", price);
            console.log("Item title:", title);
            bundleTotalPrice += price;
            console.log("Adding price to total:", price);
            
            var itemDetails = {
                product_id: productId,
                title: title,
                quantity: '1',
                price: price.toString()
            };
            console.log("Item details:", itemDetails);
            bundleItems.push(itemDetails);
        });
        
        // Update total display
        $('.thps-bundle-total-price').text('€' + bundleTotalPrice.toFixed(2));
        console.log("Updating total display to:", bundleTotalPrice.toFixed(2));
        
        // Update add to cart button state
        if (bundleItems.length === 6) {
            $('.thps-bundle-add-to-cart').prop('disabled', false);
        } else {
            $('.thps-bundle-add-to-cart').prop('disabled', true);
        }
        
        console.log("Final bundle total:", bundleTotalPrice);
        console.log("Bundle items:", bundleItems);
    }
    
    // Handle checkbox changes
    $(document).on('change', '.item-price', function() {
        console.log("Checkbox changed:", this);
        var $item = $(this).closest('.thps-bundle-item');
        
        if (this.checked) {
            $item.addClass('selected-item');
            console.log("Item selected, added selected-item class");
        } else {
            $item.removeClass('selected-item');
            console.log("Item deselected, removed selected-item class");
        }
        
        updateBundleTotal();
    });
    
    // Handle add to cart button click
    $('form.thps_product_bundle').on('submit', function(e) {
        e.preventDefault();
        console.log("Form submit handler activated");
        
        if (bundleItems.length !== 6) {
            console.log("Invalid number of items:", bundleItems.length);
            alert('Please select exactly 6 items for your bundle');
            return false;
        }
        
        console.log("Submitting form with data:", {
            items: bundleItems,
            total: bundleTotalPrice
        });
        
        // Submit form via AJAX
        $.ajax({
            type: 'POST',
            url: wc_add_to_cart_params.wc_ajax_url.toString().replace('%%endpoint%%', 'add_to_cart'),
            data: {
                add_to_cart: '56262',
                bundle_items: JSON.stringify(bundleItems),
                bundle_total: bundleTotalPrice.toFixed(2),
                security: thps_bundle_params.security
            },
            beforeSend: function() {
                $('.thps-bundle-add-to-cart').prop('disabled', true);
            },
            complete: function() {
                $('.thps-bundle-add-to-cart').prop('disabled', false);
            },
            success: function(response) {
                console.log("AJAX response:", response);
                if (response.fragments) {
                    $.each(response.fragments, function(key, value) {
                        $(key).replaceWith(value);
                    });
                }
                // Redirect to cart
                window.location.href = wc_add_to_cart_params.cart_url;
            },
            error: function(xhr, status, error) {
                console.error('Error adding to cart:', error);
                alert('Error adding bundle to cart. Please try again.');
            }
        });
    });
    
    // Initial bundle total update
    console.log("Performing initial bundle total update");
    updateBundleTotal();
}); 