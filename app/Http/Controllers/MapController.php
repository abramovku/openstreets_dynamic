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
            if(empty($data[0]['node_id'])) throw new \Exception('Wrong data');
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 422);
        }

        return response()->json(['data' => $data]);
    }

    public function nodesList()
    {
        try{
            $nodes = app('venzor')->getNodesData();

            if(empty($nodes[0]['node_id'])) throw new \Exception('Wrong data');

            foreach ($nodes as $node){
                $data[] = $node['node_id'];
            }

        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 422);
        }

        return response()->json(['data' => $data ?? []]);
    }

    public function dataNode(DataNodeRequest $request)
    {
        try{
            $options = [
                'node_id' => $request->node_id,
                'limit' => !empty($request->limit) ? $request->limit : 20,
            ];

            $data = app('venzor')->getNodeDataById($options);
            if(empty($data[0]['node_id'])) throw new \Exception('Wrong data');
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 422);
        }

        return response()->json(['data' => $data[0]]);
    }

    public function dataNodeDate(DataNodeDateRequest $request)
    {
        try{
            $date_start = strtotime($request->date_start);
            $date_end = strtotime($request->date_end);
            $options = [
                'node_id' => $request->node_id,
                'data_start' => date('dmY', $date_start),
                'data_end' => date('dmY', $date_end),
                'limit' => !empty($request->limit) ? $request->limit : 20,
            ];

            $data = app('venzor')->getNodeDataByIdAndPeriod($options);
            if(empty($data[0]['node_id'])) throw new \Exception('Wrong data');
        } catch (\Exception $e) {
            return response()->json([$e->getMessage()], 422);
        }

        return response()->json(['data' => $data[0]]);
    }
}
