//Подготовка данных для таблицы (только необходимые поля)
var arr = users.map(function (elem) {
	var array = [];
	array.push(elem.name.firstName, elem.name.lastName, elem.about, elem.eyeColor);
	return array;
})
//Добавление в начало массива массива с названиями заголовков таблицы
arr.unshift(["First name", "Last name", "About", "Eye color"]);

//Создание таблицы и пагинации
let tableDiv = document.querySelector(".myTable");
let table = document.createElement("table");
tableDiv.appendChild(table);
let pagination = document.querySelector(".pagination");

//Количество элементов на странице, количество страниц и переменная для сортировки (от А до Я, если -1)
let notesOnPage = 10;
let countOfItems = Math.ceil((arr.length - 1) / notesOnPage) + 1;
let colIndex = -1;

//Вывод на экран нумерации страниц со стрелками, а также добавление всех элементов в массив для последующего ожидания кликов
let items = [];
for (let i = 0; i < countOfItems + 1; i++) {
	let li = document.createElement("li");
	if (!i) {
		li.innerHTML = "<";
		li.classList.add("prev");
	} else if (i == countOfItems) {
		li.innerHTML = ">";
		li.classList.add("next");
	} else {
		li.innerHTML = i;
	}
	items.push(li);
}

//Вывод на экран первой страницы и пагинации, а затем ожидание кликов по остальным номерам страниц для последующего выводв
showPages(items[1]);
showPagination();
for (let item of items) {
	item.addEventListener("click", function () {
		showPages(this);
	});
}

//Если мало страниц, то немного сократить ширину блока пагинации. Также здесь убраны лишние margin у последних номеров страниц (в css последний элемент стрелка, поэтому здесь)
if (countOfItems < 8) {
	pagination.style.width = pagination.offsetWidth - 40 * (8 - countOfItems) + "px";
	pagination.childNodes[countOfItems - 1].style.margin = 0;
} else {
	pagination.childNodes[countOfItems - 2].style.margin = 0;
}

//Функция, выводящая нумерацию страниц. !При большой объеме страниц выводится лишь часть номеров с многоточиями
function showPagination(currentPage) {
	//Если текущая страница не указана или слишком мало (до трех), то текущий номер 3 (т.е. покажем номера от 1 до 4)
	if (!currentPage || currentPage < 3) {
		currentPage = 3;
	}
	//Если текущая страница близка к концу, то текущий номер от всей длины - 3 (т.е. покажем последние 4 страницы)
	if (currentPage > countOfItems - 3) {
		currentPage = countOfItems - 3;
	}
	//очищаем предыдущий список номеров
	pagination.innerHTML = "";
	//если объем страниц велик (больше 5 на самом деле, а не 6), то будем прятать некоторые номера и показывать многоточия
	if (countOfItems > 6) {
		//2 элемента точек, иначе вставится только 1, даже когда нужно 2
		let dotsLR = document.createElement("li"),
			dotsC = document.createElement("li");
		dotsLR.innerHTML = "...", dotsC.innerHTML = "...";
		dotsLR.classList.add("dots"), dotsC.classList.add("dots");

		//добавляем стрелку и первый номер
		pagination.appendChild(items[0]);
		pagination.appendChild(items[1]);

		//к какому краю ближе текущая страница
		let part;
		if (currentPage < countOfItems / 2) {
			part = "left";
		} else {
			part = "right";
		}

		//если ближе к левому краю и и не достаем до единицы, то после единицы ставим многоточие
		if (part == "left" && currentPage > 3) {
			pagination.appendChild(dotsLR);
		}

		//Если ближе к правому краю, но не достаем до последнего номера, то после единицы ставим многоточие
		if (currentPage < countOfItems - 2 && part == "right") {
			pagination.appendChild(dotsC);
		}

		//текущая страница и 2 соседних
		pagination.appendChild(items[currentPage - 1]);
		pagination.appendChild(items[currentPage]);
		pagination.appendChild(items[currentPage + 1]);

		//Если ближе к левому краю, но не достаем до последнего номера, перед ним ставим многоточие
		if (currentPage < countOfItems - 2 && part == "left") {
			pagination.appendChild(dotsC);
		}

		//Если ближе к правому краю, но не достаем до последнего номера, то перед ним ставим многоточие
		if (part == "right" && currentPage < countOfItems - 3) {
			pagination.appendChild(dotsLR);
		}

		//добавляем последний номер и стрелку
		pagination.appendChild(items[countOfItems - 1]);
		pagination.appendChild(items[countOfItems]);
	} else { //если мало страниц, то выставим все
		for (item of items) {
			pagination.appendChild(item);
		}
	}
}

//Вывод таблицы на экран
function showPages(item) {
	//Удаление стилей с предыдущего номера, если был такой
	let active = document.querySelector(".pagination li.active");
	if (active) {
		active.classList.remove("active");
	}

	//если не стрелка, то добавляем стиль к текущему номеру
	if (item.innerHTML > 0 && item.innerHTML < countOfItems) {
		item.classList.add("active");
	}

	//Удаление предыдущих данных и сразу добавление заголовка
	table.innerHTML = "";
	let thead = document.createElement("thead");
	let tr = document.createElement('tr');
	thead.appendChild(tr);
	createRow(arr[0], arr[0].length, tr, "header");

	//Номер страницы
	let pageNum;

	//Если стрелка назад, то просто -1, но только не для первого номера
	if (item.innerHTML == "&lt;") {
		pageNum = +active.innerHTML - 1;
		if (pageNum) {
			active.previousSibling.classList.add("active");
		} else {
			pageNum = 1;
			active.classList.add("active");
		}

		//Если стрелка вперед, то +1, но только не для последнего номера
	} else if (item.innerHTML == "&gt;") {
		pageNum = +active.innerHTML + 1;
		if (pageNum < countOfItems) {
			active.nextSibling.classList.add("active");
		} else {
			pageNum = countOfItems - 1;
			active.classList.add("active");
		}

		//Если был совершен клик на номер, то его и добавляем
	} else {
		pageNum = +item.innerHTML;
	}

	//Обновление нумерацию в соответствии с выбранным номером
	showPagination(pageNum);

	//Отключение стрелки, если первая страница, иначе включить
	if (pageNum == 1) {
		let prev = document.querySelector(".pagination li.prev");
		prev.classList.add("noactive");
	} else {
		let prev = document.querySelector(".pagination li.prev");
		prev.classList.remove("noactive");
	}

	//Отключение стрелки, если последняя страница, иначе включить
	if (pageNum == countOfItems - 1) {
		let next = document.querySelector(".pagination li.next");
		next.classList.add("noactive");
	} else {
		let next = document.querySelector(".pagination li.next");
		next.classList.remove("noactive");
	}

	//Новый массив с элементами для текущей страницы
	let start = (pageNum - 1) * notesOnPage + 1;
	let end = start + notesOnPage;
	let notes = arr.slice(start, end);

	//заполнение таблицы новыми элементами. 
	let tbody = document.createElement("tbody");
	for (let i in notes) {
		let tr = document.createElement('tr');
		tbody.appendChild(tr);
		//Функция для создания строки. Четвертым параметром идет индекс на странице. Потом поможет заносить измененные в таблице данные в исходный массив
		createRow(notes[i], notes[i].length, tr, i);
	}
	table.appendChild(thead);
	table.appendChild(tbody);

	//Попытка вывести столбец about в 2 строки
	for (var i = 1; i < table.rows.length; i++) {
		let len = table.rows[i].cells[2].offsetWidth;
		let sliced = table.rows[i].cells[2].textContent.slice(0, 0.25 * len);
		if (sliced.length < table.rows[i].cells[2].textContent.length) {
			sliced += "...";
			table.rows[i].cells[2].data = table.rows[i].cells[2].textContent;
			table.rows[i].cells[2].innerHTML = sliced;
		}
	}
}

//Добавление элементов массива в строку в таблицы. Четвертый параметр добавляет либо заголовок, либо индекс на странице для последующего изменения данных
function createRow(arr, num, tr, wToDO) {
	for (let i = 0; i < num; i++) {
		let td;
		if (wToDO == "header") {
			td = document.createElement("th");
		} else {
			td = document.createElement("td");
			td.dataNumber = +wToDO + 1;
		}
		//Если столбец color, то выведем в ячейку квадратик с необходимым цветом. Для корректной сортировки сохраним цвет в свойство data
		if (i == num - 1 && wToDO != "header") {
			let color = document.createElement("span");
			color.style.display = "inline-block";
			color.style.textAlign = "center";
			color.style.width = "15px";
			color.style.height = "15px";
			color.style.background = arr[i];
			td.appendChild(color);
			td.data = arr[i];
		} else {
			td.innerHTML = arr[i];
		}
		tr.appendChild(td);
	}
}

//Функция дял сортировки таблицы. Второй параметр для обратной сортировки (от Я до А), указан выше
let sortTable = function (index, isSorted) {
	let tbody = table.querySelector("tbody");

	//Функция сравнения 2 значений из таблицы
	let compare = function (rowA, rowB) {
		let rowDataA, rowDataB;

		//Если соритруем по цвету, то берем данные из свойства data
		if (index == 3) {
			rowDataA = rowA.cells[index].data;
			rowDataB = rowB.cells[index].data;

			//Иначе просто текст
		} else {
			rowDataA = rowA.cells[index].innerHTML;
			rowDataB = rowB.cells[index].innerHTML;
		}

		//Проверка на тип данный: число, дата или просто строка
		if (Number(rowDataA)) {
			type = "number";
		} else if (rowDataA.search(/^(((0?[1-9]|[12][0-9]|3[01])\.((0?[13578]|1[02]))|((0?[1-9]|[12][0-9]|30)\.(0?[469]|11))|(0?[1-9]|[1][0-9]|2[0-8])\.(0?2))\.([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3}))|(29\.02\.(([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00)))$/) != -1) {
			type = "date";
		} else {
			type = "string";
		}

		//Сравнение в соответствии с типом данных
		switch (type) {
			case "number":
				return rowDataA - rowDataB;
			case "date":
				let dateA = rowDataA.split(".").reverse().join("-");
				let dateB = rowDataA.split(".").reverse().join("-");
				return new Date(dateA).getTime() - new Date(dateB).getTime();
			case "string":
				return rowDataA > rowDataB ? 1 : -1;
			default:
				return 0;
		}
	}

	//Преобразование строки в массив, который можно сортировать. Сортировка
	let rows = [].slice.call(tbody.rows);
	rows.sort(compare);

	//Если уже отсортировани от А до Я, то происходит сортировка от Я до А
	if (isSorted) {
		rows.reverse();
	}

	//Очистить таблицу и заполнить по сортировке
	table.removeChild(tbody);
	for (let i = 0; i < rows.length; i++) {
		tbody.appendChild(rows[i]);
	}
	table.appendChild(tbody);
}

//Удаление поля изменения данных, если был произведен клик по другой области
document.addEventListener("click", function (e) {
	let elem = e.target;
	let editings = document.getElementsByClassName("editing");
	if (!editings) return;
	for (let editing of editings) {
		if (isVisible(editing) && !editing.contains(elem)) {
			editing.remove();
		}
	}
});

//Появление блока с редактированием данных по клику на конкретную ячейку
table.addEventListener("click", function (e) {

	//Защита от клика между столбцами
	if (e.target.nodeName == "TABLE") {
		return;
	}

	//Отмена распространения, чтобы сразу форма редактирования не закрылась сразу после открытия
	e.stopPropagation();

	let elem = e.target;

	//Если клик по заголовку, то происходит сортировка
	if (elem.nodeName == "TH") {
		let index = elem.cellIndex;
		sortTable(index, colIndex == index);
		colIndex = (colIndex == index ? -1 : index);

	//Иначе происходит появление формы редактирования ячейки
	} else {

		//Если уже открыта, то закрываем
		let editing = document.querySelector(".editing");
		if (editing) {
			editing.remove()
		};
		editing = createEditing(elem);
		let textArea = editing.childNodes[0];
		textArea.focus();
		let btn = editing.childNodes[1].childNodes[0];
		let cncl = editing.childNodes[1].childNodes[1];

		//Необходимо при клике на квадратик с цветом в ячейке color
		if (elem.cellIndex == undefined) {
			elem = elem.parentNode;
		}

		//Если about, то происходит получение полного текста. Если color, то получение строки с названием цвета
		if (elem.cellIndex > 1) {
			textArea.innerHTML = elem.data;

		//Иначе получение данных ячейки
		} else {
			textArea.innerHTML = elem.innerHTML
		}

		//Кнопка для изменения ячейки в таблице и массиве исходных данных. Номер в массиве определяется с помощью назначенного ранее при создании таблицы индекса и текущего номера страницы
		btn.addEventListener("click", function (e) {
			let editing = document.querySelector(".editing");
			let textArea = document.querySelector(".editing textarea");
			if (elem.cellIndex == 3) {
				table.rows[elem.parentNode.rowIndex].cells[elem.cellIndex].childNodes[0].style.background = textArea.value;
				table.rows[elem.parentNode.rowIndex].cells[elem.cellIndex].data = textArea.value;
			} else {
				table.rows[elem.parentNode.rowIndex].cells[elem.cellIndex].innerHTML = textArea.value;
			}
			let active = document.querySelector(".pagination li.active");
			arr[+elem.dataNumber + notesOnPage * (active.innerHTML - 1)][elem.cellIndex] = textArea.value;
			editing.remove();
		});

		//Кнопка для отмены редактирования = клик мимо поля
		cncl.addEventListener("click", function () {
			editing.remove();
		});
	}
})

//Функция для проверки, открыто ли окно. Используется для проверки поля редактирования
function isVisible(elem) {
	return !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
}

//Попытка создания поля для редактирования в отдельной функции, чтобы не перегружать кодом функцию для работы с этим полем
function createEditing(elem) {
	let geo = elem.getBoundingClientRect();
	let body = document.querySelector("body");
	let editing = document.createElement("div");
	let textArea = document.createElement("textarea");
	let btns = document.createElement("div");
	let btn = document.createElement("button");
	let cncl = document.createElement("button");
	editing.style.top = geo.top + scrollY + "px";
	editing.style.left = geo.right + scrollX + "px";
	cncl.innerHTML = "Cancel";
	btn.innerHTML = "Edit";
	cncl.classList.add("cancel");
	btn.classList.add("edit");
	editing.classList.add("editing");
	editing.appendChild(textArea);
	btns.appendChild(btn);
	btns.appendChild(cncl);
	editing.appendChild(btns);
	body.appendChild(editing);
	return editing;
}