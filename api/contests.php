<?php

namespace UtsovAPI;

require(dirname(__FILE__).'/utils.php');

//// Main Section /////

    if (is_ajax()) {
        if (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
        $action = $_POST["action"];
            switch($action) { //Switch case for value of action
                case "test": test_function(); break;
                case "list" :  getSubmissionList(); break;
                case "add" :  addSubmission(); break;
                default: test_function();
            }
        }
    }
    else{ //should not be used - for test only
        test_function();
    }

////// End Main Section //////


    //Function to check if the request is an AJAX request
    function is_ajax() {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
    }

    function test_function(){
        $return = $_POST;
        //Do what you need to do with the info. The following are some examples.
        //if ($return["favorite_beverage"] == ""){
        // $return["favorite_beverage"] = "Coke";
        //}
        //$return["favorite_restaurant"] = "McDonald's";
        $return["json"] = json_encode($return);
        echo json_encode($return);
    }



    ////// Submissions /////////////
    function getSubmissionList(){
        $return = "";
        $arr = array();
        $db = new UtsovDB("submit");

        if(!$db)
        {
            $arr[0] = $db->lastErrorMsg();
        } else {
            $result = $db->query('SELECT * FROM tb_submission');
            $num = 0;

            //iterating through db output
            while ($row = $result->fetchArray(SQLITE3_ASSOC))
            {
                $arr[$num] = $row;
                $num++;
            }
            //closing db connection
            $db->close();
        }

        $return["json"] = json_encode($arr);
        echo json_encode($return);
    }

    function addSubmission(){
        $return = "";
        $arr = array();
        $db = new UtsovDB("submit");

        if(!$db)
        {
            $arr[0] = $db->lastErrorMsg();
        } else {
            //Initializing column values from POST data
            $competition = sqlite_escape_string($_POST['subcompetition']);
            $name = sqlite_escape_string($_POST['subcontact']);
            $phone = $_POST['subphone'];
            $email = sqlite_escape_string($_POST['subemail']);
            $filetype = $_POST['subfiletype'];
            $fileurl = sqlite_escape_string($_POST['subfileurl']);
            $filepath = sqlite_escape_string($_POST['subfilepath']);
            $message = sqlite_escape_string($_POST['submsg']);
            $ipaddress = $_POST['subip'];
            $date = date("Ymd:His");


            $stmtIns = "INSERT INTO tb_submission(date, competition, contact, phone, email, file_type, url, file_path, message, ipaddress)
                VALUES($date, $competition, $name, $phone, $email, $filetype, $fileurl, $filepath, $message, $ipaddress)";
            $result = $db->exec($stmtIns);
            $db->close();

            if(!$result)
            {
                $arr[0] = $db->lastErrorMsg();
            }
            else
            {
                $arr[0] = "SUCCESS"
            }

        }

        $return["json"] = json_encode($arr);
        echo json_encode($return);
    }
?>
