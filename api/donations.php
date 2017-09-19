<?php

namespace UtsovAPI;
use PDO;

require(dirname(__FILE__).'/utils.php');
date_default_timezone_set('America/New_York');

//// Main Section /////
    $_post = json_decode(file_get_contents("php://input"));
    //$request_type = $_SERVER['HTTP_X_REQUESTED_WITH'];

    //$_post = file_get_contents("php://input");

    //if (is_ajax()) {
    $action = $_post->action;
    switch($action) { //Switch case for value of action
        case "test": test_function($_post); break;
        case "list" :  getDonationList($_post); break;
        case "add" :  addDonation($_post); break;
        case "getapikey" :  getApiKey($_post); break;
        case "savedonation" :  saveDonation($_post); break;
        default:  testFunction($_post);
    }

    //}
    //else{ //should not be used - for test only
    //    getVolList($_post);
    //}




////// End Main Section //////

    function testFunction($post){
        $return["test"] = json_encode($post);
        echo json_encode($return);
    }

    function saveDonation($post) {
    $return["err"] = '';
    $return["msg"] = "";

    try {
        $db = new PDO("sqlite:" . getDBPath("register"));

        $client_ip = get_client_ip();
        $donation_year = $post->donation_year;
        $txDateTime = $post->txDateTime;
        $email = $post->email;
        $first_name = $post->first_name;
        $middle_name = $post->middle_name;
        $last_name = $post->last_name;
        $payer_id = $post->payer_id;
        $line1 = $post->line1;
        $line2 = $post->line2;
        $city = $post->city;
        $state = $post->state;
        $postal_code = $post->postal_code;
        $payment_method = $post->payment_method;
        $payment_status = $post->payment_status;
        $payment_amount = $post->payment_amount;
        $payment_id = $post->payment_id;
        $paypal_resp = $post->paypal_resp;

        $stmtIns = $db->prepare("INSERT INTO tb_donations(donation_year, client_ip, txDateTime, email, first_name, middle_name, last_name, payer_id, line1, line2, city, state, postal_code, payment_method, payment_status, payment_amount, payment_id, paypal_resp)
            VALUES(:donation_year, :client_ip, :txDateTime, :email, :first_name, :middle_name, :last_name, :payer_id, :line1, :line2, :city, :state, :postal_code, :payment_method, :payment_status, :payment_amount, :payment_id, :paypal_resp)");

        $bindVar = $stmtIns->bindParam(':client_ip', $client_ip);
        $bindVar = $stmtIns->bindParam(':donation_year', $donation_year);
        $bindVar = $stmtIns->bindParam(':txDateTime', $txDateTime);
        $bindVar = $stmtIns->bindParam(':email', $email);
        $bindVar = $stmtIns->bindParam(':first_name', $first_name);
        $bindVar = $stmtIns->bindParam(':middle_name', $middle_name);
        $bindVar = $stmtIns->bindParam(':last_name', $last_name);
        $bindVar = $stmtIns->bindParam(':payer_id', $payer_id);
        $bindVar = $stmtIns->bindParam(':line1', $line1);
        $bindVar = $stmtIns->bindParam(':line2', $line2);
        $bindVar = $stmtIns->bindParam(':city', $city);
        $bindVar = $stmtIns->bindParam(':state', $state);
        $bindVar = $stmtIns->bindParam(':postal_code', $postal_code);
        $bindVar = $stmtIns->bindParam(':payment_method', $payment_method);
        $bindVar = $stmtIns->bindParam(':payment_status', $payment_status);
        $bindVar = $stmtIns->bindParam(':payment_amount', $payment_amount);
        $bindVar = $stmtIns->bindParam(':payment_id', $payment_id);
        $bindVar = $stmtIns->bindParam(':paypal_resp', $paypal_resp);

        $exec = $stmtIns->execute();

        if($exec){
            //retrieving last inserted row for ID.
            $result = $db->query('SELECT last_insert_rowid() AS rowid FROM tb_patrons LIMIT 1');

            $r = $result->fetch();

            $lastrow = $r['rowid'];

            logMessage(">>>>New Patron record:" . $lastrow);
            $return["msg"] = "PATRON ROW INSERT SUCCESS";
            $return["data"] = $lastrow;
        }
        else{
            $return["err"] = "DB:Patrons Insert Failed";
            $return["msg"] = $stmtIns->errorInfo();
        }
        echo json_encode($return);
    }
    catch(PDOException $e)
    {
        $return["err"] = "DB:Patrons Unhandled PDO Exception";
        $return["msg"] = $e->getMessage();
    }

    return $return;
    }

    function getApiKey($post){
        $return["err"] = '';
        $return["msg"] = "";

        try {
            $db = new PDO("sqlite:" . getDBPath("register"));

            $stmt = $db->prepare('select value from tb_config where key = "paypalEnv"');


            $stmt->execute();
            $result = $stmt->fetchAll();
            foreach($result as $row)
            {
                $return["paypalEnv"] = $row['value'];
                $key = "{$row['value']}Key";
            }

            $stmt = $db->prepare('select value from tb_config where key = :key');
            $bindVar = $stmt->bindParam(':key', $key);

            $stmt->execute();
            $result = $stmt->fetchAll();
            foreach($result as $row)
            {
                $return["apiKey"] = $row['value'];
            }

            echo json_encode($return);
        }
        catch(PDOException $e)
        {
            $return["err"] = "DB:Patrons Unhandled PDO Exception";
            $return["msg"] = $e->getMessage();
        }

        return $return;
    }

    function IsNullOrEmptyString($question){
        return (!isset($question) || trim($question)==='');
    }

    function getParamExpression($post){
        $param_arr = array();
        $num = 0;
        $year = strftime("%Y", time());

        $year_requested = $post->formData->yearrequested;
        if(IsNullOrEmptyString($year_requested)){
            $year_requested = $year;

        }

        $param_arr[$num++] = "donation_year = '$year_requested'";


        $name = $post->formData->name;
        if(!IsNullOrEmptyString($name)){
            $param_arr[$num++] = "(first_name like '%$name%' OR middle_name like '%$name%' OR last_name like '%$name%')";
        }

        $payer_id = $post->formData->payer_id;
        if(!IsNullOrEmptyString($payer_id)){
            $param_arr[$num++] = "payer_id like '%$payer_id%'";
        }

        $email = $post->formData->email;
        if(!IsNullOrEmptyString($email)){
            $param_arr[$num++] = "email like '%$email%'";
        }


        return join(' and ', $param_arr);
    }
    function getDonationList($post){
        $return["err"] = '';
        $return["msg"] = '';
        $arr = array();
        $year_arr = array();
        $year = strftime("%Y", time());
        try {
            $params = getParamExpression($post);

            /*** connect to SQLite database ***/
            $db = new PDO("sqlite:" . getDBPath("register"));

            $result = $db->query('SELECT * FROM tb_donations where '.$params);
            $num = 0;
            foreach($result as $row)
            {
                $arr[$num] = $row;
                $num++;
            }

            $return["data"]["donors"] = $arr;
            $return ["msg"] = $num . " rows returned";

            $result = $db->query("SELECT distinct donation_year as year FROM tb_donations where donation_year IS NOT NULL");

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

    function addDonation($post){
        $return = '';
        $arr = array();
        try {
            /*** connect to SQLite database ***/
            $db = new PDO("sqlite:" . getDBPath("donation"));

            $stmtIns = $db->prepare("INSERT INTO tb_competition(date, competition, name, age, contact, phone, email, file_type, url, file_path, message, ipaddress)
                VALUES(:date, :compt, :name, :age, :contact, :phone, :email, :f_type, :f_url, :f_path, :msg, :ipadd)");

            $bindVar = $stmtIns->bindParam(':date', $date);
            $bindVar = $stmtIns->bindParam(':compt', $competition);
            $bindVar = $stmtIns->bindParam(':name', $name);
            $bindVar = $stmtIns->bindParam(':age', $age);
            $bindVar = $stmtIns->bindParam(':contact', $contact);
            $bindVar = $stmtIns->bindParam(':phone', $phone);
            $bindVar = $stmtIns->bindParam(':email', $email);
            $bindVar = $stmtIns->bindParam(':f_type', $file);
            $bindVar = $stmtIns->bindParam(':f_url', $url);
            $bindVar = $stmtIns->bindParam(':f_path', $path);
            $bindVar = $stmtIns->bindParam(':msg', $message);
            $bindVar = $stmtIns->bindParam(':ipadd', $ipaddress);

            // inserting row
            $date = date("Ymd:His");
            $competition = $post->competition;
            $name = $post->compname;
            $age = $post->compage;
            $contact = $post->compcontact;
            $phone = $post->compphone;
            $email = $post->compemail;
            $file = $post->compfiletype;
            $url = $post->compfileurl;
            $path = $post->compfilepath;
            $message = $post->compmsg;
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
