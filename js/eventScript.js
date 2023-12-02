class eventScript {
  constructor() {
    this.initialization();
  }

  initialization() {
    const modal = document.querySelectorAll("[data-modal_window]"); //МОДАЛЬНОЕ ОКНО
    if (modal) {
      modal.forEach((modalE, index) => {
        if (modalE.getAttribute("data-modal_window") == "true") {
          let hec = document.querySelector(`[modal_id="${index}"]`);
          //перепроверить создан ли контент
          if (!hec) {
            this.modalGeneratorElement(modalE, index);
            modalE.setAttribute("data-modal_window", "false");
          } else {
            hec.remove(); //удалить лишнее
            this.modalGeneratorElement(modalE, index);
            modalE.setAttribute("data-modal_window", "false");
          }
        }
      });
    }

    const textureaPost = document.querySelectorAll("[data-ajaxPost]"); //артибут ajax запроса для texturea
    if (textureaPost) {
      textureaPost.forEach((textPost) => {
        textPost.rows = 1;
        this.ajaxTexturea(textPost);
      });
    }

    // const original_text = document.querySelectorAll("[data-text_original]"); //показ оригинал переведёного текста
    // if (original_text) {
    //   original_text.forEach((e) => {
    //     this.original_text(e);
    //   });
    // }

    const html_slider = document.querySelectorAll(".html_slider"); //html_slider
    if (html_slider) {
      html_slider.forEach((event_slider) => {
        this.html_slider(event_slider, html_slider);
      });
    }

    const comments = document.querySelectorAll(".comments"); //блок комментариев
    if (comments) {
      comments.forEach((element) => {
        this.comments(element);
      });
    }

    const accordionTrigger = document.querySelectorAll(".js-accordionTrigger");
    accordionTrigger.forEach((e) => {
      this.accordion(e);
    });

    new EmojiPicker(); //Запустить эмоджи
    $(".fotorama").fotorama(); //Запустить слайдер
  }

  modalGeneratorElement(modal_window, i) {
    //МОДАЛЬНОЕ ОКНО
    let modal_content = modal_window.querySelector("[data-modal_content]"),
      body = document.querySelector("body");

    const modal_create = document.createElement("div");
    modal_create.setAttribute("class", "modal");
    modal_create.setAttribute("modal_id", i);

    const modal_createContent = document.createElement("div");
    modal_createContent.setAttribute("class", "modal-content");
    modal_createContent.innerHTML = modal_content.innerHTML;

    const modal_bottomExit = document.createElement("span");
    modal_bottomExit.innerHTML = "✘";
    modal_bottomExit.setAttribute("class", "modal-close");

    modal_createContent.append(modal_bottomExit);
    modal_create.append(modal_createContent);
    body.appendChild(modal_create);
    modal_content.remove();
    modal_createContent.querySelector(".dlg-conteiner").style.maxHeight =
      window.innerHeight / 1.7 + "px";
    const elementAvt = modal_createContent.querySelector(".elementAvt"); //Блок авторизации
    if (elementAvt) {
      //auth
      elementAvt.querySelectorAll("[data-auth]").forEach((e) => {
        e.onclick = () => {
          const windowAuth = window.open(
            `auth.php?auth=${e.dataset.auth}`,
            "Добро пожаловать!",
            "width=300,height=200"
          );
          windowAuth.addEventListener(
            "load",
            () => {
              // console.log(11);
              windowAuth.close();
              window.location.reload(false);
            },
            false
          );

          modal_create.classList.remove("modal-active");
          $(
            "main, footer, .blinnk6, .chatbro_chat, .chatbro_header"
          ).removeClass("modal-blurFon");
        };
      });
    }

    const banUser = modal_createContent.querySelector(".ban_parameter"); //элемент с параметрами для создания разметки блокировки пользователей
    if (banUser) {
      let url_ban = banUser.getAttribute("loud"),
        id = banUser.getAttribute("id_user"),
        name_ban = banUser.getAttribute("name");

      const heden = modal_createContent.querySelector(".dlg-prompt");
      heden.append(name_ban);
      heden.classList.add("banNaime");

      const textarea_ban = document.createElement("textarea");
      textarea_ban.classList.add("textareaBan");
      textarea_ban.rows = 1;
      textarea_ban.setAttribute("data-emoji-picker", "true");
      textarea_ban.setAttribute("placeholder", langJS.banText + " " + name_ban);

      const input_range_ban = document.createElement("input");
      input_range_ban.setAttribute("type", "range");
      input_range_ban.setAttribute("step", 10);
      input_range_ban.setAttribute("max", 100);
      input_range_ban.setAttribute("min", 0);
      input_range_ban.value = 0;

      const span_range_ban = document.createElement("span");
      span_range_ban.classList.add("textBan");

      input_range_ban.oninput = function () {
        switch (+this.value) {
          case 0:
            span_range_ban.innerHTML =
              langJS.value_ban.text + " " + langJS.value_ban.value[0];
            break;
          case 10:
            span_range_ban.innerHTML =
              langJS.value_ban.text + " " + langJS.value_ban.value[1];
            break;
          case 20:
            span_range_ban.innerHTML =
              langJS.value_ban.text + " " + langJS.value_ban.value[2];
            break;
          case 30:
            span_range_ban.innerHTML =
              langJS.value_ban.text + " " + langJS.value_ban.value[3];
            break;
          case 40:
            span_range_ban.innerHTML =
              langJS.value_ban.text + " " + langJS.value_ban.value[4];
            break;
          case 50:
            span_range_ban.innerHTML =
              langJS.value_ban.text + " " + langJS.value_ban.value[5];
            break;
          case 60:
            span_range_ban.innerHTML =
              langJS.value_ban.text + " " + langJS.value_ban.value[6];
            break;
          case 70:
            span_range_ban.innerHTML =
              langJS.value_ban.text + " " + langJS.value_ban.value[7];
          case 80:
            span_range_ban.innerHTML =
              langJS.value_ban.text + " " + langJS.value_ban.value[8];
            break;
          case 90:
            span_range_ban.innerHTML =
              langJS.value_ban.text + " " + langJS.value_ban.value[9];
            break;
          case 100:
            span_range_ban.innerHTML = langJS.value_ban.value[10];
            break;
        }
      };

      const botton_range_ban = document.createElement("a");
      botton_range_ban.innerHTML = langJS.value_ban.input;

      botton_range_ban.onclick = () => {
        $.ajax({
          url: url_ban,
          method: "post",
          data: {
            textBan: textarea_ban.value,
            intBan: input_range_ban.value,
            name: name_ban,
            id: id,
          },
          success: ($data) => {
            const result = jQuery.parseJSON($data);

            if (result.status == true) {
              swal(result.text, {
                icon: "success",
              });
            } else if (result.status == false) {
              sweetAlert("Упс...", result.text, "error");
            }
          },
        });
      };
      heden.append(
        textarea_ban,
        input_range_ban,
        document.createElement("br"),
        span_range_ban,
        document.createElement("br"),
        botton_range_ban
      );
    }

    modal_window.onclick = () => {
      //при клике
      const loud_parameter = modal_createContent.querySelector(
        ".loud_parameter"
      ); //элемент с параметрами для загрузки контента

      if (loud_parameter) {
        //загрузить контент
        let url = loud_parameter.getAttribute("loud"),
          parameter = loud_parameter.getAttribute("parameter");

        const loud = document.createElement("div");
        loud.classList.add("layer");

        const loudText = document.createElement("div");
        loudText.classList.add("loudText");
        loudText.innerHTML = "Загрузка...";
        loud.append(loudText);
        modal_createContent.querySelector(".dlg-conteiner").append(loud);

        $.ajax({
          type: "GET",
          url: url,
          error: (jqXHR) => {
            if (jqXHR.status === 0)
              sweetAlert(
                "Упс...",
                "Не подключаться!  Проверьте сетевое подключение.",
                "error"
              ); //  не включен инет// error
          },
          data: parameter,
          beforeSend: function () {
            // Действия, которые будут выполнены перед выполнением этого ajax-запроса
            $(loud).fadeIn(600);
          },
          complete: () => {
            $(loud).fadeOut(400);
          },
          success: ($data) => {
            modal_createContent.querySelector(
              ".dlg-conteiner"
            ).innerHTML = $data;
          },
        });
      }

      $(modal_create).addClass("modal-active"); //сделать активным
      $("main, footer, .blinnk6, .chatbro_chat, .chatbro_header").addClass(
        //блур всего на фоне
        "modal-blurFon"
      );
      modal_bottomExit.onclick = () => {
        const remove = modal_createContent.querySelector(".layer");
        if (remove) {
          modal_createContent.querySelector(".dlg-conteiner").innerHTML = "";
        }
        $(modal_create).removeClass("modal-active");
        $("main, footer, .blinnk6, .chatbro_chat, .chatbro_header").removeClass(
          "modal-blurFon"
        );
      };
    };
  }

  ajaxTexturea(textPost) {
    textPost.onkeypress = function (e) {
      //ajax запрос для отправки комментариев или сообщений
      if (window.event) {
        var keyCode = window.event.keyCode;
      } else {
        var keyCode = e.keyCode || e.which;
      }
      if (!e.ctrlKey && keyCode == 13) {
        //отправить форму на enter
        e.preventDefault();

        let arr = textPost.getAttribute("data-ajaxPost"),
          name = textPost.getAttribute("data-id_textName"),
          verUrl = /([-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?)/gi,
          text = textPost.value.replace(verUrl, "$1 ").trim(),
          urlFile = textPost.getAttribute("data-url");
        $.ajax({
          type: "POST",
          url: urlFile,
          data: "&" + name + "=" + text + arr,
        }).done(($data) => {
          const result = jQuery.parseJSON($data);

          if (result.status == true) {
            $.pjax({
              url: window.location.href,
              container: "#" + this.closest(".comments").getAttribute("id"),
              fragment: "#" + this.closest(".comments").getAttribute("id"),
              scrollTo: false,
              timeout: 4000,
            });
          } else if (result.status == false) {
            swal(result.text, {
              icon: "error",
            });
          }
        });
        textPost.value = "";
        return false;
      } else if ((e.ctrlKey && keyCode == 13) || keyCode == 10) {
        //перенести страку если нажат ctrl+enter
        let caretStart = this.selectionStart,
          caretEnd = this.selectionEnd,
          rect = "\n";

        this.value =
          this.value.substring(0, caretStart) +
          rect +
          this.value.substring(caretEnd);

        this.selectionEnd =
          caretStart == caretEnd ? caretEnd + rect.length : caretEnd;
      }
    };
  }

  original_text(e) {
    if (e.dataset.text_original != "") {
      const text_seve = e.innerHTML,
        text_span = "Переведено автоматически",
        text_a = "Показать исходный текст",
        text_a2 = "Показать перевод",
        animation_taim = 500, //ms время анимации
        timeout = 30; //время выдержки

      let status = false;
      const span = document.createElement("span");
      span.style.color = "burlywood";

      span.innerHTML = `${text_span} `;

      const a = document.createElement("a");
      a.style.color = "chocolate";
      a.innerHTML = text_a;
      a.style.cursor = "pointer";

      span.append(a);
      e.append(document.createElement("br"), span);

      a.addEventListener("click", () => {
        if (!status) {
          $(e).fadeOut(animation_taim);
          setTimeout(() => {
            span.innerHTML = "";
            a.innerHTML = text_a2;
            e.innerHTML = e.dataset.text_original;
            status = true;
            $(e).fadeIn(animation_taim);
          }, animation_taim - timeout);
        } else {
          $(e).fadeOut(animation_taim);
          setTimeout(() => {
            span.innerHTML = `${text_span} `;
            a.innerHTML = text_a;
            e.innerHTML = text_seve;
            status = false;
            $(e).fadeIn(animation_taim);
          }, animation_taim - timeout);
        }
        setTimeout(() => {
          span.append(a);
          e.append(document.createElement("br"), span);
        }, animation_taim - timeout);
      });
    }
  }

  comments(elsement) {
    const response_to_comment = elsement.querySelectorAll(".otvetClick");
    if (response_to_comment) {
      response_to_comment.forEach((event) => {
        let text_element = event.innerHTML;
        event.addEventListener("click", () => {
          const form = event.closest(".comTrein").querySelector("form");
          $(form).slideToggle(200, function () {
            if ($(this).is(":hidden")) {
              event.innerHTML = text_element;
            } else {
              event.innerHTML = "Отмена";
            }
          });
        });
      });
    }

    const edit = elsement.querySelectorAll("[data-edit]");
    if (edit) {
      edit.forEach((event) => {
        let elText = event.parentElement.previousElementSibling, //элемент текста
          start = false, //значение активности
          verUrl = /([-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?)/gi,
          text = elText.innerHTML.trim(), //сохраним текст комментария
          aText = event.innerHTML, //сохраним текст кнопки
          arr = event.getAttribute("ajaxPost");

        event.onclick = () => {
          if (start == false) {
            event.innerHTML = "Отмена";
            elText.innerHTML = "";

            let textarea = document.createElement("textarea"); //создам поле ввода
            //стили
            textarea.style.width = "100%";
            textarea.style.height = "100%";
            textarea.style.background = "none";
            textarea.style.border = "none";
            textarea.style.fontSize = "100%";
            textarea.style.fontFamily = "Graffiti1CTT,imjs";
            textarea.style.lineHeight = 1.6;
            textarea.style.color = "#d1d2d2";
            textarea.style.resize = "none";
            textarea.setAttribute("data-emoji-picker", "true");
            //вставим текст удалив html
            textarea.value = text.replace(/<.*?>/g, "").trim();
            //вставим элемент
            elText.append(textarea);
            let rows = textarea.value.split("\n").length; //выставить высоту по количеству строк.

            new EmojiPicker(); //включить смайлы.

            textarea.focus(); //сфокусировать на ввод текста
            textarea.onkeypress = textareaKeypress;
            textarea.rows = rows;
            function textareaKeypress(e) {
              //ajax запрос для редакции
              if (window.event) {
                var keyCode = window.event.keyCode;
              } else {
                var keyCode = this.keyCode || this.which;
              }
              if (!this.ctrlKey && keyCode == 13) {
                //отправить форму на enter
                e.preventDefault();

                $.ajax({
                  type: "POST",
                  url: "php/usersScripts/seiveComments.php",
                  data:
                    arr +
                    "&redaks=true&comments=" +
                    this.value.replace(verUrl, "$1 ").trim(), //добавим пробел перед ссылкой для прафильного формирования ссылок в php + удалить несколько подряд прабелов
                }).done(($data) => {
                  const result = jQuery.parseJSON($data);

                  if (result.status == true) {
                    $.pjax({
                      url: window.location.href,
                      container:
                        "#" + this.closest(".comments").getAttribute("id"),
                      fragment:
                        "#" + this.closest(".comments").getAttribute("id"),
                      scrollTo: false,
                      timeout: 4000,
                    });
                    swal(result.text, {
                      icon: "success",
                    });
                  } else if (result.status == false) {
                    swal(result.text, {
                      icon: "error",
                    });
                  }
                });
              } else if ((this.ctrlKey && keyCode == 13) || keyCode == 10) {
                //перенести страку если нажат ctrl+enter
                let caretStart = this.selectionStart,
                  caretEnd = this.selectionEnd,
                  rect = "\n";

                this.value =
                  this.value.substring(0, caretStart) +
                  rect +
                  this.value.substring(caretEnd);

                this.selectionEnd =
                  caretStart == caretEnd ? caretEnd + rect.length : caretEnd;
              }
            }
            start = true;
          } else {
            if (elText.querySelector("a")) {
              $(".fotorama").fotorama(); //Запустить слайдер
            }
            elText.innerHTML = text;
            event.innerHTML = aText;
            start = false;
          }
        };
      });
    }
    const mediaCom = elsement.querySelectorAll(".textCom");
    if (mediaCom) {
      mediaCom.forEach((content) => {
        //логика формирования из ссылок в видео/изображение для комментарий в тексте
        let clone = content.getElementsByClassName("controls"),
          clone2 = content.getElementsByClassName("controls2"),
          rama = clone.length,
          rama2 = clone2.length,
          width = 260;
        let blocFotorama = document.createElement("div");
        blocFotorama.style.marginTop = "20px";
        blocFotorama.className = "blocFotorama";
        blocFotorama.style.float = "right";
        blocFotorama.style.width = width + "px";
        blocFotorama.style.display = "flex";

        function siveContent(data1, data2, data3) {
          let fotorama = document.createElement("div");
          fotorama.className = "fotorama";
          fotorama.setAttribute("data-nav", "thumbs");
          fotorama.setAttribute("data-allowfullscreen", "native");
          fotorama.setAttribute("data-transition", "dissolve");
          fotorama.setAttribute("data-width", width + "px");
          var i = 0;
          while (data1 > i) {
            if (data3 == true) {
              blocFotorama.append(data2[i]);
            } else {
              fotorama.append(data2[i].cloneNode(true));
              blocFotorama.appendChild(fotorama);
              data2[i].classList.remove("controls");
            }
            i++;
          }
          content.parentNode.insertBefore(blocFotorama, content);
          if (data3 == false) {
            $(".fotorama").fotorama(); //иницализация плагина
          }
        }
        if (content.getElementsByClassName("blocFotorama").length == 0) {
          //если нет элемента
          if (rama > 0) {
            siveContent(rama, clone, false);
          }
          if (rama2 > 0) {
            siveContent(rama2, clone2, true);
          }
        }
      });
    }

    // restartCom();

    let y = elsement.querySelector(".scroll"),
      // coint = +y.lastElementChild.getAttribute("coint"),
      coint2 = +y.lastElementChild.getAttribute("cointMax"),
      // cointMax = 5,
      // id = y.getAttribute("id-com"),
      // cointOnline = y.getElementsByClassName(id).length,
      H2 = y.previousElementSibling;
    H2.innerHTML = H2.innerHTML.replace(/%s/g, coint2);
    // y.addEventListener("scroll", () => {
    //   if (
    //     y.scrollTop + y.clientHeight == y.scrollHeight &&
    //     coint !== cointOnline
    //   ) {
    //     $.ajax({
    //       url: "php/usersScripts/seiveComments.php",
    //       method: "post",
    //       beforeSend: function () {
    //         $(y.getElementsByClassName("layer")).fadeIn("fast");
    //         $(y)
    //           .children("*:not(script, .layer)")
    //           .addClass("modal-blurFon");
    //       },
    //       complete: function () {
    //         $(y.getElementsByClassName("layer")).fadeOut();
    //         $(y)
    //           .children("*:not(script, .layer)")
    //           .removeClass("modal-blurFon");
    //       },
    //       data:
    //         "&loudLinc=true&limitHtml=" +
    //         cointOnline +
    //         "&limitMax=" +
    //         cointMax +
    //         "&id_comments=" +
    //         id,
    //       success: function ($data) {
    //         $(y).append($data);
    //         coms = document.querySelectorAll(".comments");
    //         rtr();
    //       },
    //     });
    //   } else {
    //     cointOnline = y.getElementsByClassName(id).length;
    //   }
    // });
    // function restartCom() {}
    // function rtr() {
    //   restartCom();
    // }
    //редактировать комментарий.

    // elsement
  }

  accordion(accordionToggles) {
    let touchSupported = "ontouchstart" in window,
      pointerSupported = "pointerdown" in window;
    function skipClickDelay(e) {
      e.preventDefault();
      e.target.click();
    }
    function setAriaAttr(el, ariaType, newProperty) {
      el.setAttribute(ariaType, newProperty);
    }
    function setAccordionAria(el1, el2, expanded) {
      if (expanded) {
        setAriaAttr(el1, "aria-expanded", "true");
        setAriaAttr(el2, "aria-hidden", "false");
      } else {
        setAriaAttr(el1, "aria-expanded", "false");
        setAriaAttr(el2, "aria-hidden", "true");
      }
    }
    //function
    function switchAccordion(e) {
      e.preventDefault();
      const thisAnswer = e.target.parentNode.nextElementSibling,
        thisQuestion = e.target;
      if (thisAnswer.classList.contains("is-collapsed")) {
        setAccordionAria(thisQuestion, thisAnswer, true);
      } else {
        setAccordionAria(thisQuestion, thisAnswer, false);
      }
      thisQuestion.classList.toggle("is-collapsed");
      thisQuestion.classList.toggle("is-expanded");
      thisAnswer.classList.toggle("is-collapsed");
      thisAnswer.classList.toggle("is-expanded");
      thisAnswer.classList.toggle("animateIn");
    }

    if (touchSupported) {
      accordionToggles.addEventListener("touchstart", skipClickDelay);
    }
    if (pointerSupported) {
      accordionToggles.addEventListener("pointerdown", skipClickDelay);
    }
    accordionToggles.addEventListener("click", switchAccordion);
  }

  html_slider(slider) {
    const slideSelector = slider.querySelectorAll(".slide");
    const background_img_conteiner = document.createElement("div");
    background_img_conteiner.classList.add("is-bg-overflow");
    let active_content = 1;
    const parameters = {
      pagination: true,
      loop: true,
      autoStart: 10, //sec
    };

    slideSelector.forEach((event, index) => {
      index++;
      if (index == 1) {
        event.style.display = "block";
        event.querySelector(".headers_slide").style.top = 0;
        event.querySelector(".dynamic_data").style.bottom = 0;
      }

      const background_img = event.dataset.background_img;
      const event_img = document.createElement("div");
      event_img.classList.add("is-background");
      if (index > 1) event_img.setAttribute("style", "display:none");
      const img = document.createElement("img");
      img.setAttribute("src", background_img);

      event_img.append(img);
      background_img_conteiner.append(event_img);
    });
    slider.append(background_img_conteiner);

    const background_img_conteint = background_img_conteiner.querySelectorAll(
      ".is-background"
    );

    function animate_start(show_hide_status, active, time) {
      active--;
      const rama = slider.querySelector(".rama_slider");
      rama.style.zIndex = 3;
      setTimeout(() => {
        rama.style.zIndex = 1;
      }, time);
      function update_obj() {
        return {
          headers_slide: slideSelector[active].querySelector(".headers_slide"),
          text_content: slideSelector[active].querySelector(".text_content"),
          dynamic_data: slideSelector[active].querySelector(".dynamic_data"),
        };
      }
      function show_hide(arree) {
        arree.forEach((event) => {
          $(event.element).animate(event.css, {
            queue: false,
            duration: time,
            easing: event.animate,
          });
        });
      }
      const slideobj = update_obj()
      if (show_hide_status) {
       
        show_hide([
          {
            element: slideobj.headers_slide,
            css: { top: 0 },
            animate: "easeOutBounce",
          },
          {
            element: slideobj.text_content,
            css: { left: 0 },
            animate: "easeOutBounce",
          },
          {
            element: slideobj.dynamic_data,
            css: { bottom: 0 },
            animate: "easeOutBounce",
          },
        ]);

        $(slideSelector[active]).fadeIn(time);
        $(background_img_conteint[active]).fadeIn(time);
      } else {
        show_hide([
          {
            element: slideobj.headers_slide,
            css: { top: "-50%" },
            animate: "easeOutCubic",
          },
          {
            element: slideobj.text_content,
            css: { left: "-100%" },
            animate: "easeOutCubic",
          },
          {
            element: slideobj.dynamic_data,
            css: { bottom: "-50%" },
            animate: "easeOutCubic",
          },
        ]);

        $(slideSelector[active]).fadeOut(time);
        $(background_img_conteint[active]).fadeOut(time);
      }
    }

    function moveNext() {
      //вперёд
      //действие с текущей позицыей
      animate_start(false, active_content, 1200);
      //действие со следующей позицией
      active_content++;
      if (active_content > slideSelector.length) active_content = 1;
      animate_start(true, active_content, 1000);
    }
    slider.querySelector(".is-next").addEventListener("click", function () {
      setTimeout(() => {
        this.blur();
      }, 600);
      moveNext();
    });
    slider.querySelector(".is-prev").addEventListener("click", function () {
      setTimeout(() => {
        this.blur();
      }, 600);
      //назад
      //действие с текущей позицыей
      animate_start(false, active_content, 1200);
      //действие со следующей позицией
      active_content--;

      if (active_content < 1) active_content = slideSelector.length;
      animate_start(true, active_content, 1000);
    });

    let move = false,
      timer_ID = 0;
    function remove_autoStart() {
      if (!move) {
        clearTimeout(timer_ID);
        move = true;
      }
    }
    function create_autoStart() {
      if (move) {
        move = false;
        autoStart();
      }
    }
    slider.addEventListener("mouseover", remove_autoStart);
    slider.addEventListener("mouseout", create_autoStart);
    window.addEventListener("blur", remove_autoStart);
    window.addEventListener("focus", create_autoStart);

    autoStart();
    function autoStart() {
      if (parameters.autoStart != 0 || parameters.autoStart != false) {
        timer_ID = setInterval(() => {
          moveNext();
        }, 1000 * parameters.autoStart);
      }
    }
    moveNext()
  }
}