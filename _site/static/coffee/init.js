(function() {
  var root;

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

  root.controllers.navbar = function($element, args) {};

  $(function() {
    return root.utils.bindOneController('indexProject');
  });

}).call(this);
