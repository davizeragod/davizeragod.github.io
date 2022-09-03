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
var checkifnull = {};
var dadosimportantesTier = {};
var dadosisunranked = {};
var dadosleaderboard = {};
var cssbarradepts = document.querySelector(":root").style;
const bgpts = document.getElementById("ultmmr");
const corbg = document.getElementById("textonmrank");
var rankatuallog = {};
var rankatualizado = {};
var isunrankedatoatual = {};
var jogosnecessarios = {};

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
  isunrankedatoatual = jsonData.data.by_season.e5a2.number_of_games;
  nodataseasonatual = jsonData.data.by_season.e5a2.error;
  retornostatus = jsonData.status;
  checkifnull = jsonData.data.current_data.currenttier;
  dadosimportantesElo = jsonData.data.current_data.currenttierpatched;
  dadosimportantesmmr = jsonData.data.current_data.ranking_in_tier;
  dadosimportantesmmrtxt = jsonData.data.current_data.ranking_in_tier;
  dadosimportantesTier = jsonData.data.current_data.currenttier;
  retornostatus = jsonData.status;
  dadosimportantesultimojogo =
    jsonData.data.current_data.mmr_change_to_last_game;
  dadosimportantesnickconta = jsonData.data.name;
  jateverank = jsonData.data.current_data.old;
  jogosnecessarios = jsonData.data.current_data.games_needed_for_rating;
}

function foda() {
  if (isunrankedatoatual < "1" || nodataseasonatual == "No data Available" && jogosnecessarios == "1") {
    dadosimportantesElo = "Unranked";
    dadosimportantesmmr = "100";
    dadosimportantesultimojogo = "nRanked";
    dadosimportantesTier = "Unranked"
    dadosimportantesmmrtxt
    if (nodataseasonatual = "No data Available") {
      isunrankedatoatual = 0;
    }
  }
  if (dadosimportantesmmr > "100") {
    dadosimportantesmmr = "0";
  }
  document.getElementById("imgRank").src = "./Resources/" + dadosimportantesTier + ".png"
  var atualporc = dadosimportantesmmr + "%";
  document.getElementById("headerburrao").innerHTML = dadosimportantesElo + '&nbsp &nbsp &nbsp;' +dadosimportantesmmrtxt + "RR";
  if (dadosimportantesultimojogo === "nRanked"){
    document.getElementById("headerburrao").innerHTML =
      dadosimportantesElo;
  }
  if (dadosimportantesTier === 27) {
    leaderboard();
    document.getElementById("headerburrao").innerHTML =
      dadosimportantesElo + " #" + dadosleaderboard;
  }
  document.getElementById("mmratual").innerHTML = dadosimportantesmmr;
  cssbarradepts.setProperty("--progresspontinho", atualporc);

  const ultpart = document.getElementById("ultimapartida");
  if (dadosimportantesultimojogo === "nRanked" && jateverank === false) {
    ultpart.innerHTML = "Unranked " + isunrankedatoatual+"/1";
  } else if (dadosimportantesultimojogo === "nRanked" && jateverank === true) {
    ultpart.innerHTML = "Unranked " + isunrankedatoatual+"/5";}
  else if (dadosimportantesTier >= "24" && dadosimportantesultimojogo === 0) {
    ultpart.innerHTML = "Last Match: " + dadosimportantesultimojogo + "pts";
    bgpts.style.backgroundcolor = "grey";
  } else if (dadosimportantesTier >= "24" && dadosimportantesultimojogo >= 1) {
    ultpart.innerHTML = "Last Match: " + dadosimportantesultimojogo + "pts";
    atualporc = "100%";
    cssbarradepts.setProperty("--progresspontinho", atualporc);
  } else if (dadosimportantesTier >= "24" && dadosimportantesultimojogo <= -1) {
    ultpart.innerHTML = "Last Match: " + dadosimportantesultimojogo + "pts";
    atualporc = "0%";
    cssbarradepts.setProperty("--progresspontinho", atualporc);
  } else if (dadosimportantesultimojogo === 0) {
    ultpart.innerHTML = "Last Match: " + dadosimportantesultimojogo + "pts";
  } else if (dadosimportantesultimojogo >= 1) {
    ultpart.innerHTML = "Last Match: + " + dadosimportantesultimojogo + "pts";
  } else if (dadosimportantesultimojogo <= -1) {
    ultpart.innerHTML = "Last Match: " + dadosimportantesultimojogo + "pts";
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
foda();
rankatuallog = dadosimportantesTier;
function checadados(){
  if (retornostatus == "200" && checkifnull != null){
    foda()
    }
}
setInterval(main, 15000);
setInterval(checadados, 15000);
