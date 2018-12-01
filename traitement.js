
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
