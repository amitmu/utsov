<?php
      
namespace UtsovAPI;

class UtsovDB extends \SQLite3
{
    function __construct($dbname)
    {
        $dbPath = '';
        switch($dbname) { //Switch case for db name
            case "utsov": $dbpath = 'db/utsov.db'; break;
            case "contacts":  $dbpath = 'db/capture.db'; break;
            case "sponsor":  $dbpath = 'db/sponsor.db'; break;
            default:  $dbpath = 'db/utsov.db';
        }
        
        $this->open($dbpath);

    }
}


?>