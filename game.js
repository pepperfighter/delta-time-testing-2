let last_time = null;
let total_time = 0;
setInterval(function gameLoop){
  const current_time = Date.now();
  if (last_time === null){
    last_time = current_time;
  }
  const delta_time = current_time - last_time;
  total_time += delta_time;
  last_time = current_time; //make sure to update "last_time"
}, 1000);

const currency_display = document.getElementById("currency");
let currency = 0;
const currency_per_millisecond = 0.001;

function updateGame(delta_time, total_time){
  currency += currency_per_millisecond * delta_time;
  currency_display.textContext = currency.toFixed(2);
}

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
