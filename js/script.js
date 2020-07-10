const filterByType = (type, ...values) => values.filter(value => typeof value === type), //функция возвращающая значения совпадающие с типом

	hideAllResponseBlocks = () => { //функция скрытия всех блоков-результатов
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block')); //сохраняется массив с дивами класса dialog__response-block
		responseBlocksArray.forEach(block => block.style.display = 'none'); //каждый блок скрывается
	},

	showResponseBlock = (blockSelector, msgText, spanSelector) => { //функция показа блока-результата
		hideAllResponseBlocks(); //скрытие всех блоков-результатов
		document.querySelector(blockSelector).style.display = 'block'; //показ блока с селектором blockSelector
		if (spanSelector) {
			document.querySelector(spanSelector).textContent = msgText; //если передан третий аргумент (текст результата) то есть какой-то результат 
			//его записывают в спан с определенными стилями для успешного/ошибочного процесса с текстом msgText
		}
	},

	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'), //функция ошибки 

	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'), //функция успешной фильтрации

	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'), //функция безрезультатной фильтрации

	tryFilterByType = (type, values) => { //функция фильтрации
		try {
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", "); //вызов функции filterByType через функцию глобального объекта eval и запись отфильтрованных данных в строку через запятую
			const alertMsg = (valuesArray.length) ? //условия для значения сообщения 
				`Данные с типом ${type}: ${valuesArray}` : //(при длине valuesArray > 1 выводятся все найденные данные выбранного типа)
				`Отсутствуют данные типа ${type}`; //иначе выводится сообщение об отсутсвии данных выбранного типа
			showResults(alertMsg); //запуск функции успешной фильтрации
		} catch (e) {
			showError(`Ошибка: ${e}`); //запуск функции ошибки
		}
	};

const filterButton = document.querySelector('#filter-btn'); //получение кнопки фильтра со страницы

filterButton.addEventListener('click', e => { //обработчик события на кнопку
	const typeInput = document.querySelector('#type'); //получение инпута с типом
	const dataInput = document.querySelector('#data'); //получение инпута с данными

	if (dataInput.value === '') { //если пустое поле с данными то
		dataInput.setCustomValidity('Поле не должно быть пустым!'); //сообщение об ошибки в инпуте с данными
		showNoResults(); //функция безрезультатной фильтрации
	} else {
		dataInput.setCustomValidity(''); //элемент не имеет полшьзовательской ошибки
		e.preventDefault(); //блокирование стандартного поведения браузера
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim()); //функция фильтрации по типу из typeInput значений из dataInput
	}
});

