<?php

namespace UtsovAPI;
use PDO;

require(dirname(__FILE__).'/utils.php');
date_default_timezone_set('America/New_York');

//// Main Section /////
    $_post = json_decode(file_get_contents("php://input"));
    //$request_type = $_SERVER['HTTP_X_REQUESTED_WITH'];

    //if (is_ajax()) {

    $action = $_post->action;
    switch($action) { //Switch case for value of action
        case "test": test_function($_post); break;
        case "list" :  getSubmissionList($_post); break;
        case "add" :  addSubmission($_post); break;
        default:  testFunction($_post);
    }

    //}
    //else{ //should not be used - for test only
    //    getVolList($_post);
    //}




////// End Main Section //////

    function testFunction($post){
        $return["err"] = '';
        $return["msg"] = "Test";
        $return["post"] = $post;
        echo json_encode($return);
    }

    function IsNullOrEmptyString($question){
        return (!isset($question) || trim($question)==='');
    }

    function getParamExpression($post){
        $param_arr = array();
        $num = 0;

        $year_requested = $post->formData->yearrequested;
        if(IsNullOrEmptyString($year_requested)){
            $year_requested = $year;
        }
        $next_year = (int)$year_requested + 1;
        $param_arr[$num++] = "date > '$year_requested' and date <'$next_year'";

        $contest = $post->formData->contest;
        if(!IsNullOrEmptyString($contest)){
            $param_arr[$num++] = "competition like '%$contest%'";
        }

        $contestant = $post->formData->contestant;
        if(!IsNullOrEmptyString($contestant)){
            $param_arr[$num++] = "name like '%$contestant%'";
        }

        $contact = $post->formData->contact;
        if(!IsNullOrEmptyString($contact)){
            $param_arr[$num++] = "contact like '%$contact%'";
        }

        $phone = $post->formData->phone;
        if(!IsNullOrEmptyString($phone)){
            $param_arr[$num++] = "phone like '%$phone%'";
        }

        $email = $post->formData->email;
        if(!IsNullOrEmptyString($email)){
            $param_arr[$num++] = "email like '%$email%'";
        }


        return join(' and ', $param_arr);
    }

    //Function to return  list of volunteers

    function getSubmissionList($post){
        $return["err"] = '';
        $return["msg"] = '';
        $arr = array();
        $year_arr = array();
        $year = strftime("%Y", time());
        try {
            $params = getParamExpression($post);

            /*** connect to SQLite database ***/
            $db = new PDO("sqlite:" . getDBPath("contest"));

            $result = $db->query("SELECT * FROM tb_competition where $params");
            $num = 0;
            foreach($result as $row)
            {
                $arr[$num] = $row;
                $num++;
            }

            $return["data"]["contests"] = $arr;
            $return ["msg"] = $num . " rows returned";

            $result = $db->query("SELECT distinct substr(date, 1, 4) as year FROM tb_competition");
            $num = 0;
            $current_year_found = false;
            foreach($result as $row)
            {
                $year_arr[$num] = $row;

                if($row["year"]  == $year){
                    $current_year_found = true;
                }

                $num++;
            }
            if($current_year_found == false){
                $year_arr[$num]["year"] = $year;
            }

            $return["data"]["yearsavailable"] = $year_arr;
            /*** $return["data"]["params"] = $params; **/

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


    //Function to add volunteers

    function addSubmission($post){
        $return["err"] = '';
        $return["msg"] = '';
        try {
            /*** connect to SQLite database ***/
            $db = new PDO("sqlite:" . getDBPath("contest"));

            $stmtIns = $db->prepare("INSERT INTO tb_competition(date, competition, name, age, contact, phone, email, file_type, url, file_path, message, ipaddress)
                VALUES(:date, :compt, :name, :age, :contact, :phone, :email, :ftype, :furl, :fpath, :msg, :ipadd)");

            $bindVar = $stmtIns->bindParam(':date', $date);
            $bindVar = $stmtIns->bindParam(':compt', $competition);
            $bindVar = $stmtIns->bindParam(':name', $name);
            $bindVar = $stmtIns->bindParam(':age', $age);
            $bindVar = $stmtIns->bindParam(':contact', $contact);
            $bindVar = $stmtIns->bindParam(':phone', $phone);
            $bindVar = $stmtIns->bindParam(':email', $email);
            $bindVar = $stmtIns->bindParam(':ftype', $ftype);
            $bindVar = $stmtIns->bindParam(':furl', $furl);
            $bindVar = $stmtIns->bindParam(':fpath', $fpath);
            $bindVar = $stmtIns->bindParam(':msg', $message);
            $bindVar = $stmtIns->bindParam(':ipadd', $ipaddress);

            // inserting row
            $date = date("Ymd:His");
            $competition = $post->concontest;
            $name = $post->conname;
            $age = $post->conage;
            $contact = $post->concontact;
            $phone = $post->conphone;
            $email = $post->conemail;
            $file = $post->confiletype;
            $furl = $post->confileurl;
            $fpath = '';
            $message = $post->conmsg;
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
