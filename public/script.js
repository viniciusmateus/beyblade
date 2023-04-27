let players = ["Gustavo", "Vinicius", "Vivi"],
	beyblades = ["Nightmare Luinor", "Gaianon G2", "Spriggan Requiem"];

function generateBattles(first, second) {
	$("#fullPage .container").append('<table id="' + beyblades.indexOf(first) + beyblades.indexOf(second) + '" class="table table-dark table-adjust"><thead><tr><th scope="col">' + first + '</th><th></th><th scope="col">' + second + '</th></tr></thead><tbody class="lead"></tbody></table>');

	for (var i = 0; i < players.length; i++) {
		for (var ii = 0; ii < players.length; ii++) {
			if (i != ii) {
				let check = i.toString() + ii.toString();
				$("#" + beyblades.indexOf(first) + beyblades.indexOf(second) + " tbody").append(
					"<tr><td>" + players[i] + '</td><td><span class="' + players[i] + beyblades.indexOf(first) + '"></span>vs<span class="' + players[ii] + beyblades.indexOf(second) + '"></span></td><td>' + players[ii] + "</td></tr>"
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
