<?php
include ("session.inc");
include ("api.inc");


$headers = array(
'Content-Type: application/json',
'Authorization: Bearer '.$openaiKey
);


$data = array(
    'model' => 'gpt-3.5-turbo-1106',
    'max_tokens' => 100,
    'messages' => array(
            array(
                'role' => 'user',
                'content' => 'give me an example sentence containing the word '.$_GET['word']
            )
    )
);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response=curl_exec($ch);

if($response === false) {
       echo 'cURL error: ' . curl_error($ch);
   } else {
    echo $response;
   }
curl_close($ch);
?>
