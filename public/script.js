


// datasæt og api-kald fra main.js    
d3.json("/api/allfood", {
    method: "GET", 
  }).then(function(response) {
    const traditionelJulefrkost = response.julefrokost;
    const veganskjulefrkost = response.veganskjulefrkost;
    const co2neutraljulefrokost = response.co2neutraljulefrokost; // Henter data fra query i main.js

// Kronologisk datasortering laveste først

function compareFunction (a, b) {
     return a.co2_aftryk - b.co2_aftryk;
};
traditionelJulefrkost.sort(compareFunction);
veganskjulefrkost.sort(compareFunction);
co2neutraljulefrokost.sort(compareFunction);

// Definerer width & height & margin
const margin = {top: 20, right: 30, bottom: 40, left: 110};
const w = 1000 - margin.left - margin.right;
const h = 600 - margin.top - margin.bottom;

// laver SVG element i div med class "barchart-container"
const svg = d3.selectAll(".barchart-container")
    .append("svg")
    .attr("width", 1150 + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .classed("axis-element", "true")
    .attr("transform", "translate("+ margin.left + "," + margin.top + ")");

// update function til at indsætte data i barchart ved klik på knap
function update(data) {

// update selection for at fjerne alt gammel data på y-akse når funktionen ovenover bliver kaldt
const updateSelection = d3.selectAll(".y-axis-text")
updateSelection.remove();

// X-scale & X-axis ved at append g til svg elementet
const xScale = d3.scaleLinear()
    .rangeRound([0, w])
    .domain([0, d3.max(data, function(data) {
        if (data.co2_aftryk < 5) {
            return 4;
        }
        else if (data.co2_aftryk > 150) {
            return 200;
        }
    })]);

svg.append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10, 0)rotate(-45)")
    .style("text-anchor", "end")
    .classed("x-axis-text", "true")

// y-scale & y-axis ved at append g til svg elementet
const yScale = d3.scaleBand()
    .range([0, h])
    .domain(data.map(function(d) {
        return d.shortenfood_name;}))
    .padding(0.4);

svg.append("g")
    .classed("y-axis-text", "true")
    .call(d3.axisLeft(yScale));
    

// konstaterer bars og append rect til svg elementet med data
var bars = svg.selectAll("rect")
    .data(data)

// definerer attributter til bars og kalder .join i stedet for .enter for at data kan opdateres
bars
    .join("rect")
    .attr("x", xScale(0))
    .attr("y", function(d) { return yScale(d.shortenfood_name); })
    .attr("height", 45)
    .transition()
    .duration(2000)
    .attr("width", function(d) {
        return xScale(d.co2_aftryk)})
    .attr("rx", 15)
    .attr("id", "bar")

// create labels på bar ift value (co2_aftryk)
svg.selectAll("text.label")
    .data(data)
    .join("text")
    .attr("y", function(d) { return yScale(d.shortenfood_name) + 30; })
    .transition()
    .duration(2000)
    .text(function(d) { return d.co2_aftryk; })
    .attr("x", function(d) {
        return xScale(d.co2_aftryk) + 10})
    .attr("class", "label") // Husk class på nye labels
    .attr("font-size", "20px")
    .attr("fill", "white");

// create emoji
svg.selectAll("text.emoji")
    .data(data)
    .join("text")
    .text(function(d) { return d.emoji; })
    .attr("x", 15)
    .attr("y", function(d) { return yScale(d.shortenfood_name) + 30; })
    .attr("class", "emoji") // Husk class på nye labels
    .attr("font-size", "25px");

// Const for at "fange" y-akse elementer
const yaxistext = d3.selectAll(".y-axis-text")
const tick = yaxistext.selectAll(".tick")

// til slut fjernes små ticks
tick.selectAll("line")
    .remove()

// const for at "fange" x-akse elementer
const axiselement = d3.selectAll(".axis-element")
const g = axiselement.selectAll("g")
const tickaxiselement = g.selectAll(".tick")

// til slut fjernes line
tickaxiselement.selectAll("line")
    .remove()
    
//fjerner x-aksen-linjer/domain
const domain = g.selectAll(".domain")
    .remove()

//fjerner x-akse-tal
const xaxistick = g.selectAll(".x-axis-text")
    .remove();

}
// kalder update function udenfor tuborg-klammer (VIGTIGT) med start data traditioneljulefrokost
update(traditionelJulefrkost);

//presets knapper
const presetsKnapper = ["Den Traditionel","Den Veganske","Den Co2-venlige"];

const presets = d3.selectAll(".grid1-item-2")
presets.selectAll("button")
    .data(presetsKnapper)
    .enter()
    .append("button")
    .classed("presets-btn", true)
    .text(d => d)
    .attr("id", d => d)
    // funtion der afgøre hvilken et datasæt der skal tildeles den korrekte knap - her er det vigtigt at huske at bruge 'event' selvom den ikke bliver brugt i funktionen - derudover kan man debugge med console.log for at se om knappen rent faktisk hænger sammen med datasættet
    .on("click", function(event, presetData) {
        console.log(presetData)
        if (presetData == "Den Traditionel") {
            update(traditionelJulefrkost);
        } else if (presetData == "Den Veganske") {
            update(veganskjulefrkost);
        }
        else if (presetData == "Den Co2-venlige") {
            update(co2neutraljulefrokost);
        }
    })
});
