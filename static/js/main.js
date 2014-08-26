$(function() {
	var degrees = 180;
	$(".flamingo").click(function() {
		$(".flamingo-animation-wrapper").toggleClass('is-flamingo');
	})

	$(".flamingo").on('mouseenter', function() {
		var number = Math.random() * ($(window).width()/2 * .9);
		if (Math.random() < .5) {
			// 50% chance of negative version
			number = number * -1;
		}
		$(this).css({
			'-moz-transform': 'translateX(' + number + 'px)',
			'-webkit-transform': 'translateX(' + number + 'px)',
			'transform': 'translateX(' + number + 'px)'
		})
	})
})