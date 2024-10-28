window.addEventListener('load', () => {
    var table = new Tabulator("#tableId", {  // Ajusta la altura según sea necesario
        data: tableData,  // Usamos los datos que se pasan desde el backend
        layout: "fitColumns",
        columns: [
            {title: "#", 
                formatter:"rownum", 
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
                    var formattedDate = date.toLocaleDateString('en-GB', options);
    
                    return formattedDate; // Devolver la fecha formateada
                }
            }
        ],
        rowFormatter:function(row){
            var data = row.getData(); //get data object for row
            console.log(data);
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
    var table2 = new Tabulator("#tableId2", {  // Ajusta la altura según sea necesario
        data: tableData,  // Usamos los datos que se pasan desde el backend
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
    });
});

document.querySelectorAll('.buttons div').forEach(button => {
    button.addEventListener('click', () => {
        // Elimina la clase 'active' de todos los botones
        document.querySelectorAll('.buttons div').forEach(btn => btn.classList.remove('active'));
        
        // Añade la clase 'active' al botón clicado
        button.classList.add('active');
    });
});