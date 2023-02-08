<?php

namespace App\Services\Venzor;

use Illuminate\Support\Facades\Log;

class Venzor
{
    private $client;
    private $config;

    public function __construct($config)
    {
        $this->config = $config;
        $this->client = new VenzorClient($config);
    }

    public function get_nodes_data()
    {
        Log::channel('venzor')->
        $response = $this->client->get('nodes_with_active_pos');
    }

}
