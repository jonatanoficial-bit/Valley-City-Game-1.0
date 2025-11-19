let allCases = [];
let currentCaseIndex = 0;

async function startGame() {
    document.getElementById("startScreen").classList.remove("active");
    document.getElementById("caseScreen").classList.add("active");
    await loadCases();
    loadCase(0);
}

async function loadCases() {
    try {
        const res = await fetch("cases.json");
        const data = await res.json();

        allCases = [
            ...data.police,
            ...data.fbi,
            ...data.cia
        ];

        console.log("Casos carregados:", allCases.length);
    } catch (e) {
        alert("Erro ao carregar cases.json");
        console.error(e);
    }
}

function loadCase(i) {
    const c = allCases[i];
    currentCaseIndex = i;

    document.getElementById("caseTitle").innerText = `${c.title}`;
    document.getElementById("caseScene").style.backgroundImage = `url('assets/${c.scene}')`;
}

function openInvestigation() {
    const c = allCases[currentCaseIndex];

    document.getElementById("caseScreen").classList.remove("active");
    document.getElementById("investigationScreen").classList.add("active");

    document.getElementById("caseTitle2").innerText = c.title;
    document.getElementById("caseDescription").innerText = c.description;

    // Testemunhas
    const wBox = document.getElementById("witnesses");
    wBox.innerHTML = "";
    c.witnesses.forEach(w => {
        const img = document.createElement("img");
        img.src = `assets/${w}`;
        wBox.appendChild(img);
    });

    // Suspeitos
    const sBox = document.getElementById("suspects");
    sBox.innerHTML = "";
    c.suspects.forEach(s => {
        const img = document.createElement("img");
        img.src = `assets/${s}`;
        img.onclick = () => chooseSuspect(c, s);
        sBox.appendChild(img);
    });

    // Provas
    const eBox = document.getElementById("evidence");
    eBox.innerHTML = "";
    c.evidence.forEach(e => {
        const img = document.createElement("img");
        img.src = `assets/${e}`;
        eBox.appendChild(img);
    });
}

function chooseSuspect(c, suspect) {
    if (suspect === c.real_culprit) {
        alert("✔ Culpado correto!");

        if (currentCaseIndex + 1 < allCases.length) {
            loadCase(currentCaseIndex + 1);
            returnToCase();
        } else {
            alert("🎉 Você concluiu todos os casos disponíveis!");
        }

    } else {
        alert("❌ Suspeito incorreto! Revise as provas.");
    }
}

function returnToCase() {
    document.getElementById("investigationScreen").classList.remove("active");
    document.getElementById("caseScreen").classList.add("active");
}
