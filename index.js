let viewModal;
let editModal;

if (localStorage.getItem('taskId') <= 0) {
    localStorage.setItem('taskId', 0);
}

// Function to get formatted date
function getDate() {
    // Derive formatted date
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const dd = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    
    // Create a new string with the formatted date
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    // console.log("Today's date = " + formattedDate);

    return formattedDate;
}

let tasks = [];

// Function to create a task object
function createTask(taskId, title, description, endDate, status, priority, assignee) {
    return {
        taskId: taskId,
        title: title,
        description: description,
        endDate: endDate,
        status: status,
        priority: priority,
        assignee: assignee
    };
}

// Function to return tasks object
function getTasks() {
    if (parseInt(localStorage.getItem('taskId')) > 0) {
        // For loop to enter each task from local storage item tasks
        for (let i = 1; i <= parseInt(localStorage.getItem('taskId')); i++) {
            // console.log("task-" + parseInt(localStorage.getItem('taskId')));
            tasks[i - 1] = {
                title: JSON.parse(localStorage.getItem('task-' + i)).title,
                taskId: JSON.parse(localStorage.getItem('task-' + i)).taskId,
                start: getDate(),
                end: JSON.parse(localStorage.getItem('task-' + i)).endDate,
            };
        }
    }
    // console.log(tasks);
    // return tasks;
}


// Add new task
function addNewTask() {
    localStorage.setItem('taskId', parseInt(localStorage.getItem('taskId')) + 1);
    console.log('addNewTask() called');

    // Get task details
    let title = document.getElementById('newTaskTitle').value;
    let description = document.getElementById('newTaskDescription').value;
    let endDate = document.getElementById('newEndDate').value;
    let status = document.getElementById('newStatus').value;
    let priority = document.getElementById('newPriority').value;
    let assignee = document.getElementById('newAssignee').value;
    
    // Create task object
    let task = createTask(parseInt(localStorage.getItem('taskId')), title, description, endDate, status, priority, assignee);
    // console.log(task);
    
    // Add task to table
    addTaskToTable(task);
    
    // Save tasks array in local storage
    localStorage.setItem('task-' + parseInt(localStorage.getItem('taskId')), JSON.stringify(task));
    
    // Hide modal
    let newTaskModal = bootstrap.Modal.getInstance(document.getElementById('newTaskModal'));
    newTaskModal.hide();
    
    // Reset form
    document.getElementById('addTaskForm').reset();
}


// Show view task modal
function showViewTaskModal(taskId) {
    console.log('showViewTaskModal() called');
    // Get task details
    let task = JSON.parse(localStorage.getItem('task-' + taskId));
    // console.log("View taskId: "+taskId);
    console.log("View task: " + task.title);
    // Set task details
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskEndDate').innerText = task.endDate;
    if (task.status == 'In Progress') {
        document.getElementById('taskStatus').className = 'badge bg-warning text-dark';
    } else if (task.status == 'Completed') {
        document.getElementById('taskStatus').className = 'badge bg-success';
    } else if (task.status == 'Not Started') {
        document.getElementById('taskStatus').className = 'badge bg-primary';
    }
    document.getElementById('taskStatus').innerText = task.status;
    if (task.priority == 'Low') {
        document.getElementById('taskPriority').className = 'badge bg-success';
    } else if (task.priority == 'Medium') {
        document.getElementById('taskPriority').className = 'badge bg-warning text-dark';
    } else if (task.priority == 'High') {
        document.getElementById('taskPriority').className = 'badge bg-danger';
    }
    document.getElementById('taskPriority').innerText = task.priority;
    document.getElementById('taskAssignee').value = task.assignee;
    // Show modal
    
    // console.log("View Modal : "+viewModal);
    // let viewTaskModal = bootstrap.Modal.getInstance(viewModal);
    let viewTaskModal = new bootstrap.Modal(viewModal);
    viewTaskModal.show();
}

// Show edit task modal
function showEditTaskModal(taskId) {
    console.log('showEditTaskModal() called');
    // Get task details
    let task = JSON.parse(localStorage.getItem('task-' + taskId));
    // console.log("Edit taskId: "+taskId);
    // console.log("Edit task: " + task.title);
    // Set task details
    document.getElementById('editTaskTitle').value = task.title;
    document.getElementById('editTaskDescription').value = task.description;
    document.getElementById('editEndDate').value = task.endDate;
    document.getElementById('editStatus').value = task.status;
    document.getElementById('editPriority').value = task.priority;
    document.getElementById('editAssignee').value = task.assignee;
    document.getElementById('editTaskBtn').addEventListener('click', function () {
        // Edit task
        editTask(taskId);
    });
    // Show modal
    let editTaskModal = new bootstrap.Modal(editModal);
    editTaskModal.show();
}

// Function to edit task
function editTask(taskId) {
    console.log('editTask() called');
    // Get task details
    let task = JSON.parse(localStorage.getItem('task-' + taskId));
    // console.log("Edit taskId: "+taskId);
    console.log("Edit task: " + task.title);
    // Set task details
    task.title = document.getElementById('editTaskTitle').value;
    task.description = document.getElementById('editTaskDescription').value;
    task.endDate = document.getElementById('editEndDate').value;
    task.status = document.getElementById('editStatus').value;
    task.priority = document.getElementById('editPriority').value;
    task.assignee = document.getElementById('editAssignee').value;
    // Save task in local storage
    localStorage.setItem('task-' + taskId, JSON.stringify(task));
    // Hide modal
    let editTaskModal = bootstrap.Modal.getInstance(document.getElementById('editTaskModal'));
    editTaskModal.hide();
    // Reload page
    location.reload();
}

// Function to delete task
function deleteTask(taskId) {
    console.log('deleteTask() called');
    console.log("deleting task : " + taskId);
    let temp = parseInt(localStorage.getItem('taskId'));
    temp = temp - 1;
    localStorage.setItem('taskId', temp);
    // Get task details
    let task = JSON.parse(localStorage.getItem('task-' + taskId));
    // Delete task from local storage
    localStorage.removeItem('task-' + taskId);
    // Remove task from table
    document.getElementById('taskListTableBody').removeChild(document.getElementById('task-' + taskId));
    // Remove task from board
    let highPriorityBoard = document.getElementById('highPriorityBoard');
    let mediumPriorityBoard = document.getElementById('mediumPriorityBoard');
    let lowPriorityBoard = document.getElementById('lowPriorityBoard');
    let taskCard = document.getElementById('task-' + taskId);
    if (task.priority == 'High') {
        highPriorityBoard.removeChild(taskCard);
    } else if (task.priority == 'Medium') {
        mediumPriorityBoard.removeChild(taskCard);
    } else if (task.priority == 'Low') {
        lowPriorityBoard.removeChild(taskCard);
    }
    // Adjust taskId to match local storage
    if (parseInt(localStorage.getItem('taskId')) > 1) {
        for (let i = taskId; i < parseInt(localStorage.getItem('taskId')); i++) {
            // console.log("task-" + parseInt(localStorage.getItem('taskId')));
            let task = JSON.parse(localStorage.getItem('task-' + (i + 1)));
            task.taskId = i;
            localStorage.setItem('task-' + i, JSON.stringify(task));
            console.log("taskId after delete : " + task.taskId);
        }
    }
}

// Create View Button
function createViewButton(taskId) {
    let viewBtn = document.createElement('button');
    viewBtn.id = 'viewBtn';
    viewBtn.className = 'btn btn-secondary btn-sm ms-2';
    viewBtn.dataset.bsToggle = 'modal';
    viewBtn.dataset.bsTarget = '#viewTaskModal';
    viewBtn.dataset.bsToggle = 'tooltip';
    viewBtn.dataset.bsPlacement = 'top';
    viewBtn.title = 'View';
    viewBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    // console.log("TaskId at view button : "+parseInt(localStorage.getItem('taskId')));
    // viewBtn.onclick = showViewTaskModal(taskId);
    viewBtn.addEventListener('click', function () {
        // Show view task modal
        showViewTaskModal(taskId);
    });
    return viewBtn;
}

// Create Edit Button
function createEditButton(taskId) {
    let editBtn = document.createElement('button');
    editBtn.id = 'editBtn';
    editBtn.className = 'btn btn-primary btn-sm ms-2';
    editBtn.dataset.bsToggle = 'modal';
    editBtn.dataset.bsTarget = '#editTaskModal';
    editBtn.dataset.bsToggle = 'tooltip';
    editBtn.dataset.bsPlacement = 'top';
    editBtn.title = 'Edit';
    editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';
    editBtn.addEventListener('click', function () {
    // Show edit task modal
    showEditTaskModal(taskId);
    });
    return editBtn;
}

// Create Delete Button
function createDeleteButton(taskId) {
    let deleteBtn = document.createElement('button');
    deleteBtn.id = 'deleteBtn';
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteBtn.className = 'btn btn-danger btn-sm ms-2';
    deleteBtn.dataset.bsToggle = 'tooltip';
    deleteBtn.dataset.bsPlacement = 'top';
    deleteBtn.title = 'Delete';
    deleteBtn.addEventListener('click', function () {
        // Delete task
        deleteTask(taskId);
    });
    return deleteBtn;
}

// Adding tasks to table
function addTaskToTable(task) {
    let noTasksAvailable = document.getElementById('noTasksAvailable');
    if (noTasksAvailable) {
        noTasksAvailable.remove();
    }
    // console.log('addTaskToTable() called');
    // Get table body
    let taskListTableBody = document.getElementById('taskListTableBody');
    // console.log(taskListTableBody);
    
    // Create table row
    let taskListTableRow = document.createElement('tr');
    taskListTableRow.id = "task-" + task.taskId;
    
    // Add task title
    let taskTitle = document.createElement('td');
    taskTitle.className = 'p-2';
    taskTitle.innerText = task.title;
    taskListTableRow.appendChild(taskTitle);
    
    // Add task end date
    let taskEndDate = document.createElement('td');
    taskEndDate.className = 'p-2';
    taskEndDate.innerText = task.endDate;
    taskListTableRow.appendChild(taskEndDate);
    
    // Add task status
    let taskStatus = document.createElement('td');
    taskStatus.className = 'p-2';
    let statusBadge = document.createElement('span');
    if (task.status == 'In Progress') {
        statusBadge.className = 'badge bg-warning text-dark';
    } else if (task.status == 'Completed') {
        statusBadge.className = 'badge bg-success';
    } else if (task.status == 'Not Started') {
        statusBadge.className = 'badge bg-primary';
    }
    statusBadge.innerText = task.status;
    taskStatus.appendChild(statusBadge);
    taskListTableRow.appendChild(taskStatus);
    
    // Add task priority
    let taskPriority = document.createElement('td');
    taskPriority.className = 'p-2';
    let priorityBadge = document.createElement('span');
    if (task.priority == 'Low') {
        priorityBadge.className = 'badge bg-success';
    } else if (task.priority == 'Medium') {
        priorityBadge.className = 'badge bg-warning text-dark';
    } else if (task.priority == 'High') {
        priorityBadge.className = 'badge bg-danger';
    }
    priorityBadge.innerText = task.priority;
    taskPriority.appendChild(priorityBadge);
    taskListTableRow.appendChild(taskPriority);
    
    // Add task assignee
    let taskAssignee = document.createElement('td');
    taskAssignee.className = 'p-2';
    taskAssignee.innerText = task.assignee;
    taskListTableRow.appendChild(taskAssignee);
    
    // Add task actions
    let taskActions = document.createElement('td');
    taskActions.className = 'p-2';
    
    // Edit Button
    taskActions.appendChild(createEditButton(task.taskId));
    
    // Delete Button
    taskActions.appendChild(createDeleteButton(task.taskId));
    
    // View Button
    taskActions.appendChild(createViewButton(task.taskId));
    
    taskListTableRow.appendChild(taskActions);
    // Add row to table body
    taskListTableBody.appendChild(taskListTableRow);
}

// Adding tasks to board
function addTaskToBoard(task) {
    // console.log('addTaskToBoard() called');
    // Get all priority boards
    let highPriorityBoard = document.getElementById('highPriorityBoard');
    let mediumPriorityBoard = document.getElementById('mediumPriorityBoard');
    let lowPriorityBoard = document.getElementById('lowPriorityBoard');
    // console.log(taskBoard);
    // Create task card
    let taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.id = "task-" + task.taskId;
    // Add task title
    let taskTitle = document.createElement('h5');
    taskTitle.className = 'card-title';
    taskTitle.innerText = task.title;
    taskCard.appendChild(taskTitle);
    // Add task description
    let taskDescription = document.createElement('p');
    taskDescription.className = 'card-text';
    taskDescription.innerText = task.description;
    taskCard.appendChild(taskDescription);
    // Add task end date
    let taskEndDate = document.createElement('p');
    taskEndDate.className = 'card-text';
    taskEndDate.innerText = 'End Date: ' + task.endDate;
    taskCard.appendChild(taskEndDate);
    // Add task status
    let taskStatus = document.createElement('p');
    taskStatus.className = 'card-text';
    let statusBadge = document.createElement('span');
    if (task.status == 'In Progress') {
        statusBadge.className = 'badge bg-warning text-dark';
    } else if (task.status == 'Completed') {
        statusBadge.className = 'badge bg-success';
    } else if (task.status == 'Not Started') {
        statusBadge.className = 'badge bg-primary';
    }
    statusBadge.innerText = task.status;
    taskStatus.appendChild(statusBadge);
    taskCard.appendChild(taskStatus);
    // Add task priority
    let taskPriority = document.createElement('p');
    taskPriority.className = 'card-text';
    let priorityBadge = document.createElement('span');
    if (task.priority == 'Low') {
        priorityBadge.className = 'badge bg-success';
    } else if (task.priority == 'Medium') {
        priorityBadge.className = 'badge bg-warning text-dark';
    } else if (task.priority == 'High') {
        priorityBadge.className = 'badge bg-danger';
    }
    priorityBadge.innerText = task.priority;
    taskPriority.appendChild(priorityBadge);
    taskCard.appendChild(taskPriority);
    // Add task assignee
    let taskAssignee = document.createElement('p');
    taskAssignee.className = 'card-text';
    taskAssignee.innerText = 'Assignee: ' + task.assignee;
    taskCard.appendChild(taskAssignee);
    // Add task actions
    let taskActions = document.createElement('p');
    taskActions.className = 'card-text';
    // Edit Button
    let editBtn = createEditButton(task.taskId);
    editBtn.innerHTML = editBtn.innerHTML + ' Edit';
    taskActions.appendChild(editBtn);
    // Delete Button
    let deleteBtn = createDeleteButton(task.taskId);
    deleteBtn.innerHTML = deleteBtn.innerHTML + ' Delete';
    taskActions.appendChild(deleteBtn);
    // View Button
    let viewBtn = createViewButton(task.taskId);
    viewBtn.innerHTML = viewBtn.innerHTML + ' View';
    taskActions.appendChild(viewBtn);
    taskCard.appendChild(taskActions);
    // Add card to board
    if (task.taskId > 3) {
        console.log("Row wise addding card");
        let row = document.createElement('div');
        row.className = 'row';
        row.id = 'row-2';
        let col = document.createElement('div');
        col.className = 'col';
        col.id = 'col-2';
        let card = document.createElement('div');
        card.className = 'card';
        let cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        row.appendChild(col);
        cardBody.appendChild(taskCard);
        // row.appendChild(taskCard);
        if (task.priority == 'High') {
            highPriorityBoard.appendChild(cardBody);
        } else if (task.priority == 'Medium') {
            mediumPriorityBoard.appendChild(car);
        } else if (task.priority == 'Low') {
            lowPriorityBoard.appendChild(row);
        }
    } else {
        if (task.priority == 'High') {
            highPriorityBoard.appendChild(taskCard);
        } else if (task.priority == 'Medium') {
            mediumPriorityBoard.appendChild(taskCard);
        } else if (task.priority == 'Low') {
            lowPriorityBoard.appendChild(taskCard);
        }
    }
}

// When DOM is rendered
document.addEventListener('DOMContentLoaded', function () {
    viewModal = document.getElementById('viewTaskModal');
    editModal = document.getElementById('editTaskModal');
    getTasks();
    // console.log("Local storage length = " + localStorage.length);
    //Adding task row if tasks>0
    if (parseInt(localStorage.getItem('taskId')) > 0) {
        // For loop to enter each task from local storage item tasks
        for (let i = 1; i <= parseInt(localStorage.getItem('taskId')); i++) {
            // console.log("task-" + parseInt(localStorage.getItem('taskId')));


            // Add task to table
            addTaskToTable(JSON.parse(localStorage.getItem('task-' + i)));
            // Add task to board
            addTaskToBoard(JSON.parse(localStorage.getItem('task-' + i)));
        }
    } else {
        let noTasksAvailable = document.getElementById('noTasksAvailable');
        // Show No tasks available message in table body
        if (!noTasksAvailable) {
            let taskListTableBody = document.getElementById('taskListTableBody');
            let noTasksAvailable = document.createElement('tr');
            noTasksAvailable.id = 'noTasksAvailable';
            noTasksAvailable.innerHTML = '<td colspan="6" class="text-center">No tasks available</td>';
            taskListTableBody.appendChild(noTasksAvailable);
            // Show No tasks available message in board
            let highPriorityBoard = document.getElementById('highPriorityBoard');
            let mediumPriorityBoard = document.getElementById('mediumPriorityBoard');
            let lowPriorityBoard = document.getElementById('lowPriorityBoard');
            let noTasksAvailableBoard = document.createElement('div');
            noTasksAvailableBoard.id = 'noTasksAvailableBoard';
            noTasksAvailableBoard.className = 'text-center';
            noTasksAvailableBoard.innerHTML = '<p>No tasks available</p>';
            highPriorityBoard.appendChild(noTasksAvailableBoard);
            mediumPriorityBoard.appendChild(noTasksAvailableBoard.cloneNode(true));
            lowPriorityBoard.appendChild(noTasksAvailableBoard.cloneNode(true));
        }
    }

    let pillsCalendarTab = document.getElementById('pills-calendar-tab');
    // console.log(pillsCalendarTab);
    pillsCalendarTab.addEventListener('click', function () {
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: tasks,
            // eventClick: ,
        });
        calendar.updateSize();
        calendar.render();
    });
});