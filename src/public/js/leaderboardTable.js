window.addEventListener('load', () => {
    var table = new Tabulator("#tableId", {  // Ajusta la altura según sea necesario
        data: tableData,  // Usamos los datos que se pasan desde el backend
        layout: "fitColumns",
        columns: [
            {title: "username", field: "username", width: 150},
            {title: "Accuracy (%)", field: "accuracy", hozAlign: "left"},
            {title: "WPM", field: "wpm", hozAlign: "left"},
            {title: "Date", field: "dateScore", sorter: "date", hozAlign: "center"}
        ],
    });
});
