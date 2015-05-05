// this file contains the JS related to the individual player portions of our visualization

// showPlayerName shows the name of the player on hover

function showPlayerName(playerName, playerIndex, teamLength){

  d3.select("#playerNameDiv")
    .attr("class", "playerNameDisplay")
    .html(function(d, i){return "Player: " + playerName;}) 

  for(var i = 0; i < teamLength; i++){

    if(i != playerIndex){

      var idName = "#stackedRect"+i

      d3.selectAll(idName).style("fill", "#d3d3d3")
    }
  }

}


function maketablechart (data){
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
    this.margin = {top: 20, right: 40, bottom: 30, left: 100},
    this.width = 400 - this.margin.left - this.margin.right,
    this.height = 300 - this.margin.top - this.margin.bottom;
    // remove the old images to prepare for the new ones
    d3.select(".teamimg").remove();
    d3.select(".playerimg").remove();
    d3.select(".table").remove();

    // showing the comparison drop down and submit button 
    d3.select("#comparePlayerDropDown")
      .style("visibility", "visible")

    d3.select("#submitCompare")
      .style("visibility", "visible")  
      
   
    var indPlayerData

    indPlayerData = playerData[playerID];

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

    // add the actual visualizations to the page
    initAverageBars(averageDisplayData, false);
    maketablechart(indPlayerData);
    makeShotChart(indPlayerData.name);

    // wrangleData will be used to create an array of the differences
    function wrangleData(data){
      var currentSeasonIndex = data.length - 2;
      var averageSeasonIndex = currentSeasonIndex + 1;

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

   // add the drop down to allow comparison
   addComparisonSelect(indPlayerData.name)
}

// the function to create the shot chart
function makeShotChart(playerName){

  d3.selectAll(".shotChart").remove();
  d3.selectAll(".shotContainer").remove();
  d3.selectAll(".make").remove();
  d3.selectAll(".miss").remove();

  var playerShotData = []

  // find the relevant shot data for this player
  for(i in shotChartData){
    if(shotChartData[i].name == playerName)
      playerShotData = shotChartData[i].shots
  }

  this.margin = {top: 10, right: 50, bottom: 50, left: 50},
  this.width = 850 - this.margin.left - this.margin.right,
  this.height = 350 - this.margin.top - this.margin.bottom;

  var that = this;

  // select the div and add the SVG
  var svg = d3.select("#shotChartDiv")
              .append("div")
              .attr("width", "500px")
              .attr("height", "472px")
              .attr("class", "shotChart")
              .append("div")
              .attr("class","shotContainer")
              .style("height","472px")
              .style("width","500px")
              .style("position","relative");

  var shotChart = d3.select(".shotContainer")
                      .selectAll("shots")
                      .data(playerShotData)
                      .enter()

  var court = d3.select(".shotContainer")
                 .selectAll("courtimage")
                 .data([1])
                 .enter()

  var courtImage = court.append("img")
                        .attr("src", "nbahalfcourt.jpg")
                        .style("height","472px")
                        .style("width","500px")
                        .style("position","absolute")
                        .style("left","0px")
                        .style("top","0px")

  var shots = shotChart.append("div")
                       .attr("class", function(d){
                          if(d.made == 1)
                            return "make";
                          else
                            return "miss";
                       })
                       .style("position","absolute")
                       .style("left", function(d){return d.left + "px";})
                       .style("top", function(d){return d.top + "px";})
                       .text(function(d) {
                        if(d.made ==1)
                          return "o"
                        else
                          return "x"
                       })
                       .style("color", function(d) {
                        if(d.made ==1)
                          return "green"
                        else
                          return "red"
                       })
                       .style("fill", function(d){
                          if(d.made == 1)
                            return "red"
                          else
                            return "green"
                       })

  // add the toggle so we can choose which shots to show
  var toggle = d3.select("#shotToggleDiv")
                 .style("visibility", "visible")
                 .attr("onchange", "shotToggle()");
}

// function that toggles what's shown on the shot chart based on what's selected
function shotToggle(){

  // variables for which parts of the checkbox are checked
  var made = document.getElementById("madeShots").checked
  var missed = document.getElementById("missedShots").checked

  // if both options are selected
  if(made && missed){

    d3.selectAll(".make").style("visibility", "visible")
    d3.selectAll(".miss").style("visibility", "visible")
  }

  else if (made && !missed){

    d3.selectAll(".make").style("visibility", "visible")
    d3.selectAll(".miss").style("visibility", "hidden")
  }

  else if (!made && missed){

    d3.selectAll(".make").style("visibility", "hidden")
    d3.selectAll(".miss").style("visibility", "visible")
  }

  else{

    d3.selectAll(".make").style("visibility", "hidden")
    d3.selectAll(".miss").style("visibility", "hidden")

  }
}

// this function populates the drop down menu with the other players in the league for comparison
// currentPlayer is included so that the drop down won't let you select the player you're currently viewing
function addComparisonSelect(currentPlayer){

	var select = document.getElementById("comparePlayerDropDown");

	// length is used so we can add the options in the correct order
	var length = playerNamesList.length;

    for(i in playerNamesList) {

	    var option = document.createElement('option');

	    var nextName = playerNamesList[length-i-1];

	    // check to make sure that we're not adding in the player currently selected
	    if(nextName != currentPlayer){
	    	option.text = option.value = playerNamesList[length - i - 1];
	    	select.add(option, 0);
	    }
    }

    // prepend a blank option so that we have a default value
    $("#comparePlayerDropDown").prepend("<option value='' selected='selected'></option>");
}

// this is the larger function that will be handling the processing of comparison
function comparePlayers(){

	// first, see what value is selected in the drop down
	var compareWithPlayerName = d3.select("#comparePlayerDropDown").node().value;

  if(compareWithPlayerName != 0){
  	// clear the vis 
  	clearPlayerVis();

  	// get the data for the player to be compared with
  	compareWithPlayerData = findComparePlayer(compareWithPlayerName)

  	// add the image of this player to be compared with to the page
  	var svg = d3.selectAll("svg")
  				.data([0])
  				.enter().append("img")
  				.attr("class", "comparePlayerInfo")
  				.attr("src", compareWithPlayerData["photo"])
  				.style("float", "right")

  	// add the name of the player
  	svg = d3.selectAll("svg")
  	   .data([0])
  	   .enter().append("div")
  	   .attr("class", "comparePlayerInfo")
  	   .html([compareWithPlayerData["name"] + ", " + compareWithPlayerData["position"]])
  	   .style("float", "right")

    // add the image of the player
    // teamAbbrev will be used to determine the link
    var teamAbbrev;
    // make adjustments for exceptions
    switch(compareWithPlayerData.team){
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
        teamAbbrev = compareWithPlayerData.team;
        break;
    }

   svg = d3.selectAll("svg")
           .data([0])
           .enter().append("img")
           .attr("class", "comparePlayerTeamImg")
           .style("float", "right")
           .attr("src", "http://stats.nba.com/media/img/teams/logos/"+teamAbbrev+"_logo.svg")   
            

  	// wrangle the data for comparison!

  	// this is the list we'll use for labeling
  	var nameList = ["apg", "bpg", "fg3perc", "fgperc", "ftperc", "ppg", "rpg", "spg"];

  	// find how many seasons the player to be compared with has played so we can access the current season
  	var comparePlayerSeasonIndex = compareWithPlayerData.seasons.length - 2; 

    // use findComparePlayer to get the data for the currently selected player as well
    var currentNameAndPosition = document.getElementById("playerName").innerHTML
    var currentPlayerName = currentNameAndPosition.split(",")[0]

    var currentPlayerData = findComparePlayer(currentPlayerName);
    var currentPlayerSeasonIndex = currentPlayerData.seasons.length-2;

    console.log(currentPlayerData)

  	var compareData = wrangleCompareData(currentPlayerData.seasons[currentPlayerSeasonIndex], compareWithPlayerData.seasons[comparePlayerSeasonIndex])

    // add the bars
    initAverageBars(compareData, true);

    // adding the "back" button and functionality
    var backButton = d3.select("#backButton")
                       .style("visibility", "visible")
                       .on("click", function(){goBack(currentPlayerData);})
  }                 
}

// wrangle the data for comparison
function wrangleCompareData(currentPlayerData, compareWithPlayerData){
  
  // differenceData is what we'll return to be used to make the compareBars
  var differenceData = []

  console.log(currentPlayerData)
  console.log(compareWithPlayerData)

  // we use nameList again here to get our values
  var nameList = ["apg", "bpg", "fg3perc", "fgperc", "ftperc", "ppg", "rpg", "spg"];
  for(i in compareWithPlayerData){

    if(compareWithPlayerData.hasOwnProperty(i)){

      if(nameList.indexOf(i) > -1){

        differenceData.push(compareWithPlayerData[i] - currentPlayerData[i])
      }
    }
  }

  return differenceData;

}

// initAverageBars takes the processed data array of differences and creates the bar chart
function initAverageBars(data, compare){

  // the names of the bars
  var nameList = ["apg", "bpg", "fg3perc", "fgperc", "ftperc", "ppg", "rpg", "spg"];

  var that = this;
  var avgDiv = d3.select("#averageBarDiv")
  this.svg = avgDiv
    .append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", 100 + this.margin.top + this.margin.bottom)
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
      .text(function(){

        if(compare)
          return "Comparison of Stats"
        else
          return "Current Year Comparison to Average";
      })
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



      var labels = groups.append("text")
                         .attr("x", function (d, i) {return that.x(Math.min(0, d)) + Math.abs(that.x(d) - that.x(0)) + 5;})
                         .attr("y", function (d,i) {return that.y(i) + that.y.rangeBand()/2;})
                         .text(function(d,i){return Math.ceil(d * 100) / 100 + " " + nameList[i]});
    }
}

function goBack(currentPlayerData){

  // clear the vis
  clearPlayerVis();

  // find the ID of the current player to reload their individual page
  var ID = playerNamesList.indexOf(currentPlayerData.name);

  // put the individual player page back
  showPlayerPage(ID);

  // hiding the back button and compare dropdown/button
  var backButton = d3.select("#backButton")
                     .style("visibility", "hidden")
}

// HELPER FUNCTIONS AFTER THIS

// this function clears out the vis to prepare for the comparison one
function clearPlayerVis(){

	// we'll reformat these later.
	// d3.select("#teamNameDiv").html([""]);
	// d3.select("#playerName").html([""]);
	// d3.select(".teamimg").remove();
	// d3.select(".playerimg").remove();
	// d3.selectAll("svg").remove();

  // hide the shot toggle
  var toggle = d3.select("#shotToggleDiv")
                 .style("visibility", "hidden");

	d3.selectAll(".averageBars").remove();
 	d3.selectAll(".comparePlayerInfo").remove();
	d3.selectAll(".compareBarsDiv").remove();
	d3.select(".table").remove();
	d3.selectAll(".brush").remove();
  d3.selectAll(".shotChart").remove();
  d3.selectAll(".shotContainer").remove();
  d3.selectAll(".make").remove();
  d3.selectAll(".miss").remove();
  d3.selectAll(".comparePlayerTeamImg").remove();
}

// searches through the JSON to find the player's data
function findComparePlayer(playerName){

	for(obj in playerData){
		for(key in playerData[obj]){
			if(playerData[obj].name == playerName)
				return playerData[obj];
		}
	}
}