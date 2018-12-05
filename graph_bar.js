var height_bar = 350;
var width_bar = 800;
var margin_bar = ({ top: 50, right: 50, bottom: 90, left: 50 });

function addTooltipBarChart(svg, color) {

    var tooltip = svg.append("g")
        .attr("id", "tooltip")
        .style("display", "none");

    var x_start = -25;
    // Le tooltip en lui-même avec sa pointe vers le bas
    // Il faut le dimensionner en fonction du contenu
    tooltip.append("polyline")
        .attr("points", "" + x_start + ",0 " + x_start + ",40 55,40 60,45 65,40 " + (120 - x_start) + ",40 " + (120 - x_start) + ",0 " + x_start + ",0")
        .style("fill", "#fafafa")
        .style("stroke", color)
        .style("opacity", "0.9")
        .style("stroke-width", "1")
        .attr("transform", "translate(-60, -55)");

    // Cet élément contiendra tout notre texte
    var text = tooltip.append("text")
        .style("font-size", "13px")
        .style("font-family", "Segoe UI")
        .style("color", "#333333")
        .style("fill", "#333333")
        .attr("transform", "translate(-50, -40)");

    var x_start_span = x_start - 5;
    // Element pour la gare avec positionnement spécifique
    text.append("tspan")
        .attr("dx", "-5")
        .attr('x', x_start)
        .attr("id", "tooltip-gare");


    // Le texte "Cours : "
    text.append("tspan")
        .attr('x', x_start)
        .attr('dx',"-9")
        .attr("dy", "15")
        .text(" Déclarations : ");

    // Le texte pour la valeur à la gare sélectionnée
    text.append("tspan")
        .attr("id", "tooltip-val")
        .style("font-weight", "bold");

    return tooltip;
}

barChart = function (barData, barsNumber, color = "steelblue") {

    //récupération des barsNumber premier éléments de l'array
    data = barData.slice(0, barsNumber);

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

    d3.select('#barchart svg')
        .remove();

    let svg_bar = d3.select('#barchart')
        .append('svg')
        .attr('width', width_bar)
        .attr('height', height_bar);

    svg_bar.append("g")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 10)
        .attr("x", 9)
        .attr("transform", "rotate(-35)")
        .style("text-anchor", "end");

    svg_bar.append("g")
        .call(yAxis);
    //COULEUR
    var barchart = svg_bar.append("g")
        .attr("fill", color)
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.key))
        .attr("y", y(0))
        .attr("width", x.bandwidth())
        .attr("height", 0);

    /* barchart.append("title")
        .text(function (d) { return d.key + "\n" + d.value; }); */

    barchart.transition()
        .duration(1500)
        .ease(d3.easeElastic)
        .delay(function (data, index) {
            return index * 200;
        })
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value));

    var tooltip = addTooltipBarChart(svg_bar, color);

    barchart.on("mouseover", function (d) {
        tooltip.style("display", null);

        d3.select(this)
            .attr("stroke", color)
            .attr("stroke-width", "8");

    })
        .on("mouseout", function () {
            tooltip.style("display", "none");
            d3.select(this).attr("stroke", null);
        })
        .on("mousemove", function (d) {
            tooltip.attr("transform", "translate(" + (x(d.key) + x.bandwidth() / 2) + "," + y(d.value) + ")");
            d3.select('#tooltip-gare')
                .text(d.key);
            d3.select('#tooltip-val')
                .text(d.value);
        });

    //On click, actualisation du linechart et du treemap pour n'afficher que des données concernant la gare cliquée
    barchart.on("click", function (d) {
        loadAfterBarChartClick(d.key);
    });

    return svg_bar.node();
}
