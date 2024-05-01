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
let puuid = {};
let partida1 = {};
let partida2 = {};
let jsonDataWL = {};
let reqpuuid = {};
let dadoswl = {};
let time = {};
let win = 0;
let lose = 0;
let empatou = {};
let semwc = url.searchParams.has("swl")
let content = {};
let parsedContent = {};
let matches = {};
let arrayMatches = [];
let novaArray = [];
let hsrateField = 0;
let bsrateField = 0;
let lsrateField = 0;
let kills = 0;
let deaths = 0;
let calcKD = 0;
let calcHS = 0;
let calcLS = 0;
let calcBS = 0;
let jsonUltimaPartida = {};
let novoObj = {};
let NovoobjID = {};

function fazGet(url) {
  let request = new XMLHttpRequest();
  request.open("GET", url, false);
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
  isunrankedatoatual = jsonData.data.by_season.e8a3.number_of_games;
  nodataseasonatual = jsonData.data.by_season.e8a3.error;
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
  document.getElementById("headerburrao").innerHTML = dadosimportantesElo + '&nbsp &nbsp;' +dadosimportantesmmrtxt + "RR";
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
    ultpart.innerHTML = "Unranked " + isunrankedatoatual+"/1";}
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
  document.getElementById("WLvalue").style.color = "#" + corfonte;
  document.getElementById('kd').style.color = "#" + corfonte;
  document.getElementById('hsr').style.color = "#" + corfonte;

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

if (semwc === false){
  function setapuuid(){
    reqpuuid = fazGet("https://api.henrikdev.xyz/valorant/v1/account/"+
      nmusuario +
      "/" +
      idusuario);
      let parsepuuid = JSON.parse(reqpuuid)
      puuid = parsepuuid.data.puuid;
    }
    
    function get(){
        dadoswl = fazGet("https://api.henrikdev.xyz/valorant/v3/matches/"
          + regiao +
          "/" +
          nmusuario +
          "/" +
          idusuario + 
         "?filter=competitive");
        jsonDataWL = JSON.parse(dadoswl);
    }
    
    function getprimeirapartida(){
      get();
      partida1 = jsonDataWL.data[0].metadata.matchid;
    return partida1;
    }
    
    function achatime(){
        let timedojogador = jsonDataWL.data[0].players.all_players.find(jogador => jogador.puuid === puuid);
        time = timedojogador.team;
        return time.toLowerCase()
    }
    
    function venceu(){
        if(jsonDataWL.data[0].teams.red.has_won == false && jsonDataWL.data[0].teams.blue.has_won == false){
            empatou = 'S'
        }
        else{
            empatou = 'N'
        }
        timevenceu = jsonDataWL.data[0].teams[achatime()].has_won;
        return timevenceu;
    }
    
    function AtualizaVisual(){
        document.getElementById("WLvalue").innerHTML = win + " Win / " + lose + " Lose";
    }
    
    function winlose(){
        get();
        venceu();
        partida2 = jsonDataWL.data[0].metadata.matchid;
        if (partida2 != partida1){
                if(timevenceu === true){
                    var totalwin = win + 1;
                    win = totalwin;
                    partida1 = jsonDataWL.data[0].metadata.matchid;
                    AtualizaVisual();
                }
                else if(timevenceu===false && empatou === 'N'){
                    var totallose = lose + 1;
                    lose = totallose;
                    partida1 = jsonDataWL.data[0].metadata.matchid;
                }
        }
        AtualizaVisual()
    }
    
    
    setapuuid()
    getprimeirapartida()
    setInterval(winlose, 30000);
    AtualizaVisual();
}
else if (semwc === true){
  document.getElementById("headerburrao").style.top = "-5px";
  document.getElementById("WLvalue").style.display = none;

}

let corpoRequest = {
  type: "matchhistory",
  value: puuid,
  region: regiao,
  queries: "?startIndex=0&endIndex=20&queue=competitive",
};

async function fazFetch(puuid, regiao) {
  const request = await fetch("https://api.henrikdev.xyz/valorant/v1/raw", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "matchhistory",
      value: puuid,
      region: regiao,
      queries: "?startIndex=0&endIndex=20&queue=competitive",
    }),
  });
  content = await request.json();

  console.log(content);
}

function setapuuidNew() {
  reqpuuid = fazGet(
    "https://api.henrikdev.xyz/valorant/v1/account/" +
      nmusuario +
      "/" +
      idusuario
  );
  let parsepuuid = JSON.parse(reqpuuid);
  puuid = parsepuuid.data.puuid;
}

function getMatches() {
  fazFetch(puuid, regiao);
  setTimeout(ParseMatches,3000)
}

function ParseMatches() {
  matches = content.History;
  for (let i = 0; i < matches.length; i++) {
    let obj = matches[i].MatchID;
    arrayMatches.push(obj);
  }
  console.log(arrayMatches);
  for (let i = 0; i < arrayMatches.length; i++) {
    let objID = matches[i].MatchID;
    dadoPartida = fazGet(
      "https://api.henrikdev.xyz/valorant/v2/match/" + objID
    );
    jsonDadoPartida = JSON.parse(dadoPartida);
    let Player = jsonDadoPartida.data.players.all_players.find(
      (jogador) => jogador.puuid === puuid
    );
    hsrateField = parseInt(hsrateField) + Number(Player.stats.headshots);
    bsrateField = parseInt(bsrateField) + Number(Player.stats.bodyshots);
    lsrateField = parseInt(lsrateField) + Number(Player.stats.legshots);
    deaths = deaths + parseInt(Player.stats.deaths);
    kills = kills + parseInt(Player.stats.kills);
  }
  calcKD = parseFloat(kills / deaths).toFixed(2);
  calcHS =
    Math.round(
      (hsrateField / (hsrateField + bsrateField + lsrateField)) * 100
    ) + "%";
  calcLS =
    Math.round(
      (bsrateField / (hsrateField + bsrateField + lsrateField)) * 100
    ) + "%";
  calcBS =
    Math.round(
      (lsrateField / (hsrateField + bsrateField + lsrateField)) * 100
    ) + "%";
    document.getElementById('kd').innerHTML = 'K/D&nbsp' + calcKD;
    document.getElementById('hsr').innerHTML = "HS " + calcHS;
}

function getLastMatch() {
  novaArray = [];
  novoObj = [];
  ultimaPartida = fazGet(
    "https://api.henrikdev.xyz/valorant/v3/matches/" +
      regiao +
      "/" +
      nmusuario +
      "/" +
      idusuario +
      "?filter=competitive"
  );
  jsonUltimaPartida = JSON.parse(ultimaPartida);
  let IDultimaPartida = jsonUltimaPartida.data[0].metadata.matchid;
  let Partidas = jsonUltimaPartida.data;
  let partidasNoData = jsonUltimaPartida;
  if (arrayMatches.includes(IDultimaPartida)) {
  } else {
    for (let i = 0; i < Partidas.length; i++) {
      novoObj = partidasNoData.data[i].metadata.matchid;
      if (arrayMatches.includes(novoObj)) {
      } else {
        novaArray.push(novoObj);
      }
    }
    for (let i = 0; i < novaArray.length; i++) {
      NovoobjID = novaArray[i];
      ultimaPartidaDados = fazGet(
        "https://api.henrikdev.xyz/valorant/v2/match/" + NovoobjID
      );
      jsonDadoPartida = JSON.parse(ultimaPartidaDados);
      let Player = jsonDadoPartida.data.players.all_players.find(
        (jogador) => jogador.puuid === puuid
      );
      hsrateField = parseInt(hsrateField) + Number(Player.stats.headshots);
      bsrateField = parseInt(bsrateField) + Number(Player.stats.bodyshots);
      lsrateField = parseInt(lsrateField) + Number(Player.stats.legshots);
      deaths = deaths + parseInt(Player.stats.deaths);
      kills = kills + parseInt(Player.stats.kills);
    }
    newArray = arrayMatches.concat(novaArray);
    arrayMatches = newArray;
  }
}

function kdhs() {
  getLastMatch();
  calcKD = parseFloat(kills / deaths).toFixed(2);
  calcHS =
    Math.round(
      (hsrateField / (hsrateField + bsrateField + lsrateField)) * 100
    ) + "%";
  calcLS =
    Math.round(
      (bsrateField / (hsrateField + bsrateField + lsrateField)) * 100
    ) + "%";
  calcBS =
    Math.round(
      (lsrateField / (hsrateField + bsrateField + lsrateField)) * 100
    ) + "%";
    document.getElementById('kd').innerHTML = 'K/D&nbsp' + calcKD;
    document.getElementById('hsr').innerHTML = "HS " + calcHS;
}

setapuuidNew();
getMatches();
setInterval(kdhs, 60000);
