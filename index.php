<?php
#stalker-area.ru Engine alpha
#author by MAGILA

session_start();

require 'php/bd.php'; 						#orm and database

#
foreach (glob("php/Engine/*.php") as $filename)
{
    include $filename;
}

class Engine extends NEW_METHODS
{
	
	private $META_TEG;					# Функция для создания дополнительных meta тегов страницы.
	private $CONTENT_RENDER;			# Запуск функции рендеринга подключаемой страницы.
	private $INTERFACE_USER;			# Методы создания интерфейса пользователя.

	public $DOM;						# Экземпляр клаасса DOM HTML документа.
	public $setting;					# Настройки для движка сайта.
	public string $DOCUMENT_ROOT;		# Радительский путь к файлам сайта.
	public string $URL_PAGE;			# Заголовок пути к странице.
	public string $TITLE;				# Краткий заголовок страницы.
	public string $TITLE_FULL;			# Полный заголовок страницы.
	public string $DESCRIPTION;			# Описание страницы
	public string $KEYWORDS;
	public string $REQUEST_METHOD ;
	/*
		Прямой доступ к созданным DOM элементам
	*/
	public $HTML;						# HTML Документ
	public $HEAD;
	public $BODY;
	public $MAIN;
	public $FOOTER;
	public $NAV; 						# Блок меню
	public $CONTENT_PAGE;				# Главный контент блок страницы
	public $DinamicBlock; 				# Обновляемый блок без перезагрузки через pjax (основной контент страницы рендерим там)
	public $DinamicBlockHeader;			# Заголовок страницы
	public $DinamicBlockFooting;		# Основной блок для рендеринга информации страницы
	public $RightColumn; 				# Правая калонка для контента (обновляемый).
	public $LANG;						# Экземпляр класса менеджера локолизации сайта.

	/*
		Методы главного класса движка.
	*/
	public function __construct()
	{
		// Хранить путь к ROOT
		$this->DOCUMENT_ROOT = $_SERVER['DOCUMENT_ROOT'];
		$this->REQUEST_METHOD = $_SERVER['REQUEST_METHOD'];

		// Эмулировать навигацию по страницам без префикса .php
		$this->PAGE = strtok($_SERVER['REQUEST_URI'], '?[A-z]') == '/' ? 'home'//Редирект на главную страницу
		:strtok(substr($_SERVER['REQUEST_URI'], 1), '?[A-z]');
		$this->setting = new EngSetting($this);

		if ($this::StartPage())
		{
			$this->DOM = new DOM_Document_methods("5.0");
			$this->DOM->EngineApi($this);

			$this->HTML = $this->DOM->createElement('html');
			$this->DOM->appendChild($this->HTML);
			

			$this->HEAD = $this->DOM->createElement('head');
			$this->HTML->appendChild($this->HEAD);

			$this->BODY = $this->DOM->createElement('body');
			$this->HTML->appendChild($this->BODY);

			$this->MAIN = $this->DOM->createElement('main');
			$this->BODY->appendChild($this->MAIN);

			$this->INTERFACE_USER = new INTERFACE_USER($this);
			$this->LANG = new Localization($this);
			$this->LANG->ChecComendLang();
			$this->DOM->createHTML_attribute($this->HTML, "lang", $this->LANG->type);

			if(!$this::UpperPart())
				$this->Error("noUpperPart");
		
			if(!$this::PlugPage())
				$this->Error("noPlugPage");
		
			if(!$this::LowerPart())
				$this->Error("noLowerPart");
		}
		else
			Error("404");
	}

	private function ParamPage(
		string $TITLE='No TITLE',
		string $TITLE_FULL='No TITLE_FULL',
		string $DESCRIPTION = 'No DESCRIPTION',
		string $KEYWORDS = '',
		$META_TEG = false,
		callable $CONTENT_RENDER
		) : void
	{
		$this->TITLE = $this->LANG->GetText($TITLE);
		$this->TITLE_FULL = $this->LANG->GetText($TITLE_FULL);
		$this->DESCRIPTION = $this->LANG->GetText($DESCRIPTION);

		if(strlen($this->TITLE) > $this->setting->TITLE_LENGTH)
			$this->TITLE = substr($this->TITLE, 0, $this->setting->TITLE_LENGTH). "...";

		if(strlen($this->TITLE_FULL) > $this->setting->TITLE_FULL_LENGTH)
			$this->TITLE_FULL = substr($this->TITLE_FULL, 0, $this->setting->TITLE_FULL_LENGTH). "...";

		if(strlen($DESCRIPTION) > $this->setting->DESCRIPTION_LENGTH)
			$this->DESCRIPTION = substr($this->DESCRIPTION, 0, $this->setting->DESCRIPTION_LENGTH). "...";

		$this->KEYWORDS = $this->LANG->GetText($KEYWORDS);
		$this->META_TEG = $META_TEG;
		$this->CONTENT_RENDER = $CONTENT_RENDER;
	}

	private function TopContent() : void
	{
		//фуллскрин
		$div_fullscreen = $this->DOM->createElementAttributes($this->MAIN, "div", attributes: [
			'id' => 'show',
			'class' => 'fullscreen-bg'
		]);

		//Текстура шапки
		$this->DOM->createElementAttributes($div_fullscreen, "aside", attributes: [
			'class' => 'overlay'
		]);

		//Заголовок
		$this->DOM->createElementAttributes($div_fullscreen, "h1", $this->TITLE, [
			'class' => 'main_title',
			'title' => $this->TITLE
		], true);

		$this->DOM->createElementAttributes($div_fullscreen, "p", $this->setting->EngineVersion, [
			'class' => 'EngineVersion',
			'title' => $this->setting->EngineVersion
		]);

		//видео шапка сайта
		$video = $this->DOM->createElementAttributes($div_fullscreen, "video",  attributes: [
			'loop' => '',
			'muted' => '',
			'autoplay' => '',
			'preload' => 'metadata',
			'poster' => 'image/plane.png',
			'class' => 'fullscreen-bg__video',
		]);

		$this->DOM->createElementAttributes($video, "source",  attributes: [
			'src' => 'failes/video/area_boloto.webm',
			'type' => 'video/webm'
		]);

		$this->DOM->createElementAttributes($video, "source",  attributes: [
			'src' => 'failes/video/area_boloto.mp4',
			'type' => 'video/mp4'
		]);
		
		// //Точка отчёта для JS динамического меню
		$this->DOM->createHTML_attribute($this->DOM->createHTML($div_fullscreen, "input"), "class", "nav-fixed");

		//Блок меню
		$this->NAV = $this->DOM->createHTML($div_fullscreen, "nav");

		//pjaxRestart
		// $this->DOM->createHTML_attribute($this->DOM->createHTML($this->NAV, "div"), "class", "pjaxRestart_nav");

		$this->INTERFACE_USER->MainLink($this->NAV, "HOME", "home");

		require "php/Templates/main_link.php";
	}

	private function UpperPart() : bool
	{
		require $this->URL_PAGE;

		$this->DOM->createHTML($this->HEAD, "title", $this->TITLE);


		$this->DOM->createElementAttributes($this->HEAD, "meta", attributes: [
			'http-equiv' => 'X-UA-Compatible',
			'content' => 'IE=edge,chrome=1',
			'charset' => 'utf-8'
		]);

		$this->DOM->createElementAttributes($this->HEAD, "meta", attributes: [
			'name' => 'description',
			'content' => $this->TITLE
		]);

		$this->DOM->createElementAttributes($this->HEAD, "meta", attributes: [
			'name' => 'keywords',
			'content' => $this->KEYWORDS
		]);

		$this->DOM->createElementAttributes($this->HEAD, "link", attributes: [
			'rel' => 'alternate',
			'hreflang' => $this->LANG->type	//LINK ЛОКОЛИЗАЦИИ САЙТА
		]);

		$this->DOM->createElementAttributes($this->HEAD, "link", attributes: [
			'rel' => 'canonical',
			'href' => "https://". $_SERVER['SERVER_NAME']. $_SERVER['REQUEST_URI']
		]);

		$this->EnableCss([
			'fonts/stylesheet.css',
			'css/ps-content.css'
		]);

		$this->EnableJs([
			'js/plaginsAll.js',
			'js/jquery.pjax.js',
			'js/pace.min.js',
			'js/index.js'
			// "js/eventScript.js"
		]);

		if($this->META_TEG && is_callable($this->META_TEG))
			call_user_func($this->META_TEG);

		$this::TopContent();

		
		return true;
	}
	
	private function LowerPart() : bool
	{
		$this->FOOTER = $this->DOM->createHTML($this->BODY, "footer");
		$this->DOM->createHTML_attribute($this->FOOTER, "class", "site-footer");
		$this->DOM->createHTML_attribute($this->DOM->createHTML($this->FOOTER, "span"), "class", "js-up");

		$header = $this->DOM->createHTML($this->FOOTER, "div");
		$this->DOM->createHTML_attribute($header, "class", "site-footer__sticky");

		$headerCol = $this->DOM->createHTML($header, "div");
		$this->DOM->createHTML_attribute($headerCol, "class", "col-2");

		$headerUL = $this->DOM->createHTML($headerCol, "ul");

		$my_public = $this->INTERFACE_USER->MainLink($headerUL, $this->LANG->GetText("url_my_public"), "https://vk.com/surs_area", pjax:false);
		$this->DOM->createHTML_attribute($my_public, "target", "_blank");

		$my_public = $this->INTERFACE_USER->MainLink($headerUL, $this->LANG->GetText("url_my_moddb"), "https://www.moddb.com/mods/area", pjax:false);
		$this->DOM->createHTML_attribute($my_public, "target", "_blank");

		$my_public = $this->INTERFACE_USER->MainLink($headerUL, $this->LANG->GetText("url_website_developer"), "https://vk.com/youtube_magila", pjax:false);
		$this->DOM->createHTML_attribute($my_public, "target", "_blank");

		$headerCol_2 = $this->DOM->createHTML($header, "div");
		$this->DOM->createHTML_attribute($headerCol_2, "class", "col-2");

		$headerCol_2_p = $this->DOM->createHTML($headerCol_2, "p", str_replace("%s", date('Y'), $this->LANG->GetText("footer_license")));
		$this->DOM->createHTML_attribute($headerCol_2_p, "class", "search-bar");
		
		//render the html page content
		$this->DOM->normalizeDocument();//нормолизовать вид документа.
		echo "<!DOCTYPE html>". $this->DOM->saveHTML();
		R::close();
		return true;
	}
	
	private function StartPage() : bool
	{
		if(!$this->PAGE)
			$this->Error("404");

		$this->URL_PAGE = $this->DOCUMENT_ROOT. "/pages/". $this->PAGE. ".php";

		return file_exists($this->URL_PAGE);
	}

	private function PlugPage() : bool
	{
		$this->CONTENT_PAGE = $this->DOM->createHTML($this->MAIN, "div");
		$this->DOM->createHTML_attribute($this->CONTENT_PAGE, "class", "content");

		$this->DinamicBlock = $this->DOM->createHTML($this->CONTENT_PAGE, "div", pjaxUpdate:true);
		$this->DOM->createHTML_attribute($this->DinamicBlock, "class", "DinamicBlock");

		$this->DinamicBlockHeader = $this->DOM->createHTML($this->DinamicBlock, "h2", $this->TITLE_FULL);
		$this->DOM->createHTML_attribute($this->DinamicBlockHeader, "class", "header");

		$this->DinamicBlockFooting = $this->DOM->createHTML($this->DinamicBlock, "div");
		$this->DOM->createHTML_attribute($this->DinamicBlockFooting, "class", "footing");

		$this->RightColumn = $this->DOM->createHTML($this->CONTENT_PAGE, "div", pjaxUpdate: true);
		$this->DOM->createHTML_attribute($this->RightColumn, "class", "right_column");
		return call_user_func($this->CONTENT_RENDER);
	}
}

//Иницыализация и запуск
new Engine;