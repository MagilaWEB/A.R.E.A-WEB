<?php
class INTERFACE_USER
{
    public function __construct(private $Engine)
    {}

    #Вар дамп данных и отрисовка на странице
    public function DebugVarDump($obj) : void
    {
        ?><pre style="color:#fff; background: black;"> <?php var_dump($obj)?></pre><?php
    }

    #Создаёт ссылку в меню возращает обьект ссылки
    public function MainLink($element, string $text = "", string $url = '', array $attributes = array(), bool $pjax = true)
    {
       $a = $this->Engine->DOM->createElementAttributes
       (
           $this->Engine->DOM->createHTML($element, "li"),
           "a",
           $text,
           $attributes
        );

       $this->Engine->DOM->createHTML_attribute($a, "href", $url);
       if($pjax == true) $this->Engine->DOM->createHTML_attribute($a, "pjaxlink");
       return $a;
    }

    #Создаёт пункт с группой ссылок в меню возращает ui блок с ссылками
    public function MainLinkALL($element, string $text = "", array $AllLink = array(), bool $pjax = true)
    {
       $li = $this->Engine->DOM->createHTML($element, "li");
       $a = $this->Engine->DOM->createHTML($li, "a", $text);
       $this->Engine->DOM->createHTML_attribute($a, "title", "Выберите вариант.");

       $ul = $this->Engine->DOM->createHTML($li, "ul");

       foreach ($AllLink as $data)
       {
           if(is_array($data) and array_key_exists("text", $data))
           {
                if(!array_key_exists("url", $data))
                    $data["url"] = '';

                if(!array_key_exists("attributs", $data))
                    $data["attributs"] = array();
                   
                $this->MainLink($ul, $data["text"], $data["url"], $data["attributs"], $pjax);
           }
       }

       $i = $this->Engine->DOM->createHTML($ul, "i");
       $this->Engine->DOM->createHTML_attribute($i, "class", "ui_arrow");
       return $ul;
    }

    #Создаёт пункт в меню с пустым местом для контента возращает тег "a"
    public function MainLinkContent($element, callable $_function, string $text = "", string $title = "Выберите вариант.")
    {
       $li = $this->Engine->DOM->createHTML($element, "li");
       $a = $this->Engine->DOM->createHTML($li, "a", $text);
       $this->Engine->DOM->createHTML_attribute($a, "title", $title);

       $ul = $this->Engine->DOM->createHTML($li, "ul");
       $_function($ul);
       $i = $this->Engine->DOM->createHTML($ul, "i");
       $this->Engine->DOM->createHTML_attribute($i, "class", "ui_arrow");
       return $a;
    }
}
