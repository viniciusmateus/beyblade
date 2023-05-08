// Variáveis iniciais
let keysPlayer,
	keysBeyblades,
	battleCount = 0;

// Função para listar em tabelas todas as batalhas possíveis
function generateBattles(first, second) {
	// Adiciona uma tabela a página
	$("#fullPage .container").append(
		'<table id="' + keysBeyblades.indexOf(first) + keysBeyblades.indexOf(second) + '" class="table table-dark table-adjust mt-3"><thead><tr><th scope="col">' + first + '</th><th></th><th scope="col">' + second + '</th></tr></thead><tbody class="lead"></tbody></table>'
	);

	// Loop de preenchimento da tabela
	for (let i = 0; i < keysPlayer.length; i++) {
		for (let ii = 0; ii < keysPlayer.length; ii++) {
			if (i != ii) {
				battleCount++;
				$("#" + keysBeyblades.indexOf(first) + keysBeyblades.indexOf(second) + " tbody").append(
					'<tr id="battle' +
						battleCount +
						'"><td>' +
						keysPlayer[i] +
						'</td><td><span class="' +
						keysPlayer[i] +
						keysBeyblades.indexOf(first) +
						'"><span class="points"></span></span>vs<span class="' +
						keysPlayer[ii] +
						keysBeyblades.indexOf(second) +
						'"><span class="points"></span></span></td><td>' +
						keysPlayer[ii] +
						"</td></tr>"
				);
			}
		}
	}
}

function getCookieValue(cookieName) {
	// Obtem todos os cookies
	const cookies = document.cookie.split("; ");

	// Procura pelo cookie desejado
	for (let i = 0; i < cookies.length; i++) {
		const [name, value] = cookies[i].split("=");
		if (name === cookieName) {
			return value;
		}
	}

	// Retorna null se o cookie não foi encontrado
	return null;
}

let playersData = {},
	beybladesData = {};

function processBattlesData(target) {
	playersData = {};
	beybladesData = {};
	database
		.ref("edition/" + target + "/battles")
		.once("value")
		.then(function (snapshot) {
			let battles = snapshot.val();

			// Itera sobre cada batalha
			for (let battleId in battles) {
				let battle = battles[battleId];

				// Itera sobre cada jogador na batalha
				for (let player in battle) {
					let points = battle[player].points,
						beyblade = battle[player].beyblade;

					// Soma os pontos do jogador
					if (playersData[player]) {
						playersData[player] += points;
					} else {
						playersData[player] = points;
					}

					// Soma os pontos da beyblade
					if (beybladesData[beyblade]) {
						beybladesData[beyblade] += points;
					} else {
						beybladesData[beyblade] = points;
					}
				}
			}
		});
}

// Função para puxar a listagem de todas edições do DATABASE e adicionar uma opção de carregamento
function pushEdition(select) {
	// Seleciona o elemento select do seu HTML usando jQuery
	const selectElement = $(select);

	// Adiciona uma opção "Carregando..."
	const loadingOption = $("<option disable>");
	loadingOption.val("");
	loadingOption.text("Carregando...");
	selectElement.append(loadingOption);

	// Recupera uma referência do seu banco de dados
	const editionsRef = database.ref("edition");

	// Recupera os dados em tempo real usando o método "on"
	editionsRef.on("value", (snapshot) => {
		// Remove todas as opções do select antes de adicionar as novas opções
		selectElement.empty();

		// Adiciona a opção "Selecione a edição" como primeira opção
		const defaultOption = $("<option>");
		defaultOption.val("");
		defaultOption.text("--");
		selectElement.append(defaultOption);

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
}

// Execução das funções nos campos select
pushEdition("#selectionEdition");
pushEdition("#manageEdition");

// Comandos ao selecionar edições no menu
$("#selectionEdition").on("change", function () {
	document.cookie = "selectedEdition=" + $("#selectionEdition").val();

	// Definição de path para o DATABASE
	let refPlayer = database.ref("edition/" + $(this).val() + "/players"),
		refBeyblades = database.ref("edition/" + $(this).val() + "/beyblades");
	promise1 = refPlayer.once("value");
	promise2 = refBeyblades.once("value");

	// Limpeza de dados da página
	$("#fullPage .container table").remove();

	// Efeito de transição
	$("#titleEdition").text($(this).val()).parent().fadeIn();

	//Adiciona função de aparecer somente se houver resultados
	$(".podiums").fadeIn();

	// Função de criação dos podiums
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

	// Execução das funções para criação dos podiums
	getPodiums(refBeyblades, "#podiumBeyblade");
	getPodiums(refPlayer, "#podiumPlayer");

	// Coleta de dados do DATABASE para construção das tabelas de batalhas
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

			// Função obter pontuações das batalhas
			function getPoints(target) {
				database
					.ref("edition/" + $("#selectionEdition").val() + "/battles")
					.once("value")
					.then(function (snapshot) {
						snapshot.forEach(function (childSnapshot) {
							let divId = childSnapshot.key,
								div = $("#" + divId);

							database
								.ref("edition/" + $("#selectionEdition").val() + "/battles/" + divId)
								.once("value")
								.then(function (snapshot) {
									let battleData = snapshot.val();

									let players = Object.keys(battleData);
									for (let i = 0; i < players.length; i++) {
										let player = players[i],
											points = battleData[player].points,
											beyblade = battleData[player].beyblade;

										$("#" + div.attr("id") + " ." + player + keysBeyblades.indexOf(beyblade) + " " + target).val(points);
									}
								});
						});
					});
			}

			// Executa a função e preenche os campos
			$(document).ready(function () {
				database
					.ref("edition/" + $("#selectionEdition").val() + "/battles")
					.once("value")
					.then(function (snapshot) {
						snapshot.forEach(function (childSnapshot) {
							let divId = childSnapshot.key,
								div = $("#" + divId);

							database
								.ref("edition/" + $("#selectionEdition").val() + "/battles/" + divId)
								.once("value")
								.then(function (snapshot) {
									let battleData = snapshot.val();

									let players = Object.keys(battleData);
									for (let i = 0; i < players.length; i++) {
										let player = players[i],
											points = battleData[player].points,
											beyblade = battleData[player].beyblade;

										$("#" + div.attr("id") + " ." + player + keysBeyblades.indexOf(beyblade) + " .points")
											.val(points)
											.text(points);
									}
								});
						});
					});
			});

			// Executa comandos quando entra no sistema
			auth.onAuthStateChanged(function (user) {
				if (user) {
					$("tbody tr td>span .inputBattles").remove();
					$("tbody td .points").hide();
					$("tbody tr td>span").append("<input type='text' class='inputBattles'>");

					$(document).ready(function () {
						getPoints("input");

						$(".inputBattles").mask("00");

						$(".inputBattles").on("blur", function () {
							let className = $(this).parent().attr("class"),
								getBeyblade = keysBeyblades[className.at(-1)],
								getPlayer = className.slice(0, -1),
								getPoints = parseInt($(this).val()),
								getBattle = $(this).parent().parent().parent().attr("id"),
								selectedEdition = getCookieValue("selectedEdition");

							if (isNaN(getPoints)) {
								database
									.ref("edition/" + selectedEdition + "/battles")
									.child(getBattle)
									.child(getPlayer)
									.set(null);

								getPoints = 0;
							}

							let battleScore = {
								beyblade: getBeyblade,
								points: getPoints,
							};

							database
								.ref("edition/" + selectedEdition + "/battles")
								.child(getBattle)
								.child(getPlayer)
								.set(battleScore);

							processBattlesData(selectedEdition);
							$("#selectionEdition").val(selectedEdition);

							database
								.ref("edition/" + selectedEdition + "/battles")
								.once("value")
								.then(function (snapshot) {
									database.ref("edition/" + getCookieValue("selectedEdition") + "/players").update(playersData);
									console.log(beybladesData);
									database.ref("edition/" + getCookieValue("selectedEdition") + "/beyblades").update(beybladesData);
								})
								.catch(function (error) {
									// Ocorreu um erro ao obter os dados
									console.error(error);
								});
						});
					});
				} else {
					$("tbody tr td span .inputBattles").remove();
					$("tbody td .points").show();
				}
			});
		})
		.catch(function (error) {
			console.log(error);
		});

	processBattlesData($("#selectionEdition").val());
});

// Usa o método Promise.all() para buscar os dados de ambos os nós juntos

// Obtenha uma referência ao provedor do Google
const provider = new firebase.auth.GoogleAuthProvider();

// Registre o usuário com o provedor do Google
$("#googleAuthButton").on("click", function () {
	auth.signInWithPopup(provider)
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
	auth.signOut()
		.then(() => {
			$("tbody tr td span .inputBattles").remove();
		})
		.catch((error) => {
			// Houve um erro ao deslogar o usuário
			console.error(error);
		});
});

$("#manageEdition").on("change", function () {
	if ($(this).val() != null) {
		$("#removeEditionBtn").attr({
			"data-bs-toggle": "modal",
			"data-bs-target": "#confirmModal",
		});
	}
});

$("#removeEditionBtn").on("click", function () {
	$(".showEdition").text($("#manageEdition").val() + "ª edição");
});

$("#confirmRemove").on("click", function () {
	database.ref("/edition/" + $("#manageEdition").val()).remove();
	$("#confirmModal").modal("hide");
	$("#manageEditionModal").modal("show");
});

$("#addEdition").on("click", function () {
	// Get the latest child node and create a new node with an incremented number
	database
		.ref("edition")
		.limitToLast(1)
		.once("child_added", function (snapshot) {
			const lastKey = snapshot.key;
			const newKey = parseInt(lastKey) + 1;
			const newNodeRef = database.ref("edition").child(newKey);

			// Set the data for the new node
			newNodeRef.set({
				battles: "",
				beyblades: "",
				players: "",
			});
		});
});

// Verificar se o usuário já está logado ao carregar a página
auth.onAuthStateChanged((user) => {
	if (user) {
		// O usuário já está logado
		$(".adminButton").hide();
		$(".signOutAuth").show();
		$("#editionManager").show();

		$(".welcome").text("Olá " + auth.currentUser.displayName);
	} else {
		// O usuário não está logado
		$(".adminButton").show();
		$(".signOutAuth").hide();
		$("#editionManager").hide();
		$(".welcome").text("");
	}
});
