document.addEventListener("DOMContentLoaded", function () {
  // Verifica se o FullCalendar está carregado
  if (typeof FullCalendar === "undefined") {
    console.error("Erro: FullCalendar não foi carregado corretamente!");
    return;
  }

  var calendarEl = document.getElementById("calendario");

  if (calendarEl) {
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth", // Exibe o calendário no formato de mês
      locale: "pt-br", // Define o idioma para português
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      events: [
        {
          title: "Racionamento Setor 1",
          start: "2025-03-10",
        },
        {
          title: "Manutenção na rede",
          start: "2025-03-15",
          end: "2025-03-16",
        },
      ],
    });

    calendar.render();
  } else {
    console.error("Erro: Elemento #calendario não encontrado!");
  }
});
