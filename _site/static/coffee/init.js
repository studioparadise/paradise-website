(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  if (root.utils == null) {
    root.utils = {};
  }

  root.effects = {};

  root.controllers = {};

  root.components = {};

  root.variables = {};

  root.events = {};

  root.variables = {
    debug: true,
    controllers: {
      catchExceptions: false,
      logInit: false
    },
    navbarHeight: 50,
    breakpoints: {
      mobile: 768,
      desktop: 769,
      minWidth: 1000
    }
  };

  root.utils.isBrowser = function(browser) {
    var isChrome;
    if (browser === 'chrome') {
      return isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    }
  };

  root.utils.isAtBreakpoint = function(breakpoint) {

    /* Detect if at breakpoints via labels corresponding to the SASS.
    Usage: mobile = isAtBreakpoint(mobile)
     */
    var breakpoints;
    breakpoints = root.variables.breakpoints;
    if (breakpoint === 'mobile' && window.is_mobile) {
      return $(window).width() < breakpoints.mobile;
    } else if (breakpoint === 'desktop') {
      return $(window).width() > breakpoints.desktop;
    } else if (breakpoint === 'tablet') {
      return $(window).width() > breakpoints.mobile;
    }
  };

  root.utils.getCurrentBreakpoint = function() {

    /* Get current breakpoint
     */
    var breakpoint, isCurrent, px, ref;
    ref = root.variables.breakpoints;
    for (breakpoint in ref) {
      px = ref[breakpoint];
      isCurrent = root.utils.isAtBreakpoint(breakpoint);
      if (isCurrent) {
        return breakpoint;
      }
    }
  };

  root.utils.responsiveJS = function(args) {

    /* Simple responsive JS.
    Usage:
      responsiveJS
        query: ($window) ->   # function that returns true if valid.
        query: 'tablet'  # pipes to isAtBreakpoint function
        enter: ->  # function that triggers upon entering
        exit: ->  # function that triggers upon existing
     */
    var base, responsiveJS;
    if ((base = root.utils)._responsiveJSQueries == null) {
      base._responsiveJSQueries = [];
    }
    root.utils._responsiveJSQueries.push(args);
    this.$window = $(window);
    (responsiveJS = (function(_this) {
      return function() {

        /* Go through all responsive queries.
        Find ones that match.
        Execute if entered.
         */
        var j, len, matched, ref, responsive, results;
        ref = root.utils._responsiveJSQueries;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          responsive = ref[j];
          if (_.isFunction(responsive.query)) {
            matched = responsive.query(_this.$window);
          } else {
            matched = root.utils.isAtBreakpoint(responsive.query);
          }
          if (matched && !responsive.active) {
            responsive.active = true;
            if (typeof responsive.enter === "function") {
              responsive.enter();
            }
          }
          if (!matched && responsive.active) {
            responsive.active = false;
            results.push(typeof responsive.exit === "function" ? responsive.exit() : void 0);
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
    })(this))();
    return this.$window.on('resize', _.debounce(responsiveJS, 100));
  };

  root.utils.lockScroll = function(lock) {

    /* Lock scroll for desktop.
    Mobile requires specific touch event locking.
     */
    if (lock === void 0) {
      return $("html").toggleClass('no-scroll');
    } else if (lock) {
      return $("html").addClass('no-scroll');
    } else {
      return $("html").removeClass('no-scroll');
    }
  };

  root.utils.scrollTo = function($el, options) {
    var animate;
    animate = (function(_this) {
      return function() {
        var top;
        top = $el.offset().top;
        return $("html, body").animate({
          scrollTop: top - (options.offset || 0)
        }, options.speed || 1000, options.easing || 'easeInOutExpo');
      };
    })(this);
    if (options.delay) {
      return _.delay(animate, options.delay);
    } else {
      return animate();
    }
  };

  root.utils.cookies = {

    /* Cookie setters and getters
     */
    set: function(name, value, days) {
      var date, expires;
      if (days) {
        date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
      } else {
        expires = "";
      }
      return document.cookie = name + "=" + value + expires + "; path=/";
    },
    get: function(name) {
      var c, ca, i, nameEQ;
      nameEQ = name + "=";
      ca = document.cookie.split(";");
      i = 0;
      while (i < ca.length) {
        c = ca[i];
        while (c.charAt(0) === " ") {
          c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length, c.length);
        }
        i++;
      }
      return null;
    },
    "delete": function(name) {
      return setCookie(name, "", -1);
    }
  };

  root.utils.getControllerInstance = function(controllerName, $scope) {

    /* Utility function to get an instance of a controller easily.
     */
    var $controllers, controller, instances;
    if (!$scope) {
      $scope = $('html');
    }
    $controllers = $scope.find("[js-controller=\"" + controllerName + "\"]");
    instances = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = $controllers.length; j < len; j++) {
        controller = $controllers[j];
        results.push($(controller).data('js-controller'));
      }
      return results;
    })();
    if (instances.length === 1) {
      return instances[0];
    }
    return instances;
  };

  root.utils.evalAttribute = function($element, attribute) {
    var error, ex;
    try {
      return eval("(" + ($element.attr(attribute)) + ")") || {};
    } catch (error) {
      ex = error;
      console.log("Get args exception: ", ex, $element, attribute);
      return {};
    }
  };

  root.utils.getArgs = function($element) {

    /* Utilify function to get evaluated arguments from the DOM.
     */
    return root.utils.evalAttribute($element, 'js-args');
  };

  root.utils.bindJSControllers = function($scope, force) {
    var bindJSFactory, error, ex, ref, tagname;
    if (force == null) {
      force = false;
    }

    /* Extremely light weight, anti framework DOM based JS execution model.
    An extremely simple implementation of web components, angular directives,
    react.js components.
    
    DOM elements with particular attributes will be automatically called:
       js-controller="controller"
       js-args="{foo: true}"
    
    Will be passed to a corresponding function in root.controllers
      i.e. root.controllers['controller']
    
    And passed the jQuery element as the first parameter and arguments as
    the second parameter.
    
    This system is the equivalent of calling `someFunction($(".selector), {})`
    and therefore has an extremely low complexity ceiling.
     */
    if (!$scope) {
      this.$scope = $('html');
    } else {
      this.$scope = $scope;
    }
    try {
      tagname = (((ref = this.$scope.get(0)) != null ? ref.tagName : void 0) != null) || '';
      console.log("Binding JS controllers/components for\n" + tagname + ":" + (this.$scope.get(0).className) + ". Force: " + force);
    } catch (error) {
      ex = error;
    }
    bindJSFactory = function(attrName, objectName, $scope) {

      /* Factory function to create binders for arbitrary attribute names.
       */
      this.attrName = attrName;
      this.objectName = objectName;
      this.loadedClass = attrName + "-loaded";
      this.selector = "[" + attrName + "]";
      if (!force) {
        this.selector += ":not(." + loadedClass + ")";
      } else {
        console.log("Forcing re-binding");
      }
      return $scope.find(selector).each((function(_this) {
        return function(index, el) {
          var bind, error1, handler;
          bind = function($element) {
            var controller, handler, handlerFunc, options;
            handler = $element.attr(_this.attrName);
            options = root.utils.getArgs($element);
            controller = root[_this.objectName][handler];
            if (controller) {
              handlerFunc = new controller($element, options);
            } else if (root.variables.controllers.logInit) {
              console.log("Controller not found for handler " + handler);
            }
            $element.data(_this.attrName, handlerFunc);
            $element.addClass(_this.loadedClass);
            if (root.variables.controllers.logInit) {
              return console.log(handler + " initialized with", {
                options: options
              });
            }
          };
          if (root.variables.controllers.catchExceptions) {
            try {
              bind($(el));
            } catch (error1) {
              ex = error1;
              handler = $(el).attr(_this.attrName);
              console.error('Error initializing: ', handler, ex);
            }
          } else {
            bind($(el));
          }
        };
      })(this));
    };

    /* Initialize two different controller types:
    Controllers: for architectural logic that spans multiple components.
    Components: for reusable snippets isolated to a particular component.
     */
    bindJSFactory('js-controller', 'controllers', this.$scope);
    return bindJSFactory('js-component', 'components', this.$scope);
  };

  root.effects.handleFadeInOnLoad = function() {

    /* Handle fade in / out on load
     */
    if (window.is_safari) {
      window.onbeforeunload = function() {
        $("body").addClass('is-unloading');
      };
      $(window).bind("pageshow", function(ev) {
        if (ev.originalEvent.persisted) {
          $("body").addClass('is-loading');
        }
      });
    } else {
      $(window).on('beforeunload', function() {
        $("body").addClass('is-unloading');
      });
    }
    return $("body").addClass('is-loading');
  };

  root.responsiveImages = function() {
    return $("[data-responsive-image-dimensions]").each(function() {
      var dimPairs, dims, error, ex, height, width;
      try {
        dims = $(this).attr('data-responsive-image-dimensions');
        dimPairs = dims.split('x');
        height = Number(dimPairs[0]);
        width = Number(dimPairs[1]);
        return $(this).css({
          paddingBottom: (width / height) * 100 + '%'
        });
      } catch (error) {
        ex = error;
      }
    });
  };

  root.init = function() {

    /* Modernizr to initialize this.
    $.load is too early before components load.
     */
    root.effects.handleFadeInOnLoad();
    root.utils.bindJSControllers();
    root.responsiveImages();
    $(window).on('resize', _.debounce(root.responsiveImages, 500));
    return $('body').addClass('is-loaded');
  };

  $(function() {
    return root.init();
  });

  window.debug = function(msg) {
    $("[js-debug-txt]").html(msg);
    return console.log(msg);
  };

}).call(this);
