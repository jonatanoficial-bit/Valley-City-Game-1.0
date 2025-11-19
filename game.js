/* ============================================================
   VALLEY CITY - GAME ENGINE (Parte 3A)
   ============================================================ */

/* ========================= */
/* SISTEMA DE TELAS */
/* ========================= */

function goTo(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(`screen-${screenId}`).classList.add("active");
}

/* ========================= */
/* DADOS DO PLAYER */
/* ========================= */

let player = {
    name: "",
    avatar: "default_avatar.png",
    rank: "Detetive Júnior",
    rankLevel: 0,
    agency: "PD",
    moral: 50,
    prestige: 0,
    solved: 0,
    failed: 0,
    warnings: 0,
    currentCase: null,
};

/* ========================= */
/* SALVAR E CARREGAR */
/* ========================= */

function saveGame() {
    localStorage.setItem("valleyCitySave", JSON.stringify(player));
    alert("Progresso salvo com sucesso!");
}

function loadGame() {
    let save = localStorage.getItem("valleyCitySave");

    if (!save) {
        alert("Nenhum jogo salvo encontrado!");
        return;
    }

    player = JSON.parse(save);
    updateOfficeHUD();
    goTo("office");
}

/* ========================= */
/* INICIAR NOVO JOGO */
/* ========================= */

function startNewGame() {
    goTo("avatar");
    showAvatarSelection();
}

/* ========================= */
/* AVATARES AUTOMÁTICOS */
/* ========================= */

async function loadAvatars() {
    try {
        const response = await fetch("assets/");
        const text = await response.text();

        const regex = /href="([^"]+\.png)"/g;
        let match;
        const avatars = [];

        while ((match = regex.exec(text)) !== null) {
            const file = match[1];
            if (file.startsWith("avatar_") && file.endsWith(".png")) {
                avatars.push(file);
            }
        }

        avatars.sort((a, b) => a.localeCompare(b));

        return avatars;
    } catch (err) {
        console.error("Erro ao carregar avatares:", err);
        return [];
    }
}

async function showAvatarSelection() {
    goTo("avatar");

    const grid = document.getElementById("avatarGrid");
    grid.innerHTML = "Carregando avatares...";

    const avatars = await loadAvatars();

    grid.innerHTML = "";

    avatars.forEach(filename => {
        const div = document.createElement("div");
        div.className = "avatar-option";

        div.innerHTML = `
            <img src="assets/${filename}" 
                 class="avatar-img" 
                 onerror="this.src='assets/default_avatar.png'">
        `;

        div.addEventListener("click", () => {
            player.avatar = filename;

            document.querySelectorAll(".avatar-option")
                .forEach(x => x.classList.remove("selected-avatar"));

            div.classList.add("selected-avatar");
        });

        grid.appendChild(div);
    });
}

function confirmAvatar() {
    if (!player.avatar) {
        alert("Selecione um avatar primeiro!");
        return;
    }

    player.name = prompt("Digite seu nome de agente:", "Detetive");

    if (!player.name) player.name = "Detetive";

    goTo("briefing");
}

/* ========================= */
/* ESCRITÓRIO – HUD */
/* ========================= */

function updateOfficeHUD() {
    document.getElementById("officeAvatar").src = "assets/" + player.avatar;
    document.getElementById("officeName").textContent = player.name;
    document.getElementById("officeRank").textContent = player.rank;

    document.getElementById("officeStats").innerHTML = `
        Agência: ${player.agency}<br>
        Moral: ${player.moral}% • Prestígio: ${player.prestige}%<br>
        Casos Resolvidos: ${player.solved} • Falhas: ${player.failed}
    `;
}

function goOffice() {
    updateOfficeHUD();
    goTo("office");
}

/* ========================= */
/* CARREGAR CASOS DO cases.json */
/* ========================= */

let CASES = [];

async function loadCases() {
    try {
        const response = await fetch("cases.json");
        const json = await response.json();

        if (!Array.isArray(json)) {
            throw new Error("cases.json não está no formato de array.");
        }

        CASES = json;
        console.log("Casos carregados:", CASES);

    } catch (err) {
        console.error("Erro ao carregar casos:", err);
        alert("Erro ao carregar casos. Verifique se o arquivo cases.json está correto.");
    }
}

// Carrega casos ao abrir o jogo
loadCases();
/* ============================================================
   PARTE 3B — CASOS / TESTEMUNHAS / PROVAS / SUSPEITOS
   ============================================================ */

/* ========================= */
/* INICIAR PRÓXIMO CASO */
/* ========================= */

function startNextCase() {
    if (CASES.length === 0) {
        alert("Nenhum caso disponível no momento.");
        return;
    }

    // decide qual caso chamar baseado no nível / agência
    const availableCases = CASES.filter(c =>
        c.agency === player.agency || c.agency === "ANY"
    );

    // pega o próximo caso da lista baseado no progresso
    let index = player.solved + player.failed;

    if (index >= availableCases.length) {
        alert("Você completou todos os casos disponíveis nesta versão.");
        return;
    }

    player.currentCase = availableCases[index];
    loadCaseScreen(player.currentCase);
}

/* ========================= */
/* CARREGAR TELA DO CASO */
/* ========================= */

function loadCaseScreen(c) {
    document.getElementById("caseTitle").textContent = c.title;
    document.getElementById("caseDescription").textContent = c.description;

    const bg = document.getElementById("caseBackground");
    bg.src = "assets/" + c.background;

    goTo("case");
}

/* ========================= */
/* TELA DE TESTEMUNHAS */
/* ========================= */

function openWitnesses() {
    const box = document.getElementById("witnessList");
    box.innerHTML = "";

    const witnesses = player.currentCase.witnesses;

    witnesses.forEach((w, index) => {
        const item = document.createElement("div");
        item.className = "list-item";

        item.innerHTML = `
            <strong>${w.name}</strong><br>
            <em>${w.statement}</em><br><br>
            <button class="btn-secondary" onclick="questionWitness(${index})">Interrogar</button>
        `;

        box.appendChild(item);
    });

    goTo("witnesses");
}

/* ========================= */
/* INTERROGAR TESTEMUNHA */
/* ========================= */

function questionWitness(i) {
    const w = player.currentCase.witnesses[i];

    let pergunta = prompt("Digite sua pergunta para a testemunha:");

    if (!pergunta) return;

    // mecanismo simples baseado em palavras-chave
    pergunta = pergunta.toLowerCase();

    let resposta = "Não sei responder isso.";

    if (pergunta.includes("onde") || pergunta.includes("local")) {
        resposta = w.details.location;
    }
    else if (pergunta.includes("hor") || pergunta.includes("quando")) {
        resposta = w.details.time;
    }
    else if (pergunta.includes("vitima") || pergunta.includes("vítima")) {
        resposta = w.details.victim;
    }
    else if (pergunta.includes("culp") || pergunta.includes("suspeito")) {
        resposta = w.details.suspicion;
    }
    else if (pergunta.includes("mais") || pergunta.includes("algo")) {
        resposta = w.details.extra;
    }

    alert(`Testemunha (${w.name}):\n\n${resposta}`);
}

/* ========================= */
/* TELA DE PROVAS */
/* ========================= */

function openEvidence() {
    const box = document.getElementById("evidenceList");
    box.innerHTML = "";

    player.currentCase.evidence.forEach(ev => {
        const item = document.createElement("div");
        item.className = "list-item";

        item.innerHTML = `
            <strong>${ev.name}</strong><br>
            <em>${ev.description}</em><br><br>
            <img src="assets/${ev.image}" style="width:100%;border-radius:10px;margin-top:5px;">
        `;

        box.appendChild(item);
    });

    goTo("evidence");
}

/* ========================= */
/* TELA DE SUSPEITOS */
/* ========================= */

function openSuspects() {
    const box = document.getElementById("suspectList");
    box.innerHTML = "";

    player.currentCase.suspects.forEach((s, index) => {
        const item = document.createElement("div");
        item.className = "list-item";

        item.innerHTML = `
            <strong>${s.name}</strong><br>
            Idade: ${s.age}<br>
            Histórico: ${s.history}<br>
            Álibi: <em>${s.alibi}</em><br><br>
            <img src="assets/${s.image}" style="width:100%;border-radius:10px;"><br><br>
            <button class="btn-secondary" onclick="interrogateSuspect(${index})">Interrogar</button>
            <button class="btn-primary" onclick="selectSuspect(${index})">Acusar</button>
        `;

        box.appendChild(item);
    });

    goTo("suspects");
}

let selectedSuspect = null;

function selectSuspect(i) {
    selectedSuspect = i;
    alert("Suspeito selecionado para acusação.");
}

/* ========================= */
/* INTERROGAR SUSPEITO */
/* ========================= */

function interrogateSuspect(i) {
    const s = player.currentCase.suspects[i];

    let pergunta = prompt("Qual é sua pergunta?");

    if (!pergunta) return;

    pergunta = pergunta.toLowerCase();

    let resposta = "Não tenho nada a declarar.";

    if (pergunta.includes("onde") || pergunta.includes("local")) {
        resposta = s.details.location;
    }
    else if (pergunta.includes("hora") || pergunta.includes("quando")) {
        resposta = s.details.time;
    }
    else if (pergunta.includes("vitima") || pergunta.includes("vítima")) {
        resposta = s.details.victim;
    }
    else if (pergunta.includes("motivo") || pergunta.includes("razao")) {
        resposta = s.details.motive;
    }
    else if (pergunta.includes("prova") || pergunta.includes("evid")) {
        resposta = s.details.evidence;
    }

    alert(`Suspeito (${s.name}):\n\n${resposta}`);
}

/* ========================= */
/* CONCLUIR CASO */
/* ========================= */

function concludeCase() {
    if (selectedSuspect === null) {
        alert("Você precisa selecionar um suspeito antes!");
        return;
    }

    let s = player.currentCase.suspects[selectedSuspect];

    // verifica se é o culpado
    if (s.guilty === true) {
        alert("Caso solucionado! Parabéns, detetive!");
        player.solved++;
        player.prestige += 10;
        player.moral += 5;
    } else {
        alert("Suspeito incorreto! Você cometeu um erro grave.");
        player.failed++;
        player.warnings++;
        player.prestige -= 5;
        player.moral -= 10;
    }

    selectedSuspect = null;

    // verifica se será demitido
    if (player.warnings >= 6) {
        alert("Você acumulou advertências demais. Está demitido.");
        goTo("start");
        return;
    }

    goOffice();
}
/* ============================================================
   PARTE 3C — TELEFONE / PROMOÇÃO / MANDADO / SISTEMA AAA
   ============================================================ */


/* =============================== */
/* TELEFONE */
/* =============================== */

function openPhone() {
    let choice = prompt(
        "TELEFONE — Escolha uma opção:\n\n" +
        "1 — Ligar para o chefe\n" +
        "2 — Solicitar mandado de busca\n" +
        "3 — Cancelar"
    );

    if (!choice) return;

    if (choice === "1") phoneCallChief();
    else if (choice === "2") phoneWarrant();
}

/* =============================== */
/* LIGAR PARA O CHEFE */
/* =============================== */

function phoneCallChief() {
    let option = prompt(
        "Chefe (Telefone):\n" +
        "… Fale logo, detetive. Estou ocupado.\n\n" +
        "1 — Pedir demissão\n" +
        "2 — Pedir desculpas\n" +
        "3 — Elogiar o trabalho do chefe\n" +
        "4 — Elogiar a equipe de polícia\n" +
        "5 — Voltar"
    );

    if (!option) return;

    switch(option) {
        case "1":
            if (confirm("Tem certeza que deseja pedir demissão?")) {
                alert("Você se demitiu oficialmente da Polícia de Valley City.");
                goTo("start");
            }
            break;

        case "2":
            alert("Chefe: “Hum… pelo menos reconhece seus erros. +5 moral, +3 prestígio.”");
            player.moral += 5;
            player.prestige += 3;
            break;

        case "3":
            alert("Chefe: “Finalmente alguém nota meu trabalho. +4 prestígio.”");
            player.prestige += 4;
            break;

        case "4":
            alert("Chefe: “A equipe agradece. +3 moral.”");
            player.moral += 3;
            break;

        default:
            break;
    }

    goOffice();
}

/* =============================== */
/* MANDADO DE BUSCA */
/* =============================== */

function phoneWarrant() {
    if (!player.currentCase) {
        alert("Você precisa estar investigando um caso.");
        return;
    }

    let suspects = player.currentCase.suspects;
    let names = suspects.map((s, i) => `${i+1} — ${s.name}`).join("\n");

    let choice = prompt(
        "MANDADO DE BUSCA — Escolha um suspeito:\n\n" +
        names + "\n" +
        (suspects.length+1) + " — Cancelar"
    );

    if (!choice) return;

    let index = parseInt(choice) - 1;
    if (index < 0 || index >= suspects.length) return;

    executeWarrant(index);
}

function executeWarrant(i) {
    const suspect = player.currentCase.suspects[i];

    if (suspect.guilty) {
        alert(
            "MANDADO EXECUTADO!\n\n" +
            "A equipe encontrou provas incriminatórias na casa do suspeito:\n" +
            "• Arma compatível\n" +
            "• Roupas com sangue\n" +
            "• Mensagens comprometedoras\n\n" +
            "Essas provas foram adicionadas ao caso."
        );

        player.currentCase.evidence.push({
            name: "Provas do Mandado de Busca",
            description: "Materiais encontrados na casa do suspeito confirmando sua autoria.",
            image: "evidence_weapon_01.png"
        });

    } else {
        alert(
            "MANDADO EXECUTADO (suspeito inocente)\n\n" +
            "Nada relevante foi encontrado.\n" +
            "Isso não prova inocência, mas não ajuda na acusação."
        );

        player.currentCase.evidence.push({
            name: "Busca sem evidências",
            description: "Nenhuma prova relevante foi encontrada durante a busca.",
            image: "evidence_obj_03.png"
        });
    }

    goTo("case");
}

/* ===================================================== */
/* SISTEMA DE PROMOÇÃO – QUIZ E PROGRESSÃO */
/* ===================================================== */

function openPromotion() {
    // tabela de promoções
    const RANKS = [
        { agency: "PD", name: "Detetive Júnior",   minCases: 0, minPrestige: 0 },
        { agency: "PD", name: "Detetive Titular",  minCases: 3, minPrestige: 20 },
        { agency: "PD", name: "Casos Especiais",   minCases: 6, minPrestige: 40 },

        { agency: "FBI", name: "Agente Júnior",          minCases: 10, minPrestige: 60 },
        { agency: "FBI", name: "Agente Federal",         minCases: 14, minPrestige: 75 },
        { agency: "FBI", name: "Investigação Especial",  minCases: 18, minPrestige: 85 },

        { agency: "CIA", name: "Analista de Dados",      minCases: 22, minPrestige: 90 },
        { agency: "CIA", name: "Agente Nível 1",         minCases: 26, minPrestige: 95 },
        { agency: "CIA", name: "Agente Nível 2",         minCases: 30, minPrestige: 110 },
        { agency: "CIA", name: "Agente Nível 3",         minCases: 36, minPrestige: 125 },
        { agency: "CIA", name: "Agente Nível 4",         minCases: 42, minPrestige: 135 },
        { agency: "CIA", name: "Agente Especial",        minCases: 50, minPrestige: 150 }
    ];

    // rank atual
    let current = player.rankLevel;
    let next = RANKS[current + 1];

    if (!next) {
        alert("Você já atingiu o nível máximo de carreira.");
        return;
    }

    if (player.solved < next.minCases || player.prestige < next.minPrestige) {
        alert(
            "Você ainda não cumpre os requisitos para promoção.\n\n" +
            `Próximo cargo: ${next.name}\n` +
            `Casos necessários: ${next.minCases}\n` +
            `Prestígio necessário: ${next.minPrestige}`
        );
        return;
    }

    if (confirm("Você está apto para a promoção! Deseja fazer a prova agora?")) {
        startPromotionQuiz(next);
    }
}

/* =============================== */
/* QUIZ DE PROMOÇÃO */
/* =============================== */

function startPromotionQuiz(nextRank) {
    const QUESTIONS = [
        {
            q: "O que deve ser analisado primeiro em uma cena de crime?",
            a: "A segurança do local"
        },
        {
            q: "Qual órgão investiga crimes interestaduais?",
            a: "FBI"
        },
        {
            q: "O que é uma prova circunstancial?",
            a: "Prova indireta"
        },
        {
            q: "É permitido acusar sem provas?",
            a: "Não"
        },
        {
            q: "Qual a primeira ação ao encontrar uma testemunha?",
            a: "Registrar o depoimento"
        },
        {
            q: "Mandado de busca deve ser executado por?",
            a: "Equipe policial autorizada"
        },
        {
            q: "Perícia balística analisa?",
            a: "Armas e munições"
        },
        {
            q: "Qual órgão trabalha com inteligência internacional?",
            a: "CIA"
        },
        {
            q: "Qual agente pode atuar dentro e fora do país?",
            a: "CIA"
        },
        {
            q: "Qual valor é essencial para investigação?",
            a: "Ética"
        }
    ];

    let score = 0;

    for (let i = 0; i < 10; i++) {
        let answer = prompt(`PROVA DE PROMOÇÃO\n\n${QUESTIONS[i].q}`);

        if (!answer) continue;

        answer = answer.trim().toLowerCase();
        let correct = QUESTIONS[i].a.toLowerCase();

        if (answer.includes(correct)) score++;
    }

    if (score >= 7) {
        alert(`Aprovado! (${score}/10)\nVocê foi promovido para: ${nextRank.name}`);
        player.rank = nextRank.name;
        player.rankLevel++;
        player.agency = nextRank.agency;

        player.moral += 10;
        player.prestige += 15;

    } else {
        alert(`Reprovado (${score}/10)\nTente novamente mais tarde.`);
        player.moral -= 5;
    }

    goOffice();
}

/* ===================================================== */
/* FIM DA PARTE 3C */
/* ===================================================== */
