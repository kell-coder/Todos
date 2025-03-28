//Store data in local store
class Store {
	//		CLASSES
	//
	static getClasses(){
		let classes;
		if(localStorage.getItem('classes') === null){
			classes = [];
		}else{
			classes = JSON.parse(localStorage.getItem('classes'));
		}

		return classes;
	}

	//Display classes with its tasks in the UI
	static displayClasses(){
		const classes = Store.getClasses();

		classes.forEach(function(clase){
			const ui = new UI;
			ui.addClass(clase);

			const tasks = Store.getTasks(clase);

			for(let i=0; i<tasks.length; i++)
				ui.addTask(tasks[i], clase);
		});

		document.querySelectorAll('.lista').forEach(lista => {
			lista.style.display = 'none';
		});
	}

	//Add task to classes array and update data stored
	static addClass(clase){
		const classes = Store.getClasses();

		classes.push(clase);

		localStorage.setItem('classes', JSON.stringify(classes));
	}

	//Remove task from array and update data stored
	static removeClass(clase){
		const classes = Store.getClasses();

		for(let i=0; i<classes.length; i++){
			if((classes[i] + 'X') === clase){
				classes.splice(i, 1);
			}
		}

		localStorage.setItem('classes', JSON.stringify(classes));
	}

	//		TASKS
	//
	static getTasks(clase){
		let tasks;
		if(localStorage.getItem(`${clase}Tasks`) === null){
			tasks = [];
		}else{
			tasks = JSON.parse(localStorage.getItem(`${clase}Tasks`));
		}

		return tasks;
	}

	//Add task to tasks array of a class
	static addTask(clase, task){
		const tasks = Store.getTasks(clase);

		tasks.push(task);

		localStorage.setItem(`${clase}Tasks`, JSON.stringify(tasks));
	}

	static removeTask(task, clase){
		const tasks = Store.getTasks(clase);

		for(let i=0; i<tasks.length; i++){
			if(tasks[i] === task){
				tasks.splice(i, 1);
			}
		}

		localStorage.setItem(`${clase}Tasks`, JSON.stringify(tasks));
	}
}

function UI(){}

UI.prototype.addClass = function(clase){
	const list = document.querySelector('.class-list');
	const li = document.createElement('li');

	li.innerHTML = `
		<div class="divClass"><li class="clase">${clase}</li><a class="delete" href="#">X</a></div>
	`;

	const ul = document.createElement('ul');
	ul.className = `lista ${clase}`;
	document.querySelector('.task-list').appendChild(ul);

	list.appendChild(li);
}

UI.prototype.addTask = function(task, target){
	const list = document.querySelector(`.${target}`);
	const li = document.createElement('li');

	li.innerHTML = `
		<div class="divTask"><li class="tarea">${task}</li><a class="delete" href="#">X</a></div>
	`;

	//li.textContent = task;

	list.appendChild(li);
}



getModal = label => {
	const div = document.createElement('div');
	div.style.position = "fixed";
	//div.style.left = "50%";
	//div.style.top = "50%";
	div.style.width = '20vw';
	div.style.padding = '20px';
	div.style.height = '10vh';
	div.style.backgroundColor = 'black';
	div.style.zIndex = "5";
	div.style.display = "flex";
	div.style.justifyContent = "center";
	div.style.alignItems = "center";
	div.style.color = "white";
	div.style.borderRadius = "5px";
	const input = document.createElement("input");
	input.name = "className";
	input.style.margin = "10px";
	div.innerText += label;
	const btn = document.createElement("button");
	btn.style.padding = "2px";
	btn.style.margin = "5px";
	btn.innerText = "Agregar";
	
	const back = document.createElement('div');
	back.style.display = "flex";
	back.style.alignItems = "center";
	back.style.justifyContent = "center";
	back.style.backgroundColor = "white";
	back.style.width = "100vw";
	back.style.height = "100vh";
	back.style.position = "fixed";
	back.style.zIndex = "2";
	back.id = "backmodal"
	back.style.backgroundColor = "rgba(255, 255, 255, .3)";
	
	div.appendChild(input);
	div.appendChild(btn);
	back.appendChild(div);
	
	back.addEventListener("click", (e) => {
		if (e.target.id === "backmodal") {
			div.remove();
			back.remove();
		}
	});
	
	return [div, back, btn, input];
}



document.querySelector('.add-class').addEventListener('click', function(){
	const [div, back, btn, input] = getModal( "Nueva clase:");
	
	document.body.appendChild(back);
	
	input.focus();
	
	btn.addEventListener("click", () => {
		const str = input.value;
		
		if (str == "") {
			return;
		}
		
		const ui = new UI();
		
		ui.addClass(str);
		Store.addClass(str);
		
		div.remove();
		back.remove();
	});
});

let current;

document.querySelector('.classes').addEventListener('click', function(e){
	if(e.target.className === 'divClass'){
		document.querySelectorAll('.divClass').forEach(divClass => {
			divClass.classList.remove('active');
		})
		e.target.classList.add('active');

		document.querySelectorAll('.lista').forEach(lista => {
			lista.style.display = 'none';
		});
		document.querySelector(`.${e.target.children[0].textContent}`).style.display = 'block';

		document.querySelector('.add-task').style.display = 'block';

		current = e.target.children[0].textContent;
	}

	if(e.target.className === 'delete'){
		Store.removeClass(e.target.parentElement.textContent);

		e.target.parentElement.parentElement.remove();

		document.querySelectorAll('.lista').forEach(lista => {
			lista.style.display = 'none';
		});

		current = undefined;
		document.querySelector('.add-task').style.display = 'none';
	}
});


document.querySelector('.add-task').addEventListener('click', function() {
	if (current != undefined) {
		const [div, back, btn, input] = getModal("Nueva tarea:");
		document.body.appendChild(back);
		input.focus();
		
		btn.addEventListener("click", () => {
			const str = input.value;
			
			if (str == "") {
				return;
			}
		
			const ui = new UI();
		
			ui.addTask(str, current);
			Store.addTask(current, str);
		
			div.remove();
			back.remove();
		});
	}
});

document.querySelector('.task-list').addEventListener('click', function(e){
	if(e.target.className === 'delete'){
		Store.removeTask(
							e.target.previousElementSibling.textContent,					//name of the task (text content of li)
							e.target.parentElement.parentElement.parentElement.classList[1] //class with name same as text content
		);

		e.target.parentElement.parentElement.remove();
	}
});


document.addEventListener('DOMContentLoaded', Store.displayClasses);
