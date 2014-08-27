<?php

namespace UtsovAPI;

require(dirname(__FILE__).'/utils.php');

//// Main Section /////

    if (is_ajax()) {
        if (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
        $action = $_POST["action"];
            switch($action) { //Switch case for value of action
                case "test": test_function(); break;
                case "list" :  getContactList(); break;
                case "add" :  addContact(); break;
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


    ////// Contacts /////////////
    function getContactList(){
        $return = "";
        $arr = array();
        $db = new UtsovDB("sponsor");

        if(!$db)
        {
            $arr[0] = $db->lastErrorMsg();
        } else {
            $result = $db->query('SELECT * FROM tb_contact');
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

    function addContact(){
        $return = "";
        $arr = array();
        $db = new UtsovDB("sponsor");

        if(!$db)
        {
            $arr[0] = $db->lastErrorMsg();
        } else {
            //Initializing column values from POST data
            $company = sqlite_escape_string($_POST['sponcompany']);
            $name = sqlite_escape_string($_POST['sponcontact']);
            $address1 = sqlite_escape_string($_POST['sponaddr1']);
            $address2 = sqlite_escape_string($_POST['sponaddr2']);
            $city = sqlite_escape_string($_POST['sponcity']);
            $state = $_POST['sponstate'];
            $zip = $_POST['sponzip'];
            $phone = $_POST['sponphone'];
            $email = sqlite_escape_string($_POST['sponemail']);
            $message = sqlite_escape_string($_POST['sponmsg']);
            $date = date("Ymd:His");


            $stmtIns = "INSERT INTO tb_contact(date, company, contact, address1, address2, city, state, zip, phone, email, message)
                VALUES($date, $company, $name, $address1, $address2, $city, $state, $zip, $phone, $email, $message, $ipaddress)";
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
