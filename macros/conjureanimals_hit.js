//ADAPTED FROM https://github.com/foundry-vtt-community/macros/blob/main/5e/animate_tiny_weapons.js

function printMessage(message){
	let chatData = {
		user : game.user._id,
		content : message,
		//blind: true,
		//whisper : game.users.filter(u => u.isGM).map(u => u.data._id)
	};

	ChatMessage.create(chatData,{});	
}

function getNumRollTypes(dicearray) {
	let straight = 0;
	let adv = 0;
	let dis = 0;
	let finalStr = "(";
	for (var i = 0; i < dicearray.length; i++) {

		if (dicearray[i].terms[0].modifiers[0]) {
			if (dicearray[i].terms[0].modifiers[0] == "kh") { 
				adv++;
			}
			else if (dicearray[i].terms[0].modifiers[0] == "kl") { 
				dis++;
			}
		} else {
			straight++;
		}
	}

	if (straight > 0) {
		finalStr += "S: " + straight + ", ";
	}

	if (adv > 0) {
		finalStr += "A: " + adv + ", ";
	}

	if (dis > 0) {
		finalStr += "D: " + dis + ", ";
	}
	return finalStr.slice(0, finalStr.length - 2) + ")";

}


function OutputManySameDice(dicearray, modifier){
	let diceNum = "0";
	let diceFaces = "20";
	let diceRollMod = "";
	let diceModOperator = dicearray[0].terms[1].operator;
	let diceModVal = dicearray[0].terms[2].number;
	let finalNum = "0";
	var finalNumArr = [];
	let output = `
<div class="dice-roll">
	<div class="dice-result">
		<div class="dice-formula">${dicearray.length}d${dicearray[0].dice[0].faces} ${diceModOperator} ${diceModVal} ${getNumRollTypes(dicearray)}</div>`


	for (var i = 0; i < dicearray.length; i++) { //rolls[rolls.length - 1].terms[0]
		diceNum = dicearray[i].terms[0].number;
		diceFaces = dicearray[i].dice[0].faces;

		if (dicearray[i].terms[0].modifiers[0]) {
			diceRollMod = diceRollMod;
		}

		if (dicearray[i].terms[1].operator){
			diceModOperator =dicearray[i].terms[1].operator;
		}

		if (dicearray[i].terms[2].number){
			diceModVal = dicearray[i].terms[2].number;
		}

		output += `
		<div class="dice-tooltip">
		<section class="tooltip-part">
			<div class="dice">
				<header class="part-header flexrow">
				<span class="part-formula">${diceNum}d${diceFaces}${diceRollMod} ${diceModOperator} ${diceModVal}</span>`
				for (var z = 0; z < dicearray[i].terms[0].results.length; z++) {
					if (parseInt(finalNum) < parseInt(dicearray[i].terms[0].results[z].result) ) {
						finalNum = parseInt(dicearray[i].terms[0].results[z].result);
					}
					output+= `<span class="part-total">${dicearray[i].terms[0].results[z].result}</span>`
				}
			output = output + `
				</header>
				<ol class="dice-rolls">`
				if (parseInt(finalNum) == 1) {
					output += `<li class="roll die d${dicearray[i].dice[0].faces} min">${finalNum}</li>`
				}
				else if (parseInt(finalNum) == parseInt(dicearray[i].dice[0].faces)){
					output += `<li class="roll die d${dicearray[i].dice[0].faces} max">${finalNum}</li>`
				}
				else{
					output += `<li class="roll die d${dicearray[i].dice[0].faces}">${finalNum}</li>`
				}
					output = output + `    
					</ol>
				</div>
			</section>
		</div>
		`
		finalNumArr.push(finalNum);
		finalNum = 0;
	}


	for (var i = 0; i < dicearray.length; i++) {
		//for (var k = 0; i < finalNumArr.length; k++) {
			console.log(finalNumArr[i])
		//}
		if (parseInt(finalNumArr[i]) == 1) {
			output += `<h4 class="dice-total fumble">${dicearray[i].total}</h4>`
		}
		else if (parseInt(finalNumArr[i]) == parseInt(dicearray[i].dice[0].faces)){
			output += `<h4 class="dice-total critical">${dicearray[i].total}</h4>`
		}
		else{
			output += `<h4 class="dice-total">${dicearray[i].total}</h4>`
		}
	}

	output += `
	</div>
</div>`

	return output
}





//Launch Dialog message with a counter from 1-8 for the number of dice to roll
new Dialog({
	title: `Conjure Animals`,
	content: `
		<form>
			<div style="display: inline-block; width: 100%; margin-bottom: 10px">
				<label for="beastType" style="margin-right: 10px">Beast:</label>
				<select id="beastType" />
					<option value="Wolf">Wolf</option>
					<option value="GiantPoisonousSnake">Giant Poisonous Snake</option>
				</select>
			</div>
			<div style="display: inline-block; width: 100%; margin-bottom: 10px">
				<label for="output-options" style="margin-right: 10px">Number of beasts:</label>
				<select id="output-options" />
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
					<option value="6">6</option>
					<option value="7">7</option>
					<option value="8">8</option>
				</select>
			</div>
			<div style="display: inline-block; width: 100%; margin-bottom: 10px">
				<label for="advNum" style="margin-right: 10px">Advantage</label>
				<select id="advNum" />
					<option value="0">0</option>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
					<option value="6">6</option>
					<option value="7">7</option>
					<option value="8">8</option>
				</select>
			</div>
	`,
	buttons: {
		yes: {
			icon: "<i class='fas fa-check'></i>",
			label: `Attack`,
			callback: (html) => {
				let count = html.find('#output-options').val();
				let rolls = [];
				let debugOutput = "";
				var beastType = html.find('#beastType').val();
				var selectedBeastIndex = html.find('#beastType')[0].options.selectedIndex;
				var selectedBeastLabel = html.find('#beastType')[0][selectedBeastIndex].label;
				let numAdv = html.find('#advNum').val();
				let rollCmd = ""
				console.log("This is numadv: " + numAdv);
				var atkBonus = {
				  Wolf: `4`,
				  GiantPoisonousSnake: `6`
				};
				

				//Do attack Rolls
				for (var i = 0; i < count; i++) {
					if (numAdv > 0) {
						rollCmd = "2d20kh"
						numAdv--;
					} else {
						rollCmd = "1d20"
					}

					let roll = new Roll(`${rollCmd}+${atkBonus[beastType]}`);

					rolls.push(roll.evaluate({async: false}));
					console.log(rolls);
					console.log("die below:")
					console.log(rolls[rolls.length - 1].terms[0]);
					// console.log(rolls[rolls.length - 1].terms[0].results);
					console.log("modifier: " + rolls[rolls.length - 1].terms[0].modifiers);
					console.log("len is: " + rolls.length)

					debugOutput = debugOutput.concat(rolls[rolls.length - 1].total);
					debugOutput = debugOutput.concat(" ");
				}


				//console.log("REE " + debugOutput);
				printMessage("Conjure Animals ("+selectedBeastLabel+") Attacks: " + OutputManySameDice(rolls,atkBonus[beastType]));

			}
		},
		no: {
			icon: "<i class='fas fa-times'></i>",
			label: `Cancel`
		},
	},
	default: "yes"
}).render(true)

