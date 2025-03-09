document.addEventListener("DOMContentLoaded", function () {
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  let dataAtual = new Date();
  let eventos = JSON.parse(localStorage.getItem("eventos")) || {};
  let selecaoInicio = null;

  function gerarCalendario() {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    let calendarioHTML = `
        <div class="header">
          <button onclick="mudarMes(-1)" class="button-calendario">&#9664;</button>
          <h3 id="mesAno">${meses[mes]} ${ano}</h3>
          <button onclick="mudarMes(1)" class="button-calendario">&#9654;</button>
        </div>
        <div class="dias" id="diasSemana"></div>
        <div class="dias" id="diasMes"></div>
      `;

    document.getElementById("calendario").innerHTML = calendarioHTML;

    const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];
    document.getElementById("diasSemana").innerHTML = diasSemana
      .map((d) => `<div>${d}</div>`)
      .join("");

    let htmlDias = "";
    for (let i = 0; i < primeiroDia; i++) {
      htmlDias += `<div></div>`;
    }
    for (let dia = 1; dia <= totalDias; dia++) {
      const dataChave = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(
        dia
      ).padStart(2, "0")}`; // Mudança aqui para garantir que o formato da data tenha 2 dígitos para o mês e dia
      const eventoTexto = eventos[dataChave]
        ? `<div class="evento">${eventos[dataChave]}</div>`
        : "";
      const hoje =
        new Date().toDateString() === new Date(ano, mes, dia).toDateString();
      const selecionado =
        selecaoInicio && dia >= selecaoInicio && dia <= selecaoFim;
      const diaVermelho = dia >= 6 && dia <= 11 ? "diaVermelho" : ""; // Adiciona a classe "diaVermelho" para os dias de 6 a 11

      htmlDias += `<div class="dia ${hoje ? "hoje" : ""} ${
        selecionado ? "selecionado" : ""
      } ${diaVermelho}" onclick="selecionarDia(${ano}, ${mes + 1}, ${dia})">
                              ${dia} ${eventoTexto}
                          </div>`;
    }

    document.getElementById("diasMes").innerHTML = htmlDias;
  }

  function selecionarDia(ano, mes, dia) {
    const dataChave = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(
      dia
    ).padStart(2, "0")}`; // Mudança aqui para garantir que o formato da data tenha 2 dígitos para o mês e dia

    // Se não houver um dia selecionado, comece a seleção
    if (!selecaoInicio) {
      selecaoInicio = dia;
      return;
    }

    // Se o dia clicado for posterior ao dia inicial, marque todos os dias entre eles
    const diaInicio = Math.min(selecaoInicio, dia);
    const diaFim = Math.max(selecaoInicio, dia);
    selecaoFim = diaFim;

    // Armazena o intervalo de dias selecionados e atualiza o calendário
    for (let diaMarcado = diaInicio; diaMarcado <= diaFim; diaMarcado++) {
      const dataChaveIntervalo = `${ano}-${String(mes + 1).padStart(
        2,
        "0"
      )}-${String(diaMarcado).padStart(2, "0")}`; // Mudança aqui para garantir que o formato da data tenha 2 dígitos para o mês e dia
      eventos[dataChaveIntervalo] = "Falta de água"; // Exemplo de evento
    }

    localStorage.setItem("eventos", JSON.stringify(eventos)); // Salva no localStorage
    gerarCalendario(); // Atualiza o calendário com os dias marcados
    selecaoInicio = null; // Reseta a seleção após marcar os dias
  }

  window.mudarMes = function (delta) {
    dataAtual.setMonth(dataAtual.getMonth() + delta);
    gerarCalendario();
  };

  window.abrirModal = function (ano, mes, dia) {
    const dataChave = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(
      dia
    ).padStart(2, "0")}`; // Mudança aqui para garantir que o formato da data tenha 2 dígitos para o mês e dia
    let modalHTML = `
        <div class="overlay" id="overlay"></div>
        <div class="modal" id="modal">
          <h3>Adicionar Evento</h3>
          <p id="dataSelecionada">Evento para ${dia}/${mes + 1}/${ano}</p>
          <input type="text" id="eventoTexto" placeholder="Digite o evento">
          <button onclick="salvarEvento()">Salvar</button>
          <button onclick="fecharModal()">Cancelar</button>
        </div>
      `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    document.getElementById("overlay").style.display = "block";
    document.getElementById("modal").style.display = "block";
    document.getElementById("modal").setAttribute("data-chave", dataChave);
  };

  window.fecharModal = function () {
    document.getElementById("modal").remove();
    document.getElementById("overlay").remove();
  };

  window.salvarEvento = function () {
    const dataChave = document
      .getElementById("modal")
      .getAttribute("data-chave");
    const texto = document.getElementById("eventoTexto").value.trim();
    if (texto) {
      eventos[dataChave] = texto;
    } else {
      delete eventos[dataChave];
    }
    localStorage.setItem("eventos", JSON.stringify(eventos)); // Salva no localStorage
    fecharModal();
    gerarCalendario();
  };

  gerarCalendario();
});
