@extends('frontend.layouts.app')

@section('content')
    <div id="page-wrapper"
         data-url="{{ route('map.init_data') }}"
         data-url_node="{{ route('map.node_info') }}"
         data-url_node_date="{{ route('map.node_info_date') }}"
    >
        <div id="controls">
            <select id="nodesList">
                <option value="all">все</option>
            </select>
        </div>
        <div id="map"></div>
        <div id="nodes-table-wrapper">
            <div id="nodes-table"></div>
        </div>
    </div>
@endsection

@push('scripts')
    @vite('resources/js/pages/map.js')
@endpush
