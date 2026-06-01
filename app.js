const pointsLeftEl = document.querySelector("#points-left");
const pointsRingEl = document.querySelector("#points-ring");
const pointsMeterEl = document.querySelector("#points-meter");
const meterPercentEl = document.querySelector("#meter-percent");
const lossCountEl = document.querySelector("#loss-count");
const rewardStatusEl = document.querySelector("#reward-status");
const historyListEl = document.querySelector("#history-list");
const historyEmptyEl = document.querySelector("#history-empty");
const updatedAtEl = document.querySelector("#updated-at");

function formatDate(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  return new Intl.DateTimeFormat("fr-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

async function loadTrackerData() {
  const response = await fetch(`data.json?cacheBust=${Date.now()}`);
  if (!response.ok) {
    throw new Error("Impossible de charger les données.");
  }

  return response.json();
}

function render(data) {
  const startingPoints = data.startingPoints ?? 20;
  const losses = data.losses ?? [];
  const totalPeriods = (data.remainingSchoolDays ?? 17) * (data.periodsPerDay ?? 4);
  const pointsLeft = Math.max(startingPoints - losses.length, 0);
  const percentLeft = (pointsLeft / startingPoints) * 100;

  pointsLeftEl.textContent = pointsLeft;
  pointsRingEl.style.setProperty("--progress", `${percentLeft}%`);
  pointsMeterEl.style.width = `${percentLeft}%`;
  meterPercentEl.textContent = `${Math.round(percentLeft)}%`;
  lossCountEl.textContent = losses.length;
  document.querySelector(".score-card:nth-child(1) strong").textContent = startingPoints;
  document.querySelector(".score-card:nth-child(2) strong").textContent = totalPeriods;
  historyEmptyEl.hidden = losses.length > 0;
  updatedAtEl.textContent = data.lastUpdated
    ? `Mis à jour le ${formatDate(data.lastUpdated)}`
    : "";

  rewardStatusEl.classList.toggle("good", pointsLeft > 0);
  rewardStatusEl.classList.toggle("danger", pointsLeft === 0);
  rewardStatusEl.textContent =
    pointsLeft > 0
      ? `Objectif encore possible: il reste ${pointsLeft} point${pointsLeft > 1 ? "s" : ""} pour ${data.reward}.`
      : `Il ne reste plus de points pour ${data.reward}.`;

  historyListEl.innerHTML = "";

  losses
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .forEach((loss) => {
      const item = document.createElement("li");
      item.className = "history-item";

      const details = document.createElement("div");
      const title = document.createElement("strong");
      const note = document.createElement("p");

      title.textContent = `${formatDate(loss.date)} - ${loss.reason}`;
      note.textContent = loss.note || "Aucune note ajoutée.";

      details.append(title, note);
      item.append(details);
      historyListEl.append(item);
    });
}

loadTrackerData()
  .then(render)
  .catch(() => {
    rewardStatusEl.classList.add("danger");
    rewardStatusEl.textContent = "Les données ne sont pas disponibles pour le moment.";
  });
