document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const scrollTopBtn = document.getElementById('scrollTop');
  const floatingActionsStack = document.getElementById('floatingActionsStack');
  const footer = document.querySelector('footer');

  // Show Scroll-to-Top only after scrolling approximately 500px
  const showButton = () => {
    if (window.scrollY > 500) {
      scrollTopBtn?.classList.add('show');
    } else {
      scrollTopBtn?.classList.remove('show');
    }
  };

  // Prevent floating actions stack from overlapping the footer
  const adjustStackPosition = () => {
    if (!footer || !floatingActionsStack) return;
    const footerRect = footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    if (footerRect.top < viewportHeight) {
      const overlap = viewportHeight - footerRect.top;
      floatingActionsStack.style.bottom = `${overlap + 24}px`;
    } else {
      floatingActionsStack.style.bottom = '24px';
    }
  };

  window.addEventListener('scroll', () => {
    showButton();
    adjustStackPosition();
  });
  window.addEventListener('resize', adjustStackPosition);
  
  showButton();
  adjustStackPosition();

  // Testimonials Cycle
  const testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
  let activeIndex = 0;

  const showTestimonial = (index) => {
    testimonialCards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
  };

  if (testimonialCards.length > 0) {
    setInterval(() => {
      activeIndex = (activeIndex + 1) % testimonialCards.length;
      showTestimonial(activeIndex);
    }, 5000);
  }

  // Set minimum date to today
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Toast close handler
  const toastCloseBtn = document.getElementById('toastCloseBtn');
  toastCloseBtn?.addEventListener('click', () => {
    document.getElementById('whatsappToast')?.classList.remove('show');
  });

  // Appointment Form submission
  const appointmentForm = document.getElementById('appointmentForm');
  const loadingState = document.getElementById('bookingLoading');

  appointmentForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    // Retrieve input values
    const name = document.getElementById('bookingName').value.trim();
    const phone = document.getElementById('bookingPhone').value.trim();
    const address = document.getElementById('bookingAddress').value.trim();
    const occasion = document.getElementById('bookingOccasion').value;
    const service = document.getElementById('bookingService').value;
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value || 'Not specified';
    const notes = document.getElementById('bookingNotes').value.trim() || 'None';

    // Show premium loading state
    loadingState?.classList.add('is-loading');

    setTimeout(() => {
      // Format WhatsApp Message
      const message = `*🌸 INDHU BRIDAL STUDIO*

*✨ New Booking Request from website*

👤 Name: ${name}
📞 Phone: ${phone}
📍 Venue: ${address || 'Not Provided'}
🎉 Occasion: ${occasion}
💄 Service: ${service}
📅 Date: ${date}
🕒 Time: ${time}
📝 Notes: ${notes}

Please confirm my appointment at your earliest convenience.
Thank you!`;

      // Redirect to WhatsApp
      const whatsappURL = `https://wa.me/919342491694?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, '_blank');

      // Reset form and hide loading state
      appointmentForm.reset();
      loadingState?.classList.remove('is-loading');

      // Success toast reminding user to send the prepared message
      const handleFocus = () => {
        const toast = document.getElementById('whatsappToast');
        if (toast) {
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
          }, 8000); // Hide after 8 seconds
        }
        window.removeEventListener('focus', handleFocus);
      };
      setTimeout(() => {
        window.addEventListener('focus', handleFocus);
      }, 1000);
    }, 700); // 700ms loading state
  });

  // Scroll to Booking Form on "Book Now" click
  const floatingBookBtn = document.getElementById('floatingBookBtn');
  const bookingFormCard = appointmentForm?.closest('.contact-card');

  floatingBookBtn?.addEventListener('click', () => {
    if (bookingFormCard) {
      // Scroll to the booking form leaving approximately 80px of space above it rather than centering it exactly
      const offset = 80;
      const elementPosition = bookingFormCard.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Highlight form with soft green glow pulse after scroll completes
      setTimeout(() => {
        bookingFormCard.classList.add('form-green-pulse');
        
        // Desktop only: Focus name input
        if (window.innerWidth > 768) {
          const nameInput = document.getElementById('bookingName');
          nameInput?.focus();
        }

        // Clean up glow class after pulse finishes
        setTimeout(() => {
          bookingFormCard.classList.remove('form-green-pulse');
        }, 1200);
      }, 800); // Wait 800ms for smooth scroll transition to align
    }
  });
});
