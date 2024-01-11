let viewModal;
let editModal;

if (localStorage.getItem('numOfTasks') <= 0) {
    localStorage.setItem('taskId', 0);
    localStorage.setItem('numOfTasks', 0);
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

let calTasks = [];

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
    // console.log("End date : " + JSON.parse(localStorage.getItem('task-' + 1)).endDate);
    if (parseInt(localStorage.getItem('numOfTasks')) > 0) {
        // For loop to enter each task from local storage item tasks
        for (let i = 1; i <= parseInt(localStorage.getItem('taskId')); i++) {
            if (localStorage.getItem('task-' + i) == null) {
                continue;
            }
            // logging priority of the task
            // console.log(JSON.parse(localStorage.getItem('task-' + i)).priority);
            let backgroundColor;
            if(JSON.parse(localStorage.getItem('task-' + i)).priority == 'High') {
                backgroundColor = '#dc3545';
            } else if(JSON.parse(localStorage.getItem('task-' + i)).priority == 'Medium') {
                backgroundColor = '#ffc107';
            } else if(JSON.parse(localStorage.getItem('task-' + i)).priority == 'Low') {
                backgroundColor = '#28a745';
            }
            calTasks[i - 1] = {
                title: JSON.parse(localStorage.getItem('task-' + i)).title,
                id: JSON.parse(localStorage.getItem('task-' + i)).taskId,
                start: getDate(),
                end: JSON.parse(localStorage.getItem('task-' + i)).endDate,
                backgroundColor: backgroundColor,
            };
        }
    }
    console.log(calTasks);
    // return tasks;
}

// Function to get tasks according to priority
function getTasksByPriority(priority) {
    console.log('getTasksByPriority() called');
    let tasksByPriority = [];
    if (parseInt(localStorage.getItem('numOfTasks')) > 0) {
        // For loop to enter each task from local storage item tasks
        for (let i = 1; i <= parseInt(localStorage.getItem('taskId')); i++) {
            if (localStorage.getItem('task-' + i) == null) {
                continue;
            }
            if (JSON.parse(localStorage.getItem('task-' + i)).priority == priority) {
                tasksByPriority.push(JSON.parse(localStorage.getItem('task-' + i)));
            }
        }
    }
    return tasksByPriority;
}

// Add new task
function addNewTask() {

    console.log('addNewTask() called');

    // Get task details
    let title = document.getElementById('newTaskTitle').value;
    let description = document.getElementById('newTaskDescription').value;
    let endDateInput = new Date(document.getElementById('newEndDate').value);
    endDateInput.setDate(endDateInput.getDate() + 1);
    let endDate = endDateInput.toISOString().split('T')[0];
    console.log("End date : " + endDate);
    let status = document.getElementById('newStatus').value;
    let priority = document.getElementById('newPriority').value;
    let assignee = document.getElementById('newAssignee').value;

    // Validate form inputs
    let isValid = true;
    if (title.trim() === '') {
        document.getElementById('newTaskTitle').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('newTaskTitle').classList.remove('is-invalid');
    }

    if (description.trim() === '') {
        document.getElementById('newTaskDescription').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('newTaskDescription').classList.remove('is-invalid');
    }

    if (endDate.trim() === '') {
        document.getElementById('newEndDate').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('newEndDate').classList.remove('is-invalid');
    }

    if (status.trim() === '') {
        document.getElementById('newStatus').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('newStatus').classList.remove('is-invalid');
    }

    if (priority.trim() === '') {
        document.getElementById('newPriority').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('newPriority').classList.remove('is-invalid');
    }

    if (assignee.trim() === '') {
        document.getElementById('newAssignee').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('newAssignee').classList.remove('is-invalid');
    }

    if (!isValid) {
        console.log('Form is not valid');
        return;
    }

    // Increase taskId
    localStorage.setItem('taskId', parseInt(localStorage.getItem('taskId')) + 1);

    // Increase number of tasks
    localStorage.setItem('numOfTasks', parseInt(localStorage.getItem('numOfTasks')) + 1);

    // Create task object
    let task = createTask(parseInt(localStorage.getItem('numOfTasks')), title, description, endDate, status, priority, assignee);
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

    loadCalendar();

    // Reload page
    location.reload();
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
    let temp = parseInt(localStorage.getItem('numOfTasks'));
    temp = temp - 1;
    localStorage.setItem('numOfTasks', temp);
    // Delete task from local storage
    localStorage.removeItem('task-' + taskId);
    // Adjust task key in local storage
    for (let i = taskId + 1; i <= parseInt(localStorage.getItem('taskId')); i++) {
        if (localStorage.getItem('task-' + i) == null) {
            continue;
        }
        let tempTask = JSON.parse(localStorage.getItem('task-' + i));
        tempTask.taskId = tempTask.taskId - 1;
        localStorage.setItem('task-' + (i - 1), JSON.stringify(tempTask));
        localStorage.removeItem('task-' + i);
    }
    // Decrement taskId
    localStorage.setItem('taskId', parseInt(localStorage.getItem('taskId')) - 1);
    // Get task details
    // let task = JSON.parse(localStorage.getItem('task-' + taskId));
    // Remove task from table
    document.getElementById('taskListTableBody').removeChild(document.getElementById('task-' + taskId));
    // Remove task from board
    document.getElementById('task-' + taskId).remove();
    // Reload page
    location.reload();
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
    // console.log("TaskId at view button : "+parseInt(localStorage.getItem('numOfTasks')));
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
    // Decrement the endDate first then add it to table
    let endDateInput = new Date(task.endDate);
    endDateInput.setDate(endDateInput.getDate() - 1);
    endDateInput = endDateInput.toISOString().split('T')[0];
    taskEndDate.innerText = endDateInput;
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

    // View Button
    taskActions.appendChild(createViewButton(task.taskId));

    // Edit Button
    taskActions.appendChild(createEditButton(task.taskId));

    // Delete Button
    taskActions.appendChild(createDeleteButton(task.taskId));

    taskListTableRow.appendChild(taskActions);
    // Add row to table body
    taskListTableBody.appendChild(taskListTableRow);
}

// Adding tasks to board
function addTaskToBoard(task) {
    // Get all priority boards
    let highPriorityBoard = document.getElementById('highPriorityBoard');
    let mediumPriorityBoard = document.getElementById('mediumPriorityBoard');
    let lowPriorityBoard = document.getElementById('lowPriorityBoard');

    let card = document.createElement('div');
    card.className = 'card mb-2';

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    let taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.id = "task-" + task.taskId;

    let taskTitle = document.createElement('h5');
    taskTitle.className = 'card-title';
    taskTitle.innerText = task.title;
    taskCard.appendChild(taskTitle);

    let taskEndDate = document.createElement('p');
    taskEndDate.className = 'card-text';
    taskEndDate.innerText = 'End Date: ' + task.endDate;
    taskCard.appendChild(taskEndDate);

    let taskStatus = document.createElement('p');
    taskStatus.className = 'card-text';
    taskStatus.innerHTML = 'Status: ';
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

    let taskPriority = document.createElement('p');
    taskPriority.className = 'card-text';
    taskPriority.innerHTML = 'Priority: ';
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

    let taskAssignee = document.createElement('p');
    taskAssignee.className = 'card-text';
    taskAssignee.innerText = 'Assignee: ' + task.assignee;
    taskCard.appendChild(taskAssignee);

    let taskActions = document.createElement('div');
    taskActions.className = 'card-actions';

    let viewBtn = createViewButton(task.taskId);
    viewBtn.innerHTML = viewBtn.innerHTML + ' View';
    taskActions.appendChild(viewBtn);

    let editBtn = createEditButton(task.taskId);
    editBtn.innerHTML = editBtn.innerHTML + ' Edit';
    taskActions.appendChild(editBtn);

    let deleteBtn = createDeleteButton(task.taskId);
    deleteBtn.innerHTML = deleteBtn.innerHTML + ' Delete';
    taskActions.appendChild(deleteBtn);

    taskCard.appendChild(taskActions);

    cardBody.appendChild(taskCard);
    card.appendChild(cardBody);

    if (task.priority == 'High') {
        highPriorityBoard.appendChild(card);
    } else if (task.priority == 'Medium') {
        mediumPriorityBoard.appendChild(card);
    } else if (task.priority == 'Low') {
        lowPriorityBoard.appendChild(card);
    }
}

// Function to load Calendar
function loadCalendar() {
    console.log('loadCalendar() called');
    let pillsCalendarTab = document.getElementById('pills-calendar-tab');
    // console.log(pillsCalendarTab);
    pillsCalendarTab.addEventListener('click', function () {
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: calTasks,
            eventClick: function (info) {
                // console.log(info.event.title);
                // console.log(info.event.id);
                showViewTaskModal(info.event.id);
            },
            // cursor to pointer when mouse is over event
            eventMouseEnter: function (info) {
                info.el.style.cursor = 'pointer';
            }
        });
        calendar.updateSize();
        calendar.render();
    });
}

// When DOM is rendered
document.addEventListener('DOMContentLoaded', function () {
    console.log(localStorage);

    viewModal = document.getElementById('viewTaskModal');
    editModal = document.getElementById('editTaskModal');
    let noTasksAvailableBoard = document.getElementById('noTasksAvailableBoard');
    let noTasksAvailableList = document.getElementById('noTasksAvailableList');
    getTasks();
    // console.log("Local storage length = " + localStorage.length);
    //Adding task row if tasks>0
    if (parseInt(localStorage.getItem('numOfTasks')) > 0) {
        // For loop to enter each task from local storage item tasks
        for (let i = 1; i <= parseInt(localStorage.getItem('taskId')); i++) {
            // console.log(JSON.parse(localStorage.getItem('task-' + i)));
            if (localStorage.getItem('task-' + i) == null) {
                console.log('Task already deleted');
                continue; // continue to next iteration if task already deleted
            }
            // Add task to table
            addTaskToTable(JSON.parse(localStorage.getItem('task-' + i)));
            // Add task to board
            addTaskToBoard(JSON.parse(localStorage.getItem('task-' + i)));
        }

        if (!noTasksAvailableBoard) {
            console.log('No tasks available board');
            // Show No tasks available message in board
            let highPriorityBoard = document.getElementById('highPriorityBoard');
            let mediumPriorityBoard = document.getElementById('mediumPriorityBoard');
            let lowPriorityBoard = document.getElementById('lowPriorityBoard');
            let noTasksAvailableBoard = document.createElement('div');
            noTasksAvailableBoard.id = 'noTasksAvailableBoard';
            noTasksAvailableBoard.className = 'text-center';
            noTasksAvailableBoard.innerHTML = '<p>No tasks available</p>';
            let card = document.createElement('div');
            card.className = 'card mb-2';
            let cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            card.appendChild(cardBody);
            cardBody.appendChild(noTasksAvailableBoard);
            let priorityBoards = ['High', 'Medium', 'Low'];
            priorityBoards.forEach(function (priority) {
                // console.log("priority: " + priority);
                var tasks = getTasksByPriority(priority);
                console.log("Priority: " + priority + " tasks: " + tasks.length);
                if (tasks.length == 0) {
                    if (priority == 'High') {
                        highPriorityBoard.appendChild(card);
                    } if (priority == 'Medium') {
                        mediumPriorityBoard.appendChild(card.cloneNode(true));
                    } if (priority == 'Low') {
                        lowPriorityBoard.appendChild(card.cloneNode(true));
                    }
                }
            });
            // highPriorityBoard.appendChild(noTasksAvailableBoard);
            // mediumPriorityBoard.appendChild(noTasksAvailableBoard.cloneNode(true));
            // lowPriorityBoard.appendChild(noTasksAvailableBoard.cloneNode(true));
        }
    } else {
        if (!noTasksAvailableList) {
            console.log('No tasks available list');
            // Show No tasks available message in table body
            let taskListTableBody = document.getElementById('taskListTableBody');
            let noTasksAvailableList = document.createElement('tr');
            noTasksAvailableList.id = 'noTasksAvailableList';
            noTasksAvailableList.innerHTML = '<td colspan="6" class="text-center">No tasks available</td>';
            taskListTableBody.appendChild(noTasksAvailableList);
        }
        if (!noTasksAvailableBoard) {
            console.log('No tasks available board');
            // Show No tasks available message in board
            let highPriorityBoard = document.getElementById('highPriorityBoard');
            let mediumPriorityBoard = document.getElementById('mediumPriorityBoard');
            let lowPriorityBoard = document.getElementById('lowPriorityBoard');
            let noTasksAvailableBoard = document.createElement('div');
            noTasksAvailableBoard.id = 'noTasksAvailableBoard';
            noTasksAvailableBoard.className = 'text-center';
            noTasksAvailableBoard.innerHTML = '<p>No tasks available</p>';
            let card = document.createElement('div');
            card.className = 'card mb-2';
            let cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            highPriorityBoard.appendChild(card);
            card.appendChild(cardBody);
            cardBody.appendChild(noTasksAvailableBoard);
            mediumPriorityBoard.appendChild(card.cloneNode(true));
            lowPriorityBoard.appendChild(card.cloneNode(true));

        }
    }

    // Load calendar
    loadCalendar();
});