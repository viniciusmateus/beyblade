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

// Seleciona o elemento select do seu HTML usando jQuery
const selectElement = $("#selectionEdition");

// Adiciona uma opção "Carregando..."
const loadingOption = $("<option>");
loadingOption.val("");
loadingOption.text("Carregando...");
selectElement.append(loadingOption);

// Recupera uma referência do seu banco de dados
const editionsRef = database.ref("edition");

// Recupera os dados uma vez
editionsRef.once("value", (snapshot) => {
	// Remove a opção "Carregando..."
	loadingOption.remove();

	// Itera sobre todos os nós filhos do snapshot e adiciona uma nova opção ao select
	snapshot.forEach((childSnapshot) => {
		const key = childSnapshot.key;
		const value = key;
		const text = `${key}ª edição`;

		const option = $("<option>");
		option.val(value);
		option.text(text);
		selectElement.append(option);
	});
});

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

			auth.onAuthStateChanged(function (user) {
				if (user) {
					$("tbody tr td span .inputBattles").remove();
					$("tbody tr td span").append("<input type='number' class='inputBattles'>");
				} else {
					$("tbody tr td span .inputBattles").remove();
				}
			});

			$(document).ready(function () {
				firebase
					.database()
					.ref("edition/" + $("#selectionEdition").val() + "/battles")
					.once("value")
					.then(function (snapshot) {
						snapshot.forEach(function (childSnapshot) {
							var divId = childSnapshot.key;
							var div = $("#" + divId);

							firebase
								.database()
								.ref("edition/" + $("#selectionEdition").val() + "/battles/" + divId)
								.once("value")
								.then(function (snapshot) {
									var battleData = snapshot.val();

									var players = Object.keys(battleData);
									for (var i = 0; i < players.length; i++) {
										var player = players[i];
										var points = battleData[player].points;
										var beyblade = battleData[player].beyblade;

										$("#" + div.attr("id") + " ." + player + keysBeyblades.indexOf(beyblade) + " input").val(points);
									}
								});
						});
					});

				$(".inputBattles").on("blur", function () {
					let className = $(this).parent().attr("class"),
						getBeyblade = keysBeyblades[className.at(-1)],
						getPlayer = className.slice(0, -1),
						getPoints = parseInt($(this).val()),
						getBattle = $(this).parent().parent().parent().attr("id");

					let battleScore = {
						beyblade: getBeyblade,
						points: getPoints,
					};

					database
						.ref("edition/" + $("#selectionEdition").val() + "/battles")
						.child(getBattle)
						.child(getPlayer)
						.set(battleScore);
				});
			});
		})
		.catch(function (error) {
			console.log(error);
		});
});

// Usa o método Promise.all() para buscar os dados de ambos os nós juntos

// Obtenha uma referência ao provedor do Google
const provider = new firebase.auth.GoogleAuthProvider();

// Registre o usuário com o provedor do Google
$("#googleAuthButton").on("click", function () {
	firebase
		.auth()
		.signInWithPopup(provider)
		.then((result) => {
			// O usuário foi registrado com sucesso
			const user = result.user;
			if (user.uid) {
			}
			$("#authModal").modal("hide");
			$("tbody tr td span").append('<input type="text" class="inputBattles" />');
		})
		.catch((error) => {
			// Houve um erro ao registrar o usuário
			console.error(error);
		});
});

$(".signOutAuth").on("click", function () {
	firebase
		.auth()
		.signOut()
		.then(() => {
			$("tbody tr td span .inputBattles").remove();
		})
		.catch((error) => {
			// Houve um erro ao deslogar o usuário
			console.error(error);
		});
});

// Verificar se o usuário já está logado ao carregar a página
firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		// O usuário já está logado
		$(".adminButton").hide();
		$(".signOutAuth").show();
	} else {
		// O usuário não está logado
		$(".adminButton").show();
		$(".signOutAuth").hide();
	}
});
