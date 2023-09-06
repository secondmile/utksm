document.addEventListener('DOMContentLoaded', function () {
    const perfmattersLazyYouTubes = document.querySelectorAll('.perfmatters-lazy-youtube');

    if (perfmattersLazyYouTubes.length > 0) {
        const lightboxOverlay = document.createElement('div');
        lightboxOverlay.classList.add('lightbox-overlay');

        // Create a div for the exit button
        const lightboxExitButton = document.createElement('div');
        lightboxExitButton.classList.add('lightbox-overlay-exit');
        lightboxExitButton.textContent = '✕';
        lightboxOverlay.appendChild(lightboxExitButton);

        document.body.appendChild(lightboxOverlay);

        perfmattersLazyYouTubes.forEach(function (perfmattersLazyYouTube) {
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
            perfmattersLazyYouTubes.forEach(function (perfmattersLazyYouTube) {
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
    }
});
