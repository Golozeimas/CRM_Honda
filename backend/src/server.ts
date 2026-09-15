import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import { db } from "./config/firebase";

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "MiniCRM API funcionando",
  });
});

app.get("/api/test-db", async (_req, res) => {
  try {
    const testDoc = await db.collection("test").doc("test-doc").set({
      message: "Hello World",
      timestamp: new Date()
    });
    res.json({ status: "success", message: "Conexão com Firestore bem-sucedida!", data: testDoc });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: "Erro ao conectar com Firestore", error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});