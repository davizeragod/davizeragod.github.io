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
  kd: document.getElementById("kd"),
  hsr: document.getElementById("hsr"),
};

const API_BASE = "https://api.henrikdev.xyz/valorant";

const state = {
  puuid: null,
  wins: 0,
  losses: 0,
  lastMatchId: null,
  processedWlMatchIds: new Set(),
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

function applyInitialStyles() {
  if (config.alpha === "ss") {
    dom.textoNmRank.style.backgroundColor = "transparent";
  } else if (config.alpha === "nn" && config.cor) {
    dom.textoNmRank.style.backgroundColor = `#${config.cor}`;
  }

  if (config.bgurl) {
    dom.textoNmRank.style.backgroundImage = `url(${config.bgurl})`;
  }

  if (!config.icourl) {
    dom.imgCantinho.style.display = "none";
  } else {
    dom.imgCantinho.style.content = `url(${config.icourl})`;
  }

  if (config.corfonte) {
    const fontColor = `#${config.corfonte}`;
    dom.headerRank.style.color = fontColor;
    dom.wlValue.style.color = fontColor;
    dom.kd.style.color = fontColor;
    dom.hsr.style.color = fontColor;
  }

  if (config.semWl) {
    dom.headerRank.style.top = "-5px";
    dom.wlValue.style.display = "none";
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
  const preferredActs = ["e11a1", "e11a4", "e11aIV"];
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
      numberOfGames < 5 || (hasNoData && gamesNeeded >= 5);

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
        ? `${eloText} #${lbRank}`
        : `${eloText} ${rrText}RR`;
    } else {
      dom.headerRank.innerHTML = `${eloText}&nbsp &nbsp;${rrText}RR`;
    }

    let progressPercent = `${rr}%`;
    dom.mmrAtual.innerHTML = rr;

    if (isUnranked) {
      dom.ultimaPartida.innerHTML = `Unranked ${gamesPlayedInAct}/1`;
    } else if (tier >= 24) {
      dom.ultimaPartida.innerHTML = `Last Match: ${lastMmrChange}pts`;
      if (lastMmrChange === 0) {
        dom.ultMmr.style.backgroundColor = "grey";
      } else if (lastMmrChange >= 1) {
        progressPercent = "100%";
      } else if (lastMmrChange <= -1) {
        progressPercent = "0%";
      }
    } else {
      const prefix = lastMmrChange >= 1 ? "+ " : "";
      dom.ultimaPartida.innerHTML = `Last Match: ${prefix}${lastMmrChange}pts`;
    }

    dom.rootStyle.setProperty("--progresspontinho", progressPercent);

    if (config.corfonte) {
      const fontColor = `#${config.corfonte}`;
      dom.headerRank.style.color = fontColor;
      dom.wlValue.style.color = fontColor;
      dom.kd.style.color = fontColor;
      dom.hsr.style.color = fontColor;
    }
  } catch (error) {
    console.error("Erro ao atualizar rank:", error);
  }
}

async function ensurePuuid() {
  if (state.puuid) return state.puuid;
  const encodedName = encodeURIComponent(config.nmusuario);
  const encodedTag = encodeURIComponent(config.idusuario);
  const json = await fetchJson(`/v1/account/${encodedName}/${encodedTag}`);
  state.puuid = json?.data?.puuid || null;
  return state.puuid;
}

async function fetchCompetitiveMatches() {
  const encodedName = encodeURIComponent(config.nmusuario);
  const encodedTag = encodeURIComponent(config.idusuario);
  const json = await fetchJson(
    `/v3/matches/${config.regiao}/${encodedName}/${encodedTag}`,
    { mode: "competitive" }
  );
  return Array.isArray(json?.data) ? json.data : [];
}

function renderWinLoss() {
  dom.wlValue.innerHTML = `${state.wins} Win / ${state.losses} Lose`;
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
    const matches = await fetchCompetitiveMatches();
    const latestMatch = matches[0];
    const matchId = latestMatch?.metadata?.matchid;

    if (!matchId || state.processedWlMatchIds.has(matchId)) {
      renderWinLoss();
      return;
    }

    state.processedWlMatchIds.add(matchId);

    if (state.lastMatchId && matchId !== state.lastMatchId) {
      const outcome = evaluateMatchOutcome(latestMatch);
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
    const matches = await fetchCompetitiveMatches();
    const firstMatchId = matches[0]?.metadata?.matchid;
    if (firstMatchId) {
      state.lastMatchId = firstMatchId;
      state.processedWlMatchIds.add(firstMatchId);
    }
    setInterval(checkWinLoss, 30000);
  } catch (error) {
    console.error("Erro ao iniciar Win/Loss:", error);
  }
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

async function fetchAndAccumulateMatchStats(matchId) {
  if (!matchId || state.processedStatsMatchIds.has(matchId)) return;

  const json = await fetchJson(`/v2/match/${matchId}`);
  if (json?.data) {
    accumulatePlayerStatsFromMatchData(json.data);
    state.processedStatsMatchIds.add(matchId);
  }
}

function renderKdAndHs() {
  const { kills, deaths, headshots, bodyshots, legshots } = state.stats;
  const totalShots = headshots + bodyshots + legshots;

  const kdRatio = deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2);
  const hsPercent =
    totalShots > 0 ? Math.round((headshots / totalShots) * 100) : 0;

  dom.kd.innerHTML = `K/D&nbsp${kdRatio}`;
  dom.hsr.innerHTML = `HS ${hsPercent}%`;
}

async function initStatsTracking() {
  try {
    await ensurePuuid();
    if (!state.puuid) return;

    const rawHistory = await fetchJson(
      "/v1/raw",
      {},
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "matchhistory",
          value: state.puuid,
          region: config.regiao,
          queries: "?startIndex=0&endIndex=20&queue=competitive",
        }),
      }
    );

    const history = Array.isArray(rawHistory?.History)
      ? rawHistory.History
      : [];

    for (const item of history) {
      await fetchAndAccumulateMatchStats(item.MatchID);
    }

    renderKdAndHs();
    setInterval(updateStatsWithLatestMatches, 60000);
  } catch (error) {
    console.error("Erro ao iniciar estatísticas K/D e HS:", error);
  }
}

async function updateStatsWithLatestMatches() {
  try {
    const matches = await fetchCompetitiveMatches();
    if (!matches.length) return;

    const latestMatchId = matches[0]?.metadata?.matchid;
    if (latestMatchId && state.processedStatsMatchIds.has(latestMatchId)) {
      return;
    }

    for (const match of matches) {
      const matchId = match?.metadata?.matchid;
      if (matchId && !state.processedStatsMatchIds.has(matchId)) {
        await fetchAndAccumulateMatchStats(matchId);
      }
    }

    renderKdAndHs();
  } catch (error) {
    console.error("Erro ao atualizar K/D e HS:", error);
  }
}

async function init() {
  applyInitialStyles();

  await updateRank();
  setInterval(updateRank, 15000);

  await initWinLossTracking();
  await initStatsTracking();
}

init();
