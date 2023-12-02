<?php

$this->ParamPage(
    TITLE:              $this->LANG->GetText("home_title"),
    TITLE_FULL:         $this->LANG->GetText("home_title_full"),
    CONTENT_RENDER:     function()
    {
        return true;
    }
);
