document.addEventListener('DOMContentLoaded', () => {
  // Preload all 5 hero images
  const heroImages = [
    'images/indhuakka1.jpeg',
    'images/indhuakka4.jpeg',
    'images/indhuakka5.jpeg',
    'images/indhuakka.jpeg',
    'images/indhuakka6.jpeg'
  ];
  heroImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Hero Slideshow Logic
  const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
  const heroContent = document.querySelector('.hero-content');
  const eyebrowEl = heroContent?.querySelector('.luxury-eyebrow');
  const titleEl = heroContent?.querySelector('.luxury-title');
  const descEl = heroContent?.querySelector('.luxury-description');
  const activeNumEl = document.getElementById('heroActiveNum');
  const heroSection = document.querySelector('.luxury-hero');

  let activeSlideIndex = 0;
  let slideshowInterval = null;

  const slideContent = [
    {
      eyebrow: "INDHU BRIDAL STUDIO & BEAUTY CARE",
      title: "Luxury Bridal Makeup for Your Special Day",
      description: "From elegant bridal makeovers to flawless traditional styling, we create timeless looks that make every bride feel beautiful, confident, and unforgettable.",
      isBright: false
    },
    {
      eyebrow: "Professional Makeup Artistry",
      title: "Beauty in Every Brush Stroke",
      description: "Every bridal makeover is crafted with precision, premium products, and attention to every detail to bring your dream bridal look to life.",
      isBright: true
    },
    {
      eyebrow: "Complete Bridal Styling",
      title: "Bridal Hair, Jewellery & Saree Draping",
      description: "From elegant hairstyles and floral arrangements to jewellery styling and saree draping, we perfect every detail for a graceful bridal appearance.",
      isBright: false
    },
    {
      eyebrow: "Meet Your Bridal Artist",
      title: "Indhu Bridal Studio & Beauty Care",
      description: "Serving brides with passion and professionalism, we specialize in creating elegant bridal looks that blend tradition, beauty, and confidence for your most memorable moments.",
      isBright: true
    },
    {
      eyebrow: "Creating Beautiful Memories",
      title: "Because Every Bride Deserves Perfection",
      description: "Whether it's your wedding, engagement, reception, or special celebration, our expert beauty services ensure you look your absolute best.",
      isBright: false
    }
  ];

  const startSlideshow = () => {
    if (slideshowInterval) clearInterval(slideshowInterval);
    slideshowInterval = setInterval(() => {
      // 0.0s: Fade out text
      heroContent?.classList.add('text-fade-out');

      // 0.3s: Image crossfade begins
      setTimeout(() => {
        heroSlides[activeSlideIndex].classList.remove('active');
        activeSlideIndex = (activeSlideIndex + 1) % heroSlides.length;
        heroSlides[activeSlideIndex].classList.add('active');
      }, 300);

      // 0.8s: Fade in new text with updated content
      setTimeout(() => {
        if (eyebrowEl && titleEl && descEl) {
          const nextContent = slideContent[activeSlideIndex];
          eyebrowEl.textContent = nextContent.eyebrow;
          titleEl.textContent = nextContent.title;
          descEl.textContent = nextContent.description;

          const topBar = document.getElementById('mobileTopBar');
          if (topBar) {
            topBar.classList.toggle('bright-bg', nextContent.isBright);
          }
        }

        if (activeNumEl) {
          activeNumEl.textContent = String(activeSlideIndex + 1).padStart(2, '0');
        }

        heroContent?.classList.remove('text-fade-out');
      }, 800);

    }, 5000);
  };

  const stopSlideshow = () => {
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      slideshowInterval = null;
    }
  };

  if (heroSlides.length > 0) {
    startSlideshow();

    // if (heroSection) {
    //   heroSection.addEventListener('mouseenter', stopSlideshow);
    //   heroSection.addEventListener('mouseleave', startSlideshow);
    // }
  }

  // UI Sound Synthesizer (Web Audio API)
  const playMenuSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // High frequency mechanical click
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(2500, ctx.currentTime);
      clickOsc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.02);

      clickGain.gain.setValueAtTime(0.008, ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start();
      clickOsc.stop(ctx.currentTime + 0.03);

      // Low soft air whoosh
      const whooshOsc = ctx.createOscillator();
      const whooshGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      whooshOsc.type = 'triangle';
      whooshOsc.frequency.setValueAtTime(120, ctx.currentTime);
      whooshOsc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.12);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, ctx.currentTime);

      whooshGain.gain.setValueAtTime(0.025, ctx.currentTime);
      whooshGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

      whooshOsc.connect(filter);
      filter.connect(whooshGain);
      whooshGain.connect(ctx.destination);

      whooshOsc.start();
      whooshOsc.stop(ctx.currentTime + 0.16);
    } catch (e) {
      console.warn("Audio Context playback blocked or not supported:", e);
    }
  };

  // Floating Nav Scroll Logic (Desktop & Mobile Top Bar Scrolled State)
  const floatingNav = document.getElementById('floatingNav');
  const mobileTopBar = document.getElementById('mobileTopBar');
  const sections = Array.from(document.querySelectorAll('header[id], section[id]'));
  const desktopLinks = Array.from(document.querySelectorAll('.floating-links a'));

  const checkScroll = () => {
    const scrollY = window.scrollY;

    // Show desktop pill navbar
    if (scrollY > 90) {
      floatingNav?.classList.add('show');
    } else {
      floatingNav?.classList.remove('show');
    }

    // Add glassmorphism scrolled state to mobile top bar
    if (scrollY > 50) {
      mobileTopBar?.classList.add('scrolled');
    } else {
      mobileTopBar?.classList.remove('scrolled');
    }

    // Highlight active link on desktop nav
    let currentSectionId = 'home';
    const scrollPos = scrollY + 150;
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    desktopLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + currentSectionId || (href === '#gallery' && currentSectionId === 'gallery')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();

  // Mobile Toggler Logic
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');

  const toggleMobileMenu = () => {
    const isOpen = document.body.classList.toggle('mobile-menu-open');
    mobileMenuBtn?.classList.toggle('open', isOpen);
    playMenuSound();
  };

  mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
  mobileCloseBtn?.addEventListener('click', toggleMobileMenu);
  mobileOverlay?.addEventListener('click', toggleMobileMenu);

  // Smooth scroll and auto-close helper for all nav links
  const allNavLinks = document.querySelectorAll(
    '.floating-links a, .mobile-menu-item, .btn-luxury-book, .navbar-nav .nav-link'
  );

  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();

        // If mobile menu is open, close it first
        if (document.body.classList.contains('mobile-menu-open')) {
          toggleMobileMenu();
        }

        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
});
