// Organiser le structure de données
function traitement(data,mois,annee) {
    var donnees = {};
    for (var j = 0; j < annee.length; j++) {
        var objMois = {};
        for (var k = 0; k < mois.length; k++) {
            var dic = [];
            for (var i = 1; i < 2; i++) {
                var item = data[i];
                var itemAnnee = item.Annee;
                var itemMois = item.Mois;
//               console.log(item.Annee);
                var objet = {
                    "time": item.Annee,
                    "gare": item.Gare,
                    "nature": item.Nature,
                    "type": item.Type
                };
//                 console.log(objet);
                if (itemAnnee == annee[j] && itemMois == mois[k]) {
                   
                    dic.push(objet);
                    objMois[itemMois] = dic;
                     console.log(objMois)
                }
            }
        }

        //donnees[annee[j]] = objMois;
       // console.log(donnees);
    }

//    return donnees;
}