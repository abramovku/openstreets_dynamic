<?php

namespace App\Services\Venzor;

use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

class VenzorClient
{
    private $httpClient;

    public function __construct($config)
    {
        $this->httpClient = Http::baseUrl($config['link'])->acceptJson();
    }

    /**
     * @param string $link
     * @return array|mixed
     * @throws RequestException
     */
    public function get(string $link)
    {
        return $this->httpClient
            ->get($link)
            ->throw(function ($response, $e) use ($link) {
                $this->logData(
                    'roistat',
                    'Data get error',
                    ['log_data' => [
                        'code' => $e->getCode(),
                        'link' => $link,
                        'message' => $e->getMessage(),
                        'method' => 'get'
                    ]],
                    'error'
                );
            })->json();
    }
}
