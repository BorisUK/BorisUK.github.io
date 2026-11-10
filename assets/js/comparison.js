(() => {
  const comparison = document.querySelector('[data-comparison]');
  if (!comparison) return;

  const slider = comparison.querySelector('[data-comparison-slider]');
  const divider = comparison.querySelector('.comparison-divider');
  const before = comparison.querySelector('[data-before]');
  const after = comparison.querySelector('[data-after]');
  const playButton = comparison.querySelector('[data-comparison-play]');
  const status = document.querySelector('[data-comparison-status]');
  const videos = [before, after];
  const playbackRate = 0.65;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let playbackError = false;

  const updateSplit = () => {
    comparison.style.setProperty('--split', `${slider.value}%`);
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
        (event.pointerType === 'mouse' && event.button !== 0) ||
        event.target.closest('[data-comparison-play]')) return;
    activePointer = event.pointerId;
    divider.setPointerCapture(event.pointerId);
    updateFromPointer(event.clientX);
    event.preventDefault();
  });
  divider.addEventListener('pointermove', (event) => {
    if (event.pointerId !== activePointer) return;
    updateFromPointer(event.clientX);
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

  const showPlay = (message) => {
    playButton.hidden = false;
    status.textContent = message;
  };
  const align = () => {
    if (before.readyState < 2 || after.readyState < 2) return;
    if (Math.abs(before.currentTime - after.currentTime) > 0.12) {
      before.currentTime = after.currentTime;
    }
  };
  const play = async () => {
    if (playbackError) return;
    const results = await Promise.allSettled(videos.map(video => video.play()));
    if (playbackError) return;
    if (results.some(result => result.status === 'rejected')) {
      videos.forEach(video => video.pause());
      showPlay('Tap Play to watch the comparison.');
      return;
    }
    align();
    playButton.hidden = true;
    status.textContent = '';
  };

  videos.forEach(video => {
    video.defaultPlaybackRate = playbackRate;
    video.playbackRate = playbackRate;
    video.muted = true;
    video.playsInline = true;
    video.addEventListener('error', () => {
      playbackError = true;
      videos.forEach(v => v.pause());
      playButton.hidden = true;
      status.textContent = 'Video playback unavailable. The comparison images are still visible.';
    });
  });

  playButton.addEventListener('click', play);
  window.setInterval(() => {
    if (!document.hidden && videos.every(video => !video.paused)) align();
  }, 300);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) videos.forEach(video => video.pause());
    else if (!reducedMotion && !playbackError) play();
  });

  if (reducedMotion) {
    videos.forEach(video => video.pause());
    showPlay('Play the comparison when ready.');
  } else {
    play();
  }
})();
