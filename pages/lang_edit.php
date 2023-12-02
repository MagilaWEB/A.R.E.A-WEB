<?php
$this->ParamPage(
    TITLE: 'LANG_TITLE',
    TITLE_FULL: "LANG_TITLE_FULL",
    CONTENT_RENDER: function()
    {
        $DIV = $this->DOM->createHTML($this->DinamicBlockFooting, "div");
        $this->DOM->createHTML($this->DinamicBlockFooting, "h2", "Страница редактирования текстов локолизации сайта для модераторов");
        $this->DOM->createHTML_attribute($DIV, "class", "lang_edit_block");
        $this->DOM->createElementForm($DIV,
            [
                [
                    "name" => 'input',
                    "attributes" => [
                        "type" => 'text'
                    ]
                ]
                
            ]
        );
        // $this->LANG->UpdatetText('LANG EDIT', "Редактор локализации интерфейса.");
        return true;
    }
);