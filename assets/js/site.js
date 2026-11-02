(() => {
  const header = document.querySelector('[data-header]');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px' });
    revealItems.forEach(item => observer.observe(item));
  }

  // Keep the local fallback visible if an official remote store badge cannot load.
  document.querySelectorAll('.store-official').forEach(image => {
    image.addEventListener('error', () => image.remove());
  });

  const formatCaption = text => {
    const [title, detail] = text.split('|').map(part => part.trim());
    return detail ? `<strong>${title}</strong> ${detail}` : text;
  };

  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('[data-carousel-track]');
    const viewport = carousel.querySelector('[data-carousel-viewport]');
    const slides = [...carousel.querySelectorAll('.carousel-slide')];
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const caption = carousel.querySelector('[data-carousel-caption]');
    const dotsContainer = carousel.querySelector('[data-carousel-dots]');
    let index = 0;
    let pointerStartX = null;
    let pointerStartY = null;

    const dots = slides.map((_, slideIndex) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Show screenshot ${slideIndex + 1}`);
      dot.addEventListener('click', () => goTo(slideIndex));
      dotsContainer.appendChild(dot);
      return dot;
    });

    const update = () => {
      track.style.transform = `translateX(${-index * 100}%)`;
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === index);
        dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
      });
      caption.innerHTML = formatCaption(slides[index].dataset.caption || '');
    };

    function goTo(newIndex) {
      index = (newIndex + slides.length) % slides.length;
      update();
    }

    prev.addEventListener('click', () => goTo(index - 1));
    next.addEventListener('click', () => goTo(index + 1));

    viewport.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(index - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(index + 1);
      }
    });

    viewport.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      viewport.classList.add('is-dragging');
      viewport.setPointerCapture?.(event.pointerId);
    });


    const finishPointer = event => {
      if (pointerStartX === null) return;
      const deltaX = event.clientX - pointerStartX;
      const deltaY = event.clientY - pointerStartY;
      viewport.classList.remove('is-dragging');
      pointerStartX = null;
      pointerStartY = null;

      if (Math.abs(deltaX) >= 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
        goTo(deltaX < 0 ? index + 1 : index - 1);
      }

    };

    viewport.addEventListener('pointerup', finishPointer);
    viewport.addEventListener('pointercancel', finishPointer);

    update();
  });
})();
