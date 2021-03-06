var height_line = 300;
var width_line = 800;
//var margin_line = ({ top: 20, right: 30, bottom: 90, left: 40 });
var margin_line = 65;

var dateFormat = d3.timeFormat("%Y-%m");
var parseDate = d3.timeParse("%Y-%m");


//Affichage panneau de détail 
function addTooltip(svg, color) {
    // Création d'un groupe qui contiendra tout le tooltip plus le cercle de suivi
    var tooltip = svg.append("g")
        .attr("id", "tooltip")
        .style("display", "none");
    
    // Le cercle extérieur bleu clair
    tooltip.append("circle")
        .attr("fill", color)
        .attr("r", 10);

    // Le cercle intérieur bleu foncé
    tooltip.append("circle")
        .attr("fill", color)
        .attr("stroke", "#fff")
        .attr("stroke-width", "1.5px")
        .attr("r", 4);
    
    // Le tooltip en lui-même avec sa pointe vers le bas
    // Il faut le dimensionner en fonction du contenu
    tooltip.append("polyline")
        .attr("points","0,0 0,40 55,40 60,45 65,40 130,40 130,0 0,0")
        .style("fill", "#fafafa")
        .style("stroke",color)
        .style("opacity","0.9")
        .style("stroke-width","1")
        .attr("transform", "translate(-60, -55)");
    
    // Cet élément contiendra tout notre texte
    var text = tooltip.append("text")
        .style("font-size", "13px")
        .style("font-family", "Segoe UI")
        .style("color", "#333333")
        .style("fill", "#333333")
        .attr("transform", "translate(-50, -40)");
    
    // Element pour la date avec positionnement spécifique
    text.append("tspan")
        .attr("dx", "-5")
        .attr("id", "tooltip-date")
        .style("font-weight", "bold");
    
    
    // Le texte "Cours : "
    text.append("tspan")
        .attr("dx", "-50")
        .attr("dy", "15")
        .text(" Déclarations : ");
    
    // Le texte pour la valeur de l'or à la date sélectionnée
    text.append("tspan")
        .attr("id", "tooltip-close")
        .style("font-weight", "bold");
    
    return tooltip;
}

function lineChart(data,color="steelblue") {
    /* Format Data */
    data.forEach(function(d) { 
        d.key = parseDate(d.key);
        d.value = +d.value;
    });

    /* Scale */
    var xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.key))
        .range([0, width_line-margin_line]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height_line-margin_line, 0]);

    //supprime le graphique précédent
    d3.select('#linechart svg')
        .remove();

    /* Add SVG */
    var svg_line = d3.select("#linechart").append("svg")
        .attr("width", (width_line+margin_line+20)+"px")
        .attr("height", (height_line+margin_line)+"px")
        .append('g')
        .attr("transform", `translate(${margin_line}, ${margin_line})`);

    /* Add line into SVG */
    //Instanciation de l'objet line 
    var line = d3.line()
        .x(d => xScale(d.key))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);
    
    //Affectation des données 
    var linePath = svg_line.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    //Animation pour tracer la ligne 
    var linePathLength = linePath.node().getTotalLength();
        linePath
        .attr("stroke-dasharray", linePathLength)
        .attr("stroke-dashoffset", linePathLength)
        .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

    /* Add circle */ 
    var circle = svg_line.selectAll("dot").data(data)
        .enter()
        .append("circle")
        .attr("r", 8)
        .style("fill", "grey")
        .attr("cx", function(d){return xScale(d.key)})
        .attr("cy", function(d){return yScale(d.value);})
        .attr("class", "dot");

    /* Add Axis into SVG */
    var xAxis = d3.axisBottom(xScale).ticks(5);
    var yAxis = d3.axisLeft(yScale).ticks(5);

    //Ajout de l'axe x 
    svg_line.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height_line-margin_line})`)
    .call(xAxis);

    //Ajout de l'axe y
    svg_line.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append('text')
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .attr("fill", "#000")
    .text("Déclaration de pertes");

    //instanciation du tooltip
    var tooltip = addTooltip(svg_line, color);
    var bisectDate = d3.bisector(function(d) { return d.key; }).left;


    //Ajout des animations 
    svg_line.append("rect")
    .attr("class", "overlay")
    .attr("width", width_line)
    .attr("height", height_line)
    .style("opacity", 0)
    .on("mouseover", function() { 
        tooltip.style("display", null);
    })
    .on("mouseout", function() {
        tooltip.style("display", "none");
    })
    .on("mousemove", function (){
        var x0 = xScale.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0),
            d = data[i];
    
            tooltip.attr("transform", "translate(" + xScale(d.key) + "," + yScale(d.value) + ")");
            
            d3.select('#tooltip-date')
                .text(dateFormat(d.key));
            d3.select('#tooltip-close')
                .text(d.value);

    });
}