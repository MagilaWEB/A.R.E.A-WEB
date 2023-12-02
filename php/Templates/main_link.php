<?php

//Разные другие страницы
$this->InterfaceUser->MainLinkALL($this->NAV, "Другое", [
    array(
        "text" => 'Первая ссылка',
        "url" => $this->PAGE
    ),
    array(
        "text" => 'Вторая ссылка',
        "url" => 'test3'
    )
]);

//Переключатель языка интерфейса
$this->InterfaceUser->MainLinkALL($this->NAV, "Выбрать язык", [
    array(
        "text" => 'Русский',
        "url" => $this->PAGE."?lang=ru"
    ),
    array(
        "text" => 'English',
        "url" => $this->PAGE."?lang=en"
    )
], false);

//Уведомления
$a = $this->InterfaceUser->MainLinkContent
( 
    $this->NAV,
    _function: function($ui)
    {
        $this->DOM->createHTML_attribute($this->DOM->createHTML($ui, 'div', "Уведомлений нет."), 'class', "bell-content");
    },
    title:"Уведомления"
);

$this->DOM->createHTML_attribute($a->parentNode, 'class', "nav-link");

$this->DOM->createHTML_attribute($a, 'class', "link-a");

$a_i = $this->DOM->createHTML($a, 'i');

$this->DOM->createHTML_attribute($a_i, 'class', "icon-bell");

//Счётчик онлайна
$a = $this->InterfaceUser->MainLinkContent
(
    $this->NAV,
    _function: function($ui)
    {
        $div = $this->DOM->createHTML($ui, 'div');
        $this->DOM->createHTML_attribute($div, 'class', "bell-content");
        $div = $this->DOM->createHTML($div, 'div');
        $this->DOM->createHTML_attribute($div, 'class', "bell-users-online");
        
        $this->DOM->createHTML($this->DOM->createHTML($div, 'p', "Онлайн гостей: "), 'span', "0");
        $this->DOM->createHTML($this->DOM->createHTML($div, 'p', "Авторизованных онлайн: "), 'span', "0");
        $this->DOM->createHTML($this->DOM->createHTML($div, 'p', "Авторезированно: "), 'span', "0");
    },
    title: "Всего онлайна"
);

$this->DOM->createHTML_attribute($a->parentNode, 'class', "nav-link");

$this->DOM->createHTML_attribute($a, 'class', "link-a");

$a_i = $this->DOM->createElementAttributes($a, "i", attributes: [
    'class' => 'icon-users link-user-online'
]);

$this->DOM->createHTML($a_i, "span", '0');

//Счётчик скачиваний
$a = $this->InterfaceUser->MainLinkContent
(
    $this->NAV,
    _function: function($ui)
    {
        $div = $this->DOM->createHTML($ui, 'div');
        $this->DOM->createHTML_attribute($div, 'class', "bell-content");
        $div = $this->DOM->createHTML($div, 'div');
        $this->DOM->createHTML_attribute($div, 'class', "bell-users-online");
        $this->DOM->createHTML($this->DOM->createHTML($div, 'p', "Всего скачиваний: "), 'span', "0");
    }
);

$this->DOM->createHTML_attribute($a->parentNode, 'class', "nav-link");

$this->DOM->createHTML_attribute($a, 'tabindex', "0");

$a_i = $this->DOM->createElementAttributes($a, "i", attributes: [
    'class' => 'icon-download link-icon-download',
    'title' => 'Всего скачиваний'
]);

$this->DOM->createHTML($a_i, "span", '0');