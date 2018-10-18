import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo'

const url = "https://svg.parkinghq.com/parking_cities/533801/parking_units/5338";
LatestSlots = new Mongo.Collection('slotCol');


Meteor.startup(() => {
Meteor.setInterval(function(){Meteor.call("getSlots")}, 1000*60);
});

Meteor.methods({
  getSlots(){
    const result = HTTP.call('GET',url, function( error, response ) {
  if ( error ) {
    console.log( error );
  } else {

    var cont = response.content;
    var posStart = cont.indexOf("badge-low'>");
    var posEnd = cont.indexOf("</span></p>")
    var freeSlots = cont.slice(posStart+11,posEnd)
    console.log("Free Slots:",freeSlots);

    LatestSlots.insert({fslots : freeSlots, time : 111});

  }});
  }
})
