document.querySelectorAll('.project-section').forEach(section => {
  section.addEventListener('mouseenter', () => {
    const video = section.querySelector('video');
    if (video) {
      video.muted = true; 
      video.play().catch(err => console.error("Error by playing video:", err));
    }
  });

  section.addEventListener('mouseleave', () => {
    const video = section.querySelector('video');
    if (video) {
      video.pause();
    }
  });
});
