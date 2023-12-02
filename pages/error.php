<?php
if(array_key_exists("type", $_GET))
{
    $type_error = $_GET["type"];

    $this->ParamPage(
        TITLE: 'TITLE_ERROR_'. $type_error,
        TITLE_FULL: 'TITLE_ERROR_FULL_'. $type_error,
        CONTENT_RENDER: function()
        {
            return true;
        }
    );
}
else
    $this->Redirect("home");