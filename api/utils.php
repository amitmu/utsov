<?php
      
namespace UtsovAPI;

class UtsovDB extends \SQLite3
{
    function __construct($dbname)
    {
        $dbpath = '';
        switch($dbname) { //Switch case for db name
            case "utsov": $dbpath = 'db/utsov.db'; break;
            case "contact":  $dbpath = 'db/capture.db'; break;
            case "contest":  $dbpath = 'db/capture.db'; break;
            case "sponsor":  $dbpath = 'db/capture.db'; break;
            case "patron":  $dbpath = 'db/registration.db'; break;
            case "register":  $dbpath = 'db/registration.db'; break;
            default:  $dbpath = 'db/utsov.db';
        }
        
        $this->open($dbpath);

    }


}

class UtsovException extends \Exception { }

/*
    $log_data = json_encode($_post);
    openlog("UtsovLog", LOG_PID, LOG_USER);
    syslog(LOG_INFO, "Volunteer - Post Data: $log_data");
    closelog();
*/

function getDBPath($dbname)
{
    $dbpath = '';
    switch($dbname) { //Switch case for db name
        case "utsov": $dbpath = realpath('.') . '/db/utsov.db'; break;
        case "volunteer":  $dbpath = realpath('.') . '/db/capture.db'; break;
        case "contest":  $dbpath = realpath('.') . '/db/capture.db'; break;
        case "sponsor":  $dbpath = realpath('.') . '/db/capture.db'; break;
        case "donation":  $dbpath = realpath('.') . '/db/capture.db'; break;
        case "patron":  $dbpath = realpath('.') . '/db/registration.db'; break;
        case "register":  $dbpath = realpath('.') . '/db/registration.db'; break;
        default:  $dbpath = realpath('.') . '/db/utsov.db';
    }
    return $dbpath;
}

//Function to check if the request is an AJAX request
function is_ajax() {
    return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

// Function to get the client IP address
function get_client_ip() {
    $ipaddress = 'UNDEFINED';
    if (getenv('HTTP_CLIENT_IP'))
        $ipaddress = getenv('HTTP_CLIENT_IP');
    else if(getenv('HTTP_X_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
    else if(getenv('HTTP_X_FORWARDED'))
        $ipaddress = getenv('HTTP_X_FORWARDED');
    else if(getenv('HTTP_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_FORWARDED_FOR');
    else if(getenv('HTTP_FORWARDED'))
       $ipaddress = getenv('HTTP_FORWARDED');
    else if(getenv('REMOTE_ADDR'))
        $ipaddress = getenv('REMOTE_ADDR');
    else
        $ipaddress = 'UNKNOWN';
    return $ipaddress;
}

//Function to log to file
function logMessage($message)
{
   // logging into custom file in /var/tmp folder
   error_log("[".date("H:i:s l jS F Y")."]: ".$message."\n", 3, "/var/tmp/utsovapi.log");
}

?>
