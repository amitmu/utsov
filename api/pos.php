<?php

namespace UtsovAPI;
use PDO;

require(dirname(__FILE__).'/utils.php'); //<- already reffered in patrons.php, not needed here
require(dirname(__FILE__).'/patrons.php');
require(dirname(__FILE__).'/registration.php');


//// Main Section /////
    $_post = json_decode(file_get_contents("php://input"));
    
    $action = $_post->action;
    
    logMessage("**Running registration:" . $action);

    switch($action) { //Switch case for value of action
        case "test": test_function($_post); break;
        case "register" :  register($_post); break;
        case "search" :  searchpatron($_post); break;
        case "details" :  findRegistrations($_post); break;
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
        logMessage("**Starting search patrons");
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
    
    
    function findRegistrations($post){
        $return["err"] = '';
        $return["msg"] = '';
        logMessage("**Starting search registrations");
        
        try
        {
            $patronid = $post->id;
            logMessage(">>Calling search on registrations for patron:".$patronid);
            $return = getPatronRegistrations($patronid);
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
            
            //Common Items
            $ipaddress = get_client_ip();
            $patronid = $post->id;
            $regid = $post -> regid;
            $updatePatron = $post->updatePatron;
            $updateReg = $post->updateRegistration;
            //Patron Items
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
            
            //Registration Items
            $year = $post->regyear;
            $donation = $post->donamount;
            $headcount = $post->regcount;
            $message = $post->regmsg;

            logMessage(">>Patron ID:" . $patronid);

            if(empty($patronid))
            {
                logMessage(">>Patron id is empty: Adding Patron");

                //calling insert on patron.php to add new record
                $return = addPatron($name1, $name2, $email1, $email2, $phone1, $phone2, $address1, $address2, $city, $state, $zip, $ipaddress);
                //storing the returned id for the new record 
                $patronid = $return["data"];
                logMessage(">>New Patron ID:" . $patronid);
            }
            elseif($updatePatron == 'Y'){
                
                logMessage(">>Update flag is true : Updating Patron");
                //updating patron
                //calling update on patron.php
                $return = updatePatron($patronid, $name1, $name2, $email1, $email2, $phone1, $phone2, $address1, $address2, $city, $state, $zip, $ipaddress);
                
            }
            else{
                logMessage(">>Update flag is false : skipping patron update");
            }
            
           
            if(empty($return["err"])){
                
                //adding registration record
                logMessage(">>Processing Registration for patron:" . $patronid);
                
                
                if($updateReg == 'Y'){
                
                    logMessage(">>Update flag is true : Updating Registration");
                    //updating patron
                    //calling update on registration.php
                    $return = updateRegistration($regid, $patronid, $year, $headcount, $donation, $message, $ipaddress);
                
                }
                else{
                    logMessage(">>Update flag is false : Adding Registration");
                    
                    //calling insert on registration.php
                    $return = addRegistration($patronid, $year, $headcount, $donation, $message, $ipaddress);
                }

                        
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
