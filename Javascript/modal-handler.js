document.addEventListener('DOMContentLoaded', function () {
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.addEventListener('show.bs.modal', function (event) {
            const triggerElement = event.relatedTarget;
            const imageSrc = triggerElement.getAttribute('src');
            const modalImage = imageModal.querySelector('#modalImage');
            modalImage.src = imageSrc;
        });
    }
});