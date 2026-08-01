document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const scrollTopBtn = document.getElementById('scrollTop');
  const showButton = () => {
    if (window.scrollY > 500) {
      scrollTopBtn?.classList.add('show');
    } else {
      scrollTopBtn?.classList.remove('show');
    }
  };

  window.addEventListener('scroll', showButton);
  showButton();

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
      const message = `*🌸 INDHU BRIDAL STUDIO & BEAUTY CARE*

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
    }, 700); // 700ms loading state
  });

  // Scroll to Booking Form on "Book Now" click
  const floatingBookBtn = document.getElementById('floatingBookBtn');
  const bookingFormCard = appointmentForm?.closest('.contact-card');

  floatingBookBtn?.addEventListener('click', () => {
    if (bookingFormCard) {
      // Smoothly scroll form into center of viewport
      bookingFormCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

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
