// Application state management 
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all'; 

// Dom elements 
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const categoryInput = document.getElementById('categoryInput');
const dateInput = document.getElementById('dateInput'); 
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter-btn'); 
const today = new Date().toISOString().split('T')[0];
if (dateInput) dateInput.value = today;


function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function toggleTaskComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveToLocalStorage();
    renderTasks();
}

if (taskForm) {
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!taskInput.value.trim()) return; 

        const newTask = {
            id: Date.now().toString(),
            text: taskInput.value.trim(), 
            category: categoryInput.value,
            dueDate: dateInput.value || 'No date',
            completed: false
        };

        tasks.push(newTask);
        saveToLocalStorage();
        renderTasks();
        taskInput.value = '';
        if (dateInput) dateInput.value = today;
    });
}
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveToLocalStorage();
    renderTasks();
}


function renderTasks() {
    if (!taskList) return;
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
    const filterType = currentFilter.toLowerCase().trim();
    
    if (filterType === 'active') {
        return task.completed === false; 
    }
    if (filterType === 'completed') {
        return task.completed === true; 
    }
    return true; 
});



    if (filteredTasks.length === 0) { 
        taskList.innerHTML = `<li class="empty-state">No tasks found in this section.</li>`;
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

       
        li.innerHTML = `
        <div class="task-left">
            <input type="checkbox" class="checkbox-container" ${task.completed ? 'checked' : ''}>
            <div class="task-details">
                <span class="task-text">${escapeHtml(task.text)}</span>
                <div class="task-meta">
                    <span class="badge ${task.category.toLowerCase()}">${task.category}</span>
                    <span>📅 ${task.dueDate}</span>
                </div>
            </div>
        </div>
        <button class="delete-btn">&times;</button>  `;

        li.querySelector('.checkbox-container').addEventListener('change', () => toggleTaskComplete(task.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
        taskList.appendChild(li);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.getAttribute('data-filter'); 
        renderTasks();
    });
});


renderTasks();
