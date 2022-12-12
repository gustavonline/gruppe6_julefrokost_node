


// datasæt og api-kald fra main.js    
d3.json("/api/allfood", {
    method: "GET", 
  }).then(function(response) {
    const traditionelJulefrkost = response.julefrokost;
    const veganskjulefrkost = response.veganskjulefrkost;
    const co2neutraljulefrokost = response.co2neutraljulefrokost;
    const hovedretPresetData = response.hovedret; // Henter data fra query i main.js

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

// tomt dataset til push funtion
var dataset = [{}];
console.log(dataset);

//presets knapper
const presetsKnapper = ["Den Traditionel","Den Veganske","Den Co2-venlige"];

const presets = d3.selectAll(".presets")
presets.selectAll("button")
    .data(presetsKnapper)
    .enter()
    .append("button")
    .classed("presets-btn", true)
    .text(d => d)
    .attr("id", d => d)
    // funtion der afgøre hvilken et datasæt der skal tildeles den korrekte knap - her er det vigtigt at huske at bruge 'event' selvom den ikke bliver brugt i funktionen - derudover kan man debugge med console.log for at se om knappen rent faktisk hænger sammen med datasættet
    .on("click", function(event, presetData) {
        dataset.pop();
        console.log(dataset);
        if (presetData === "Den Traditionel") {
            dataset.push(traditionelJulefrkost);
        }
        else if (presetData === "Den Veganske") {
            dataset.push(veganskjulefrkost);
        }
        else if (presetData === "Den Co2-venlige") {
            dataset.push(co2neutraljulefrokost);
        }
        console.log(dataset);
        update(dataset[0]);
    });


// update function til at indsætte data i barchart ved klik på knap
function update(data) {

// sorterings funtion til at sortere data efter co2_aftryk
function compareFunction (a, b) {
     return a.co2_aftryk - b.co2_aftryk;
};
data.sort(compareFunction);

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

// create labels på bar ift value (co2_aftryk) og .tween for at få animation på labels --> https://educationalresearchtechniques.com/2019/05/29/tweening-with-d3-js/
const textLabel = svg.selectAll("text.label")
    .data(data)
    .join("text")
    .attr("y", function(d) { return yScale(d.shortenfood_name) + 30; })
    .transition()
    .duration(2000)
    .tween("text", function(d, i) {
        var currentValue = d3.select(this).text();
        return function(t) {
            this.textContent = d3.interpolateNumber(currentValue,d.co2_aftryk)(t).toFixed(2);}
        })
    // .text(function(d) { return d.co2_aftryk; })
    .attr("x", function(d) {
        return xScale(d.co2_aftryk) + 10})
    .attr("class", "label") // Husk class på nye labels
    .attr("font-size", "20px")
    .attr("fill", "white");

// create emoji og .styleTween for at få animation på labels --> https://educationalresearchtechniques.com/2019/05/29/tweening-with-d3-js/
svg.selectAll("text.emoji")
    .data(data)
    .join("text")
    .attr("x", 15)
    .attr("y", function(d) { return yScale(d.shortenfood_name) + 30; })
    .attr("class", "emoji") // Husk class på nye labels
    .text(function(d) {return d.emoji;})
    .transition()
    .duration(2000)
    .styleTween("font", function() {
        return d3.interpolate(0, "25px arial")
    })
    

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

//hovedret knapper
    const hovedretContainer = d3.selectAll(".hovedret")
    hovedretContainer.selectAll("button")
        .data(hovedretPresetData)
        .enter()
        .append("button")
        .classed("hovedretKnapper", true)
        .text(d => d.shortenfood_name)
        .attr("id", d => d.shortenfood_name)
        // .on("click", function(event,d) {
        //     dataset.push(d);
        //     update(dataset);
        //     dataset.pop(d);
        // })
    
    // hovedretKnapper.selectAll("text")
    //     .data(hovedretPresetData)
    //     .enter()
    //     .append("text")
    //     .text(function(d) {return d.emoji;})

}
// kalder update function udenfor tuborg-klammer (VIGTIGT) med start data traditioneljulefrokost
update(traditionelJulefrkost);

});
