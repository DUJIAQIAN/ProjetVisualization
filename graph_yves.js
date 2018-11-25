var data = [
    {
        key: "rennes",
        value: 45
    },
    {
        key: "bordeaux",
        value: 50
    },
    {
        key: "paris st lazare",
        value: 60
    },
    {
        key: "lourdes",
        value: 100
    },
    {
        key: "rouen",
        value: 50
    },
    {
        key: "mont parnasse",
        value: 60
    },
    {
        key: "caen",
        value: 50
    },
    {
        key: "montpellier",
        value: 40
    },
    {
        key: "chambery",
        value: 50
    },
    {
        key: "lorient",
        value: 60
    }
];

var height = 500;
var width = 1000;
var margin = ({ top: 20, right: 0, bottom: 30, left: 40 });

barChart = function (barData, barsNumber) {

    //récupération des barsNumber premier éléments de l'array
    data = barData.slice(0, barsNumber);

    d3.select('#barchart svg')
        .remove();

    let svg = d3.select('#barchart')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

    var x = d3.scaleBand()
        .domain(data.map(d => d.key))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top]);

    var xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x)
        .tickSizeOuter(0));

    var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove());

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.key))
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value))
        .attr("width", x.bandwidth());

 

    return svg.node();
}
