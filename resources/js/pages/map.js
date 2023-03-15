import 'leaflet';
import 'bootstrap';
import 'bootstrap-datepicker';
import 'bootstrap-datepicker/js/locales/bootstrap-datepicker.ru.js';


var MapPage = {
    options: {
        lon: $('meta[name="center-lon"]').attr('content'),
        lat: $('meta[name="center-lat"]').attr('content'),
    },
    selectors: {
        pageWraper: '#page-wrapper',
        table: '#nodes-table',
        tableWraper: '#nodes-table-wrapper',
        tableLine: '.line',
        controls: '#controls',
        nodeSelector: '#nodesList'
    },
    table_titles: {
        node_id: 'ID датчика',
        coordinate: 'Координаты',
        date: 'Дата',
        time: 'Время'
    },
    operation_type: 'get_all',
    sendTimeout: 60000,
    date_start: null,
    date_end: null,
    instance: null,
    list: [],
    nodes: {},
    init() {
        this.generateTableHead();
        this.initMap();
        this.fetchAllNodes();
        this.fetchNodesList();
        this.setEvents();
    },
    setEvents(){
        $(this.selectors.nodeSelector).on('change',this.nodeSelected.bind(this));

        $(document).on('changeDate',this.dateChanged.bind(this));
        $(document).on('clearDate',this.dateCleared.bind(this));
        $(document).on('date_cleared',this.dateUpdated.bind(this));
        $(document).on('date_updated',this.dateUpdated.bind(this));

        $(document).on('all_data_updated', this.updateAllData.bind(this));
        $(document).on('node_list_updated', this.receivedNodeList.bind(this));
        $(document).on('node_data_updated', this.updateNodeData.bind(this));
    },
    process() {
        setTimeout(() => {
                switch (this.operation_type) {
                    case 'get_all':
                        this.fetchAllNodes();
                        break;
                    case 'single_node':
                        this.fetchNodeById();
                        break;
                    case 'single_node_date':
                        this.fetchNodeByIdDate();
                        break;
                }
        }, this.sendTimeout);
    },
    initMap: function () {
        // initialize map
        window.map = L.map('map', {
            center: [this.options.lat, this.options.lon],
            zoom: 11
        });
        // add the OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        }).addTo(map);

        // show the scale bar on the lower left corner
        L.control.scale({imperial: true, metric: true}).addTo(map);
    },

    addNode(name, data, index, single = false) {
        var title = name;
        if(single) {
            title += ' ' + data.date + ' ' + data.time;
        }
        this.nodes[name + '_' + index] = L.marker([data.latitude, data.longitude]).addTo(map)
            .bindTooltip(title, {permanent: true});
        this.addNodeToTable(name, data);
    },
    removeNodes() {
        if($.isEmptyObject(this.nodes) == false) {
            for (var key in this.nodes) {
                this.nodes[key].remove();
                delete this.nodes[key];
            }
        }
    },

    //table
    removeTableLines() {
        $(this.selectors.table + ' ' + this.selectors.tableLine).each(function (){
            $(this).remove();
        });
    },
    addNodeToTable(name, data) {
        let line = this.generateTableLine(name, data);
        $(this.selectors.table).append(line);
    },
    generateTableLine(name, data) {
        let line = "<div class='line'>";
        line += "<div class='id'>" + name + "</div>";
        line += "<div class='coordinates'>[" + data.latitude +", " + data.longitude + "]</div>";
        line += "<div class='date'>" + data.date + "</div>";
        line += "<div class='time'>" + data.time + "</div>";
        line += "</div>";

        return line;
    },
    generateTableHead() {
        let line = "<div class='head'>";
        line += "<div class='id'>" + this.table_titles.node_id + "</div>";
        line += "<div class='coordinates'>" + this.table_titles.coordinate + "</div>";
        line += "<div class='date'>" + this.table_titles.date + "</div>";
        line += "<div class='time'>" + this.table_titles.time + "</div>";
        line += "</div>";

        $(this.selectors.table).append(line);
    },
    //table

    //node selector
    emptyNodeSelector() {
        $(this.selectors.nodeSelector + ' option').siblings().not(':first').remove();
    },
    addNodeToSelector(id) {
        $(this.selectors.nodeSelector).append($('<option>', {
            value: id,
            text: id
        }));
    },
    //node selector

    //event callbacks
    updateNodeData(e, data) {
        //empty nodes and remove from map
        this.removeNodes();
        this.removeTableLines();
        if((data.data.position).length && typeof (data.data.position) === 'object' ) {
            let that = this;
            let name = data.data.node_id;
            $.each(data.data.position, function (index, value) {
                that.addNode(name, value, index, true);
            });
        }
    },
    nodeSelected(e) {
        console.log(e.target.value);
        if(e.target.value == 'all') {
            this.operation_type = 'get_all';
            this.list=[];
            this.fetchAllNodes();
        } else {
            this.list=[e.target.value];
            if(this.date_start != null && this.date_end != null ) {
                this.operation_type = 'single_node_date';
                this.fetchNodeByIdDate();
            } else {
                this.operation_type = 'single_node';
                this.fetchNodeById();
            }
        }
    },
    dateChanged(e) {
        console.log(e.target.value);
        if(e.target.name == 'date_start') {
            this.date_start = e.target.value;
        }
        if(e.target.name == 'date_end') {
            this.date_end = e.target.value;
        }
        if(this.date_start != null && this.date_end != null) {
            console.log('date');
            $.event.trigger('date_updated');
        }
    },
    dateCleared(e) {
        if(e.target.name == 'date_start') {
            this.date_start = null;
        }
        if(e.target.name == 'date_end') {
            this.date_end = null;
        }
        $.event.trigger('date_cleared');
    },
    dateUpdated() {
        let select = $(this.selectors.nodeSelector).val();
        console.log(select);
        if(select == 'all') {
            this.operation_type = 'get_all';
            this.fetchAllNodes();
        } else {
            if(this.date_start != null && this.date_end != null) {
                this.operation_type = 'single_node_date';
                this.fetchNodeByIdDate(select, this.date_start, this.date_end);
            } else {
                this.operation_type = 'single_node';
                this.fetchNodeById(select);
            }
        }
    },
    updateAllData(e, data) {
        //empty nodes and remove from map
        this.removeNodes();
        this.removeTableLines();
        if((data.data).length && typeof (data.data) === 'object' ) {
            let that = this;
            $.each(data.data, function (index, value){
                let data = value.position;
                let name = value.node_id;
                that.addNode(name, data, index);
            });
        }
    },
    receivedNodeList(e, data) {
        let that = this;
        $.each(data.data, function (index, value){
            that.addNodeToSelector(value);
        });
    },
    //event callbacks

    //ajax
    fetchNodeById() {
        let that = this;
        this.instance = $.ajax({
            url: $(this.selectors.pageWraper).data('url_node'),
            data: {node_id: this.list},
            method: "post"
        }).done(function (response) {
            $.event.trigger(
                'node_data_updated',
                response
            );
            that.process();
        }).fail(function (response) {
            console.log('request error');
        });
    },
    fetchNodeByIdDate() {
        let that = this;
        this.instance = $.ajax({
            url: $(this.selectors.pageWraper).data('url_node_date'),
            data: {node_id: this.list, date_start: this.date_start, date_end:this.date_end},
            method: "post"
        }).done(function (response) {
            $.event.trigger(
                'node_data_updated',
                response
            );
            that.process();
        }).fail(function (response) {
            console.log('request error');
        });
    },
    fetchAllNodes() {
        let that = this;
        this.instance = $.ajax({
            url: $(this.selectors.pageWraper).data('url'),
            method: "post"
        }).done(function (response) {
            $.event.trigger(
                'all_data_updated',
                response
            );
            that.process();
        }).fail(function (response) {
            console.log('request error');
        });
    },
    fetchNodesList() {
        let that = this;
        this.instance = $.ajax({
            url: $(this.selectors.pageWraper).data('url_node_list'),
            method: "post"
        }).done(function (response) {
            $.event.trigger(
                'node_list_updated',
                response
            );
        }).fail(function (response) {
            console.log('request error');
        });
    },
    //ajax
}

MapPage.init();




