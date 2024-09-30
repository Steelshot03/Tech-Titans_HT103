// Get the necessary DOM elements
// Get the necessary DOM elements
const taskInput = document.getElementById('task-input');
const categoryInput = document.getElementById('category-input');
const deadlineInputDate = document.getElementById('deadline-input-date');  // Date input
const deadlineInputTime = document.getElementById('deadline-input-time');  // Time input
const taskList = document.getElementById('task-list');
const pagination = document.getElementById('pagination');

// Array to store tasks
let tasks = [];
let currentPage = 1;
const tasksPerPage = 2; // Number of tasks per page

// Function to add a task
function addTask() {
  const taskName = taskInput.value;
  const category = categoryInput.value;
  const deadlineDate = deadlineInputDate.value;
  const deadlineTime = deadlineInputTime.value;

  if (taskName && category && deadlineDate && deadlineTime) {
    // Combine date and time to form a complete deadline
    const deadline = new Date(`${deadlineDate}T${deadlineTime}`);

    const newTask = {
      id: new Date().getTime(),  // Unique ID based on timestamp
      name: taskName,
      category: category,
      deadline: deadline,  // Store full Date object
    };

    tasks.push(newTask);
    renderTasks();
    setReminder(newTask);  // Set a reminder for the task
    clearInputs();
  } else {
    alert('Please fill in all fields');
  }
}

// Function to set a reminder for a task
function setReminder(task) {
  const now = new Date();
  const timeUntilDeadline = task.deadline.getTime() - now.getTime();

  // Set a reminder for 1 hour before the deadline
  const reminderTime = timeUntilDeadline - (1 * 60 * 60 * 1000); // 1 hour in milliseconds

  if (reminderTime > 0) {
    setTimeout(() => {
      alert(`Reminder: The task "${task.name}" is due in 1 hour.`);
    }, reminderTime);
  } else if (timeUntilDeadline > 0) {
    // If less than 1 hour remains, notify immediately
    alert(`Reminder: The task "${task.name}" is due soon!`);
  }
}

// Function to delete a task
function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  renderTasks();
}

// Function to edit a task
function editTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  const newName = prompt('Edit Task Name:', task.name);
  const newCategory = prompt('Edit Category:', task.category);
  const newDeadlineDate = prompt('Edit Deadline Date (YYYY-MM-DD):', task.deadline.toISOString().split('T')[0]);
  const newDeadlineTime = prompt('Edit Deadline Time (HH:MM):', task.deadline.toISOString().split('T')[1].substring(0, 5));

  if (newName && newCategory && newDeadlineDate && newDeadlineTime) {
    task.name = newName;
    task.category = newCategory;
    task.deadline = new Date(`${newDeadlineDate}T${newDeadlineTime}`);  // Update with new date and time
    renderTasks();
    setReminder(task);  // Reset the reminder for the updated task
  } else {
    alert('Please fill in all fields');
  }
}

// Function to filter tasks by category
function filterTasks(category) {
  const filteredTasks = category === 'all' ? tasks : tasks.filter(task => task.category.toLowerCase() === category.toLowerCase());
  renderTasks(filteredTasks);
}

// Function to render tasks to the DOM with pagination
function renderTasks(filteredTasks = tasks) {
  taskList.innerHTML = '';  // Clear the existing list

  const startIdx = (currentPage - 1) * tasksPerPage;
  const endIdx = startIdx + tasksPerPage;
  const paginatedTasks = filteredTasks.slice(startIdx, endIdx);

  paginatedTasks.forEach(task => {
    const li = document.createElement('li');
    li.classList.add('task');
    li.setAttribute('data-id', task.id);  // Add data-id attribute
    li.innerHTML = `
      <div class="task-details">
        <span class="task-name">${task.name}</span>
        <span class="task-category">Category: ${task.category}</span>
        <span class="task-deadline">Deadline: ${task.deadline.toLocaleString()}</span>
      </div>
      <div class="task-actions">
        <button class="action-btn edit-btn" onclick="editTask(${task.id})">
          <i class="fas fa-pen"></i>
        </button>
        <button class="action-btn delete-btn" onclick="deleteTask(${task.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    taskList.appendChild(li);
  });

  renderPagination(filteredTasks.length);
}
// Function to render pagination buttons
function renderPagination(totalTasks) {
  pagination.innerHTML = '';

  const totalPages = Math.ceil(totalTasks / tasksPerPage);
  
  if (totalPages > 1) {
    for (let page = 1; page <= totalPages; page++) {
      const pageBtn = document.createElement('button');
      pageBtn.textContent = page;
      pageBtn.onclick = () => {
        currentPage = page;
        renderTasks();
      };
      if (page === currentPage) {
        pageBtn.disabled = true;
      }
      pagination.appendChild(pageBtn);
    }
  }
}

// Clear the input fields
function clearInputs() {
  taskInput.value = '';
  categoryInput.value = '';
  deadlineInputDate.value = '';
  deadlineInputTime.value = '';
}





/* Optional: Apply slide-out when switching pages */
function changePage(newPage) {
  const taskList = document.getElementById('task-list');
  taskList.style.animation = 'slideOut 0.5s ease-out';

  setTimeout(() => {
    currentPage = newPage;
    renderTasks();
    taskList.style.animation = 'slideIn 0.5s ease-out'; 
  }, 500);
}



function deleteTask(taskId) {
  const taskElement = document.querySelector(`li[data-id='${taskId}']`);
  
  if (taskElement) {
    taskElement.style.animation = 'fadeOut 0.5s forwards';

    setTimeout(() => {
      tasks = tasks.filter(task => task.id !== taskId);
      renderTasks();
    }, 500);  // Wait for animation to complete before removing task
  }
}
