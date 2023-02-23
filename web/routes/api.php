<?php

use App\Exceptions\ShopifyProductCreatorException;
use App\Lib\AuthRedirection;
use App\Lib\EnsureBilling;
use App\Lib\ProductCreator;
use App\Models\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Shopify\Auth\OAuth;
use Shopify\Auth\Session as AuthSession;
use Shopify\Clients\HttpHeaders;
use Shopify\Clients\Rest;
use Shopify\Context;
use Shopify\Exception\InvalidWebhookException;
use Shopify\Utils;
use Shopify\Webhooks\Registry;
use Shopify\Webhooks\Topics;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/', function () {
    return "Hello API";
});


Route::get('/merchant_id', function (Request $request) {
    /** @var AuthSession */
    $session = $request->get('shopifySession'); // Provided by the shopify.auth middleware, guaranteed to be active

    $client = new Rest($session->getShop(), $session->getAccessToken());
    $result = $client->get('shop');
    $res = $result->getDecodedBody();
    $domain = $res['shop']['domain'];
    $des = DB::table("sessions")->where('shop', $domain)->get();
    return response($res['shop']['domain']);
})->middleware('shopify.auth');



Route::get('/upadateUserId', function (Request $request) {
    /** @var AuthSession */
    $session = $request->get('shopifySession'); // Provided by the shopify.auth middleware, guaranteed to be active

    $client = new Rest($session->getShop(), $session->getAccessToken());
    $result = $client->get('shop');
    $res = $result->getDecodedBody();
    $domain = $res['shop']['domain'];
    $hostURI = $request->getQueryString();
    parse_str($hostURI, $output);

    // $des=DB::table("sessions")->where('shop',$domain)->get();
    // return response($res['shop']['domain']);
    $res = DB::table('sessions')->where('shop', $res['shop']['domain'])->update(array('user_id' => $output['marchantId']));
    return $res;
})->middleware('shopify.auth');
