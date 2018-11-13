data =[
    {
        gare:"rennes",
        nbr:45
    },
    {
        gare:"bordeaux",
        nbr:50
    },
    {
        gare:"paris st lazare",
        nbr:60
    },
    {
        gare:"lourdes",
        nbr:100
    },
    {
        gare:"rouen",
        nbr:50
    },
    {
        gare:"mont parnasse",
        nbr:60
    },
    {
        gare:"caen",
        nbr:50
    },
    {
        gare:"montpellier",
        nbr:40
    },
    {
        gare:"chambery",
        nbr:50
    },
    {
        gare:"lorient",
        nbr:60
    }
];

var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
	
  x.domain(data.map(function(d) { return d.gare; }));
  y.domain([0, d3.max(data, function(d) { return d.nbr; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("nbr objets trouvés");

  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.gare); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.nbr); })
      .attr("height", function(d) { return height - y(d.nbr); });
   


