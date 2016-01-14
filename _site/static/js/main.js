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
  var $hello = $(".paradise-hello");
  controller.enableSticky = function() {

    // set distance from top to height of element at stick time
    var height =  $hello.position().top;
    $hello.css({
      top: height
    });
    controller.isSticky = true;
    $element.addClass('is-sticky');
  };
  controller.disableSticky = function() {
    $element.removeClass('is-sticky');
    controller.isSticky = false;
    $hello.css({top: ''});
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
  console.log ("Attaching email hanlder to", $email);
  $email.on('keyup', function(ev) {
    console.log("Keyup");
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

  $element.find("[js-email-submit]").on('click', api.submitEmail);
}


$(function() {
  $(".swiper-container").swiper({
    calculateHeight: true,
    scrollbar: '.swiper-scrollbar',
    scrollbarHide: false,
    scrollbarDraggable: true,
    scrollbarSnapOnRelease: true,
    effect: 'fade',
    speed: 2000,
    autoplay: 3000,
    autoplayOnInteraction: true,
    fade: {
      crossFade: true
    },
    slidesPerView: 'auto',
    onImagesReady: function(swiper) {
      calculateHeight();
    }
  })

  function calculateHeight() { 
    $(".swiper-wrapper").css({height: ''});

    var targetHeight = $(".swiper-slide").height();
    var outerHeight = $(".paradise-intro").outerHeight();

    var minHeight = targetHeight + outerHeight;
    var windowHeight = $(window).height();
    var minHeight = $(".paradise-intro").outerHeight() 
      + $(".paradise-intro").offset().top + 30;

    console.log("TH", targetHeight, " MH", minHeight, " OH", outerHeight, "WH", windowHeight);

    if (windowHeight < minHeight) {
      targetHeight -= (minHeight - windowHeight);
      // $(".swiper-container").addClass('-short');
    } else {
      // $(".swiper-container").removeClass('-short');
    }

    $(".swiper-wrapper").css({
      height: targetHeight
    })
  }
  $(window).on('resize', calculateHeight);

  var $intro = $(".paradise-intro");
  components.stickyElement($intro, {});

  components.emailSignup($(".email"), {});

  var $hello = $(".paradise-hello");
  $(window).on('scroll', function() {});
})

