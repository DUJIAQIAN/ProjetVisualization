//traitement des données pour qu'elles soient exploitables par le bar chart
function computeDataBarChart(data) {
    var chartData;

    //enregistrer les gares et leurs nombres d'objets trouvés dans chartData
    var chartData = d3.nest()
        .key(function (d) { return d.Gare; })
        .rollup(function(v){return v.length})
        .entries(data)
        .sort(function(a, b) {
            return d3.descending(a.value, b.value);
        });

    return chartData;
}

//traitement des données pour tracer le lineChart
function computeDataLineChart(data){

    let nest_mois = d3.nest()
        .key(function(d){return d.Date})
        .sortKeys(d3.ascending)
        .rollup(function(v) { return v.length; })
        .entries(data);

    return nest_mois;
}


//traitement des données pour dessiner le treemap
function computeDataTreemap(data){
    
    let neste_data = d3.nest()
    .key(function(d){return d.Type})
    .rollup(function(v) { return v.length; })
    .entries(data);

    var data_treemap=[];
    for(let i=0; i<neste_data.length;i++){
        data_treemap.push({"name":neste_data[i].key, "value":neste_data[i].value}) ;          
    }
    return data_treemap;
}
