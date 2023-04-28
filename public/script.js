// Cria as Promises para buscar os dados dos dois nós
let promisePlayer = refPlayer.once("value"),
	promiseBeyblades = refBeyblades.once("value"),
	keysPlayer,
	keysBeyblades,
	battleCount = 0;

function generateBattles(first, second) {
	$("#fullPage .container").append('<table id="' + keysBeyblades.indexOf(first) + keysBeyblades.indexOf(second) + '" class="table table-dark table-adjust"><thead><tr><th scope="col">' + first + '</th><th></th><th scope="col">' + second + '</th></tr></thead><tbody class="lead"></tbody></table>');

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

// Cria uma Promise para escutar mudanças nos dados dos dois nós
function listenForChanges() {
	var promise1 = new Promise(function (resolve, reject) {
		refPlayer.on(
			"value",
			function (snapshot) {
				// Pega os dados do snapshot
				var data = snapshot.val();

				// Resolve a Promise com os dados atualizados do nó 1
				resolve(data);
			},
			function (error) {
				// Rejeita a Promise caso ocorra algum erro na escuta dos dados do nó 1
				reject(error);
			}
		);
	});

	var promise2 = new Promise(function (resolve, reject) {
		refBeyblades.on(
			"value",
			function (snapshot) {
				// Pega os dados do snapshot
				var data = snapshot.val();

				// Resolve a Promise com os dados atualizados do nó 2
				resolve(data);
			},
			function (error) {
				// Rejeita a Promise caso ocorra algum erro na escuta dos dados do nó 2
				reject(error);
			}
		);
	});

	// Retorna um array de Promises que serão resolvidas quando houver mudanças nos dados dos nós
	return [promise1, promise2];
}

// Usa o método Promise.all() para buscar os dados de ambos os nós juntos
Promise.all(listenForChanges()).then(function (results) {
	// Os resultados são retornados como um array de snapshots
	let snapshotPlayer = results[0];
	let snapshotBeyblades = results[1];

	// Pega as keys dos childs em cada snapshot
	keysPlayer = Object.keys(snapshotPlayer.val());
	keysBeyblades = Object.keys(snapshotBeyblades.val());

	// Usa as arrays de keys como quiser
	console.log(keysPlayer);
	console.log(keysBeyblades);

	for (let i = 0; i < keysBeyblades.length; i++) {
		for (let ii = i + 1; ii < keysBeyblades.length; ii++) {
			if (i != ii) {
				generateBattles(keysBeyblades[i], keysBeyblades[ii]);
			}
		}
	}
});
