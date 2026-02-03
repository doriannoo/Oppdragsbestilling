const API_URL = "/api/orders";

const ordersBody = document.getElementById("ordersBody");
const emptyState = document.getElementById("emptyState");
const countEl = document.getElementById("count");
const searchInput = document.getElementById("searchInput");
const btnRefresh = document.getElementById("btnRefresh");

let allOrders = [];

function formatDateTime(iso) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}.${yyyy} kl ${hh}:${min}`;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function fetchOrders() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Kunne ikke hente bestillinger");
  return await res.json();
}

async function deleteOrder(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Kunne ikke slette bestilling");
  return await res.json();
}

function render(list) {
  ordersBody.innerHTML = "";
  countEl.textContent = list.length;

  if (list.length === 0) {
    emptyState.style.display = "block";
    emptyState.textContent = "Ingen bestillinger funnet.";
    return;
  }

  emptyState.style.display = "none";

  for (const o of list) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="nowrap">${escapeHtml(formatDateTime(o.createdAt))}</td>
      <td>${escapeHtml(o.name)}</td>
      <td class="nowrap">
        <a class="mail" href="mailto:${escapeHtml(o.email)}">${escapeHtml(o.email)}</a>
      </td>
      <td class="nowrap">${o.phone && o.phone.trim() ? escapeHtml(o.phone) : "—"}</td>
      <td class="nowrap">${escapeHtml(o.deadline)}</td>
      <td>${escapeHtml(o.description)}</td>
      <td class="nowrap">
        <button class="btn danger" data-delete="${o.id}">Slett</button>
      </td>
    `;

    ordersBody.appendChild(tr);
  }
}

function applySearch() {
  const q = (searchInput.value || "").trim().toLowerCase();

  if (!q) {
    render(allOrders);
    return;
  }

  const filtered = allOrders.filter((o) => {
    const text = [
      o.name,
      o.email,
      o.phone || "",
      o.deadline,
      o.description,
      o.createdAt
    ].join(" ").toLowerCase();

    return text.includes(q);
  });

  render(filtered);
}

async function load() {
  emptyState.style.display = "block";
  emptyState.textContent = "Laster...";

  try {
    allOrders = await fetchOrders();
    applySearch();
  } catch (err) {
    console.error(err);
    emptyState.style.display = "block";
    emptyState.textContent = "Kunne ikke hente bestillinger. Sjekk at backend kjører.";
    countEl.textContent = "0";
  }
}

document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-delete]");
  if (!btn) return;

  const id = btn.getAttribute("data-delete");
  const ok = confirm("Vil du slette denne bestillingen?");
  if (!ok) return;

  try {
    await deleteOrder(id);
    await load();
  } catch (err) {
    alert("Kunne ikke slette. Sjekk backend.");
  }
});

searchInput.addEventListener("input", applySearch);
btnRefresh.addEventListener("click", load);

load();
