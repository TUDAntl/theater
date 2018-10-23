import './main.html';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Chart } from 'chart.js';


LatestSlotsStaat = new Mongo.Collection('slotCol');
LatestSlotsSide = new Mongo.Collection('slotCol2');

Template.lastAlerts.helpers({
  "getLastAlert": function(){
    return LatestSlotsStaat.find({$or:[ {alert:"Emptying"}, {alert:"Filling"}]}, { limit:10, sort: {date: -1}} );
  }
})

Template.slots.helpers({
  "getFslots" : function(){
    var selected = LatestSlotsStaat.find({}, { limit: 200, sort: {date: -1}}).fetch();
    return selected;
  }
});

Template.ChartStaat.onRendered(function () {
  this.autorun(() => {
    var myChartObject = document.getElementById("myChartStaat");

    var rawObject = LatestSlotsStaat.find({}, { limit:10, sort:{date: -1}});
    var collData = [];
    rawObject.forEach(function(cat){
      collData.push(cat.fslots);
    });
    var collLabels = [];
    rawObject.forEach(function(cat){
      collLabels.push([cat.time.substring(0,5)]);
    });
    var color;
    if(collData[0]>=150){
    color ='rgba(27,188,18,0.4)';
    }
    if(150>collData[0]&&collData[0]>=50){
    color ='rgba(226,141,22,0.4)';
    }
    if(50>collData[0]){
    color ='rgba(162,0,0,0.4)';
    }

    collData = collData.reverse();
    collLabels = collLabels.reverse();
    var chart = new Chart(myChartObject, {
      type: 'line',
      data: {
        labels: collLabels,
        datasets:[{
          label: "Slots",
          data: collData,
          backgroundColor: color
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              userCallback: function(label, index, labels) {
                // when the floored value is the same as the value we have a whole number
                if (Math.floor(label) === label) {
                  return label;
                }

              },
            }
          }],
        },
      }
    });
  })
});

/*Template.ChartSide.onRendered(function () {
  this.autorun(() => {
    var myChartObject = document.getElementById("myChartSide");

    var rawObject = LatestSlotsSide.find({}, { limit:10, sort:{date: -1}});
    var collData = [];
    rawObject.forEach(function(cat){
      collData.push(cat.fslots);
    });
    var collLabels = [];
    rawObject.forEach(function(cat){
      collLabels.push([cat.time.substring(0,5)]);
    });
    var color;
    if(collData[0]>=150){
    color ='rgba(27,188,18,0.4)';
    }
    if(150>collData[0]>=50){
    color ='rgba(226,141,22,0.4)';
    }
    if(50>collData[0]){
    color ='rgba(162,0,0,0.4)';
    }

    collData = collData.reverse();
    collLabels = collLabels.reverse();
    var chart = new Chart(myChartObject, {
      type: 'line',
      data: {
        labels: collLabels,
        datasets:[{
          label: "Slots",
          data: collData,
          backgroundColor: color
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              userCallback: function(label, index, labels) {
                // when the floored value is the same as the value we have a whole number
                if (Math.floor(label) === label) {
                  return label;
                }

              },
            }
          }],
        },
      }
    });
  })
});
*/
