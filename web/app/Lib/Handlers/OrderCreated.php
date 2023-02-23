<?php

declare(strict_types=1);

namespace App\Lib\Handlers;

use Illuminate\Support\Facades\Log;
use Shopify\Webhooks\Handler;
use App\Models\Session;
use Shopify\Clients\HttpHeaders;
use Shopify\Clients\Rest;
use Illuminate\Support\Facades\DB;

class OrderCreated implements Handler
{
    public function handle(string $topic, string $shop, array $body): void
    {
        logger($topic);
        logger($shop);
        logger($body);
        $total_price = $body['total_price'] ?? null;
        $userId = $body['note_attributes']['pindoceCreditsUserId'] ?? null;
        logger('total_price=>'.$total_price);
        logger('userId=>'.$userId);

        if ($userId != null) {
            $session_table = DB::table("sessions")->where('shop',$shop)->get();
            $lineItemDetails = '';
            foreach ($body['line_items'] as $value) {
                $lineItemDetails .= 'Item Title=> '. $value['title'] . ', Item Price=> ' . '(amount=>' . $value['price_set']['shop_money']['amount'] . ')' . ', (currency_code=>'. $value['price_set']['shop_money']['currency_code'] . ')';
            }
            $saleDescription = 'Order Name=> ' . $body['name'] . ', Order ID=> ' . $body['id']. ', Line Items Information=> {'. $lineItemDetails . ' }';
            logger('user_id=> '.$session_table[0]->user_id);
            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_URL => 'https://pincodecredits.com/PincodeAdmin/API/V1/GetUserShopping',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => array(
                    'userid' => $userId,
                    'amount' => $total_price,
                    'saledescription' => $saleDescription,
                    'brandid' => $session_table[0]->user_id,
                    'merchantid' => $session_table[0]->user_id
                ),
            ));
            $response = curl_exec($curl);
            curl_close($curl);
            logger('response=> '.$response);
        }
    }
}
