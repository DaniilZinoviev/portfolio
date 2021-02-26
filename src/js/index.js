;(function($) {

    // Event Listeners
    document.addEventListener('DOMContentLoaded', init);
    document.addEventListener('resize', resize);
    document.addEventListener('scroll', scroll);

    // Global variables
    var navHeight = 56;
    var isScrolling = false;

    $('section').waypoint(function() {
        console.log('Section', this)
        $(this.element).addClass('animate__animated animate__fadeIn');
        // $(this.element).find('h2').addClass('animate__animated animate__fadeInLeft');
    }, {
        offset: '90%'
    })

    // Functions
    /**
     * Initial function that fires after DOM will be ready to be changed from JS
     */
    function init() {
        initMenu();
        initMenuSmoothScroll();
        initWorks();
        initParticles();
        initMail();
        $('body').addClass('loaded')
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
            transitionDuration: '0.8s',
            // stagger: 30
        });

        $grid.imagesLoaded().progress( function() {
            $grid.isotope('layout');
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

    function initWorksModals() {
        // #work-modal
        $('a.popup').magnificPopup({
            type: 'inline',
            midClick: true,
            removalDelay: 150,
            mainClass: 'mfp-fade',
            callbacks: {
                open: function() {
                    var $modal = $(this.content),
                        $workWrap = $(this.currItem.el).parents('.work-wrap');
                    var title = $workWrap.find('.js-title').text(),
                        imageSrc = $workWrap.find('.js-image').attr('src'),
                        imageAlt = $workWrap.find('.js-image').attr('alt'),
                        description = $workWrap.data('description'),
                        stack = $workWrap.data('stack'),
                        date = $workWrap.data('date');

                    console.log([this, $modal, title]);

                    $modal.find('.js-title').text( title );
                    $modal.find('.js-description').html( description );
                    $modal.find('.js-date').text( date );
                    $modal.find('.js-stack').text( stack );
                    $modal.find('.js-image').attr({
                        'src': imageSrc,
                        'alt': imageAlt
                    });
                }
            }
        })
    }

    function initMail() {
        window.submitContactForm = function() {
            console.log('SUBMIT to backend', $('#form-contact').serialize())
            $.ajax('../contact.php', {
                data: $('#form-contact').serialize(),
                method: 'POST',
                dataType: 'json',
                error: function(response, status) {
                    console.error('An ajax error has been occured', [response, status]);
                    showModal('Error', 'An unexpected error has been occured. Please reload a page and try again.', 'error');
                },
                success: function(response, status) {
                    if (response.success) {
                        console.log(response.message);
                        showModal('Success', response.message, 'success');
                    } else {
                        console.error('A server returns an error', response.message);
                        showModal('Error', response.message, 'error');
                    }
                },
            });
        }

        $('#form-contact').on('submit', function(e) {
            e.preventDefault();
            if (window.grecaptcha) {
                window.grecaptcha.execute();
            } else {
                window.submitContactForm();
            }
        });

        function showModal(statusMessage, message, status) {
            $('#contact-modal').attr('data-status', status);
            $('#contact-modal .js-status').text(statusMessage);
            $('#contact-modal .js-message').text(message);
            $.magnificPopup.open({
                removalDelay: 150,
                mainClass: 'mfp-fade',
                items: {
                    src: '#contact-modal',
                    type: 'inline'
                },
            });
        }
    }

    function initParticles() {
        particlesJS('particles', {
            "particles": {
                "number": {
                    "value": 60,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    "image": {
                        "src": "img/github.svg",
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 0.1,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 6,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.1,
                    "width": 2
                },
                "move": {
                    "enable": true,
                    "speed": 1.5,
                    "direction": "top",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": false,
                        "mode": "repulse"
                    },
                    "onclick": {
                        "enable": false,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 400,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }

    function initWorks() {
        getWorksFromJson(function(response, $container) {
            initWorksModals();
            initWorksIsotope();
        });
    }

    function getWorksFromJson(callback) {
        var url = '/works.data.json';
        $.ajax(url, {
            dataType: "json",
            error: function(response, status) {
                console.error('An error with AJAX "getWorksFromJson" has been occured. Status code: ' + response.status, response.statusText);
            },
            success: function(response, status) {
                var $mockTemplate = $('.js-work-template-container').children(),
                    $container = $('.js-works-container');
                for (var i = 0; i < response.length; i++) {
                    var $template = $mockTemplate.clone(),
                        dataItem = response[i];
                    
                    $template.find('.js-title').text(dataItem.title);
                    $template.addClass(dataItem.filter);
                    $template.data('description', dataItem.description.replace('"', '\''));
                    $template.data('stack', dataItem.stack.join(', '));
                    $template.data('date', dataItem.date);
                    $template.find('.js-short-description').text(dataItem.short_description);
                    $template.find('.js-links-demo').attr('href', dataItem.links.demo);
                    $template.find('.js-links-github').attr('href', dataItem.links.github);
                    if (! dataItem.links.github) $template.children().addClass('no-github');
                    $template.find('.js-image').attr({
                        'src': dataItem.image.src,
                        'alt': dataItem.image.alt,
                    });
                    $container.append($template);
                }
                if (typeof callback === 'function') {
                    callback(response, $container);
                }
            },
        });
    }

})(jQuery);
