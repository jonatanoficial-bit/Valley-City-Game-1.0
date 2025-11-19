/* ==========================================
   Valley City: Police Investigations
   style.css
   Foco em mobile, visual cinematográfico
========================================== */

/* RESET BÁSICO */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: radial-gradient(circle at top, #111827 0, #020617 55%, #000 100%);
  color: #e5e7eb;
}

button {
  font-family: inherit;
}

/* LAYER DE FUNDO CINEMATOGRÁFICO */
#bg-layer {
  position: fixed;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  pointer-events: none;       /* NÃO captura clique */
  z-index: 0;
  transition: opacity 0.3s ease;
}

/* CONTAINER DO JOGO */
#app {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* CARD PRINCIPAL DAS TELAS */
.section-card {
  width: 100%;
  max-width: 520px;
  background: linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.90));
  border-radius: 18px;
  border: 1px solid rgba(31,41,55,0.9);
  padding: 16px 14px 18px;
  box-shadow:
    0 20px 45px rgba(0,0,0,0.7),
    0 0 0 1px rgba(15,23,42,0.8);
}

/* TÍTULOS / TEXTOS */
.title {
  font-size: 1.4rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.subtitle {
  font-size: 0.9rem;
  color: #9ca3af;
  margin-bottom: 12px;
}

.small {
  font-size: 0.78rem;
  color: #9ca3af;
}

/* LABELS / INPUTS */
.label {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 8px 0 4px;
}

.input {
  width: 100%;
  border-radius: 999px;
  border: 1px solid rgba(55,65,81,0.9);
  background: rgba(15,23,42,0.95);
  padding: 7px 11px;
  font-size: 0.85rem;
  color: #e5e7eb;
  outline: none;
}

.input::placeholder {
  color: #6b7280;
}

/* BOTÕES */
.btn,
.btn-secondary,
.btn-danger,
.btn-ghost,
.btn-full {
  width: 100%;
  border-radius: 999px;
  padding: 8px 14px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 6px;
  gap: 6px;
  transition: transform 0.06s ease, box-shadow 0.06s ease, filter 0.12s ease;
}

.btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: #f9fafb;
  box-shadow: 0 8px 20px rgba(37,99,235,0.45);
}

.btn-secondary {
  background: rgba(31,41,55,0.98);
  color: #e5e7eb;
  border: 1px solid rgba(55,65,81,0.9);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444, #b91c1c);
  color: #f9fafb;
  box-shadow: 0 8px 20px rgba(248,113,113,0.4);
}

.btn-ghost {
  background: transparent;
  color: #9ca3af;
  border: 1px dashed rgba(148,163,184,0.8);
}

.btn-full {
  background: rgba(31,41,55,0.98);
  color: #e5e7eb;
  border-radius: 12px;
  border: 1px solid rgba(55,65,81,0.9);
  padding: 9px 10px;
  font-size: 0.85rem;
}

.btn:hover,
.btn-secondary:hover,
.btn-danger:hover,
.btn-ghost:hover,
.btn-full:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(0,0,0,0.45);
}

.btn-row {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

/* AVATARES */
.avatar-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.avatar-option {
  border-radius: 14px;
  border: 1px solid rgba(55,65,81,0.9);
  background: radial-gradient(circle at top, rgba(59,130,246,0.16), rgba(15,23,42,0.95));
  padding: 4px;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.08s ease, border-color 0.1s ease;
}

.avatar-option img {
  width: 100%;
  border-radius: 11px;
  display: block;
}

.avatar-option.selected {
  border-color: #60a5fa;
  box-shadow: 0 0 0 1px rgba(59,130,246,0.9), 0 8px 18px rgba(37,99,235,0.45);
  transform: translateY(-1px);
}

/* FLEX GENÉRICO */
.flex {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* RETRATO (CAPITÃO, SUSPEITO, TESTEMUNHA) */
.portrait {
  width: 60px;
  min-width: 60px;
  height: 60px;
  border-radius: 999px;
  border: 1px solid rgba(55,65,81,0.9);
  overflow: hidden;
  background: #020617;
}

.portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* IMAGENS DE PROVA / CENA */
.thumb {
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border-radius: 12px;
  margin: 8px 0;
}

/* HUD DO ESCRITÓRIO */
.office-header {
  margin-bottom: 10px;
}

.office-avatar img {
  width: 72px;
  height: 72px;
  border-radius: 999px;
  border: 2px solid rgba(59,130,246,0.9);
  object-fit: cover;
}

.office-info h3 {
  font-size: 1rem;
  margin-bottom: 2px;
}

.pill-inline {
  display: inline-block;
  margin-left: 6px;
  padding: 1px 7px;
  border-radius: 999px;
  font-size: 0.7rem;
  background: rgba(59,130,246,0.15);
  color: #bfdbfe;
}

/* BARRAS DE STATUS DO SUSPEITO */
.stat-bars {
  margin: 8px 0;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: #9ca3af;
  margin-bottom: 4px;
}

.stat-bar {
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: rgba(31,41,55,0.9);
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  width: 0%;
  border-radius: 999px;
  background: linear-gradient(90deg, #22c55e, #ef4444);
  transition: width 0.15s ease;
}

/* LOG DE DIÁLOGO (INTERROGATÓRIO / TESTEMUNHA) */
.log-box {
  border-radius: 12px;
  border: 1px solid rgba(55,65,81,0.9);
  background: rgba(15,23,42,0.95);
  padding: 6px;
  max-height: 160px;
  overflow-y: auto;
  font-size: 0.78rem;
}

.log-line-q {
  color: #93c5fd;
  margin-bottom: 2px;
}

.log-line-a {
  color: #e5e7eb;
  margin-bottom: 6px;
}

/* LISTAGENS (TESTEMUNHAS, SUSPEITOS, PROVAS) */
.list-item {
  border-radius: 12px;
  border: 1px solid rgba(55,65,81,0.9);
  background: radial-gradient(circle at top left, rgba(59,130,246,0.14), rgba(15,23,42,0.98));
  padding: 8px 9px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: transform 0.06s ease, box-shadow 0.06s ease, border-color 0.1s ease;
}

.list-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(0,0,0,0.55);
  border-color: #60a5fa;
}

.list-item-title {
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.list-item-sub {
  font-size: 0.78rem;
  color: #9ca3af;
}

/* CHIPS (PERGUNTAS DE INTERROGATÓRIO) */
.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 5px 9px;
  margin: 3px 3px 0 0;
  border: 1px solid rgba(75,85,99,0.9);
  background: rgba(15,23,42,0.98);
  font-size: 0.75rem;
  color: #e5e7eb;
  cursor: pointer;
  transition: background 0.08s ease, transform 0.06s ease, box-shadow 0.06s ease;
}

.chip:hover {
  background: rgba(37,99,235,0.2);
  box-shadow: 0 6px 15px rgba(15,23,42,0.7);
  transform: translateY(-1px);
}

/* EFEITO MÁQUINA DE ESCREVER (CAPITÃO) */
.typewriter {
  font-size: 0.85rem;
  line-height: 1.4;
  color: #e5e7eb;
  white-space: pre-line;
  margin: 10px 0 14px;
  min-height: 90px;
}

/* RESPONSIVIDADE */
@media (max-width: 480px) {
  #app {
    padding: 10px;
  }
  .section-card {
    border-radius: 16px;
    padding: 12px 11px 14px;
  }
  .title {
    font-size: 1.2rem;
  }
  .avatar-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 6px;
  }
}

@media (min-width: 768px) {
  #app {
    padding: 24px;
  }
  .section-card {
    padding: 18px 16px 22px;
  }
}
