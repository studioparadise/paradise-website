(function() {
  var debug, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  console.log("init.coffee");

  root.controllers = {};

  root.controllers.indexProjectScrollData = {};

  root.controllers.indexProject = function($element, args) {
    return console.log('foobar');
  };

  root.utils = {};

  root.utils.bindOneController = function(name) {
    return root.controllers[name]($("[js-controller=\"" + name + "\"]"));
  };

  root.controllers.navbar = function($element, args) {
    var $primaryNav, $primaryNavValign, $secondaryNav, $secondaryNavValign, calculateOffsetForProject, handleSecondaryNav;
    console.log('navbar');
    calculateOffsetForProject = function(project) {};
    $primaryNav = $element.find('[js-navbar-primary]');
    $primaryNavValign = $element.find('[js-navbar-primary-valign]');
    $secondaryNav = $element.find('[js-navbar-secondary]');
    $secondaryNavValign = $element.find('[js-navbar-secondary-valign]');
    return (handleSecondaryNav = function() {
      var $navs, activateSecondaryNav, alignSecondaryNavToPrimary, getCurrentProject, getProject, navLinkActiveClass, scrollToProject;
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
      alignSecondaryNavToPrimary = function($nav) {
        var $parent, activeNavPosition, primaryNavOffset;
        activeNavPosition = $nav.position().top;
        console.log("Active Nav Position: " + activeNavPosition);
        primaryNavOffset = $primaryNavValign.position().top;
        $parent = $nav.parent();
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
        return alignSecondaryNavToPrimary($nav);
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
        }, 1000);
      };
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

  debug = function(msg) {
    $("[js-debug-txt]").html(msg);
    return console.log(msg);
  };

  $(function() {
    root.utils.bindOneController('indexProject');
    return root.utils.bindOneController('navbar');
  });

}).call(this);
