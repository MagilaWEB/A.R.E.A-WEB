<?php
Class EngSetting
{
    private $Engine;

    public string $EngineVersion = "Engine alpha 0.0.1";
    public int $TITLE_LENGTH = 40;
    public int $TITLE_FULL_LENGTH = 90;
    public int $DESCRIPTION_LENGTH = 240;
    

    public function __construct($Engine)
    {
        $this->Engine = $Engine;
    } 
}
?>