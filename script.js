console.log('Stack App loaded successfully!');

// Add your JavaScript code here
const tilesData = [
  {
    id: "daily-budget",
    label: "Daily budget",
    value: 42.75,
    prefix: "$",
    suffix: "",
    sub: "Remaining today",
    trend: "+8.4%",
    trendDirection: "positive",
    tag: "Essential",
    description:
      "Tracks how much you can still spend today without breaking your weekly plan.",
    lastUpdated: "Just now",
    essential: true,
  },
  {
    id: "week-spend",
    label: "This week",
    value: 213.19,
    prefix: "$",
    suffix: "",
    sub: "Total spent",
    trend: "-4.1%",
    trendDirection: "positive",
    tag: "Spending",
    description:
      "Shows your total card and cash spending for the current week.",
    lastUpdated: "2 min ago",
    essential: true,
  },
  {
    id: "savings-progress",
    label: "Savings",
    value: 63,
    prefix: "",
    suffix: "%",
    sub: "Goal progress",
    trend: "+1.2%",
    trendDirection: "positive",
    tag: "Goal",
    description:
      "Visualizes how close you are to your current savings goal.",
    lastUpdated: "Today, 09:14",
    essential: true,
  },
  {
    id: "next-bill",
    label: "Next bill",
    value: 79.99,
    prefix: "$",
    suffix: "",
    sub: "Due in 3 days",
    trend: "—",
    trendDirection: "neutral",
    tag: "Bills",
    description:
      "Keeps the next upcoming bill in front of you so you do not forget it.",
    lastUpdated: "Today, 07:32",
    essential: false,
  },
  {
    id: "invest-portfolio",
    label: "Portfolio",
    value: 12483,
    prefix: "$",
    suffix: "",
    sub: "Total value",
    trend: "+0.7%",
    trendDirection: "positive",
    tag: "Invest",
    description:
      "High-level view of your invested balance across accounts, not detailed charts.",
    lastUpdated: "Today, 08:01",
    essential: false,
  },
  {
    id: "subscription-count",
    label: "Subscriptions",
    value: 9,
    prefix: "",
    suffix: "",
    sub: "Active recurring",
    trend: "stable",
    trendDirection: "neutral",
    tag: "Recurring",
    description:
      "Quick count of all active subscriptions so you remember they exist.",
    lastUpdated: "Yesterday",
    essential: false,
  },
];

const tilesGrid = document.getElementById("tiles-grid");
const detailsPlaceholder = document.getElementById("details-placeholder");
const detailsContent = document.getElementById("details-content");

const detailsTitle = document.getElementById("details-title");
const detailsValue = document.getElementById("details-value");
const detailsDescription = document.getElementById("details-description");
const detailsUpdated = document.getElementById("details-updated");

const controlButtons = document.querySelectorAll(".control-btn");
const refreshBtn = document.getElementById("refresh-btn");

let currentView = "all";

function formatValue(tile) {
  const rounded = Math.round(tile.value * 100) / 100;
  return `${tile.prefix}${rounded.toLocaleString()}${tile.suffix}`;
}

function renderTiles() {
  tilesGrid.innerHTML = "";

  const filteredTiles =
    currentView === "essentials"
      ? tilesData.filter((t) => t.essential)
      : tilesData;

  filteredTiles.forEach((tile) => {
    const el = document.createElement("article");
    el.className = "tile";
    el.dataset.tileId = tile.id;

    el.innerHTML = `
      <div class="tile-header">
        <span class="tile-label">${tile.label}</span>
        <span class="tile-tag">${tile.tag}</span>
      </div>
      <div class="tile-main">
        <div class="tile-value">${formatValue(tile)}</div>
        <div class="tile-sub">${tile.sub}</div>
      </div>
      <div class="tile-footer">
        <span class="tile-trend ${tile.trendDirection}">${tile.trend}</span>
        <span class="tile-meta">${tile.lastUpdated}</span>
      </div>
    `;

    el.addEventListener("click", () => showDetails(tile.id));
    tilesGrid.appendChild(el);
  });
}

function showDetails(tileId) {
  const tile = tilesData.find((t) => t.id === tileId);
  if (!tile) return;

  detailsTitle.textContent = tile.label;
  detailsValue.textContent = formatValue(tile);
  detailsDescription.textContent = tile.description;
  detailsUpdated.textContent = tile.lastUpdated;

  detailsPlaceholder.classList.add("hidden");
  detailsContent.classList.remove("hidden");
}

function setView(view) {
  currentView = view;
  controlButtons.forEach((btn) => {
    const btnView = btn.dataset.view;
    if (!btnView) return;
    btn.classList.toggle("active", btnView === view);
  });
  renderTiles();
}

function refreshData() {
  tilesData.forEach((tile) => {
    const jitter = (Math.random() - 0.5) * 4;
    if (tile.id === "savings-progress") {
      tile.value = Math.min(100, Math.max(0, tile.value + jitter * 0.2));
    } else {
      tile.value = Math.max(0, tile.value + jitter);
    }
    tile.lastUpdated = "Just now";
  });

  renderTiles();
}

controlButtons.forEach((btn) => {
  const view = btn.dataset.view;
  if (!view) return;
  btn.addEventListener("click", () => setView(view));
});

refreshBtn.addEventListener("click", refreshData);

setView("all");
