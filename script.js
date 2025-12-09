(() => {
  const input = document.getElementById("newTodoInput");
  const addBtn = document.getElementById("addTodo");
  const listEl = document.getElementById("todoList");
  const remainingEl = document.getElementById("remainingCount");
  const filterBtns = Array.from(document.querySelectorAll(".filter"));
  const clearCompletedBtn = document.getElementById("clearCompleted");

  const STORAGE_KEY = "todo-list-items";

  let todos = loadTodos();
  let currentFilter = "all";

  function loadTodos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  function addTodo(title) {
    if (!title.trim()) return;
    todos.unshift({
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      createdAt: Date.now(),
    });
    persist();
    render();
  }

  function toggleTodo(id) {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    persist();
    render();
  }

  function removeTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    persist();
    render();
  }

  function clearCompleted() {
    todos = todos.filter((todo) => !todo.completed);
    persist();
    render();
  }

  function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach((btn) =>
      btn.classList.toggle("is-active", btn.dataset.filter === filter)
    );
    render();
  }

  function getFilteredTodos() {
    if (currentFilter === "active") return todos.filter((t) => !t.completed);
    if (currentFilter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }

  function render() {
    const filtered = getFilteredTodos();

    listEl.innerHTML = "";

    if (!filtered.length) {
      listEl.innerHTML = `<li class="empty">No tasks here yet.</li>`;
    } else {
      filtered.forEach((todo) => {
        const li = document.createElement("li");
        li.className = `item ${todo.completed ? "item--done" : ""}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", () => toggleTodo(todo.id));

        const content = document.createElement("div");

        const title = document.createElement("p");
        title.className = "item__title";
        title.textContent = todo.title;

        const meta = document.createElement("small");
        meta.textContent = new Date(todo.createdAt).toLocaleString();

        content.append(title, meta);

        const actions = document.createElement("div");
        actions.className = "item__actions";

        const statusPill = document.createElement("span");
        statusPill.className = "pill";
        statusPill.textContent = todo.completed ? "Done" : "Active";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "danger";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => removeTodo(todo.id));

        actions.append(statusPill, deleteBtn);

        li.append(checkbox, content, actions);
        listEl.appendChild(li);
      });
    }

    const remaining = todos.filter((t) => !t.completed).length;
    remainingEl.textContent = `${remaining} item${remaining === 1 ? "" : "s"} left`;
  }

  function handleAdd() {
    addTodo(input.value);
    input.value = "";
    input.focus();
  }

  addBtn.addEventListener("click", handleAdd);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleAdd();
  });

  filterBtns.forEach((btn) =>
    btn.addEventListener("click", () => setFilter(btn.dataset.filter))
  );

  clearCompletedBtn.addEventListener("click", clearCompleted);

  render();
})(); 

