/*!
 * Copyright 2012, Chris Wanstrath
 * Released under the MIT License
 * https://github.com/defunkt/jquery-pjax
 */

(function($){

// When called on a container with a selector, fetches the href with
// ajax into the container or with the data-pjax attribute on the link
// itself.
//
// Tries to make sure the back button and ctrl+click work the way
// you'd expect.
//
// Exported as $.fn.pjax
//
// Accepts a jQuery ajax options object that may include these
// pjax specific options:
//
//
// container - String selector for the element where to place the response body.
//      push - Whether to pushState the URL. Defaults to true (of course).
//   replace - Want to use replaceState instead? That's cool.
//
// For convenience the second parameter can be either the container or
// the options object.
//
// Returns the jQuery object
function fnPjax(selector, options) {
  return this.on('click.pjax', selector, function(event) {
    var opts = options
    if (!opts.container) {
      opts = $.extend({}, options)
      opts.container = $(this).attr('data-pjax')
    }
    handleClick(event, opts)
  })
}

// Public: pjax on click handler
//
// Exported as $.pjax.click.
//
// event   - "click" jQuery.Event
// options - pjax options
//
// Examples
//
//   $(document).on('click', 'a', $.pjax.click)
//   // is the same as
//   $(document).pjax('a')
//
// Returns nothing.
function handleClick(event, options) {

  let link = event.currentTarget
  let $link = $(link)
  if (!(link.protocol && link.hostname))
    return

  if (link.tagName.toUpperCase() !== 'A')
    throw "$.fn.pjax or $.pjax.click requires an anchor element"

  // Middle click, cmd click, and ctrl click should open
  // links in a new tab as normal.
  if ( event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey )
    return

  // Ignore cross origin links
  if ( location.protocol !== link.protocol || location.hostname !== link.hostname )
    return

  // Ignore case when a hash is being tacked on the current URL
  if ( link.href.indexOf('#') > -1 && stripHash(link) == stripHash(location) )
    return

  // Ignore event with default prevented
  if (event.isDefaultPrevented())
    return

  let defaults = {
    url: link.href,
    container: $link.attr('data-pjax'),
    target: link,
    push: true
  }

  let opts = $.extend({}, defaults, options)
  let clickEvent = $.Event('pjax:click')
  $link.trigger(clickEvent, [opts])

  if (!clickEvent.isDefaultPrevented()) {
    if(options.push)
      window.history.pushState(pjax.state, link.title, link.href);
    pjax(opts)
    event.preventDefault()
    $link.trigger('pjax:clicked', [opts])
  }
}

// Public: pjax on form submit handler
//
// Exported as $.pjax.submit
//
// event   - "click" jQuery.Event
// options - pjax options
//
// Examples
//
//  $(document).on('submit', 'form', function(event) {
//    $.pjax.submit(event, '[data-pjax-container]')
//  })
//
// Returns nothing.
function handleSubmit(event, options) {

  var form = event.currentTarget
  var $form = $(form)

  if (form.tagName.toUpperCase() !== 'FORM')
    throw "$.pjax.submit requires a form element"

  let defaults = {
    type: ($form.attr('method') || 'GET').toUpperCase(),
    url: $form.attr('action'),
    target: form
  }

  if (defaults.type !== 'GET' && window.FormData !== undefined) {
    defaults.data = new FormData(form)
    defaults.processData = false
    defaults.contentType = false
  } else {
    // Can't handle file uploads, exit
    if ($form.find(':file').length) {
      return
    }

    // Fallback to manually serializing the fields
    defaults.data = $form.serializeArray()
  }

  pjax($.extend({}, defaults, options))

  event.preventDefault()
}

// Loads a URL with ajax, puts the response body inside a container,
// then pushState()'s the loaded URL.
//
// Works just like $.ajax in that it accepts a jQuery ajax
// settings object (with keys like url, type, data, etc).
//
// Accepts these extra keys:
//
// container - String selector for where to stick the response body.
//      push - Whether to pushState the URL. Defaults to true (of course).
//   replace - Want to use replaceState instead? That's cool.
//
// Use it just like $.ajax:
//
//   var xhr = $.pjax({ url: this.href, container: '#main' })
//   console.log( xhr.readyState )
//
// Returns whatever $.ajax returns.
function pjax(options) {
  options = $.extend(true, {}, $.ajaxSettings, pjax.defaults, options)

  if ($.isFunction(options.url)) {
    options.url = options.url()
  }

  let hash = parseURL(options.url).hash


  function fire(type, args, props) {
    if (!props) props = {}
    props.relatedTarget = options.target;
    return document.dispatchEvent(new CustomEvent(type, {props:props, args:args}));
  }

  let timeoutTimer

  options.beforeSend = function(xhr, settings) {
    // No timeout for non-GET requests
    // Its not safe to request the resource again with a fallback method.
    if (settings.type !== 'GET') {
      settings.timeout = 0
    }

    xhr.setRequestHeader('X-PJAX', 'true')

    if (!fire('pjax:beforeSend', [xhr, settings]))
      return false

    if (settings.timeout > 0) {
      timeoutTimer = setTimeout(function() {
        if (fire('pjax:timeout', [xhr, options]))
          xhr.abort('timeout')
      }, settings.timeout)

      // Clear timeout setting so jquerys internal timeout isn't invoked
      settings.timeout = 0
    }

    let url = parseURL(settings.url)
    if (hash) url.hash = hash
    options.requestUrl = stripInternalParams(url)
  }

  options.complete = function(xhr, textStatus) {
    if (timeoutTimer)
      clearTimeout(timeoutTimer)

    fire('pjax:complete', [xhr, textStatus, options])

    fire('pjax:end', [xhr, options])
  }

  options.error = function(xhr, textStatus, errorThrown) {
    let obj = extractContainer("", xhr, options)

    let allowed = fire('pjax:error', [xhr, textStatus, errorThrown, options])
    if (options.type == 'GET' && textStatus !== 'abort' && allowed) {
      locationReplace(obj.url)
    }
  }

  options.success = function(data, status, xhr) {
    let previousState = pjax.state
    let obj = extractContainer(data, xhr, options)

    let url = parseURL(obj.url)
    if (hash) {
      url.hash = hash
      obj.url = url.href
    }

    // If the new response is missing a body, hard load the page
    if (!obj.content_load) {
      locationReplace(container.url)
      return
    }

    pjax.state = {
      id: options.id || uniqueId(),
      url: obj.url,
      title: obj.title,
      fragments: options.fragments,
      timeout: options.timeout
    }

    // window.history.replaceState(pjax.state, container.title, container.url)

    if (obj.title) document.title = obj.title

    fire('pjax:beforeReplace', options, {
      state: pjax.state,
      previousState: previousState
    })

    let scrollTo = options.scrollTo

    // Ensure browser scrolls to the element referenced by the URL anchor
    if (hash) {
      let name = decodeURIComponent(hash.slice(1))
      let target = document.getElementById(name) || document.getElementsByName(name)[0]
      if (target) scrollTo = $(target).offset().top
    }

    if (typeof scrollTo == 'number') $(window).scrollTop(scrollTo)

    fire('pjax:success', [data, status, xhr, options])
  }


  // Initialize pjax.state for the initial page load. Assume we're
  // using the container and options of the link we're loading for the
  // back button to the initial page. This ensures good back button
  // behavior.
  if (!pjax.state) {
    pjax.state = {
      id: uniqueId(),
      url: window.location.href,
      title: document.title,
      fragments: options.fragments,
      timeout: options.timeout
    }
    window.history.replaceState(pjax.state, document.title)
  }

  pjax.options = options
  let xhr = pjax.xhr = $.ajax(options)

  if (xhr.readyState > 0) {
    fire('pjax:start', [xhr, options])
    fire('pjax:send', [xhr, options])
  }

  return pjax.xhr
}

// Public: Reload current page with pjax.
//
// Returns whatever $.pjax returns.
function pjaxReload(options) {
  let defaults = {
    url: window.location.href,
    push: false,
    scrollTo: false
  }

  return pjax($.extend(defaults, options))
}

// Internal: Hard replace current state with url.
//
// Work for around WebKit
//   https://bugs.webkit.org/show_bug.cgi?id=93506
//
// Returns nothing.
function locationReplace(url) {
  // Initialize $.pjax.state if possible
  // Happens when reloading a page and coming forward from a different
  // session history.
  let initialState = window.history.state
  if (initialState && initialState.container) {
    pjax.state = initialState
  }
  window.history.replaceState(null, "", pjax.state.url)
  window.location.replace(url)
}

// Fallback version of main pjax function for browsers that don't
// support pushState.
//
// Returns nothing since it retriggers a hard form submission.
function fallbackPjax(options) {
  let url = $.isFunction(options.url) ? options.url() : options.url,
      method = options.type ? options.type.toUpperCase() : 'GET'

      let form = $('<form>', {
    method: method === 'GET' ? 'GET' : 'POST',
    action: url,
    style: 'display:none'
  })

  if (method !== 'GET' && method !== 'POST') {
    form.append($('<input>', {
      type: 'hidden',
      name: '_method',
      value: method.toLowerCase()
    }))
  }

  let data = options.data
  if (typeof data === 'string') {
    $.each(data.split('&'), function(index, value) {
      let pair = value.split('=')
      form.append($('<input>', {type: 'hidden', name: pair[0], value: pair[1]}))
    })
  } else if ($.isArray(data)) {
    $.each(data, function(index, value) {
      form.append($('<input>', {type: 'hidden', name: value.name, value: value.value}))
    })
  } else if (typeof data === 'object') {
    let key
    for (key in data)
      form.append($('<input>', {type: 'hidden', name: key, value: data[key]}))
  }

  $(document.body).append(form)
  form.submit()
}

// Internal: Generate unique id for state object.
//
// Use a timestamp instead of a counter since ids should still be
// unique across page loads.
//
// Returns Number.
function uniqueId() {
  return (new Date).getTime()
}


// Internal: Strip internal query params from parsed URL.
//
// Returns sanitized url.href String.
function stripInternalParams(url) {
  url.search = url.search.replace(/([?&])(_pjax|_)=[^&]*/g, '').replace(/^&/, '')
  return url.href.replace(/\?($|#)/, '$1')
}

// Internal: Parse URL components and returns a Locationish object.
//
// url - String URL
//
// Returns HTMLAnchorElement that acts like Location.
function parseURL(url) {
  let a = document.createElement('a')
  a.href = url
  return a
}

// Internal: Return the `href` component of given URL object with the hash
// portion removed.
//
// location - Location or HTMLAnchorElement
//
// Returns String
function stripHash(location) {
  return location.href.replace(/#.*/, '')
}


// Internal: Filter and find all elements matching the selector.
//
// Where $.fn.find only matches descendants, findAll will test all the
// top level elements in the jQuery object as well.
//
// elems    - jQuery object of Elements
// selector - String selector to match
//
// Returns a jQuery object.
function findAll(elems, selector) {
  return elems.filter(selector).add(elems.find(selector))
}

function parseHTML(html) {
  return new DOMParser().parseFromString(html, "text/html")
}

// Internal: Extracts container and metadata from response.
//
// 1. Extracts X-PJAX-URL header if set
// 2. Extracts inline <title> tags
// 3. Builds response Element and extracts fragment if set
//
// data    - String response data
// xhr     - XHR response
// options - pjax options Object
//
// Returns an Object with url, title, and contents keys.
function extractContainer(data, xhr, options) {
  let obj = {};

  // Prefer X-PJAX-URL header if it was set, otherwise fallback to
  // using the original requested url.
  let serverUrl = xhr.getResponseHeader('X-PJAX-URL')
  obj.url = serverUrl ? stripInternalParams(parseURL(serverUrl)) : options.requestUrl
  obj.content_load = false;
  
  const fullDocument = parseHTML(data);
  if (!fullDocument) throw "ERROR PARSE DOCUMENT";


  // If response data is empty, return fast
  if (fullDocument.length === 0)
    return obj

  // If there's a <title> tag in the header, use it as
  // the page's title.
  console.dir(fullDocument.querySelector("head title"))
  obj.title = fullDocument.querySelector("head title").innerText;

  //Implementation of updating additional elements by MAGILA
  if (options.fragments) {
    obj.fragments = [];
    
    options.fragments.forEach(function(selector, index_s) {
      const virtual_element = $body.querySelectorAll(selector)
      obj.fragments[index_s] = document.querySelectorAll(selector)
      console.dir(virtual_element)
      obj.fragments[index_s].forEach(function(element, i) {
        
          Object.values(virtual_element[i].querySelectorAll('script[src]'))
          .filter(el => el !== 0)
          .map(el => {el.remove()});

        element.innerHTML = virtual_element[i].innerHTML;
        obj.content_load = true
      }); 
    });
  }
  else
  {
    console.error("!for pjax, the fragments parameter is not defined, contains null");
  }

  // Trim any whitespace off the title
  if (obj.title) obj.title = $.trim(obj.title)

  return obj
}


//Redirect to the previous page by completely reloading the page
//The standard implementation of Pjax page caching had a huge number
//of problems and also imposed a number of restrictions on the implementation of the web application
//Changes by MAGILA
function PopState(ev)
{
  if(ev.state && ev.state.url)
  {
    locationReplace(ev.state.url)
  }
}

// Install pjax functions on $.pjax to enable pushState behavior.
//
// Does nothing if already enabled.
//
// Examples
//
//     $.pjax.enable()
//
// Returns nothing.
function enable() {
  $.fn.pjax = fnPjax
  $.pjax = pjax
  $.pjax.enable = $.noop
  $.pjax.disable = disable
  $.pjax.click = handleClick
  $.pjax.submit = handleSubmit
  $.pjax.reload = pjaxReload
  $.pjax.defaults = {
    timeout: 650,
    push: true,
    type: 'GET',
    dataType: 'html',
    scrollTo: 0
  }
  window.addEventListener("popstate", PopState);
}

// Disable pushState behavior.
//
// This is the case when a browser doesn't support pushState. It is
// sometimes useful to disable pushState for debugging on a modern
// browser.
//
// Examples
//
//     $.pjax.disable()
//
// Returns nothing.
function disable() {
  $.fn.pjax = function() { return this }
  $.pjax = fallbackPjax
  $.pjax.enable = enable
  $.pjax.disable = $.noop
  $.pjax.click = $.noop
  $.pjax.submit = $.noop
  $.pjax.reload = function() { window.location.reload() }
  window.removeEventListener("popstate", PopState);
}

// Is pjax supported by this browser?
$.support.pjax =
  window.history && window.history.pushState && window.history.replaceState &&
  // pushState isn't reliable on iOS until 5.
  !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/)

if ($.support.pjax) {
  enable()
} else {
  disable()
}

})(jQuery)
