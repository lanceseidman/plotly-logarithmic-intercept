// Setup variables for storage...
var fails_x = [];
var fails_y = [];
var fail_total;
var d3 = Plotly.d3;

const lineIntercepts = (() => {
	const Point = (x, y) => ({x, y});
	const Line = (p1, p2) => ({p1, p2});
	const Vector = line => Point(line.p2.x - line.p1.x, line.p2.y - line.p1.y);
	function interceptSegs(line1, line2) {
		const a = Vector(line1), b = Vector(line2);
		const c = a.x * b.y - a.y * b.x;
		if (c) {
			const e = Point(line1.p1.x - line2.p1.x, line1.p1.y - line2.p1.y);
			const u = (a.x * e.y - a.y * e.x) / c;
			if (u >= 0 && u <= 1) {
				const u = (b.x * e.y - b.y * e.x) / c;
				if (u >= 0 && u <= 1) {
					return Point(line1.p1.x + a.x * u, line1.p1.y + a.y * u);
				}
			}
		}
	}	
	const PointFromTable = (t, idx) => Point(t.x[idx], t.y[idx]);
	const LineFromTable = (t, idx) => Line(PointFromTable(t, idx++), PointFromTable(t, idx));
	return function (table1, table2) {
		const results = [];
		var i = 0, j;
		while (i < table1.x.length - 1) {
			
			const line1 = LineFromTable(table1, i);
			j = 0;
			while (j < table2.x.length - 1) {
				const line2 = LineFromTable(table2, j);
				const point = interceptSegs(line1, line2);
				if (point) { 
					results.push({
						description: `'${table1.name}' line seg index ${i}-${i+1} intercepts '${table2.name}' line seg index ${j} - ${j+1}`,
						x: point.x,
						y: point.y,
					});
				}
				j ++;
			}
			i++;
		}
		if (results.length) { // If results have a length, an issue exists...
      // Output errors for Debug/Development purposes...
      $("#results").append("Found " + results.length + " intercepts for '" + table1.name + "' and '" + table2.name+" and intersect at: <br><br>");
      
      // Setup JSON for easy access to values...
      var incoming = JSON.stringify(results);
      var myObj = JSON.parse(incoming);

      // Setup loop for creating storage...
      for(var i=0; i < results.length; i++){
      	$("#results").append("x: " +myObj[i].x+", y: " +myObj[i].y+"<br>"); // Show where issues are on X,Y Coordinates...
        fails_x = fails_x + myObj[i].x + ', '; // Create storage for X Values...
        fails_y = fails_y + myObj[i].y + ', '; // Create storage for Y Values...
        fail_total = myObj.length; // Set total of issues found...
      }
			return results; // Return the results...
    } 
    // Output that no issues found for Debug/Development purposes...
    $("#results").append("<br><b>No issues Found with: <br></b> "+table1.name+" and "+table2.name+"<br>");
	}
})();

// Setup Line Variables...
var Test = {
  x: [8043, 10695, 13292, 17163, 20716, 25270, 28874, 35629, 43421, 58331, 76015, 83349, 63959, 47610, 39066, 31659, 27708, 22714, 18819, 14575, 11727, 8819, 8043],
  y: [1000,   274,   100,  27.4,    10,  2.74,     1, 0.274, 0.100, 0.027, 0.010, 0.010, 0.027, 0.100, 0.274,     1,  2.74,    10,  27.4,   100,   274, 1000, 1000],
  fill: 'tonextx',
  type: 'scatter',
  name: 'ITEM 1'
};

var Test2 = {
  x: [7579, 10063, 12491, 16081, 19408, 23763, 27168, 33569, 40981, 55066, 71727, 78647, 60378, 44935, 36808, 29789, 26056, 21280, 17632, 13696, 11034, 8310, 7579],
  y: [1000,   274,   100,  27.4,    10,  2.74,     1, 0.274, 0.100, 0.027, 0.010, 0.010, 0.027, 0.100, 0.274,     1,  2.74,    10,  27.4,   100,   274, 1000, 1000],
  fill: 'tozeroy',
  type: 'scatter',
  name: 'ITEM 2',
};

var Test3 = {
  x: [4700,  5943,  7143,  8841, 10366, 13452, 16604, 21777, 26540, 32606, 38335, 42034, 35752, 29100, 23878, 18205, 14750, 11366,  9694,  7832,  6516, 5153, 4700],
  y: [1000,   274,   100,  27.4,    10,  2.74,     1, 0.274, 0.100, 0.027, 0.010, 0.010, 0.027, 0.100, 0.274,     1,  2.74,    10,  27.4,   100,   274, 1000, 1000],
  fill: 'tozeroy',
  type: 'scatter',
  name: 'ITEM 3'
};

// Run the tests on page load...
var res1 = lineIntercepts(Test, Test2);   
var res2 = lineIntercepts(Test, Test3);    
var res3 = lineIntercepts(Test2, Test3);  

// Store values for X,Y to later become a Cookie...
var final_x = fails_x.replace(/,\s*$/, "");
var final_y = fails_y.replace(/,\s*$/, "");

// Create Cookie for JS to have PHP Grab it...
/*createCookie("xVal", final_x, "10"); 
createCookie("yVal", final_y, "10"); */

// JS Create a Cookie...
/*function createCookie(name, value, days) { 
    var expires; 
      
    if (days) { 
        var date = new Date(); 
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); 
        expires = "; expires=" + date.toGMTString(); 
    } 
    else { 
        expires = ""; 
    } 
      
    document.cookie = escape(name) + "=" +  
        escape(value) + expires + "; path=/"; 
} */

// Setup for failed lines...
var failPoints = {
  x: [8043,8310], // Use PHP+JS to get Cookie for X Values...
  y: [1000,1000], // Use PHP+JS to get Cookie for Y Values...
  fill: 'toself',
  type: 'scatter',
  line: {color: '#000'},
  name: 'Fail Points',
  mode: 'markers',
  cliponaxis: false,
  marker: {
    color: 'red',
    symbol: 'circle-open-dot',
    size: 20,
  }
};


var layout = {
   width: 540,
   font: {family: 'Verdana'},  // Sets global font type to Verdana.  Can be over-ridden below.
   height: 612,
   autosize: false,
   margin:{
   l:40,
   r:40,
   b:55,
   t:6,
   pad:0
   },
   
   legend: {
   	font: {size: 9},
      xref:'paper',  // 'paper' or 'container'
      yref:'paper',
      xanchor:'left',
      yanchor:'bottom',
      x: -0.004,
      y: -0.004,
      borderwidth: 2,
      bgcolor: 'rgba(0,0,0,0)',
   },
  
  xaxis: {
    type: 'log',
    range: [3,5],  // Log Range.  10^n
    linewidth: 2,
    gridwidth: 1,
    dtick: 'D1',
    showline: true,
    mirror: 'ticks',
    tickfont: {size:8},
    title: 'CURRENT (Amps)',
    titlefont: {size: 9}
  },
  
  yaxis: {
    autotick: false,
    type: 'log',
    range: [-2,3],  // Log Range.  10^n
    linewidth: 2,
    gridwidth: 1,
    dtick: 'D1',  // dtick = "delta tick" aka distance b/w ticks.  Enter number or syntax code.  D1 = all ticks.  D2 = 2 & 5 only. 
    showline: true,
    mirror: 'ticks',
    tickfont: {size:8},
    title: 'TIME (Seconds)',
    titlefont: {size: 9}
  },


annotations: [
	{
    text: 'Coordination to 0.1  sec.',
    xref: 'paper',
    yref: 'paper',
    xanchor: 'center',
    yanchor: 'middle',
    x: 1.035,
    y: 0.2,
    ax:0,
    ay:-120,
    borderpad: 5,
    textangle: 270,
    font: {size: 8},
    arrowhead: 0,    
    arrowsize: 1,
    arrowwidth: 1,
  },
  {
    text: 'Coordination to 0.01 sec.',
    xref: 'paper',
    yref: 'paper',
    xanchor: 'center',
    yanchor: 'middle',
    x: 1.06,
    y: 0,
    ax:0,
    ay:-231,
    borderpad: 5,
    textangle: 270,
    font: {size: 8},
    arrowhead: 0,
    arrowsize: 1,
    arrowwidth: 1,
  },
  { // OPPOSITE ARROW FOR 0.1 sec.
    xref: 'paper',
    yref: 'paper',
    xanchor: 'center',  // left center right
    yanchor: 'middle',  // top middle bottom
    x: 1.035,
    y: 1,
    ax:0,
    ay:275,
    arrowhead: 2,
    arrowsize: 1,
    arrowwidth: 1,
  },
  { // OPPOSITE ARROW FOR 0.01 sec.
    xref: 'paper',
    yref: 'paper',
    xanchor: 'center',  // left center right
    yanchor: 'middle',  // top middle bottom
    x: 1.06,
    y: 1,
    ax:0,
    ay:275,
    arrowhead: 2,
    arrowsize: 1,
    arrowwidth: 1,
  },
  { // HORIZONTAL LINE AT TOP OF ARROW LINES
    xref: 'paper',
    yref: 'paper',
    xanchor: 'center',  // left center right
    yanchor: 'middle',  // top middle bottom
    x: 1.01,
    y: 1,
    ax:40,
    ay:0,
    arrowhead: 0,
    arrowsize: 1,
    arrowwidth: 1,
  },
  { // HORIZONTAL LINE AT BOTTOM OF 0.01 SEC. LINE
    xref: 'paper',
    yref: 'paper',
    xanchor: 'center',  // left center right
    yanchor: 'middle',  // top middle bottom
    x: 1.01,
    y: 0,
    ax:27,
    ay:0,
    arrowhead: 2,
    arrowsize: 1,
    arrowwidth: 1,
  },
  { // HORIONTAL LINE AT BOTTOM OF 0.1 SEC. LINE
    xref: 'paper',
    yref: 'paper',
    xanchor: 'center',  // left center right
    yanchor: 'middle',  // top middle bottom
    x: 1.01,
    y: 0.2,
    ax:16,
    ay:0,
    arrowhead: 2,
    arrowsize: 1,
    arrowwidth: 1,
  },  
  
  	{
    text: 'BACKGROUND TEXT FOR WATERMARKING',
    xref: 'paper',
    yref: 'paper',
    xanchor: 'center',
    yanchor: 'middle',
    x: 0.5,
    y: 0.5,
    font: {size: 36, color: 'rgba(0,0,0,0.03)'},
    showarrow: false,
  },

],
};
var data = [Test, Test2, Test3, failPoints];
Plotly.newPlot('myDiv', data,layout);
