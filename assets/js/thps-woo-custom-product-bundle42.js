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
        var formattedTotal = '€' + bundleTotalPrice.toFixed(2);
        console.log("Setting total display to:", formattedTotal);
        $('.thps-bundle-total-price').html(formattedTotal);
        
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
        
        // Validate bundle items
        var isValid = true;
        bundleItems.forEach(function(item, index) {
            if (!item.product_id || !item.price) {
                console.error("Invalid item at index", index, item);
                isValid = false;
            }
        });
        
        if (!isValid) {
            alert('Invalid bundle items detected. Please try again.');
            return false;
        }
        
        console.log("Submitting form with data:", {
            items: bundleItems,
            total: bundleTotalPrice
        });
        
        // Submit form via AJAX
        $.ajax({
            type: 'POST',
            url: thps_bundle_params.ajax_url,
            data: {
                action: 'add_bundle_to_cart',
                add_to_cart: '56262',
                bundle_items: JSON.stringify(bundleItems),
                bundle_total: bundleTotalPrice.toFixed(2),
                security: thps_bundle_params.security
            },
            beforeSend: function() {
                console.log("Sending AJAX request...");
                $('.thps-bundle-add-to-cart').prop('disabled', true);
            },
            complete: function() {
                console.log("AJAX request completed");
                $('.thps-bundle-add-to-cart').prop('disabled', false);
            },
            success: function(response) {
                console.log("AJAX response:", response);
                if (response.success) {
                    console.log("Successfully added to cart, redirecting...");
                    window.location.href = response.data.cart_url;
                } else {
                    console.error("Error in response:", response);
                    alert('Error adding bundle to cart: ' + (response.data ? response.data.message : 'Unknown error'));
                }
            },
            error: function(xhr, status, error) {
                console.error('Error adding to cart:', {
                    status: status,
                    error: error,
                    response: xhr.responseText
                });
                
                // Try to parse the response as JSON
                var errorMessage = 'Error adding bundle to cart. Please try again.';
                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response.message) {
                        errorMessage = response.message;
                    }
                } catch (e) {
                    console.log("Could not parse error response as JSON");
                }
                
                alert(errorMessage);
            }
        });
    });
    
    // Initial bundle total update
    console.log("Performing initial bundle total update");
    updateBundleTotal();
}); 