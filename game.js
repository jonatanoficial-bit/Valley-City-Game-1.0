let avatar = "";
let playerName = "";
let allCases = [];
let currentCaseIndex = 0;

/* TROCA DE TELAS */
function show(screen) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(screen).classList.add("active");
}

/* TELA 1 → AVATAR */
function goToAvatar() {
    show("avatarScreen");

    const list = document.getElementById("avatarList");
    list.innerHTML = "";

    for (let i = 1; i <= 10; i++) {
        const div = document.createElement("div");
        div.className = "avatar-card";
        div.onclick = () => selectAvatar(i);

        div.innerHTML = `
            <img src="assets/avatar_${String(i).padStart(2,"0")}.png">
        `;

        list.appendChild(div);
    }
}

function selectAvatar(id) {
    avatar = `avatar_${String(id).padStart(2,"0")}.png`;

    document.querySelectorAll(".avatar-card")
        .forEach(c => c.classList.remove("selected"));

    event.currentTarget.classList.add("selected");
}

function confirmAvatar() {
    playerName = document.getElementById("playerName").value.trim();
    if (!avatar || !playerName) {
        alert("Escolha um avatar e digite seu nome.");
        return;
    }

    startCaptainDialog();
}

/* TELA DO CAPITÃO */
function startCaptainDialog() {
    show("captainScreen");
    const text = "Valley City não é para amadores. Temos poucos policiais e crimes demais. Faça seu trabalho, detetive.";
    typeWriter("captainText", text, 40);
}

function typeWriter(id, text, speed) {
    let i = 0;
    const el = document.getElementById(id);
    el.innerHTML = "";
    const interval = setInterval(() => {
        el.innerHTML += text.charAt(i);
        i++;
        if (i > text.length) clearInterval(interval);
    }, speed);
}

/* ESCRITÓRIO */
function goToOffice() {
    show("officeScreen");

    document.getElementById("officeAvatar").src = "assets/" + avatar;
    document.getElementById("officeName").innerText = playerName;
}

/* CASOS */
async function loadCasesJSON() {
    const res = await fetch("cases.json", { cache: "no-store" });
    const data = await res.json();
    allCases = data.cases;
}

async function loadNextCase() {
    await loadCasesJSON();

    if (currentCaseIndex >= allCases.length) {
        alert("Fim dos casos.");
        return;
    }

    const c = allCases[currentCaseIndex];

    document.getElementById("caseTitle").innerText = c.title;
    document.getElementById("caseScene").style.backgroundImage = `url('assets/${c.scene}')`;

    show("caseScreen");
}

function openInvestigation() {
    const c = allCases[currentCaseIndex];

    document.getElementById("caseTitle2").innerText = c.title;
    document.getElementById("caseDescription").innerText = c.description;

    renderList("witnesses", c.witnesses);
    renderList("suspects", c.suspects, (s) => chooseSuspect(c, s));
    renderList("evidence", c.evidence);

    show("investigationScreen");
}

function renderList(id, items, callback) {
    const box = document.getElementById(id);
    box.innerHTML = "";
    items.forEach(i => {
        const img = document.createElement("img");
        img.src = `assets/${i}`;
        if (callback) img.onclick = () => callback(i);
        box.appendChild(img);
    });
}

function chooseSuspect(c, suspect) {
    if (suspect === c.real_culprit) {
        alert("✔ Culpado correto!");
        currentCaseIndex++;
        goToOffice();
    } else {
        alert("❌ Errado! Reveja o caso.");
    }
}

function returnToCase() {
    show("caseScreen");
}
