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

  rooms.forEach(function (room) {
    room.addEventListener('click', function () {
      showProject(room.dataset.project);
    });
  });

  if (cursor) {
    document.addEventListener('mousemove', function (event) {
      cursor.style.left = event.clientX + 'px';
      cursor.style.top = event.clientY + 'px';
    });

    document.querySelectorAll('a, button, .project-panel__image').forEach(function (element) {
      element.addEventListener('mouseenter', function () {
        cursor.classList.add('is-ring');
      });

      element.addEventListener('mouseleave', function () {
        cursor.classList.remove('is-ring');
      });
    });
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
