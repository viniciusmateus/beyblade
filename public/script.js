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

	//Adiciona função de aparecer somente se houver resultados
	$(".podiums").fadeIn();

	function getPodiums(database, target) {
		let topRef = database.orderByValue().limitToLast(3),
			i = 3,
			text;

		topRef.on("value", function (snapshot) {
			// Array para armazenar os dados dos 3 colocados
			let podiumData = [];

			snapshot.forEach(function (childSnapshot) {
				let refName = childSnapshot.key,
					refPoints = childSnapshot.val();

				switch (i) {
					case 1:
						text = "firstColocation";
						break;
					case 2:
						text = "secondColocation";
						break;
					case 3:
						text = "thirdColocation";
						break;
				}

				// Adiciona os dados dos colocados ao array
				podiumData.push({
					name: refName,
					points: refPoints,
					text: text,
				});

				i--;
			});

			// Ordena o array pelos pontos em ordem decrescente
			podiumData.sort(function (a, b) {
				return b.points - a.points;
			});

			// Atualiza os dados nos elementos HTML com base no array ordenado
			for (let j = 0; j < podiumData.length; j++) {
				$(target + " ." + podiumData[j].text + " .placeName").text(podiumData[j].name);
				$(target + " ." + podiumData[j].text + " .points").text(podiumData[j].points);

				if (podiumData[j].points > 0) {
					$(target + " ." + podiumData[j].text)
						.parent()
						.show();
				} else {
					$(target + " ." + podiumData[j].text)
						.parent()
						.hide();
				}

				if (podiumData[j].points > 1) {
					$(target + " ." + podiumData[j].text + " .textPoints").text("pontos");
				} else {
					$(target + " ." + podiumData[j].text + " .textPoints").text("ponto");
				}
			}
		});

		// Escuta por mudanças em um nó filho específico
		topRef.on("child_changed", function (snapshot) {
			// Chama a função novamente para atualizar e reordenar os dados
			getPodiums(database, target);
		});
	}

	getPodiums(refBeyblades, "#podiumBeyblade");
	getPodiums(refPlayer, "#podiumPlayer");

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
