var height_bar = 400;
var width_bar = 600;
var margin_bar = ({ top: 20, right: 0, bottom: 30, left: 40 });

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

    svg_bar.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.key))
        .attr("y", d => y(0))
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .transition()
        .duration(1500)
        .ease(d3.easeElastic)
        .delay(function (data, index) {
            return index*200;
        })
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value));

    return svg_bar.node();
}
