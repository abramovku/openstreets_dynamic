import 'leaflet';

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
    oper_type: 'get_all',
    sendTimeout: 30000,
    instance: null,
    nodes: {},
    init() {
        this.generateTableHead();
        this.initMap();
        this.fetchAllNodes();
        this.setEvents();
    },
    setEvents(){
        $(this.selectors.nodeSelector).on('change',this.nodeSelected.bind(this));
        $(document).on('all_data_updated', this.updateAllData.bind(this));
    },
    nodeSelected(e) {
        console.log(e.target.value);
        this.fetchNodeById(e.target.value);
    },
    getAllData() {
        setTimeout(() => {
            this.fetchAllNodes();
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
    fetchNodeById(node) {
        let that = this;
        this.instance = $.ajax({
            url: $(this.selectors.pageWraper).data('url_node'),
            data: {node_id: node},
            method: "post"
        }).done(function (response) {
            console.log(response);
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
            that.getAllData();
        }).fail(function (response) {
            console.log('request error');
        });
    },
    updateAllData(e, data) {
        if((data.data).length && typeof (data.data) === 'object' ){
            //empty nodes anв remove from map
            this.removeNodes();
            this.removeTableLines();
            this.initNodeSelector();

            let that = this;
            $.each(data.data, function (index, value){
                let data = value.position;
                let name = value.node_id;
                that.addNode(name, data);
            });
        }
    },
    initNodeSelector() {
        $(this.selectors.nodeSelector + ' options').siblings().not(':first').remove();
    },
    addNodeToSelector(id) {
        $(this.selectors.nodeSelector).append($('<option>', {
            value: id,
            text: id
        }));
    },
    addNode(name, data) {
        this.nodes[name] = L.marker([data.latitude, data.longitude]).addTo(map)
            .bindTooltip(name, {permanent: true});
        this.addNodeToTable(name, data);
        this.addNodeToSelector(name);
    },
    addNodeToTable(name, data) {
        let line = this.generateTableLine(name, data);
        $(this.selectors.table).append(line);
    },
    removeNodes() {
        if($.isEmptyObject(this.nodes) == false) {
            for (var key in this.nodes) {
                this.nodes[key].remove();
                delete this.nodes[key];
            }
        }
    },
    removeTableLines() {
        $(this.selectors.table + ' ' + this.selectors.tableLine).each(function (){
            $(this).remove();
        });
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
    }

}

MapPage.init();




