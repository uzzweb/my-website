// Gallery Functionality
class Gallery {
    constructor() {
        this.currentImageIndex = 0;
        this.images = [];
        this.init();
    }

    init() {
        this.collectImages();
        this.bindEvents();
    }

    collectImages() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            const title = item.querySelector('.overlay-content h3')?.textContent || 'Image';
            const description = item.querySelector('.overlay-content p')?.textContent || '';
            const category = item.getAttribute('data-category') || 'all';
            
            this.images.push({
                index: index,
                title: title,
                description: description,
                category: category,
                element: item
            });
        });
    }

    bindEvents() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.filterImages(filter);
                
                // Update active button
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Gallery item clicks
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const index = Array.from(document.querySelectorAll('.gallery-item')).indexOf(item);
                this.openLightbox(index);
            });
        });

        // Lightbox events
        this.bindLightboxEvents();
    }

    filterImages(category) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease';
            } else {
                item.style.display = 'none';
            }
        });
    }

    openLightbox(index) {
        this.currentImageIndex = index;
        const modal = document.getElementById('lightboxModal');
        const image = modal.querySelector('.lightbox-image');
        const caption = modal.querySelector('.lightbox-caption');
        
        if (modal && this.images[index]) {
            const imageData = this.images[index];
            
            // Update image placeholder
            image.innerHTML = `
                <i class="fas fa-image"></i>
                <span>${imageData.title}</span>
            `;
            
            // Update caption
            caption.querySelector('h3').textContent = imageData.title;
            caption.querySelector('p').textContent = imageData.description;
            
            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeLightbox() {
        const modal = document.getElementById('lightboxModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    nextImage() {
        const visibleImages = this.images.filter(img => 
            img.element.style.display !== 'none'
        );
        
        if (visibleImages.length > 1) {
            const currentVisibleIndex = visibleImages.findIndex(img => img.index === this.currentImageIndex);
            const nextIndex = (currentVisibleIndex + 1) % visibleImages.length;
            this.openLightbox(visibleImages[nextIndex].index);
        }
    }

    prevImage() {
        const visibleImages = this.images.filter(img => 
            img.element.style.display !== 'none'
        );
        
        if (visibleImages.length > 1) {
            const currentVisibleIndex = visibleImages.findIndex(img => img.index === this.currentImageIndex);
            const prevIndex = currentVisibleIndex === 0 ? visibleImages.length - 1 : currentVisibleIndex - 1;
            this.openLightbox(visibleImages[prevIndex].index);
        }
    }

    bindLightboxEvents() {
        const modal = document.getElementById('lightboxModal');
        if (!modal) return;

        // Close button
        const closeBtn = modal.querySelector('.lightbox-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeLightbox();
            });
        }

        // Previous button
        const prevBtn = modal.querySelector('.lightbox-prev');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevImage();
            });
        }

        // Next button
        const nextBtn = modal.querySelector('.lightbox-next');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextImage();
            });
        }

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (modal.style.display === 'block') {
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.prevImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            }
        });
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const gallery = new Gallery();
    
    // Make gallery globally accessible
    window.gallery = gallery;
}); 