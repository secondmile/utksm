<?php
/**
 * This file adds functions to the utkwds WordPress theme.
 *
 * @package utkwds-sm
 * @author  WP Engine
 * @license GNU General Public License v2 or later
 * @link    https://utkwdswp.com/
 */

// Parent/Child Connection
function enqueue_child_theme_styles() {
    // Enqueue parent theme styles
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    // Enqueue child theme styles
    wp_enqueue_style('child-style', get_stylesheet_uri(), array('parent-style'));
}
add_action('wp_enqueue_scripts', 'enqueue_child_theme_styles');


// ----- Custom Gutenberg Blocks ----- //
// BIKI TODO: extract these to files that make sense rather than using this as a dumping ground
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


// Gravity forms AJAX Script (load only if it's on the page)
function enqueue_gform_ajax_script() {
    // Enqueue the jQuery library (if not already loaded by WordPress)
    wp_enqueue_script('jquery');

    // Enqueue your custom script
    wp_enqueue_script('gform-ajax-submit', get_stylesheet_directory_uri() . '/assets/js/gformAjaxSubmit.js', array('jquery'), '1.0', true);

    // Localize the script with the admin-ajax URL
    wp_localize_script('gform-ajax-submit', 'ajax_object', array('ajax_url' => admin_url('admin-ajax.php')));
}

add_action('wp_enqueue_scripts', 'enqueue_gform_ajax_script');

function add_gform_script_to_page($content) {
    if ( has_shortcode( $content, 'gravityforms' ) ) {
        wp_enqueue_script('gform-ajax-submit');
    }
    return $content;
}

add_filter('the_content', 'add_gform_script_to_page');


