window.addEventListener('load', () => {
    var tableAllTime = new Tabulator("#tableAllTime", {  // Ajusta la altura según sea necesario
        data: datosAllTime,  // Usamos los datos que se pasan desde el backend
        layout: "fitColumns",
        columns: [
            {
                title: "#",
                formatter: function(cell) {
                    var row = cell.getRow();
                    var rowIndex = row.getPosition(true); // Obtiene la posición global en la tabla
                    return rowIndex; // Devuelve el índice global en lugar del índice de la página
                },
                hozAlign: "center",
                width: 50
            },
            {title: "Username", field: "username", hozAlign: "center",  width: 150},
            {
                title: "Accuracy", 
                field: "accuracy", 
                hozAlign: "center", 
                formatter: function(cell) {
                var value = cell.getValue(); // Obtener el valor de la celda
                return value.toFixed(2) + "%"; // Formatear con dos decimales y el símbolo de %
            }},
            {title: "WPM", field: "wpm", hozAlign: "center", width: 70},
            {
                title: "Date", 
                field: "dateScore", 
                sorter: "date", 
                hozAlign: "center", 
                width: 170,
                formatter: function(cell, formatterParams, onRendered){
                    // Obtener el valor de la celda (la fecha)
                    var date = new Date(cell.getValue());
                    
                    // Formatear la fecha
                    var options = { day: 'numeric', month: 'short', year: 'numeric' };
                    var formattedDate = date.toLocaleDateString('es-ES', options);
    
                    return formattedDate; // Devolver la fecha formateada
                }
            }
        ],
        rowFormatter:function(row){
            var rowPosition = row.getPosition();
            if (rowPosition === 1) {
                row.getElement().style.background = "rgba(255, 255, 0, 0.8)";
                row.getElement().style.color = "#000";
            } else if (rowPosition === 2) {
                row.getElement().style.background = "rgba(192, 192, 192, 0.8)";
                row.getElement().style.color = "#000";
            } else if (rowPosition === 3) {
                row.getElement().style.background = "rgba(205, 127, 50, 0.8)";
                row.getElement().style.color = "#000";
            } else {
                row.getElement().style.background = ""; // Restablecer para otras filas
            }
        },
    });
    var tableToday = new Tabulator("#tableToday", {  // Ajusta la altura según sea necesario
        data: datosToday,  // Usamos los datos que se pasan desde el backend
        layout: "fitColumns",
        columns: [
            {title: "#", formatter:"rownum", hozAlign: "center", width: 50},
            {title: "Username", field: "username", hozAlign: "center", width: 150},
            {
                title: "Accuracy (%)", 
                field: "accuracy", 
                hozAlign: "center", 
                formatter: function(cell) {
                var value = cell.getValue(); // Obtener el valor de la celda
                return value.toFixed(2) + "%"; // Formatear con dos decimales y el símbolo de %
            }},
            {title: "WPM", field: "wpm", hozAlign: "center", width: 70},
            {
                title: "Date", 
                field: "dateScore", 
                sorter: "date", 
                hozAlign: "center", 
                width: 170,
                formatter: function(cell, formatterParams, onRendered){
                    // Obtener el valor de la celda (la fecha)
                    var date = new Date(cell.getValue());
                    
                    // Formatear la fecha
                    var options = { day: 'numeric', month: 'short', year: 'numeric' };
                    var formattedDate = date.toLocaleDateString('en-GB', options);
    
                    return formattedDate; // Devolver la fecha formateada
                }
            }
        ],
        rowFormatter:function(row){
            var rowPosition = row.getPosition();
            if (rowPosition === 1) {
                row.getElement().style.background = "rgba(255, 255, 0, 0.8)";
                row.getElement().style.color = "#000";
            } else if (rowPosition === 2) {
                row.getElement().style.background = "rgba(192, 192, 192, 0.8)";
                row.getElement().style.color = "#000";
            } else if (rowPosition === 3) {
                row.getElement().style.background = "rgba(205, 127, 50, 0.8)";
                row.getElement().style.color = "#000";
            } else {
                row.getElement().style.background = ""; // Restablecer para otras filas
            }
        },
    });
});