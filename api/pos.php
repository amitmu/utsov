<?php

namespace UtsovAPI;
use PDO;

//require(dirname(__FILE__).'/utils.php');
require(dirname(__FILE__).'/patrons.php');


//// Main Section /////
    $_post = json_decode(file_get_contents("php://input"));
    
    $action = $_post->action;
    
    logMessage("**Running registration:" . $action);

    switch($action) { //Switch case for value of action
        case "test": test_function($_post); break;
        case "register" :  register($_post); break;
        case "search" :  searchpatron($_post); break;
        default:  testFunction($_post);
    }



////// End Main Section //////

    function testFunction($post){
        $return["err"] = '';
        $return["msg"] = "Test";
        $return["post"] = $post;
        echo json_encode($return);
    }
    
    //Function to search patron
    function searchpatron($post){
        $return["err"] = '';
        $return["msg"] = '';
        $arr = array();
        try
        {
            $find = $post->find;
            $return = findPatron($find);
        }
        catch(Exception $e)
        {
            $return["err"] = "Unhandled Registration Exception";
            $return["msg"] = $e->getMessage();
        }
        
        echo json_encode($return);
    }
    
    
    //Function to add registration
    
    function register($post){
        $return["err"] = '';
        $return["msg"] = '';

        logMessage("**Starting registration");

        try {
            
            /*** connect to SQLite database ***/
            //$db = new PDO("sqlite:" . getDBPath("register"));
            
            $patronid = $post->id;
            $ipaddress = get_client_ip();

            logMessage(">>Patron ID:" . $patronid);

            if(empty($patronid))
            {
                logMessage(">>Patron is empty: Adding Patron");

                //adding new patron record
                $name1 = $post->name1;
                $name2 = $post->name2;
                $email1 = $post->email1;
                $email2 = $post->email2;
                $phone1 = $post->phone1;
                $phone2 = $post->phone2;
                $address1 = $post->address1;
                $address2 = $post->address2;
                $city = $post->city;
                $state = $post->state;
                $zip = $post->zip;
                //ipaddress filled above
                
                //calling insert on patron.php
                $return = addPatron($name1, $name2, $email1, $email2, $phone1, $phone2, $address1, $address2, $city, $state, $zip, $ipaddress);
                //storing the returned id for the new record 
                $patronid = $return["data"];
                logMessage(">>New Patron ID:" . $patronid);
            }
            
           
            if(empty($return["err"])){
                
                //adding registration record
                logMessage(">>Adding Registration record:" . $patronid);
                /*** connect to SQLite database ***/
                $db = new PDO("sqlite:" . getDBPath("register"));
    
                $stmtIns = $db->prepare("INSERT INTO tb_registration(patron_id, year, date, donation, headcount, message, ipaddress)
                    VALUES(:patron, :year, :date, :donation, :headcount, :msg, :ipadd)");
                
                $bindVar = $stmtIns->bindParam(':patron', $patron);
                $bindVar = $stmtIns->bindParam(':year', $year);
                $bindVar = $stmtIns->bindParam(':date', $date);
                $bindVar = $stmtIns->bindParam(':donation', $donation);
                $bindVar = $stmtIns->bindParam(':headcount', $headcount);
                $bindVar = $stmtIns->bindParam(':msg', $message);
                $bindVar = $stmtIns->bindParam(':ipadd', $ipaddress);
    
                // binding values
                
                $patron = $patronid;
                $year = $post->regyear;
                $date = date("Ymd:His");
                $donation = $post->donamount;
                $headcount = $post->regcount;
                $message = $post->regmsg;
                //ipaddress filled above
                    
                if($bindVar)
                {
                    //inserting new registration
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
                    $return["msg"] = $stmtIns->errorInfo();
                }
    
                //closing DB
                $db = NULL;
                        
            }
            
        }
        catch(PDOException $e)
        {
            logMessage("**DBError:" . $e->getMessage());
            $return["err"] = "DB: Unhandled PDO Exception";
            $return["msg"] = $e->getMessage();
        }
        catch(Exception $e){
            logMessage("**Error:" . $e->getMessage());
            $return["err"] = "Unhandled Registration Exception";
            $return["msg"] = $e->getMessage();
        }

        echo json_encode($return);
        
    }

  




?>