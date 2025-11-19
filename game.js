/* ======================================================
   Valley City: Police Investigations
   game.js - Lógica principal do jogo (versão mobile)
======================================================*/

/* ==========================
   VARIÁVEIS GLOBAIS
=========================== */

let currentScreen = "";
let cases = [];
let currentWitness = null;
let currentSuspect = null;
let typewriterTimer = null;
let lastWarrantResult = null;

let examQuestions = [];
let examCurrentIndex = 0;
let examScore = 0;

let player = {
  name: "",
  avatar: "",
  gender: "M",
  agency: "PD",        // PD, FBI, CIA
  rankIndex: 0,        // Índice no RANK_PATH
  rank: "Detetive Júnior",
  moral: 50,
  prestige: 0,
  currentCaseIndex: 0, // índice no array de cases
  solvedCases: 0,
  failedCases: 0
};

/* ==========================
   CAMINHO DE PROMOÇÃO
=========================== */

const RANK_PATH = [
  { agency: "PD",  name: "Detetive Júnior",                        minCases: 0,  minPrestige: 0,  minMoral: 0  },
  { agency: "PD",  name: "Detetive Titular",                       minCases: 2,  minPrestige: 50, minMoral: 40 },
  { agency: "PD",  name: "Detetive – Casos Especiais",             minCases: 5,  minPrestige: 80, minMoral: 50 },
  { agency: "FBI", name: "Agente de Investigação Júnior",          minCases: 7,  minPrestige: 80, minMoral: 55 },
  { agency: "FBI", name: "Agente de Investigação Federal",         minCases: 10, minPrestige: 85, minMoral: 60 },
  { agency: "FBI", name: "Agente Federal de Investigações Especiais", minCases: 13, minPrestige: 90, minMoral: 65 },
  { agency: "CIA", name: "Analista de Dados Júnior",               minCases: 16, minPrestige: 90, minMoral: 70 },
  { agency: "CIA", name: "Agente Nível 1",                         minCases: 20, minPrestige: 92, minMoral: 72 },
  { agency: "CIA", name: "Agente Nível 2",                         minCases: 24, minPrestige: 94, minMoral: 74 },
  { agency: "CIA", name: "Agente Nível 3",                         minCases: 28, minPrestige: 96, minMoral: 76 },
  { agency: "CIA", name: "Agente Nível 4",                         minCases: 32, minPrestige: 97, minMoral: 78 },
  { agency: "CIA", name: "Agente Especial",                        minCases: 36, minPrestige: 98, minMoral: 80 }
];

/* ==========================
   BANCO DE PERGUNTAS DO EXAME
=========================== */

const PROMO_QUESTIONS = [
  {
    question: "Ao ouvir versões diferentes das testemunhas, o que um bom investigador faz primeiro?",
    options: [
      "Ignora a versão mais confusa",
      "Procura pontos em comum e contradições",
      "Escolhe a versão de quem parece mais calmo",
      "Conclui que alguém está mentindo e encerra"
    ],
    correctIndex: 1
  },
  {
    question: "Qual é a função principal de um mandado de busca?",
    options: [
      "Permitir a prisão imediata do suspeito",
      "Autorizar a entrada legal em um local específico",
      "Autorizar o interrogatório forçado",
      "Substituir todas as outras investigações"
    ],
    correctIndex: 1
  },
  {
    question: "O que é um álibi?",
    options: [
      "Uma prova material",
      "Uma contradição em depoimento",
      "A declaração de inocência de um suspeito",
      "A justificativa de onde a pessoa estava no momento do crime"
    ],
    correctIndex: 3
  },
  {
    question: "Quando uma prova digital (logs, câmeras) contradiz o álibi de um suspeito, você deve:",
    options: [
      "Desconsiderar o álibi imediatamente",
      "Confrontar o suspeito com calma, buscando explicação",
      "Ignorar a prova digital porque pode estar errada",
      "Encerrar o caso e prender o suspeito na hora"
    ],
    correctIndex: 1
  },
  {
    question: "No interrogatório, uma abordagem agressiva em excesso pode:",
    options: [
      "Sempre trazer a verdade à tona",
      "Ajuda mas não muda nada",
      "Fazer o suspeito se calar ou inventar respostas",
      "Não tem impacto"
    ],
    correctIndex: 2
  },
  {
    question: "Qual é o papel do FBI em relação à polícia local?",
    options: [
      "Substituir a polícia local em qualquer crime",
      "Atuar em crimes federais e interestaduais",
      "Tratar apenas de crimes de trânsito",
      "Cuidar apenas de crimes internacionais"
    ],
    correctIndex: 1
  },
  {
    question: "A CIA está mais focada em:",
    options: [
      "Crimes de trânsito",
      "Crimes de rua em bairro específico",
      "Inteligência, espionagem e ameaças à segurança nacional",
      "Apenas investigações de homicídio simples"
    ],
    correctIndex: 2
  },
  {
    question: "Ao analisar uma cena de crime, a prioridade é:",
    options: [
      "Mover o corpo para local melhor",
      "Evitar contaminar e preservar o local",
      "Permitir entrada de curiosos",
      "Recolher tudo o mais rápido possível"
    ],
    correctIndex: 1
  },
  {
    question: "Prestígio alto no departamento significa:",
    options: [
      "O detetive é famoso na TV",
      "O detetive resolve casos com técnica e conduta correta",
      "O detetive é temido pelos suspeitos",
      "O detetive nunca erra"
    ],
    correctIndex: 1
  },
  {
    question: "Quando uma testemunha diz 'acho que era por volta de 22h', isso indica:",
    options: [
      "Horário exato comprovado",
      "Um horário aproximado, sujeito a erro",
      "Que ela está mentindo",
      "Que o crime aconteceu às 23h"
    ],
    correctIndex: 1
  },
  {
    question: "Ao elogiar a equipe e o chefe, o investigador:",
    options: [
      "Manipula o sistema",
      "Demonstra respeito e fortalece relações de trabalho",
      "Perde moral com todos",
      "Automaticamente é promovido"
    ],
    correctIndex: 1
  },
  {
    question: "Ao usar o telefone para pedir desculpas ao chefe por erros, isso mostra:",
    options: [
      "Fraqueza",
      "Falta de preparo",
      "Capacidade de reconhecer falhas e evoluir",
      "Desinteresse pelo trabalho"
    ],
    correctIndex: 2
  }
];

/* ==========================
   PERGUNTAS PADRÃO
=========================== */

const WITNESS_QUESTIONS = [
  { id: "where",      label: "Onde você estava no momento do crime?" },
  { id: "knowVictim", label: "Você conhecia a vítima? De onde?" },
  { id: "seeSomeone", label: "Você viu alguém suspeito?" },
  { id: "hear",       label: "Você ouviu algum som ou discussão?" },
  { id: "moreInfo",   label: "Você tem mais alguma informação importante?" }
];

const SUSPECT_QUESTIONS = [
  { id: "alibi",   label: "Onde você estava no momento do crime?" },
  { id: "relation",label: "Qual era sua relação com a vítima?" },
  { id: "motive",  label: "Por que alguém acharia que você é suspeito?" },
  { id: "witness", label: "Alguém pode confirmar seu álibi?" },
  { id: "stress",  label: "Por que você está tão nervoso?" },
  { id: "weapon",  label: "Você tem alguma arma registrada ou não?" }
];

/* ==========================
   FUNÇÃO MUDAR DE TELA
=========================== */

function goTo(screenId) {
  currentScreen = screenId;
  const app = document.querySelector("#app");
  if (!app) return;

  app.innerHTML = SCREENS[screenId] || "<p>ERRO: Tela não encontrada.</p>";

  if (SCREEN_HOOKS[screenId]) {
    SCREEN_HOOKS[screenId]();
  }
}

/* ==========================
   FUNDO CINEMATOGRÁFICO
=========================== */

function setBackground(image) {
  const bg = document.querySelector("#bg-layer");
  if (!bg) return;

  bg.style.opacity = 0;
  setTimeout(() => {
    bg.style.backgroundImage = `url('assets/${image}.png')`;
    bg.style.opacity = 1;
  }, 250);
}

/* ==========================
   TYPEWRITER EFFECT
=========================== */

function typeWriter(text, elementId, speed = 36) {
  const el = document.getElementById(elementId);
  if (!el) return;

  let index = 0;
  el.innerHTML = "";
  clearInterval(typewriterTimer);

  typewriterTimer = setInterval(() => {
    el.innerHTML = text.substring(0, index);
    index++;
    if (index > text.length) {
      clearInterval(typewriterTimer);
    }
  }, speed);
}

/* ==========================
   SALVAR / CARREGAR JOGO
=========================== */

function saveGame() {
  try {
    localStorage.setItem("VCPI_SAVE", JSON.stringify(player));
    alert("Jogo salvo com sucesso!");
  } catch (e) {
    alert("Erro ao salvar o jogo (verifique permissões do navegador).");
  }
}

function loadGame() {
  try {
    const data = localStorage.getItem("VCPI_SAVE");
    if (!data) {
      alert("Nenhum jogo salvo encontrado.");
      return;
    }
    const obj = JSON.parse(data);
    player = { ...player, ...obj }; // mescla com defaults
    goTo("office");
  } catch (e) {
    alert("Erro ao carregar o jogo.");
  }
}

/* ==========================
   PROGRESSÃO DE CASOS
=========================== */

function startNextCase() {
  if (player.currentCaseIndex >= cases.length) {
    goTo("theEnd");
    return;
  }
  const c = cases[player.currentCaseIndex];
  player.currentCase = c;
  goTo("caseIntro");
}

function concludeCaseWith(suspectId) {
  const c = cases[player.currentCaseIndex];
  if (!c) return;
  const chosen = c.suspects.find(s => s.id === suspectId);

  if (chosen && chosen.isGuilty) {
    player.solvedCases++;
    player.prestige = Math.min(player.prestige + 12, 100);
    player.moral    = Math.min(player.moral + 4, 100);
    alert("Caso resolvido corretamente!");
  } else {
    player.failedCases++;
    player.prestige = Math.max(player.prestige - 5, 0);
    player.moral    = Math.max(player.moral - 10, 0);
    alert("Você errou o culpado!");
  }

  player.currentCaseIndex++;
  player.currentCase = null;
  goTo("office");
}

/* ==========================
   HUD DO JOGADOR
=========================== */

function renderHUD() {
  const el = document.getElementById("player-hud");
  if (!el) return;

  const avatarImg = player.avatar
    ? `<img src="assets/${player.avatar}.png" alt="avatar">`
    : "";

  el.innerHTML = `
    <div class="section-card office-header">
      <div class="office-avatar">
        ${avatarImg}
      </div>
      <div class="office-info">
        <h3>${player.name || "Detetive"} 
          <span class="pill-inline">${player.rank}</span>
        </h3>
        <p class="small">Agência: ${player.agency}</p>
        <p class="small">Moral: ${player.moral}% • Prestígio: ${player.prestige}%</p>
        <p class="small">Casos Resolvidos: ${player.solvedCases} • Falhas: ${player.failedCases}</p>
      </div>
    </div>
  `;
}

/* ==========================
   AVATAR + NOME
=========================== */

function selectAvatar(avatar) {
  player.avatar = avatar;
  player.gender = "M"; // por enquanto, usamos apenas avatars padrão

  document.querySelectorAll(".avatar-option")
    .forEach(a => a.classList.remove("selected"));

  const selected = document.getElementById("av_" + avatar);
  if (selected) selected.classList.add("selected");
}

function confirmAvatar() {
  const input = document.getElementById("playerName");
  const name = input ? input.value.trim() : "";
  if (name.length < 2) {
    alert("Digite um nome válido.");
    return;
  }
  if (!player.avatar) {
    alert("Escolha um avatar.");
    return;
  }
  player.name = name;
  goTo("captainWelcome");
}

/* ==========================
   PROMOÇÃO
=========================== */

function openPromotion() {
  const nextIndex = player.rankIndex + 1;
  const nextRank = RANK_PATH[nextIndex];

  if (!nextRank) {
    alert("Você já atingiu o topo da carreira.");
    return;
  }

  const faltaCases = Math.max(0, nextRank.minCases - player.solvedCases);
  const faltaPrestige = Math.max(0, nextRank.minPrestige - player.prestige);
  const faltaMoral = Math.max(0, nextRank.minMoral - player.moral);

  if (faltaCases > 0 || faltaPrestige > 0 || faltaMoral > 0) {
    let msg = "Você ainda não está pronto para a próxima promoção.\n\nFalta:";
    if (faltaCases > 0) msg += `\n- ${faltaCases} caso(s) resolvido(s)`;
    if (faltaPrestige > 0) msg += `\n- ${faltaPrestige}% de prestígio`;
    if (faltaMoral > 0) msg += `\n- ${faltaMoral}% de moral`;
    alert(msg);
    return;
  }

  // monta exame
  preparePromotionExam();
  goTo("promotionExam");
}

function preparePromotionExam() {
  // embaralha perguntas e pega 10 (ou menos se não tiver)
  const pool = [...PROMO_QUESTIONS];
  pool.sort(() => Math.random() - 0.5);
  examQuestions = pool.slice(0, 10);
  examCurrentIndex = 0;
  examScore = 0;
}

function answerExam(optionIndex) {
  const q = examQuestions[examCurrentIndex];
  if (!q) return;

  if (optionIndex === q.correctIndex) {
    examScore++;
  }

  examCurrentIndex++;

  if (examCurrentIndex >= examQuestions.length) {
    finishPromotionExam();
  } else {
    renderExamQuestion();
  }
}

function finishPromotionExam() {
  const acertos = examScore;
  const total = examQuestions.length;
  const aprovado = acertos >= 7;

  if (aprovado) {
    player.rankIndex++;
    const r = RANK_PATH[player.rankIndex];
    player.rank = r.name;
    player.agency = r.agency;
    alert(`Parabéns! Você foi aprovado no exame (${acertos}/${total}) e promovido a ${r.name}.`);
  } else {
    player.moral = Math.max(player.moral - 5, 0);
    alert(`Você não atingiu a nota mínima. (${acertos}/${total})\nEstude os procedimentos e tente novamente.`);
  }

  goTo("office");
}

function renderExamQuestion() {
  const q = examQuestions[examCurrentIndex];
  if (!q) return;

  const qEl = document.getElementById("examQuestion");
  const optsEl = document.getElementById("examOptions");

  if (!qEl || !optsEl) return;

  qEl.innerText = `Pergunta ${examCurrentIndex + 1}/${examQuestions.length}: ${q.question}`;
  optsEl.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "btn-full";
    btn.innerText = opt;
    btn.onclick = () => answerExam(idx);
    optsEl.appendChild(btn);
  });
}

/* ==========================
   TELEFONE
=========================== */

function confirmResign() {
  if (confirm("Tem certeza que deseja pedir demissão? Isso encerrará sua carreira em Valley City.")) {
    goTo("resigned");
  }
}

function callChiefApologize() {
  player.moral = Math.min(player.moral + 5, 100);
  player.prestige = Math.min(player.prestige + 3, 100);
  alert("Você pediu desculpas pelos erros. O chefe reconhece sua postura e sua moral aumentou.");
}

function callChiefPraiseTeam() {
  player.prestige = Math.min(player.prestige + 4, 100);
  alert("Você elogiou a equipe. O clima no distrito melhora e seu prestígio aumenta.");
}

function callChiefPraiseChief() {
  player.moral = Math.min(player.moral + 2, 100);
  player.prestige = Math.min(player.prestige + 2, 100);
  alert("Você demonstrou respeito pelo chefe. Sua relação com a liderança melhora.");
}

function openWarrantScreen() {
  if (!player.currentCase) {
    player.currentCase = cases[player.currentCaseIndex];
  }
  const c = player.currentCase;
  if (!c || !c.suspects || c.suspects.length === 0) {
    alert("Nenhum suspeito disponível para mandado de busca neste caso.");
    return;
  }
  goTo("phoneWarrant");

  const list = document.getElementById("warrantSuspectList");
  if (!list) return;

  list.innerHTML = "";
  c.suspects.forEach(s => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.onclick = () => executeWarrant(s.id);
    div.innerHTML = `
      <div class="flex">
        <div class="portrait"><img src="assets/${s.image}.png"></div>
        <div>
          <div class="list-item-title">${s.name}</div>
          <div class="list-item-sub">${s.occupation} • ${s.age} anos</div>
        </div>
      </div>
    `;
    list.appendChild(div);
  });
}

function executeWarrant(suspectId) {
  const c = player.currentCase || cases[player.currentCaseIndex];
  if (!c) return;

  const suspect = c.suspects.find(s => s.id === suspectId);
  if (!suspect) return;

  const foundEvidence = [];
  const evList = suspect.warrantEvidence || [];

  // adiciona as evidências do mandado ao caso
  evList.forEach(ev => {
    if (!c.evidence) c.evidence = [];
    const exists = c.evidence.some(e => e.id === ev.id);
    if (!exists) {
      c.evidence.push({ ...ev });
      foundEvidence.push(ev);
    }
  });

  lastWarrantResult = {
    suspectName: suspect.name,
    guilty: !!suspect.isGuilty,
    evidence: foundEvidence
  };

  goTo("phoneWarrantResult");
}

/* ==========================
   TELAS (SCREENS)
=========================== */

const SCREENS = {
  start: `
    <div class="section-card">
      <h1 class="title">Valley City: Police Investigations</h1>
      <p class="subtitle">Toque em INICIAR para começar sua carreira.</p>
      <button class="btn" onclick="goTo('avatarSelect')">Iniciar</button>
      <button class="btn-secondary" onclick="loadGame()">Carregar Jogo</button>
    </div>
  `,

  avatarSelect: `
    <div class="section-card">
      <h2 class="title">Seu Oficial</h2>
      <p class="subtitle">Escolha o avatar e digite seu nome.</p>

      <div class="label">Seu nome:</div>
      <input id="playerName" class="input" placeholder="Digite seu nome..." />

      <div class="label">Escolha seu avatar:</div>
      <div class="avatar-grid">
        ${(() => {
          // SOMENTE avatar_01.png até avatar_10.png (sem versões 'f' para evitar imagens quebradas)
          let html = "";
          for (let i = 1; i <= 10; i++) {
            const num = i.toString().padStart(2, "0");
            const id = `avatar_${num}`;
            html += `
              <div class="avatar-option" id="av_${id}" onclick="selectAvatar('${id}')">
                <img src="assets/${id}.png" alt="avatar ${num}">
              </div>
            `;
          }
          return html;
        })()}
      </div>

      <button class="btn" onclick="confirmAvatar()">Confirmar</button>
    </div>
  `,

  captainWelcome: `
    <div class="section-card">
      <h2 class="title">Distrito Policial de Valley City</h2>
      <div class="flex">
        <div class="portrait"><img src="assets/capitao_brief.png" alt="Capitão"></div>
        <p class="small">Capitão Rodriguez</p>
      </div>
      <div id="captainText" class="typewriter"></div>
      <button class="btn" onclick="goTo('office')">Continuar</button>
    </div>
  `,

  office: `
    <div id="player-hud"></div>

    <div class="section-card">
      <h2 class="title">Escritório do Detetive</h2>
      <p class="subtitle">Escolha sua próxima ação.</p>

      <div class="btn-row">
        <button class="btn" onclick="startNextCase()">Próximo Caso</button>
        <button class="btn-secondary" onclick="saveGame()">Salvar Jogo</button>
      </div>

      <div class="btn-row">
        <button class="btn" onclick="goTo('phoneMenu')">Telefone</button>
        <button class="btn" onclick="openPromotion()">Promoção</button>
      </div>

      <button class="btn-ghost" onclick="goTo('stats')">Estatísticas</button>
    </div>
  `,

  stats: `
    <div class="section-card">
      <h2 class="title">Status do Detetive</h2>
      <p class="small">Patente atual: ${player.rank}</p>
      <p class="small">Agência: ${player.agency}</p>
      <p class="small">Casos concluídos: ${player.solvedCases}</p>
      <p class="small">Casos falhados: ${player.failedCases}</p>
      <p class="small">Moral: ${player.moral}%</p>
      <p class="small">Prestígio: ${player.prestige}%</p>
      <button class="btn-ghost" onclick="goTo('office')">Voltar</button>
    </div>
  `,

  caseIntro: `
    <div class="section-card">
      <h2 class="title" id="caseTitle"></h2>
      <p id="caseDesc" class="subtitle"></p>
      <img id="caseImg" class="thumb" alt="Cena do caso">
      <button class="btn" onclick="goTo('investigation')">Iniciar Investigação</button>
    </div>
  `,

  investigation: `
    <div class="section-card">
      <h2 class="title">Investigação</h2>
      <button class="btn" onclick="openWitnesses()">Testemunhas</button>
      <button class="btn" onclick="openEvidence()">Provas</button>
      <button class="btn" onclick="openSuspects()">Suspeitos</button>
      <button class="btn-danger" onclick="openConclusion()">Concluir Caso</button>
      <button class="btn-ghost" onclick="goTo('office')">Voltar ao Escritório</button>
    </div>
  `,

  witnesses: `
    <div class="section-card">
      <h2 class="title">Testemunhas</h2>
      <div id="witnessList"></div>
      <button class="btn-ghost" onclick="goTo('investigation')">Voltar</button>
    </div>
  `,

  witnessDetail: `
    <div class="section-card">
      <div class="flex">
        <div class="portrait"><img id="wP" alt="Testemunha"></div>
        <div>
          <h3 id="wN"></h3>
          <p id="wR" class="small"></p>
        </div>
      </div>

      <div class="label">Depoimento Inicial:</div>
      <div id="wInit" class="small"></div>

      <div class="label">Perguntas:</div>
      <div id="wQuestions"></div>

      <div class="label">Log:</div>
      <div id="wLog" class="log-box"></div>

      <button class="btn-ghost" onclick="goTo('witnesses')">Voltar</button>
    </div>
  `,

  suspects: `
    <div class="section-card">
      <h2 class="title">Suspeitos</h2>
      <div id="suspectList"></div>
      <button class="btn-ghost" onclick="goTo('investigation')">Voltar</button>
    </div>
  `,

  suspectDetail: `
    <div class="section-card">
      <div class="flex">
        <div class="portrait"><img id="sP" alt="Suspeito"></div>
        <div>
          <h3 id="sN"></h3>
          <p id="sInfo" class="small"></p>
        </div>
      </div>

      <div class="stat-bars">
        <div class="stat-row">
          Stress <div class="stat-bar"><div id="sb_stress" class="stat-bar-fill"></div></div>
        </div>
        <div class="stat-row">
          Confiança <div class="stat-bar"><div id="sb_conf" class="stat-bar-fill"></div></div>
        </div>
        <div class="stat-row">
          Raiva <div class="stat-bar"><div id="sb_ang" class="stat-bar-fill"></div></div>
        </div>
      </div>

      <div class="label">Perguntar:</div>
      <div id="sQuestions"></div>

      <div class="label">Log:</div>
      <div id="sLog" class="log-box"></div>

      <button class="btn-ghost" onclick="goTo('suspects')">Voltar</button>
    </div>
  `,

  evidence: `
    <div class="section-card">
      <h2 class="title">Provas</h2>
      <div id="eList"></div>
      <button class="btn-ghost" onclick="goTo('investigation')">Voltar</button>
    </div>
  `,

  conclude: `
    <div class="section-card">
      <h2 class="title">Quem é o culpado?</h2>
      <div id="concludeList"></div>
      <button class="btn-ghost" onclick="goTo('investigation')">Voltar</button>
    </div>
  `,

  phoneMenu: `
    <div class="section-card">
      <h2 class="title">Telefone</h2>
      <p class="subtitle">Escolha uma opção de chamada.</p>
      <button class="btn" onclick="goTo('phoneChief')">Ligar para o chefe</button>
      <button class="btn" onclick="openWarrantScreen()">Mandado de busca</button>
      <button class="btn-danger" onclick="confirmResign()">Pedir demissão</button>
      <button class="btn-ghost" onclick="goTo('office')">Voltar</button>
    </div>
  `,

  phoneChief: `
    <div class="section-card">
      <h2 class="title">Linha com o Capitão Rodriguez</h2>
      <p class="subtitle">Use com sabedoria. Suas escolhas afetam moral e prestígio.</p>
      <button class="btn-full" onclick="callChiefApologize()">Pedir desculpas pelos erros recentes</button>
      <button class="btn-full" onclick="callChiefPraiseTeam()">Elogiar o trabalho da equipe</button>
      <button class="btn-full" onclick="callChiefPraiseChief()">Reconhecer a liderança do chefe</button>
      <button class="btn-ghost" onclick="goTo('phoneMenu')">Voltar</button>
    </div>
  `,

  phoneWarrant: `
    <div class="section-card">
      <h2 class="title">Mandado de Busca</h2>
      <p class="subtitle">Escolha um suspeito para enviar a equipe à casa dele.</p>
      <div id="warrantSuspectList"></div>
      <button class="btn-ghost" onclick="goTo('phoneMenu')">Voltar</button>
    </div>
  `,

  phoneWarrantResult: `
    <div class="section-card">
      <h2 class="title">Resultado do Mandado</h2>
      <div id="warrantResultBox"></div>
      <button class="btn" onclick="goTo('investigation')">Voltar à investigação</button>
      <button class="btn-ghost" onclick="goTo('phoneMenu')">Outra ligação</button>
    </div>
  `,

  promotionExam: `
    <div class="section-card">
      <h2 class="title">Exame de Promoção</h2>
      <p id="examQuestion" class="subtitle"></p>
      <div id="examOptions"></div>
      <button class="btn-ghost" onclick="goTo('office')">Cancelar exame</button>
    </div>
  `,

  resigned: `
    <div class="section-card">
      <h2 class="title">Você se Demitiu</h2>
      <p class="subtitle">Sua carreira em Valley City terminou por escolha própria.</p>
      <button class="btn" onclick="resetGame()">Iniciar nova carreira</button>
    </div>
  `,

  theEnd: `
    <div class="section-card">
      <h2 class="title">Fim da Campanha</h2>
      <p class="subtitle">Você concluiu todos os casos disponíveis nesta versão.</p>
      <button class="btn" onclick="goTo('office')">Voltar ao Escritório</button>
    </div>
  `
};

/* ==========================
   HOOKS (AÇÃO AO ENTRAR NA TELA)
=========================== */

const SCREEN_HOOKS = {
  start() {
    setBackground("capa_principal");
  },
  avatarSelect() {
    setBackground("bg_login");
  },
  captainWelcome() {
    setBackground("capitao_office");
    typeWriter(
      "Bem-vindo(a) a Valley City.\nSou o Capitão Rodriguez.\n\n" +
      "Esta cidade está afundando em violência.\n" +
      "Temos poucos policiais e muitos crimes.\n\n" +
      "Não pise na bola, detetive.\nBoa sorte.",
      "captainText",
      28
    );
  },
  office() {
    setBackground("escritorio_detective");
    renderHUD();
  },
  caseIntro() {
    const c = cases[player.currentCaseIndex];
    if (!c) return;
    const t = document.getElementById("caseTitle");
    const d = document.getElementById("caseDesc");
    const img = document.getElementById("caseImg");
    if (t) t.innerText = c.name;
    if (d) d.innerText = c.description;
    if (img) img.src = "assets/" + c.introImage + ".png";
    setBackground("valley_city_night");
  },
  promotionExam() {
    renderExamQuestion();
  },
  phoneWarrantResult() {
    const box = document.getElementById("warrantResultBox");
    if (!box || !lastWarrantResult) {
      if (box) box.innerHTML = "<p class='small'>Nenhuma informação de mandado disponível.</p>";
      return;
    }

    const { suspectName, guilty, evidence } = lastWarrantResult;

    let html = `<p class="small"><b>Suspeito vistoriado:</b> ${suspectName}</p>`;

    if (evidence && evidence.length > 0) {
      html += `<p class="small">A equipe encontrou as seguintes evidências na residência:</p>`;
      evidence.forEach(ev => {
        html += `
          <div class="list-item">
            <div class="list-item-title">${ev.title} <span class="pill-inline">${ev.type}</span></div>
            <div class="list-item-sub">${ev.description}</div>
          </div>
        `;
      });
      if (guilty) {
        html += `<p class="small"><b>Observação:</b> As novas provas fortalecem a autoria deste suspeito.</p>`;
      } else {
        html += `<p class="small"><b>Observação:</b> As novas provas não o ligam diretamente ao crime.</p>`;
      }
    } else {
      if (guilty) {
        html += `<p class="small">O mandado foi executado, mas nenhuma prova nova foi encontrada nesta busca específica.</p>`;
      } else {
        html += `<p class="small">Nada relevante foi encontrado. Isso pode indicar inocência ou falta de ligação direta.</p>`;
      }
    }

    box.innerHTML = html;
  }
};

/* ==========================
   FUNÇÕES DE INVESTIGAÇÃO
=========================== */

function openWitnesses() {
  if (!player.currentCase) {
    player.currentCase = cases[player.currentCaseIndex];
  }
  const c = player.currentCase;
  goTo("witnesses");

  const list = document.getElementById("witnessList");
  if (!list) return;

  if (!c || !c.witnesses || c.witnesses.length === 0) {
    list.innerHTML = `<p class="small">Nenhuma testemunha disponível neste caso.</p>`;
    return;
  }

  list.innerHTML = "";
  c.witnesses.forEach(w => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.onclick = () => openWitnessDetail(w.id);
    div.innerHTML = `
      <div class="flex">
        <div class="portrait"><img src="assets/${w.image}.png" alt="${w.name}"></div>
        <div>
          <div class="list-item-title">${w.name}</div>
          <div class="list-item-sub">${w.role}</div>
        </div>
      </div>
    `;
    list.appendChild(div);
  });
}

function openWitnessDetail(wId) {
  const c = player.currentCase;
  if (!c) return;

  currentWitness = c.witnesses.find(w => w.id === wId);
  if (!currentWitness) return;

  goTo("witnessDetail");

  const w = currentWitness;
  const wP = document.getElementById("wP");
  const wN = document.getElementById("wN");
  const wR = document.getElementById("wR");
  const wInit = document.getElementById("wInit");

  if (wP) wP.src = `assets/${w.image}.png`;
  if (wN) wN.innerText = w.name;
  if (wR) wR.innerText = w.role;
  if (wInit) wInit.innerText = w.initial;

  const qDiv = document.getElementById("wQuestions");
  if (qDiv) {
    qDiv.innerHTML = "";
    WITNESS_QUESTIONS.forEach(q => {
      const btn = document.createElement("button");
      btn.className = "chip";
      btn.innerText = q.label;
      btn.onclick = () => askWitness(q.id);
      qDiv.appendChild(btn);
    });
  }

  const log = document.getElementById("wLog");
  if (log) log.innerHTML = "";
}

function askWitness(questionId) {
  if (!currentWitness) return;

  const qDef = WITNESS_QUESTIONS.find(q => q.id === questionId);
  const questionLabel = qDef ? qDef.label : "Pergunta";

  const answer =
    currentWitness.answers && currentWitness.answers[questionId]
      ? currentWitness.answers[questionId]
      : "Não sei responder isso com certeza.";

  const log = document.getElementById("wLog");
  if (!log) return;

  const qEl = document.createElement("div");
  qEl.className = "log-line-q";
  qEl.innerText = "Você: " + questionLabel;
  log.appendChild(qEl);

  const aEl = document.createElement("div");
  aEl.className = "log-line-a";
  aEl.innerText = currentWitness.name + ": " + answer;
  log.appendChild(aEl);

  log.scrollTop = log.scrollHeight;
}

/* ==========================
   SUSPEITOS / INTERROGATÓRIO
=========================== */

function openSuspects() {
  if (!player.currentCase) {
    player.currentCase = cases[player.currentCaseIndex];
  }
  const c = player.currentCase;
  goTo("suspects");

  const list = document.getElementById("suspectList");
  if (!list) return;

  if (!c || !c.suspects || c.suspects.length === 0) {
    list.innerHTML = `<p class="small">Nenhum suspeito definido neste caso ainda.</p>`;
    return;
  }

  list.innerHTML = "";
  c.suspects.forEach(s => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.onclick = () => openSuspectDetail(s.id);
    div.innerHTML = `
      <div class="flex">
        <div class="portrait"><img src="assets/${s.image}.png" alt="${s.name}"></div>
        <div>
          <div class="list-item-title">${s.name}</div>
          <div class="list-item-sub">${s.occupation} • ${s.age} anos</div>
        </div>
      </div>
    `;
    list.appendChild(div);
  });
}

function openSuspectDetail(sId) {
  const c = player.currentCase;
  if (!c) return;

  currentSuspect = c.suspects.find(s => s.id === sId);
  if (!currentSuspect) return;

  goTo("suspectDetail");

  const s = currentSuspect;
  const sP = document.getElementById("sP");
  const sN = document.getElementById("sN");
  const sInfo = document.getElementById("sInfo");

  if (sP) sP.src = `assets/${s.image}.png`;
  if (sN) sN.innerText = s.name;
  if (sInfo) {
    sInfo.innerText =
      `${s.age} anos • ${s.occupation} • Residência: ${s.address}\nRegistro: ${s.record}`;
  }

  updateSuspectBars();

  const qDiv = document.getElementById("sQuestions");
  if (qDiv) {
    qDiv.innerHTML = "";
    SUSPECT_QUESTIONS.forEach(q => {
      const btn = document.createElement("button");
      btn.className = "chip";
      btn.innerText = q.label;
      btn.onclick = () => askSuspect(q.id);
      qDiv.appendChild(btn);
    });
  }

  const log = document.getElementById("sLog");
  if (log) log.innerHTML = "";
}

function updateSuspectBars() {
  if (!currentSuspect || !currentSuspect.stats) return;
  const { stress, confidence, anger } = currentSuspect.stats;
  const st = document.getElementById("sb_stress");
  const cf = document.getElementById("sb_conf");
  const ag = document.getElementById("sb_ang");
  if (st) st.style.width = (stress || 0) + "%";
  if (cf) cf.style.width = (confidence || 0) + "%";
  if (ag) ag.style.width = (anger || 0) + "%";
}

function askSuspect(questionId) {
  if (!currentSuspect) return;

  const qDef = SUSPECT_QUESTIONS.find(q => q.id === questionId);
  const questionLabel = qDef ? qDef.label : "Pergunta";

  const answer =
    currentSuspect.answers && currentSuspect.answers[questionId]
      ? currentSuspect.answers[questionId]
      : "Não tenho nada a declarar sobre isso.";

  if (!currentSuspect.stats) currentSuspect.stats = { stress: 0, confidence: 0, anger: 0 };

  if (questionId === "stress") {
    currentSuspect.stats.stress = Math.min(currentSuspect.stats.stress + 10, 100);
    currentSuspect.stats.anger  = Math.min(currentSuspect.stats.anger + 5, 100);
  } else if (questionId === "relation" || questionId === "motive") {
    currentSuspect.stats.stress = Math.min(currentSuspect.stats.stress + 5, 100);
  } else {
    currentSuspect.stats.confidence = Math.max(currentSuspect.stats.confidence - 3, 0);
  }
  updateSuspectBars();

  const log = document.getElementById("sLog");
  if (!log) return;

  const qEl = document.createElement("div");
  qEl.className = "log-line-q";
  qEl.innerText = "Você: " + questionLabel;
  log.appendChild(qEl);

  const aEl = document.createElement("div");
  aEl.className = "log-line-a";
  aEl.innerText = currentSuspect.name + ": " + answer;
  log.appendChild(aEl);

  log.scrollTop = log.scrollHeight;
}

/* ==========================
   PROVAS
=========================== */

function openEvidence() {
  if (!player.currentCase) {
    player.currentCase = cases[player.currentCaseIndex];
  }
  const c = player.currentCase;
  goTo("evidence");

  const list = document.getElementById("eList");
  if (!list) return;

  if (!c || !c.evidence || c.evidence.length === 0) {
    list.innerHTML = `<p class="small">Nenhuma prova cadastrada neste caso.</p>`;
    return;
  }

  list.innerHTML = "";
  c.evidence.forEach(e => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <div class="list-item-title">${e.title} <span class="pill-inline">${e.type}</span></div>
      <div class="list-item-sub">${e.description}</div>
      <img class="thumb" src="assets/${e.image}.png" alt="${e.title}">
      <p class="small"><b>Relevância:</b> ${e.relevance}</p>
    `;
    list.appendChild(div);
  });
}

/* ==========================
   CONCLUSÃO DO CASO
=========================== */

function openConclusion() {
  if (!player.currentCase) {
    player.currentCase = cases[player.currentCaseIndex];
  }

  goTo("conclude");
  const c = player.currentCase;
  const list = document.getElementById("concludeList");
  if (!list) return;

  if (!c || !c.suspects || c.suspects.length === 0) {
    list.innerHTML = `<p class="small">Nenhum suspeito disponível. Impossível concluir o caso.</p>`;
    return;
  }

  list.innerHTML = "";
  c.suspects.forEach(s => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.onclick = () => {
      if (confirm(`Confirmar ${s.name} como culpado?`)) {
        concludeCaseWith(s.id);
      }
    };
    div.innerHTML = `
      <div class="flex">
        <div class="portrait"><img src="assets/${s.image}.png" alt="${s.name}"></div>
        <div>
          <div class="list-item-title">${s.name}</div>
          <div class="list-item-sub">${s.occupation}</div>
        </div>
      </div>
    `;
    list.appendChild(div);
  });
}

/* ==========================
   RESETAR JOGO (DEMISSÃO)
=========================== */

function resetGame() {
  player = {
    name: "",
    avatar: "",
    gender: "M",
    agency: "PD",
    rankIndex: 0,
    rank: "Detetive Júnior",
    moral: 50,
    prestige: 0,
    currentCaseIndex: 0,
    solvedCases: 0,
    failedCases: 0
  };
  currentWitness = null;
  currentSuspect = null;
  lastWarrantResult = null;
  saveGame(); // salva estado limpo
  goTo("start");
}

/* ==========================
   INICIAR GAME (CARREGAR cases.json)
=========================== */

function initGame() {
  fetch("cases.json")
    .then(r => r.json())
    .then(data => {
      cases = data;
      goTo("start");
    })
    .catch(err => {
      console.error(err);
      alert("Erro ao carregar casos. Verifique se 'cases.json' está presente e acessível.");
      // Mesmo assim, mostra tela inicial (sem casos)
      goTo("start");
    });
}

document.addEventListener("DOMContentLoaded", initGame);
