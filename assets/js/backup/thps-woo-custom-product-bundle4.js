var thps_woo = (function($, window, document) {	
	var dialogBox;
	
	$(function() {
		//if ( typeof wc_add_to_cart_params === 'undefined' ){
			//return false;
		//}
		
		_calculateBundleTotal();
		
		dialogBox = $( "#dialog-box" ).dialog({
		   	autoOpen: false, 
		   	modal: true,
		   	buttons: { 
				OK: function() {
					$(this).dialog("close");
			  		var errorField = $(this).data('errorField');
					if(errorField){ errorField.focus(); }
				} 
			},
		   	minWidth: 350,
			maxWidth: 500
		});
		
		//recaptchaOnloadCallback(dialogBox);
		productKitInitialize('');
		customPerfumeInitialize('');		
		perfumeTherapyInitialize('');
	});
	
	/*var recaptchaOnloadCallback = function() {
		alert("TESTTT");
		
		var thpk_recaptcha_elm = document.getElementById('thpk_recaptcha_div');
		var thcp_recaptcha_elm = document.getElementById('thcp_recaptcha_div');
		var thpt_recaptcha_elm = document.getElementById('thpt_recaptcha_div');
		
		var siteKey = "6Lc5qhcTAAAAAEJ_Hyzz_0FXsMTRmTyvPD7upYVK";    //SITE KEY
		
		if(thpk_recaptcha_elm){
			alert("PK");
			var thpk_recaptcha_widget = grecaptcha.render(thpk_recaptcha_elm, { 'sitekey' : siteKey });
			productKitInitialize(thpk_recaptcha_elm);
		}
		
		if(thcp_recaptcha_elm){
			alert("CP");
			var thcp_recaptcha_widget = grecaptcha.render(thcp_recaptcha_elm, { 'sitekey' : siteKey });
			customPerfumeInitialize(thcp_recaptcha_widget);
		}
		
		if(thpt_recaptcha_elm){
			alert("PT");
			var thpt_recaptcha_widget = grecaptcha.render(thpt_recaptcha_elm, { 'sitekey' : siteKey });
			perfumeTherapyInitialize(thpt_recaptcha_widget);
		}
	}*/
	
	function productKitInitialize(recaptcha_widget){
		$('.sample-kit').click(function() { 
			var wrapper 	 	= $(this).closest('.thps-actions-column');	
			var min_required 	= wrapper.find('.min_required').val();
			var max_required 	= wrapper.find('.max_required').val(); 
			var bundle_prod_id	= wrapper.find('.bundle_prod_id').val(); 
			
			var product_bundle_wrapper = $('#thps_product_bundle_'+bundle_prod_id);
			var item_count   = product_bundle_wrapper.find(".item-price:checked").length;
			
			if(min_required > 0 && item_count < min_required){
				alertValidationError(dialogBox, '', objectL10n.min_required.replace('%d', min_required));
				return false;
			}
			
			if(max_required > 0 && item_count > max_required){
				alertValidationError(dialogBox, '', objectL10n.max_allowed.replace('%d', max_required));
				return false;
			}
			
			return true;
		});
	}
	
	function customPerfumeInitialize(recaptcha_widget){
		$('.custom-perfume').click(function() {
			var wrapper 	 	= $(this).closest('.thps-actions-column');
			var min_required 	= wrapper.find('.min_required').val();
			var max_required 	= wrapper.find('.max_required').val();
			var bundle_prod_id	= wrapper.find('.bundle_prod_id').val();
			
			var product_bundle_wrapper = $('#thps_product_bundle_'+bundle_prod_id);
			var item_count    = product_bundle_wrapper.find(".item-price:checked").length;
			var item_count_ex = product_bundle_wrapper.find(".ex-validation:checked").length;
			item_count 		  = item_count - item_count_ex;
			
			if(item_count == 0){
				alertValidationError(dialogBox, '', objectL10n.min_required.replace('%d', min_required));
				return false;
			}
			
			if(min_required > 0 && item_count < min_required){
				alertValidationError(dialogBox, '', objectL10n.min_required.replace('%d', min_required));
				return false;
			}
			
			if(max_required > 0 && item_count > max_required){
				alertValidationError(dialogBox, '', objectL10n.max_allowed.replace('%d', max_required));
				return false;
			}
			
			return true;
		});
	}
	
	function perfumeTherapyInitialize(recaptcha_widget){
		$('.perfume-therapy').click(function() { 
			var wrapper 	 	= $(this).closest('.thps-actions-column');	
			var min_required 	= wrapper.find('.min_required').val();
			var max_required 	= wrapper.find('.max_required').val(); 
			var bundle_prod_id	= wrapper.find('.bundle_prod_id').val(); 
			
			var product_bundle_wrapper = $('#thps_product_bundle_'+bundle_prod_id);
			var item_count   = product_bundle_wrapper.find(".item-price:checked").length;
			
			if(min_required > 0 && item_count < min_required){
				alertValidationError(dialogBox, '', objectL10n.min_required.replace('%d', min_required));
				return false;
			}
			
			if(max_required > 0 && item_count > max_required){
				alertValidationError(dialogBox, '', objectL10n.max_allowed.replace('%d', max_required));
				return false;
			}
						
			var valid 		= true;
			var errorField	= -1;
			var err_count   = 0;
			var message		= '';
			
			var qstnAns2 = $("textarea[name=qstn2]");						
			if(qstnAns2.val() == ''){
				qstnAns2.addClass('error-field');
				valid = false;
				err_count++;
				if(errorField == -1){
					errorField = qstnAns2;
				}
			}else{
				qstnAns2.removeClass('error-field');
			}
			
			var qstnAns4 = $("textarea[name=qstn4]");
			if(qstnAns4.val() == ''){
				qstnAns4.addClass('error-field');
				valid = false;
				err_count++;
				if(errorField == -1){
					errorField = qstnAns4;
				}
			}else{
				qstnAns4.removeClass('error-field');
			}
			
			var qstnAns5 = $("textarea[name=qstn5]");
			if(qstnAns5.val() == ''){
				qstnAns5.addClass('error-field');
				valid = false;
				err_count++;
				if(errorField == -1){
					errorField = qstnAns5;
				}
			}else{
				qstnAns5.removeClass('error-field');
			}
			
			var email = $("input[name=emailAddress]");
			if(email.val() == ''){				
				if(err_count == 0){
					message	= objectL10n.email_required;	
				}
				email.addClass('error-field');
				valid = false;
				err_count++;
				if(errorField == -1){
					errorField = email;
				}
			}else if(!_isValidEmail(email.val())){
				if(err_count == 0){
					message	= objectL10n.invalid_email;	
				}
				email.addClass('error-field');
				valid = false;
				err_count++;
				if(errorField == -1){
					errorField = email;
				}
			}else{
				email.removeClass('error-field');
			}
			
			if(!valid){				
				if(message == ''){
					message	= objectL10n.fill_req_fields;
				}
				alertValidationError(dialogBox, errorField, message);
				return false;
			}
			
			/*var captcha_response = grecaptcha.getResponse(recaptcha_widget);
			alert(captcha_response);
			if(captcha_response.length == 0){
				alertValidationError(dialogBox, '', "Captcha failed");
				return false;
			}*/
			
			return true;
		});
	}
			   
	function alertValidationError( dialogBox, errorField, message ){
		dialogBox.data('errorField', errorField); 
		$( "#dialog-box-msg" ).html(message);
		dialogBox.dialog( "open" );
	}
	
	var _isValidEmail = function isValidEmail(email) {
	  	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	  	return regex.test(email);
	}
				
	var _selectBundleItem = function selectBundleItem(elm, bundle_prod_id){
		var _product_bundle_wrapper = $('#thps_product_bundle_'+bundle_prod_id);
		var _initialPrice = _product_bundle_wrapper.find('.bundle_initial_value').val();
		var _initialPriceDisplay = _product_bundle_wrapper.find('.bundle_initial_display_value').val();
		
        // Add a helper function to clean price strings
        var _cleanPriceString = function cleanPriceString(priceString) {
            if (typeof priceString !== 'string') {
                return priceString; // Return as is if not a string
            }
            // Remove currency symbols, spaces, and thousands separators (dots or commas)
            // Assuming decimal separator is typically a dot or comma
            priceString = priceString.replace(/[^0-9.,]/g, '');
            // Replace comma decimal separator with dot for parseFloat
            priceString = priceString.replace(/,/g, '.');
            // Handle multiple dots (e.g., 1.234.56) - remove all but the last dot
            var parts = priceString.split('.');
            if (parts.length > 1) {
                priceString = parts.slice(0, -1).join('') + '.' + parts.pop();
            }
            return priceString;
        };

		var _totalPrice = parseFloat(_cleanPriceString(_initialPrice));
		_totalPrice = isNaN(_totalPrice) ? 0 : _totalPrice;
		
		var _totalDisplayPrice = parseFloat(_cleanPriceString(_initialPriceDisplay));
		_totalDisplayPrice = isNaN(_totalDisplayPrice) ? 0 : _totalDisplayPrice;
		
		var bundles = {};
		_product_bundle_wrapper.find(".item-price:checked").each(function(index) {
			var prod_row = $(this).closest('tr');
			
			var _price = parseFloat(_cleanPriceString(this.value));
			var _product_id = prod_row.find('input[name="product_id"]').val();
			var _display_price = parseFloat(_cleanPriceString(prod_row.find('input[name="display_price"]').val()));
			var _title = prod_row.find('input[name="title"]').val();
			
			bundles[_product_id] = {
				'price': _price,
				'display_price': _display_price,
				'quantity': 1,
				'tax_included': true,
				'title': _title
			};
			
			_totalPrice += _price;
			_totalDisplayPrice += _display_price; // Use the parsed display price
		});
		
		_product_bundle_wrapper.find('.bundle_total').val(_totalPrice);
		_product_bundle_wrapper.find('.bundle_total_display').html(_totalDisplayPrice.toFixed(2));
		_product_bundle_wrapper.find('.bundle_items').val(JSON.stringify(bundles));
	};
	
	var _calculateBundleTotal = function calculateBundleTotal(){
		$('.thps_product_bundle').each(function( index ) {
			var _product_bundle_wrapper = $(this);
			var _initialPriceValue 			= _product_bundle_wrapper.find('.bundle_initial_value').val();
			var _initialPriceDisplayValue 	= _product_bundle_wrapper.find('.bundle_initial_display_value').val();
			
            // Add a helper function to clean price strings
            var _cleanPriceString = function cleanPriceString(priceString) {
                if (typeof priceString !== 'string') {
                    return priceString; // Return as is if not a string
                }
                // Remove currency symbols, spaces, and thousands separators (dots or commas)
                // Assuming decimal separator is typically a dot or comma
                priceString = priceString.replace(/[^0-9.,]/g, '');
                // Replace comma decimal separator with dot for parseFloat
                priceString = priceString.replace(/,/g, '.');
                // Handle multiple dots (e.g., 1.234.56) - remove all but the last dot
                var parts = priceString.split('.');
                if (parts.length > 1) {
                    priceString = parts.slice(0, -1).join('') + '.' + parts.pop();
                }
                return priceString;
            };

            console.log('Initial Price Value (raw):', _initialPriceValue);
            console.log('Initial Price Display Value (raw):', _initialPriceDisplayValue);

			var _totalPrice 	= parseFloat(_cleanPriceString(_initialPriceValue));
            console.log('Initial Price (cleaned and parsed):', _totalPrice);

			_totalPrice			= isNaN(_totalPrice) ? 0 : _totalPrice;
			
			var _totalDisplayPrice 	= parseFloat(_cleanPriceString(_initialPriceDisplayValue));
            console.log('Initial Display Price (cleaned and parsed):', _totalDisplayPrice);

			_totalDisplayPrice		= isNaN(_totalDisplayPrice) ? 0 : _totalDisplayPrice;
			
			var bundles = {};
			_product_bundle_wrapper.find(".item-price:checked").each(function( index ) {
				var prod_wrapper = $(this).closest('span');	
				
				var _priceValue  		= this.value;
				var _product_id 		= prod_wrapper.find('.product_id').val();
				var _display_priceValue 	= prod_wrapper.find('.display_price').val();
				var _quantity 		= prod_wrapper.find('.quantity').val();
				var _taxincluded 	= prod_wrapper.find('.tax_included').val();
				var _title 			= prod_wrapper.find('.title').val();
				var _desc 			= prod_wrapper.find('.desc').val();
				
                // Clean and parse item price and display price
                var _price = parseFloat(_cleanPriceString(_priceValue));
                var _display_price = parseFloat(_cleanPriceString(_display_priceValue));

                console.log('Product ID:', _product_id, 'Raw Price Value:', _priceValue, 'Cleaned/Parsed Price:', _price);
                console.log('Product ID:', _product_id, 'Raw Display Price Value:', _display_priceValue, 'Cleaned/Parsed Display Price:', _display_price);

				_price 		= isNaN(_price) ? 0 : _price;
				_totalPrice = _totalPrice + _price;
				
				_display_price     = isNaN(_display_price) ? 0 : _display_price;
				_totalDisplayPrice = _totalDisplayPrice + _display_price;			
				
				bundles[ _product_id ] = {					
					quantity 		: _quantity,
					price 			: _price,
					tax_included 	: _taxincluded,
					title 			: _title,
					desc 			: _desc
				};
			});
			
			_totalPrice			= isNaN(_totalPrice) ? 0 : _totalPrice.toFixed(2);
			_totalDisplayPrice	= isNaN(_totalDisplayPrice) ? 0 : _totalDisplayPrice.toFixed(2);
            
            console.log('Final Total Price:', _totalPrice);
            console.log('Final Display Total Price:', _totalDisplayPrice);

			_product_bundle_wrapper.find('.bundle_total').val(_totalPrice);
			_product_bundle_wrapper.find('.bundle_items').val(JSON.stringify( bundles ));
			_product_bundle_wrapper.find('.bundle_total_display').html(_totalDisplayPrice);
		});
	}
	
	var _jumpto = function jumpto(url){
		if (url != "null") {
			document.location.href = url;
		}
	}
				
	return {
		selectBundleItem : _selectBundleItem,
		jumpto 			 : _jumpto
   	};

}(window.jQuery, window, document));

function selectBundleItem(elm, bundle_prod_id){
	thps_woo.selectBundleItem(elm, bundle_prod_id);
}

function jumptoUrl(elm){
	thps_woo.jumpto(elm);
} 