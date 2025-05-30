# WooCommerce Custom Product Bundles

A WordPress plugin that extends WooCommerce functionality to create customizable product bundles, with a focus on perfume products.

## Features

### For End Users
- Create custom perfume bundles with multiple fragrance selections
- Build personalized perfume therapy kits
- Select products from categorized lists
- Set minimum and maximum product quantities
- Complete questionnaires for personalized perfume creation
- Multi-currency support
- Responsive design for all devices

### For Developers
- Extensible shortcode system
- Custom product bundle handling
- Session management for bundle data
- Integration with WooCommerce cart system
- Support for product variations
- Multi-language support
- Aelia Currency Switcher integration

## Installation

1. Upload the plugin files to `/wp-content/plugins/woocommerce-custom-product-bundles`
2. Activate the plugin through the WordPress admin panel
3. Ensure WooCommerce is installed and activated

## Usage

### Shortcodes

#### 1. Product Kit
```php
[woo_product_kit 
    bundle_name="Custom Kit"
    categories="olfactory-jewels"
    exclude_categories="private-collection"
    attribute_name="size"
    variations="mignon-55-ml-eau-de-parfum"
    min_fragrances="5"
    max_fragrances="-1"
    id=""
    per_row="6"
    per_page="-1"
    orderby="title"
    order="ASC"
]
```

#### 2. Custom Perfume
```php
[custom_perfume 
    bundle_name="Custom Perfume"
    category="perfumetherapy"
    exclude_categories=""
    attribute_name="size"
    variations="135-ml-eau-de-parfum,135-ml-tincture"
    min_fragrances="5"
    max_fragrances="-1"
    show_img="true"
    img_width="40px"
    img_height="40px"
    id=""
    per_row="2"
    per_page="-1"
    orderby="title"
    order="ASC"
]
```

#### 3. Perfume Therapy
```php
[perfume_therapy 
    bundle_name="Therapy Kit"
    category="perfumetherapy"
    exclude_categories=""
    attribute_name="size"
    variations="135-ml-eau-de-parfum,135-ml-tincture"
    rare_variations="personalized-rare-fragrances"
    min_fragrances="3"
    max_fragrances="7"
    show_img="true"
    img_width="40px"
    img_height="40px"
    id=""
    per_row="4"
    per_page="-1"
    orderby="title"
    order="ASC"
]
```

#### 4. Products Select List
```php
[products_select_list 
    categories="perfumetherapy,raw-materials-for-perfumery"
    exclude_categories=""
    orderby="title"
    order="ASC"
    per_page="-1"
    align="left"
]
```

## Technical Details

### File Structure
```
woocommerce-custom-product-bundles/
├── assets/
│   ├── css/
│   │   └── thps-woo-custom-product-bundle.css
│   └── js/
│       └── thps-woo-custom-product-bundle.js
├── languages/
├── woocommerce-custom-product-bundles.php
└── README.md
```

### Key Functions

#### Bundle Management
- `thps_add_cart_item_data()` - Handles bundle data in cart
- `thps_woocommerce_add_to_cart()` - Processes bundle addition to cart
- `thps_get_cart_item_from_session()` - Retrieves bundle data from session

#### Product Display
- `thps_display_products_grid()` - Renders product grid
- `thps_display_products_list()` - Renders product list
- `thps_display_products_as_select_list()` - Renders selectable product list

#### Session Management
- `set_bundle_items_in_session()` - Stores bundle items
- `get_bundle_items_from_session()` - Retrieves bundle items
- `set_bundle_total_in_session()` - Stores bundle total
- `get_bundle_total_from_session()` - Retrieves bundle total

### Hooks and Filters

#### Actions
- `woocommerce_add_to_cart`
- `woocommerce_add_order_item_meta`
- `woocommerce_cart_item_name`
- `woocommerce_checkout_cart_item_quantity`

#### Filters
- `woocommerce_add_cart_item_data`
- `woocommerce_get_cart_item_from_session`
- `wc_add_to_cart_message`

## Requirements

- WordPress 5.0 or higher
- WooCommerce 3.0 or higher
- PHP 7.2 or higher

## Known Issues

- Some WooCommerce deprecated functions are used (to be updated)
- Session management could be optimized
- Security functions need improvement

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This plugin is licensed under the GPL v2 or later.

## Support

For support, please contact the plugin author at [support@themehigh.com](mailto:support@themehigh.com)

Introduction
This document provides the information about shortcode usage and available attributes. 
When using these shortcodes in pages which doesnt support WooCommerce messages, you need to add WooCommerce message shortcode [woocommerce_messages] in a proper place (where you want to display messages) to display WooCommerce messages (ex: - error, validation messages).
Sample Product Kit
Displays products bundle, where customer can choose multiple products and purchase as a single product. 
You can control/ filter the products in each bundle using the available attributes.

[woo_product_kit]



array(
	'bundle_name'		=> '',
    	'categories' 		=> 'olfactory-jewels',
	'exclude_categories'=> 'private-collection', 
	'attribute_name'    => 'size',
	'variations'		=> 'mignon-55-ml-eau-de-parfum',	
     'min_fragrances'	=> 4,
     'max_fragrances'	=> -1,	
	'id'				=> '',
	'per_row' 		=> 6,	
	'per_page' 		=> -1,
)


Usare ; per usare pi di una categoria 
Attributes
> bundle_name: Used to override the product bundle name.
> categories: Used to retrieve and display products.
> exclude_categories: Used to exclude products from displaying.
> attribute_name: Used to retrieve and display products.
> variations: Used to retrieve and display products.
> min_fragrances: Minimum number of fragrances to be selected. Set -1 to disable this validation.
> max_fragrances: Maximum number of fragrances to be selected. Set -1 to disable this validation.
> id: The ID of the product mapped (We need a dummy product to be mapped with each bundle, we can use same product to map with multiple bundles).
> per_row: Number of products to be displayed in a row.
> per_page: Number of products to be displayed in a page.


Custom Perfume: 
Displays products in categorized lists. User can select multiple items to build a custom perfume and purchase as a single item. 
This shortcode will also display a separate list of products labelledAccessories. The products forAccessories will be retrieved using the values given for 'accessories_attribute_name' and 'accessories_attributes.
You can control/ filter the products in each bundle using the available attributes. 

[custom_perfume]



array(
	'bundle_name'		=> '',
    	'category' 		=> 'perfumetherapy',
	'exclude_categories'=> '',
	'attribute_name'    => 'size',
	'variations'		=> '135-ml-eau-de-parfum, 
135-ml-tincture, 135-ml-absolute',
	'accessories_attribute_name' 	=> 'quantity',
	'accessories_attributes' 	=> '9-vials-15-ml-with-funnel, 40-vials-1-5-ml-with-funnel',
     'min_fragrances'   => 5,
	'max_fragrances'   => -1,
     'show_img'         => true,
     'img_width'        => '40px',
	'img_height'       => '40px',
	'id'		         => '',
	'per_row'          => 2,	
	'per_page'         => -1,	
)



Attributes
> bundle_name: Used to override the product bundle name.
> category: Used to retrieve and display products.
> exclude_categories: Used to exclude products from displaying.
> attribute_name: Used to retrieve and display products.
> variations: Used to retrieve and display products.
> accessories_attribute_name: Used to retrieve and display accessories.
> accessories_attributes: Used to retrieve and display accessories.
> min_fragrances: Minimum number of fragrances to be selected. Set -1 to disable this validation.
> max_fragrances: Maximum number of fragrances to be selected. Set -1 to disable this validation.
> show_img: used to show/hide thumbnail image.
> img_width: Thumbnail image width.
> img_height: Thumbnail image height.
> id: The ID of the product mapped (We need a dummy product to be mapped with each bundle, we can use same product to map with multiple bundles).
> per_row: Number of products to be displayed in a row.
> per_page: Number of products to be displayed in a page.

Personalized Perfume
Displays products/variations in categorized lists. User can select multiple items to build a personalized perfume and purchase as a single item. 
This shortcode will also display a separate list of products from categories given as 'rare_variations'
You can control/ filter the products in each bundle using the available attributes. 

[perfume_therapy]



array(
	'bundle_name'		=> '',
    	'category' 		=> 'perfumetherapy',
	'exclude_categories'=> '',
	'attribute_name'    => 'size',
	'variations'		=> '135-ml-eau-de-parfum,135-ml-tincture,135-ml-absolute',
	'rare_variations' 	=> 'personalized-rare-fragrances',
     'min_fragrances'	=> 3,
	'max_fragrances'	=> 7,
     'show_img'          => true,
     'img_width'         => '40px',
	'img_height'        => '40px',
	'id'				=> '',
	'per_row' 		=> 4,	
	'per_page' 		=> -1,	 	
)


Attributes
> bundle_name: Used to override the product bundle name.
> category: Used to retrieve and display products.
> exclude_categories: Used to exclude products from displaying.
> attribute_name: Used to retrieve and display products.
> variations: Used to retrieve and display products.
> rare_variations: Used to retrieve and display accessories.
> min_fragrances: Minimum number of fragrances to be selected. Set -1 to disable this validation.
> max_fragrances: Maximum number of fragrances to be selected. Set -1 to disable this validation.
> show_img: used to show/hide thumbnail image.
> img_width: Thumbnail image width.
> img_height: Thumbnail image height.
> id: The ID of the product mapped (We need a dummy product to be mapped with each bundle, we can use same product to map with multiple bundles).
> per_row: Number of products to be displayed in a row.
> per_page: Number of products to be displayed in a page.
	
