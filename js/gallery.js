/**
 * Afton King Art Gallery - Lightbox Functionality
 */

(function() {
    'use strict';

    // DOM Elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const closeButton = document.querySelector('.lightbox-close');
    const artworkItems = document.querySelectorAll('.artwork');

    /**
     * Open the lightbox with the selected artwork
     * @param {string} imageSrc - Source URL of the image
     * @param {string} title - Title of the artwork
     */
    function openLightbox(imageSrc, title) {
        lightboxImage.src = imageSrc;
        lightboxImage.alt = title;
        lightboxTitle.textContent = title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus the close button for accessibility
        closeButton.focus();
    }

    /**
     * Close the lightbox
     */
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';

        // Clear image source after transition
        setTimeout(() => {
            if (!lightbox.classList.contains('active')) {
                lightboxImage.src = '';
            }
        }, 300);
    }

    /**
     * Handle click events on artwork items
     * @param {Event} event - Click event
     */
    function handleArtworkClick(event) {
        const artwork = event.currentTarget;
        const img = artwork.querySelector('img');
        const title = artwork.dataset.title || artwork.querySelector('.artwork-title')?.textContent || 'Artwork';

        if (img && img.src) {
            openLightbox(img.src, title);
        }
    }

    /**
     * Handle keyboard events
     * @param {KeyboardEvent} event - Keyboard event
     */
    function handleKeydown(event) {
        if (event.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    }

    /**
     * Handle click on lightbox background (close on outside click)
     * @param {Event} event - Click event
     */
    function handleLightboxClick(event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    }

    // Event Listeners

    // Artwork click handlers
    artworkItems.forEach(artwork => {
        artwork.addEventListener('click', handleArtworkClick);

        // Keyboard accessibility
        artwork.setAttribute('tabindex', '0');
        artwork.setAttribute('role', 'button');
        artwork.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleArtworkClick(e);
            }
        });
    });

    // Close button
    closeButton.addEventListener('click', closeLightbox);

    // Click outside to close
    lightbox.addEventListener('click', handleLightboxClick);

    // Keyboard: Escape to close
    document.addEventListener('keydown', handleKeydown);

    // Touch support: swipe down to close
    let touchStartY = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchEndY - touchStartY;

        // Swipe down more than 100px to close
        if (deltaY > 100) {
            closeLightbox();
        }
    }, { passive: true });

})();
