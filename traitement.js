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
function traitementDonneesBarChart(data){
    var length = Object.keys(data).length;
    var chartData_v1={};
    var chartData_v2=[];

    //enregistrer les gares et leurs nombres d'objets trouvés dans chartData
    for( let key in data){
        data[key].forEach(element => {
            let gare = element["gare"];
            if(!chartData_v1[gare])
                chartData_v1[gare] = 1;
            else
                chartData_v1[gare]+=1;           
        });
    }
    
    //mettre chartData sous une forme utilisable par le graphe
    for(let key in chartData_v1){
        chartData_v2.push({
            gare: key,
            value: chartData_v1[key]
        });
    }

    //ordonner chartData par ordre décroissant du nombres d'objets
    var byValue = chartData_v2.slice(0);
    byValue.sort(function(a,b) {
        return b.value - a.value;
    });

    return byValue;
}