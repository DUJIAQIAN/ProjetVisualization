// Organiser le structure de données
function traitement(data) {
    var donnees = {};
    for (var j = 0; j < annee.length; j++) {
        var objMois = {};
        for (var k = 0; k < mois.length; k++) {
            var dic = [];
            for (var i = 1; i < data.length; i++) {
                var item = data[i];
                var itemAnnee = item[0].slice(0, 4);
                var itemMois = item[0].slice(5, 7);
                var objet = {
                    "time": item[0],
                    "gare": item[1],
                    "nature": item[2],
                    "type": item[3]
                };
                if (itemAnnee == annee[j] && itemMois == mois[k]) {
                    dic.push(objet);
                    objMois[itemMois] = dic;
                }
            }
        }

        donnees[annee[j]] = objMois;
    }

    return donnees;
}

//traitement des données pour qu'elles soient exploitables par le bar chart de Yves
function computeDataBarChart(data, year) {
    var index=-1, i=0;
    var chartData;
    var nestedData;

    //enregistrer les gares et leurs nombres d'objets trouvés dans chartData
    var nestedData = d3.nest()
        .key(function (d) { return d.Annee; })
        .key(function (d) { return d.Gare; })
        .rollup(function(v){return v.length})
        .entries(data);

    while(i<nestedData.length && index==-1){
        if(nestedData[i].key==year)
            index = i;
        i++;
    }

    chartData = nestedData[index].values
                .sort(function(a, b) {
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