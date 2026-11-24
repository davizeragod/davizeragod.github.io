const urlParams = new URLSearchParams(window.location.search);

const config = {
  regiao: urlParams.get("regiao") || "",
  idusuario: urlParams.get("idusuario") || "",
  nmusuario: urlParams.get("nmusuario") || "",
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

  if (dom.statsRow) {
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
  dom.kd.innerHTML = "K/D 1.32";
  dom.hsr.innerHTML = "HS 29%";
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

function accumulatePlayerStatsFromMatchData(matchData) {
  const player = matchData?.players?.all_players?.find(
    (p) => p.puuid === state.puuid
  );
  if (!player?.stats) return;

  state.stats.headshots += Number(player.stats.headshots || 0);
  state.stats.bodyshots += Number(player.stats.bodyshots || 0);
  state.stats.legshots += Number(player.stats.legshots || 0);
  state.stats.kills += Number(player.stats.kills || 0);
  state.stats.deaths += Number(player.stats.deaths || 0);
}

function renderKdAndHs() {
  const { kills, deaths, headshots, bodyshots, legshots } = state.stats;
  const totalShots = headshots + bodyshots + legshots;

  const kdRatio = deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2);
  const hsPercent =
    totalShots > 0 ? Math.round((headshots / totalShots) * 100) : 0;

  dom.kd.innerHTML = `K/D&nbsp;${kdRatio}`;
  dom.hsr.innerHTML = `HS ${hsPercent}%`;
}

async function checkWinLoss() {
  try {
    const match = await fetchLatestCompetitiveMatch();
    const matchId = match?.metadata?.matchid;
    if (!matchId || state.processedMatchIds.has(matchId)) {
      renderWinLoss();
      renderKdAndHs();
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
        accumulatePlayerStatsFromMatchData(match);
        state.lastMatchId = matchId;
      }
    } else if (!state.lastMatchId) {
      state.lastMatchId = matchId;
    }

    renderWinLoss();
    renderKdAndHs();
  } catch (error) {
    console.error("Erro ao atualizar sessão (Win/Loss, K/D e HS):", error);
  }
}

async function initWinLossTracking() {
  try {
    renderWinLoss();
    renderKdAndHs();
    await ensurePuuid();
    const firstMatch = await fetchLatestCompetitiveMatch();
    const firstMatchId = firstMatch?.metadata?.matchid;
    if (firstMatchId) {
      state.lastMatchId = firstMatchId;
      state.processedMatchIds.add(firstMatchId);
    }
    setInterval(checkWinLoss, 30000);
  } catch (error) {
    console.error("Erro ao iniciar tracking da sessão:", error);
  }
}

function checkLoadingStuck() {
  if (
    config.apikey &&
    config.nmusuario &&
    (dom.imgRank.src.endsWith("/Resources/load.png") ||
      dom.imgRank.src.endsWith("/Resources/load.svg"))
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
