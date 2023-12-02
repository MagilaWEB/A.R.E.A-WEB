function langJSONset() {
  $.ajax({
    url: "lang/lang_beta." + langJS + ".php",
    method: "post",
    data: { LangJS: true },
    async: true,
  })
    .done(function (n) {
      localStorage.setItem("langJSON", n);
    })
    .fail(function (n) {
      console.error("ajax Failure!" + n);
    });
}

if (!localStorage.getItem("langJSON")) {
  langJSONset();
}
langJS = JSON.parse(localStorage.getItem("langJSON"));

//активен пользователь?
let no_active_delay = 5, //интервалов обновления
  now_no_active = 0,
  time_interval = 2; //скорость обновления сек

setInterval("updateChat()", +(time_interval + "000"));

function updateChat() {
  if (now_no_active >= no_active_delay) {
    return false;
  }
  /* Запрос на обновление данных */
  show();
  now_no_active = now_no_active + 1;
}

function resetAtive() {
  now_no_active = 0;
}
// window.onblur = () => {
//   now_no_active = 1000;//запретить обновлять контент и получать актуальные данные
// };
document.onmousemove = resetAtive; //водит мышкой сброс счётчика
document.onkeypress = resetAtive; //пичатает сброс счётчика
document.onscroll = resetAtive; //скролит сброс счётчика

let seed = 0, //запомнить общее количество уведомлений
  seed_new = 0, //запомнить количество новых уведомлений
  audioPush_start = false, //запустить уведомление звук+push
  content_set = false; //работа с контентом (создовать..-нет)
function show() {
  $.ajax({
    url: "php/usersScripts/online.php",
    async: true,
    success: (data) => {
      const result = jQuery.parseJSON(data);
      document.querySelector("nav .link-user-online span").innerHTML =
        result.onlineMass;
      document.querySelector(".bell-users-online .onlineGost span").innerHTML =
        result.onlineGost;
      document.querySelector(
        ".bell-users-online .onlineRegister span"
      ).innerHTML = result.onlineRegister;
      document.querySelector(".bell-users-online .register span").innerHTML =
        result.register;

      if (result.onlineMass > 20 && result.onlineMass < 50) {
        time_interval = 4;
        no_active_delay = 4;
      } else if (result.onlineMass > 50 && result.onlineMass < 100) {
        time_interval = 6;
        no_active_delay = 2;
      } else if (result.onlineMass > 100) {
        time_interval = 8;
        no_active_delay = 1;
      }

      //---------------------уведомления
      let notif_length = result.Notif.coint, //смотрим количесво новых уведомлений
        notif_id_length = result.Notif.id.length, //всего уведомлений выведино
        content = document.querySelector(".bell-content"), //смотрим куда поместить
        bell = document.querySelector(".nav-link .link-a"), //ищем калокольчик
        navbar_badge = bell.querySelector(".navbar-badge"); //ищем иконку количества уведомлений

      if (!navbar_badge) {
        if (seed_new !== notif_length) {
          //если не создан создать значёк количества уведомлений
          const bell_new = document.createElement("span");
          bell_new.classList.add("navbar-badge");
          bell_new.innerHTML = notif_length;
          bell.append(bell_new);
        }
      } else {
        if (seed_new !== notif_length) navbar_badge.innerHTML = notif_length; //не создовать а перезаписать значение

        if (notif_length == 0) navbar_badge.remove(); //удалить значёк на колокольчике
      }
      if (notif_length == 0 && !content.querySelector(".feedback_content")) {
        //отобразить придупрежение о том что уведомлений нет
        const feedback_content = document.createElement("a");
        feedback_content.style.textAlign = "center";
        feedback_content.style.fontSize = "170%";
        feedback_content.classList.add("feedback_content");
        feedback_content.innerHTML = "Нет уведомлений";

        content.innerHTML = "";
        content.append(feedback_content);
      }

      if (seed != notif_id_length) {
        //выполнить если стало больше уведомлений или меньше или появились новые.
        // console.dir(result.Notif);
        content.innerHTML = ""; //очистим

        $.ajax({
          url: "php/usersScripts/notifications.php",
          method: "POST",
          data: {
            id_notif: JSON.stringify(result.Notif.id),
          },
          async: true,
        })
          .done(function (response) {
            response = jQuery.parseJSON(response);

            response.forEach((e, index) => {
              //бежим по массиву уведомлений
              let onmousemove = true; //отметить как прочитано

              const feedback_content = document.createElement("a");
              feedback_content.classList.add("feedback_content");
              feedback_content.classList.add("activ");

              //
              const feedback = document.createElement("a");
              feedback.classList.add("feedback");
              feedback.setAttribute("href", "/profile?idProfile=" + e.id_user);
              feedback.setAttribute("pjaxlinc", "");

              const icon = document.createElement("i");
              icon.classList.add(e.icon);

              const img = document.createElement("img");
              img.classList.add("feedback_img");
              img.setAttribute("src", e.img);
              feedback.append(icon, img);

              const feedback_header = document.createElement("div");
              feedback_header.classList.add("feedback_header");

              const feedback_bottom = document.createElement("div");
              feedback_bottom.classList.add("feedback_bottom");

              const feedback_header_span = document.createElement("span");
              feedback_header_span.classList.add("rel_date");
              feedback_header_span.append(
                e.time.day,
                " ",
                e.time.month,
                " ",
                e.time.year
              );
              const botSeen = document.createElement("a");

              if (+result.Notif.seen[index] == 0) {
                botSeen.classList.add("icon-cancel");
              } else {
                onmousemove = false;
                botSeen.style.color = "chartreuse";
                feedback_content.classList.remove("activ");
                botSeen.classList.add("icon-ok");
              }

              feedback_bottom.append(botSeen, feedback_header_span);

              const name = document.createElement("a");
              name.setAttribute("href", "/profile?idProfile=" + e.id_user2);
              name.setAttribute("pjaxlinc", "");
              name.innerHTML = e.user_name;

              const name2 = document.createElement("a");
              name2.setAttribute("href", "/profile?idProfile=" + e.id_user);
              name2.innerHTML = e.user_name2;

              const post_a_teg = document.createElement("a");
              post_a_teg.setAttribute("href", e.post_url);
              post_a_teg.setAttribute("pjaxlinc", "");
              post_a_teg.innerHTML = e.post_name;

              feedback_content.onclick = () => {
                if (onmousemove) {
                  onmousemove = false;
                  seenTrue();
                }
              };
              function seenTrue() {
                $.ajax({
                  url: "php/usersScripts/notifications.php",
                  method: "post",
                  data: { heck: true, id_notif: result.Notif.id[index] },
                })
                  .done(() => {
                    botSeen.classList.remove("icon-cancel");
                    botSeen.classList.add("icon-ok");
                    botSeen.style.color = "chartreuse";
                    feedback_content.classList.remove("activ");
                  })
                  .fail(function (e) {
                    console.error("ajax Failure!", e);
                  });
              }

              let text = document.createElement("span");
              text.style.color = "gold";
              text.append(e.text);

              let text2 = document.createElement("span");
              text2.style.color = "gold";
              text2.append(e.text2);
              //console.dir(e.lang_text);
              let z = [
                name.outerHTML,
                name2.outerHTML,
                post_a_teg.outerHTML,

                e.time_post.day +
                  " " +
                  e.time_post.month +
                  " " +
                  e.time_post.year,

                e.time_post.hour + ":" + e.time_post.minutes,
                e.lang_text[0],
                e.lang_text[1],
                e.lang_text[2],
                e.lang_text[3],
                e.lang_text[4],
                e.lang_text[5],
                text.outerHTML,
                text2.outerHTML,
              ];

              let arreyContent = "";
              let cx = 0;

              while (e.lang_text[100].length > cx) {
                arreyContent =
                  arreyContent + " " + z[e.lang_text[100][cx]] + " ";
                cx++;
              }

              feedback_header.innerHTML = arreyContent;

              feedback_content.append(
                feedback,
                feedback_header,
                feedback_bottom
              );

              content.append(feedback_content, document.createElement("hr"));
            });
          })
          .fail(function (e) {
            console.error("ajax Failure!", e);
          });
      }
      if (seed_new < notif_length) {

        Push.create(langJS.PushTitle, {
          body:
            langJS.PushBody[0] +
            " (" +
            notif_length +
            ") " +
            langJS.PushBody[1],
          icon: "image/favicon.webp", // Иконка уведомления
          timeout: 13000, // Через сколько закроется уведомление
          tag: "notice", // Если задан, по этому параметру можно закрыть уведомление и такое уведомление появится лишь один раз
          onClick: function () {
            window.focus(); // После клика по уведомлению нас вернёт во вкладку, откуда оно пришло
            this.close(); // Само уведомление будет закрыто
            bell.onmousemove = true;
          },
        });
      }
      seed_new = notif_length;
      seed = notif_id_length;
    },
  });
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

  //ajax зопрос по клику кнопки
  const clicajax = element("clicajax");
  if (clicajax) {
    swal({
      title: "Постойте!",
      text: "Вы уверенны что хотите " + Element.target.title + "?",
      icon: "warning",
      buttons: {
        cancel: {
          text: "Отмена",
          value: false,
          visible: true,
          className: "",
          closeModal: true,
        },
        confirm: {
          text: "Подтвердить",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
      },
    }).then((willDelete) => {
      if (willDelete) {
        let tim = 0;
        setInterval(() => {
          if (tim == 0) {
            clicajax.innerHTML = "Подождите";
          } else if (tim <= 3) {
            clicajax.innerHTML = clicajax.innerHTML + ".";
          } else {
            tim = 0;
            return false;
          }
          tim++;
        }, 1000);

        $.ajax({
          type: "POST",
          url: clicajax.dataset.clicajaxUrl,
          data: clicajax.dataset.clicajax,
        }).done(($data) => {
          if ($data != "") {
            const result = jQuery.parseJSON($data);

            if (result.status == true) {
              const contentUpdaites = clicajax.closest(".comments");

              if (contentUpdaites) {
                $.pjax({
                  url: window.location.href,
                  container: "#" + contentUpdaites.getAttribute("id"),
                  fragment: "#" + contentUpdaites.getAttribute("id"),
                  scrollTo: false,
                  timeout: 4000,
                });
              } else {
                $.pjax({
                  url: window.location.href,
                  container: ".pjaxLoud",
                  fragment: ".pjaxLoud",
                  scrollTo: false,
                  timeout: 4000,
                });
              }
              swal(result.text, {
                icon: "success",
              });
            } else if (result.status == false) {
              swal(result.text, {
                icon: "error",
              });
            }
          } else {
            sweetAlert(
              "Упс...",
              "Сервер не вернул результат или дал отрицательный ответ.",
              "error"
            ); // error
          }
        });
      }
    });
  }

  //обработчик лайков
  const like = element("like");
  if (like) {
    const statysLike = JSON.parse(like.dataset.like); //получить статус поставлен лайк или нет

    let cointLike = +like.firstElementChild.innerText; //получить общее количество лайков.
    //если пользователь авторизован
    $.ajax({
      url: "php/usersScripts/like.php",
      method: "post",
      data: "&like_status=" + statysLike + like.dataset.like_mesh,
      async: true,
    })
      .done((status) => {
        if (status != "") {
          const result = jQuery.parseJSON(status);

          if (result.status == true) {
            if (!statysLike) {
              //лайк поставлен
              like.classList.remove("icon-heart-empty");
              like.classList.add("icon-heart");
              like.dataset.like = true;
              like.style.color = "red";
              cointLike++;
            } else {
              //лайк убран
              like.classList.remove("icon-heart");
              like.classList.add("icon-heart-empty");
              like.style.color = "burlywood";
              like.dataset.like = false;
              cointLike--;
            }
            like.firstElementChild.innerText = cointLike; //отобразим общееколичество
          } else if (result.status == false) {
            swal(result.text, {
              icon: "error",
            });
          }
        } else {
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
});
