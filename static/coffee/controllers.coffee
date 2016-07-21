---
---

root = exports ? this

root.controllers.indexSwiper = ($element, args) ->
  swiper = root.components.swiper $element,
    loop: true
    autoplay: 3000,
    effect: 'fade',
    fade: {
      crossFade: true
    },
    speed: 500
    onInit: (swiper) ->
      $triggers = $element.find '[js-index-slider-project-link]'
      $triggers.on 'click', ->
        window.location.hash = $(this).attr 'js-index-slider-project-link'


root.controllers.project = ($element, args) ->
  do handleViewFullProject = ->
    $trigger = $element.find '[js-index-view-full-project]'
    toggleFullProjectView = ->
      $el = $element.animate opacity: 0, 600, 'easeInOutExpo'
      scrollToTop = ->
        top = $element.offset().top
        $(window).scrollTop top
        $element.animate opacity: 1, 600, 'easeInOutExpo'

      $el.promise().then ->
        if $('html').hasClass 'js-viewing-full-project'
          # closing full project view
          $('html').removeClass 'js-viewing-full-project'
          $(".navbar").css(opacity: 0)

          $(".navbar__dropdown").addClass 'no-transition'
          $(window).trigger 'resize'

          # centerNavbar
          # NEED TO CENTER NAVBAR WITHOUT ANIMATING TOP, BEFORE FADE IN.

          _.delay ->
            $(".navbar").animate opacity: 1, 300, 'easeInOutExpo'
            scrollToTop()
            $(".navbar__dropdown").removeClass 'no-transition'
          , 400
          scrollToTop()
        else
          # opening full project view
          $(".navbar").animate opacity: 0, 300, 'easeInOutExpo', ->
            $('html').addClass 'js-viewing-full-project'
            $(window).trigger 'resize'
            scrollToTop()



    toggleFullProjectView = ->
      # v2 toggle full project
      # try removing content above current project
      $currentRow = $element.closest ".index-project-row"
      $projectRows = $ ".index-project-row"
      currentProjectIndex = $projectRows.index $currentRow

      # hide projects above this one
      @hideProjectsBeforeIndex = (index) ->
        $projectRowsBefore = $projectRows.filter ":lt(#{index})"
        $projectRowsBefore.hide()


      @fadeOutNav = (cb) ->
        $result = $(".navbar").animate opacity: 0, 500, 'easeInOutExpo'
        if cb
          $result.promise().then cb

      @fadeInNav = (cb) ->
        $result = $(".navbar").animate opacity: 1, 500, 'easeInOutExpo'
        if cb
          $result.promise().then cb

      # NOTE: window trigger resize repositions nav. It needs to fire earlier.
      # to prevent FOUC. It seems it's not in the right position
      @enterFPV = ->
        @fadeOutNav ->
          $('html').addClass 'js-viewing-full-project'
          $(window).trigger 'resize'
          $element.find('.animate-in').removeClass('animating-out').addClass 'animating-in'

      @exitFPV = ->
        $('html').addClass 'js-viewing-full-project--animating-out'
        $('html').removeClass 'js-viewing-full-project'

        _.delay =>
          $('html').removeClass 'js-viewing-full-project--animating-out'
          @fadeInNav()
        , 1000
        $projectRows.show()
        $(window).trigger 'resize'
        $('html, body').scrollTop $element.offset().top
        $element.find('.animate-in').addClass('animating-out').removeClass 'animating-in'


      @toggleFPV = ->
        if $('html').hasClass 'js-viewing-full-project'
          @exitFPV()
        else
          @enterFPV()

      # scroll to top of project first. then hide content above.
      if not $element.offset().top == $(window).scrollTop()
        duration = 500
      else
        duration = 0

      $result = $('html, body').animate
        scrollTop: $element.offset().top
      , duration, 'easeInOutExpo'
      $result.promise().then =>
        @hideProjectsBeforeIndex currentProjectIndex
        $('html, body').scrollTop 0

        @toggleFPV()

    $trigger.on 'click', toggleFullProjectView

    # $(document).keyup (e) =>
    #   if (e.keyCode == 27)
    #     toggleFullProjectView()


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

  do handleMobileNav = ->
    $navOpen = $("[js-mobile-navbar-open]")
    toggleMobileNavbar = ->
      if $("body").hasClass 'mobile-navbar-is-open'
        $("body").removeClass 'mobile-navbar-is-open'
      else
        $("body").addClass 'mobile-navbar-is-open'

    $navOpen.on 'click', toggleMobileNavbar

  do centerNavbar = ->
    $wrapper = $element.find('[js-wrapper]')
    height = $wrapper.height()
    wHeight = $(window).height()
    $wrapper.css
      marginTop: (wHeight/2) - (height/2)

  $(window).on 'resize', centerNavbar

  api.isMobile = ->
    return $("body").hasClass 'layout-mobile'

  $allContent = $("[js-index-content]")
  api.hideAllContentAndFadeInOne = ($content) ->
    # console.log "Loading content: ", $content

    if $content.is(':visible')
      # console.log "Content visible, skipping fade in"
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
    if api.isMobile()
      if apply and not $dropdown.hasClass 'is-open'
        $dropdown.show()
      else
        $dropdown.hide()
        $dropdown.find('.is-active').removeClass 'is-active'
    else
      if apply and not $dropdown.hasClass 'is-open'
        $dropdown.show()
        _.delay ->  $dropdown.addClass 'is-open', 100
      else
        $dropdown.removeClass 'is-open'
        _.delay ->
          if not $dropdown.hasClass 'is-open'
            $dropdown.hide()
        , 600
        $dropdown.find('.is-active').removeClass 'is-active'

  api.clearNavbarState = ->
    for dropdown in $element.find('[js-item-dropdown]')
      showDropdown $(dropdown), false
    $element.find('.is-active').removeClass 'is-active'
    $("[js-item-dropdown]").css
      marginTop: 0

  lastActiveItem = null
  initItem = ($item) ->
    # console.log 'initializing item', $item
    $label = $item.find '[js-item-label]:first'
    $siblingItems = $item.siblings()

    alignItemWithParent = ($item) ->
      # align the active element to parent
      $dropdown = $item.closest('.navbar__dropdown')
      height = $item.parent().height()
      top = $item.position().top
      # console.log 'top: ', top, ' height:', height
      # console.log 'dropdown css is -', top, $dropdown
      $item.parent().stop(true).animate
        marginTop: "-#{top}px"
      , 600


    scrollTo = ($item) ->
      api.scrolling = true
      scrollSpyTarget = $label.attr 'js-scrollspy-nav'
      args = root.utils.getArgs($label)

      if scrollSpyTarget
        $target = $("[js-scrollspy=\"#{scrollSpyTarget}\"]")
        if args.scrollAlignToNav
          position = $('.navbar__item.is-active:first').position().top
          console.log 'offset nav item position is ', position
          offset = $target.offset().top - position + 5  # compensate for font heights
          console.log 'target offset', offset
        else
          offset = $target.offset().top

        $("html, body").stop(true, true).animate
          scrollTop: offset
        , 750, 'easeInOutExpo', ->
          api.scrolling = false
          activateItem $item

    activateItem = ($item, preventAlign = false) ->
      $dropdown = $item.find '[js-item-dropdown]:first'
      args = root.utils.getArgs($label)

      if $("body").hasClass 'layout-mobile'
        if args.mobileURL
          window.location.href = args.mobileURL
          return false

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

      if args.preventAlign
        # is root node - misnamed arg
        api.clearNavbarState()
        $('html, body').scrollTop(0)
        console.log 'root element clicked'

      showDropdown $dropdown, true

      $siblingItems.removeClass 'is-active'
      $item.addClass 'is-active'

      lastActiveItem = $item
      if not args.preventAlign and not preventAlign
        alignItemWithParent($item)

      scrollSpy = $label.attr('js-scrollspy-nav')
      if scrollSpy
        window.location.hash = scrollSpy

      if args.preventAlign
        # is root node - misnamed arg
        if not $("body").hasClass 'layout-mobile'
          $nextItem = $item.find '.navbar__item:first'
          $nextItem.addClass 'is-active'
          scrollTo $nextItem



    $label.on 'click', ->
      scroll = activateItem $item
      if scroll == false
        return

      scrollTo $item

    if not $("body").hasClass 'layout-mobile'
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
    $scrollSpyNav = $("[js-scrollspy-nav=\"#{hash}\"]")
    if $scrollSpyNav
      #  click parent
      $parentNav = $scrollSpyNav.parent().parent().parent()
      $parentNav.find('[js-item-label]:first').click()
      console.log 'clicking parent nav', $parentNav
      _.delay ->
        $scrollSpyNav.click()
        console.log 'clicking scrollspy nav', $scrollSpyNav
      , 500

  # do handleSecondaryNav = ->
  #   $navs = $element.find '[js-navbar-project]'
  #   navLinkActiveClass = 'navbar__link--active'

  #   getCurrentProject = ->
  #     tolerance = $(window).height() * .3
  #     $project = $("[js-index-project]:in-viewport(#{tolerance}):first")

  #     projectSlug = $project.attr('js-index-project')
  #     debug projectSlug
  #     return projectSlug

  #   activateSecondaryNav = (project) ->
  #     $nav = $navs.filter("[js-navbar-project=\"#{project}\"]:first")
  #     # $navs.removeClass navLinkActiveClass
  #     # $nav.addClass navLinkActiveClass
  #     window.location.hash = project


  #   getProject = (project) ->
  #     return $("[js-index-project=\"#{project}\"]")

  #   scrollToProject = (project) ->
  #     $project = getProject project
  #     debug "scrolling to project #{project}"
  #     console.log $project

  #     $('html, body').animate
  #       scrollTop: $project.offset().top
  #     , 1000, 'easeInOutExpo'

  #   do initialLoadHash = ->
  #     if window.location.hash
  #       project = window.location.hash.substr(1)
  #       console.log 'Found project. scrolling to ', project
  #       $project = getProject project
  #       if $project
  #         scrollToProject project

  #   $navs.on 'click', (ev) ->
  #     ev.preventDefault()
  #     scrollToProject($(this).attr 'js-navbar-project')

  #   onScroll = ->
  #     project = getCurrentProject()
  #     if project
  #       activateSecondaryNav project
  #   $(window).on 'scroll', _.throttle onScroll, 100

  do handleScrollSpy = ->
    onScroll = ->
      $spiesInViewport = $("[js-scrollspy]:in-viewport(500):visible:first")
      # console.log 'spies in viweport: ', $spiesInViewport
      target = $spiesInViewport.attr 'js-scrollspy'
      $nav = $("[js-scrollspy-nav=\"#{target}\"]")
      $nav.trigger 'scrollspy:activate'

    $(window).on 'scroll', _.throttle onScroll, 50

root.controllers.studioContent = ($element, args) ->
  $navItem = $("[js-navbar-studio]")

  do updatePadding = ->
    $element.css
      paddingTop: $navItem.offset().top - $(window).scrollTop() - 10

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

root.controllers.mobileStudio = ($element, args) ->
  do handleDirectLoadViaHash = ->
    hash = window.location.hash
    if not hash
      return
    $("body").removeClass 'mobile-navbar-is-open'
    _.delay ->
      hash = hash.substr 1
      if not hash
        offset = 1
      else
        if hash == 'manifesto'
          adjustment = 100
        else
          adjustment = 50
        $target = $("[js-scrollspy=\"#{hash}\"]")
        offset = $target.offset().top - (adjustment)
      $("html, body").animate
        scrollTop: offset
      , 1000, 'easeInOutExpo'
    , 500

  window.onhashchange = handleDirectLoadViaHash
