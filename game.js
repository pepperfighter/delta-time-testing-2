//var rocks = 0;

//function rockClick(number){
//  rocks = rocks + number;
//  document.getElementById("rocks").innerHTML = rocks;
//};
//
//var miners = 0;
//function buyMiner(){
//    var minerCost = Math.floor(10 * Math.pow(1.1,miners));     //works out the cost
//    if(rocks >= minerCost){                                   //checks that the player can afford
//        miners = miners + 1;                                   //increases number of miners
//      	rocks = rocks - minerCost;                          //removes the rocks spent
//        document.getElementById('miners').innerHTML = miners;  //updates the number of miners for the user
//        document.getElementById('rocks').innerHTML = rocks;  //updates the number of rocks for the user
//    };
//    var nextCost = Math.floor(10 * Math.pow(1.1,miners));       //works out the cost of the next miner
//    document.getElementById('minerCost').innerHTML = nextCost;  //updates the miner cost for the user
//};
//
//window.setInterval(function(){
//rockClick(miners);
//}, 1000);
//
//last_update_time = new Date();
//
//
//function update(){
//	
//	var curtime = new Date();
//	delta_ms = curtime.getTime() - last_update_time.getTime();
//	last_update_time.setTime(curtime.getTime());
//	
//	rocks += rps * global_mult * (delta_ms / 1000);
//	//total_goomies += gps * global_mult * (delta_ms / 1000);
//};




var Game = (function() {
    'use strict';

    var instance = {
        ui: {},
        lastUpdateTime: 0,
        intervals: {},
        uiComponents: [],
        logoAnimating: true,
        timeSinceAutoSave: 0,
        activeNotifications: {},
        lastFixedUpdate: new Date().getTime()
    };

    instance.update_frame = function(time) {
        Game.update(time - Game.lastUpdateTime);
        Game.lastUpdateTime = time;

        // This ensures that we wait for the browser to "catch up" to drawing and other events
        window.requestAnimationFrame(Game.update_frame);
    };

    instance.update = function(delta) {
        for (var name in this.intervals) {
            var data = this.intervals[name];
            data.e += delta;
            if (data.e > data.d) {
                data.c(this, data.e / 1000);
                data.e = 0;
            }
        }
    };

    instance.createInterval = function(name, callback, delay) {
        this.intervals[name] = {c: callback, d: delay, e: 0}
    };

    instance.deleteInterval = function(name) {
        delete this.intervals[name];
    };

    instance.fixedUpdate = function() {
        var currentTime = new Date().getTime();
        var delta = (currentTime - this.lastFixedUpdate) / 1000;
        this.lastFixedUpdate = currentTime;

        refreshPerSec(delta);
        gainResources(delta);
        fixStorageRounding();
    };

    instance.fastUpdate = function(self, delta) {
        refreshWonderBars();
        checkRedCost();

        updateResourceEfficiencyDisplay();
        updateEnergyEfficiencyDisplay();
        updateScienceEfficiencyDisplay();
        updateBatteryEfficiencyDisplay();

        legacyRefreshUI();

        self.ui.updateBoundElements(delta);

        self.resources.update(delta);
        self.buildings.update(delta);
        self.tech.update(delta);
        self.settings.update(delta);

        self.updateAutoSave(delta);

        if(delta > 1) {
            console.log("You have been away for " + Game.utils.getTimeDisplay(delta));
        }
    };

    instance.slowUpdate = function(self, delta) {
        refreshConversionDisplay();
        refreshTimeUntilLimit();
        gainAutoEmc();

        checkStorages();

        self.updateTime(delta);

        self.achievements.update(delta);
        self.statistics.update(delta);
    };
	
    instance.uiUpdate = function(self, delta) {
        for(var i = 0; i < self.uiComponents.length; i++) {
            self.uiComponents[i].update(delta);
        }
    };

    instance.updateTime = function(delta) {
        Game.statistics.add('sessionTime', delta);
        Game.statistics.add('timePlayed', delta);


        console.log("Load Successful");
    };

    instance.updateUI = function(self){
        Game.settings.updateCompanyName();
        refreshResources();
        refreshResearches();
        refreshTabs();

        updateCost();

        if(Game.constants.enableMachineTab === true){
            $('#machineTopTab').show();
        }

    instance.loadDelay = function (self, delta) {

        // Then start the main loops
        self.createInterval("Fast Update", self.fastUpdate, 100);
        self.createInterval("Slow Update", self.slowUpdate, 1000);
        self.createInterval("UI Update", self.uiUpdate, 100);

        // Do this in a setInterval so it gets called even when the window is inactive
        window.setInterval(function(){ Game.fixedUpdate(); },100);

        setTimeout(function(){document.getElementById("loadScreen").className = "hidden";}, 100)
        console.debug("Load Complete");

    };

    return instance;
}());

window.onload = function(){
    Game.start();
};
