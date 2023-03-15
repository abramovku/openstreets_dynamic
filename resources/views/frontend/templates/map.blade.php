@extends('frontend.layouts.app')

@section('content')
    <div id="page-wrapper"
         data-url="{{ route('map.init_data') }}"
         data-url_node="{{ route('map.node_info') }}"
         data-url_node_date="{{ route('map.node_info_date') }}"
         data-url_node_list="{{ route('map.node_list') }}"
    >
        <div id="controls">
            <section class="container">
                <div class="row">
                    <div class="col-1">
                        <label for="nodesList" class="col-form-label">Датчики: </label>
                    </div>
                    <div class="col-3">
                        <select id="nodesList" class="form-control">
                            <option value="all">все</option>
                        </select>
                    </div>
                    <div class="col-1">
                        <label for="nodesList" class="col-form-label">Период: </label>
                    </div>
                    <div class="col-7">
                        <div class="input-daterange input-group"
                             data-provide="datepicker"
                             data-date-z-index-offset=9999
                             data-date-language="ru"
                             data-date-format="yyyy-mm-dd"
                        >
                            <input type="text" class="input-sm form-control" name="date_start" />
                            <input type="text" class="input-sm form-control" name="date_end" />
                            <span class="input-group-append">
                              <span class="input-group-text bg-light d-block">
                                <i class="fa fa-calendar"></i>
                              </span>
                            </span>
                        </div>
                    </div>
                </div>
            </section>
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
