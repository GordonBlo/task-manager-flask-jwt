const API_BASE = "http://127.0.0.1:5000/api";

const registerForm = document.getElementById("register-form");
const registerMessage = document.getElementById("register-message");
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const loadTasksBtn = document.getElementById("load-tasks-btn");
const tasksOutput = document.getElementById("tasks-output");
const taskForm = document.getElementById("task-form");
const taskMessage = document.getElementById("task-message");

function setMessage(element, message, color) {
  element.textContent = message;
  element.style.color = color;
}

function getToken() {
  return localStorage.getItem("token");
}

function createTextElement(tag, text, className = "") {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const result = await parseJsonResponse(response);

    if (response.ok) {
      setMessage(registerMessage, "Registration successful!", "green");
      registerForm.reset();
    } else {
      setMessage(registerMessage, result.error || "An error occurred during registration.", "red");
    }
  } catch (error) {
    setMessage(registerMessage, "Could not connect to the backend.", "red");
    console.error("Register error:", error);
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await parseJsonResponse(response);

    if (response.ok) {
      localStorage.setItem("token", result.token);
      setMessage(loginMessage, "Login successful!", "green");
      loginForm.reset();
      await loadTasks();
    } else {
      setMessage(loginMessage, result.error || "An error occurred during login.", "red");
    }
  } catch (error) {
    setMessage(loginMessage, "Could not connect to the backend.", "red");
    console.error("Login error:", error);
  }
});

async function loadTasks() {
  const token = getToken();

  if (!token) {
    tasksOutput.textContent = "No saved token found. Please log in first.";
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/tasks/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await parseJsonResponse(response);

    if (response.ok) {
      renderTasks(result);
    } else {
      tasksOutput.textContent = result.error || "Failed to load tasks.";
    }
  } catch (error) {
    tasksOutput.textContent = "An error occurred while loading tasks.";
    console.error("Task load error:", error);
  }
}

async function toggleTask(taskId) {
  const token = getToken();

  if (!token) {
    alert("No token found. Please log in first.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/tasks/${taskId}/toggle`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await parseJsonResponse(response);

    if (response.ok) {
      await loadTasks();
    } else {
      alert(result.error || "Failed to update the task status.");
    }
  } catch (error) {
    console.error("Toggle error:", error);
    alert("An error occurred while toggling the task.");
  }
}

async function deleteTask(taskId) {
  const token = getToken();

  if (!token) {
    alert("No token found. Please log in first.");
    return;
  }

  if (!confirm("Are you sure you want to delete this task?")) return;

  try {
    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await parseJsonResponse(response);

    if (response.ok) {
      await loadTasks();
    } else {
      alert(result.error || "Failed to delete the task.");
    }
  } catch (error) {
    console.error("Delete error:", error);
    alert("An error occurred while deleting the task.");
  }
}

loadTasksBtn.addEventListener("click", loadTasks);

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = getToken();

  if (!token) {
    setMessage(taskMessage, "No token found. Please log in first.", "red");
    return;
  }

  const title = document.getElementById("task-title").value.trim();
  const description = document.getElementById("task-description").value.trim();

  try {
    const response = await fetch(`${API_BASE}/tasks/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    const result = await parseJsonResponse(response);

    if (response.ok) {
      setMessage(taskMessage, "Task created successfully!", "green");
      taskForm.reset();
      await loadTasks();
    } else {
      setMessage(taskMessage, result.error || "Failed to create the task.", "red");
    }
  } catch (error) {
    setMessage(taskMessage, "An error occurred while creating the task.", "red");
    console.error("Task create error:", error);
  }
});

function renderTasks(tasks) {
  tasksOutput.replaceChildren();

  if (!tasks.length) {
    tasksOutput.appendChild(createTextElement("p", "No tasks yet."));
    return;
  }

  tasks.forEach((task) => {
    const card = document.createElement("div");
    card.className = "task-card";

    card.appendChild(createTextElement("h3", task.title));
    card.appendChild(createTextElement("p", `Description: ${task.description || "No description"}`));

    const status = createTextElement("p", task.is_done ? "Done" : "Not done", `task-status ${task.is_done ? "task-done" : "task-not-done"}`);
    card.appendChild(status);

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.textContent = task.is_done ? "Mark as not done" : "Mark as done";
    toggleButton.addEventListener("click", () => toggleTask(task.id));
    card.appendChild(toggleButton);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "danger-btn";
    deleteButton.addEventListener("click", () => deleteTask(task.id));
    card.appendChild(deleteButton);

    tasksOutput.appendChild(card);
  });
}
