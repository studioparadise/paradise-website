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
    var calculateOffsetForProject, getCurrentProject;
    console.log('navbar');
    calculateOffsetForProject = function(project) {};
    getCurrentProject = function() {
      var $projects, i, len, output, project, tolerance;
      tolerance = $(window).height() * .3;
      $projects = $("[js-index-project]:in-viewport(" + tolerance + ")");
      output = '';
      for (i = 0, len = $projects.length; i < len; i++) {
        project = $projects[i];
        output += ' ' + $(project).attr('js-index-project');
      }
      return debug(output);
    };
    return $(window).on('scroll', function() {
      return getCurrentProject();
    });
  };

  debug = function(msg) {
    return $("[js-debug-txt]").html(msg);
  };

  $(function() {
    root.utils.bindOneController('indexProject');
    return root.utils.bindOneController('navbar');
  });

}).call(this);
