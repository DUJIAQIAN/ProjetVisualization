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