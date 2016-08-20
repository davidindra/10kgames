<html>
<head>
    <meta charset="utf-8">
    <title>10kGames</title>

    <script>
        window.location = "/?env=reset"; // if user turn on JS at some time after first load
    </script>

    <style><?php require 'template.css'; ?></style>
</head>
<body>
<br><br><br><br><br>
<h2>
    You haven't JS! :(
</h2>
<?php
foreach($jokes as $joke){
    echo '<div style="text-align: center; margin-bottom: 20px;">' . $joke . '</div>';
}
?>
</body>
</html>