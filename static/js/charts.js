function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select('#selDataset');

  // Use the list of sample names to populate the select options
  d3.json('samples.json').then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector.append('option').text(sample).property('value', sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel
function buildMetadata(sample) {
  d3.json('samples.json').then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    PANEL.html('');

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append('h6').text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json('samples.json').then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with
    // the desired sample number.
    var resultArray = samples.filter((sampleObj) => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    console.log(result);

    //=======================================================//
    //  BAR CHART - DELIVERABLE 1
    //=======================================================//

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // NOTE: the arrays are sorted based on the sample_values which are in descending order.
    //    To show up with the smallest bar at the bottom and the largest at top,
    //    the values need to be reversed, after the top 10 are sliced out.
    var otu_ids = result.otu_ids.slice(0, 10).reverse();
    var otu_labels = result.otu_labels.slice(0, 10).reverse();
    var sample_values = result.sample_values.slice(0, 10).reverse();

    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_values);

    // 7. Create the yticks for the bar chart.
    var yticks = otu_ids.map((value) => 'OTU ' + value);

    console.log(yticks);

    // 8. Create the trace for the bar chart.

    var barTrace = {
      x: sample_values,
      y: yticks,
      text: otu_labels,
      type: 'bar',
      orientation: 'h',
    };

    var barData = [barTrace];

    // 9. Create the layout for the bar chart.
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      paper_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 25, r: 25, l: 25, b: 25 },
    };

    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bar', barData, barLayout);

    //=======================================================//
    //  BUBBLE CHART - DELIVERABLE 2
    //=======================================================//

    // 1. Create the trace for the bubble chart.
    // For this chart we want to use all the samples.
    otu_ids = result.otu_ids;
    otu_labels = result.otu_labels;
    sample_values = result.sample_values;

    var bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        colorscale: 'Earth',
        size: sample_values.map((num) => num * 0.7),
        //size: sample_values,
        //        sizemode: 'area',
      },
    };

    var bubbleData = [bubbleTrace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      paper_bgcolor: 'rgba(0,0,0,0)',
      xaxis: {
        title: {
          text: 'OTU ID',
        },
      },
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    //=======================================================//
    //  GUAGE CHART - DELIVERABLE 3
    //=======================================================//

    // Create a variable that holds the samples array.
    // Use the 'samples' variable that was set in D1.

    // Create a variable that filters the samples for the object with the desired sample number.
    // Use the 'resultArray' variable that was set in D1.

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var metadataArray = metadata.filter((sampleObj) => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    // Use the 'result' variable that was set in D1.

    // 2. Create a variable that holds the first sample in the metadata array.
    var metadata = metadataArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    // Use the variables that were reset in D2 to hold all the sample data for the first volunteer.

    // 3. Create a variable that holds the washing frequency.
    wfreq = parseFloat(metadata.wfreq);
    console.log(wfreq);

    // Create the yticks for the bar chart.
    // See D2 above for this code.

    // 4. Create the trace for the gauge chart.
    var guageTrace = {
      value: wfreq,
      type: 'indicator',
      mode: 'gauge+number',
      title: {
        text: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
      },
      gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: 'black' },
        bar: { color: 'black' },
        borderwidth: 2,
        bordercolor: 'black',
        steps: [
          { range: [0, 2], color: 'red' },
          { range: [2, 4], color: 'orange' },
          { range: [4, 6], color: 'yellow' },
          { range: [6, 8], color: 'lightgreen' },
          { range: [8, 10], color: 'green' },
        ],
      },
    };

    var gaugeData = [guageTrace];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 25, r: 25, l: 25, b: 25 },
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
