<?php

namespace App\Providers;

use App;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;
use URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    #[\Override]
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (App::environment('production') === true) {
            URL::forceScheme('https');
        }

        Model::preventLazyLoading();
        Model::unguard();
    }
}
