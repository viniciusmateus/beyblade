let player = ["Gustavo", "Vinicius", "Vivi"],
	beyblades = [],
	battleCount = 0;

function createArrayPlayer() {
	firebase
		.database()
		.ref("/player")
		.on("value", function (snapshot) {
			snapshot.forEach(function (userSnapshot) {
				player.push(userSnapshot.key);
			});
		});
}

(function () {
	firebase
		.database()
		.ref("/beyblades")
		.on("value", function (snapshot) {
			snapshot.forEach(function (userSnapshot) {
				$("body").append('<input type="hidden" class="beybladesValue" value="' + userSnapshot.key + '" />');
			});
		});
})();

console.log($(".beybladesValue").length);

function createArray(target, arrayName) {
	let inputHidden = $(target);
	for (var i = 0; i < inputHidden.length; i++) {
		if (inputHidden[i].value != "" && inputPoints[i].value != "") {
			console.log(inputHidden[i].value);
			arrayName.push(inputHidden[i].value);
		}
	}
}
createArray(".beybladesValue");

function generateBattles(first, second) {
	$("#fullPage .container").append('<table id="' + beyblades.indexOf(first) + beyblades.indexOf(second) + '" class="table table-dark table-adjust"><thead><tr><th scope="col">' + first + '</th><th></th><th scope="col">' + second + '</th></tr></thead><tbody class="lead"></tbody></table>');

	for (var i = 0; i < player.length; i++) {
		for (var ii = 0; ii < player.length; ii++) {
			if (i != ii) {
				battleCount++;
				$("#" + beyblades.indexOf(first) + beyblades.indexOf(second) + " tbody").append(
					'<tr id="battle' + battleCount + '"><td>' + player[i] + '</td><td><span class="' + player[i] + beyblades.indexOf(first) + '"></span>vs<span class="' + player[ii] + beyblades.indexOf(second) + '"></span></td><td>' + player[ii] + "</td></tr>"
				);
			}
		}
	}
}

// Create tables

for (var i = 0; i < beyblades.length; i++) {
	for (var ii = i + 1; ii < beyblades.length; ii++) {
		if (i != ii) {
			generateBattles(beyblades[i], beyblades[ii]);
		}
	}
}
