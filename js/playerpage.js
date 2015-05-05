// this file contains the JS related to the individual player portions of our visualization

// showPlayerName shows the name of the player on hover
function showPlayerName(playerName, player){

	d3.select("#playerNameDiv")
	  .attr("class", "playerNameDisplay")
	  .html(function(d, i){return "Player: " + playerName;}) 
}


function maketablechart (data){
	// console.log(data)
	var columns = Object.keys(data);

	var table = d3.select("#tableDiv").append("table").attr("class","table");
	var thead = table.append("thead").attr("class", "thead");
	var tbody = table.append("tbody");
	table.append("caption").html("NBA Individual Stats");

	thead.append("tr").selectAll("th")
	          .data(columns)
	          .enter()
	          .append("th")
	          .text(function(d){return d;})

	var rows = tbody.selectAll("tr.row")
	                .data(data.seasons)
	                .enter()
	                .append("tr").attr("class", "row");

	var cells = rows.selectAll("td")
	              .data(function(row){
	                return d3.range(Object.keys(row).length).map(function(column,i){
	                  return row[Object.keys(row)[i]]
	                });
	              })
	              .enter()
	              .append("td")
	              .text(function(d){return d;})
}

function showPlayerPage(playerID){
    this.margin = {top: 20, right: 30, bottom: 30, left: 100},
    this.width = 400 - this.margin.left - this.margin.right,
    this.height = 300 - this.margin.top - this.margin.bottom;
    // remove the old images to prepare for the new ones
    d3.select(".teamimg").remove();
    d3.select(".playerimg").remove();
    d3.select(".table").remove();
   
    var indPlayerData

    indPlayerData = playerData[playerID];
    console.log(indPlayerData)
    // averageDisplayData is the array with differences between this year and the average
    var averageDisplayData = [];
    // desireindex is the name, age, weight etc.
    var desireindex = [0, 2, 3, 5, 8]
    // avgIndex is the list of indices that we want
    var avgIndex = ["apg", "bpg", "fg3perc", "fgperc", "ftperc", "ppg", "rpg", "spg"]
    averageDisplayData = wrangleData(indPlayerData.seasons);
    // addPlayerName adds the player's name and position to the page
    addPlayerName(indPlayerData);
    // addTeamImage looks up the image for this player's team and puts it on the page
    addTeamImage(indPlayerData);
    initAverageBars(averageDisplayData);
    maketablechart(indPlayerData);

    // wrangleData will be used to create an array of the differences
    function wrangleData(data){
      var currentSeasonIndex = data.length - 2;
      var averageSeasonIndex = currentSeasonIndex + 1;
      console.log(data[currentSeasonIndex]);
      // avgData is the data that we'll be using
      var avgData = [];
      // go through and take the differences
      for(var field in data[currentSeasonIndex]){
        if(data[currentSeasonIndex].hasOwnProperty(field)){
          // if this field is of interest to us
          if(avgIndex.indexOf(field) > -1){
            // calculate values for cleanliness
            var currentSeasonValue = data[currentSeasonIndex][field];
            var averageSeasonValue = data[averageSeasonIndex][field];
            // store the difference
            avgData.push(currentSeasonValue-averageSeasonValue);
          }
        }
      }
      return avgData;
    }
    
    // createAverageBars takes the processed data array of differences and creates the bar chart
    function initAverageBars(data){
      var that = this;
      var avgDiv = d3.select("#averageBarDiv")
      this.svg = avgDiv
        .append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .attr("class", "averageBars")
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
      this.x = d3.scale.linear()
        .range([0, this.width]);
      this.y = d3.scale.ordinal()
          .rangeRoundBands([0, this.height/2], .2);
      this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("top");
      // this.yAxis = d3.svg.axis()
      //   .scale(this.y)
      //   .orient("left");
      this.area = d3.svg.area()
        .interpolate("monotone")
        .x1(function(d) {return that.x(d); })
        .x0(0)
        .y1(function(d, i) {return that.y(i);});
      this.svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + this.height/2 + ")")
      this.svg.append("g")
          .attr("class", "y axis")
        .append("text")
          .attr("x", 170)
          .attr("y", -12)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Comparison to Average")
        .append("line")
          .attr("x1", 0)
          .attr("x2", 0)
          .attr("y2", this.height);
          
      var x0 = Math.max(-d3.min(data), d3.max(data));
      this.x.domain([-x0, x0]);
      this.x.nice();
      this.y.domain(d3.range(data.length));
      // updates axes
      this.svg.select(".x.axis")
          .call(this.xAxis);
      // this.svg.select(".y.axis")
      // .call(this.yAxis)
      d3.selectAll(".playerAvgBars").remove();
      d3.selectAll(".barsLabel").remove();
      if(!isNaN(data[0])){
          var groups = this.svg.append("g")
                      .selectAll("g.row")
                      .data(data)
                      .enter()
                      .append("g")
                      .attr("class", "row");
          var bars = groups
                      .append("rect")
                      .attr("x", function (d, i) {return that.x(Math.min(0, d));})
                      .attr("y", function (d,i) {return that.y(i);})
                      .attr("width", function(d, i){return Math.abs(that.x(d) - that.x(0));})
                      .attr("height", this.y.rangeBand())
                      .attr("class", "playerAvgBars")
                      .attr("fill", function(d){
                          // if this is a negative value
                          if(d < 0){
                              return "red";
                          }
                          else
                              return "green";
                      });
        }
      }

    function addPlayerName(player){
      var info = player.name + ", " + player.position;
        d3.select("#playerName")
          .html([info])
    }

    function addTeamImage(playerData){
      // teamAbbrev will be used to determine the link
      var teamAbbrev;
      // make adjustments for exceptions
      switch(playerData.team){
        case "GS": 
          teamAbbrev = "GSW";
          break;
        case "NO":
          teamAbbrev = "NOP";
          break;
        case "NY":
          teamAbbrev = "NYK";
          break;
        case "PHO":
          teamAbbrev = "PHX";
          break;
        case "SA": 
          teamAbbrev = "SAS";
          break;
        default:
          teamAbbrev = playerData.team;
          break;
      }

     var team = d3.select("#teamimg")
     var teamimg = team.selectAll("img")
              .data([1])
              .enter().append("img")
              .attr("class", "teamimg") 
              .attr("src", "http://stats.nba.com/media/img/teams/logos/"+teamAbbrev+"_logo.svg")    
    }
      
    // used to generate team image links
    function reverseLookup(value){
      for (iter in teamLookup){
        if (teamLookup.hasOwnProperty(iter)){
          if(teamLookup[iter] == value)
            return iter;
        }
      }
    }

   var imgaa = d3.select("#playerimg")
   var image = imgaa.selectAll("img")
              .data([77])
              .enter().append("img")
              .attr("class","playerimg")
              .attr("src", indPlayerData["photo"])

   var text = d3.select("#playerdetails")
   var columns = Object.keys(indPlayerData.seasons[0]);

  
}