console.log('BIKI: editor-functions.js script loaded');

wp.domReady(function () {
   wp.blocks.registerBlockStyle('core/paragraph', {
    name: 'utkwds-fancy-link',
    label: 'Fancy Link',
  });

   wp.blocks.registerBlockStyle('core/paragraph', {
     name: 'text-shadow--double--light',
     label: 'Fancy Dark',
   });
 
   wp.blocks.registerBlockStyle('core/paragraph', {
     name: 'text-shadow--double',
     label: 'Fancy Light',
   });
 });
 