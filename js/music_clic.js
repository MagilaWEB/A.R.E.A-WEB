// var loudlinks = function(e) {
//     function t() {
//         var e, t, r = this.getAttribute("data-sound") || this.getAttribute("data-src");
//         r && (r.indexOf("{{type}}") > 0 ? (e = r.replace(c, "mp3"), t = r.replace(c, "ogg")) : (e =  r + ".mp3", t = r + ".ogg"), l || (l = !0, u.addEventListener("error", function() {
//             s.error("Файл mp3 повреждён или указан неверный url!")
//         }), d.addEventListener("error", function() {
//             s.error("Файл  ogg повреждён или указан неверный url!")
//         }))), (u.src !== e || d.src !== t) && a.load(), (u.setAttribute("src", e), d.setAttribute("src", t), a.play(), a.volume = 0.5) //50% громкость
//     }

//     function r() {
//          a.currentTime = 0
//     }

//     function n(e) {
//         e.addEventListener("mouseenter", t), e.addEventListener("click", r)
//     }

//     function o(e) {
//         e.addEventListener("click", t)
//     }

//     function i() {
//         var t, r = e.getElementsByClassName("loud-link-hover"),
//             s = e.getElementsByClassName("loud-link-click"),
//             a = r.length,
//             u = s.length;
//         for (t = 0; a > t; t++) n(r[t]);
//         for (t = 0; u > t; t++) o(s[t]);
//         return i
//     }
//     var s = window.console || {};
//     if (s.log = s.log || function() {}, s.error = s.error || s.log, !e.createElement("audio").canPlayType) return s.error("Ваш браузер не поддерживает звуковые эффекты сайта.");
	
//     var a = e.createElement("audio"),
//         u = e.createElement("source"),
//         d = e.createElement("source"),
//         l = !1,
//         c = /{{type}}/gi;
//     return a.setAttribute("preload", !0), u.setAttribute("type", "audio/mpeg"), d.setAttribute("type", "audio/ogg"), a.appendChild(u), a.appendChild(d), e.body.appendChild(a), i()
// }(document);