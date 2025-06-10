jQuery(document).ready(function($) {
    console.log("Document ready, initializing JS");
    
    // Initialize variables
    var bundleItems = [];
    var bundleTotalPrice = 0;
    
    // Function to update bundle total
    function updateBundleTotal() {
        console.log("updateBundleTotal called");
        bundleTotalPrice = 0;
        bundleItems = [];
        
        console.log("Checking selected items...");
        $('.thps-bundle-item-checkbox:checked').each(function() {
            var $item = $(this).closest('.thps-bundle-item');
            var price = parseFloat($item.find('.thps-bundle-item-price').text().replace('€', '').trim());
            var title = $item.find('.thps-bundle-item-title').text().trim();
            var productId = $item.data('product-id');
            
            console.log("Found checked item with price:", price);
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
    
    // Function to handle item selection
    function selectBundleItem(checkbox) {
        console.log("selectBundleItem called with checkbox:", checkbox);
        var $item = $(checkbox).closest('.thps-bundle-item');
        
        if (checkbox.checked) {
            $item.addClass('selected-item');
            console.log("Item selected, added selected-item class");
        } else {
            $item.removeClass('selected-item');
            console.log("Item deselected, removed selected-item class");
        }
        
        updateBundleTotal();
    }
    
    // Handle checkbox changes
    $('.thps-bundle-item-checkbox').on('change', function() {
        selectBundleItem(this);
    });
    
    // Handle price changes
    $('.thps-bundle-item-price').on('change', function() {
        console.log("Item price changed");
        updateBundleTotal();
    });
    
    // Handle add to cart button click
    $('.thps-bundle-add-to-cart').on('click', function(e) {
        e.preventDefault();
        console.log("Add to cart button clicked");
        
        if (bundleItems.length !== 6) {
            console.log("Invalid number of items:", bundleItems.length);
            alertValidationError('Please select exactly 6 items for your bundle');
            return false;
        }
        
        console.log("Creating form for submission");
        // Create a new form for submission
        var $submitForm = $('<form>', {
            'method': 'POST',
            'action': wc_add_to_cart_params.wc_ajax_url.toString().replace('%%endpoint%%', 'add_to_cart')
        });
        
        // Add bundle data as hidden fields
        $submitForm.append($('<input>', {
            'type': 'hidden',
            'name': 'add-to-cart',
            'value': '56262' // Use a valid product ID
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
                bundle_total: bundleTotalPrice.toFixed(2)
            },
            beforeSend: function() {
                $('.thps-bundle-add-to-cart').prop('disabled', true);
            },
            complete: function() {
                $('.thps-bundle-add-to-cart').prop('disabled', false);
            },
            success: function(response) {
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
                alertValidationError('Error adding bundle to cart. Please try again.');
            }
        });
    });
    
    // Function to show validation error
    function alertValidationError(message) {
        alert(message);
    }
    
    // Initial bundle total update
    console.log("Performing initial bundle total update");
    updateBundleTotal();
}); 