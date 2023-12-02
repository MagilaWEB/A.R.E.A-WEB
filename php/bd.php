<?php
ini_set('display_errors',1);
error_reporting(E_ALL ^E_NOTICE);
// Блокировка открытие сайта если используется Internet Explorer
if (stripos($_SERVER['HTTP_USER_AGENT'], 'MSIE') != false || stripos($_SERVER['HTTP_USER_AGENT'], 'rv:10.0') != false || stripos($_SERVER['HTTP_USER_AGENT'], 'rv:11.0') != false) {
	header('Location: oldbrowser/index.php');  
	exit;
}

require 'rb.php';

R::ext('xDespTab', function ($tabel_name) { //создать таблицу в формате_имени 
    return R::getRedBean()->dispense($tabel_name);
});

R::setup('mysql:host=localhost;dbname=area_test', 'area', 'Ki1212ri3345');

if(!R::testConnection()) die('No DB connection!');

require "Engine/settings.php";
?>