(() => {
  const comparison = document.querySelector('[data-comparison]');
  if (!comparison) return;

  const slider = comparison.querySelector('[data-comparison-slider]');
  const divider = comparison.querySelector('.comparison-divider');
  const canvas = comparison.querySelector('[data-comparison-canvas]');
  const video = comparison.querySelector('[data-combined-video]');
  const playButton = comparison.querySelector('[data-comparison-play]');
  const status = document.querySelector('[data-comparison-status]');
  const context = canvas.getContext('2d', { alpha: false });
  const playbackRate = 0.65;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let playbackError = false;
  let animationFrame = 0;
  let lastDrawTime = 0;

  const draw = () => {
    if (!context || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;
    const width = Math.floor(video.videoWidth / 2);
    const height = video.videoHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const split = Math.round(width * Number(slider.value) / 100);
    if (split > 0) {
      context.drawImage(video, 0, 0, split, height, 0, 0, split, height);
    }
    if (split < width) {
      context.drawImage(video, width + split, 0, width - split, height,
                        split, 0, width - split, height);
    }
  };

  const updateSplit = () => {
    comparison.style.setProperty('--split', `${slider.value}%`);
    draw();
  };
  slider.addEventListener('input', updateSplit);

  let activePointer = null;
  const updateFromPointer = (clientX) => {
    const bounds = comparison.getBoundingClientRect();
    if (!bounds.width) return;
    const position = (clientX - bounds.left) / bounds.width;
    slider.value = String(Math.round(Math.max(0, Math.min(1, position)) * 100));
    updateSplit();
  };
  divider.addEventListener('pointerdown', (event) => {
    if (activePointer !== null || !event.isPrimary ||
        (event.pointerType === 'mouse' && event.button !== 0)) return;
    activePointer = event.pointerId;
    divider.setPointerCapture(event.pointerId);
    updateFromPointer(event.clientX);
    event.preventDefault();
  });
  divider.addEventListener('pointermove', (event) => {
    if (event.pointerId === activePointer) updateFromPointer(event.clientX);
  });
  const finishDrag = (event) => {
    if (event.pointerId !== activePointer) return;
    if (event.type === 'pointerup') updateFromPointer(event.clientX);
    activePointer = null;
    if (divider.hasPointerCapture(event.pointerId)) divider.releasePointerCapture(event.pointerId);
  };
  divider.addEventListener('pointerup', finishDrag);
  divider.addEventListener('pointercancel', finishDrag);
  divider.addEventListener('lostpointercapture', (event) => {
    if (event.pointerId === activePointer) activePointer = null;
  });

  const animate = (timestamp) => {
    animationFrame = 0;
    if (video.paused || document.hidden) return;
    if (timestamp - lastDrawTime >= 33) {
      draw();
      lastDrawTime = timestamp;
    }
    animationFrame = requestAnimationFrame(animate);
  };
  const stopDrawing = () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };
  const startDrawing = () => {
    if (!animationFrame && !document.hidden) animationFrame = requestAnimationFrame(animate);
  };

  const showPlay = (message) => {
    playButton.hidden = false;
    status.textContent = message;
  };
  const play = () => {
    if (playbackError) return;
    video.play().then(() => {
      playButton.hidden = true;
      status.textContent = '';
      draw();
      startDrawing();
    }).catch(() => showPlay('Tap Play to watch the comparison.'));
  };

  video.defaultPlaybackRate = playbackRate;
  video.playbackRate = playbackRate;
  video.muted = true;
  video.playsInline = true;
  video.addEventListener('loadeddata', draw);
  video.addEventListener('seeked', draw);
  video.addEventListener('playing', startDrawing);
  video.addEventListener('pause', stopDrawing);
  video.addEventListener('error', () => {
    playbackError = true;
    stopDrawing();
    playButton.hidden = true;
    status.textContent = 'Video playback unavailable.';
  });
  playButton.addEventListener('click', play);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      video.pause();
      stopDrawing();
    } else if (!reducedMotion && !playbackError) {
      play();
    }
  });

  if (!context) {
    playbackError = true;
    status.textContent = 'Video comparison unavailable.';
    video.pause();
  } else if (reducedMotion) {
    video.autoplay = false;
    video.pause();
    showPlay('Play the comparison when ready.');
    draw();
  } else {
    play();
  }
})();
