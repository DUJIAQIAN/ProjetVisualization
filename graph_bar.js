var height_bar = 400;
var width_bar = 600;
var margin_bar = ({ top: 20, right: 0, bottom: 30, left: 40 });

function addTooltipBarChart() {
        
    var tooltip = d3.select("#barchart")
        .append("g")
        .attr("id","tooltip")
        .style("display","none")
        .style("position","absolute")
        .style("background", "#fafafa")
        .style("opacity","0.9")
        .style("border","thin solid #3498db");
    
    // Cet élément contiendra tout notre texte
    var text = tooltip.append("text")
        .style("font-size", "13px")
        .style("font-family", "Segoe UI")
        .style("color", "#333333")
        .style("fill", "#333333")
        .attr("transform", "translate(-50, -40)");
    
    // Element pour la gare
    text.append("div")
        .attr("dx", "-5")
        .attr("id", "tooltip-gare");
            
    // Le texte "Déclarations: "
    text.append("tspan")
        .attr("dx", "-50")
        .attr("dy", "15")
        .text("Déclarations : ");
    
    // Le texte pour le nbre de déclarations à la gare sélectionnée
    text.append("tspan")
        .attr("id", "tooltip-decla")
        .style("font-weight", "bold");

    return tooltip;
}

barChart = function (barData, barsNumber) {

    //récupération des barsNumber premier éléments de l'array
    data = barData.slice(0, barsNumber);

    d3.select('#barchart svg')
        .remove();

    let svg_bar = d3.select('#barchart')
        .append('svg')
        .attr('width', width_bar)
        .attr('height', height_bar);

    var x = d3.scaleBand()
        .domain(data.map(d => d.key))
        .range([margin_bar.left, width_bar - margin_bar.right])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height_bar - margin_bar.bottom, margin_bar.top]);

    var xAxis = g => g
        .attr("transform", `translate(0,${height_bar - margin_bar.bottom})`)
        .call(d3.axisBottom(x)
            .tickSizeOuter(0));

    var yAxis = g => g
        .attr("transform", `translate(${margin_bar.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain")
            .remove());

    svg_bar.append("g")
        .call(xAxis);

    svg_bar.append("g")
        .call(yAxis);

    var tooltip = addTooltipBarChart();

    var barchart = svg_bar.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.key))
        .attr("y", d => y(0))
        .attr("width", x.bandwidth())
        .attr("height", 0)

    barchart.transition()
        .duration(1500)
        .ease(d3.easeElastic)
        .delay(function (data, index) {
            return index * 200;
        })
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value));
    
    barchart.on("mouseover", function (d) {
        tooltip.style("display", null)
            .style("left", (x(d.key)) + "px")		
            .style("top", (y(d.value)+20) + "px");
        d3.select("#tooltip-gare")
        .text(d.key);
        d3.select("#tooltip-decla")
        .text(d.value);
    })
        .on("mouseout", function () {
            tooltip.style("display", "none");
        });

    return svg_bar.node();
}
