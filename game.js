// ===========================
// ESTADO GLOBAL DO JOGO
// ===========================

let selectedAvatar = "";
let playerName = "";
let currentCaseIndex = 0;
let currentCase = null;

let casesData = [];
let casesLoaded = false;

const gameState = {
  prestige: 50,
  moral: 50,
  reputation: 50,
  solved: 0,
  errors: 0
};

// ===========================
// UTILITÁRIOS DE TELAS
// ===========================

function show(screenId) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const screen = document.getElementById(screenId);
  if (screen) screen.classList.add("active");
}

// ===========================
// TELA INICIAL -> AVATAR
// ===========================

function goToAvatar() {
  show("avatarScreen");
  renderAvatarList();
}

function renderAvatarList() {
  const container = document.getElementById("avatarList");
  container.innerHTML = "";

  for (let i = 1; i <= 10; i++) {
    const div = document.createElement("div");
    div.className = "avatar-option";

    const img = document.createElement("img");
    const fileName = `avatar_${String(i).padStart(2, "0")}.png`;
    img.src = `assets/${fileName}`;
    img.alt = `Avatar ${i}`;

    div.onclick = () => selectAvatar(div, fileName);

    div.appendChild(img);
    container.appendChild(div);
  }
}

function selectAvatar(element, fileName) {
  selectedAvatar = fileName;
  document.querySelectorAll(".avatar-option").forEach(a => a.classList.remove("selected"));
  element.classList.add("selected");
}

function confirmAvatar() {
  const nameInput = document.getElementById("playerName");
  playerName = (nameInput.value || "").trim();

  if (!playerName || !selectedAvatar) {
    alert("Escolha um avatar e digite seu nome.");
    return;
  }

  startCaptainDialog();
}

// ===========================
// CAPITÃO – TEXTO MÁQUINA
// ===========================

function startCaptainDialog() {
  show("captainScreen");

  const text = `Valley City não é lugar para amadores. 
Temos poucos policiais, muitos crimes e quase nenhuma segunda chance. 
Você foi designado para esta unidade porque alguém acredita que você pode fazer a diferença. 
Faça seu trabalho, detetive.`;

  typeWriter("captainText", text, 30);
}

function typeWriter(elementId, text, speed) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.innerHTML = "";
  let i = 0;

  const interval = setInterval(() => {
    el.innerHTML += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

// ===========================
// ESCRITÓRIO / HUD
// ===========================

function goToOffice() {
  show("officeScreen");

  const avatarImg = document.getElementById("officeAvatar");
  const nameEl = document.getElementById("officeName");

  if (avatarImg) avatarImg.src = `assets/${selectedAvatar}`;
  if (nameEl) nameEl.textContent = playerName.toUpperCase();

  updateHUD();
}

function updateHUD() {
  const prestigeBar = document.getElementById("prestBar");
  const moralBar = document.getElementById("moralBar");
  const repBar = document.getElementById("repBar");

  if (prestigeBar) prestigeBar.style.width = `${gameState.prestige}%`;
  if (moralBar) moralBar.style.width = `${gameState.moral}%`;
  if (repBar) repBar.style.width = `${gameState.reputation}%`;
}

// ===========================
// CARREGAMENTO DE CASOS (JSON)
// ===========================

async function ensureCasesLoaded() {
  if (casesLoaded) return;

  try {
    const response = await fetch("cases.json?nocache=" + Date.now(), { cache: "no-store" });
    const data = await response.json();
    casesData = data.cases || [];
    casesLoaded = true;
  } catch (err) {
    console.error("Erro ao carregar cases.json:", err);
    alert("Erro ao carregar os casos. Verifique o arquivo cases.json.");
  }
}

async function loadNextCase() {
  await ensureCasesLoaded();
  if (!casesData.length) {
    alert("Nenhum caso disponível.");
    return;
  }

  if (currentCaseIndex >= casesData.length) {
    alert("Você resolveu todos os casos disponíveis nesta versão.");
    return;
  }

  currentCase = casesData[currentCaseIndex];

  const titleEl = document.getElementById("caseTitle");
  const imageEl = document.getElementById("caseImage");
  const summaryEl = document.getElementById("caseSummary");

  if (titleEl) titleEl.textContent = currentCase.title || "Novo Caso";
  if (imageEl) imageEl.src = `assets/${currentCase.scene}`;
  if (summaryEl) summaryEl.textContent = currentCase.summary || currentCase.description || "";

  show("caseScreen");
}

// ===========================
// INVESTIGAÇÃO
// ===========================

function openInvestigation() {
  if (!currentCase) {
    alert("Nenhum caso carregado.");
    return;
  }

  const titleEl = document.getElementById("caseTitle2");
  const descEl = document.getElementById("caseDescription");

  if (titleEl) titleEl.textContent = currentCase.title || "";
  if (descEl) descEl.textContent = currentCase.description || currentCase.summary || "";

  renderList("witnesses", currentCase.witnesses, false);
  renderList("evidence", currentCase.evidence, false);
  renderList("suspects", currentCase.suspects, true);

  show("investigationScreen");
}

function renderList(containerId, items, isSuspect) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  if (!items || !items.length) {
    container.innerHTML = "<p>Sem itens disponíveis.</p>";
    return;
  }

  items.forEach(fileName => {
    const img = document.createElement("img");
    img.src = `assets/${fileName}`;
    img.alt = fileName;

    if (isSuspect) {
      img.style.cursor = "pointer";
      img.onclick = () => chooseSuspect(fileName);
    }

    container.appendChild(img);
  });
}

function chooseSuspect(fileName) {
  if (!currentCase) return;

  const correct = currentCase.real_culprit;

  if (fileName === correct) {
    alert("✔ Culpado correto! Bom trabalho, detetive.");
    gameState.solved++;
    gameState.prestige = Math.min(100, gameState.prestige + 10);
    gameState.moral = Math.min(100, gameState.moral + 5);
    gameState.reputation = Math.min(100, gameState.reputation + 7);

    currentCaseIndex++;
    currentCase = null;
    goToOffice();
  } else {
    alert("❌ Suspeito incorreto. Reveja as pistas.");
    gameState.errors++;
    gameState.moral = Math.max(0, gameState.moral - 5);
    gameState.reputation = Math.max(0, gameState.reputation - 5);
    updateHUD();
  }
}

function returnToCase() {
  show("caseScreen");
}

// ===========================
// ESTATÍSTICAS / TELEFONE / PROMOÇÃO (SIMPLES)
// ===========================

function openStats() {
  const msg =
    `Estatísticas do Detetive ${playerName}:\n\n` +
    `Casos resolvidos: ${gameState.solved}\n` +
    `Erros: ${gameState.errors}\n` +
    `Prestígio: ${gameState.prestige}%\n` +
    `Moral: ${gameState.moral}%\n` +
    `Reputação: ${gameState.reputation}%`;

  alert(msg);
}

function openPhone() {
  const opcao = prompt(
    "Telefone:\n" +
    "1 - Ligar para o chefe\n" +
    "2 - Solicitar mandado de busca\n" +
    "3 - Ligar para um suspeito"
  );

  switch (opcao) {
    case "1":
      alert("Chefe: 'Faça seu trabalho direito e mantenha o distrito sob controle.'");
      gameState.moral = Math.min(100, gameState.moral + 3);
      updateHUD();
      break;
    case "2":
      alert("Você solicita um mandado de busca. (Em uma versão futura, isso abrirá novas pistas no caso).");
      break;
    case "3":
      alert("Você tenta contato com um suspeito. Alguns atendem, outros não... (Sistema detalhado em futura versão).");
      break;
    default:
      alert("Nenhuma ligação realizada.");
  }
}

function openPromotion() {
  if (gameState.solved >= 2 && gameState.prestige >= 70) {
    alert("Parabéns! Você já teria perfil para promoção.\n(Sistema de cargos FBI/CIA entrará em uma próxima versão).");
  } else {
    alert(
      "Ainda não é o momento para promoção.\n" +
      "Precisa de mais casos resolvidos e mais prestígio."
    );
  }
}
