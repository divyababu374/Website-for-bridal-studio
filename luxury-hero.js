document.addEventListener('DOMContentLoaded', () => {
  // Hero Slideshow Logic
  const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
  let activeSlideIndex = 0;

  if (heroSlides.length > 0) {
    setInterval(() => {
      heroSlides[activeSlideIndex].classList.remove('active');
      activeSlideIndex = (activeSlideIndex + 1) % heroSlides.length;
      heroSlides[activeSlideIndex].classList.add('active');
    }, 5000);
  }

  // Floating Nav Scroll Logic
  const floatingNav = document.getElementById('floatingNav');

  const checkScroll = () => {
    if (window.scrollY > 90) {
      floatingNav?.classList.add('show');
    } else {
      floatingNav?.classList.remove('show');
    }
  };

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();

  // Smooth scroll helper for all nav links
  const allNavLinks = document.querySelectorAll(
    '.floating-links a, .floating-mobile-links a, .btn-floating-book, .btn-floating-book-mobile, .btn-luxury-book, .navbar-nav .nav-link'
  );
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
});
