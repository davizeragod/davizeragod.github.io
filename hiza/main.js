const urlParams = new URLSearchParams(window.location.search);

const config = {
  regiao: urlParams.get("regiao") || "",
  idusuario: urlParams.get("idusuario") || "",
  nmusuario: urlParams.get("nmusuario") || "",
  cor: urlParams.get("color") || "",
  corfonte: urlParams.get("fontcolor") || "",
  alpha: urlParams.get("alpha") || "",
  bgurl: urlParams.get("bu") || "",
  icourl: urlParams.get("iu") || "",
  semWl: urlParams.has("swl"),
  showStats: urlParams.has("stats") && urlParams.get("stats") !== "0",
  apikey: urlParams.get("apikey") || "",
};

const dom = {
  rootStyle: document.documentElement.style,
  imgRank: document.getElementById("imgRank"),
  textoNmRank: document.getElementById("textonmrank"),
  imgCantinho: document.getElementById("imgcantinho"),
  headerRank: document.getElementById("headerburrao"),
  wlValue: document.getElementById("WLvalue"),
  ultMmr: document.getElementById("ultmmr"),
  ultimaPartida: document.getElementById("ultimapartida"),
  mmrAtual: document.getElementById("mmratual"),
  statsRow: document.getElementById("stats-row"),
  kd: document.getElementById("kd"),
  hsr: document.getElementById("hsr"),
};

const API_BASE = "https://api.henrikdev.xyz/valorant";

const state = {
  puuid: null,
  wins: 0,
  losses: 0,
  lastMatchId: null,
  processedMatchIds: new Set(),
  processedStatsMatchIds: new Set(),
  stats: {
    headshots: 0,
    bodyshots: 0,
    legshots: 0,
    kills: 0,
    deaths: 0,
  },
};

function buildApiUrl(path, queryParams = {}) {
  const url = new URL(`${API_BASE}${path}`);
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  if (config.apikey) {
    url.searchParams.set("api_key", config.apikey);
  }
  return url.toString();
}

async function fetchJson(path, queryParams = {}, options = undefined) {
  const response = await fetch(buildApiUrl(path, queryParams), options);
  return response.json();
}

function setupWatermarkFallback() {
  if (config.icourl) {
    dom.imgCantinho.src = config.icourl;
    return;
  }
  // Tenta carregar ./Resources/char.svg por padrão; se substituir por char.png, faz fallback automático
  dom.imgCantinho.onerror = () => {
    if (!dom.imgCantinho.src.endsWith("char.png")) {
      dom.imgCantinho.src = "./Resources/char.png";
    } else {
      dom.imgCantinho.style.display = "none";
    }
  };
}

function applyInitialStyles() {
  setupWatermarkFallback();

  if (config.alpha === "ss") {
    dom.textoNmRank.style.background = "transparent";
    dom.textoNmRank.style.borderColor = "transparent";
    dom.textoNmRank.style.boxShadow = "none";
  } else if (config.cor && config.cor.toLowerCase() !== "282b30") {
    dom.textoNmRank.style.backgroundColor = `#${config.cor}`;
  }

  if (config.bgurl) {
    dom.textoNmRank.style.backgroundImage = `url(${config.bgurl})`;
  }

  if (config.corfonte && config.corfonte.toLowerCase() !== "ffffff") {
    const fontColor = `#${config.corfonte}`;
    dom.headerRank.style.color = fontColor;
    dom.wlValue.style.color = fontColor;
  }

  if (config.semWl) {
    dom.wlValue.style.display = "none";
  }

  if (config.showStats && dom.statsRow) {
    dom.statsRow.classList.add("visible");
  }
}

function getLastMatchClass(mmrChange) {
  if (mmrChange > 0) return "rr-positive";
  if (mmrChange < 0) return "rr-negative";
  return "rr-accent";
}

function renderDemoPreview() {
  dom.imgRank.src = "./Resources/22.png";
  dom.headerRank.innerHTML = `Ascendant 2<span class="rr-accent">64RR</span>`;
  dom.wlValue.innerHTML = "3 Win / 1 Loss";
  dom.ultimaPartida.innerHTML = `Last Match: <span class="rr-negative">-21pts</span>`;
  dom.rootStyle.setProperty("--progresspontinho", "64%");
  if (config.showStats) {
    dom.kd.innerHTML = "K/D 1.32";
    dom.hsr.innerHTML = "HS 29%";
  }
}

async function fetchLeaderboardRank() {
  try {
    const region = config.regiao.toLowerCase();
    const json = await fetchJson(`/v1/leaderboard/${region}`, {
      name: config.nmusuario,
      tag: config.idusuario,
    });

    if (json.status === 404 || !Array.isArray(json.data) || !json.data[0]) {
      return null;
    }
    return json.data[0].leaderboardRank;
  } catch (error) {
    console.error("Erro ao buscar leaderboard:", error);
    return null;
  }
}

function extractActSeasonData(bySeason = {}) {
  const preferredActs = ["e11a6", "e11aVI"];
  for (const act of preferredActs) {
    if (bySeason[act]) {
      return {
        numberOfGames: bySeason[act].number_of_games ?? 0,
        hasNoData: Boolean(bySeason[act].error),
      };
    }
  }

  const seasonKeys = Object.keys(bySeason);
  if (seasonKeys.length > 0) {
    const latestSeason = bySeason[seasonKeys[seasonKeys.length - 1]];
    return {
      numberOfGames: latestSeason?.number_of_games ?? 0,
      hasNoData: Boolean(latestSeason?.error),
    };
  }

  return { numberOfGames: 0, hasNoData: true };
}

async function updateRank() {
  try {
    const encodedName = encodeURIComponent(config.nmusuario);
    const encodedTag = encodeURIComponent(config.idusuario);
    const json = await fetchJson(
      `/v2/mmr/${config.regiao}/${encodedName}/${encodedTag}`
    );

    if (json.status !== 200 || !json.data?.current_data) {
      return;
    }

    const current = json.data.current_data;
    if (current.currenttier === null && !current.games_needed_for_rating) {
      return;
    }

    const { numberOfGames, hasNoData } = extractActSeasonData(
      json.data.by_season
    );
    const gamesNeeded = Number(current.games_needed_for_rating ?? 0);
    const isUnranked =
      numberOfGames < 1 || (hasNoData && gamesNeeded >= 1);

    let eloText = current.currenttierpatched || "Unranked";
    let tier = Number(current.currenttier ?? 0);
    let rr = Number(current.ranking_in_tier ?? 0);
    let rrText = rr;
    let lastMmrChange = Number(current.mmr_change_to_last_game ?? 0);
    let gamesPlayedInAct = hasNoData ? 0 : numberOfGames;

    if (isUnranked) {
      eloText = "Unranked";
      tier = "Unranked";
      rr = 100;
    } else if (rr > 100) {
      rr = 0;
    }

    dom.imgRank.src = `./Resources/${tier}.png`;

    if (isUnranked) {
      dom.headerRank.innerHTML = eloText;
    } else if (tier === 27) {
      const lbRank = await fetchLeaderboardRank();
      dom.headerRank.innerHTML = lbRank
        ? `${eloText}<span class="rr-accent">#${lbRank}</span>`
        : `${eloText}<span class="rr-accent">${rrText}RR</span>`;
    } else {
      dom.headerRank.innerHTML = `${eloText}<span class="rr-accent">${rrText}RR</span>`;
    }

    let progressPercent = `${rr}%`;
    dom.mmrAtual.innerHTML = rr;

    if (isUnranked) {
      dom.ultimaPartida.innerHTML = `Unranked ${gamesPlayedInAct}/5`;
    } else if (tier >= 24) {
      const prefix = lastMmrChange >= 1 ? "+" : "";
      const matchClass = getLastMatchClass(lastMmrChange);
      dom.ultimaPartida.innerHTML = `Last Match: <span class="${matchClass}">${prefix}${lastMmrChange}pts</span>`;
      if (lastMmrChange === 0) {
        progressPercent = "0%";
      } else if (lastMmrChange >= 1) {
        progressPercent = "100%";
      } else if (lastMmrChange <= -1) {
        progressPercent = "0%";
      }
    } else {
      const prefix = lastMmrChange >= 1 ? "+" : "";
      const matchClass = getLastMatchClass(lastMmrChange);
      dom.ultimaPartida.innerHTML = `Last Match: <span class="${matchClass}">${prefix}${lastMmrChange}pts</span>`;
    }

    dom.rootStyle.setProperty("--progresspontinho", progressPercent);
  } catch (error) {
    console.error("Erro ao atualizar rank:", error);
  }
}

function renderWinLoss() {
  dom.wlValue.innerHTML = `${state.wins} Win / ${state.losses} Loss`;
}

async function ensurePuuid() {
  if (state.puuid) return state.puuid;
  const encodedName = encodeURIComponent(config.nmusuario);
  const encodedTag = encodeURIComponent(config.idusuario);
  const json = await fetchJson(`/v1/account/${encodedName}/${encodedTag}`);
  state.puuid = json?.data?.puuid || null;
  return state.puuid;
}

async function fetchLatestCompetitiveMatch() {
  const encodedName = encodeURIComponent(config.nmusuario);
  const encodedTag = encodeURIComponent(config.idusuario);
  const json = await fetchJson(
    `/v3/matches/${config.regiao}/${encodedName}/${encodedTag}`,
    { mode: "competitive", size: 1 }
  );
  return json?.data?.[0] || null;
}

function evaluateMatchOutcome(match) {
  const player = match?.players?.all_players?.find(
    (p) => p.puuid === state.puuid
  );
  if (!player?.team) return null;

  const teamKey = player.team.toLowerCase();
  const redWon = Boolean(match?.teams?.red?.has_won);
  const blueWon = Boolean(match?.teams?.blue?.has_won);
  const isDraw = !redWon && !blueWon;
  const teamWon = Boolean(match?.teams?.[teamKey]?.has_won);

  return { isDraw, teamWon };
}

async function checkWinLoss() {
  try {
    const match = await fetchLatestCompetitiveMatch();
    const matchId = match?.metadata?.matchid;
    if (!matchId || state.processedMatchIds.has(matchId)) {
      renderWinLoss();
      return;
    }

    state.processedMatchIds.add(matchId);

    if (state.lastMatchId && matchId !== state.lastMatchId) {
      const outcome = evaluateMatchOutcome(match);
      if (outcome) {
        if (outcome.teamWon) {
          state.wins += 1;
        } else if (!outcome.isDraw) {
          state.losses += 1;
        }
        state.lastMatchId = matchId;
      }
    } else if (!state.lastMatchId) {
      state.lastMatchId = matchId;
    }

    renderWinLoss();
  } catch (error) {
    console.error("Erro ao atualizar Win/Loss:", error);
  }
}

async function initWinLossTracking() {
  if (config.semWl) return;

  try {
    renderWinLoss();
    await ensurePuuid();
    const firstMatch = await fetchLatestCompetitiveMatch();
    const firstMatchId = firstMatch?.metadata?.matchid;
    if (firstMatchId) {
      state.lastMatchId = firstMatchId;
      state.processedMatchIds.add(firstMatchId);
    }
    setInterval(checkWinLoss, 30000);
  } catch (error) {
    console.error("Erro ao iniciar Win/Loss:", error);
  }
}

function checkLoadingStuck() {
  if (
    config.apikey &&
    config.nmusuario &&
    (dom.imgRank.src.endsWith("/Resources/Load.png") ||
      dom.imgRank.src.endsWith("/Resources/Load.svg"))
  ) {
    location.reload();
  }
}

async function init() {
  applyInitialStyles();

  // Se abrir a página sem parâmetros (modo visualização/teste de arte), exibe dados de exemplo
  if (!config.apikey || !config.nmusuario || !config.idusuario) {
    renderDemoPreview();
    return;
  }

  setTimeout(checkLoadingStuck, 10000);

  await updateRank();
  setInterval(updateRank, 15000);

  await initWinLossTracking();
}

init();
