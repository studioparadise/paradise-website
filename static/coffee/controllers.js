(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.controllers.project = function($element, args) {
    var handleViewFullProject;
    return (handleViewFullProject = function() {
      var $trigger, toggleFullProjectView;
      $trigger = $element.find('[js-index-view-full-project]');
      toggleFullProjectView = function() {
        if ($('html').hasClass('js-viewing-full-project')) {
          $('html').removeClass('js-viewing-full-project');
        } else {
          $('html').addClass('js-viewing-full-project');
        }
        $(window).trigger('resize');
        return $('html, body').animate({
          scrollTop: $trigger.closest('.index-project').offset().top
        }, 2000, 'easeInOutExpo');
      };
      return $trigger.on('click', toggleFullProjectView);
    })();
  };

  root.controllers.moduleCredits = function($element, args) {

    /* Distribute credits into each column.
     */
    var $a, populateColumns;
    $a = $element.find("[js-module-credits-item]");
    (populateColumns = function() {
      var $visibleCols, counter, length;
      $visibleCols = $element.find('[js-module-credit-column]:visible');
      $visibleCols.html('');
      length = $visibleCols.length;
      counter = 0;
      return $a.each(function() {
        $(this).appendTo($visibleCols.eq(counter));
        if (counter !== (length - 1)) {
          return counter += 1;
        } else {
          return counter = 0;
        }
      });
    })();
    return $(window).on('resize', _.throttle(populateColumns, 100));
  };

  root.controllers.navbar2 = function($element, args) {
    var $allContent, $items, api, centerNavbar, data, handleColumnSizing, handleDirectLoadViaHash, handleLogoClick, handleScrollSpy, i, initItem, item, lastActiveItem, len, populateNavbarState, showDropdown;
    api = {};
    console.log('init navbar2');
    data = window.navbarData;
    (populateNavbarState = function() {

      /* Populate initial navbar state.
      		T1 only.
      		T2 comes after T1 selection.
       */
    })();
    (handleColumnSizing = function() {

      /* Handle column sizing. 
      		Can't do with pure CSS, therefore use JS to emulate.
       */
      var $navbarColumns, getColumnWidth, width;
      $navbarColumns = $(".navbar__item");
      getColumnWidth = function() {

        /* There are 2 columns each being 1/8 wide.
        			Padding is 20px.
        			Total width is composed of:
        			[LEFT MARGIN][GUTTER][COLUMN][GUTTER][COLUMN][GUTTER]
        
        			Rows contain -1/2 gutter margin.
        			Given window width of 1000px
        				Usable space is 1000-30 margins = 970px
        				970*1/8
         */
        var MARGIN, columnWidth, usableSpace, windowWidth;
        MARGIN = 30;
        windowWidth = $(window).width();
        usableSpace = windowWidth - MARGIN;
        columnWidth = usableSpace * (1 / 8);
        console.log("Calculated usable column width of " + columnWidth);
        return columnWidth;
      };
      width = getColumnWidth();
      return $navbarColumns.css({
        width: width
      });
    })();
    $(window).on('resize', handleColumnSizing);
    (centerNavbar = function() {
      var $wrapper, height, wHeight;
      $wrapper = $element.find('[js-wrapper]');
      height = $wrapper.height();
      wHeight = $(window).height();
      return $wrapper.css({
        marginTop: (wHeight / 2) - (height / 2)
      });
    })();
    $(window).on('resize', centerNavbar);
    $allContent = $("[js-index-content]");
    api.hideAllContentAndFadeInOne = function($content) {
      console.log("Loading content: ", $content);
      if ($content.is(':visible')) {
        console.log("Content visible, skipping fade in");
        return;
      }
      return $allContent.stop(true, true).fadeOut().promise().done(function() {
        return $content.fadeIn();
      });
    };
    (handleLogoClick = function() {
      var $logo;
      $logo = $element.find('[js-navbar-logo]');
      return $logo.on('click', function(ev) {
        var $el;
        ev.preventDefault();
        $el = $("[js-index-content=\"index\"]");
        api.hideAllContentAndFadeInOne($el);
        api.clearNavbarState();
        return false;
      });
    })();
    showDropdown = function($dropdown, apply) {
      if (apply) {
        return $dropdown.show();
      } else {
        $dropdown.hide();
        return $dropdown.find('.is-active').removeClass('is-active');
      }
    };
    api.clearNavbarState = function() {
      var dropdown, i, len, ref;
      ref = $element.find('[js-item-dropdown]');
      for (i = 0, len = ref.length; i < len; i++) {
        dropdown = ref[i];
        showDropdown($(dropdown), false);
      }
      $element.find('.is-active').removeClass('is-active');
      return $("[js-item-dropdown]").css({
        marginTop: 0
      });
    };
    lastActiveItem = null;
    initItem = function($item) {
      var $label, $siblingItems, activateItem, alignItemWithParent, scrollTo;
      console.log('initializing item', $item);
      $label = $item.find('[js-item-label]:first');
      $siblingItems = $item.siblings();
      alignItemWithParent = function($item) {
        var $dropdown, height, top;
        $dropdown = $item.closest('.navbar__dropdown');
        height = $item.parent().height();
        top = $item.position().top;
        console.log('top: ', top, ' height:', height);
        console.log('dropdown css is -', top, $dropdown);
        return $item.parent().stop(true).animate({
          marginTop: "-" + top + "px"
        }, 1000);
      };
      scrollTo = function($item) {
        var scrollSpyTarget;
        api.scrolling = true;
        scrollSpyTarget = $label.attr('js-scrollspy-nav');
        if (scrollSpyTarget) {
          return $("html, body").stop(true, true).animate({
            scrollTop: $("[js-scrollspy=\"" + scrollSpyTarget + "\"]").offset().top - 35
          }, 1000, 'easeInOutExpo', function() {
            api.scrolling = false;
            return activateItem($item);
          });
        }
      };
      activateItem = function($item, preventAlign) {
        var $dropdown, $el;
        if (preventAlign == null) {
          preventAlign = false;
        }
        $dropdown = $item.find('[js-item-dropdown]:first');
        args = root.utils.getArgs($label);
        switch (args.overlay) {
          case 'index':
            $el = $("[js-index-content=\"index\"]");
            api.hideAllContentAndFadeInOne($el);
            break;
          case 'projects':
            $el = $("[js-index-content=\"projects\"]");
            api.hideAllContentAndFadeInOne($el);
            break;
          case 'studio':
            $el = $("[js-index-content=\"studio\"]");
            api.hideAllContentAndFadeInOne($el);
            break;
          case 'journal':
            $el = $("[js-index-content=\"journal\"]");
            api.hideAllContentAndFadeInOne($el);
            break;
          default:
            console.log("Not Found", args.overlay);
        }
        if (args.preventAlign) {
          console.log('root element. clearing');
          api.clearNavbarState();
        }
        showDropdown($dropdown, true);
        $siblingItems.removeClass('is-active');
        $item.addClass('is-active');
        lastActiveItem = $item;
        if (!args.preventAlign && !preventAlign) {
          return alignItemWithParent($item);
        }
      };
      console.log('adding trigger on $label click', $label);
      $label.on('click', function() {
        scrollTo($item);
        return activateItem($item);
      });
      return $label.on('scrollspy:activate', function() {
        if (api.scrolling == null) {
          return activateItem($item, true);
        }
      });
    };
    $items = $element.find('.navbar__item');
    for (i = 0, len = $items.length; i < len; i++) {
      item = $items[i];
      initItem($(item));
    }
    (handleDirectLoadViaHash = function() {
      var hash;
      hash = window.location.hash;
      if (!hash) {
        return;
      }
      return hash = hash.substr(1);
    })();
    return (handleScrollSpy = function() {
      var onScroll;
      onScroll = function() {
        var $nav, $spiesInViewport, target;
        $spiesInViewport = $("[js-scrollspy]:in-viewport(500):visible:first");
        console.log('spies in viweport: ', $spiesInViewport);
        target = $spiesInViewport.attr('js-scrollspy');
        $nav = $("[js-scrollspy-nav=\"" + target + "\"]");
        return $nav.trigger('scrollspy:activate');
      };
      return $(window).on('scroll', _.throttle(onScroll, 150));
    })();
  };

  root.controllers.studioContent = function($element, args) {
    var $navItem, updatePadding;
    $navItem = $("[js-navbar-studio]");
    (updatePadding = function() {
      return $element.css({
        paddingTop: $navItem.offset().top - $(window).scrollTop() - 4
      });
    })();
    return $(window).on('resize', _.throttle(updatePadding, 500));
  };

  root.controllers.studioLocation = function($element, args) {
    var updateTime;
    (updateTime = function() {
      var $date, $time, time;
      switch (args.location) {
        case 'nyc':
          time = moment().tz('America/New_York');
          break;
        case 'sydney':
          time = moment().tz('Australia/Sydney');
      }
      $time = $element.find('[js-time]');
      $date = $element.find('[js-date]');
      $date.html(time.format('dddd MMMM D'));
      return $time.html(time.format('h:mma'));
    })();
    return setInterval(updateTime, 60 * 1000);
  };

  root.controllers.footer = function($element, args) {
    var $open, close, handleOnClickOutside, open;
    handleOnClickOutside = function(cb) {
      return $(document).on('click', function(event) {
        if ($(event.target).is('[js-footer-show]')) {
          return;
        }
        if (!$(event.target).closest('.footer').length && !$(event.target).is('.footer')) {
          return cb();
        }
      });
    };
    close = function() {
      return $element.slideUp('slow', 'easeInOutExpo');
    };
    open = function() {
      return $element.slideDown('slow', 'easeInOutExpo');
    };
    $open = $('[js-footer-show]');
    $open.on('click', function() {
      if ($element.is(':visible')) {
        return close();
      } else {
        return open();
      }
    });
    $("[js-footer-close]").on('click', close);
    return handleOnClickOutside(close);
  };

}).call(this);
