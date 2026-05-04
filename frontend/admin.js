const API = "http://127.0.0.1:5000/api";
let token = localStorage.getItem("admin_token");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  return value ? escapeHtml(value.slice(0, 19).replace("T", " ")) : "—";
}

window.onload = () => {
  if (token) {
    document.getElementById("loginOverlay").style.display = "none";
    loadAll();
  }
};

async function doLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const errEl = document.getElementById("loginError");
  errEl.style.display = "none";

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      token = data.token;
      localStorage.setItem("admin_token", token);
      document.getElementById("loginOverlay").style.display = "none";
      loadAll();
    } else {
      errEl.textContent = data.error || "Invalid email or password";
      errEl.style.display = "block";
    }
  } catch {
    errEl.textContent = "Could not connect to the backend";
    errEl.style.display = "block";
  }
}

document.addEventListener("keydown", (event) => {
  const overlayVisible = document.getElementById("loginOverlay").style.display !== "none";
  if (event.key === "Enter" && overlayVisible) {
    doLogin();
  }
});

async function apiFetch(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("admin_token");
    token = null;
    document.getElementById("loginOverlay").style.display = "flex";
    throw new Error(data.error || "Admin access denied");
  }

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

function loadAll() {
  loadUsers();
  loadLogs();
  loadTasks();
}

async function loadUsers() {
  try {
    const data = await apiFetch("/admin/users");
    document.getElementById("statUsers").textContent = data.length;
    document.getElementById("countUsers").textContent = `${data.length} rows`;

    if (!data.length) {
      document.getElementById("usersTable").innerHTML = '<div class="empty">No data</div>';
      return;
    }

    document.getElementById("usersTable").innerHTML = `
      <table>
        <thead><tr>
          <th>ID</th><th>Username</th><th>Email</th><th>Admin</th><th>Registered At</th>
        </tr></thead>
        <tbody>
          ${data.map((u) => `
            <tr>
              <td>#${escapeHtml(u.id)}</td>
              <td>${escapeHtml(u.username)}</td>
              <td>${escapeHtml(u.email)}</td>
              <td>${u.is_admin ? '<span class="badge badge-purple">✓ Admin</span>' : '<span class="badge badge-green">User</span>'}</td>
              <td>${formatDate(u.created_at)}</td>
            </tr>`).join("")}
        </tbody>
      </table>`;
  } catch (error) {
    document.getElementById("usersTable").innerHTML = `<div class="empty">${escapeHtml(error.message)}</div>`;
  }
}

async function loadLogs() {
  try {
    const data = await apiFetch("/admin/logs");
    document.getElementById("statLogs").textContent = data.length;
    document.getElementById("countLogs").textContent = `${data.length} rows`;

    if (!data.length) {
      document.getElementById("logsTable").innerHTML = '<div class="empty">No data</div>';
      return;
    }

    document.getElementById("logsTable").innerHTML = `
      <table>
        <thead><tr>
          <th>ID</th><th>User ID</th><th>Timestamp</th><th>Result</th>
        </tr></thead>
        <tbody>
          ${data.map((l) => `
            <tr>
              <td>#${escapeHtml(l.id)}</td>
              <td>${l.user_id ?? '<span style="color:var(--muted)">unknown</span>'}</td>
              <td>${formatDate(l.logged_at)}</td>
              <td>${l.success ? '<span class="badge badge-green">✓ Successful</span>' : '<span class="badge badge-red">✗ Failed</span>'}</td>
            </tr>`).join("")}
        </tbody>
      </table>`;
  } catch (error) {
    document.getElementById("logsTable").innerHTML = `<div class="empty">${escapeHtml(error.message)}</div>`;
  }
}

async function loadTasks() {
  try {
    const data = await apiFetch("/admin/tasks");
    document.getElementById("statTasks").textContent = data.length;
    document.getElementById("countTasks").textContent = `${data.length} rows`;

    if (!data.length) {
      document.getElementById("tasksTable").innerHTML = '<div class="empty">No data</div>';
      return;
    }

    document.getElementById("tasksTable").innerHTML = `
      <table>
        <thead><tr>
          <th>ID</th><th>User ID</th><th>Title</th><th>Status</th><th>Created At</th>
        </tr></thead>
        <tbody>
          ${data.map((t) => `
            <tr>
              <td>#${escapeHtml(t.id)}</td>
              <td>#${escapeHtml(t.user_id)}</td>
              <td>${escapeHtml(t.title)}</td>
              <td>${t.is_done ? '<span class="badge badge-green">✓ Done</span>' : '<span class="badge badge-amber">⏳ In Progress</span>'}</td>
              <td>${formatDate(t.created_at)}</td>
            </tr>`).join("")}
        </tbody>
      </table>`;
  } catch (error) {
    document.getElementById("tasksTable").innerHTML = `<div class="empty">${escapeHtml(error.message)}</div>`;
  }
}

const titles = { users: "Users", logs: "Login Logs", tasks: "Tasks" };

function switchTab(tab, el) {
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
  document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("active"));
  el.classList.add("active");
  document.getElementById("panel-" + tab).classList.add("active");
  document.getElementById("pageTitle").textContent = titles[tab];
}
