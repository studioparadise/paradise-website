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


components.emailSignup = function($element, args) {
  var api = {};
  var $email = $element.find('[js-email-input]');
  var validEmailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

  api.validateEmail = function() {
    var email = $email.val();
    if (email.match(validEmailRegex)) {
      return true;
    }
    return false;
  }

  api.submitEmail = function() {
    $.ajax({
      url: '//studioparadise.us9.list-manage.com/subscribe/post-json?u=3086fe329023e91f1b8ea55b1&amp;id=994fa81707&c=?',
      type: 'POST',
      data: {
        EMAIL: $email.val()
      },
      dataType: 'jsonp'
    })
    .success(function(data) {
      console.log("success func: data.result=", data.result, data);
      if (data.result == 'error') {
        api.error({
          msg: data.msg
        });
      } else {
        api.success();
      }
    })
    .error(function() {
      console.error("MC error");
    });
  }

  api.error = function(args) {
    // get or create error element
    var $error = $element.find("[js-email-error]");
    if ($error.length == 0) {
      $error = $("<div class='email-error' js-email-error></div>");
      $element.append($error);
    }

    // get message
    var msg;
    if (args.msg && args.msg.indexOf(' - ') >= 0) {      
      msg = args.msg.split(' - ')[1];
    } else {
      msg = args.msg;
    }

    $error.html(msg);

    // allow hiding if called with hide arg
    if (args.hide == true) {
      console.log("Hiding error");
      $error.fadeOut();
    }
  }

  api.success = function() {
    $email.val('Thanks!');
    api.error({
      msg: '',
      hide: true
    });
  }

  $email.on('keyup', function(ev) {
    var valid = api.validateEmail();
    if (valid) {
      $element.addClass('-is-valid');
      console.log('valid');
    } else {
      $element.removeClass('-is-valid');
    }

    if (ev.which == 13) {
      api.submitEmail();
    }
  });
}


$(function() {
  $(".swiper-container").swiper({
    scrollbar: '.swiper-scrollbar',
    scrollbarHide: false,
    scrollbarDraggable: true,
    scrollbarSnapOnRelease: true
  })

  var $intro = $(".paradise-intro");
  components.stickyElement($intro, {});

  components.emailSignup($(".email"), {});

  var $hello = $(".paradise-hello");
  $(window).on('scroll', function() {});
})

