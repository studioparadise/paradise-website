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


root.components.mailchimp = ($element, args) ->
  # Handle mailchimp via ajax using ajaxChimp.
  # Used in newsletter popup, and footer signup forms (mobile + desktop)
  # Populates errors in an element with the js-newsletter-error attribute.
  controller = {}

  controller.init = ->
    $element.ajaxChimp callback: controller.onAjaxChimpPOST
    return

  controller.onAjaxChimpPOST = (data) ->
    # ajaxchimp appears to rebuild DOM. Must re-query
    $error = $element.find('[js-newsletter-error]')
    $element.removeClass 'is-error'
    $error.html ''

    if data.result == 'error'
      $element.addClass 'is-error'
      if data.msg and data.msg.indexOf(' - ') >= 0
        msg = data.msg.split(' - ')[1]
      else
        msg = data.msg
      $error.html msg
      console.log 'Error from ajaxChimp ', data

    else if data.result == 'success'
      $element.find('button').html 'DONE!'

      $element.find('button').on 'click', (e) =>
        e.preventDefault()
        # $('[js-newsletter-popup-close]').click()
        return false

      $element.find('input[type=email]').val 'Thank you!'
    else
      console.log 'Unhandled AJAXChimp Response: ', data
    data

  # controller.init()

