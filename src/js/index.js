;(function() {

    // Event Listeners
    document.addEventListener('DOMContentLoaded', init);

    // Functions
    /**
     * Initial function that fires after DOM will be ready to be changed from JS
     */
    function init() {
        var menuEl = document.querySelector('#menu'),
            menuBtn = document.querySelector('a[href="#menu-btn"]');
        console.log(menuEl,menuBtn );
        var menu = new MmenuLight(menuEl, "(max-width: 768px)");

        var navigator = menu.navigation();
        var drawer = menu.offcanvas();

        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('CLICK');
            drawer.open();
        });
    }

})();