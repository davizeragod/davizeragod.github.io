var url_string = window.location.href;
var url = new URL(url_string);
var sParams = url.searchParams;
var regiao = url.searchParams.get("regiao");
var idusuario = url.searchParams.get("idusuario");
var nmusuario = url.searchParams.get("nmusuario");
var cor = url.searchParams.get("color");
var corfonte = url.searchParams.get("fontcolor");
var alpha = url.searchParams.get("alpha");
var bgurl = url.searchParams.get("bu");
var icourl = url.searchParams.get("iu");
var retornostatus = {};
var dadosimportantesElo = {};
var dadosimportantesmmr = {};
var dadosimportantesultimojogo = {};
var dadosimportantesnickconta = {};
var leaderboardajustado = {};
var dadosimportantesTier = {};
var dadosisunranked = {};
var dadosleaderboard = {};
var cssbarradepts = document.querySelector(":root").style;
const bgpts = document.getElementById("ultmmr");
const corbg = document.getElementById("textonmrank");
var rankatuallog = {};
var rankatualizado = {};

function fazGet(url) {
  let request = new XMLHttpRequest();
  request.open("GET", url, false);
  request.setRequestHeader("Access-Control-Allow-Origin", "*")
  request.send();
  return request.responseText;
}

function leaderboard() {
  const reglow = regiao.toLowerCase();
  let lb = fazGet(
    "https://api.henrikdev.xyz/valorant/v1/leaderboard/" +
      reglow +
      "?name=" +
      nmusuario +
      "&tag=" +
      idusuario
  );
  var jsonDataLB = JSON.parse(lb);
  dadosleaderboard = jsonDataLB.data[0].leaderboardRank;
}

function main() {
  let dados = fazGet(
    "https://api.henrikdev.xyz/valorant/v2/mmr/" +
      regiao +
      "/" +
      nmusuario +
      "/" +
      idusuario
  );
  var jsonData = JSON.parse(dados);
  retornostatus = jsonData.status;
  if (retornostatus != "200") {
    main()
  }
  dadosimportantesElo = jsonData.data.current_data.currenttierpatched;
  dadosimportantesmmr = jsonData.data.current_data.ranking_in_tier;
  dadosimportantesTier = jsonData.data.current_data.currenttier;
  retornostatus = jsonData.status;
  dadosimportantesultimojogo =
    jsonData.data.current_data.mmr_change_to_last_game;
  dadosimportantesnickconta = jsonData.data.name;
  dadosisunranked = jsonData.data.current_data.games_needed_for_rating;
}

function foda() {
  if (dadosisunranked != "0") {
    dadosimportantesElo = "Unranked";
    dadosimportantesmmr = "100";
    dadosimportantesultimojogo = "nRanked";
  }
  if (dadosimportantesmmr > "100") {
    dadosimportantesmmr = "0";
  }
  document.getElementById("imgRank").src = "./Resources/" + dadosimportantesTier + ".png"
  var atualporc = dadosimportantesmmr + "%";
  document.getElementById("headerburrao").innerHTML = dadosimportantesElo;
  if (dadosimportantesTier === 27) {
    leaderboard();
    document.getElementById("headerburrao").innerHTML =
      dadosimportantesElo + " #" + dadosleaderboard;
  }
  document.getElementById("mmratual").innerHTML = dadosimportantesmmr;
  cssbarradepts.setProperty("--progresspontinho", atualporc);

  const ultpart = document.getElementById("ultimapartida");
  if (dadosimportantesultimojogo === "nRanked") {
    ultpart.innerHTML = "Unranked";
  } else if (dadosimportantesTier >= "24" && dadosimportantesultimojogo === 0) {
    ultpart.innerHTML = dadosimportantesmmr + " pts";
    bgpts.style.backgroundcolor = "grey";
  } else if (dadosimportantesTier >= "24" && dadosimportantesultimojogo >= 1) {
    ultpart.innerHTML = dadosimportantesmmr + " pts";
    atualporc = "100%";
    cssbarradepts.setProperty("--progresspontinho", atualporc);
  } else if (dadosimportantesTier >= "24" && dadosimportantesultimojogo <= -1) {
    ultpart.innerHTML = dadosimportantesmmr + " pts";
    atualporc = "0%";
    cssbarradepts.setProperty("--progresspontinho", atualporc);
  } else if (dadosimportantesultimojogo === 0) {
    ultpart.innerHTML = dadosimportantesmmr + " pts";
  } else if (dadosimportantesultimojogo >= 1) {
    ultpart.innerHTML = dadosimportantesmmr + " pts";
  } else if (dadosimportantesultimojogo <= -1) {
    ultpart.innerHTML = dadosimportantesmmr + " pts";
  }
  document.getElementById("headerburrao").style.color = "#" + corfonte;
}

if (sParams.get("alpha") === "ss") {
  corbg.style.backgroundColor = "transparent";
} else if (sParams.get("alpha") === "nn") {
  corbg.style.backgroundColor = "#" + cor;
}
corbg.style.backgroundImage = "url(" + bgurl + ")";
if (icourl.length == 0) {
  document.getElementById("imgcantinho").style.display = "none";
} else {
  document.getElementById("imgcantinho").style.content = "url(" + icourl + ")";
}
main();
rankatuallog = dadosimportantesTier;
foda();


setInterval(main, 15000);
setInterval(foda, 15000);
