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
      const message = `Hello Indhu Bridal Studio & Beauty Care,

I would like to book an appointment.

--------------------------------

👤 Name:
${name}

📞 Phone:
${phone}

📍 Venue Address:
${address}

🎉 Occasion:
${occasion}

💄 Service:
${service}

📅 Preferred Date:
${date}

🕒 Preferred Time:
${time}

📝 Additional Notes:
${notes}

--------------------------------

Please confirm my appointment.

Thank you.`;

      // Redirect to WhatsApp
      const whatsappURL = `https://wa.me/918637455316?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, '_blank');

      // Reset form and hide loading state
      appointmentForm.reset();
      loadingState?.classList.remove('is-loading');
    }, 700); // 700ms loading state
  });
});
