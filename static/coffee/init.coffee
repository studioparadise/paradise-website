---
---

root = exports ? this

console.log "init.coffee"

root.controllers = {}

root.controllers.indexProjectScrollData = {}

root.controllers.indexProject = ($element, args) ->
	console.log 'foobar'



root.utils = {}

root.utils.bindOneController = (name) ->
	root.controllers[name]($("[js-controller=\"#{name}\"]"))



root.controllers.navbar = ($element, args) ->
	

$ ->
	root.utils.bindOneController('indexProject')