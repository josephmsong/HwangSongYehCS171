/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */



/*
 *
 * ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================
 *
 * */

/**
 * AgeVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
BarVis = function(_parentElement, _data, _metaData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.displayData = [];



    // TODO: define all constants here
    this.margin = {top: 20, right: 0, bottom: 30, left: 60},
    this.width = 650 - this.margin.left - this.margin.right,
    this.height = 270 - this.margin.top - this.margin.bottom;
    this.initVis();

}


/**
 * Method that sets up the SVG and the variables
 */
BarVis.prototype.initVis = function(){

   var namelist = []
   var that = this;
    for(var i = 0; i<16; i++)
    {
      namelist[i] = that.metaData["priorities"][i]["item-title"]
    }

	
   this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right+50)
        .attr("height", this.height + this.margin.top + this.margin.bottom+200)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // creates axis and scales
    this.x = d3.scale.ordinal()
      .rangeBands([0,this.width],.1).domain(namelist);
  
    this.y = d3.scale.linear()
      .range([this.height,0]);

    this.color = d3.scale.category20();

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom");

    this.yAxis = d3.svg.axis()
      .scale(this.y)

      .orient("left");
    this.svg.append("text")
      .text("Priority distribution")
      .attr("x",400)

    // Add axes visual elements
    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height+ ")");
 	  this.svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0," + 0 + ")");
    // filter, aggregate, modify data
    this.wrangleData(null);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
BarVis.prototype.wrangleData= function(_filterFunction){

    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate(_filterFunction);

    //// you might be able to pass some options,
    //// if you don't pass options -- set the default options
    //// the default is: var options = {filter: function(){return true;} }
    //var options = _options || {filter: function(){return true;}};

}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
BarVis.prototype.updateVis = function(){

    // Dear JS hipster,
    // you might be able to pass some options as parameter _option
    // But it's not needed to solve the task.
    // // var options = _options || {};
    // this.x.domain(d3.extent(this.displayData, function(d) { return d.time; }));
    // this.y.domain(d3.extent(this.displayData, function(d) { return d.count; }));


    // // TODO: implement...
    
    // // TODO: ...update graphs
    this.svg.selectAll(".bar").remove();
    // this.svg.selectAll(".text").remove()

    var that = this;

    var max =  d3.max(this.displayData)

    console.log(that.metaData["priorities"])
   
    that.y.domain([0,max]);
    

    this.svg.select(".x.axis")
        .call(this.xAxis)
        .selectAll("text")
        .attr("transform",function(d){return "rotate(60)translate("+10 + ")"})
        .attr("style", "text-anchor:left")
;

    this.svg.select(".y.axis")
        .call(this.yAxis)

    // // updates graph
    var bar = this.svg.selectAll(".bar")
    					.data(that.displayData);

    var bar_enter = bar.enter().append('g')
    	bar_enter.append("rect")
      .attr("class", "bar")
      .attr("x", function(d,i){ return 36.5*(i)+5})
      .attr("y", function(d){ return that.y(d)})
      .style("fill", function(d,i) {
      	return that.metaData["priorities"][i]["item-color"]
      })
      
      .attr("width",this.x.rangeBand())
      .attr("height", function(d,i) {
          return that.height -that.y(d);
      });

}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
BarVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){
    // TODO: call wrangle function
    this.wrangleData(function(d){ return d.time >= selectionStart && d.time<= selectionEnd});
    this.updateVis();


}


/*
*
* ==================================
* From here on only HELPER functions
* ==================================
*
* */



/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */
BarVis.prototype.filterAndAggregate = function(_filter){


    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    
    var dateFormatter = d3.time.format("%Y-%m-%d");
    var filters = function(){return true;}
    if (_filter != null){
        filters = _filter;
    }

    //Dear JS hipster, a more hip variant of this construct would be:
    // var filter = _filter || function(){return true;}

    var that = this;

    var count = 0;
    // create an array of values for age 0-100
    var res = d3.range(16).map(function () {
        return 0;
    });
    
   
   
    // accumulate all values that fulfill the filter criterion
    
    // TODO: implement the function that filters the data and sums the values
    var filtered = that.data.filter(function(d) { return filters(d)});
    filtered.forEach(function(d){
         d.prios.forEach(function(j,i){
             	res[i] +=j
         })
     })
    return res;



}



