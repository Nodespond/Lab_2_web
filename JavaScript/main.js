
let currentTableData = [...buildings]; 

document.addEventListener('DOMContentLoaded', function() { // Ждем загрузки DOM

    // Отображаем исходную таблицу при загрузке страницы
    createTable(buildings, 'list');
  
    //находим форму сортировки
    let sortForm = document.getElementById('sort');
  
    let sortButton = document.querySelector('input[value="Сортировать"]');
      if (sortButton) {
          sortButton.addEventListener('click', function() {
              let sortForm = document.getElementById('sort');
              if (sortForm) {
                  sortTable('list', sortForm);
              } else {
                  console.error("Форма с id 'sort' не найдена.");
              }
          });
      } else {
          console.error("Кнопка 'Сортировать' не найдена.");
      }
  
    //заполняем select option из structures
    if (buildings && buildings.length > 0 && sortForm) {
        setSortSelects(buildings[0], sortForm); // Передаем первый элемент buildings
    } else {
        console.error("Массив 'buildings' не определен или пуст, или форма сортировки не найдена.");
    }
  
  
    //получаем элементы select из формы для сортировки
    let fieldsFirst = document.getElementById('fieldsFirst');
    let fieldsSecond = document.getElementById('fieldsSecond');
  
    fieldsFirst.addEventListener('change', function() {
  
        changeNextSelect('fieldsSecond', this);
    });
    

    fieldsSecond.addEventListener('change', function() {
        
        changeNextSelect('fieldsThird', this);
    });
  
    // Обработчик события для кнопки "Найти"
    let findButton = document.querySelector('input[value="Найти"]');
    if (findButton) {  
        findButton.addEventListener('click', function() {
            let filterForm = document.getElementById('filter');
            let sortFix = document.getElementById('sort');
            if (filterForm) {
                filterTable(buildings, 'list', filterForm);
                sortTable('list',sortFix);
            } else {
                console.error("Форма с id 'filter' не найдена.");
            }
        });
    } else {
        console.error("Кнопка 'Найти' не найдена.");
    }
  
     // Обработчик события для кнопки "Сбросить сортировку"
      let resetSortButton = document.querySelector('input[value="Сбросить сортировку"]');
      if (resetSortButton) {
          resetSortButton.addEventListener('click', function() {
              let sortForm = document.getElementById('sort');
              if (sortForm) {
                  resetSort('list', buildings, sortForm);
                  let filterformm = document.getElementById('filter');
                  filterformm.reset();
                  clearGraph();
                  clearFormGraph();
                  currentTableData = [...buildings];
              } else {
                  console.error("Форма с id 'sort' не найдена.");
              }
          });
      } else {
          console.error("Кнопка 'Сбросить сортировку' не найдена.");
      }
  
    // Обработчик события для кнопки "Очистить фильтры"
    let clearFiltersButton = document.querySelector('input[value="Очистить фильтры"]');
    if (clearFiltersButton) { 
        clearFiltersButton.addEventListener('click', function() {
            let filterForm = document.getElementById('filter');
            if(filterForm){
                filterForm.reset();
                let sortForm = document.getElementById('sort');
                resetSort('list', buildings, sortForm);
                clearGraph();
                clearFormGraph();
                currentTableData = [...buildings];
            }
            // Очищаем таблицу и отображаем исходные данные
            clearTable('list');
            createTable(buildings, 'list'); 
        });
    } else {
        console.error("Кнопка 'Очистить фильтры' не найдена.");
    }

    //отрисовка графика и обработчик для кнопки

    //обработчик для кнопки обновления графика
    document.getElementById('updateGraph').addEventListener('click', function() {
        
        //проверяем наличие данных
        if (currentTableData.length === 0) {
            alert("Нет данных для построения графика!");
            return;
        }
        
        
        // Получаем значение для оси OX
        const key = document.querySelector('input[name="x-axis"]:checked').value;
        const type=document.getElementById('chartType').value;
        
        // Определяем режим отображения
        let mode;
        const showMin = document.getElementById('y-min').checked;
        const showMax = document.getElementById('y-max').checked;

        if (!showMax && !showMin){
            alert("Не выбраны значения по оси ОY!");
            return;
        }
        
        if (showMin && showMax) {
            mode = 'both';
        } else if (showMin) {
            mode = 'min';
        } else if (showMax) {
            mode = 'max';
        } else {
            mode = 'both'; // по умолчанию, если ничего не выбрано
        }
        
        drawGraph(currentTableData, key, mode,type);
    });

  });
  
  // формирование полей элемента списка с заданным текстом и значением
  
  let createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
  }
  
  // формирование поля со списком 
  // параметры – массив со значениями элементов списка и элемент select
  
  let setSortSelect = (arr, sortSelect) => {
    sortSelect.innerHTML = '';
    // создаем OPTION Нет и добавляем ее в SELECT
    sortSelect.append(createOption('Нет', 0));
    
    // перебираем все ключи переданного элемента массива данных
    for (let i in arr) {
       // создаем OPTION из очередного ключа и добавляем в SELECT
       // значение атрибута VAL увеличиваем на 1, так как значение 0 имеет опция Нет
        sortSelect.append(createOption(arr[i], Number(i) + 1));
    }
  }
  
  //  формируем поля со списком для многоуровневой сортировки
  let setSortSelects = (data, dataForm) => { 
  
    // выделяем ключи словаря в массив
    let head = Object.keys(data);
  
    // находим все SELECT в форме
    let allSelect = dataForm.getElementsByTagName('select');
    
    for(let j = 0; j < allSelect.length; j++) {
        //формируем очередной SELECT
        setSortSelect(head, allSelect[j]);
        //САМОСТОЯТЕЛЬНО все SELECT, кроме первого, сделать неизменяемым
        if (j > 0) {
            allSelect[j].disabled = true;
        }
    }
  }
  
  // настраиваем поле для следующего уровня сортировки
let changeNextSelect = (nextSelectId, curSelect) => {
    
    let nextSelect = document.getElementById(nextSelectId);
    
    // Если следующего селекта нет, выходим
    if (!nextSelect) {
        return;
    }

    nextSelect.disabled = false;
    
    // Сохраняем текущий выбранный value
    let currentValue = curSelect.value;

    // Обновляем список опций, используя список опций из fieldsFirst
    nextSelect.innerHTML = document.getElementById('fieldsFirst').innerHTML;


    // Удаляем выбранную опцию из текущего и предыдущих select
    if (currentValue != 0) {
         //  Удаляем из nextSelect текущую выбранную опцию
         for (let i = 0; i < nextSelect.options.length; i++) {
              if (nextSelect.options[i].value === currentValue) {
                  nextSelect.remove(i);
                  break;
              }
         }
    } else {
       nextSelect.disabled = true;
    }

    //Удаление опций из предыдущих селектов:
    let prevSelects = document.querySelectorAll('select[id^="fields"]:not(#' + curSelect.id + ')');
    prevSelects.forEach(prevSelect => {
       if (prevSelect.value != 0 && prevSelect.id !== nextSelectId) {
         for (let i = 0; i < nextSelect.options.length; i++) {
           if (nextSelect.options[i].value === prevSelect.value) {
             nextSelect.remove(i);
             break;
           }
         }
       }
    });

}
  
  // Функция сброса сортировки
  function resetSort(idTable, data, dataForm) {
    // Очищаем все поля формы
    dataForm.reset();
    //  Заполняем select option из structures
    setSortSelects(buildings[0], dataForm);
  
    clearTable(idTable);
    createTable(data, idTable);
  }

//очистка графика
function clearGraph() {
    d3.select("svg").selectAll("*").remove();
}

function clearFormGraph(){
    document.getElementById('ox-country').checked = false;
    document.getElementById('ox-year').checked = false;
            
    document.getElementById('y-min').checked = false;
    document.getElementById('y-max').checked = false;

    document.getElementById('chartType').value = 'scatter';
}