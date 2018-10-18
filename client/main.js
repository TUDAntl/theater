import './main.html';
import { Template } from 'meteor/templating';

LatestSlots = new Mongo.Collection('slotCol');

Template.slots.aaa = function(){
  return LatestSlots.find().fetch();
};
