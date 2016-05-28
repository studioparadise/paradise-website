(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.controllers.navbar = function($element, args) {
    var $primaryNav, $primaryNavValign, $secondaryNav, $secondaryNavValign, calculateOffsetForProject, handleSecondaryNav;
    console.log('navbar');
    calculateOffsetForProject = function(project) {};
    $primaryNav = $element.find('[js-navbar-primary]');
    $primaryNavValign = $element.find('[js-navbar-primary-valign]');
    $secondaryNav = $element.find('[js-navbar-secondary]');
    $secondaryNavValign = $element.find('[js-navbar-secondary-valign]');
    return (handleSecondaryNav = function() {
      var $navs, activateSecondaryNav, alignFirstTime, alignSecondaryNavToPrimary, getCurrentProject, getProject, initialLoadHash, navLinkActiveClass, scrollToProject;
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
      return $(window).on('scroll', function() {
        var project;
        project = getCurrentProject();
        if (project) {
          return activateSecondaryNav(project);
        }
      });
    })();
  };

  root.controllers.indexProject = function($element, args) {
    var handleViewFullProject;
    return (handleViewFullProject = function() {
      var $trigger;
      $trigger = $element.find('[js-index-view-full-project]');
      return $trigger.on('click', function() {
        if ($('html').hasClass('viewing-full-project')) {
          return $('html').removeClass('viewing-full-project');
        } else {
          return $('html').addClass('viewing-full-project');
        }
      });
    })();
  };

}).call(this);
