// function modal(selectorButton, selectorContent, nectos) {
//   //удалить блядскую санину!!!
//   let body = $("body"); //запомним элемент body
//   let content = $(selectorContent); //найти контент
//   let botton = $(selectorButton); //получить кнопку

//   if (nectos != true) {
//     var roto = false;
//   } else {
//     roto = "";
//   }
//   body.prepend(
//     //создадим в body модальное окно
//     '<div class="modal ' +
//       roto +
//       '" data-modal="' +
//       selectorButton +
//       '">' +
//       '<div class="modal-content">' +
//       '<a class="modal-close">✘</a>' +
//       "</div></div>"
//   );

//   let modal = $(
//     //получить необходимое модальное окно
//     '.modal[data-modal="' + selectorButton + '"]'
//   );
//   modal
//     .find(".modal-content")
//     .append(content.css({ height: "100%", overflow: "auto" })); //найти блок контента в модальном окне и поместить в него контент

//   botton.on("click", function() {
//     //событие клика кнопки для открытия модального окна
//     modal.addClass("modal-active");
//     $("main, footer, .blinnk6, .chatbro_chat, .chatbro_header").addClass(
//       "modal-blurFon"
//     );
//   });

//   let close = $(".modal-close"); //кнопка закрыть

//   close.on("click", function() {
//     //собыие закрытия
//     modal.removeClass("modal-active");
//     $("main, footer, .blinnk6, .chatbro_chat, .chatbro_header").removeClass(
//       "modal-blurFon"
//     );
//   });
// }
