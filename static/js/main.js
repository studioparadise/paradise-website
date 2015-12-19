components = {};

components.stickyElement = function($element, args) {
  var controller;
  controller = {};
  controller.isSticky = false;
  controller.init = function() {
    var $window;
    $window = $(window);
    $window.on('scroll', function() {
      var offset, scrollTop;
      scrollTop = $window.scrollTop();
      offset = $element.offset().top;
      if (args.offset) {
        offset -= Number(args.offset);
      }
      if (offset < scrollTop) {
        controller.enableSticky();
      } else {
        controller.disableSticky();
      }
    });
  };
  controller.enableSticky = function() {
    $element.addClass('is-sticky');
    controller.isSticky = true;
  };
  controller.disableSticky = function() {
    $element.removeClass('is-sticky');
    controller.isSticky = false;
  };
  controller.init();
  return args;
};


$(function() {

	$(".swiper-container").swiper({
		scrollbar: '.swiper-scrollbar',
		scrollbarHide: false,
		scrollbarDraggable: true,
		scrollbarSnapOnRelease: true
	})

	var $intro = $(".paradise-intro");

	components.stickyElement($intro, {

	})

	var $hello = $(".paradise-hello");
	$(window).on('scroll', function() {

	});
})
