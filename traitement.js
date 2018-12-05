//Load the graphs
function loadGraphs() {
    var s = document.getElementById("mySelect");
    var select_value = s.options[s.selectedIndex].value;
    Papa.parse('data/data' + select_value + '.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        fastmode: true,
        complete: function (results) {
            var data = results.data;
            //console.log(data);

            var chartData = computeDataBarChart(data);
            //console.log(chartData);
            barChart(chartData, 10);

            var lineData = computeDataLineChart(data);
            //console.log(lineData);
            lineChart(lineData);

            var treemapData = computeDataTreemap(data);
            //console.log(treemapData);
            treemap_graphic(treemapData, select_value);
        }
    });
}

/*Fonction traçant, pour l'année sélectionnée, le linechart et le treemap à partir des enregistrements de la gare 
      passée en paramètre */
function loadAfterBarChartClick(gare) {
    var s = document.getElementById("mySelect");
    var select_value = s.options[s.selectedIndex].value;
    Papa.parse('data/data' + select_value + '.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        fastmode: true,
        complete: function (results) {
            var data = results.data;
            //console.log(data);

            //Récupération des enregistrement concernant la gare passée en paramètre
            var gareData = getGareData(data, gare);
            //console.log(gareData);

            var lineData = computeDataLineChart(gareData);
            //console.log(lineData);
            lineChart(lineData);

            var treemapData = computeDataTreemap(gareData);
            //console.log(treemapData);
            treemap_graphic(treemapData, select_value);
        }
    });
}

/*Fonction traçant, pour l'année sélectionnée, le linechart et le barchart à partir des enregistrements du type d'objets 
      passée en paramètre */
function loadAfterTreemapClick(objectType, color) {
    var s = document.getElementById("mySelect");
    var select_value = s.options[s.selectedIndex].value;
    Papa.parse('data/data' + select_value + '.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        fastmode: true,
        complete: function (results) {
            var data = results.data;
            //console.log(data);

            //Récupération des enregistrement concernant la gare passée en paramètre
            var objectTypeData = getObjectTypeData(data, objectType);
            //console.log(objectData);

            var lineData = computeDataLineChart(objectTypeData);
            //console.log(lineData);
            lineChart(lineData, color);

            var chartData = computeDataBarChart(objectTypeData);
            //console.log(chartData);
            barChart(chartData, 10, color);
        }
    });
}

/*
traitement des données pour qu'elles soient exploitables par le bar chart
*/
function computeDataBarChart(data) {
    var chartData;

    //enregistrer les gares et leurs nombres d'objets trouvés dans chartData
    var chartData = d3.nest()
        .key(function (d) { return d.Gare; })
        .rollup(function (v) { return v.length })
        .entries(data)
        .sort(function (a, b) {
            return d3.descending(a.value, b.value);
        });

    return chartData;
}

/*
traitement des données pour tracer le lineChart
*/
function computeDataLineChart(data) {

    //Aggrégation des données par dates de l'année
    let nest_mois = d3.nest()
        .key(function (d) { return d.Date })
        .sortKeys(d3.ascending)
        .rollup(function (v) { return v.length; })
        .entries(data);

    return nest_mois;
}

/*
traitement des données pour dessiner le treemap
*/
function computeDataTreemap(data) {

    //Aggrégation des données par type d'objets
    let neste_data = d3.nest()
        .key(function (d) { return d.Type })
        .rollup(function (v) { return v.length; })
        .entries(data);

    var data_treemap = [];
    for (let i = 0; i < neste_data.length; i++) {
        data_treemap.push({ "name": neste_data[i].key, "value": neste_data[i].value });
    }
    return data_treemap;
}

/*
Récupération des données ne concernantn qu'une gare
*/
function getGareData(data, gare) {

    var gareData;

    /*répartition des données en deux catégories: 
        -Celles concernant la gare passée en paramètre
        -Les autres
    */
    var nested = d3.nest()
        .key(function (d) {
            if (d.Gare == gare)
                return d.Gare;
            else
                return null;
        })
        .entries(data);

    //Récupération des données concernant la gare
    nested.forEach(element => {
        if (element.key = gare)
            gareData = element.values;
    });

    return gareData;
}

/*
Récupération des données ne concernant qu'un type d'objet
*/
function getObjectTypeData(data, objectType) {

    var objectTypeData;

    /*répartition des données en deux catégories: 
        -Celles concernant le type d'objet passé en paramètre
        -Les autres
    */
    var nested = d3.nest()
        .key(function (d) {
            if (d.Type == objectType)
                return d.Type;
            else
                return null;
        })
        .entries(data);

    //Récupération des données concernant objectType
    nested.forEach(element => {
        if (element.key = objectType)
            objectTypeData = element.values;
    });

    return objectTypeData;
}