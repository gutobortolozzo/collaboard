
function Chart(){
	
	MAX_DATE = 9999999999999;
	MONTH = 2628000000;
	YEAR = 12 * MONTH;
	
	function showTooltip(x, y, contents) {
		$('<div id="tooltip">' + contents + '</div>').css({
			top : y - 16,
			left : x + 20
		}).appendTo('body').fadeIn();
	}
	
	function mediumVotes(notes) {
	
		var votes = 0;
	
		notes.forEach(function(note) {
			votes += note.votes;
		});
	
		return Math.floor(votes / notes.length);
	}
	
	function splitByMonth(notes) {
	
		var byMonth = [];
	
		notes.forEach(function(note) {
			var creation = new Date(note.id);
			if (!byMonth[creation.getMonth()])
				byMonth[creation.getMonth()] = [];
			byMonth[creation.getMonth()].push(note);
		});
	
		return byMonth;
	}
	
	function createGraphElements(notes) {
	
		var splited = splitByMonth(notes);
	
		var elements = [];
	
		$.each(splited, function(key, value) {
			if (!value)return;
			var baseNote = value[0];
			elements.push({
				data : [ [ new Date(baseNote.id).getTime() + MONTH, value.length ] ],
				color : baseNote.color,
				points : {
					radius : mediumVotes(value),
					fillColor : baseNote.color
				}
			});
		});
	
		return elements;
	}
	
	this.build = function(data) {
	
		var bad = [];
		var good = [];
		var suggestion = [];
		
		var startChartDate = MAX_DATE;
		
		data.forEach(function(note) {
			if(note.id < startChartDate) startChartDate = note.id; 
			
			if (note.color == "#FF6347") {
				bad.push(note);
			}
			if ([ "#71C671", "#BDFCC9" ].indexOf(note.color) !== -1) {
				good.push(note);
			}
			if ([ "#FFA500", "#ffc300", "#FFEC8B" ].indexOf(note.color) !== -1) {
				suggestion.push(note);
			}
		});
		
		var graphData = [];
	
		var map = function(element) {
			graphData.push(element);
		};
	
		createGraphElements(suggestion).forEach(map);
		createGraphElements(good).forEach(map);
		createGraphElements(bad).forEach(map);
	
		plotGraph(graphData, startChartDate);
	};
	
	function plotGraph(graphData, startChartDate) {
	
		$.plot($('#graph-lines'), graphData, {
			series : {
				points : {
					show : true,
					radius : 5
				},
				lines : {
					show : true
				},
				shadowSize : 0
			},
			grid : {
				color : '#ffffff',
				borderColor : 'transparent',
				borderWidth : 10,
				hoverable : true
			},
			xaxis : {
				mode : "time",
				tickSize : [ 1, "month" ],
				min : startChartDate ,
				max : startChartDate + YEAR
			},
			yaxis : {
				tickSize : graphData.length / 2
			}
		});
	
		$('#lines').on('click', function(e) {
			$('#bars').removeClass('active');
			$(this).addClass('active');
			$('#graph-lines').fadeIn();
			e.preventDefault();
		});
	
		var previousPoint = null;
	
		$('#graph-lines')
				.bind('plothover',function(event, pos, item) {
					if (item) {
						if (previousPoint != item.dataIndex) {
							previousPoint = item.dataIndex;
							$('#tooltip').remove();
							var x = item.datapoint[0], y = item.datapoint[1];
							showTooltip(item.pageX, item.pageY, y+ ' note(s) on '+ new Date(x - MONTH).toLocaleDateString());
						}
					} else {
						$('#tooltip').remove();
						previousPoint = null;
					}
				});
		}
}