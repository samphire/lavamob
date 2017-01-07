<?php
$myWord = urlencode($_GET['word']);
$userAgent = 'Googlebot/2.1 (http://www.googlebot.com/bot.html)';
$url = "http://m.endic.naver.com/search.nhn?query=".$myWord."&searchOption=entryIdiom";
$ch = curl_init();
curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_FAILONERROR, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_AUTOREFERER, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER,true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$html = curl_exec($ch);

echo $html;

?>