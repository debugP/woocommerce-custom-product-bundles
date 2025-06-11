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
        
        // Append form to body and submit
        $('body').append($submitForm);
        $submitForm.submit();
    });
    
    // Function to show validation error
    function alertValidationError(message) {
        alert(message);
    }
    
    // Initial bundle total update
    console.log("Performing initial bundle total update");
    updateBundleTotal();
}); 