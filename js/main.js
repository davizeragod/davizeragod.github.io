const chkboxicon = document.getElementById("fundoimg");
const chkboxbg = document.getElementById("iconlado");
const urlicon = document.getElementById("urlicon");
const urlbg = document.getElementById("urlbg");
const botao = document.querySelector("button");
const cortexto = document.getElementById("txt");
const corfundo = document.getElementById("fundo");
const iframe = document.getElementById("framefoda");
const chfundoimg = document.getElementById("fundoimg");
const chfundoico = document.getElementById("iconlado");
const iframetxt = document.getElementById("lblframe");
const reg = document.getElementById("regiao");
const idu = document.getElementById("lname");
const nmu = document.getElementById("fname");
const apikey = document.getElementById("apikey");
const trchck = document.getElementById("transparentcheck");
const disc = document.getElementById("bannerpic");
const divdisc = document.getElementById("lblbanner");
let trachck = {};

chfundoico.addEventListener("change", (event) => {
  if (event.currentTarget.checked) {
    document.getElementById("urlicon").disabled = false;
  } else {
    document.getElementById("urlicon").disabled = true;
  }
});

chfundoimg.addEventListener("change", (event) => {
  if (event.currentTarget.checked) {
    document.getElementById("urlbg").disabled = false;
  } else {
    document.getElementById("urlbg").disabled = true;
  }
});

reg.addEventListener("change", function handlechange(event) {
  if (event.target.value === 'AP') {
    disc.style.display = "inline-block";
    divdisc.style.display = "flex";
  } else {
    disc.style.display = "none";
    divdisc.style.display = "none";
  }
});

botao.onclick = function () {
  var regiao = reg.value;
  let idusu = idu.value;
  let nmusu = nmu.value;
  let bgurl = urlbg.value;
  let chaveapi = apikey.value;
  let iurl = urlicon.value;
  TxtUrlBg = {};
  TxtUrlIco = {};

  if (urlbg.value.length != 0) {
    localStorage.setItem(TxtUrlBg, bgurl);
  }
  if (urlicon.value.length != 0) {
    localStorage.setItem(TxtUrlIco, iurl);
  }

  const link = document.querySelector("textarea");
  let fontcolor = cortexto.value.replace("#", "");
  let color = corfundo.value.replace("#", "");
  if (idu.value.length == 0) {
    alert("Please fill all fields");
    return;
  }
  if (nmu.value.length == 0) {
    alert("Please fill all fields");
    return;
  }

  if (trchck.checked) {
    trachck = "ss";
  } else {
    trachck = "nn";
  }
  link.value =
    window.location.origin +
    "/v2/main.html?regiao=" +
    regiao +
    "&nmusuario=" +
    nmusu +
    "&idusuario=" +
    idusu +
    "&fontcolor=" +
    fontcolor +
    "&color=" +
    color +
    "&alpha=" +
    trachck +
    "&iu=" +
    encodeURIComponent(iurl) +
    "&bu=" +
    encodeURIComponent(bgurl) +
    "&apikey=" +
    chaveapi;


  iframe.src = link.value;
  iframetxt.innerHTML = "Preview:";
};
