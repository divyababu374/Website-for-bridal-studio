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

  const testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
  let activeIndex = 0;

  const showTestimonial = (index) => {
    testimonialCards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
  };

  setInterval(() => {
    activeIndex = (activeIndex + 1) % testimonialCards.length;
    showTestimonial(activeIndex);
  }, 5000);

  const appointmentForm = document.getElementById('appointmentForm');
  const formMessage = document.getElementById('formMessage');

  appointmentForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    formMessage.textContent = 'Thank you! We will contact you shortly to confirm your appointment.';
    appointmentForm.reset();
  });
});
