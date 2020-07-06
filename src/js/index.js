;(function($) {

    // Event Listeners
    document.addEventListener('DOMContentLoaded', init);
    document.addEventListener('resize', resize);
    document.addEventListener('scroll', scroll);

    // Global variables
    var navHeight = 56;
    var isScrolling = false;

    // Functions
    /**
     * Initial function that fires after DOM will be ready to be changed from JS
     */
    function init() {

        initMenu();
        initMenuSmoothScroll();
        initMenuSticky();

        initWorksIsotope();
        initModals();

        // sendMail();
    }

    function resize() {
        
    }

    function scroll() {
        initMenuSticky();
    }

    function initMenu() {
        var menuEl = document.querySelector('nav.navbar'),
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

    function initMenuSmoothScroll() {
        $('a[data-scroll]').on('click', function() {
            isScrolling = true;
            $('html').animate({
                scrollTop: $( $.attr(this, 'href') ).offset().top - navHeight
            }, 1000);
            // Fix for blinking
            setTimeout(function() {
                isScrolling = false;
            }, 100);
        });
    }

    function initMenuSticky() {
        var headerHeight = $('header').outerHeight();
        if (isScrolling) {
            return;
        }
        if (window.scrollY >= (headerHeight - navHeight)) {
            $('header').addClass('sticky');
        } else {
            $('header').removeClass('sticky');
        }
    }

    function initWorksIsotope() {
        var $grid = $('#works-container');
        $grid.isotope({
            itemSelector: '.work-wrap',
            layoutMode: 'fitRows',
        });

        $('#works-filters a').on('click', function(e) {
            e.preventDefault();
            // Filter
            var filter = $(this).attr('data-filter');
            $grid.isotope({ filter: filter});

            // Change active
            $(this).parent().find('a').removeClass('active');
            $(this).addClass('active');
        });
    }

    function initModals() {
        $('a.popup').magnificPopup({
            type: 'inline',
            midClick: true
        })
    }

    function sendMail() {
        $.ajax('/contact.php', {
            method: 'GET',
            complete: function(response, status) {
                console.log([response, status]);
            },
            error: function(response, status) {
                console.log([response, status]);
            },
            success: function(response, status) {
                console.log([response, status]);
            },
        });
    }

})(jQuery);