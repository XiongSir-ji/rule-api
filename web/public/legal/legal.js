(function () {
  var STORAGE_KEY = 'i18nextLng'
  var SELECTOR = '.langs a'

  function normalize(value) {
    if (!value) return null
    var v = String(value).toLowerCase().replace(/_/g, '-')
    if (v.indexOf('zh') === 0) {
      if (v.indexOf('tw') >= 0 || v.indexOf('hk') >= 0 || v.indexOf('mo') >= 0 || v.indexOf('hant') >= 0) return 'zhTW'
      return 'zhCN'
    }
    if (v.indexOf('fr') === 0) return 'fr'
    if (v.indexOf('ja') === 0) return 'ja'
    if (v.indexOf('ru') === 0) return 'ru'
    if (v.indexOf('vi') === 0) return 'vi'
    if (v.indexOf('en') === 0) return 'en'
    return null
  }

  function storedLanguage() {
    try {
      return normalize(window.localStorage.getItem(STORAGE_KEY))
    } catch (e) {
      return null
    }
  }

  function remember(language) {
    try {
      window.localStorage.setItem(STORAGE_KEY, language)
    } catch (e) {}
  }

  function preferredLanguage() {
    var param = null
    try {
      param = new URLSearchParams(window.location.search).get('lang')
    } catch (e) {}
    var fromParam = normalize(param)
    if (fromParam) return fromParam
    var fromStore = storedLanguage()
    if (fromStore) return fromStore
    var candidates = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]
    for (var i = 0; i < candidates.length; i++) {
      var match = normalize(candidates[i])
      if (match) return match
    }
    return 'en'
  }

  function pageHref(slug, language) {
    var suffix = language === 'en' ? '' : '.' + language
    return '/legal/' + slug + suffix + '.html?lang=' + language
  }

  var root = document.documentElement
  var current = root.getAttribute('data-lang') || 'en'
  var wanted = preferredLanguage()

  if (wanted !== current) {
    window.location.replace(pageHref(root.getAttribute('data-slug'), wanted) + window.location.hash)
    return
  }

  function activate() {
    var links = document.querySelectorAll(SELECTOR)
    for (var i = 0; i < links.length; i++) {
      var link = links[i]
      var language = link.getAttribute('data-lang')
      if (language === current) {
        link.setAttribute('aria-current', 'true')
      } else {
        link.removeAttribute('aria-current')
      }
      link.addEventListener('click', function () {
        remember(this.getAttribute('data-lang'))
      })
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', activate)
  } else {
    activate()
  }
})()
