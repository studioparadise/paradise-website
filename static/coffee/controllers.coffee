---
---

root = exports ? this

root.controllers.navbar = ($element, args) ->
	# handle secondary navbar offset
	console.log 'navbar'

	$primaryNav = $element.find '[js-navbar-primary]'
	$primaryNavValign = $element.find '[js-navbar-primary-valign]'
	$secondaryNav = $element.find '[js-navbar-secondary]'
	$secondaryNavValign = $element.find '[js-navbar-secondary-valign]'

	do handleColumnSizing = ->
		### Handle column sizing. 
		Can't do with pure CSS, therefore use JS to emulate.
		### 
		$navbarColumns = $ ".navbar__column"

		getColumnWidth = ->
			### There are 2 columns each being 1/8 wide.
			Padding is 20px.
			Total width is composed of:
			[LEFT MARGIN][GUTTER][COLUMN][GUTTER][COLUMN][GUTTER]

			Rows contain -1/2 gutter margin.
			Given window width of 1000px
				Usable space is 1000-30 margins = 970px
				970*1/8
			###
			MARGIN = 30
			windowWidth = $(window).width() 
			usableSpace = windowWidth - MARGIN
			columnWidth = usableSpace * (1/8)
			console.log "Calculated usable column width of #{columnWidth}"
			return columnWidth

		width = getColumnWidth()
		$navbarColumns.css
			width: width

	$(window).on 'resize', handleColumnSizing

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

		onScroll = ->
			project = getCurrentProject()
			if project
				activateSecondaryNav project
		$(window).on 'scroll', _.throttle onScroll, 100

	loadSecondaryNav = (type) ->
		### Load the secondary navbar of <type>
		if navbar already open, hide first.
		###



root.controllers.project = ($element, args) ->
	do handleViewFullProject = ->
		$trigger = $element.find '[js-index-view-full-project]'
		toggleFullProjectView = ->
			if $('html').hasClass 'js-viewing-full-project'
				$('html').removeClass 'js-viewing-full-project'
			else
				$('html').addClass 'js-viewing-full-project'
			$(window).trigger 'resize'
		$trigger.on 'click', toggleFullProjectView



root.controllers.moduleCredits = ($element, args) ->
	### Distribute credits into each column.
	###
	$a = $element.find "[js-module-credits-item]"

	do populateColumns = ->
		$visibleCols = $element.find '[js-module-credit-column]:visible'
		$visibleCols.html ''

		length = $visibleCols.length
		counter = 0
		$a.each ->
			$(this).appendTo $visibleCols.eq(counter)

			if counter != (length-1)
				counter += 1
			else
				counter = 0

	$(window).on 'resize', _.throttle populateColumns, 100