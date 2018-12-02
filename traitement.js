//traitement des données pour qu'elles soient exploitables par le bar chart de Yves
function computeDataBarChart(data) {
    var chartData;
    var nestedData;

    //enregistrer les gares et leurs nombres d'objets trouvés dans chartData
    var nestedData = d3.nest()
        .key(function (d) { return d.Gare; })
        .rollup(function(v){return v.length})
        .entries(data);

    chartData = nestedData.sort(function(a, b) {
                    return b.value - a.value;
                });

    return chartData;
}

function computeDataLineChart(data, year){
    let nest_annee = d3.nest()
        .key(function(d){return d.Annee})
        .object(data);

    //console.log(nest_annee)

    let nest_mois = d3.nest()
        .key(function(d){return d.Date})
        .sortKeys(d3.ascending)
        .rollup(function(v) { return v.length; })
        .entries(nest_annee[year]);

    return nest_mois;
}



function computeDataTreemap(data, year){
    
    let neste_data = d3.nest()
    .key(function(d){return d.Annee})
    .key(function(d){return d.Type})
    .rollup(function(v) { return v.length; })
    .entries(data);

    var data_treemap=[];
    for(let i=0; i<neste_data.length;i++){
        if(neste_data[i].key== year){
            let size = neste_data[i].values.length;
            let reData = neste_data[i].values;
            for(let j=0; j<size;j++){
                    data_treemap.push({"name":reData[j].key, "value":reData[j].value}) ;
            }            
        }
    }
    return data_treemap;
}
