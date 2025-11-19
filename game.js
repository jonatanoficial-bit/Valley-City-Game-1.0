let allCases = [];
let currentCaseIndex = 0;

async function startGame() {
    // troca de telas
    document.getElementById("startScreen").classList.remove("active");
    document.getElementById("caseScreen").classList.add("active");

    // carrega os casos
    await loadCases();

    // se nada foi carregado, não tenta abrir caso
    if (!allCases || allCases.length === 0) {
        alert("Nenhum caso foi carregado. Verifique se o arquivo cases.json está na mesma pasta do index.html.");
        return;
    }

    loadCase(0);
}

async function loadCases() {
    try {
        // força o navegador a não usar cache antigo
        const res = await fetch("cases.json", { cache: "no-store" });

        if (!res.ok) {
            throw new Error("HTTP " + res.status);
        }

        const data = await res.json();

        allCases = []
            .concat(Array.isArray(data.police) ? data.police : [])
            .concat(Array.isArray(data.fbi) ? data.fbi : [])
            .concat(Array.isArray(data.cia) ? data.cia : []);

        console.log("Casos carregados:", allCases.length);
    } catch (e) {
        console.error("Erro ao carregar cases.json:", e);
        alert("Erro ao carregar cases.json. Confira o nome do arquivo e se ele está na mesma pasta do index.html.");
        allCases = [];
    }
}

function loadCase(i) {
    if (!allCases || allCases.length === 0) return;

    if (i < 0 || i >= allCases.length) i = 0;
    currentCaseIndex = i;

    const c = allCases[i];

    const caseTitleEl = document.getElementById("caseTitle");
    const caseSceneEl = document.getElementById("caseScene");

    if (caseTitleEl) {
        caseTitleEl.innerText = c.title || `Caso ${c.id}`;
    }

    if (caseSceneEl && c.scene) {
        caseSceneEl.style.backgroundImage = `url('assets/${c.scene}')`;
    }
}

function openInvestigation() {
    if (!allCases || allCases.length === 0) return;

    const c = allCases[currentCaseIndex];

    document.getElementById("caseScreen").classList.remove("active");
    document.getElementById("investigationScreen").classList.add("active");

    document.getElementById("caseTitle2").innerText = c.title || "";
    document.getElementById("caseDescription").innerText = c.description || "";

    const wBox = document.getElementById("witnesses");
    const sBox = document.getElementById("suspects");
    const eBox = document.getElementById("evidence");

    wBox.innerHTML = "";
    sBox.innerHTML = "";
    eBox.innerHTML = "";

    (c.witnesses || []).forEach(w => {
        const img = document.createElement("img");
        img.src = `assets/${w}`;
        img.alt = "Testemunha";
        wBox.appendChild(img);
    });

    (c.suspects || []).forEach(s => {
        const img = document.createElement("img");
        img.src = `assets/${s}`;
        img.alt = "Suspeito";
        img.onclick = () => chooseSuspect(c, s);
        sBox.appendChild(img);
    });

    (c.evidence || []).forEach(e => {
        const img = document.createElement("img");
        img.src = `assets/${e}`;
        img.alt = "Prova";
        eBox.appendChild(img);
    });
}

function chooseSuspect(c, suspect) {
    if (!c || !c.real_culprit) return;

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
