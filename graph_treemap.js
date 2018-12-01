let width_treemap=1000;
let height_treemap=500;

function treemap_graphic(data_treemap,select_value){

    const delta = 360 / data_treemap.length; 
    function calculerCouleur(d, i) { 
        return d3.hsl(delta*i, 0.7, 0.6);
    };

    let svg = d3.select('body').append('svg');
        svg.attr('width', width_treemap)
            .attr('height', height_treemap);

    var data = {
        name : select_value,
        "children" :data_treemap
    };
   
 //Générer la hiérarchie des données
    var root = d3.hierarchy(data)
                .sum(function(d) { return d.value;}) 
                .sort(function(a, b) { return b.height - a.height || b.value - a.value; });
    var treemap = d3.treemap().size([width_treemap,height_treemap]);
    treemap(root);    

 //Positionner des rectangle de treemap
  var cell = svg.selectAll("g")
               .data(root.leaves())
               .enter().append("g")
                .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });
  
 //Configurer des tailles et des couleurs de rectangles  
  cell.append("rect")
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("fill", calculerCouleur);
 
  cell.append("title")
      .text(function(d) { return d.data.name + "\n" + d.value; });
 
  cell.append("text")
    .selectAll("tspan")
      .data(function(d) { return d.data.name.split(",")})
    .enter().append("tspan")
      .attr("x", 4)
      .attr("dy", "1.5em")
      .text(function(d) { return d; });


}

