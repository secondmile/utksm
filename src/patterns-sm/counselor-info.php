<?php
/**
 * Title: SM -- Counselor Custom Post Type Info
 * Slug: utksm/counselor-info
 * Description: Displays counselor information
 * Categories: template
 * Keywords: counselor
 * Viewport Width: 1500 
 * Block Types: 
 * Post Types: 
 * Inserter: true
 */

?>

<?php

// We're outside the loop, so grab the ID le scrappy way
$current_url = esc_url($_SERVER['REQUEST_URI']);
$post_id = url_to_postid($current_url);

if (get_post_type($post_id) === 'counselor' && $post_id) {
    function get_acf_fields_by_type($post_id = null) {
        $acf_fields = get_fields($post_id); // Get all ACF fields for the post

        $fields_by_type = array(
            'string' => array(),
            'number' => array(),
            'array' => array(),
        );

        // Loop through each ACF field and categorize by data type
        foreach ($acf_fields as $field_name => $field_value) {
            if (is_string($field_value)) {
                $fields_by_type['string'][$field_name] = $field_value;
            } elseif (is_numeric($field_value)) {
                $fields_by_type['number'][$field_name] = $field_value;
            } elseif (is_array($field_value)) {
                $fields_by_type['array'][$field_name] = $field_value;
            }
        }

        return $fields_by_type;
    }

    $current_url = esc_url($_SERVER['REQUEST_URI']);
    $post_id = url_to_postid($current_url);
    $fields = get_acf_fields_by_type($post_id);

    // echo "<pre>";
    // print_r($fields);
    // echo "</pre>";

    function get_term_names_as_list($term_ids) {
        if (!is_array($term_ids)) {
            return ''; // Return an empty string if $term_ids is not an array
        }
    
        $term_names = array();
    
        foreach ($term_ids as $term_id) {
            $term = get_term($term_id);
            if ($term && !is_wp_error($term)) {
                $term_names[] = '<!-- wp:list-item --><li>' . esc_html($term->name) . '</li><!-- /wp:list-item -->';
            }
        }
    
        if (!empty($term_names)) {
            $list = '<!-- wp:list --><ul>' . implode('', $term_names) . '</ul><!-- /wp:list -->';
        } else {
            $list = ''; // No terms found, return an empty string
        }
    
        return $list;
    }

    $defaultImageURL = get_stylesheet_directory_uri() . '/assets/images/counselor--default-image.png';
    
    $counselor_title = isset($fields['string']['counselor_title']) ? $fields['string']['counselor_title'] : '';
    $counselor_image = isset($fields['array']['counselor_image']['sizes']['large']) ? $fields['array']['counselor_image']['sizes']['large'] : $defaultImageURL;
    $counselor_image_height = isset($fields['array']['counselor_image']['sizes']['large-height']) ? $fields['array']['counselor_image']['sizes']['large-height'] : '';
    $counselor_image_width = isset($fields['array']['counselor_image']['sizes']['large-width']) ? $fields['array']['counselor_image']['sizes']['large-width'] : '';
    $counselor_states = isset($fields['array']['counselor_states']) ? get_term_names_as_list($fields['array']['counselor_states']) : '';
    $counselor_specialization = isset($fields['array']['counselor_specialization']) ? get_term_names_as_list($fields['array']['counselor_specialization']) : '';
    $counselor_misc = isset($fields['string']['counselor_misc']) ? $fields['string']['counselor_misc'] : '';
    $counselor_schools_blount = isset($fields['array']['schools-blount']) ? get_term_names_as_list($fields['array']['schools-blount']) : '';
    $counselor_schools_hamilton = isset($fields['array']['schools-hamilton']) ? get_term_names_as_list($fields['array']['schools-hamilton']) : '';
    $counselor_schools_knox = isset($fields['array']['schools-knox']) ? get_term_names_as_list($fields['array']['schools-knox']) : '';
    $counselor_schools_montgomery = isset($fields['array']['schools-montgomery']) ? get_term_names_as_list($fields['array']['schools-montgomery']) : '';
    $counselor_schools_davidson = isset($fields['array']['schools-davidson']) ? get_term_names_as_list($fields['array']['schools-davidson']) : '';
    $counselor_schools_shelby = isset($fields['array']['schools-shelby']) ? get_term_names_as_list($fields['array']['schools-shelby']) : '';

    $counties_in_tennessee = !empty($fields['array']['counties-in-tennessee']) ? get_term_names_as_list($fields['array']['counties-in-tennessee']) : '';
    $counties_in_california = !empty($fields['array']['counties-in-california']) ? get_term_names_as_list($fields['array']['counties-in-california']) : '';
    $counties_in_texas = !empty($fields['array']['counties-in-texas']) ? get_term_names_as_list($fields['array']['counties-in-texas']) : '';
    $counties_in_georgia = !empty($fields['array']['counties-in-georgia']) ? get_term_names_as_list($fields['array']['counties-in-georgia']) : '';
    $counties_in_north_carolina = !empty($fields['array']['counties-in-north-carolina']) ? get_term_names_as_list($fields['array']['counties-in-north-carolina']) : '';
    $schools_in_blount = !empty($fields['array']['schools-blount']) ? get_term_names_as_list($fields['array']['schools-blount']) : '';
    $schools_in_hamilton = !empty($fields['array']['schools-hamilton']) ? get_term_names_as_list($fields['array']['schools-hamilton']) : '';
    $schools_in_knox = !empty($fields['array']['schools-knox']) ? get_term_names_as_list($fields['array']['schools-knox']) : '';
    $schools_in_montgomery = !empty($fields['array']['schools-montgomery']) ? get_term_names_as_list($fields['array']['schools-montgomery']) : '';
    $schools_in_davidson = !empty($fields['array']['schools-davidson']) ? get_term_names_as_list($fields['array']['schools-davidson']) : '';
    $schools_in_shelby = !empty($fields['array']['schools-shelby']) ? get_term_names_as_list($fields['array']['schools-shelby']) : '';

    $hide_school_data = strip_tags($counselor_specialization) === "International Student" ? true : false;

    function generate_counties_html($title, $content) {
        if (!empty($content)) {
            return "
                <h4 class='wp-block-heading has-small-font-size'><strong>$title</strong></h4>
                $content
            ";
        }
    
        return '';
    }
}

?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|large","bottom":"var:preset|spacing|large","left":"var:preset|spacing|small","right":"var:preset|spacing|small"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignfull" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--large);padding-right:var(--wp--preset--spacing--small);padding-bottom:var(--wp--preset--spacing--large);padding-left:var(--wp--preset--spacing--small)"><!-- wp:group {"style":{"spacing":{"padding":{"bottom":"0","left":"0","right":"0"}}},"layout":{"type":"constrained","wideSize":"1500px"}} -->
<div class="wp-block-group" style="padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"spacing":{"padding":{"right":"0","left":"0"},"blockGap":{"left":"var:preset|spacing|large"}}}} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center" style="padding-right:0;padding-left:0"><!-- wp:column {"verticalAlignment":"center","width":"50%","style":{"spacing":{"padding":{"top":"0","right":"0","bottom":"0","left":"0"}}},"layout":{"type":"default"}} -->
<div class="wp-block-column is-vertically-aligned-center" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;flex-basis:40%"><!-- wp:image {"align":"full","id":2273,"aspectRatio":"1","scale":"cover","sizeSlug":"full","linkDestination":"none","className":"box-shadow__top-right\u002d\u002dlarge"} -->
<figure class="wp-block-image alignfull size-full box-shadow__top-right--large"><img src="<?= $counselor_image; ?>" alt="" class="" width="<?= $counselor_image_width; ?>" height="<?= $counselor_image_height; ?>" style="aspect-ratio:1;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"60%","style":{"spacing":{"padding":{"top":"var:preset|spacing|medium","bottom":"var:preset|spacing|medium","left":"var:preset|spacing|medium","right":"var:preset|spacing|medium"}}},"backgroundColor":"light"} -->
<div class="wp-block-column is-vertically-aligned-center has-light-background-color has-background" style="padding-top:var(--wp--preset--spacing--medium);padding-right:var(--wp--preset--spacing--medium);padding-bottom:var(--wp--preset--spacing--medium);padding-left:var(--wp--preset--spacing--medium);flex-basis:60%"><!-- wp:group {"layout":{"type":"constrained","wideSize":"","justifyContent":"left"}} -->
<div class="wp-block-group"><!-- wp:heading {"textAlign":"left","style":{"spacing":{"margin":{"bottom":"0px"}}},"className":"wp-block-heading"} -->
<h1 class="x-text wp-block-heading has-text-align-left" style="margin-bottom:0px"><?= get_the_title($post_id); ?></h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"smokey","fontSize":"small"} -->
<p class="has-smokey-color has-text-color has-small-font-size"><strong><?= $counselor_title; ?></strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"left","className":"is-style-utkwds-fancy-link","fontSize":"normal"} -->
<p class="has-text-align-left is-style-utkwds-fancy-link has-normal-font-size"><?= $counselor_misc; ?></p>

<?php

if ($hide_school_data) {
    // No button or school data for you
} else {
    // Button linking to school data
?>
<hr>
<div class="wp-block-group alignwide utkwds-jump-link-group has-global-padding is-layout-constrained wp-container-15 wp-block-group-is-layout-constrained" style="border-style:none;border-width:0px;padding-top:var(--wp--preset--spacing--x-small);padding-right:0;padding-bottom:var(--wp--preset--spacing--x-small);padding-left:0">
    <ul class="alignleft is-style-no-disc utkwds-jump-link-list sm-jump-link-list has-small-font-size">
        <li class="has-small-font-size"><strong><a href="#more-info">See What Areas & Schools <?= strip_tags(get_the_title($post_id)); ?> Supports</a></strong></li>
    </ul>
</div>
<?php } ?>
<!-- /wp:paragraph -->
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->


<?php
// Everything beyond this point displays school data -- some counselors don't have that data and we need to show/hide this section conditionally.

if ( $hide_school_data ) {
    // Display nothing
} else {
    ?>

    <!-- wp:block {"ref":437} /-->

    <!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|large","bottom":"var:preset|spacing|large","left":"var:preset|spacing|small","right":"var:preset|spacing|small"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"default"}} -->
    <div id="more-info" class="wp-block-group alignfull" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--large);padding-right:var(--wp--preset--spacing--small);padding-bottom:var(--wp--preset--spacing--large);padding-left:var(--wp--preset--spacing--small)"><!-- wp:group {"layout":{"type":"constrained"}} -->
    <div class="wp-block-group"><!-- wp:columns -->

    <div class="wp-block-columns"><!-- wp:column -->
    <div class="wp-block-column"><!-- wp:heading {"level":4,"fontSize":"small"} -->
    <!-- /wp:heading -->
    <!-- wp:list -->
    <?php
        echo !empty($counselor_states) ? generate_counties_html('States', $counselor_states) : '';
    ?>
    </div>
    <!-- /wp:column -->

    <!-- wp:column -->
    <div class="wp-block-column"><!-- wp:heading {"level":4,"fontSize":"small"} -->
    <!-- /wp:heading -->
    <?php 
        echo !empty($counties_in_tennessee) ? generate_counties_html('Counties in Tennessee', $counties_in_tennessee) : '';
        echo !empty($counties_in_california) ? generate_counties_html('Counties in California', $counties_in_california) : '';
        echo !empty($counties_in_texas) ? generate_counties_html('Counties in Texas', $counties_in_texas) : '';
        echo !empty($counties_in_georgia) ? generate_counties_html('Counties in Georgia', $counties_in_georgia) : '';
        echo !empty($counties_in_north_carolina) ? generate_counties_html('Counties in North Carolina', $counties_in_north_carolina) : '';
    ?>
    </div>
    <!-- /wp:column -->

    <!-- wp:column -->
    <div class="wp-block-column"><!-- wp:heading {"level":4,"fontSize":"small"} -->
    <!-- /wp:heading -->
    <?php 
        echo !empty($schools_in_knox) ? generate_counties_html('Schools in Knox County', $schools_in_knox) : '';
        echo !empty($schools_in_blount) ? generate_counties_html('Schools in Blount County', $schools_in_blount) : '';
        echo !empty($schools_in_davidson) ? generate_counties_html('Schools in Davidson County', $schools_in_davidson) : '';
        echo !empty($schools_in_hamilton) ? generate_counties_html('Schools in Hamilton County', $schools_in_hamilton) : '';
        echo !empty($schools_in_montgomery) ? generate_counties_html('Schools in Montgomery County', $schools_in_montgomery) : '';
        echo !empty($schools_in_shelby) ? generate_counties_html('Schools in Shelby County', $schools_in_shelby) : '';
    ?>
    </div>
    <!-- /wp:column -->
    <!-- /wp:columns --></div>
    <!-- /wp:group --></div>
    <!-- /wp:group -->
<?php } ?>
