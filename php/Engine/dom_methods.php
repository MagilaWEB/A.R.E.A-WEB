<?php
/*** Новые методы для работы с DOM деревом ***/
class DOM_Document_methods extends DOMDocument
{
	private $Engine;
	
	public function EngineApi($obj): void
	{
		if($obj)
			$this->Engine = $obj;
	}

	#Создаёт новый элемент в DOM дереве сайта и помещает в нутрь element переданный 1 аргументом.
	public function createHTML($element, string $name, string $text = '', bool $pjaxUpdate = false)
	{
		$new_element = $this->createElement($name);
		$new_element = $element->appendChild($new_element);

		if($text !== '')
		{
			$text = $this->createTextNode($text);
			$new_element->appendChild($text);
		}

		if($pjaxUpdate === true)
			$this->createHTML_attribute($new_element, "pjaxupdate");

		return $new_element;
	}

	#Создаёт новый атрибут у element из 1 аргумента.
	public function createHTML_attribute($element, string $name, string $text = '') : void
	{
		$new_attribute = $this->createAttribute($name);
		$new_attribute->value = $text;
		$element->appendChild($new_attribute);
	}

	#Создаёт элемент и добавляет к нему список атрибутов с их значениями.
    public function createElementAttributes($element, string $name, string $text = '', array $attributes = array(), bool $pjaxUpdate = false)
    {
		$new_element = $this->createHTML($element, $name, $text, $pjaxUpdate);
		foreach ($attributes as $attribut_name => $attribut_value)
		{
			$this->createHTML_attribute($new_element, $attribut_name, $attribut_value);
		}
		return $new_element;
    }

	#Создаёт форму.
    public function createElementForm($element, array $array_data = array(), array $attributes = array(), bool $pjaxUpdate = true)
    {

		$METHOD = [];
		if($this->Engine->REQUEST_METHOD === "POST")
			$METHOD = $_POST;
		else
			$METHOD = $_GET;

		$id = array_key_exists("id_pjax", $METHOD)? $METHOD["id_pjax"] : $this->Engine->generateRandomString(5);
		$div_form = $this->createHTML($element, "div");
		$this->createHTML_attribute($div_form, "id", $id);

		$attributes["id"] = "form_".$id;
		
    	$new_form = $this->createElementAttributes($div_form, "form", attributes: $attributes);

    	foreach ($array_data as $ar_data)
		{
			if(array_key_exists("name", $ar_data))
			{
			   $this->createElementAttributes(
					$new_form,
					$ar_data["name"],
					array_key_exists("text",$ar_data)? $ar_data["text"] : "",
					array_key_exists("attributes",$ar_data) && is_array($ar_data["attributes"])? $ar_data["attributes"] : []
				);
			}
    	}
 
		if($pjaxUpdate)
		{
			$script_id = $attributes["id"];

			$script = $this->createHTML($div_form, "script", <<<SCRIPT
				$(document).on('submit', '#$script_id', function(event) {
					$.pjax.submit(event, {
						fragments: ['#$id'],
						timeout: 4000,
						scrollTo: false
					})
				});
			SCRIPT);

			$this->createElementAttributes($new_form, "input", attributes:[
				"type" 		=> "hidden",
				"name" 		=> "id_pjax",
				"value"		=> $id
			]);

			$this->createHTML_attribute($script, "type", 'text/javascript');
		}

		return $new_form;
    }
}
