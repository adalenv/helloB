<?php
//session_start();
class v01 extends Controller
{
  public function index(){
    echo "API v1.0";
  }

  public function home_register(){
    $sql ="INSERT INTO leads(first_name,last_name,source,email) 
                      VALUES(:first_name,:last_name,:source,:email)";
    $query = $this->db->prepare($sql);
    $query->bindParam(':first_name',$_POST['first_name']);
    $query->bindParam(':last_name',$_POST['last_name']);
    $query->bindParam(':source',$_POST['source']);
    $query->bindParam(':email',$_POST['email']);
    if ($query->execute()) {
      echo json_encode(array('success' =>true));
    }
  }

  public function register(){
    $sql ="INSERT INTO leads(first_name,last_name,phone_code,phone_number,source,email) 
                      VALUES(:first_name,:last_name,:phone_code,:phone_number,:source,:email)";
    $query = $this->db->prepare($sql);
    $query->bindParam(':first_name',$_POST['first_name']);
    $query->bindParam(':last_name',$_POST['last_name']);
    $query->bindParam(':phone_code',$_POST['phone_code']);
    $query->bindParam(':phone_number',$_POST['phone_number']);
    $query->bindParam(':email',$_POST['email']);
    $query->bindParam(':source',$_POST['source']);
    if ($query->execute()) {
      echo json_encode(array('success' =>true));
    }
  }
