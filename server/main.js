import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo'

const url = ["https://svg.parkinghq.com/parking_cities/533801/parking_units/5338",
"https://svg.parkinghq.com/parking_units/6328",
"https://www.q-park.de/de-de/städte/darmstadt/luisencenter/"
];
LatestSlotsStaat = new Mongo.Collection('slotCol');
LatestSlotsSide = new Mongo.Collection('slotCol2');
Archive = new Mongo.Collection('alerts');
var currentStaat;
var oldStaat;
var currentSide;
var oldSide;
var archiveCd=50;


Meteor.startup(() => {
  //LatestSlotsStaat.remove({});
  Meteor.setInterval(function(){Meteor.call("getSlotsStaat"),
  Meteor.call("writeArchive")
}, 1000*5);
});

Meteor.methods({
  getSlotsSide(){
    var result = HTTP.call('GET',url[2], function( error, response ) {
      if ( error ) {
        console.log( error );
      } else {

        var time = (new Date).toTimeString().substring(0,8);
        var date = new Date();
        var cont = response.content;
        var posStart = -1;

        if(cont.indexOf("<span class=\"spots\">") != -1)
        posStart = cont.indexOf("<span class=\"spots\">") + 20;


        var posEnd = cont.indexOf("Parkpl");
        var freeSlots = cont.slice(posStart, posEnd);

        var mesg = "-";
        if(freeSlots!=currentSide){
          if(currentSide > oldSide + 9){
            mesg="Emptying Alert";
          }
          if(currentSide < oldSide -9){
            mesg = "Filling Alert"
          }
          LatestSlotsSide.insert({fslots : freeSlots, time : time, date: date, alert: mesg});
        }

        if (typeof oldSide === "undefined") {
          oldSide=currentSide;
        }
        oldSide = currentSide;
        currentSide=freeSlots;
        console.log("Side", currentSide, oldSide);
      }});
    },
    getSlotsStaat(){
      var result = HTTP.call('GET',url[0], function( error, response ) {
        if ( error ) {
          console.log( error );
        } else {

          var time = (new Date).toTimeString().substring(0,8);
          var date = new Date();
          var cont = response.content;
          var posStart = -1;

          if(cont.indexOf("<span class='badge badge-low") != -1)
          posStart = cont.indexOf("<span class='badge badge-low") + 30;
          if(cont.indexOf("<span class='badge badge-medium") != -1)
          posStart = cont.indexOf("<span class='badge badge-medium") + 33;
          if(cont.indexOf("<span class='badge badge-high") != -1)
          posStart = cont.indexOf("<span class='badge badge-high") + 31;
          if(cont.indexOf("<span class='badge badge-black") != -1)
          posStart = cont.indexOf("<span class='badge badge-black") + 32;

          var posEnd = cont.indexOf("</span></p>");
          var freeSlots = cont.slice(posStart, posEnd);
          //var freeSlots = time.substring(6,8);
          var mesg = "-";


          if(freeSlots!=oldStaat){
            console.log("Staat", "Current:",freeSlots,"Old", oldStaat);

            if(Number(freeSlots) > Number(oldStaat) + 9){
              mesg="Emptying";
            }
            if(Number(freeSlots) + 9 < Number(oldStaat) ){
              mesg = "Filling"
            }
            LatestSlotsStaat.insert({fslots : freeSlots, time : time, date: date, alert: mesg});
          }

          mesg="-";
          oldStaat = freeSlots;

        }});
      },
      writeArchive(){
        /*var time = (new Date).toTimeString().substring(0,5);
        if(archiveCd>0){
        archiveCd--;
      }
      else if(time == "03:00"){
      Archive.insert(LatestSlots);
      LatestSlots.remove({});
      archiveCd = 50;
    }*/
  }
})
