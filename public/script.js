


// datasæt og api-kald fra main.js    
d3.json("/api/allfood", {
    method: "GET", 
  }).then(function(response) {
    var startTraditionelJulefrkost = response.julefrokost;
    console.log(startTraditionelJulefrkost);
    var veganskjulefrkost = response.veganskjulefrkost;
    var co2neutraljulefrokost = response.co2neutraljulefrokost;
    var hovedretPresetData = response.hovedret;
    console.log(hovedretPresetData);
    var traditioneljulefrokost = response.traditioneljulefrokost
    var forret = response.forret 
    var dessert = response.dessert
    var drikkevarer = response.drikkevarer // Henter data fra query i main.js

// Definerer width & height & margin
const margin = {top: 20, right: 30, bottom: 40, left: 95};
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

// tomt dataset
let dataset = [];

//tilbehør, hovedret, dessert og drikkevare knapper

const tilbehoerContainer = d3.selectAll("#tilbehør")
tilbehoerContainer.selectAll("button")
        .data(forret)
        .enter()
        .append("button")
        .text(d => d.shortenfood_name)
        .attr("id", d => d.shortenfood_name)
        .classed("optionknapper", true)
        .on("click", function(event, d) {
            //if button is  not clicked, add new data
            if (d3.select(event.target).classed("clicked") == false) {
            d3.select(event.target).classed("clicked", true);
            d => d.shortenfood_name;
            action("addSingle", d);
            action("update");
            }
            //if button is clicked, remove corresponding data
            else if (d3.select(event.target).classed("clicked") == true) {
            d3.select(event.target).classed("clicked", false);
            d => d.shortenfood_name;
            action("removeSingle", d);
            action("update");
            }
        });

const hovedretContainer = d3.selectAll("#hovedret")
hovedretContainer.selectAll("button")
        .data(hovedretPresetData)
        .enter()
        .append("button")
        .text(d => d.shortenfood_name)
        .classed("optionknapper", true)
        .attr("id", d => d.shortenfood_name)
        .on("click", function(event, d) {
            //if button is  not clicked, add new data
            if (d3.select(event.target).classed("clicked") == false) {
            d3.select(event.target).classed("clicked", true);
            d => d.shortenfood_name;
            action("addSingle", d);
            action("update");
            }
            //if button is clicked, remove corresponding data
            else if (d3.select(event.target).classed("clicked") == true) {
            d3.selectAll(event.target).classed("clicked" , false);
            d => d.shortenfood_name;
            action("removeSingle", d);
            action("update");
            }
        });

const dessertContainer = d3.selectAll("#dessert")
dessertContainer.selectAll("button")
        .data(dessert)
        .enter()
        .append("button")
        .text(d => d.shortenfood_name)
        .classed("optionknapper", true)
        .attr("id", d => d.shortenfood_name)
        .on("click", function(event, d) {
            //if button is  not clicked, add new data
            if (d3.select(event.target).classed("clicked") == false) {
            d3.select(event.target).classed("clicked", true);
            d => d.shortenfood_name;
            action("addSingle", d);
            action("update");
            }
            //if button is clicked, remove corresponding data
            else if (d3.select(event.target).classed("clicked") == true) {
            d3.selectAll(event.target).classed("clicked" , false);
            d => d.shortenfood_name;
            action("removeSingle", d);
            action("update");
            }
        });

const drikkevareContainer = d3.selectAll("#drikkevare")
drikkevareContainer.selectAll("button")
        .data(drikkevarer)
        .enter()
        .append("button")
        .text(d => d.shortenfood_name)
        .attr("id", d => d.shortenfood_name)
        .classed("optionknapper", true)
        .on("click", function(event, d) {
            //if button is  not clicked, add new data
            if (d3.select(event.target).classed("clicked") == false) {
            d3.select(event.target).classed("clicked", true);
            d => d.shortenfood_name;
            action("addSingle", d);
            action("update");
            }
            //if button is clicked, remove corresponding data
            else if (d3.select(event.target).classed("clicked") == true) {
            d3.select(event.target).classed("clicked", false);
            d => d.shortenfood_name;
            action("removeSingle", d);
            action("update");
            }
        });

//presets knapper
let presetsKnapper = ["Den Traditionel","Den Veganske","Den Co2-venlige"];

const presets = d3.selectAll(".presets")
presets.selectAll("button")
    .data(presetsKnapper)
    .enter()
    .append("button")
    .classed("presets-btn", true)
    .text(d => d)
    .attr("id", d => d)
    // funtion der afgøre hvilken et datasæt der skal tildeles den korrekte knap - her er det vigtigt at huske at bruge 'event' selvom den ikke bliver brugt i funktionen - derudover kan man debugge med console.log for at se om knappen rent faktisk hænger sammen med datasættet
    .on("click", function(event, d) {
        if (d == "Den Traditionel") {
            action("removeMultiple");
            action("addMultiple", traditioneljulefrokost);
            action("update");
        }
        else if (d == "Den Veganske") {
            action("removeMultiple");
            action("addMultiple", veganskjulefrkost);
            action("update");
        }
        else if (d == "Den Co2-venlige") {
            action("removeMultiple");
            action("addMultiple", co2neutraljulefrokost);
            action("update");
        };
    });

// update function til at indsætte data i barchart ved klik på knap
function update() {

// // update selection for at fjerne alt gammel data på y-akse når funktionen ovenover bliver kaldt
const updateSelection = d3.selectAll(".y-axis-text")
updateSelection.remove();

// // sorterings funtion til at sortere data efter co2_aftryk
function compareFunction (a, b) {
     return a.co2_aftryk - b.co2_aftryk;
};
startTraditionelJulefrkost.sort(compareFunction);

// X-scale, kan det tænkes anderledes så det ikke er en låst værdi?
var xScale = d3.scaleLinear()
    .domain([0, d3.max(startTraditionelJulefrkost, function(d) {
        if (d.co2_aftryk < 5) {
            return 4;
        }
        else if (d.co2_aftryk > 5 && d.co2_aftryk < 20) {
            return 15;
        }
        else if (d.co2_aftryk < 20) {
            return 20;
        }
        else if (d.co2_aftryk > 30 && d.co2_aftryk < 50) {
            return 60;
        }
        else if (d.co2_aftryk > 150) {
            return 200;
        }
    })])
    .range([0, w]);

// y-scale & y-axis ved at append g til svg elementet
const yScale = d3.scaleBand()
    .range([0, h])
    .domain(startTraditionelJulefrkost.map(function(d) {
        return d.shortenfood_name;}))
    .padding(0.4);

svg.append("g")
    .classed("y-axis-text", "true")
    .call(d3.axisLeft(yScale));
    

// konstaterer bars og append rect til svg elementet med data
const bars = svg.selectAll("rect")
    .data(startTraditionelJulefrkost)

// definerer attributter til bars og kalder .join i stedet for .enter for at data kan opdateres
bars
    .join(function(enter) {
        return enter.append("rect")
    },
    function(update) {
        return update

    },
    function(exit) {
        return exit.remove()
        .on("end", function() {
            d3.select(this).remove();
        });
    })
    .attr("x", xScale(0))
    .attr("y", function(d) { return yScale(d.shortenfood_name); })
    .attr("height", 45)
    .on("click", function(event) {
        var elmntToView = document.getElementById("section-2");
        elmntToView.scrollIntoView({
            block: 'start',
            behavior: 'smooth',
            inline: 'center'
          });
    })
    .transition()
    .duration(2000)
    .attr("width", function(d) {
        return xScale(d.co2_aftryk)})
    .attr("rx", 15)
    .attr("id", "bar");

// create labels på bar ift value (co2_aftryk) og .tween for at få animation på labels --> https://educationalresearchtechniques.com/2019/05/29/tweening-with-d3-js/
const textLabel = svg.selectAll("text.label")
    .data(startTraditionelJulefrkost)
    .join("text")
    .attr("y", function(d) { return yScale(d.shortenfood_name) + 30; })
    .transition()
    .duration(2000)
    .tween("text", function(d, i) {
        var currentValue = d3.select(this).text();
        return function(t) {
            this.textContent = d3.interpolateNumber(currentValue,d.co2_aftryk)(t).toFixed(2);
        }
    })
    // .text(function(d) { return d.co2_aftryk; })
    .attr("x", function(d) {
        return xScale(d.co2_aftryk) + 10})
    .attr("class", "label") // Husk class på nye labels
    .attr("font-size", "20px")
    .attr("fill", "white");

// create emoji og .styleTween for at få animation på labels --> https://educationalresearchtechniques.com/2019/05/29/tweening-with-d3-js/
svg.selectAll("text.emoji")
    .data(startTraditionelJulefrkost)
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
const Updatexaxistick = d3.selectAll(".x-axis-text")
Updatexaxistick.remove();

// udregning af total co2 i datasettet
const totalCo2data = [1]
var totalCo2_aftryk = d3.sum(startTraditionelJulefrkost, (d => d.co2_aftryk));
console.log(totalCo2_aftryk);
const totalco2Container = d3.select(".totalco2container").selectAll("text")
    .data(totalCo2data)
    .join(function(enter) {
        return enter.append("text")
    },
    function(update) {
        return update

    },
    function(exit) {
        return exit.remove()
        .on("end", function() {
            d3.select(this).remove();
        });
    })
    .append("text")
    .text(totalCo2_aftryk)
    .classed("totaltco2-text", true)
    .transition()
    .duration(2000)
    .tween("text", function(d, i) {
        return function(t) {
            this.textContent = d3.interpolateNumber(0,totalCo2_aftryk)(t).toFixed(2);}
        })

}

// action function til at kalde på add, remove og update på knapper
function action(type, datatype) {
    switch(type) {
    case "addMultiple":
//spread operator til at tilføje flere elementer i array HUSK ... foran datatype ellers fejler array opbygning
        startTraditionelJulefrkost.push(...datatype)
        console.log(startTraditionelJulefrkost)
        break;
    case "addSingle":
        startTraditionelJulefrkost.push(datatype)
        console.log(startTraditionelJulefrkost)
        break;
    case "removeMultiple":
        startTraditionelJulefrkost.splice(0, startTraditionelJulefrkost.length);
        console.log(startTraditionelJulefrkost);
        break;
//for lopp til at finde korrekt data og fjerne kun det ene element --> https://stackoverflow.com/questions/10024866/remove-object-from-array-using-javascript
    case "removeSingle":
            for (var i = 0; i < startTraditionelJulefrkost.length; i++)
            if (startTraditionelJulefrkost[i].shortenfood_name === datatype.shortenfood_name) {
               startTraditionelJulefrkost.splice(i,1);
               i--;
            }
        break;
    case "update":
        update();
        break;
    }
    // update(); // --> dette får den til at opdatere med data hver gang der trykkes på en knap, starter fra 0
}
update(startTraditionelJulefrkost); //start med at kalde på update funktionen så den loader med data

});
