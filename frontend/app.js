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
      setMessage(registerMessage, "Sikeres regisztráció!", "green");
      registerForm.reset();
    } else {
      setMessage(registerMessage, result.error || "Hiba történt a regisztráció során.", "red");
    }
  } catch (error) {
    setMessage(registerMessage, "Nem sikerült kapcsolódni a backendhez.", "red");
    console.error("Register hiba:", error);
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
      setMessage(loginMessage, "Sikeres bejelentkezés!", "green");
      loginForm.reset();
      await loadTasks();
    } else {
      setMessage(loginMessage, result.error || "Hiba történt a bejelentkezés során.", "red");
    }
  } catch (error) {
    setMessage(loginMessage, "Nem sikerült kapcsolódni a backendhez.", "red");
    console.error("Login hiba:", error);
  }
});

async function loadTasks() {
  const token = getToken();

  if (!token) {
    tasksOutput.textContent = "Nincs elmentett token. Jelentkezz be először.";
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
      tasksOutput.textContent = result.error || "Nem sikerült lekérni a taskokat.";
    }
  } catch (error) {
    tasksOutput.textContent = "Hiba történt a taskok lekérése közben.";
    console.error("Task lekérés hiba:", error);
  }
}

async function toggleTask(taskId) {
  const token = getToken();

  if (!token) {
    alert("Nincs token. Jelentkezz be először.");
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
      alert(result.error || "Nem sikerült módosítani a task állapotát.");
    }
  } catch (error) {
    console.error("Toggle hiba:", error);
    alert("Hiba történt a toggle közben.");
  }
}

async function deleteTask(taskId) {
  const token = getToken();

  if (!token) {
    alert("Nincs token. Jelentkezz be először.");
    return;
  }

  if (!confirm("Biztosan törölni akarod ezt a taskot?")) return;

  try {
    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await parseJsonResponse(response);

    if (response.ok) {
      await loadTasks();
    } else {
      alert(result.error || "Nem sikerült törölni a taskot.");
    }
  } catch (error) {
    console.error("Delete hiba:", error);
    alert("Hiba történt a törlés közben.");
  }
}

loadTasksBtn.addEventListener("click", loadTasks);

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = getToken();

  if (!token) {
    setMessage(taskMessage, "Nincs token. Jelentkezz be először.", "red");
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
      setMessage(taskMessage, "Task sikeresen létrehozva!", "green");
      taskForm.reset();
      await loadTasks();
    } else {
      setMessage(taskMessage, result.error || "Nem sikerült létrehozni a taskot.", "red");
    }
  } catch (error) {
    setMessage(taskMessage, "Hiba történt a task létrehozása közben.", "red");
    console.error("Task create hiba:", error);
  }
});

function renderTasks(tasks) {
  tasksOutput.replaceChildren();

  if (!tasks.length) {
    tasksOutput.appendChild(createTextElement("p", "Nincs még task."));
    return;
  }

  tasks.forEach((task) => {
    const card = document.createElement("div");
    card.className = "task-card";

    card.appendChild(createTextElement("h3", task.title));
    card.appendChild(createTextElement("p", `Description: ${task.description || "Nincs leírás"}`));

    const status = createTextElement("p", task.is_done ? "Kész" : "Nincs kész", `task-status ${task.is_done ? "task-done" : "task-not-done"}`);
    card.appendChild(status);

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.textContent = task.is_done ? "Jelöld nem készre" : "Jelöld készre";
    toggleButton.addEventListener("click", () => toggleTask(task.id));
    card.appendChild(toggleButton);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Törlés";
    deleteButton.className = "danger-btn";
    deleteButton.addEventListener("click", () => deleteTask(task.id));
    card.appendChild(deleteButton);

    tasksOutput.appendChild(card);
  });
}
