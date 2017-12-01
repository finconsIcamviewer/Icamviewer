import { EventEmitter, ElementRef } from '@angular/core';
import { Link } from './link';
import { Node } from './node';
import * as d3 from 'd3';
import { SimulationLinkDatum, ValueFn, SimulationNodeDatum, Chord } from 'd3';
import { DbService } from 'app/d3/services/db.service';

export class Tree {
  constructor(nodes, links, options: { width, height }) {

    var matrix = [];
    // Initialize a square matrix of debits and credits.
    for (var i = 0; i <= nodes.length; i++) {
      matrix[i] = [];
      for (var j = 0; j <= nodes.length; j++) {
        matrix[i][j] = 0;
      }
    }
    /* console.log('links' +JSON.stringify(links[0], null, 4))
    console.log('nodes'+JSON.stringify(nodes[0], null, 4)) */
    // Populate the matrices, and stash a map from index to country.
    links.forEach(element => {
      console.log('element.source'+element.source.id)
      matrix[element.source][element.target] = element.value;
    });

    var svg = d3.select("svg"),
    width = 800,
    height = 600,
    outerRadius = Math.min(width, height) * 1.5 - 40,
    innerRadius = outerRadius - 30;

    var formatValue =  d3.format(",.3r");

    var chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending);

    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    var ribbon = d3.ribbon()
        .radius(innerRadius);

    var color = d3.scaleLinear<string>()
        .domain(d3.range(4))
        .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

    var g = svg.append("g")
        .attr("transform", "translate(" + width *2 + "," + height *2 + ")")
        .datum(chord(matrix));

    var group = g.append("g")
        .attr("class", "groups")
      .selectAll("g")
      .data(function(chords) { return chords.groups; })
      .enter().append("g");

    group.append("path")
        .style("fill", function(d) { return "#FFDD89" })
        .style("stroke", function(d) {return "#957244" })
        .attr("d", <any>arc);

    var groupTick = group.selectAll(".group-tick")
      .data(function(d) { return groupTicks(d, 1e3); })
      .enter().append("g")
        .attr("class", "group-tick")
        .attr("transform", function(d) { return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)"; });

    groupTick.append("line")
        .attr("x2", 6);

    groupTick
      .append("text")
        .attr("x", 8)
        .attr("dy", ".35em")
        .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180) translate(-16)" : null; })
        .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
       /*  .text(function(d) { console.log(d); return formatValue(d.value); }); */

    g.append("g")
        .attr("class", "ribbons")
      .selectAll("path")
      .data(function(chords) { return chords; })
      .enter().append("path")
        .attr("d", <any>ribbon) 
        .style("fill", function(d:Chord) { return color(d.target.index); })
        .style("stroke", <any>function(d:Chord) { return d3.rgb(color(d.target.index)).darker(); });

    // Returns an array of tick angles and values for a given group and step.
    function groupTicks(d, step) {
      var k = (d.endAngle - d.startAngle) / d.value;
      return d3.range(0, d.value, step).map(function(value) {
        return {value: value, angle: value * k + d.startAngle};
      });
    }
  }

}
