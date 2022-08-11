var url_string = window.location.href
var url = new URL(url_string);
var regiao = url.searchParams.get("regiao");
var idusuario = url.searchParams.get("idusuario");
var nmusuario = url.searchParams.get("nmusuario");
var cor = url.searchParams.get("color");
var corfonte = url.searchParams.get("fontcolor");
var dadosimportantesElo = {}
var dadosimportantesmmr = {}
var dadosimportantesultimojogo = {}
var dadosimportantesnickconta = {}

function fazGet(url) {
    let request = new XMLHttpRequest()
    request.open("GET", url, false)
    request.send()
    return request.responseText
}

function main() {
    let dados = fazGet("https://api.henrikdev.xyz/valorant/v1/mmr/" + regiao + "/" + nmusuario + "/" + idusuario);
    var jsonData = JSON.parse(dados);
     dadosimportantesElo = (jsonData.data.currenttierpatched);
     dadosimportantesmmr = (jsonData.data.ranking_in_tier);
     dadosimportantesultimojogo = (jsonData.data.mmr_change_to_last_game);
     dadosimportantesnickconta = (jsonData.data.name);
     document.getElementById("textonmrank").style.backgroundColor = '#' + cor;
     document.getElementById("headerburrao").style.color = '#' + corfonte;
             console.log(dadosimportantesElo)
setTimeout(main, 15000);
}


function foda() {
    var stringrank = dadosimportantesElo
    var stringrankformatado = stringrank.replace(/\s+/g, '');
    document.getElementById("imgRank").src = "./resources/" + stringrankformatado + ".png"
    document.getElementById("headerburrao").innerHTML = dadosimportantesElo;
    document.getElementById("mmratual").innerHTML = dadosimportantesmmr;
    if(dadosimportantesultimojogo > 0) {
        document.getElementById("ultmmr").style.backgroundColor = "#0ccf3a";
        document.getElementById("ultimapartida").innerHTML = "Last Match: + " + dadosimportantesultimojogo + "pts";}
        else {
        document.getElementById("ultmmr").style.backgroundColor = "#e03838";
        document.getElementById("ultimapartida").innerHTML = "Last Match: " + dadosimportantesultimojogo + "pts";}
                console.log(dadosimportantesElo)
        setTimeout(main, 15000);
    }
main()
foda()