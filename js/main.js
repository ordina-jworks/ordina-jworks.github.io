/* ************************ */
/* Theme name  : Brave      */
/* Author name : Ashok      */
/* ************************ */

/* ****************** */
/* Tooltips & Popover */
/* ****************** */

$(".b-tooltip").tooltip();

$(".b-popover").popover();

/* ************** */
/* Magnific Popup */
/* ************** */

$(document).ready(function() {
  $('.lightbox').magnificPopup({type:'image'});
});


/* ******* */
/* The ToC */
/* ******* */

$(document).ready(function() {

	var toc, tocClone;

	var instantiateToC = function() {
		if (!$('.pin-wrapper').length) {
			toc.addClass('fixed').pin({
				containerSelector: '.post-body .inner',
				padding: {top: $('header').height(), bottom: 0}
			});
			$('.the-toc__heading').append('<span class="the-toc__toggle">✖</span>');
			$('.the-toc__heading').on('click', function() {
				if (toc.hasClass('closed')) {
					toc.removeClass('closed');
				} else {
					toc.addClass('closed');
				}
			});
		}
	}

	var resetToC = function() {
		if ($('.pin-wrapper').length) {
			$('.the-toc').remove();
			$('.pin-wrapper').before(tocClone);
			$('.pin-wrapper').remove();
			$('.the-toc').removeClass('fixed');
			cloneToC();
		}
	}
	
	var cloneToC = function() {
		toc = $('.the-toc');
		tocClone = toc.clone();
	}

	var detectToCPosition = function() {
		if ($('.post-body .content > h1:first-of-type').offset() !== undefined) {
			if ($(document).scrollTop() >= Math.floor($('.post-body .content > h1:first-of-type').offset().top) - 1 && $(document).scrollTop() < $('.post-body').offset().top + $('.post-body').outerHeight() - $(window).height()) {
				instantiateToC();
			} else {
				resetToC();
			}
		}
	}

	cloneToC();
	detectToCPosition();

	$(document).on('scroll', function() {
		detectToCPosition();
	});

	$(window).on('resize', function() {
		resetToC();
		instantiateToC();
	});
	
});

/* *************** */
/* Custom Dropdown */
/* *************** */

$(document).ready(function(){
	var hidden = true;
	$(".b-dropdown").click(function(e){
		e.preventDefault();
		if (hidden){
           $(this).next('.b-dropdown-block').slideToggle(400, function(){hidden = false;});
      }
	});
	$('html').click(function() {
        if (!hidden) {
            $('.b-dropdown-block').slideUp();
            hidden=true;
        }
   });
   $('.b-dropdown-block').click(function(event) {
        event.stopPropagation();
   });
});

/* ************ */
/* Owl Carousel */
/* ************ */

$(document).ready(function() {
	/* Owl carousel */
	$(".owl-carousel").owlCarousel({
		slideSpeed : 500,
		rewindSpeed : 1000,
		mouseDrag : true,
		stopOnHover : true
	});
	/* Own navigation */
	$(".owl-nav-prev").click(function(){
		$(this).parent().next(".owl-carousel").trigger('owl.prev');
	});
	$(".owl-nav-next").click(function(){
		$(this).parent().next(".owl-carousel").trigger('owl.next');
	});
});

/* ************* */
/* Scroll to top */
/* ************* */

$(document).ready(function() {
	$(window).scroll(function(){
		if ($(this).scrollTop() > 200) {
			$('.totop').fadeIn();
		} else {
			$('.totop').fadeOut();
		}
	});
	$(".totop a").click(function(e) {
		e.preventDefault();
		$("html, body").animate({ scrollTop: 0 }, "slow");
		return false;
	});
});

/* *************** */
/* Navigation menu */
/* *************** */

$(document).ready(function(){


	$.fn.menumaker = function(options) {

    var cssmenu = $(this), settings = $.extend({
        title: "Menu",
        format: "dropdown",
        sticky: false
      }, options);

      return this.each(function() {

		cssmenu.prepend('<div id="menu-button">' + settings.title + '</div>');
		$(this).find("#menu-button").on('click', function(){
		  $(this).toggleClass('menu-opened');
		  var mainmenu = $(this).next('ul');
		  if (mainmenu.hasClass('open')) {
			mainmenu.slideUp().removeClass('open');
		  }
		  else {
			mainmenu.slideDown().addClass('open');
			if (settings.format === "dropdown") {
			  mainmenu.find('ul').slideDown();
			}
		  }
		});

		cssmenu.find('li ul').parent().addClass('has-sub');

		multiTg = function() {
		  cssmenu.find(".has-sub").prepend('<span class="submenu-button"></span>');
		  cssmenu.find('.submenu-button').on('click', function() {
			$(this).toggleClass('submenu-opened');
			if ($(this).siblings('ul').hasClass('open')) {
			  $(this).siblings('ul').removeClass('open').slideUp();
			}
			else {
			  $(this).siblings('ul').addClass('open').slideDown();
			}
		  });
		};

		if (settings.format === 'multitoggle') multiTg();
		else cssmenu.addClass('dropdown');


      });
	};

	$(".navy").menumaker({
		title: "Menu",
		format: "multitoggle"
	});
});

/*
 Solid State by HTML5 UP
 html5up.net | @ajlkn
 Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
 */

(function($) {

	"use strict";

	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$header = $('#header'),
			$banner = $('#banner');

		// Disable animations/transitions until the page has loaded.
		$body.addClass('is-loading');

		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-loading');
			}, 100);
		});

		// Fix: Placeholder polyfill.
		$('form').placeholder();

		// Prioritize "important" elements on medium.
		skel.on('+medium -medium', function() {
			$.prioritize(
				'.important\\28 medium\\29',
				skel.breakpoint('medium').active
			);
		});

		// Header.
		if (skel.vars.IEVersion < 9)
			$header.removeClass('alt');

		if ($banner.length > 0
			&&	$header.hasClass('alt')) {

			$window.on('resize', function() { $window.trigger('scroll'); });

			$banner.scrollex({
				bottom:		$header.outerHeight(),
				terminate:	function() { $header.removeClass('alt'); },
				enter:		function() { $header.addClass('alt'); },
				leave:		function() { $header.removeClass('alt'); }
			});

		}

		if ($banner.length > 0 && $body.hasClass('toggle')) {
			$window.on('resize', function() { $window.trigger('scroll'); });

			$banner.scrollex({
				bottom: $header.outerHeight() - 100,
				enter: function() {
					// $body.addClass('custom-image');
					// $body.css("background-image", "url('" + imageHref + "')");

                    $('#header-image').addClass('header-image');
                    $('#header-image').css("background-image", "url('" + imageHref + "')");
					$('#over').css("display", "block");
				},
				leave: function() {
					$body.removeClass('custom-image');
					$body.css('background-image', '');
					$('#over').css("display", "none");
				}
			});

		}

		// Menu.
		var $menu = $('#menu');

		$menu._locked = false;

		$menu._lock = function() {

			if ($menu._locked)
				return false;

			$menu._locked = true;

			window.setTimeout(function() {
				$menu._locked = false;
			}, 350);

			return true;

		};

		$menu._show = function() {

			if ($menu._lock())
				$body.addClass('is-menu-visible');

		};

		$menu._hide = function() {

			if ($menu._lock())
				$body.removeClass('is-menu-visible');

		};

		$menu._toggle = function() {

			if ($menu._lock())
				$body.toggleClass('is-menu-visible');

		};

		$menu
			.appendTo($body)
			.on('click', function(event) {

				event.stopPropagation();

				// Hide.
				$menu._hide();

			})
			.find('.inner')
			.on('click', '.close', function(event) {

				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();

				// Hide.
				$menu._hide();

			})
			.on('click', function(event) {
				event.stopPropagation();
			})
			.on('click', 'a', function(event) {

				var href = $(this).attr('href');

				event.preventDefault();
				event.stopPropagation();

				// Hide.
				$menu._hide();

				// Redirect.
				window.setTimeout(function() {
					window.location.href = href;
				}, 350);

			});

		$body
			.on('click', 'a[href="#menu"]', function(event) {

				event.stopPropagation();
				event.preventDefault();

				// Toggle.
				$menu._toggle();

			})
			.on('keydown', function(event) {

				// Hide on escape.
				if (event.keyCode == 27)
					$menu._hide();

			});

	});

})(jQuery);