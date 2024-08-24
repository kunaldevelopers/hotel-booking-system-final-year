function scrollLeftContainer() {
        const container = document.getElementById('filters');
        container.scrollBy({
          left: -container.clientWidth / 2,
          behavior: 'smooth'
        });
      }
  
      function scrollRightContainer() {
        const container = document.getElementById('filters');
        container.scrollBy({
          left: container.clientWidth / 2,
          behavior: 'smooth'
        });
      }