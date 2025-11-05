let tipoAtual = "crypto";

async function carregarMoedas(tipo) {
  tipoAtual = tipo;
  const container = document.getElementById("coins");
  container.innerHTML = "<p>Carregando...</p>";

  try {
    const res = await fetch("/api/coins");
    const coins = await res.json();

    const filtradas = coins.filter((c) =>
      tipo === "memecoins"
        ? ["DOGE", "SHIB", "PEPE", "FLOKI"].includes(c.symbol)
        : !["DOGE", "SHIB", "PEPE", "FLOKI"].includes(c.symbol)
    );

    container.innerHTML = filtradas
      .map(
        (c) => `
        <div class="card">
          <h3>${c.name} (${c.symbol})</h3>
          <p>💰 ${c.quote.USD.price.toFixed(2)} USD</p>
          <p class="${
            c.quote.USD.percent_change_24h >= 0 ? "up" : "down"
          }">${c.quote.USD.percent_change_24h.toFixed(2)}%</p>
        </div>
      `
      )
      .join("");
  } catch (err) {
    container.innerHTML = "<p>Erro ao carregar moedas.</p>";
  }
}

document.getElementById("tab-crypto").onclick = () => carregarMoedas("crypto");
document.getElementById("tab-meme").onclick = () => carregarMoedas("memecoins");

carregarMoedas("crypto");
setInterval(() => carregarMoedas(tipoAtual), 60000);