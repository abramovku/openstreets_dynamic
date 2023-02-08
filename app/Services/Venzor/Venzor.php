<?php

namespace App\Services\Venzor;


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

    }

}
