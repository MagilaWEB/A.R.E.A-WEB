//
class UpdateAdmin {
  constructor() {
    this.initiate();
  }
  initiate() {
    const forms = document.querySelectorAll(".admin_panel_post .panel");

    if (forms) {
      forms.forEach((e) => {
        e.addEventListener("submit", (event) => {
          event.preventDefault();
          this.formSubmit(event.srcElement.elements);
        });
      });
    }
  }
  formSubmit(event) {
    let obj = {};
    for (let i = 0; event.length > i; i++) {
      let element = event[i];
      if (element.name != "") obj[element.name] = element.value;
    }
    console.dir(obj);
    $.ajax({
      url: "php/adminScripts/new_post.php",
      method: "post",
      data: obj,
      async: true,
    })
      .done((status) => {
        // alert(status);
        if (status == "") status = "false";
        if (JSON.parse(status)) {
          $.pjax({
            url: window.location.href,
            container: ".pjaxLoud",
            fragment: ".pjaxLoud",
            scrollTo: false,
            timeout: 4000,
          });
        } else {
          //если отрицательный
          sweetAlert(
            "Упс...",
            "Сервер не вернул результат или дал отрицательный ответ.",
            "error"
          ); // error
        }
      })
      .fail(() => {
        sweetAlert("Упс...", `ajax Failure!`, "error"); // error
      });
  }
}
//действия только при клике по элементу
document.addEventListener("click", (Element) => {
  function element(attribute) {
    let element = false;
    let t = Element.target.closest(`[data-${attribute}]`);
    if (t) {
      element = t;
    }
    return element;
  }
  //определить элемент по атрибуту data-bla_bla-bla

  //новый пост
  const new_post = element("new_post");
  if (new_post) {
    // let panel_post = document.querySelector(".admin_panel_post .panel");
    // let obj_elm = {};
    // panel_post.childNodes.forEach((element) => {
    //   const elm_name = {
    //     pages: true,
    //     heden: true,
    //     text_content: true,
    //     div: true,
    //   };
    //   if (elm_name[element.name]) {
    //     obj_elm[element.name] = element.value;
    //   } else if (elm_name[element.localName]) {
    //     obj_elm[element.children[0].name] = element.children[0].value;
    //   }
    // });
    // console.dir(panel_post);
    // $.ajax({
    //   url: "php/adminScripts/new_post.php",
    //   method: "post",
    //   data: obj_elm,
    //   async: true,
    // })
    //   .done((status) => {
    //     if (status == "") status = "false";
    //     if (JSON.parse(status)) {
    //       $.pjax({
    //         url: window.location.href,
    //         container: ".pjaxLoud",
    //         fragment: ".pjaxLoud",
    //         scrollTo: false,
    //         timeout: 4000,
    //       });
    //     } else {
    //       //если отрицательный
    //       sweetAlert(
    //         "Упс...",
    //         "Сервер не вернул результат или дал отрицательный ответ.",
    //         "error"
    //       ); // error
    //     }
    //   })
    //   .fail(() => {
    //     sweetAlert("Упс...", `ajax Failure!`, "error"); // error
    //   });
  }
});
