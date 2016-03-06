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
