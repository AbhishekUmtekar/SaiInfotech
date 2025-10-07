document.addEventListener('DOMContentLoaded', function () {
    const mobileMenu = document.querySelector('.mobile-menu');
    const offcanvas = document.getElementById('mobileMenu');

    if (offcanvas && mobileMenu) {
        offcanvas.addEventListener('show.bs.offcanvas', function () {
            mobileMenu.classList.add('active');
        });

        offcanvas.addEventListener('hide.bs.offcanvas', function () {
            mobileMenu.classList.remove('active');
        });
    }
});