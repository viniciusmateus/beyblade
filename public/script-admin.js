// Cria as Promises para buscar os dados dos dois nós
let keysPlayer,
	keysBeyblades,
	battleCount = 0;

function generateBattles(first, second) {
	$("#fullPage .container").append(
		'<table id="' + keysBeyblades.indexOf(first) + keysBeyblades.indexOf(second) + '" class="table table-dark table-adjust mt-3"><thead><tr><th scope="col">' + first + '</th><th></th><th scope="col">' + second + '</th></tr></thead><tbody class="lead"></tbody></table>'
	);

	for (let i = 0; i < keysPlayer.length; i++) {
		for (let ii = 0; ii < keysPlayer.length; ii++) {
			if (i != ii) {
				battleCount++;
				$("#" + keysBeyblades.indexOf(first) + keysBeyblades.indexOf(second) + " tbody").append(
					'<tr id="battle' + battleCount + '"><td>' + keysPlayer[i] + '</td><td><span class="' + keysPlayer[i] + keysBeyblades.indexOf(first) + '"></span>vs<span class="' + keysPlayer[ii] + keysBeyblades.indexOf(second) + '"></span></td><td>' + keysPlayer[ii] + "</td></tr>"
				);
			}
		}
	}
}

$("#selectionEdition").on("change", function () {
	let refPlayer = database.ref("edition/" + $(this).val() + "/players"),
		refBeyblades = database.ref("edition/" + $(this).val() + "/beyblades");
	promise1 = refPlayer.once("value");
	promise2 = refBeyblades.once("value");

	$("#fullPage .container table").remove();

	$("#titleEdition").text($(this).val()).parent().fadeIn();

	Promise.all([promise1, promise2])
		.then(function (results) {
			// Os resultados são retornados como um array de snapshots
			let snapshotPlayer = results[0];
			let snapshotBeyblades = results[1];

			// Pega as keys dos childs em cada snapshot
			keysPlayer = Object.keys(snapshotPlayer.val());
			keysBeyblades = Object.keys(snapshotBeyblades.val());

			for (let i = 0; i < keysBeyblades.length; i++) {
				for (let ii = i + 1; ii < keysBeyblades.length; ii++) {
					if (i != ii) {
						generateBattles(keysBeyblades[i], keysBeyblades[ii]);
					}
				}
			}
		})
		.catch(function (error) {
			console.log(error);
		});
});

// Usa o método Promise.all() para buscar os dados de ambos os nós juntos
