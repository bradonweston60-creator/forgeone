const storageKey = "forgeone.workspace.v1";

const modes = {
  command: {
    label: "Command",
    type: "Original AI system",
    title: "Personal command layer",
    body: "A privacy-first operating surface that coordinates specialist agents without copying any existing product identity.",
    score: 68,
    plan: [
      "Lock the original ForgeOne identity, owner profile, and private-by-default rules.",
      "Create projects for apps, stores, brand kits, content systems, and research sprints.",
      "Use specialist agents only inside clear approval lanes.",
      "Save important strategy, prompts, and constraints inside the private vault."
    ]
  },
  shop: {
    label: "Shop Builder",
    type: "Commerce workspace",
    title: "Private storefront lab",
    body: "Draft offers, products, policies, launch emails, and checkout tasks without borrowing another platform's brand.",
    score: 72,
    plan: [
      "Define the offer, customer, margin target, fulfillment model, and risk notes.",
      "Generate original catalog copy, product page sections, and launch emails.",
      "Add review gates for pricing, policies, claims, refunds, and publishing.",
      "Prepare an export checklist for the store platform you choose later."
    ]
  },
  canvas: {
    label: "Design Canvas",
    type: "Creative studio",
    title: "Brand and content canvas",
    body: "Shape original visual systems, posts, presentations, prompts, and reusable creative directions for your own brand.",
    score: 74,
    plan: [
      "Document your brand voice, colors, type direction, asset rules, and avoid list.",
      "Generate campaign concepts and reusable content layouts.",
      "Keep text and visual decisions editable before export.",
      "Save approved creative rules in the vault for future runs."
    ]
  },
  code: {
    label: "App Builder",
    type: "Software builder",
    title: "Idea to working app",
    body: "Turn rough ideas into specs, screens, data models, test plans, release notes, and deployment-ready tasks.",
    score: 78,
    plan: [
      "Convert the idea into user flows, screens, data needs, and acceptance checks.",
      "Create a scoped build plan with review points and test expectations.",
      "Track files, decisions, and deployment steps inside the project record.",
      "Require approval before external pushes or live deployment."
    ]
  },
  research: {
    label: "Research",
    type: "Decision engine",
    title: "Evidence before action",
    body: "Compare options, summarize findings, separate facts from guesses, and turn decisions into practical next steps.",
    score: 70,
    plan: [
      "Clarify the decision, constraints, evidence needs, and success criteria.",
      "Collect notes and mark what is sourced, assumed, or still uncertain.",
      "Rank options by cost, speed, risk, upside, and ownership fit.",
      "Convert the result into a short action plan."
    ]
  }
};

const agents = [
  ["OR", "Orchestrator", "Breaks big requests into safe work lanes.", "Ready"],
  ["DS", "Design", "Creates original visuals, layouts, and brand systems.", "Ready"],
  ["CB", "Code", "Builds apps, tests behavior, and prepares releases.", "Ready"],
  ["CM", "Commerce", "Plans offers, catalogs, pages, and launch assets.", "Ready"],
  ["RS", "Research", "Checks claims, compares choices, and flags risk.", "Ready"],
  ["SC", "Security", "Adds approval gates, privacy rules, and export checks.", "Ready"]
];

const checks = [
  ["Original name and interface", "ForgeOne uses its own name, copy, panels, and visual system."],
  ["Owner profile saved", "Your brand name, goal, and privacy setting are stored locally."],
  ["Private vault started", "Key ideas and constraints are saved before connecting external tools."],
  ["Project launchpad active", "Work is organized into projects instead of one loose chat."],
  ["Approval gates defined", "Publishing, buying, deployment, and sharing require explicit review."],
  ["Backend plan selected", "Next step is choosing Convex, Base44, or another backend for real accounts."]
];

let state = {
  ownerName: "",
  ownerGoal: "",
  ownerPrivacy: "Private by default",
  projects: [
    { id: "seed-1", name: "ForgeOne Core Workspace", type: "AI App", status: "In progress" },
    { id: "seed-2", name: "Personal Brand Vault", type: "Brand Kit", status: "Draft" }
  ],
  vaultNotes: "",
  completeChecks: [0, 3, 4]
};

let storageAvailable = true;

const modeButtons = document.querySelectorAll(".mode");
const navButtons = document.querySelectorAll(".nav-item");
const previewType = document.querySelector("#previewType");
const previewTitle = document.querySelector("#previewTitle");
const previewBody = document.querySelector("#previewBody");
const modeLabel = document.querySelector("#modeLabel");
const planList = document.querySelector("#planList");
const legitScore = document.querySelector("#legitScore");
const legitBar = document.querySelector("#legitBar");
const legitText = document.querySelector("#legitText");
const agentList = document.querySelector("#agentList");
const composer = document.querySelector("#composer");
const promptInput = document.querySelector("#prompt");
const agentSelect = document.querySelector("#agentSelect");
const thread = document.querySelector("#thread");
const privacyToggle = document.querySelector("#privacyToggle");
const privacyState = document.querySelector("#privacyState");
const runButton = document.querySelector("#runButton");
const planStatus = document.querySelector("#planStatus");
const ownerForm = document.querySelector("#ownerForm");
const ownerName = document.querySelector("#ownerName");
const ownerGoal = document.querySelector("#ownerGoal");
const ownerPrivacy = document.querySelector("#ownerPrivacy");
const ownerTag = document.querySelector("#ownerTag");
const projectForm = document.querySelector("#projectForm");
const projectName = document.querySelector("#projectName");
const projectType = document.querySelector("#projectType");
const projectList = document.querySelector("#projectList");
const projectCount = document.querySelector("#projectCount");
const vaultNotes = document.querySelector("#vaultNotes");
const saveVault = document.querySelector("#saveVault");
const vaultStatus = document.querySelector("#vaultStatus");
const checkList = document.querySelector("#checkList");
const checkCount = document.querySelector("#checkCount");

function loadState() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey));
    if (saved && typeof saved === "object") {
      state = { ...state, ...saved };
    }
  } catch {
    storageAvailable = false;
  }
}

function saveState() {
  if (!storageAvailable) return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    storageAvailable = false;
  }
}

function renderAgents() {
  agentList.innerHTML = agents
    .map(([initials, name, description, status]) => `
      <article class="agent">
        <div class="agent-badge">${initials}</div>
        <div>
          <h3>${name}</h3>
          <p>${description}</p>
        </div>
        <output>${status}</output>
      </article>
    `)
    .join("");
}

function renderProjects() {
  projectCount.textContent = `${state.projects.length} saved`;
  projectList.innerHTML = state.projects
    .map((project) => `
      <article class="project-card">
        <div>
          <h3>${project.name}</h3>
          <p>${project.type} - ${project.status}</p>
        </div>
        <button type="button" data-remove-project="${project.id}">Archive</button>
      </article>
    `)
    .join("");
}

function renderChecks() {
  checkCount.textContent = `${state.completeChecks.length}/${checks.length}`;
  checkList.innerHTML = checks
    .map(([title, description], index) => `
      <label class="check-item">
        <input type="checkbox" data-check-index="${index}" ${state.completeChecks.includes(index) ? "checked" : ""} />
        <span>
          <strong>${title}</strong>
          ${description}
        </span>
      </label>
    `)
    .join("");
}

function setMode(modeName) {
  const mode = modes[modeName];
  modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === modeName);
  });
  previewType.textContent = mode.type;
  previewTitle.textContent = mode.title;
  previewBody.textContent = mode.body;
  modeLabel.textContent = mode.label;
  planList.innerHTML = mode.plan.map((item) => `<li>${item}</li>`).join("");
  updateReadiness(mode.score);
  planStatus.textContent = "Draft";
}

function updateReadiness(modeScore = 68) {
  const identityBoost = state.ownerName ? 6 : 0;
  const vaultBoost = state.vaultNotes.trim() ? 6 : 0;
  const projectBoost = Math.min(8, state.projects.length * 2);
  const checkBoost = state.completeChecks.length * 3;
  const score = Math.min(96, modeScore + identityBoost + vaultBoost + projectBoost + checkBoost);
  legitScore.textContent = `${score}%`;
  legitBar.style.width = `${score}%`;
  legitText.textContent = score >= 85
    ? "This is ready for backend and real AI connections."
    : "Keep filling identity, vault, projects, and approval rules before connecting live tools.";
}

function addMessage(author, body, kind) {
  const article = document.createElement("article");
  article.className = `message ${kind}`;
  article.innerHTML = `<span>${author}</span><p>${body}</p>`;
  thread.appendChild(article);
  thread.scrollTop = thread.scrollHeight;
}

function applyOwnerState() {
  ownerName.value = state.ownerName;
  ownerGoal.value = state.ownerGoal;
  ownerPrivacy.value = state.ownerPrivacy;
  ownerTag.textContent = state.ownerName || "Personal AI OS";
  privacyState.textContent = state.ownerPrivacy.includes("Review") ? "Review" : "Private";
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(`#${button.dataset.section}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll(".tool-row button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tool-row button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    addMessage("ForgeOne", `${button.dataset.tool} lane selected. I will shape the next run around that part of your system.`, "ai");
  });
});

ownerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.ownerName = ownerName.value.trim();
  state.ownerGoal = ownerGoal.value.trim();
  state.ownerPrivacy = ownerPrivacy.value;
  if (!state.completeChecks.includes(1)) state.completeChecks.push(1);
  applyOwnerState();
  renderChecks();
  updateReadiness();
  saveState();
  addMessage("ForgeOne", `Identity saved for ${state.ownerName || "your workspace"}. Default privacy is ${state.ownerPrivacy}.`, "ai");
});

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = promptInput.value.trim();
  if (!value) return;
  const selected = agentSelect.options[agentSelect.selectedIndex].text;
  addMessage("You", value, "user");
  addMessage("ForgeOne", `${selected} created a private route: define the goal, draft original assets, assemble the workspace, test the main flow, save decisions, then ask before anything publishes.`, "ai");
  planStatus.textContent = "Generated";
});

privacyToggle.addEventListener("click", () => {
  const isPrivate = privacyToggle.getAttribute("aria-pressed") !== "true";
  privacyToggle.setAttribute("aria-pressed", String(isPrivate));
  privacyState.textContent = isPrivate ? "Private" : "Review";
  privacyToggle.style.background = isPrivate ? "#ffffff" : "#fff3df";
});

runButton.addEventListener("click", () => {
  planStatus.textContent = "Running";
  addMessage("ForgeOne", "Local run started. The next production step is adding a backend, real model calls, file storage, and explicit approval gates.", "ai");
});

projectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = projectName.value.trim();
  if (!name) return;
  state.projects.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name,
    type: projectType.value,
    status: "Draft"
  });
  if (!state.completeChecks.includes(3)) state.completeChecks.push(3);
  projectName.value = "";
  renderProjects();
  renderChecks();
  updateReadiness();
  saveState();
});

projectList.addEventListener("click", (event) => {
  const id = event.target?.dataset?.removeProject;
  if (!id) return;
  state.projects = state.projects.filter((project) => project.id !== id);
  saveState();
  renderProjects();
  updateReadiness();
});

saveVault.addEventListener("click", () => {
  state.vaultNotes = vaultNotes.value;
  if (state.vaultNotes.trim() && !state.completeChecks.includes(2)) {
    state.completeChecks.push(2);
  }
  renderChecks();
  updateReadiness();
  saveState();
  vaultStatus.textContent = "Saved locally";
});

checkList.addEventListener("change", (event) => {
  const index = Number(event.target?.dataset?.checkIndex);
  if (Number.isNaN(index)) return;
  if (event.target.checked && !state.completeChecks.includes(index)) {
    state.completeChecks.push(index);
  }
  if (!event.target.checked) {
    state.completeChecks = state.completeChecks.filter((item) => item !== index);
  }
  saveState();
  renderChecks();
  updateReadiness();
});

loadState();
applyOwnerState();
vaultNotes.value = state.vaultNotes;
renderAgents();
renderProjects();
renderChecks();
setMode("command");
