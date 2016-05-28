(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.components.swiper = function($element, args) {
    var swiper;
    console.log('init swiper with args', args);
    $.extend(args, {
      defaults: ''
    });
    return swiper = $element.swiper(args);
  };

}).call(this);
