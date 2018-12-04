var height_bar = 300;
var width_bar = 800;
var margin_bar = ({ top: 20, right: 30, bottom: 90, left: 40 });

function addTooltipBarChart(svg) {

    var tooltip = d3.select("#barchart")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("background", "#fafafa")
        .style("border", "1px solid #3498db")
        .style("padding", "3px")
        .style("display", "none");

    return tooltip;
}

barChart = function (barData, barsNumber) {

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

    var barchart = svg_bar.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.key))
        .attr("y", y(0))
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

    barchart.on("mouseover", function () {
        tooltip.style("display", null);
        d3.select(this).attr("fill","#1c437d");
        
    })
        .on("mouseout", function () {
            tooltip.style("display", "none");
            d3.select(this).attr("fill","steelblue");
        })
        .on("mousemove", function (d) {
            tooltip.style("display", null)
                .html("<strong>" + d.key + "</strong><br/>Objets:<strong>" + d.value + "</strong>")
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 35) + "px");
        });

    //On click, actualisation du linechart et du treemap pour n'afficher que des données concernant la gare cliquée
    barchart.on("click",function(d){
        loadAfterBarChartClick(d.key);
    });

    var tooltip = addTooltipBarChart(svg_bar);

    return svg_bar.node();
}
