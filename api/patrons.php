<?php

namespace UtsovAPI;
use PDO;

require(dirname(__FILE__).'/utils.php');

//// Main Section /////
    //$_post = json_decode(file_get_contents("php://input"));


    //Function to return  list of patrons

    function getPatronList(){
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

        return $return;
        //echo json_encode($return);
    }

    //Function to find Patron by id
    function getPatron($patronid){
        $return["err"] = '';
        $return["msg"] = '';
        $arr = array();
        
        try {
            /*** connect to SQLite database ***/
            $db = new PDO("sqlite:" . getDBPath("patron"));
            
            $stmt = $db->prepare('SELECT * FROM tb_patrons WHERE id = :patronid');
            
            $bindVar = $stmt->bindParam(':patronid', $patronid);
            
            if($bindVar)
            {
                $num = 0;
                $stmt->execute();
                $result = $stmt->fetchAll();
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
            else{
                $return["err"] = "DB:Patrons Bind Failed";
                $return["msg"] = $stmt->errorInfo();
            }
        }
        catch(PDOException $e)
        {
            $return["err"] = "DB:Patrons Unhandled PDO Exception";
            $return["msg"] = $e->getMessage();
        }
        
        return $return;
    }

    //Function to search Patron by name, email or phone number
    
    function findPatron($search){
        $return["err"] = '';
        $return["msg"] = '';
        $arr = array();
        
        try {
            /*** connect to SQLite database ***/
            $db = new PDO("sqlite:" . getDBPath("patron"));
            
            $stmt = $db->prepare('SELECT * FROM tb_patrons WHERE name1 LIKE :likesearch OR name2 LIKE :likesearch OR email1 = :fullsearch OR email2 = :fullsearch OR phone1 = :fullsearch OR phone2 = :fullsearch ORDER BY name1');
           
            $like = '%'.$search.'%';
            $full = $search;
            
            $bindVar = $stmt->bindParam(':likesearch', $like);
            $bindVar = $stmt->bindParam(':fullsearch', $full);
            
            
            if($bindVar)
            {
                $num = 0;
                $stmt->execute();
                $result = $stmt->fetchAll();
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
            else{
                $return["err"] = "DB:Patrons Bind Failed";
                $return["msg"] = $stmt->errorInfo();
            }
        }
        catch(PDOException $e)
        {
            $return["err"] = "DB:Patrons Unhandled PDO Exception";
            $return["msg"] = $e->getMessage();
        }
        
        return $return;
    }


    //Function to add patrons

    function addPatron($name1, $name2, $email1, $email2, $phone1, $phone2, $address1, $address2, $city, $state, $zip, $ipaddress){
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
            /*$name1 = $post->patname1;
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
            $ipaddress = get_client_ip();*/

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
                    $return["err"] = "DB:Patrons Execute Failed";
                    $return["msg"] = $stmtIns->errorInfo();
                }
            }
            else{
                $return["err"] = "DB:Patrons Bind Failed";
                $return["msg"] = $stmtIns->errorInfo();
            }

            //closing DB
            $db = NULL;
        }
        catch(PDOException $e)
        {
            $return["err"] = "DB:Patrons: Unhandled PDO Exception";
            $return["msg"] = $e->getMessage();
        }
        return $return;
     }

?>
