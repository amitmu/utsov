<?php

namespace UtsovAPI;
use PDO;

require(dirname(__FILE__).'/utils.php');

//// Main Section /////
    $_post = json_decode(file_get_contents("php://input"));
    //$request_type = $_SERVER['HTTP_X_REQUESTED_WITH'];

    //if (is_ajax()) {

    $action = $_post->action;
    switch($action) { //Switch case for value of action
        case "test": test_function($_post); break;
        case "list" :  getVolList($_post); break;
        case "add" :  addVol($_post); break;
        default:  getVolList($_post);
    }

    //}
    //else{ //should not be used - for test only
    //    getVolList($_post);
    //}




////// End Main Section //////

    function test_function($post){
        $return["post"] = json_encode($post);
        echo json_encode($return);
    }


    //Function to return  list of volunteers

    function getVolList($post){
        $return = '';
        $arr = array();
        try {
            /*** connect to SQLite database ***/
            $db = new PDO("sqlite:" . getDBPath("volunteer"));

            $result = $db->query('SELECT * FROM tb_volunteers');
            $num = 0;
            foreach($result as $row)
            {
                $arr[$num] = $row;
                $num++;
            }
            //closing DB
            $db = NULL;
        }
        catch(PDOException $e)
        {
            $return["err"] = "DB:" . $e->getMessage();
        }

        $return["data"] = $arr;
        $return ["msg"] = $num . " rows returned";
        $return["post"] = $post;
        echo json_encode($return);
    }


    //Function to add volunteers

    function addVol($post){
        $return = '';
        $arr = array();
        try {
            /*** connect to SQLite database ***/
            $db = new PDO("sqlite:" . getDBPath("volunteer"));

            $stmtIns = $db->prepare("INSERT INTO tb_volunteers(date, name, address1, address2, city, state, zip, phone, email, message, ipaddress)
                VALUES(:date, :name, :add1, :add2, :city, :state, :zip, :phone, :email, :msg, :ipadd)");

            $bindVar = $stmtIns->bindParam(':date', $date);
            $bindVar = $stmtIns->bindParam(':name', $name);
            $bindVar = $stmtIns->bindParam(':add1', $address1);
            $bindVar = $stmtIns->bindParam(':add2', $address2);
            $bindVar = $stmtIns->bindParam(':city', $city);
            $bindVar = $stmtIns->bindParam(':state', $state);
            $bindVar = $stmtIns->bindParam(':zip', $zip);
            $bindVar = $stmtIns->bindParam(':phone', $phone);
            $bindVar = $stmtIns->bindParam(':email', $email);
            $bindVar = $stmtIns->bindParam(':msg', $message);
            $bindVar = $stmtIns->bindParam(':ipadd', $ipaddress);

            // inserting row
            $date = date("Ymd:His");
            $name = $post->volname;
            $address1 = $post->voladd1;
            $address2 = $post->voladd2;
            $city = $post->volcity;
            $state = $post->volstate;
            $zip = $post->volzip;
            $phone = $post->volphone;
            $email = $post->volemail;
            $message = $post->volmsg;
            $ipaddress = get_client_ip();

            if($bindVar)
            {
                $exec = $stmtIns->execute();

                if($exec){
                    $return["msg"] = "NEW ROW ADDED";
                }
                else{
                    $return["err"] = "DB: Execute Failed";
                    $return["msg"] = $stmtIns->errorInfo();
                }
            }
            else{
                $return["err"] = "DB: Bind Failed";
            }

            //closing DB
            $db = NULL;
        }
        catch(PDOException $e)
        {
            $return["err"] = "DB:" . $e->getMessage();
        }

        $return["data"] = $arr;
        $return["post"] = $post;
        echo json_encode($return);


     }




?>
