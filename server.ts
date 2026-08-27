import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// ─────────────────────────────────────────────────────────────────
// KLEOS CONSULTORÍA — Servidor Express + Vite
// (Sin dependencias de API externa: el sitio es 100% estático.)
// ─────────────────────────────────────────────────────────────────

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Servir estáticos e integrar Vite
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Soporte SPA Routing (Express v4)
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[KLEOS AGENCY OS] Operativo en http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error crítico al iniciar el servidor:", err);
});
