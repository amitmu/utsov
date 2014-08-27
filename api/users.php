<?php
    
namespace UtsovAPI;

require(dirname(__FILE__).'/utils.php');

//// Main Section /////

    if (is_ajax()) {
        if (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
        $action = $_POST["action"];
            switch($action) { //Switch case for value of action
                case "test": test_function(); break;
                default: test_function();
            }
        }
    }
    else{ //should not be used - for test only
        getUserList();
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


    function getUserList(){
        $return = $_POST;
        $arr = array();
        $db = new UtsovDB("utsov");
        //$db = new \SQLite3('db/utsov.db');
        
        if(!$db)
        {
            $arr[0] = $db->lastErrorMsg();
        } else {
            $result = $db->query('SELECT * FROM tb_users');
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
        
        $return["data"] = json_encode($arr);
        $return["err"] = '';
        $return ["msg"] = 'SUCCESS';
        echo json_encode($return);
    }

    

    
?>
