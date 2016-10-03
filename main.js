"use strict";
var record = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
var score = 0; 
var prev;
//localStorage.removeItem("record");
var ex = 0;
if(typeof(Storage)!==undefined)
{
	if(localStorage.getItem("record") != undefined) 
	{
		ex=1;
		var temp = localStorage.getItem("record");
		//alert("Preious Game Found");
		console.log(temp);
		for(var i = 0;i<4;i++)
		{
			for(var j=0;j<4;j++)
			{
				record[i][j] = temp[2*((4*i)+j)];
			}
		}
		//console.log(record);
	}
}
console.log(record);
var game = (function(){
	var target;
	var addRandom = function(){
		var i = 0,j=0;
		var curr = Math.floor(Math.random() * 16) + 1 ;
		while(curr > 0)
		{
			for(var x=0;x<4 && curr > 0;x++)
			{
				for(var y=0 ;y<4 && curr > 0;y++)
				{
					if(record[x][y]==0)
					{
						curr--;
					}
					if(curr==0)
					{
						i = x;
						j = y;
						break;
					}
				}
			}
		}
		var num = 2;
		curr = Math.floor(Math.random()*30);
		if(curr%3 == 0)
		{
			num = 4;
		}
		//console.log("random number generated at" + i+',' +j+ "with value = " + num);
		record[i][j] = num;
	};
	var shift_left = function(i)
	{
		var j=0;
		var k=0;
		for( ;k<4;k++)
		{
			if(record[i][k]!=0)
			{
				record[i][j]=record[i][k];
				j++;
			}
		}
		for( ;j<4;j++)
		{
			record[i][j]=0;
		}

	}
	var merge_row = function(i)
	{
		shift_left(i);
		//Merging two elements starting from left
		for(j=0;j<3;j++)
		{
			if(record[i][j] == record[i][j+1])
			{
				record[i][j] *= 2;
				record[i][j+1]=0;
				score += record[i][j];
				j++;
			}
		}
		shift_left(i);
		return;
	}

	var merge_left = function(){
		for(var i=0;i<4;i++)
		{
			merge_row(i);
		}
		
	};
	var can_continue = function(){
		for(var i = 0; i<4;i++)
		{
			for(var j=0;j<4;j++)
			{
				if(record[i][j]==0)
				{
					return 1;
				}
			}
		} 
		return 0;
	};
	var create = function(){
		//Target is to put the structure of the complete game inside that box for the first time on the basis of record matrix
		target.className += "game_box";
		//Making header
		var curr_div = document.createElement("div");
		curr_div.className += "header" ;
		 	//Adding elements to header
		 	var curr_el = document.createElement("div");
		 	curr_el.className = "title_box";
		 		var inner = document.createElement("p");
		 		inner.innerHTML = "2048";
		 		inner.className = "title_p";
		 		curr_el.appendChild(inner);
		 	curr_div.appendChild(curr_el);
		 	curr_el = document.createElement("div");
		 	curr_el.className = "score_box";
		 		//Adding 2 divs in this high score box
		 		var inner = document.createElement("p");
		 		inner.className = "score_title";
		 		inner.innerHTML = "BEST";
		 		curr_el.appendChild(inner);
		 		inner = document.createElement("p");
		 		inner.className = "score";
		 		if(localStorage.getItem("best"))
		 		{
		 			inner.innerHTML = localStorage.getItem("best");
		 		}
		 		else
		 		{
		 			inner.innerHTML = '0'; 
		 		}
		 		curr_el.appendChild(inner);
		 	curr_div.appendChild(curr_el);
		 	curr_el = document.createElement("div");
		 	curr_el.className = "score_box" ;
		 		//Adding 2 divs in score box
		 		var inner = document.createElement("p");
		 		inner.className = "score_title";
		 		inner.innerHTML = "SCORE";
		 		curr_el.appendChild(inner);
		 		inner = document.createElement("p");
		 		inner.className = "score";
		 		if(localStorage.getItem("score"))
		 		{
		 			inner.innerHTML = localStorage.getItem("score");
		 		}
		 		else
		 		{
		 			inner.innerHTML = '0'; 
		 		}
		 		curr_el.appendChild(inner);
		 	curr_div.appendChild(curr_el);
		target.appendChild(curr_div);

		// Making tile box
		curr_div = document.createElement("div");
		curr_div.className = "tile_box";
		for(var i=0;i<16;i++)
		{
			curr_el = document.createElement("div");
			curr_div.appendChild(curr_el);
		}
		target.appendChild(curr_div);
		if(ex==0)
		{
			addRandom();
			addRandom();
		}
		draw();
	}
	var draw = function(){
		//console.log("draw called");
		var curr_div = document.getElementsByClassName("tile_box");
		curr_div = curr_div[0];
		var temp;
		var children = curr_div.children;
		var classes = { '2' : "two" , '4' : "four" , '8' : "eight" , '16' : "sixteen" , '32' : "thirty-two" , '64' : "sixty-four"};
		curr_div.className = "tile_box";

		for(var i=0;i<16;i++)
		{
			children[i].className = "tile";
			temp = record[Math.floor(i/4)][i%4];
			//console.log(temp);
			if(record[Math.floor(i/4)][i%4] >=128)
			{
				//console.log("class added is = large_tile");
				children[i].className += " large_tile";
				children[i].innerHTML = temp;
			}
			else if(record[Math.floor(i/4)][i%4]==0)
			{
				//console.log("nil class added");
				children[i].innerHTML = " ";
			}
			else
			{
				//console.log("class added is = " + classes[record[Math.floor(i/4)][i%4]]);
				children[i].className += ' ' + classes[record[Math.floor(i/4)][i%4]];
				children[i].innerHTML = temp;
			}
		}
		curr_div = document.getElementsByClassName("score")[1];
		//console.log(curr_div);
		//console.log("Score = " + score);
		curr_div.innerHTML = score;
		localStorage.setItem("record",record);
		localStorage.setItem("score",score);
		var best = (localStorage.getItem("best") ? localStorage.getItem("best") : 0);
		if(score>best)
		{
			best = score;
		}
		localStorage.setItem("best",best);
		curr_div = document.getElementsByClassName("score")[0];
		curr_div.innerHTML = best; 	
	}
	var rotate = function(degree)
	{
		if(degree == 0)
			return ;
		for(var i = 90; i<=degree ; i+=90)
		{
			var temp = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
			for(var j=0;j<4;j++)
			{
				for(var k = 0; k<4; k++)
				{
					temp[j][k] = record[k][3-j];
				}
			}
			record = temp;
		}
	}
	var change = function(e){
		if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)
		{
			prev = record;
			e.preventDefault();
		}
		else
		{
			return;
		}
		rotate(90*(e.keyCode-37))
		merge_left();
		rotate(360-90*(e.keyCode-37));
		if(can_continue())
		{
			addRandom();
			draw();
		}
		else
		{
			alert("Game Over");
			record = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
			addRandom();
			addRandom();
			score = 0;
			draw();
		}
		console.log("called");
	}
	var undo = function(e){
		if(e.keyCode == 8)
		{
			//console.log("undo called");
			record = prev;
			draw();
		}
		else
		{
			return;
		}
	};
	var init = function(config){
		if(!config || !config.targetId)
			throw ("Invalid Call");
		target = document.getElementById(config.targetId);
		create();
		window.addEventListener('keydown',change);
		window.addEventListener('keydown',undo);
	}
	return {
		init : init
	};
})();