//Backend
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    console.log("User visited /, serving index.html...");
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Routes for different difficulty levels
app.get("/easy", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get("/medium", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get("/hard", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// API endpoint for difficulty selection
app.post("/api/select-difficulty", (req, res) => {
    const difficulty = req.body.difficulty;
    console.log("Difficulty selected:", difficulty);

    if (["easy", "medium", "hard"].includes(difficulty)) {
        res.json({ success: true, redirectUrl: `/${difficulty}` });
    } else {
        res.status(400).json({ success: false, error: "Invalid difficulty selected" });
    }
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "../public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}/`);
});