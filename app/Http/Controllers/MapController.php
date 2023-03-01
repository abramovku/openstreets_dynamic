<?php

namespace App\Http\Controllers;

use App\Http\Requests\DataNodeDateRequest;
use App\Http\Requests\DataNodeRequest;
use Carbon\Carbon;

class MapController extends Controller
{
    public function index()
    {
        return view('frontend.templates.map');
    }

    public function data()
    {
        try{
            $data = app('venzor')->getNodesData();
        } catch (\Exception $e) {
            return response()->json([], 422);
        }

        return response()->json(['data' => $data]);
    }

    public function dataNode(DataNodeRequest $request)
    {
        try{
            $options = ['node_id' => $request->node_id];
            $options['limit'] = !empty($request->limit) ? $request->limit : 5;
            $data = app('venzor')->getNodeDataById($options);
        } catch (\Exception $e) {
            return response()->json([], 422);
        }

        return response()->json(['data' => $data]);
    }

    public function dataNodeDate(DataNodeDateRequest $request)
    {
        try{
            $options = [
                'node_id' => $request->node_id,
                'data_start' => Carbon::createFromFormat('dmY', $request->data_start),
                'data_end' => Carbon::createFromFormat('dmY', $request->data_end),
            ];
            $data = app('venzor')->getNodeDataByIdAndPeriod($options);
        } catch (\Exception $e) {
            return response()->json([], 422);
        }

        return response()->json(['data' => $data]);
    }
}
