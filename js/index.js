$(document).pjax('[pjaxlink]', {
    fragments:["[pjaxupdate]"],
    timeout: 10000,
    scrollTo: false,
    push: true
});

document.addEventListener('pjax:start', () => {
    // console.log("start")
});

document.addEventListener('pjax:success', () => {;
    // console.log("success")
});

 //повторная инициализация плгинов(если таковы есть)
 document.addEventListener('pjax:end', () => {
    // console.log("end")
});