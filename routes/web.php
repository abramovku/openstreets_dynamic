<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MapController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('frontend.templates.main');
});

Route::get('map', [MapController::class, 'index']);
Route::post('map/init', [MapController::class, 'data'])->name('map.init_data');
Route::post('map/get_node_data_by_id', [MapController::class, 'dataNode'])->name('map.node_info');
Route::post('map/get_node_data_by_date', [MapController::class, 'dataNodeDate'])->name('map.node_info_date');
Route::post('map/get_node_list', [MapController::class, 'nodesList'])->name('map.node_list');
