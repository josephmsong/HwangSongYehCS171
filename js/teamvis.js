
// this file contains the JS related to the team player comparison in our visualization

// brush creates three path svgs that respond to one brush. 
function brush(team){
    //constants
   var margin = {top: 10, right: 50, bottom: 10, left: 20},
    margin2 = {top: 200, right: 50, bottom: 20, left: 20},
    width = 600, 
    height = 80,
    height2 = 80;

    // scales for each path element
    var x = d3.time.scale().range([0, width]),
        x2 = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]),
        y2 = d3.scale.linear().range([height2, 0]),
        y3 = d3.scale.linear().range([height,0]),
        y4 = d3.scale.linear().range([height,0]),
        y5 = d3.scale.linear().range([height,0]);

    // make axis
    var xAxis = d3.svg.axis().scale(x).orient("bottom"),
        xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
        yAxis = d3.svg.axis().scale(y).orient("left"),
        yAxis3 = d3.svg.axis().scale(y3).orient("left"),
        yAxis4 = d3.svg.axis().scale(y4).orient("left"),
        yAxis5 = d3.svg.axis().scale(y5).orient("left");

    //creates brush
    var brush = d3.svg.brush()
        .x(x2)
        .on("brush", brushed);

    // creates area for each region
    var area2 = d3.svg.area()
        .interpolate("monotone")
        .x(function(d) { return x2(d.year); })
        .y0(height2)
        .y1(function(d) { return y2(d.win); });

    var area3 = d3.svg.area()
          .interpolate("monotone")
          .x(function(d) { return x(d.year); })
          .y0(height)
          .y1(function(d) { return y3(d.ppg); });

    var area4 = d3.svg.area()
          .interpolate("monotone")
          .x(function(d) { return x(d.year); })
          .y0(height)
          .y1(function(d) {return y4(d.fg3perc); });

    var area5 = d3.svg.area()
          .interpolate("monotone")
          .x(function(d) { return x(d.year); })
          .y0(height)
          .y1(function(d) {return y5(d.rpg); });

    // svg that contains all path elements
    var svg = d3.select("#brushDiv").append("svg")
        .attr("class", "brush")
        .attr("width", width + margin.left + margin.right)
        .attr("height", 500 + margin.top + margin.bottom);

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    // the brush element
    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + 20+ "," + 0+ ")");

    // points per game, free throw percentage, rebounds per game
    var ppg = svg.append("g")
        .attr("class", "alt")
        .attr("transform", "translate(" + 20+ "," + 100 + ")");

    var fg3perc = svg.append("g")
        .attr("class", "alt")
        .attr("transform", "translate(" + 20+ "," + 200 + ")");

    var rpg = svg.append("g")
        .attr("class", "alt")
        .attr("transform", "translate(" + 20 + "," + 300 + ")");

    //load data
    d3.json("data/nbateams.json", function(error, data) {
      var teamdata = data.filter(function(d){return d.name == team});
      var parseDate = d3.time.format("%Y").parse;
            teamdata[0].years.forEach(function(d,i){
              if(parseDate(d.year.substring(0,4))!= null)
                d.year = parseDate(d.year.substring(0,4))
            })
      x.domain(d3.extent(teamdata[0].years.map(function(d) { return d.year; })));
      y.domain([0, d3.max(teamdata[0].years.map(function(d) { return d.win; }))]);
      y3.domain([d3.min(teamdata[0].years.map(function(d) { return d.ppg; })), d3.max(teamdata[0].years.map(function(d) { return d.ppg; }))]);
      y4.domain([0, d3.max(teamdata[0].years.map(function(d) { return d.fg3perc; }))]);
      y5.domain([d3.min(teamdata[0].years.map(function(d) { return d.rpg; })), d3.max(teamdata[0].years.map(function(d) { return d.rpg; }))])
      x2.domain(x.domain());
      y2.domain(y.domain());

      rpg.append("path")
          .datum(teamdata[0].years)
          .attr("class", "area5")
          .attr("d", area5)

      rpg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(20," + height + ")")
          .call(xAxis);

      rpg.append("g")
          .attr("class", "y axis")
          .call(yAxis5);

      ppg.append("path")
          .datum(teamdata[0].years)
          .attr("class", "area3")
          .attr("d", area3)

      ppg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(20," + height + ")")
          .call(xAxis);

      ppg.append("g")
          .attr("class", "y axis")
          .call(yAxis);


      fg3perc.append("path")
          .datum(teamdata[0].years)
          .attr("class", "area4")
          .attr("d", area4)

      fg3perc.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(20," + height + ")")
          .call(xAxis);

      fg3perc.append("g")
          .attr("class", "y axis")
          .call(yAxis4);


      context.append("path")
          .datum(teamdata[0].years)
          .attr("class", "area2")
          .attr("d", area2);

      context.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(20," + height2 + ")")
          .call(xAxis2);

      context.append("g")
          .attr("class", "x brush")
          .call(brush)
        .selectAll("rect")
          .attr("y", -6)
          .attr("height", height2 + 7);

      
    });

    function brushed() {
          x.domain(brush.empty() ? x2.domain() : brush.extent());
          ppg.select(".area3").attr("d", area3);
          ppg.select(".x.axis").call(xAxis);
          fg3perc.select(".area4").attr("d", area4);
          fg3perc.select(".x.axis").call(xAxis);
          rpg.select(".area5").attr("d", area5);
          rpg.select(".x.axis").call(xAxis);
    }

    function type(d) {
      d.date = parseDate(d.date);
      d.price = +d.price;
      return d;
    } 
}   
    
  // this function creates a stacked bar chart
 function stacked(team,playerData) {
    // filter the data based on specific team selected 
    var data = playerData.filter(function(d){return d.team==team});
    drawBar(wranglestackedData("minutes",data))
    drawBar(wranglestackedData("ppg",data))
    drawBar(wranglestackedData("reb",data))
    drawBar(wranglestackedData("assists",data))
    drawBar(wranglestackedData("steals",data))
    drawBar(wranglestackedData("blocks",data))
    drawBar(wranglestackedData("turnovers",data))

    addLegend(wranglestackedData("ppg",data));
  }
  function addLegend(array){
   var playerDatas;
    var svg;
    var color = d3.scale.category20c()
    var margin = {top: 10, right: 5, bottom: 30, left: 5},
    width = 50,
    legwidth = 100;
    height = 400 - margin.top - margin.bottom;

    var legsvg = d3.select("body").append("svg")
      .attr("width", 100 + 50+ margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + 30 + "," + 0+ ")");

    var legend = legsvg.selectAll(".legend")
        .data(color.domain().slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(60," + i * 20 + ")"; });

    legend.append("rect")
        .attr("class", "rawr")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d,i) {return color(i)});

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d,i) { return array.name[i]; });
    
  }
  //wrangles the data to get in correct format
  function wranglestackedData(value,data){
    var indPlayerData= data.map(function(d){
    
    // format the data into an array that consolidates players stats
      return {
        ppg: d.seasons[d.seasons.length-2]["ppg"],
        assists: d.seasons[d.seasons.length-2]["assists"],
        blocks: d.seasons[d.seasons.length-2]["blocks"], 
        fga: d.seasons[d.seasons.length-2]["fga"],
        rpg: d.seasons[d.seasons.length-2]["rpg"],
        turnovers: d.seasons[d.seasons.length-2]["turnovers"],
        minutes: d.seasons[d.seasons.length-2]["minutes"],
        steals: d.seasons[d.seasons.length-2]["steals"],
        reb: d.seasons[d.seasons.length-2]["reb"],
        games:d.seasons[d.seasons.length-2]["gamesplayed"],
        name:d.name
      }
    });

    // these are arrays that will hold each team's stats
    var ppg = [];
    var assists = [];
    var blocks = [];
    var names = [];
    var fga = [];
    var rpg = [];
    var turnovers = [];
    var minutes = [];
    var steals = [];
    var reb = [];
    var games=[];

    //populates the arrays
    for(var i=0; i< indPlayerData.length; i++)
    {
      ppg[i] = indPlayerData[i].ppg;
      assists[i] = indPlayerData[i].assists;
      blocks[i] = indPlayerData[i].blocks;
      names[i] = indPlayerData[i].name;
      fga[i] = indPlayerData[i].fga;
      rpg[i] = indPlayerData[i].rpg;
      turnovers[i] = indPlayerData[i].turnovers;
      steals[i] = indPlayerData[i].steals;
      minutes[i] = indPlayerData[i].minutes;
      reb[i] = indPlayerData[i].reb;
      games[i] = indPlayerData[i].games;
    }

    // we want total points for all games
    for(var i=0; i<ppg.length; i++)
    {
      ppg[i] = d3.round(ppg[i]*games[i]);
    }

    var entire = [ppg,assists,blocks, fga, rpg, turnovers, steals, minutes, reb];

    var list = ["ppg", "assists", "blocks", "fga", "rpg", "turnovers", "steals", "minutes", "reb"]
    var index = list.indexOf(value);
    var labels = ["points","assists", "blocks", "fga", "rpg", "turnovers", "steals", "minutes", "rebounds"] 
    var total = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    total[1] = entire[index][1]
    for(var j = 1; j<entire[index].length; j++)
    {
      total[j] = entire[index][j-1] + total[j-1]
    }
    var team= {x:value, y:entire[index], total:total, name:names, label:labels[index]}
    return team;
    }  

   // this function adds legend to the stacked bar chart 
  
  // this function draws the bars
  function drawBar (array){

    var playerDatas;
    var svg;
    var color;
    var margin = {top: 10, right: 5, bottom: 30, left: 5},
    width = 50,
    legwidth = 100;
    height = 400 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([320,0]);

    color = d3.scale.category20c()

    // instantiate axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    // create svg
    svg = d3.select("body").append("svg")
    .attr("class", "rawr")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-40, 0])
        .html(function(d,i) {
          return array.name[i] + ": " + d  ;
        })

    svg.call(tip)
    x.domain(array.x);
    y.domain([0, d3.max(array.total, function(d){return d})])

   svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        // .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        // .call(yAxis)
      .append("text")
      .attr("class", function(d,i){return "bar"+i})
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("font-style", "italic")
        .style("text-anchor", "end")
        .text(array.label);

    var state = svg.selectAll(".state")
        .data(array.y)
      .enter().append("g")
        .attr("class", "g")
        // .attr("transform", function(d) { return "translate(" + x(team.x) + ",0)"; });

   var bar=  state.selectAll("rect")
       
        .data(array.y)
        .enter().append("rect")
        .attr("width", 30)

        // travis look here
        .attr("id", function(d,i){return "stackedRect"+i})
        .attr("y", function(d,i) { return height-y(array.total[i])})
        .attr("height", function(d,i) { return y(d)})
        .style("fill", function(d,i) { return color(i); })
         .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    }
