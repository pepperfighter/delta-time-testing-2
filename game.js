var rocks = 0;

function rockClick(number){
  rocks = rocks + number;
  document.getElementById("rocks").innerHTML = rocks;
};

var miners = 0;
function buyMiner(){
    var minerCost = Math.floor(10 * Math.pow(1.1,miners));     //works out the cost
    if(rocks >= minerCost){                                   //checks that the player can afford
        miners = miners + 1;                                   //increases number of miners
      	rocks = rocks - minerCost;                          //removes the rocks spent
        document.getElementById('miners').innerHTML = miners;  //updates the number of miners for the user
        document.getElementById('rocks').innerHTML = rocks;  //updates the number of rocks for the user
    };
    var nextCost = Math.floor(10 * Math.pow(1.1,miners));       //works out the cost of the next miner
    document.getElementById('minerCost').innerHTML = nextCost;  //updates the miner cost for the user
};

window.setInterval(function(){
  const current_time = Date.now();
}, 1000);

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
