
js = """const API_URL = "https://rickandmortyapi.com/api/character";

const grid = document.getElementById("characterGrid");
const message = document.getElementById("message");
const resultCount = document.getElementById("resultCount");
const pageIndicator = document.getElementById("pageIndicator");
const pageLabel = document.getElementById("pageLabel");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const searchButton = document.getElementById("searchButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");

let currentPage = 1;
let totalPages = 1;
let currentName = "";
let currentStatus = "";

function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? "message error" : "message";
  message.hidden = false;
}

function createMetaRow(label, value) {
  const row = document.createElement("div");
  row.className = "meta-row";

  const labelElement = document.createElement("span");
  labelElement.textContent = label;

  const valueElement = document.createElement("strong");
  valueElement.textContent = value;

  row.append(labelElement, valueElement);
  return row;
}

function translateStatus(status) {
  const translations = {
    Alive: "Vivo",
    Dead: "Morto",
    unknown: "Desconhecido"
  };

  return translations[status] || status;
}

function createCharacterCard(character) {
  // Cria cada card dinamicamente com os dados recebidos da API.
  const card = document.createElement("article");
  card.className = "character-card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "card-image-wrap";

  const image = document.createElement("img");
  image.className = "card-image";
  image.src = character.image;
  image.alt = `Imagem de ${character.name}`;
  image.loading = "lazy";

  const id = document.createElement("span");
  id.className = "card-id";
  id.textContent = `#${character.id}`;

  imageWrap.append(image, id);

  const info = document.createElement("div");
  info.className = "card-info";

  const name = document.createElement("h3");
  name.className = "card-name";
  name.textContent = character.name;

  const statusRow = document.createElement("div");
  statusRow.className = "meta-row";

  const statusLabel = document.createElement("span");
  statusLabel.textContent = "Status";

  const statusValue = document.createElement("strong");
  const statusClass = character.status.toLowerCase() === "alive" ? "alive"
    : character.status.toLowerCase() === "dead" ? "dead" : "";
  statusValue.className = `status ${statusClass}`;

  const dot = document.createElement("i");
  dot.className = "status-dot";

  const statusText = document.createElement("span");
  statusText.textContent = translateStatus(character.status);

  statusValue.append(dot, statusText);
  statusRow.append(statusLabel, statusValue);

  info.append(
    name,
    statusRow,
    createMetaRow("Espécie", character.species),
    createMetaRow("Origem", character.origin?.name || "Desconhecida")
  );

  card.append(imageWrap, info);
  return card;
}

async function loadCharacters(page = 1) {
  currentPage = page;
  grid.replaceChildren();
  showMessage("Consultando a API e carregando personagens...");

  resultCount.textContent = "Buscando dados...";
  prevButton.disabled = true;
  nextButton.disabled = true;

  const params = new URLSearchParams({ page: String(page) });

  if (currentName) params.set("name", currentName);
  if (currentStatus) params.set("status", currentStatus);

  try {
    const response = await fetch(`${API_URL}?${params.toString()}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Nenhum personagem encontrado. Tente outro nome ou filtro.");
      }
      throw new Error(`A API respondeu com o status ${response.status}.`);
    }

    const data = await response.json();
    totalPages = data.info.pages;

    data.results.forEach(character => {
      const card = createCharacterCard(character);
      grid.appendChild(card);
    });

    message.hidden = true;
    resultCount.textContent = `${data.info.count} personagem(ns) encontrado(s)`;
    pageIndicator.textContent = `${data.results.length} exibidos nesta página`;
    pageLabel.textContent = `PÁGINA ${currentPage} DE ${totalPages}`;

    prevButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= totalPages;
  } catch (error) {
    grid.replaceChildren();
    resultCount.textContent = "Consulta não concluída";
    pageIndicator.textContent = "";
    pageLabel.textContent = `PÁGINA ${currentPage}`;
    showMessage(
      error.message || "Não foi possível conectar à API. Verifique sua internet e tente novamente.",
      true
    );
  }
}

function searchCharacters() {
  currentName = searchInput.value.trim();
  currentStatus = statusFilter.value;
  loadCharacters(1);
}

searchButton.addEventListener("click", searchCharacters);

searchInput.addEventListener("keydown", event => {
  if (event.key === "Enter") searchCharacters();
});

statusFilter.addEventListener("change", searchCharacters);

prevButton.addEventListener("click", () => {
  if (currentPage > 1) loadCharacters(currentPage - 1);
});

nextButton.addEventListener("click", () => {
  if (currentPage < totalPages) loadCharacters(currentPage + 1);
});

// Carrega os primeiros personagens quando a página abre.
loadCharacters();
"""
