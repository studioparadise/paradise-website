---
---
root = exports ? this

root.components.swiper = ($element, args) ->
  # initialize the awesome idangerous swiper
  # parameters to be passed in from js-args
  console.log 'init swiper with args', args
  $.extend args,
    defaults: ''
  swiper = $element.swiper(args)
