<?php
      
namespace UtsovAPI;

class UtsovDB extends \SQLite3
{
    function __construct($dbname)
    {
        $dbPath = '';
        switch($dbname) { //Switch case for db name
            case "utsov": $dbpath = 'db/utsov.db'; break;
            case "contact":  $dbpath = 'db/capture.db'; break;
            case "contest":  $dbpath = 'db/capture.db'; break;
            case "sponsor":  $dbpath = 'db/capture.db'; break;
            default:  $dbpath = 'db/utsov.db';
        }
        
        $this->open($dbpath);

    }
}


?>
