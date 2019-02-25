"use strict";

let countryController = {};
let generate = true;
countryController.listOfCountries = [];
countryController.developmentHistory = [];
countryController.tradeHistory = [];

countryController.register = function (name, object) {
    var t = this;
    t.listOfCountries[name] = object;
}

countryController.getCountry = function (name) {
	return this.listOfCountries[name];
}

function len(arr) {
  var count = 0;
  for (var k in arr) {
    if (arr.hasOwnProperty(k)) {
      count++;
    }
  }
  return count;
}
countryController.random = function () {
	var length = len(countryController.listOfCountries);
	return this.listOfCountries["Country_"+Math.floor((Math.random()*length))];
}

function GetPropertyValue(obj1, dataToRetrieve) {
  return dataToRetrieve
    .split('.') // split string based on `.`
    .reduce(function(o, k) {
      return o && o[k]; // get inner property if `o` is defined else get `o` and return
    }, obj1) // set initial value as object
}

function averageDevelopment(){
	var count = 0, total = 0, average;
	var arr = countryController.listOfCountries;

	for (var k in arr) {
		var obj = countryController.listOfCountries[k];
		total += GetPropertyValue(obj, "development");
		count++;
	}
	average = total/count;
	return average;
}

function averageTrades(){
	var count = 0, total = 0, average;
	var arr = countryController.listOfCountries;

	for (var k in arr) {
		var obj = countryController.listOfCountries[k];
		total += GetPropertyValue(obj, "maxTrades");
		count++;
	}
	average = total/count;
	// console.log("Average max number of trades is " + average);
	return average;
}

countryController.trade = async function (traderName, receiverName) {
	var trader = countryController.listOfCountries[traderName];
	var receiver = countryController.listOfCountries[receiverName];
	var j = 0;
	trader.numberOfTrades -= 1;
	function tradeLoop(){

		trader.money += (trader.development > averageDevelopment() && trader.development > 0) ? 20*(1+(0.05*(trader.development/averageDevelopment()))) : 20;
		receiver.money += (receiver.development > 0) ? (5*(averageDevelopment()/receiver.development)) : 5;
		countryController.updateDOM(trader.name);
		countryController.updateDOM(receiver.name);
		j++;
		if( j < 5){
			setTimeout( tradeLoop, 1000);
		}else if(j >= 5){
			trader.numberOfTrades += 1;
			countryController.updateDOM(trader.name);
		}

		if(trader.money >= 350){
			countryController.upgrade(trader.name);
			trader.money -= 250;
		}

		if(receiver.money >= 350){
			countryController.upgrade(receiver.name);
			receiver.money -= 250;
		}
	}
	tradeLoop();

}

countryController.upgrade = async function (countryName) {
	var country = countryController.listOfCountries[countryName];
	if(averageTrades() >= (country.maxTrades-1) && averageTrades() <= 14){
		country.numberOfTrades++;
		country.maxTrades++;
		country.money -= 100;
		countryController.updateDOM(country.name);
	}else{
		country.development++;
		countryController.updateDOM(country.name);
	}
}

countryController.updateDOM = async function (name) {
	var averageDevelopmentNode = document.getElementById("averageDevelopment");
	var averageNumberOfTradesNode = document.getElementById("averageNumberOfTrades");
	var country = countryController.listOfCountries[name];

	var details = document.getElementById(name+'Details');
	details.innerText = "\n$"+country.money.toFixed(2)+"\n# of trades: "+
						country.maxTrades + "\nCurrent # of Trades: " +
						(country.maxTrades-country.numberOfTrades)+
						"\nDevelopment: "+country.development;

	averageDevelopmentNode.innerText = averageDevelopment().toFixed(2);
	averageNumberOfTradesNode.innerText = averageTrades().toFixed(2);
}

countryController.marketCrash = async function(){
	var count = 0;
	var arr = countryController.listOfCountries;

	for (var k in arr) {
		var obj = countryController.listOfCountries[k];
		if(obj.development <= 0){
		}else if(obj.development == 1){
			obj.development--;
		}else{
			obj.development -= 2;
		}
		count++;
	}
	return;
}

let countryScheme = {
	money: 100,
	name: String,
	numberOfTrades: 2,
	maxTrades: 2,
	development: 1,
	displayDetails: function(){
		console.log(`${this.name}:\t$${this.money}\tPossible number of trades: ${this.numberOfTrades}`);
	},
	index: Number
}

function showDetails(name, money){
	// console.log("mouseover");
	var country = countryController.listOfCountries[name];
	var details = document.getElementById(name+'Details');
	details.style.display = "contents";
	details.innerText = "\n$"+country.money.toFixed(2)+"\n# of trades: "+
						country.maxTrades + "\nCurrent # of Trades: " +
						(country.maxTrades-country.numberOfTrades)+
						"\nDevelopment: "+country.development;
	document.getElementById(name).style.color = "darkgreen";
}

let i = 0, howManyTimes = 14;
let creationSpeed ;
var node = document.getElementById('countryContainer');
function countryLoop(){
	const countryCreation = Object.create(countryScheme);
	countryCreation.name = "Country_"+i;

	// details
	var details = document.createElement("div");
	var detailsTextnode = document.createTextNode("$"+countryCreation.money);
	details.appendChild(detailsTextnode);
	details.id = countryCreation.name+"Details";
	details.className = "details";
	// li
	var li = document.createElement("LI");
	li.id = countryCreation.name;
	li.onmouseover = function(){
		showDetails(countryCreation.name);
	};
	li.onmouseout = function(){
		document.getElementById(countryCreation.name+'Details').style.display = "none";
		li.style.color = "black";
	};
	var textnode = document.createTextNode(countryCreation.name);
	li.appendChild(textnode);
	li.appendChild(details);
	node.appendChild(li);

	countryCreation.money = 100;
	countryCreation.numberOfTrades = 4;
	countryCreation.maxTrades = 4;
	countryCreation.development = 1;
	countryCreation.index = i;
	countryController.register(countryCreation.name, countryCreation);
	// countryCreation.displayDetails();
	i++;
	if( i < howManyTimes || generate){
		if(len(countryController.listOfCountries) < 15){
			creationSpeed = 2;
		}else {
			creationSpeed = 300;
		}

		if(len(countryController.listOfCountries) >= 125){
			return;
		}else{
        	setTimeout( countryLoop, creationSpeed);
		}
    }
}

countryLoop();

function createTrade(){
	var x = 0;

	var trader = countryController.random();
	var receiver = countryController.random();

	if(trader.numberOfTrades < 1){
		// console.log(trader.name + " has to many trades");
		return;
	}else{

		while (trader === receiver && x < 5){
			receiver = countryController.random();
			x++;
		}

		countryController.trade(trader.name, receiver.name);
		x = 0;
	}

}

var tradeSpeed = 1000;
function market(){
	tradeSpeed = (500 / (len(countryController.listOfCountries)**1.1));  
	if(generate){
		setTimeout( market, tradeSpeed );
	}
	createTrade();
}

var historyInc = 0;
setInterval( () => {
	countryController.developmentHistory.push([historyInc, averageDevelopment()]);
	countryController.tradeHistory.push([historyInc, averageTrades()])
	historyInc++;
}, 1000 );

setTimeout( () => {
	market();
}, 2000 );

setTimeout( () => {
	generate = false;
	console.log(countryController.listOfCountries);
}, 1000000000 );