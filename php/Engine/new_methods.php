<?php
class NEW_METHODS
{
	#Редирект на страницу ошибки
	public function Error(string $DESCRIPTION = "")
	{
		if($DESCRIPTION !== "")
		{
			header('Location: error?type='. $DESCRIPTION);
			exit;
		}
		else
		{
			header('Location: error?type=404');
			exit;
		}
	}

	public function Redirect(string $DESCRIPTION = "")
	{
		if($DESCRIPTION !== "")
		{
			header('Location: '. $DESCRIPTION);
			exit;
		}
		else
		{
			header('Location: home');
			exit;
		}
	}

 	/*** Новые методы для работы с строками ***/
	#Является ли строка ссылкой
	public function IsUrl(string $url) : bool
	{
		return (bool) preg_match('/^(http|https|ftp)/', $url);
	}
 
	#Считывает файлы, возращает содержимое всех файлов в виде строки
	public function FilesContentsToString(array $array) : string
	{
		$string = "";
		foreach ($array as $key => $value)
			$string = $string.' '.file_get_contents($value);

		return $string;
	}

	#Генерация рандомной строки.
	public function generateRandomString(int $length) : string
	{
		$x = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$repeat = str_repeat($x, ceil($length/strlen($x)));
		return substr(str_shuffle($repeat), 1, $length);
	}

	#Подключить каскадные таблицы стилей к странице
	public function EnableCss(array $array) : void
	{
		foreach ($array as $value)
		{
			if(is_string($value))
			{
				$this->DOM->createElementAttributes($this->HEAD, "link", attributes: [
					'rel' => 'stylesheet',
					'href' => $this->IsUrl($value)? $value : $value."?".filectime($value)
				]);
			}	
		}
	}

	#Подключить JavaScript к странице
	public function EnableJs(array $array) : void
	{
		foreach ($array as $value)
		{
			if(is_string($value))
			{
				$this->DOM->createElementAttributes($this->HEAD, "script", attributes: [
					'type' => 'text/javascript',
					'src' => $this->IsUrl($value)? $value : $value."?".filectime($value)
				]);
			}
		}
	}
}
