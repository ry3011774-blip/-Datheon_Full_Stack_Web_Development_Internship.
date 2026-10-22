// Application state management 
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all'; // स्पेलिंग ठीक की: F कैपिटल किया ताकि नीचे मैच हो सके

// Dom elements 
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const categoryInput = document.getElementById('categoryInput');
const dateInput = document.getElementById('dateInput'); // HTML  dateInput 
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter-btn'); // Multiple buttons के लिए querySelectorAll किया

// set today's date as default 
const today = new Date().toISOString().split('T')[0];
if (dateInput) dateInput.value = today;


function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Toggle Complete Function (जो पहले मिसिंग था)
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

// create Task
if (taskForm) {
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!taskInput.value.trim()) return; // खाली टास्क ऐड होने से रोकने के लिए

        const newTask = {
            id: Date.now().toString(),
            text: taskInput.value.trim(), // taskImput को ठीक करके taskInput किया
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

// Delete Task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveToLocalStorage();
    renderTasks();
}

// Read & Filter Data View 
function renderTasks() {
    if (!taskList) return;
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
    // अक्षरों के छोटे-बड़े (Case) की गलती से बचने के लिए इसे lowercase में बदलें
    const filterType = currentFilter.toLowerCase().trim();
    
    if (filterType === 'active') {
        return task.completed === false; // केवल अधूरे टास्क
    }
    if (filterType === 'completed') {
        return task.completed === true;  // केवल पूरे हो चुके टास्क (कड़े नियम के साथ)
    }
    return true; // 'all' के लिए सारे टास्क
});



    if (filteredTasks.length === 0) { 
        taskList.innerHTML = `<li class="empty-state">No tasks found in this section.</li>`;
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        // onpointerdown हटाकर innerHTML किया और क्लास के बीच की गड़बड़ ठीक की
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
        <button class="delete-btn">&times;</button>
        `;

        li.querySelector('.checkbox-container').addEventListener('change', () => toggleTaskComplete(task.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
        taskList.appendChild(li);
    });
}

// Security Utility: Prevent script injections (XSS)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

// Handle Filter Tab Switches 
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.getAttribute('data-filter'); // date-filter को data-filter किया
        renderTasks();
    });
});

// पहली बार पेज लोड होने पर टास्क दिखाने के लिए
renderTasks();
