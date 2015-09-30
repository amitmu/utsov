<?php

namespace UtsovAPI;
use PDO;

require(dirname(__FILE__).'/utils.php');

//// Main Section /////
    $_post = json_decode(file_get_contents("php://input"));
    
    $action = $_post->action;
    switch($action) { //Switch case for value of action
        case "test": test_function($_post); break;
        case "list" :  getPatronList($_post); break;
        case "add" :  addPatron($_post); break;
        default:  testFunction($_post);
    }



////// End Main Section //////

    function testFunction($post){
        $return["err"] = '';
        $return["msg"] = "Test";
        $return["post"] = $post;
        echo json_encode($return);
    }

    //Function to return  list of patrons

    function getPatronList($post){
        $return["err"] = '';
        $return["msg"] = '';
        $arr = array();
        try {
            /*** connect to SQLite database ***/
            $db = new PDO("sqlite:" . getDBPath("patron"));

            $result = $db->query('SELECT * FROM tb_patrons');
            $num = 0;
            foreach($result as $row)
            {
                $arr[$num] = $row;
                $num++;
            }

            $return["data"] = $arr;
            $return ["msg"] = $num . " rows returned";
            //closing DB
            $db = NULL;
        }
        catch(PDOException $e)
        {
            $return["err"] = "DB: Unhandled PDO Exception";
            $return["msg"] = $e->getMessage();
        }

        echo json_encode($return);
    }


    //Function to add patrons

    function addPatron($post){
        $return["err"] = '';
        $return["msg"] = '';
        try {
            /*** connect to SQLite database ***/
            $db = new PDO("sqlite:" . getDBPath("patron"));
           
            $stmtIns = $db->prepare("INSERT INTO tb_patrons(date, name1, name2, email1, email2, phone1, phone2, address1, address2, city, state, zip, ipaddress)
                VALUES(:date, :name1, :name2, :email1, :email2, :phone1, :phone2, :add1, :add2, :city, :state, :zip, :ipadd)");

            $bindVar = $stmtIns->bindParam(':date', $date);
            $bindVar = $stmtIns->bindParam(':name1', $name1);
            $bindVar = $stmtIns->bindParam(':name2', $name1);
            $bindVar = $stmtIns->bindParam(':email1', $name1);
            $bindVar = $stmtIns->bindParam(':email2', $name1);
            $bindVar = $stmtIns->bindParam(':phone1', $name1);
            $bindVar = $stmtIns->bindParam(':phone2', $name1);
            $bindVar = $stmtIns->bindParam(':add1', $address1);
            $bindVar = $stmtIns->bindParam(':add2', $address2);
            $bindVar = $stmtIns->bindParam(':city', $city);
            $bindVar = $stmtIns->bindParam(':state', $state);
            $bindVar = $stmtIns->bindParam(':zip', $zip);
            $bindVar = $stmtIns->bindParam(':ipadd', $ipaddress);

            // inserting row
            $date = date("Ymd:His");
            $name1 = $post->patname1;
            $name2 = $post->patname2;
            $email1 = $post->patemail1;
            $email2 = $post->patemail2;
            $phone1 = $post->patphone1;
            $phone2 = $post->patphone2;
            $address1 = $post->patadd1;
            $address2 = $post->patadd2;
            $city = $post->patcity;
            $state = $post->patstate;
            $zip = $post->patzip;
            $ipaddress = get_client_ip();

            if($bindVar)
            {
                $exec = $stmtIns->execute();

                if($exec){
                    
                    $result = $db->query('SELECT last_insert_rowid() AS rowid FROM tb_patrons LIMIT 1');
                    
                    //$f = $q->fetch();
                    $lastrow = $result['rowid'];
                    
                    $return["msg"] = "NEW ROW ADDED";
                    $return["data"] = $lastrow;
                }
                else{
                    $return["err"] = "DB: Execute Failed";
                    $return["msg"] = $stmtIns->errorInfo();
                }
            }
            else{
                $return["err"] = "DB: Bind Failed";
                $return["msg"] = $stmtIns->errorInfo();
            }

            //closing DB
            $db = NULL;
        }
        catch(PDOException $e)
        {
            $return["err"] = "DB: Unhandled PDO Exception";
            $return["msg"] = $e->getMessage();
        }

        echo json_encode($return);

     }




?>
