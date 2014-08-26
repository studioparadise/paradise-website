$(function() {
	var degrees = 180;
	$(".flamingo").click(function() {
		$(".flamingo-animation-wrapper").toggleClass('is-flamingo');
	})

	$(".flamingo").on('mouseenter', function() {
		var number = Math.random() * ($(window).width()/2 * .9);
		$(this).css({
			'-moz-transform': 'translateX(' + number + 'px)',
			'-webkit-transform': 'translateX(' + number + 'px)',
			'transform': 'translateX(' + number + 'px)'
		})
	})
})