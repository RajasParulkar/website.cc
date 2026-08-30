let taskCounter = 102; // Start IDs after the pre-loaded demo card

/**
 * Handles the creation of a new task from the form submission.
 * @param {Event} event - The form submission event.
 */
function createNewTask(event) {
    event.preventDefault();

    // 1. Extract values from the form inputs
    const title = document.getElementById('taskTitle').value.trim();
    const assignee = document.getElementById('taskAssignee').value.trim();
    const priority = document.getElementById('taskPriority').value;
    const desc = document.getElementById('taskDesc').value.trim();

    // 2. Generate a unique card ID
    const taskId = 'task-' + taskCounter++;

    // 3. Construct the HTML string for the new task card
    const cardHTML = `
        <div class="task-card prio-${priority}" id="${taskId}">
            <div class="card-header">
                <span class="card-title">${escapeHTML(title)}</span>
                <span class="card-prio-badge">${priority}</span>
            </div>
            <div class="card-desc">${escapeHTML(desc)}</div>
            <div class="card-footer">
                <span class="card-assignee">👤 ${escapeHTML(assignee)}</span>
                <span class="card-actions">
                    <select onchange="moveTask('${taskId}', this.value)">
                        <option value="backlog" selected>Backlog</option>
                        <option value="progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </span>
            </div>
        </div>
    `;

    // 4. Append the newly created card into the Backlog column
    document.getElementById('col-backlog').insertAdjacentHTML('beforeend', cardHTML);

    // 5. Reset the form fields for the next input
    document.getElementById('taskForm').reset();

    // 6. Refresh the column task counters
    updateColumnCounts();
}

/**
 * Moves a card dynamically to a target column list.
 * @param {string} taskId - The unique ID of the task card.
 * @param {string} targetColumn - The target column identifier ('backlog', 'progress', or 'done').
 */
function moveTask(taskId, targetColumn) {
    const card = document.getElementById(taskId);
    const targetList = document.getElementById('col-' + targetColumn);
    
    if (card && targetList) {
        // Appending moves the DOM element to the new parent container automatically
        targetList.appendChild(card);
        
        // Ensure the dropdown selection value stays perfectly synchronized
        const select = card.querySelector('select');
        select.value = targetColumn;
        
        // Recalculate column task counts
        updateColumnCounts();
    }
}

/**
 * Recalculates and updates the numerical task counters displayed next to each column header.
 */
function updateColumnCounts() {
    const backlogCount = document.getElementById('col-backlog').children.length;
    const progressCount = document.getElementById('col-progress').children.length;
    const doneCount = document.getElementById('col-done').children.length;

    document.getElementById('count-backlog').innerText = backlogCount;
    document.getElementById('count-progress').innerText = progressCount;
    document.getElementById('count-done').innerText = doneCount;
}

/**
 * Quick helper function to sanitize user inputs and prevent basic Cross-Site Scripting (XSS).
 * @param {string} text - Raw input string.
 */
function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Automatically calculate and render column metrics once the DOM finishes loading
window.onload = updateColumnCounts;