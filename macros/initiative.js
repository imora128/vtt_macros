/*
**Created by: Vinny (Discord: Crit#3291)
**Description: Allow the user to roll initiative with additional modifiers that are not avialable with the built in combat tracker.
**Dependency: User must have an actor selected in the "User Configuration" menu.
*/
new Dialog({
	title: `Vinny's Initiative Macro`,
	content: `
		<form>
			<div style="display: inline-block; width: 100%; margin-bottom: 10px">
				<label for="giftAlacrity" style="margin-right: 10px">Gift of Alacrity</label>
				<input type="checkbox" id="giftAlacrity">
			</div>
			<div style="display: inline-block; width: 100%; margin-bottom: 10px">
				<label for="additionalMods" style="margin-right: 10px">Additional modifiers</label>
				<input type="text" id="additionalMods">
			</div>
	`,
	buttons: {
		yes: {
			icon: "<i class='fas fa-check'></i>",
			label: `Roll Initiative`,
			callback: (html) => {
				var character = game.user.character;
				var totalInitMod = game.user.character.getRollData().attributes.init.total;
				var giftAlacrity = "";
				var additionalMods = "";

				//If Gift of Alacrity is checked, we add a 1d8 to the formula.
				if (html.find('#giftAlacrity').is(":checked")) {
					giftAlacrity = "+1d8";
				}

				//If the Additional Mods textbox is not empty, we add it to the roll formula. If there's bad data, the roll does not happen.
				if (!(html.find('#additionalMods').val().length===0)) {
					additionalMods = "+ " + html.find('#additionalMods').val();

				}
				
				//Before we try to roll initiative, need to make sure the user has set up their character in the User Config Menu.
				if (game.user.character == null) {
					console.log("User needs to select a player in the User Configuration menu");

				}
				else {

					//Base initiative formula is 1d20 + Initiative modifier
					//{totalInitMod}: Because we set up the character in the User Config menu, we get this directly from the foundry character data
					//{giftAlacrity}: Optional checkbox. If checked, adds +1d8 to the formula
					//{additionalMods}: If textbox is not empty, adds the modifiers to the formula
					game.user.character.rollInitiative({initiativeOptions: {formula: `1d20+${totalInitMod}${giftAlacrity}${additionalMods}` }});
				}




			}
		},
		no: {
			icon: "<i class='fas fa-times'></i>",
			label: `Cancel`
		},
	},
	default: "yes"
}).render(true)

