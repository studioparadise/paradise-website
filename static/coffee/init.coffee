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
	# handle secondary navbar offset
	console.log 'navbar'
	calculateOffsetForProject = (project) ->


	getCurrentProject = ->
		tolerance = $(window).height() * .3
		$projects = $("[js-index-project]:in-viewport(#{tolerance})")
		output = ''
		for project in $projects		
			output += ' ' + $(project).attr 'js-index-project' 
		debug output

	$(window).on 'scroll', ->
		getCurrentProject()		


debug = (msg) ->
	$("[js-debug-txt]").html msg

$ ->
	root.utils.bindOneController('indexProject')
	root.utils.bindOneController('navbar')