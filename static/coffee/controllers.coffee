---
---

root = exports ? this

root.controllers.navbar = ($element, args) ->
	# handle secondary navbar offset
	console.log 'navbar'
	calculateOffsetForProject = (project) ->




	$primaryNav = $element.find '[js-navbar-primary]'
	$primaryNavValign = $element.find '[js-navbar-primary-valign]'
	$secondaryNav = $element.find '[js-navbar-secondary]'
	$secondaryNavValign = $element.find '[js-navbar-secondary-valign]'

	do handleSecondaryNav = ->
		$navs = $element.find '[js-navbar-project]'
		navLinkActiveClass = 'navbar__link--active'


		getCurrentProject = ->
			tolerance = $(window).height() * .3
			$project = $("[js-index-project]:in-viewport(#{tolerance}):first")

			projectSlug = $project.attr('js-index-project')
			debug projectSlug
			return projectSlug

		alignFirstTime = true
		alignSecondaryNavToPrimary = ($nav) ->
			# animate offset
			activeNavPosition = $nav.position().top
			console.log "Active Nav Position: #{activeNavPosition}"
			# offset from active nav element
			primaryNavOffset = $primaryNavValign.position().top

			$parent = $nav.parent()
			if alignFirstTime
				alignFirstTime = false
				$parent.addClass 'no-transition'
				setTimeout ->
					$parent.removeClass 'no-transition'
				, 500
			$parent.css
				marginTop: primaryNavOffset - activeNavPosition

		alignSecondaryNavToPrimary $navs.filter("[js-navbar-project]:first")

		activateSecondaryNav = (project) ->
			$nav = $navs.filter("[js-navbar-project=\"#{project}\"]:first")
			$navs.removeClass navLinkActiveClass
			$nav.addClass navLinkActiveClass
			alignSecondaryNavToPrimary $nav
			window.location.hash = project


		getProject = (project) ->
			return $("[js-index-project=\"#{project}\"]")

		scrollToProject = (project) ->
			$project = getProject project
			debug "scrolling to project #{project}"
			console.log $project

			$('html, body').animate
				scrollTop: $project.offset().top
			, 1000, 'easeInOutExpo'



		do initialLoadHash = ->
			if window.location.hash
				project = window.location.hash.substr(1)
				console.log 'Found project. scrolling to ', project
				$project = getProject project
				if $project
					scrollToProject project

		$navs.on 'click', (ev) ->
			ev.preventDefault()
			scrollToProject($(this).attr 'js-navbar-project')

		$(window).on 'scroll', ->
			project = getCurrentProject()
			if project
				activateSecondaryNav project

root.controllers.indexProject = ($element, args) ->
	do handleViewFullProject = ->
		$trigger = $element.find '[js-index-view-full-project]'
		$trigger.on 'click', ->
			if $('html').hasClass 'viewing-full-project'
				$('html').removeClass 'viewing-full-project'
			else
				$('html').addClass 'viewing-full-project'
