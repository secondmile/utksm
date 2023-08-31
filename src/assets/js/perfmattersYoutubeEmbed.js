document.addEventListener('DOMContentLoaded', function () {
    const perfmattersLazyYouTube = document.querySelector('.perfmatters-lazy-youtube');
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.classList.add('lightbox-overlay');
  
    // perfmattersLazyYouTube.classList.add('lightbox-content');

    // const lightboxContent = document.createElement('div');
    // lightboxContent.classList.add('lightbox-content');
    // lightboxContent.innerHTML = '<p>Lorem ipsum</p>'; // Optional content if that comes up
  
    // lightboxOverlay.appendChild(lightboxContent);
    document.body.appendChild(lightboxOverlay); // Append to the body
  
    perfmattersLazyYouTube.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent default click behavior
  
      lightboxOverlay.style.display = 'block'; // Show the lightbox overlay
      document.body.style.overflow = 'hidden'; // Prevent scrolling in the background
    });
  
    lightboxOverlay.addEventListener('click', function () {
      lightboxOverlay.style.display = 'none';  // Hide the lightbox overlay
      document.body.style.overflow = 'auto';    // Restore scrolling
    });
  });
  