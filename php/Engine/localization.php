<?php
class Localization extends InterfaceUser
{
    public string $type;
    private $BASE_TEXT;

    //Загрузить текста
    private function LoudTextAll() : void
    {
        $this->BASE_TEXT = R::find('lang', 'type = ?', [$this->type]);
    }

    public function ChecComendLang() : void
    {
        $this->type = array_key_exists("lang", $_GET)? $_GET["lang"] : "ru";
        $this->LoudTextAll();
    }

    //Создать в БД запись
    public function SetText(string $name, string $text) : void
    {
        $lang = R::dispense('lang');
        $lang->type = $this->type;
        $lang->name = $name;
        $lang->text = $text;
        R::store($lang);
    }

    //Обновить текст в БД
    public function UpdatetText(string $name, string $text) : void
    {
        $lang = R::findOne('lang', 'name = ? AND type = ?', [$name, $this->type]);
        $lang->text = $text;
        R::store($lang);
    }

     //Удаляет для текущей локализации текст из БД
     public function RemoveText(string $name) : void
     {
         $lang = R::findOne('lang', 'name = ? AND type = ?', [$name, $this->type]);
         R::trash($lang);
     }

     //Удаляет для всех локолизаций текст из БД
     public function RemoveTextAll(string $name) : void
     {
         $lang = R::findOne('lang', 'name = ?', [$name]);
         R::trash($lang);
     }
    
    //Получить текст интерфейса из базы данных, в противном случае создать в базе данных запись.
    public function GetText(string $name) : string
    {
        $text = '';
        foreach ($this->BASE_TEXT as $data_text)
        {
            if($data_text["name"] === $name)
            {
                $text = $data_text["text"];
                break;
            }
        }

        if($text === "")
        {
            $this->SetText($name, $name);
            $text = $name;
        }
        return $text;
    }
}
