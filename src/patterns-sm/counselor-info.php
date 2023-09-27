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
    
    $counselor_title = $fields['string']['counselor_title'];
    $counselor_image = $fields['array']['counselor_image']['sizes']['large'];
    $counselor_image_height = $fields['array']['counselor_image']['sizes']['large-height'];
    $counselor_image_width = $fields['array']['counselor_image']['sizes']['large-width'];
    $counselor_states = get_term_names_as_list($fields['array']['counselor_states']);
    $counselor_specialization = get_term_names_as_list($fields['array']['counselor_specialization']);
    
    $counties_in_tennessee = !empty($fields['array']['counties-in-tennessee']) ? get_term_names_as_list($fields['array']['counties-in-tennessee']) : '';
    $counties_in_california = !empty($fields['array']['counties-in-california']) ? get_term_names_as_list($fields['array']['counties-in-california']) : '';
    $counties_in_texas = !empty($fields['array']['counties-in-texas']) ? get_term_names_as_list($fields['array']['counties-in-texas']) : '';
    $counties_in_georgia = !empty($fields['array']['counties-in-georgia']) ? get_term_names_as_list($fields['array']['counties-in-georgia']) : '';
    $counties_in_north_carolina = !empty($fields['array']['counties-in-north-carolina']) ? get_term_names_as_list($fields['array']['counties-in-north-carolina']) : '';

    function generate_counties_html($title, $content) {
        if (!empty($content)) {
            return "
                <h4 class='wp-block-heading has-small-font-size'><strong>$title</strong></h4>
                $content
            ";
        }
    
        return '';
    }
?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|large","bottom":"var:preset|spacing|large","left":"var:preset|spacing|small","right":"var:preset|spacing|small"},"margin":{"top":"0","bottom":"0"}}},"className":"background-texture__excitement","layout":{"type":"default"}} -->
<div class="wp-block-group alignfull background-texture__excitement" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--large);padding-right:var(--wp--preset--spacing--small);padding-bottom:var(--wp--preset--spacing--large);padding-left:var(--wp--preset--spacing--small)"><!-- wp:group {"style":{"spacing":{"padding":{"bottom":"0","left":"0","right":"0"}}},"layout":{"type":"constrained","wideSize":"1500px"}} -->
<div class="wp-block-group" style="padding-right:0;padding-bottom:0;padding-left:0"><!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"spacing":{"padding":{"right":"0","left":"0"},"blockGap":{"left":"var:preset|spacing|large"}}},"className":"is-style-columns-reverse"} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center is-style-columns-reverse" style="padding-right:0;padding-left:0"><!-- wp:column {"verticalAlignment":"center","width":"50%","style":{"spacing":{"padding":{"top":"0","right":"0","bottom":"0","left":"0"}}},"layout":{"type":"default"}} -->
<div class="wp-block-column is-vertically-aligned-center" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;flex-basis:50%"><!-- wp:image {"align":"full","id":2273,"aspectRatio":"1","scale":"cover","sizeSlug":"full","linkDestination":"none","className":"box-shadow__top-right\u002d\u002dlarge"} -->
<figure class="wp-block-image alignfull size-full box-shadow__top-right--large"><img src="<?= $counselor_image; ?>" alt="" class="" width="<?= $counselor_image_width; ?>" height="<?= $counselor_image_height; ?>" style="aspect-ratio:1;object-fit:cover"/></figure>
<!-- /wp:image --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"50%","style":{"spacing":{"padding":{"top":"var:preset|spacing|medium","bottom":"var:preset|spacing|medium","left":"var:preset|spacing|medium","right":"var:preset|spacing|medium"}}},"backgroundColor":"light"} -->
<div class="wp-block-column is-vertically-aligned-center has-light-background-color has-background" style="padding-top:var(--wp--preset--spacing--medium);padding-right:var(--wp--preset--spacing--medium);padding-bottom:var(--wp--preset--spacing--medium);padding-left:var(--wp--preset--spacing--medium);flex-basis:50%"><!-- wp:group {"layout":{"type":"constrained","wideSize":"","justifyContent":"left"}} -->
<div class="wp-block-group"><!-- wp:heading {"textAlign":"left","style":{"spacing":{"margin":{"bottom":"0px"}}},"className":"wp-block-heading"} -->
<h2 class="wp-block-heading has-text-align-left" style="margin-bottom:0px"><?= get_the_title($post_id); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"smokey","fontSize":"small"} -->
<p class="has-smokey-color has-text-color has-small-font-size"><strong><?= $counselor_title; ?></strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"left","className":"is-style-utkwds-fancy-link","fontSize":"normal"} -->
<p class="has-text-align-left is-style-utkwds-fancy-link has-normal-font-size">[make this when db overlap isn't an issue, biki] Freeform content they can add as they want, including copy and links.<br><br><a href="https://utk-admissions.local/why-ut/undergraduate-academics/">Custom Link via WYSIWYG</a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"left","className":"is-style-utkwds-fancy-link","fontSize":"normal"} -->
<p class="has-text-align-left is-style-utkwds-fancy-link has-normal-font-size"><a href="https://utk-admissions.local/why-ut/undergraduate-programs-majors/">Another Link</a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:block {"ref":437} /-->

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|large","bottom":"var:preset|spacing|large","left":"var:preset|spacing|small","right":"var:preset|spacing|small"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignfull" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--large);padding-right:var(--wp--preset--spacing--small);padding-bottom:var(--wp--preset--spacing--large);padding-left:var(--wp--preset--spacing--small)"><!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {"level":4,"fontSize":"small"} -->
<h4 class="wp-block-heading has-small-font-size"><strong>States</strong></h4>
<!-- /wp:heading -->

<!-- wp:list -->
<?= $counselor_states; ?>

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
    echo !empty($counties_in_north_carolina) ? generate_counties_html('Counties in Nort Carolina', $counties_in_north_carolina) : '';

?>
</div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {"level":4,"fontSize":"small"} -->
<h4 class="wp-block-heading has-small-font-size"><strong>Schools in {County 1}</strong></h4>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading {"level":4,"fontSize":"small"} -->
<h4 class="wp-block-heading has-small-font-size"><strong>Schools in {county2}</strong></h4>
<!-- /wp:heading -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>School 3</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->