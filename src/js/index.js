;(function() {

    // Event Listeners
    document.addEventListener('DOMContentLoaded', init);

    // Functions
    /**
     * Initial function that fires after DOM will be ready to be changed from JS
     */
    function init() {
        initMenu();
    }

    function initMenu() {
        var menuEl = document.querySelector('#menu'),
            menuBtn = document.querySelector('a[href="#menu-btn"]');
        var menu = new MmenuLight(menuEl, "(max-width: 768px)");

        var navigator = menu.navigation({
            title: '',
            theme: 'dark',
            selected: 'active'
        });
        var drawer = menu.offcanvas();

        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            drawer.open();
        });

        
        document.querySelectorAll('.close-menu').forEach(function(el) {
            el.addEventListener('click', function() {
                drawer.close();
            })
        });
    }

})();