document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.coverflow-container');
  const track = document.querySelector('.coverflow-track');
  const slides = Array.from(document.querySelectorAll('.coverflow-slide'));
  const currentNumEl = document.querySelector('.services-counter .current-slide');
  const progressFillEl = document.querySelector('.services-progress-bar .progress-fill');

  if (!container || !track || slides.length === 0) return;

  const totalSlides = slides.length;
  let activeIndex = 0;
  let autoScrollTimer = null;
  let inactivityTimer = null;
  const autoScrollDelay = 5000; // 5 seconds
  const resumeDelay = 3000; // 3 seconds

  // Drag and Swipe state variables
  let isDragging = false;
  let startX = 0;
  let currentTranslateX = 0;
  let dragOffset = 0;
  let startTime = 0;

  // Initial layout configuration based on viewport width
  const getLayoutConfig = () => {
    const width = window.innerWidth;
    const firstCard = document.querySelector('.coverflow-slide');
    const cardWidth = firstCard ? firstCard.offsetWidth : 440;

    if (width < 576) {
      // Mobile: One main card + ~15-20% of side card peeking
      return {
        spacing: cardWidth * 0.82,
        rotateY: 10,
        translateZ: -100,
        sideOpacity: 0.6,
        sideScale: 0.88
      };
    } else if (width < 992) {
      // Tablet: Show ~1.5 cards
      return {
        spacing: cardWidth * 0.78,
        rotateY: 15,
        translateZ: -120,
        sideOpacity: 0.65,
        sideScale: 0.88
      };
    } else {
      // Desktop: Center card fully visible + prev/next partially visible (~25-30% visible)
      return {
        spacing: cardWidth * 0.72,
        rotateY: 20,
        translateZ: -150,
        sideOpacity: 0.7,
        sideScale: 0.88
      };
    }
  };

  // Update layout of all cards based on current activeIndex and current dragOffset
  const updateCoverflow = () => {
    const config = getLayoutConfig();
    const trackCenterOffset = -activeIndex * config.spacing + dragOffset;
    
    // Apply smooth tracking to the track
    track.style.transform = `translate3d(${trackCenterOffset}px, 0, 0)`;

    slides.forEach((slide, index) => {
      const offset = index - activeIndex;
      const absOffset = Math.abs(offset);
      
      // Determine if slide should be visible to prevent rendering offscreen cards
      if (absOffset <= 2) {
        slide.classList.add('visible-slide');
      } else {
        slide.classList.remove('visible-slide');
        slide.style.transform = 'translate3d(0,0,-500px) scale(0.5)';
        slide.style.opacity = '0';
        slide.style.pointerEvents = 'none';
        return;
      }

      // Calculate styles for visible slides
      let tx = index * config.spacing;
      let ty = 0;
      let tz = 0;
      let rotY = 0;
      let scale = 1;
      let opacity = 1;
      let zIndex = 10 - absOffset;

      if (offset === 0) {
        // Active Center Card
        scale = 1.05;
        opacity = 1;
        tz = 50; // Bring forward in 3D space
      } else {
        // Side Cards
        scale = config.sideScale;
        opacity = config.sideOpacity;
        rotY = offset < 0 ? config.rotateY : -config.rotateY;
        tz = config.translateZ;
      }

      // Apply transformations and styles
      slide.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) rotateY(${rotY}deg) scale(${scale})`;
      slide.style.opacity = opacity;
      slide.style.zIndex = zIndex;

      // Handle active state class for Ken Burns image zoom trigger
      if (offset === 0 && !isDragging) {
        if (!slide.classList.contains('active-slide')) {
          slide.classList.add('active-slide');
        }
      } else {
        slide.classList.remove('active-slide');
      }
    });

    // Update Counter
    if (currentNumEl) {
      const nextNumText = String(activeIndex + 1).padStart(2, '0');
      if (currentNumEl.textContent !== nextNumText) {
        currentNumEl.classList.add('num-change');
        setTimeout(() => {
          currentNumEl.textContent = nextNumText;
          currentNumEl.classList.remove('num-change');
        }, 150);
      }
    }

    // Update Progress Indicator Line Fill
    if (progressFillEl) {
      const fillPercentage = ((activeIndex + 1) / totalSlides) * 100;
      progressFillEl.style.width = `${fillPercentage}%`;
    }
  };

  // Auto-rotation function (moving right -> left, i.e., index increases)
  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollTimer = setInterval(() => {
      activeIndex = (activeIndex + 1) % totalSlides;
      updateCoverflow();
    }, autoScrollDelay);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }
  };

  // Handle user inactivity before resuming auto scroll
  const resetInactivityTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      startAutoScroll();
    }, resumeDelay);
  };

  // Dragging event handlers
  const handleDragStart = (e) => {
    isDragging = true;
    stopAutoScroll();
    if (inactivityTimer) clearTimeout(inactivityTimer);

    startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    startTime = Date.now();
    dragOffset = 0;

    // Remove transition duration temporarily for absolute real-time tracking
    track.style.transition = 'none';
    slides.forEach(slide => {
      slide.style.transition = 'none';
    });
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const deltaX = currentX - startX;
    
    // Scale deltaX down slightly for a high-end resistive drag feeling
    dragOffset = deltaX * 0.75;
    updateCoverflow();
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    isDragging = false;

    // Restore smooth spring transitions
    track.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    slides.forEach(slide => {
      slide.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), filter 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    });

    const dragThreshold = 50; // Threshold in pixels to switch cards
    const timeElapsed = Date.now() - startTime;
    
    // Check if user swiped fast (flick gesture) or dragged far enough
    if (Math.abs(dragOffset) > dragThreshold || (timeElapsed < 250 && Math.abs(dragOffset) > 15)) {
      if (dragOffset > 0 && activeIndex > 0) {
        // Dragged Right -> go to previous slide
        activeIndex--;
      } else if (dragOffset < 0 && activeIndex < totalSlides - 1) {
        // Dragged Left -> go to next slide
        activeIndex++;
      }
    }

    dragOffset = 0;
    updateCoverflow();
    resetInactivityTimer();
  };

  // Add event listeners for dragging (mouse & touch)
  container.addEventListener('mousedown', handleDragStart);
  window.addEventListener('mousemove', handleDragMove);
  window.addEventListener('mouseup', handleDragEnd);

  container.addEventListener('touchstart', handleDragStart, { passive: true });
  window.addEventListener('touchmove', handleDragMove, { passive: true });
  window.addEventListener('touchend', handleDragEnd);

  // Pause on hover, resume after 3 seconds
  container.addEventListener('mouseenter', () => {
    stopAutoScroll();
    if (inactivityTimer) clearTimeout(inactivityTimer);
  });
  container.addEventListener('mouseleave', () => {
    resetInactivityTimer();
  });

  // Resize handler to adjust peeking space responsively
  window.addEventListener('resize', () => {
    updateCoverflow();
  }, { passive: true });

  // Modal Elements
  const modal = document.getElementById('serviceModal');
  const modalImage = document.getElementById('modalServiceImage');
  const modalTitle = document.getElementById('modalServiceTitle');
  const modalDesc = document.getElementById('modalServiceDesc');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalOverlay = document.getElementById('modalOverlay');

  const openModal = (card) => {
    const imgEl = card.querySelector('.card-image-wrapper img');
    const titleEl = card.querySelector('.card-content-wrapper h3');
    const descEl = card.querySelector('.card-content-wrapper p');

    if (modal && imgEl && titleEl && descEl) {
      modalImage.src = imgEl.src;
      modalImage.alt = imgEl.alt;
      modalTitle.textContent = titleEl.textContent;
      modalDesc.textContent = descEl.textContent;
      
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      stopAutoScroll();
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      resetInactivityTimer();
    }
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Luxury ripple click animation on individual cards
  const cards = document.querySelectorAll('.luxury-service-card');
  cards.forEach(card => {
    // Add WhatsApp Enquiry trigger for the Enquire Now button
    const whatsappBtn = card.querySelector('.btn-card-whatsapp');
    whatsappBtn?.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent modal opening/slide changing
      e.preventDefault();
      const serviceName = card.querySelector('h3').textContent.trim();
      const message = `Hello Indhu Bridal Studio,\n\nI am interested in your ${serviceName} service.\n\nCould you please share the package details, pricing and available dates?\n\nThank you.`;
      const url = `https://wa.me/919342491694?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });

    card.addEventListener('click', (e) => {
      // 1. Ripple Animation creation
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.classList.add('card-ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      // Set diameter of the ripple
      const diameter = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${diameter}px`;
      ripple.style.transform = 'translate(-50%, -50%) scale(0)';

      card.appendChild(ripple);

      // Clean up ripple element
      setTimeout(() => {
        ripple.remove();
      }, 600);

      // 2. Pause auto scroll and reset timer (interactive event)
      stopAutoScroll();
      resetInactivityTimer();

      // 3. Carousel index adjustment if tapping a side card, else open modal
      const parentSlide = card.closest('.coverflow-slide');
      if (parentSlide) {
        const slideIndex = slides.indexOf(parentSlide);
        if (slideIndex !== -1) {
          if (slideIndex !== activeIndex) {
            e.preventDefault();
            activeIndex = slideIndex;
            updateCoverflow();
          } else {
            // Tapped active card -> Enlarge/Open detail modal
            openModal(card);
          }
        }
      }
    });
  });

  // Initialize
  updateCoverflow();
  startAutoScroll();
});
