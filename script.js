/* Project-room interaction.
   Keep this small: buttons in the floor plan show the matching project panel. */
(function () {
  var rooms = document.querySelectorAll('.map-room');
  var panels = document.querySelectorAll('.project-panel');
  var cursor = document.querySelector('.cursor-dot');
  var preview = document.querySelector('.image-preview');
  var previewImage = preview ? preview.querySelector('img') : null;

  function showProject(projectId) {
    rooms.forEach(function (room) {
      room.classList.toggle('is-active', room.dataset.project === projectId);
    });

    panels.forEach(function (panel) {
      panel.classList.toggle('is-active', panel.id === 'project-' + projectId);
    });
  }

  document.addEventListener('click', function (event) {
    var room = event.target.closest('.map-room');

    if (!room || room.tagName === 'A') {
      return;
    }

    event.preventDefault();
    showProject(room.dataset.project);
  });

  document.querySelectorAll('.project-gallery').forEach(function (gallery) {
    var mainImage = gallery.querySelector('.project-panel__image img');
    var thumbs = gallery.querySelectorAll('.slide-thumb');

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        if (!mainImage) {
          return;
        }

        mainImage.src = thumb.dataset.slide;
        mainImage.alt = thumb.dataset.alt || '';

        thumbs.forEach(function (item) {
          item.classList.toggle('is-active', item === thumb);
          item.setAttribute('aria-pressed', String(item === thumb));
        });
      });
    });
  });

  if (cursor) {
    document.addEventListener('mousemove', function (event) {
      cursor.style.left = event.clientX + 'px';
      cursor.style.top = event.clientY + 'px';
    });

    document.querySelectorAll('a, button, .project-panel__image, .map-viewport').forEach(function (element) {
      element.addEventListener('mouseenter', function () {
        cursor.classList.add('is-ring');
      });

      element.addEventListener('mouseleave', function () {
        cursor.classList.remove('is-ring');
      });
    });
  }

  // Map panning: the research floor plan can be dragged within its viewport,
  // desktop only, matching the brief's "move the image like a map" move.
  var mapViewport = document.querySelector('.map-viewport');
  var mapGrid = document.querySelector('.research-map');

  if (mapViewport && mapGrid && window.matchMedia('(min-width: 861px)').matches) {
    var maxPan = 36;
    var isPanning = false;
    var didPan = false;
    var startX = 0;
    var startY = 0;
    var originX = 0;
    var originY = 0;
    var currentX = 0;
    var currentY = 0;

    mapViewport.addEventListener('pointerdown', function (event) {
      if (event.target.closest('.map-room')) {
        return;
      }

      isPanning = true;
      didPan = false;
      startX = event.clientX;
      startY = event.clientY;
      originX = currentX;
      originY = currentY;
      mapViewport.setPointerCapture(event.pointerId);
    });

    mapViewport.addEventListener('pointermove', function (event) {
      if (!isPanning) {
        return;
      }
      var dx = event.clientX - startX;
      var dy = event.clientY - startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        didPan = true;
      }
      currentX = Math.max(-maxPan, Math.min(maxPan, originX + dx));
      currentY = Math.max(-maxPan, Math.min(maxPan, originY + dy));
      mapGrid.style.transform = 'translate(' + currentX + 'px, ' + currentY + 'px)';
    });

    mapViewport.addEventListener('pointerup', function () {
      isPanning = false;
    });

    mapViewport.addEventListener('pointerleave', function () {
      isPanning = false;
      didPan = false;
    });

    // A drag that moved past the threshold should not also register as a room click.
    mapGrid.addEventListener('click', function (event) {
      if (didPan && !event.target.closest('.map-room')) {
        event.stopPropagation();
        event.preventDefault();
      }
      didPan = false;
    }, true);
  }

  if (preview && previewImage) {
    document.querySelectorAll('.project-panel__image img').forEach(function (image) {
      image.addEventListener('mouseenter', function () {
        previewImage.src = image.src;
        previewImage.alt = image.alt;
        preview.classList.add('is-visible');
      });

      image.addEventListener('mouseleave', function () {
        preview.classList.remove('is-visible');
      });
    });
  }
}());
