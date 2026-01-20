<?php
include ("session.inc");
include ("api.inc");

function isEnglish($word) {
    return preg_match('/^[A-Za-z]+$/', $word) === 1;
}

$wordToSend = isEnglish($_GET['word']) ? $_GET['word'] : $_GET['tranny'];
$trannyWord = isEnglish($_GET['word']) ? $_GET['tranny'] : $_GET['word'];

$headers = array(
'Content-Type: application/json',
'Authorization: Bearer '.$openaiKey
);

$data = array(
    'model' => 'gpt-5.2-chat-latest',
    'max_completion_tokens' => 500,
    'messages' => array(
        array(
            'role' => 'system',
            'content' => 'Respond quickly. Be concise. No hidden reasoning. No explanations unless requested.'
        ),
        array(
            'role' => 'user',
            'content' => "Generate a natural English sentence using the word $wordToSend.
            Provide a Korean translation including the word $trannyWord,
            and a brief Korean explanation of the word’s meaning."
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
