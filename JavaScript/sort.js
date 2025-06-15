let createSortArr = (data) => {
    let sortArr = [];
    let columnTypes = ['string', 'string', 'string', 'number', 'number'];
    let sortSelects = data.getElementsByTagName('select');

    for (let i = 0; i < sortSelects.length; i++) {
        // получаем номер выбранной опции
        let keySort = sortSelects[i].value;
        // в случае, если выбрана опция Нет, заканчиваем формировать массив
        if (keySort == 0) {
            break;
        }

        // получаем номер значение флажка для порядка сортировки
        // имя флажка сформировано как имя поля SELECT и слова Desc
        let desc = document.getElementById(sortSelects[i].id + 'Desc').checked;
        let columnIndex = keySort - 1;
        
        //тип данных задаем
        let columnType = columnTypes[columnIndex];  

        sortArr.push({
            column: columnIndex,
            order: desc,
            type: columnType  
        });
    }
    return sortArr;
};

let sortTable = (idTable, data) => {    
    // формируем управляющий массив для сортировки
    let sortArr = createSortArr(data);
    
    // сортировать таблицу не нужно, во всех полях выбрана опция Нет
    if (sortArr.length === 0) {
        return false;
    }
    //находим нужную таблицу
    let table = document.getElementById(idTable);

    // преобразуем строки таблицы в массив 
    let rowData = Array.from(table.rows);
    
    // удаляем элемент с заголовками таблицы
    rowData.shift();
    
    //сортируем данные по возрастанию по всем уровням сортировки
    // используется массив sortArr
    rowData.sort((first, second) => {
        for(let i in sortArr) {
            let key = sortArr[i].column;
            let order = sortArr[i].order;
            let type = sortArr[i].type;

            let a = first.cells[key].innerHTML;
            let b = second.cells[key].innerHTML;

            if (type === 'number') {
                a = parseFloat(a);
                b = parseFloat(b);
                if (isNaN(a)) a = -Infinity; 
                if (isNaN(b)) b = -Infinity;

                if (a > b) {
                    return order ? -1 : 1;
                } else if (a < b) {
                    return order ? 1 : -1;
                }
            } else { 
                a = a.toLowerCase();
                b = b.toLowerCase();
                if (a > b) {
                    return order ? -1 : 1;
                } else if (a < b) {
                    return order ? 1 : -1;
                }
            }
        }
        return 0;
    });
    
    // обновить таблицу на страницу
    // Удаляем старые строки таблицы
    while (table.rows.length > 1) { // Оставляем заголовок
        table.deleteRow(1);
    }

    // Добавляем отсортированные строки обратно в таблицу
    rowData.forEach(row => {
        table.appendChild(row);
    });

    currentTableData = Array.from(table.rows)
    .slice(1) // Пропускаем заголовок
    .map(row => {
        const obj = {};
        Array.from(row.cells).forEach((cell, i) => {
            obj[table.rows[0].cells[i].textContent] = cell.textContent;
            // Преобразуем числовые поля
            if (obj["Год выпуска"]) obj["Год выпуска"] = parseInt(obj["Год выпуска"]);
            if (obj["Количество серий"]) obj["Количество серий"] = parseInt(obj["Количество серий"]);
        });
        return obj;
    });
    clearGraph();
};



