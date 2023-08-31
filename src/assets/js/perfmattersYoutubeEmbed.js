document.addEventListener('DOMContentLoaded', function () {
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.classList.add('lightbox-overlay');
    document.body.appendChild(lightboxOverlay);
  
    const perfmattersLazyYouTubes = document.querySelectorAll('.perfmatters-lazy-youtube');
    
    perfmattersLazyYouTubes.forEach(function(perfmattersLazyYouTube) {
      perfmattersLazyYouTube.addEventListener('click', function (event) {
        event.preventDefault();
        
        // Update styles for the clicked element
        perfmattersLazyYouTube.style.zIndex = 1000;
        perfmattersLazyYouTube.style.width = '80%';
        perfmattersLazyYouTube.style.position = 'fixed';
        perfmattersLazyYouTube.style.top = 'calc(50% - (80% / 2))';
        perfmattersLazyYouTube.style.height = '80%';
        perfmattersLazyYouTube.style.left = 'calc(50% - (80% / 2))';
  
        lightboxOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
      });
    });
  
    lightboxOverlay.addEventListener('click', function () {
      perfmattersLazyYouTubes.forEach(function(perfmattersLazyYouTube) {
        perfmattersLazyYouTube.style.zIndex = '';
        perfmattersLazyYouTube.style.width = '';
        perfmattersLazyYouTube.style.position = '';
        perfmattersLazyYouTube.style.top = '';
        perfmattersLazyYouTube.style.height = '';
        perfmattersLazyYouTube.style.left = '';
      });
      lightboxOverlay.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  });
  