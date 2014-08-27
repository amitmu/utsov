<?php

namespace UtsovAPI;

require(dirname(__FILE__).'/utils.php');

//// Main Section /////

    if (is_ajax()) {
        $post = json_decode(file.get_contents("php://input"));
        $action = $post->action;
        switch($action) { //Switch case for value of action
            case "test": test_function($post); break;
            case "list" :  getVolList($post); break;
            case "add" :  addVol($post); break;
            default:  getVolList($post);
        }

    }
    else{ //should not be used - for test only
        getVolList('');
    }

////// End Main Section //////


    //Function to check if the request is an AJAX request
    function is_ajax() {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
    }

    function test_function($post){
        $return["json"] = json_encode($post);
        echo json_encode($return);
    }

    //Function to return  list of volunteers
    function getVolList($post){
        $return = '';
        $arr = array();
        $db = new UtsovDB("contact");

        if(!$db)
        {
            $return["err"] = $db->lastErrorMsg();
        } else {
            $return["msg"] = "SUCCESS";
            $result = $db->query('SELECT * FROM tb_volunteers');
            $num = 0;

            //iterating through db output
            while ($row = $result->fetchArray(SQLITE3_ASSOC))
            {
                $arr[$num] = $row;
                $num++;
            }
            //closing db connection
            $db->close();
            $return ["msg"] = 'SUCCESS';
        }

        $return["data"] = json_encode($arr);
        echo json_encode($return);
    }


     function addVol($post){
        $return = '';
        $arr = array();
        $db = new UtsovDB("contact");

        if(!$db){

            $return["err"] = $db->lastErrorMsg();

        }
        else {
            //Initializing column values from POST data
            $name = sqlite_escape_string($post->volname);
            $address1 = sqlite_escape_string($post->voladd1);
            $address2 = sqlite_escape_string($post->voladd2);
            $city = sqlite_escape_string($post->volcity);
            $state = sqlite_escape_string($post->volstate);
            $zip = sqlite_escape_string($post->volzip);
            $phone = sqlite_escape_string($post->volphone);
            $email = sqlite_escape_string($post->volemail);
            $message = sqlite_escape_string($post->volmsg);
            $ipaddress = sqlite_escape_string($post->volip);


            $stmtIns = "INSERT INTO tb_volunteers(name, address1, address2, city, state, zip, phone, email, message, ipaddress)
                VALUES($name, $address1, $address2, $city, $state, $zip, $phone, $email, $message, $ipaddress)";

            $result = $db->exec($stmtIns);

            $db->close();

            if(!$result)
            {
                $return["err"] = $db->lastErrorMsg();
            }
            else
            {
                $return["msg"] = "SUCCESS";
            }

        }

        $return["dat"] = json_encode($arr);
        echo json_encode($return);


     }




?>
