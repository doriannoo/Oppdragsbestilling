const API_URL = "/api/orders";

// Kun disse domenene er lov (du kan legge til flere)
const ALLOWED_DOMAINS = ["gmail.com", "icloud.com", "outlook.com", "hotmail.com", "live.com", "yahoo.com"];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bestillingForm");
  const status = document.getElementById("status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const navn = document.getElementById("navn").value.trim();
    const epost = document.getElementById("epost").value.trim().toLowerCase();
    const beskrivelse = document.getElementById("beskrivelse").value.trim();
    const deadline = document.getElementById("deadline").value.trim();

    const telefonEl = document.getElementById("telefon");
    const telefon = telefonEl ? telefonEl.value.trim() : "";

    // Obligatoriske felt
    if (!navn || !epost || !beskrivelse || !deadline) {
      status.style.color = "#b42318";
      status.textContent = "❌ Fyll ut alle obligatoriske felt (navn, e-post, beskrivelse og deadline).";
      return;
    }

    // ---- E-POST: må være ekte format + godkjent domene ----
    if (!epost.includes("@") || !epost.includes(".")) {
      status.style.color = "#b42318";
      status.textContent = "❌ Skriv inn en gyldig e-postadresse.";
      return;
    }

    const domain = epost.split("@")[1] || "";
    if (!ALLOWED_DOMAINS.includes(domain)) {
      status.style.color = "#b42318";
      status.textContent = "❌ E-post må ha domene som: " + ALLOWED_DOMAINS.join(", ");
      return;
    }

    // ---- TELEFON: valgfritt, men hvis fylt ut må det være 8 siffer ----
    if (telefon !== "") {
      const onlyDigits = /^[0-9]+$/.test(telefon);
      if (!onlyDigits) {
        status.style.color = "#b42318";
        status.textContent = "❌ Telefonnummer kan bare inneholde tall.";
        return;
      }
      if (telefon.length !== 8) {
        status.style.color = "#b42318";
        status.textContent = "❌ Telefonnummer må være nøyaktig 8 siffer.";
        return;
      }
    }

    status.style.color = "#334155";
    status.textContent = "⏳ Sender bestilling...";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: navn,
          email: epost,
          phone: telefon,
          description: beskrivelse,
          deadline: deadline
        })
      });

      const data = await response.json();

      if (!response.ok) {
        status.style.color = "#b42318";
        status.textContent = "❌ Feil: " + (data.error || "Noe gikk galt.");
        return;
      }

      status.style.color = "#1f7a3a";
      status.textContent = "✅ Takk! Bestillingen er sendt inn og lagret i databasen.";
      form.reset();

    } catch (err) {
      console.error(err);
      status.style.color = "#b42318";
      status.textContent = "❌ Kunne ikke kontakte serveren. Sjekk at backend kjører.";
    }
  });
});
