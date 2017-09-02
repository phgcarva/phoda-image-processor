function drawChart(data) {
	google.charts.load("current", {packages:["corechart"]});
	google.charts.setOnLoadCallback(function() {
		var googleData = google.visualization.arrayToDataTable(data);

		var options = {
			title: 'Frequency of shades of gray',
			
			histogram: {
				bucketSize: 1,
				maxNumBuckets: 255,
				minValue: 0,
				maxValue: 255
			},

			chartArea: { width: 401 },
			hAxis: {
				ticks: [0, 50, 100, 150, 200, 250]
			},
			bar: { gap: 0 },
		};

		document.querySelector('.chart-div').classList.remove('hidden')
		var chart = new google.visualization.Histogram(document.querySelector('.chart-div'));

		chart.draw(googleData, options);
	})
	
}

var showHistogram = function () {
	window.opt = 2;
	var histogramContainer = document.querySelector('.histogram-container')
	var imageContainer = document.querySelector('.filter-container')

	Object.assign(document.querySelector('.histogram-container').style,{display:"block"});

	if (!imageContainer.classList.contains('hidden')){
		imageContainer.classList.add('hidden')
		document.querySelector('.canvas').classList.add("hidden")
	} 
	if (histogramContainer.classList.contains('hidden')){
		histogramContainer.classList.remove('hidden')
	}

}

var greyHistogram = function () {
	
	img = document.querySelector(".image-container .img")

	if (img.src){
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext("2d")

		ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
		
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

		var data = [["Color"]]
		var histogram = {}
		for (var i = 0; i < imageData.data.length; i += 4) {
			var mean = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2])/3
			data.push([Math.floor(mean)])
		}
		drawChart(data)
	}
}

var globalHistogramEq = function() {
	var img = document.querySelector(".image-container .img")
	if(img){
	    var srcLength = img.src.length;
	    var src = img.src
	    var dst = src;

	    // Compute histogram and histogram sum:
	    var hist = new Float32Array(256);
	    var sum = 0;
	    for (var i = 0; i < srcLength; ++i) {
	        ++hist[~~src[i]];
	        ++sum;
	    }

	    // Compute integral histogram:
	    var prev = hist[0];
	    for (var i = 1; i < 256; ++i) {
	        prev = hist[i] += prev;
	    }

	    // Equalize image:
	    var norm = 255 / sum;
	    for (var i = 0; i < srcLength; ++i) {
	        dst[i] = hist[~~src[i]] * norm;
	    }
	    
	    var canvas = document.querySelector(".canvas")
	    var ctx = canvas.getContext("2d")
		
		data = ctx.getImageData(0, 0, canvas.width, canvas.height)
		data.data.set(new Uint8ClampedArray(dst));

	    ctx.putImageData(data, 0, 0)
	    if (document.querySelector(".canvas").classList.contains("hidden"))
	    	document.querySelector(".canvas").classList.remove("hidden")
	}
}