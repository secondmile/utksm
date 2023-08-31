document.addEventListener('DOMContentLoaded', function () {
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.classList.add('lightbox-overlay');
    document.body.appendChild(lightboxOverlay);
  
    const perfmattersLazyYouTubes = document.querySelectorAll('.perfmatters-lazy-youtube');
    
    perfmattersLazyYouTubes.forEach(function(perfmattersLazyYouTube) {
      perfmattersLazyYouTube.addEventListener('click', function (event) {
        event.preventDefault();
        perfmattersLazyYouTube.style.zIndex = 1000; // Set z-index for the clicked element
        lightboxOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
      });
    });
  
    lightboxOverlay.addEventListener('click', function () {
      perfmattersLazyYouTubes.forEach(function(perfmattersLazyYouTube) {
        perfmattersLazyYouTube.style.zIndex = ''; // Remove z-index from all elements
      });
      lightboxOverlay.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  });
  