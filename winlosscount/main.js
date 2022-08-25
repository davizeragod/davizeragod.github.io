let url_string = window.location.href;
let url = new URL(url_string);
let puuid = {};
let partida1 = {};
let partida2 = {};
let jsonDataWL = {};
let reqpuuid = {};
let dados = {};
let time = {};
let win = 0;
let lose = 0;
let regiao = url.searchParams.get("regiao");
let idusuario = url.searchParams.get("idusuario");
let nmusuario = url.searchParams.get("nmusuario");
let empatou = {};

function fazGet(url) {
    let request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.setRequestHeader("Access-Control-Allow-Origin", "*")
    request.send();
    return request.responseText;
  }
function setapuuid(){
reqpuuid = fazGet("https://api.henrikdev.xyz/valorant/v1/account/"+
  nmusuario +
  "/" +
  idusuario);
  let parsepuuid = JSON.parse(reqpuuid)
  puuid = parsepuuid.data.puuid;
}

function get(){
    dados = fazGet("https://api.henrikdev.xyz/valorant/v3/matches/"
      + regiao +
      "/" +
      nmusuario +
      "/" +
      idusuario + 
     "?filter=competitive");
    jsonDataWL = JSON.parse(dados);
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
    document.getElementById("WLvalue").innerHTML = win + "/" + lose
}

function main(){
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
setInterval(main, 30000);
AtualizaVisual();