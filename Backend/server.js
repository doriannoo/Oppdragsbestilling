import express from "express";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// Finn mappeplassering (fordi "type": "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pek til mappene
const hjemmesidePath = path.join(__dirname, "..", "Hjemmeside");
const personvernPath = path.join(__dirname, "..", "Personvern");

// ✅ 1) Server Hjemmeside både som ROOT og som /Hjemmeside
app.use(express.static(hjemmesidePath));
app.use("/Hjemmeside", express.static(hjemmesidePath));

// ✅ 2) Server Personvern som /Personvern (så Live Server-linker fungerer også på localhost)
app.use("/Personvern", express.static(personvernPath));

// Database
const db = new sqlite3.Database("./database.db");

db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    createdAt TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    description TEXT NOT NULL,
    deadline TEXT NOT NULL
  )
`);

function isValidEmail(email) {
  return typeof email === "string" && email.includes("@") && email.includes(".");
}

// POST: lagre bestilling
app.post("/api/orders", (req, res) => {
  const { name, email, phone, description, deadline } = req.body || {};

  if (!name || !email || !description || !deadline) {
    return res.status(400).json({ error: "Mangler obligatoriske felt." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Ugyldig e-post." });
  }

  const createdAt = new Date().toISOString();

  db.run(
    `INSERT INTO orders (createdAt, name, email, phone, description, deadline)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [createdAt, name.trim(), email.trim(), (phone || "").trim(), description.trim(), deadline.trim()],
    function (err) {
      if (err) return res.status(500).json({ error: "Database-feil." });
      res.status(201).json({ ok: true, id: this.lastID });
    }
  );
});

// GET: hent alle bestillinger
app.get("/api/orders", (req, res) => {
  db.all(`SELECT * FROM orders ORDER BY id DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: "Database-feil." });
    res.json(rows);
  });
});

// DELETE: slett bestilling
app.delete("/api/orders/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Ugyldig ID." });

  db.run(`DELETE FROM orders WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: "Database-feil." });
    res.json({ ok: true, deleted: this.changes });
  });
});

// Forsiden: send index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(hjemmesidePath, "index.html"));
});

app.listen(3000, () => {
  console.log("Åpne nettsiden her: http://localhost:3000");
});
