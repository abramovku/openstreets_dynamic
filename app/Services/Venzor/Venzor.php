<?php

namespace App\Services\Venzor;

use Illuminate\Support\Facades\Log;

class Venzor
{
    private VenzorClient $client;

    public function __construct(array $config)
    {
        $this->client = new VenzorClient($config);
    }

    public function getNodesData(): array
    {
        Log::channel('venzor')->info(__FUNCTION__ . 'send', ['log_data' => []]);
        $nodes = $this->client->get('nodes_with_active_pos');
        Log::channel('venzor')->info(__FUNCTION__ . 'send', ['log_data' => $nodes]);

        return $nodes;
    }

    public function getNodeDataById(array $data): array
    {
        Log::channel('venzor')->info(__FUNCTION__ . 'send', ['log_data' => []]);
        $result = $this->client->post('get_positions_by_node_id', $data);
        Log::channel('venzor')->info(__FUNCTION__ . 'send', ['log_data' => $result]);

        return $result;
    }

    public function getNodeDataByIdAndPeriod(array $data): array
    {
        Log::channel('venzor')->info(__FUNCTION__ . 'send', ['log_data' => []]);
        $result = $this->client->post('get_node_pos_for_period', $data);
        Log::channel('venzor')->info(__FUNCTION__ . 'send', ['log_data' => $result]);

        return $result;
    }
}
