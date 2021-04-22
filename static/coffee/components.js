(function () {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.components.swiper = function ($element, args) {
    var swiper;
    console.log("init swiper with args", args);
    $.extend(args, {
      defaults: "",
    });
    return (swiper = $element.swiper(args));
  };

  root.components.mailchimp = function ($element, args) {
    var controller;
    controller = {};
    controller.init = function () {
      $element.ajaxChimp({
        callback: controller.onAjaxChimpPOST,
      });
      $element.find("[js-newsletter-submit]").on("click", function () {
        return $(this).closest("form").submit();
      });
    };
    controller.onAjaxChimpPOST = function (data) {
      var $error, msg;
      $error = $element.find("[js-newsletter-error]");
      $element.removeClass("is-error");
      $error.html("");
      if (data.result === "error") {
        $element.addClass("is-error");
        if (data.msg && data.msg.indexOf(" - ") >= 0) {
          msg = data.msg.split(" - ")[1];
        } else {
          msg = data.msg;
        }
        $error.html(msg);
        console.log("Error from ajaxChimp ", data);
      } else if (data.result === "success") {
        $element.find("button").html("DONE!");
        $element.find("button").on(
          "click",
          (function (_this) {
            return function (e) {
              e.preventDefault();
              return false;
            };
          })(this)
        );
        $element.find("input[type=email]").val("Thank you!");
      } else {
        console.log("Unhandled AJAXChimp Response: ", data);
      }
      return data;
    };
    return controller.init();
  };
}.call(this));
