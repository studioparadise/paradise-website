---
---

root = exports ? this

root.controllers.project = ($element, args) ->
	do handleViewFullProject = ->
		$trigger = $element.find '[js-index-view-full-project]'
		toggleFullProjectView = ->
			if $('html').hasClass 'js-viewing-full-project'
				$('html').removeClass 'js-viewing-full-project'
			else
				$('html').addClass 'js-viewing-full-project'

			$(window).trigger 'resize'

			$('html, body').animate
				scrollTop: $trigger.closest('.index-project').offset().top
			, 0, 'easeInOutExpo'
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

root.controllers.navbar2 = ($element, args) ->
	api = {}

	do handleColumnSizing = ->
		### Handle column sizing. 
		Can't do with pure CSS, therefore use JS to emulate.
		### 
		$navbarColumns = $ ".navbar__item"

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

	do centerNavbar = ->
		$wrapper = $element.find('[js-wrapper]')
		height = $wrapper.height()
		wHeight = $(window).height()
		$wrapper.css
			marginTop: (wHeight/2) - (height/2)
	$(window).on 'resize', centerNavbar


	do handleMobileNav = ->
		$navOpen = $("[js-mobile-navbar-open]")
		toggleMobileNavbar = ->
			if $("body").hasClass 'mobile-navbar-is-open'
				$("body").removeClass 'mobile-navbar-is-open'
			else
				$("body").addClass 'mobile-navbar-is-open'

		$navOpen.on 'click', toggleMobileNavbar

	$allContent = $("[js-index-content]")
	api.hideAllContentAndFadeInOne = ($content) ->
		console.log "Loading content: ", $content

		if $content.is(':visible')
			console.log "Content visible, skipping fade in"
			return

		$allContent.stop(true, true).fadeOut().promise().done ->
			$content.fadeIn()

	do handleLogoClick = ->
		$logo = $element.find('[js-navbar-logo]')
		# show slider on logo click
		$logo.on 'click', (ev) ->
			if not args.mobile
				ev.preventDefault()
				$el = $("[js-index-content=\"index\"]")
				api.hideAllContentAndFadeInOne $el
				api.clearNavbarState()
				return false

	showDropdown = ($dropdown, apply) ->
		if apply
			$dropdown.show()
		else
			$dropdown.hide()
			$dropdown.find('.is-active').removeClass 'is-active'

	api.clearNavbarState = ->
		for dropdown in $element.find('[js-item-dropdown]')
			showDropdown $(dropdown), false
		$element.find('.is-active').removeClass 'is-active'
		$("[js-item-dropdown]").css
			marginTop: 0

	lastActiveItem = null
	initItem = ($item) ->
		console.log 'initializing item', $item
		$label = $item.find '[js-item-label]:first'
		$siblingItems = $item.siblings()

		alignItemWithParent = ($item) ->
			# align the active element to parent
			$dropdown = $item.closest('.navbar__dropdown')
			height = $item.parent().height()
			top = $item.position().top
			console.log 'top: ', top, ' height:', height

			console.log 'dropdown css is -', top, $dropdown
			$item.parent().stop(true).animate
				marginTop: "-#{top}px"
			, 1000


		scrollTo = ($item) ->
			api.scrolling = true
			scrollSpyTarget = $label.attr 'js-scrollspy-nav'
			if scrollSpyTarget
				$("html, body").stop(true, true).animate
					scrollTop: $("[js-scrollspy=\"#{scrollSpyTarget}\"]").offset().top
				, 1000, 'easeInOutExpo', ->
					api.scrolling = false
					activateItem $item

		activateItem = ($item, preventAlign = false) ->
			$dropdown = $item.find '[js-item-dropdown]:first'
			args = root.utils.getArgs($label)

			switch args.overlay
				when 'index'
					$el = $("[js-index-content=\"index\"]")
					api.hideAllContentAndFadeInOne $el
				when 'projects'
					$el = $("[js-index-content=\"projects\"]")
					api.hideAllContentAndFadeInOne $el

				when 'studio'
					$el = $("[js-index-content=\"studio\"]")
					api.hideAllContentAndFadeInOne $el
				when 'journal'
					$el = $("[js-index-content=\"journal\"]")
					api.hideAllContentAndFadeInOne $el
				else
					console.log "Not Found", args.overlay
					# $(".studio").fadeOut()

			if args.preventAlign
				console.log 'root element. clearing'
				api.clearNavbarState()
				$('html,body').scrollTop(0)

			showDropdown $dropdown, true

			$siblingItems.removeClass 'is-active'
			$item.addClass 'is-active'

			lastActiveItem = $item
			if not args.preventAlign and not preventAlign
				alignItemWithParent($item)

		console.log 'adding trigger on $label click', $label
		$label.on 'click', ->
			scrollTo $item
			activateItem $item

		$label.on 'scrollspy:activate', ->
			if not api.scrolling
				activateItem $item, false


	$items = $element.find '.navbar__item'
	for item in $items
		initItem $(item)

	do handleDirectLoadViaHash = ->
		hash = window.location.hash
		if not hash
			return

		hash = hash.substr 1



	# do handleSecondaryNav = ->
	# 	$navs = $element.find '[js-navbar-project]'
	# 	navLinkActiveClass = 'navbar__link--active'

	# 	getCurrentProject = ->
	# 		tolerance = $(window).height() * .3
	# 		$project = $("[js-index-project]:in-viewport(#{tolerance}):first")

	# 		projectSlug = $project.attr('js-index-project')
	# 		debug projectSlug
	# 		return projectSlug

	# 	activateSecondaryNav = (project) ->
	# 		$nav = $navs.filter("[js-navbar-project=\"#{project}\"]:first")
	# 		# $navs.removeClass navLinkActiveClass
	# 		# $nav.addClass navLinkActiveClass
	# 		window.location.hash = project


	# 	getProject = (project) ->
	# 		return $("[js-index-project=\"#{project}\"]")

	# 	scrollToProject = (project) ->
	# 		$project = getProject project
	# 		debug "scrolling to project #{project}"
	# 		console.log $project

	# 		$('html, body').animate
	# 			scrollTop: $project.offset().top
	# 		, 1000, 'easeInOutExpo'

	# 	do initialLoadHash = ->
	# 		if window.location.hash
	# 			project = window.location.hash.substr(1)
	# 			console.log 'Found project. scrolling to ', project
	# 			$project = getProject project
	# 			if $project
	# 				scrollToProject project

	# 	$navs.on 'click', (ev) ->
	# 		ev.preventDefault()
	# 		scrollToProject($(this).attr 'js-navbar-project')

	# 	onScroll = ->
	# 		project = getCurrentProject()
	# 		if project
	# 			activateSecondaryNav project
	# 	$(window).on 'scroll', _.throttle onScroll, 100

	do handleScrollSpy = ->
		onScroll = ->
			$spiesInViewport = $("[js-scrollspy]:in-viewport(500):visible:first")
			console.log 'spies in viweport: ', $spiesInViewport
			target = $spiesInViewport.attr 'js-scrollspy'
			$nav = $("[js-scrollspy-nav=\"#{target}\"]")
			$nav.trigger 'scrollspy:activate'

		$(window).on 'scroll', _.throttle onScroll, 150

root.controllers.studioContent = ($element, args) ->
	$navItem = $("[js-navbar-studio]")

	do updatePadding = ->
		$element.css
			paddingTop: $navItem.offset().top - $(window).scrollTop() - 4

	$(window).on 'resize', _.throttle(updatePadding, 500)

root.controllers.studioLocation = ($element, args) ->
	do updateTime = ->
		switch args.location
			when 'nyc'
				time = moment().tz('America/New_York')
			when 'sydney'
				time = moment().tz('Australia/Sydney')
		$time = $element.find '[js-time]'
		$date = $element.find '[js-date]'
		$date.html time.format('dddd MMMM D')
		$time.html time.format('h:mma')
	setInterval updateTime, 60*1000

root.controllers.footer = ($element, args) ->
	handleOnClickOutside = (cb) ->
		$(document).on 'click', (event) ->
			if $(event.target).is('[js-footer-show]')
				return

			if not $(event.target).closest('.footer').length and not $(event.target).is('.footer')
				cb()
	close = ->
		$element.slideUp 'slow', 'easeInOutExpo'

	open = ->
		$element.slideDown 'slow', 'easeInOutExpo'

	$open = $('[js-footer-show]')
	$open.on 'click', ->
		if $element.is(':visible')
			close()
		else
			open()

	$("[js-footer-close]").on 'click', close

	handleOnClickOutside close



