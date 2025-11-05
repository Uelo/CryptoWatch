const express = require("express");
const axios = require("axios");
const cors = require("cors");
const NodeCache = require("node-cache");
require("dotenv").config();

const app = express();
const cache = new NodeCache({ stdTTL: 300 });
const PORT = 3000;

app.use(cors());
app.use(express.static("public"));

const API_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
const API_KEY = process.env.CMC_API_KEY;

app.get("/api/coins", async (req, res) => {
  const cached = cache.get("coins");
  if (cached) {
    console.log("🔁 Servindo do cache");
    return res.json(cached);
  }

  try {
    const response = await axios.get(API_URL, {
      headers: { "X-CMC_PRO_API_KEY": API_KEY },
      params: { start: 1, limit: 50, convert: "USD" },
    });

    const data = response.data.data;
    cache.set("coins", data);
    console.log("✅ Cache atualizado");
    res.json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Erro ao buscar dados do CoinMarketCap" });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
);