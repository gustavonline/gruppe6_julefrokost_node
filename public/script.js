let dataset = [{}];

d3.json("/api/allfood", {
    method: "GET", 
  }).then(function(response) {
    const data = response.data // Henter data fra query i main.js
    // TODO: Brug data til en d3.js visualisering
    dataset = data

// Datasæt & sortering
function compareFunction (a, b) {
     return a.value - b.value;
};
data.sort(compareFunction);


const presetsKnapper = ["Traditionel julefrokost","Vegans Julefrokost","co2 Julefrokost"];

//presets knappppper 
const presets = d3.selectAll(".presets")
presets.selectAll("button")
    .data(presetsKnapper)
    .enter()
    .append("button")
    .classed("presets-btn", true)
    .text(d => d)
    //.on("click", dataset.push(presetsKnapperData));


// width & height & margin
const margin = {top: 20, right: 30, bottom: 40, left: 90};
const w = 1000 - margin.left - margin.right;
const h = 1000 - margin.top - margin.bottom;

// Create SVG element
const svg = d3.selectAll(".barchart-container")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .classed("axis-element", "true")
    .attr("transform", "translate("+ margin.left + "," + margin.top + ")");

// X-axis    
const xScale = d3.scaleLinear()
    .rangeRound([0, w])
    .domain([0, d3.max(data, function(data) {
        return data.co2_aftryk;}) + 5]);

svg.append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10, 0)rotate(-45)")
    .style("text-anchor", "end")
    .classed("x-axis-text", "true")

// Y-axis
const yScale = d3.scaleBand()
    .range([0, h])
    .domain(data.map(function(data) {
        return data.food_name;}))
    .padding(0.4)

svg.append("g")
    .classed("y-axis-text", "true")
    .call(d3.axisLeft(yScale));

// Create Bars
const bars = svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", xScale(0))
    .attr("y", function(d) { return yScale(d.food_name); })
    .attr("width", function(d) {
        return xScale(d.co2_aftryk)})
    .attr("height", yScale.bandwidth())
    .attr("rx", 15)
    .attr("id", "bar")

// create labels på bar ift value
svg.selectAll("text.label")
    .data(data)
    .enter()
    .append("text")
    .text(function(d) { return d.co2_aftryk; })
    .attr("x", function(d) {
        return xScale(d.co2_aftryk) + 10})
    .attr("y", function(d) { return yScale(d.food_name) + 40; })
    .attr("class", "label") // Husk class på nye labels
    .attr("font-size", "20px")
    .attr("fill", "white");

// create emoji labels
svg.selectAll("emoji")
    .data(data)
    .enter()
    .append("text")
    .text(function(d) { return d.emoji; })
    .attr("x", 15)
    .attr("y", function(d) { return yScale(d.food_name) + 31; })
    .attr("class", "emoji") // Husk class på nye labels
    .attr("font-size", "25px")
    .attr("fill", "white");

// Const for at definere y-akse elementer
const yaxistext = d3.selectAll(".y-axis-text")
const tick = yaxistext.selectAll(".tick")

// fjerner små lillediller på y-aksen
tick.selectAll("line")
    .remove()

/* const path = yaxistext.selectAll("path")
    path.remove()*/ // vi ved ikke hvad det gør 

// const for at definere x-akse elementer
const axiselement = d3.selectAll(".axis-element")
const g = axiselement.selectAll("g")
const tickaxiselement = g.selectAll(".tick")

// fjerner små lillediller på x-aksen
tickaxiselement.selectAll("line")
        .remove()
    
//fjerner x-aksen-linje
const domain = g.selectAll(".domain")
    .remove()

//fjerner x-aksen-tal
const xaxistick = g.selectAll(".x-axis-text")
    .remove();

});