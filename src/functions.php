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


function fetch_counselor_form_data() {
    $counselor_specialization = '';
    $counselor_state = '';
    $counselor_country = '';

    if (class_exists('RGFormsModel')) {
        $form_id = 3; // Replace with the actual form ID
        $entries = GFAPI::get_entries($form_id);

        foreach ($entries as $entry) {
            $counselor_specialization = rgar($entry, '6');
            $counselor_state = rgar($entry, '8');
            $counselor_country = rgar($entry, '9');
            break; // Fetch the first entry only
        }
    }

    return array(
        'specialization' => $counselor_specialization,
        'state' => $counselor_state,
        'country' => $counselor_country,
    );
}

// Perform counselor query using REST API endpoint
function perform_counselor_query($specialization, $state, $country) {
    // Build query parameters
    $query_params = array(
        'post_type' => 'counselor',
        'meta_query' => array(
            'relation' => 'AND',
            array(
                'key' => 'counselor_country',
                'value' => $country,
                'compare' => '=',
            ),
            array(
                'key' => 'counselor_states',
                'value' => $state,
                'compare' => 'LIKE',
            ),
            array(
                'key' => 'counselor_specialization',
                'value' => $specialization,
                'compare' => 'LIKE',
            ),
            // Add more meta_query clauses if needed
        ),
    );

    // Build REST API request URL
    $api_url = '/wp-json/wp/v2/counselor?' . http_build_query($query_params);

    // Fetch counselor posts using the REST API
    $response = wp_remote_get($api_url);

    if (is_wp_error($response)) {
        echo 'Error fetching counselor data.';
        return '';
    }

    $counselors = json_decode(wp_remote_retrieve_body($response), true);

    ob_start();

    // Display counselor posts
    if (!empty($counselors)) {
        foreach ($counselors as $counselor) {
            echo '<h2>' . esc_html($counselor['title']['rendered']) . '</h2>';
            echo '<p>' . esc_html($counselor['content']['rendered']) . '</p>';
            // Output more ACF fields if needed
        }
    } else {
        echo 'No counselors found.';
    }

    return ob_get_clean();
}

// Shortcode for querying counselors
function counselor_search_shortcode($atts) {
    $form_data = fetch_counselor_form_data();
    return perform_counselor_query($form_data['specialization'], $form_data['state'], $form_data['country']);
}
add_shortcode('counselor_search', 'counselor_search_shortcode');

add_action('rest_api_init', 'register_counselor_data_endpoint');

add_action('rest_api_init', 'register_counselor_data_endpoint');

function register_counselor_data_endpoint() {
    register_rest_route('counselor-api/v1', '/data', array(
        'methods' => 'POST',
        'callback' => 'update_counselor_data',
        'args' => array(
            'specialization' => array(
                'required' => true,
            ),
            'state' => array(
                'required' => true,
            ),
            'country' => array(
                'required' => true,
            ),
        ),
    ));
}

function update_counselor_data($request) {
    $specialization = $request->get_param('specialization');
    $state = $request->get_param('state');
    $country = $request->get_param('country');

    // Update the stored data with the new form submission
    $stored_data = array(
        'specialization' => $specialization,
        'state' => $state,
        'country' => $country,
    );

    // Return the updated stored data as JSON response
    return rest_ensure_response($stored_data);
}
