


// datasæt og api-kald fra main.js    
d3.json("/api/allfood", {
    method: "GET", 
  }).then(function(response) {
    const allFoodData = response.data; // Henter data fra query i main.js

    const dummy_data = [
        {food_name: "Kalkun", co2_aftryk: 1.5, emoji: "🦃"},
        {food_name: "Rødkål", co2_aftryk: 0.5, emoji: "🥬"},
        {food_name: "Risengrød", co2_aftryk: 0.3, emoji: "🍚"},
    ]

// Datasortering i rækkefølge

function compareFunction (a, b) {
     return a.co2_aftryk - b.co2_aftryk;
};
allFoodData.sort(compareFunction);

// width & height & margin
const margin = {top: 20, right: 30, bottom: 40, left: 90};
const w = 1000 - margin.left - margin.right;
const h = 600 - margin.top - margin.bottom;

// Create SVG element
const svg = d3.selectAll(".barchart-container")
    .append("svg")
    .attr("width", 1150 + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .classed("axis-element", "true")
    .attr("transform", "translate("+ margin.left + "," + margin.top + ")");

// update function
function update(data) {
    


// X-axis
const xScale = d3.scaleLinear()
    .rangeRound([0, w])
    .domain([0, d3.max(data, function(data) {
        return data.co2_aftryk; })]);

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
    .domain(data.map(function(d) {
        return d.food_name;}))
    .padding(0.4);

svg.append("g")
    .classed("y-axis-text", "true")
    .call(d3.axisLeft(yScale));
    

// Create Bars
var bars = svg.selectAll("rect")
    .data(data)

bars
    .join("rect")
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
    .join("text")
    .text(function(d) { return d.co2_aftryk; })
    .attr("x", function(d) {
        return xScale(d.co2_aftryk) + 10})
    .attr("y", function(d) { return yScale(d.food_name) + 30; })
    .attr("class", "label") // Husk class på nye labels
    .attr("font-size", "20px")
    .attr("fill", "white");

// create emoji labels
svg.selectAll("text.emoji")
    .data(data)
    .join("text")
    .text(function(d) { return d.emoji; })
    .attr("x", 15)
    .attr("y", function(d) { return yScale(d.food_name) + 30; })
    .attr("class", "emoji") // Husk class på nye labels
    .attr("font-size", "25px");

// Const for at definere y-akse elementer
const yaxistext = d3.selectAll(".y-axis-text")
const tick = yaxistext.selectAll(".tick")

// fjerner små lillediller på y-aksen
tick.selectAll("line")
    .remove()

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

}
update(dummy_data);

//presets knappppper 
const presetsKnapper = ["Traditionel julefrokost","Vegans Julefrokost","co2 Julefrokost"];

const presets = d3.selectAll(".presets")
presets.selectAll("button")
    .data(presetsKnapper)
    .enter()
    .append("button")
    .classed("presets-btn", true)
    .text(d => d)
    .attr("id", d => d)
    .on("click", function() {
        return update(allFoodData)
    });

});
