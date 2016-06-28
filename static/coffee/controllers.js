(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.controllers.navbar = function($element, args) {
    var $primaryNav, $primaryNavValign, $secondaryNav, $secondaryNavValign, handleColumnSizing, handleSecondaryNav, loadSecondaryNav;
    console.log('navbar');
    $primaryNav = $element.find('[js-navbar-primary]');
    $primaryNavValign = $element.find('[js-navbar-primary-valign]');
    $secondaryNav = $element.find('[js-navbar-secondary]');
    $secondaryNavValign = $element.find('[js-navbar-secondary-valign]');
    (handleColumnSizing = function() {

      /* Handle column sizing. 
      		Can't do with pure CSS, therefore use JS to emulate.
       */
      var $navbarColumns, getColumnWidth, width;
      $navbarColumns = $(".navbar__column");
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
    (handleSecondaryNav = function() {
      var $navs, activateSecondaryNav, alignFirstTime, alignSecondaryNavToPrimary, getCurrentProject, getProject, initialLoadHash, navLinkActiveClass, onScroll, scrollToProject;
      $navs = $element.find('[js-navbar-project]');
      navLinkActiveClass = 'navbar__link--active';
      getCurrentProject = function() {
        var $project, projectSlug, tolerance;
        tolerance = $(window).height() * .3;
        $project = $("[js-index-project]:in-viewport(" + tolerance + "):first");
        projectSlug = $project.attr('js-index-project');
        debug(projectSlug);
        return projectSlug;
      };
      alignFirstTime = true;
      alignSecondaryNavToPrimary = function($nav) {
        var $parent, activeNavPosition, primaryNavOffset;
        activeNavPosition = $nav.position().top;
        console.log("Active Nav Position: " + activeNavPosition);
        primaryNavOffset = $primaryNavValign.position().top;
        $parent = $nav.parent();
        if (alignFirstTime) {
          alignFirstTime = false;
          $parent.addClass('no-transition');
          setTimeout(function() {
            return $parent.removeClass('no-transition');
          }, 500);
        }
        return $parent.css({
          marginTop: primaryNavOffset - activeNavPosition
        });
      };
      alignSecondaryNavToPrimary($navs.filter("[js-navbar-project]:first"));
      activateSecondaryNav = function(project) {
        var $nav;
        $nav = $navs.filter("[js-navbar-project=\"" + project + "\"]:first");
        $navs.removeClass(navLinkActiveClass);
        $nav.addClass(navLinkActiveClass);
        alignSecondaryNavToPrimary($nav);
        return window.location.hash = project;
      };
      getProject = function(project) {
        return $("[js-index-project=\"" + project + "\"]");
      };
      scrollToProject = function(project) {
        var $project;
        $project = getProject(project);
        debug("scrolling to project " + project);
        console.log($project);
        return $('html, body').animate({
          scrollTop: $project.offset().top
        }, 1000, 'easeInOutExpo');
      };
      (initialLoadHash = function() {
        var $project, project;
        if (window.location.hash) {
          project = window.location.hash.substr(1);
          console.log('Found project. scrolling to ', project);
          $project = getProject(project);
          if ($project) {
            return scrollToProject(project);
          }
        }
      })();
      $navs.on('click', function(ev) {
        ev.preventDefault();
        return scrollToProject($(this).attr('js-navbar-project'));
      });
      onScroll = function() {
        var project;
        project = getCurrentProject();
        if (project) {
          return activateSecondaryNav(project);
        }
      };
      return $(window).on('scroll', _.throttle(onScroll, 100));
    })();
    return loadSecondaryNav = function(type) {

      /* Load the secondary navbar of <type>
      		if navbar already open, hide first.
       */
    };
  };

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
    var $allContent, $items, api, centerNavbar, data, handleColumnSizing, handleDirectLoadViaHash, handleLogoClick, handleScrollSpy, i, initItem, item, lastActiveItem, len, populateNavbarState;
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
        return false;
      });
    })();
    lastActiveItem = null;
    initItem = function($item) {
      var $label, $siblingItems, activateItem, alignItemWithParent, clearOtherItems, scrollTo, showDropdown;
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
        }, 500);
      };
      showDropdown = function($dropdown, apply) {
        if (apply) {
          return $dropdown.show();
        } else {
          $dropdown.hide();
          return $dropdown.find('.is-active').removeClass('is-active');
        }
      };
      scrollTo = function($item) {
        var scrollSpyTarget;
        scrollSpyTarget = $label.attr('js-scrollspy-nav');
        if (scrollSpyTarget) {
          return $("html, body").animate({
            scrollTop: $("[js-scrollspy=\"" + scrollSpyTarget + "\"]").offset().top
          }, 1000, 'easeInOutExpo');
        }
      };
      activateItem = function($item, preventAlign) {
        var $dropdown, $el, dropdown, i, len, ref;
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
          ref = $element.find('[js-item-dropdown]');
          for (i = 0, len = ref.length; i < len; i++) {
            dropdown = ref[i];
            showDropdown($(dropdown), false);
            console.log('hiding dropdown due to preventAlign i.e. root');
          }
        }
        showDropdown($dropdown, true);
        console.log('activating item');
        $siblingItems.removeClass('is-active');
        $item.addClass('is-active');
        clearOtherItems($item);
        lastActiveItem = $item;
        if (!args.preventAlign && !preventAlign) {
          return alignItemWithParent($item);
        }
      };
      clearOtherItems = function($item) {
        if ($item.closest('.navbar__item').length === 0) {

        } else {

        }
      };
      console.log('adding trigger on $label click', $label);
      $label.on('click', function() {
        return activateItem($item);
      });
      return $label.on('scrollspy:activate', function() {
        return activateItem($item);
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

}).call(this);
