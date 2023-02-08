<?php

namespace App\Services\Venzor;

use Illuminate\Support\ServiceProvider;

class VenzorServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton('venzor', function ($app) {
            return new Venzor($app->config['services']['venzor'] ?? []);
        });
    }
}
