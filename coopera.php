<?php
header("Content-Type:application/json");
	
	try {
	    $pdo = new PDO("mysql:host=localhost;port=8888;dbname=dbbd;charset=utf8",'root','root');
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch (Exception $e) {
	    echo $e->getMessage();
	}

	if($_POST['cmd'] === 'get_pcks'){
		if($_POST['cur_tot']>0){
			$cur_tot = $_POST['cur_tot'];
			$num = 5;
		}
		else{
			$cur_tot = 0;
			$num = 10;
		}

		
		$arr=array();

		$stmt = $pdo->prepare("SELECT `pck_no` as no, `pck_code`, `pck_info`as info, `pck_like`  FROM `package` ORDER BY `pck_no` DESC LIMIT ".$cur_tot.",".$num);
		$stmt->execute();

		while($result = $stmt->fetchObject()){
			$arr[] = $result;
		}

		echo json_encode($arr);
	}
	else if($_POST['cmd'] === 'up_pck'){
		$pck = trim($_POST['pck']);
		$info = trim($_POST['info']);
		$info = nl2br($info);

		$stmt = $pdo->prepare("INSERT INTO `package` (`pck_code`, `pck_info`) VALUES (:pck, :info)");
		$stmt->execute(
			array(
				":pck" => $pck,
				":info" => $info
			)
		);

		$no = $pdo->lastInsertId();

		$stmt = $pdo->prepare("SELECT `pck_no` as no, `pck_code`, `pck_info` as info, `pck_like` FROM `package` WHERE `pck_no` = :pck_no");
		$stmt->execute(
			array(
				":pck_no" => $no
			)
		);

		echo json_encode($stmt->fetchObject());
	}
	else if($_POST['cmd']==='like'){
		$pck_no = $_POST['pck_no'];

		$stmt = $pdo->prepare("UPDATE `package` SET `pck_like`=CASE WHEN `pck_like` = '0' THEN 1 ELSE 0 END WHERE `pck_no` =:pck_no");

		$stmt->execute(
			array(
				":pck_no"=>$pck_no
			)
		);

		$stmt = $pdo->prepare("SELECT `pck_like` as liked FROM `package` WHERE `pck_no` = :pck_no");
		$stmt->execute(
			array(
				":pck_no"=>$pck_no
			)
		);

		echo json_encode($stmt->fetchObject());
	}
	else if($_POST['cmd']==='get_cmts'){
		$pck_no = $_POST['pck_no'];

		$stmt = $pdo->prepare("SELECT * FROM `comment` WHERE `pck_no` = :pck_no ORDER BY `cmt_no` DESC");
		$stmt->execute(
			array(
				":pck_no"=>$pck_no
			)
		);
		$arr = array();
		while($result = $stmt->fetchObject()){
			$arr[] = $result;
		}

		echo json_encode($arr);
	}
	else if($_POST['cmd']==='up_cmt'){
		$pck_no = $_POST['pck_no'];
		$code = trim($_POST['code']);
		$info = trim($_POST['info']);

		$stmt = $pdo->prepare("INSERT INTO `comment` (`pck_no`, `cmt_code`, `cmt_info`) VALUES (:pck_no, :code, :info)");
		$stmt->execute(
			array(
				":pck_no" => $pck_no,
				":code"=>$code,
				":info" => $info
			)
		);

		$no = $pdo->lastInsertId();

		$stmt = $pdo->prepare("SELECT * FROM `comment` WHERE `cmt_no` = :cmt_no");
		$stmt->execute(
			array(
				":cmt_no"=>$no
			)
		);

		echo json_encode($stmt->fetchObject());
	}
	
?>