<?php
/**
 * This file adds functions to the utkwds WordPress theme.
 *
 * @package utkwds-sm
 * @author  WP Engine
 * @license GNU General Public License v2 or later
 * @link    https://utkwdswp.com/
 */

// ----- Parent/Child Connection ----- //
function enqueue_child_theme_styles() {
    // Enqueue parent theme styles
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    // Enqueue child theme styles
    wp_enqueue_style('child-style', get_stylesheet_uri(), array('parent-style'));
}
add_action('wp_enqueue_scripts', 'enqueue_child_theme_styles');

// ----- Custom Image Sizes ----- //
function custom_image_sizes() {
    add_image_size('square_crop', 500, 500, true);
}
add_action('after_setup_theme', 'custom_image_sizes');


// ----- Custom Gutenberg Blocks ----- //
wp_register_style( 'sm-block-style',  get_stylesheet_directory_uri() .'/assets/css/blocks.css', array(), null, 'all' );

// Registers the block
register_block_style(
	'core/paragraph', array(
	'name' => 'text-shadow--double',
	'label' => 'Fancy Dark',
	'style_handle' => 'sm-block-style',
	'is_default' => false,
));

register_block_style(
	'core/paragraph', array(
	'name' => 'text-shadow--double--light',
	'label' => 'Fancy Light',
	'style_handle' => 'sm-block-style',
	'is_default' => false,
));

register_block_style(
	'core/button', array(
	'name' => 'sm--fancy-link',
	'label' => __( 'Fancy Link', 'wp-rig' ),
	'style_handle' => 'sm-block-style',
));

// Connects JS (api) and css (style) to the new block
function sm_custom_blocks() {
    $theme_url = get_stylesheet_directory_uri();
    $js_file_path = get_stylesheet_directory() . '/assets/js/editor-functions.js';
    $css_file_path = get_stylesheet_directory() . '/assets/css/blocks.css';

    wp_enqueue_script(
        'myguten-script',
        $theme_url . '/assets/js/editor-functions.js',
        array( 'wp-blocks', 'wp-dom-ready', 'wp-edit-post' ),
		file_exists( $js_file_path ) ? filemtime( $js_file_path ) : ''
    );

    wp_enqueue_style(
        'sm-block-style',
        $theme_url . '/assets/css/blocks.css',
        null,
		file_exists( $css_file_path ) ? filemtime( $css_file_path ) : ''
    );
}

// Activates in the editor and on the page itself
add_action( 'enqueue_block_editor_assets', 'sm_custom_blocks' );
add_action( 'wp_enqueue_scripts', 'sm_custom_blocks' );


// ----- Gravity Forms + ACF => Filter ----- //
// Enqueue the necessary scripts
function enqueue_scripts() {
    wp_enqueue_script('jquery');
    
     // Enqueue ACF's core script for API access
    //  wp_enqueue_script('acf');

     // Enqueue your custom script with ACF as a dependency
     wp_enqueue_script('gform-ajax-submit', get_stylesheet_directory_uri() . '/assets/js/gformAjaxSubmit.js', array('jquery', 'acf'), '1.0', true);
     wp_enqueue_script('perfmatters-youtube-embed', get_stylesheet_directory_uri() . '/assets/js/perfmattersYoutubeEmbed.js', array('jquery', 'acf'), '1.0', true);
}
add_action('wp_enqueue_scripts', 'enqueue_scripts');

// Add custom API data for counselor post type (images, objects, taxonomies)
// BIKI -- ref this for taxonomy later
function modify_counselor_api_data($data, $post, $request) {
    if ($post->post_type === 'counselor') {
        $counselor_image_array = get_field('counselor_image', $data->data['id']);
        
        if (is_array($counselor_image_array) && isset($counselor_image_array)) {
            $counselor_image_url = $counselor_image_array['sizes']['square_crop'];
            
            if ($counselor_image_url !== null) {
                $data->data['acf']['counselor_image_url'] = $counselor_image_url;
            } else {
                // Use a default image URL if counselor_image_url is not available
                $defaultImageURL = get_stylesheet_directory_uri() . '/assets/images/counselor--default-image.png';
                $data->data['acf']['counselor_image_url'] = $defaultImageURL;
            }
        } else {
            // Use a default image URL if counselor_image is not set
            $defaultImageURL = get_stylesheet_directory_uri() . '/assets/images/counselor--default-image.png';
            $data->data['acf']['counselor_image_url'] = $defaultImageURL;
        }
    }

    return $data;
}


// Apply the modification to "counselor" custom post type API during WordPress initialization
add_action('init', function() {
    add_filter('rest_prepare_counselor', 'modify_counselor_api_data', 10, 3);
});

// Removes Gravity Form Submit Button
add_filter( 'gform_submit_button_3', '__return_empty_string' );

// Perfmatters Youtube Thumbnail image quality
add_filter('perfmatters_lazyload_youtube_thumbnail_resolution', function($resolution) {
    return 'sddefault';
});
