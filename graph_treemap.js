let width_treemap = 1850;
let height_treemap = 400;

function treemap_graphic(data_treemap, select_value) {

    const delta = 360 / data_treemap.length;
    function calculerCouleur(d, i) {
        return d3.hsl(delta * i, 0.7, 0.6);
    };

    d3.select('#treemap svg')
        .remove();
    let svg = d3.select('#treemap').append('svg');
    svg.attr('width', width_treemap)
        .attr('height', height_treemap);

    var data = {
        name: select_value,
        "children": data_treemap
    };



    //Générer la hiérarchie des données
    var root = d3.hierarchy(data)
        .sum(function (d) { return d.value; })
        .sort(function (a, b) { return b.height - a.height || b.value - a.value; });
    var treemap = d3.treemap().size([width_treemap, height_treemap]);
    treemap(root);

    //Positionner des rectangle de treemap
    var cell = svg.selectAll("g")
        .data(root.leaves())
        .enter().append("g")
        .attr("transform", function (d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

    //Configurer des tailles et des couleurs de rectangles  
    cell.append("rect")
        .on("click", function (d) {//On click, actualisation du linechart et du barchart pour n'afficher que des données concernant le type d'objet cliqué
            var color_rect = d3.select(this).attr("fill");
            loadAfterTreemapClick(d.data.name,color_rect);
        })
        .transition()
        .duration(1500)
        .ease(d3.easeElastic)
        .delay(function (data, index) {
            return index * 100;
        })
        .attr("width", function (d) { return d.x1 - d.x0; })
        .attr("height", function (d) { return d.y1 - d.y0; })
        .attr("fill", calculerCouleur);

    cell.append("title")
        .text(function (d) { return d.data.name + "\n" + d.value; });

    cell.append("text")
        .selectAll("tspan")
        .data(function (d) { return d.data.name.split(",") })
        .enter().append("tspan")
        .attr("x", 4)
        .attr("dy", "1.5em")
        .text(function (d) { return d; });

    //Animation
    cell.on("mouseover", function () {
        d3.select(this).select("text").attr("fill", "#1c437d")
            .style("font-size", "20px");

        d3.select(this).select("rect").attr("rx", "15")
            .attr("ry", "15")
            .attr("stroke", "#fff")
            .attr("stroke-width", "8");

        ;
    })
        .on("mouseout", function () {
            d3.select(this).select("text").attr("fill", "black")
                .style("font-size", "15px");

            d3.select(this).select("rect").attr("rx", "0")
                .attr("ry", "0")
                .attr("stroke", null);
        })

}

