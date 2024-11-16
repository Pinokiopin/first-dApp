// Адрес вашего развернутого контракта
const contractAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Замените на фактический адрес
let todoListContract;
let provider;
let signer;

async function init() {
    if (typeof window.ethereum !== 'undefined') {
        // Создание провайдера и подписчика
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        todoListContract = new ethers.Contract(contractAddress, abi, signer);
    } else {
        alert('Пожалуйста, установите MetaMask для использования этого dApp');
    }

    loadTasks();
}

async function loadTasks() {
    const taskCount = await todoListContract.taskCount();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = '';  // Очистка существующих задач

    for (let i = 1; i <= taskCount; i++) {
        const task = await todoListContract.getTask(i);
        const li = document.createElement("li");
        li.textContent = task.content + (task.completed ? " (Завершено)" : "");
        
        // Кнопка для переключения статуса завершенности
        const toggleButton = document.createElement("button");
        toggleButton.textContent = task.completed ? "Пометить как незавершенное" : "Пометить как завершенное";
        toggleButton.onclick = () => toggleCompleted(i); // Привязка функции переключения

        // Кнопка для обновления задачи
        const updateButton = document.createElement("button");
        updateButton.textContent = "Обновить";
        updateButton.onclick = () => updateTask(i); // Привязка функции обновления

        // Кнопка для удаления задачи
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Удалить";
        deleteButton.onclick = () => deleteTask(i); // Привязка функции удаления

        li.appendChild(toggleButton); // Добавление кнопки переключения
        li.appendChild(updateButton); // Добавление кнопки обновления
        li.appendChild(deleteButton); // Добавление кнопки удаления
        taskList.appendChild(li);
    }
}

// Функции для обработки задач
async function addTask() {
    const taskInput = document.getElementById("taskInput").value;
    if (!taskInput) {
        alert("Введите текст задачи!");
        return;
    }

    try {
        const tx = await todoListContract.addTask(taskInput);
        await tx.wait();
        loadTasks();
        document.getElementById("taskInput").value = ''; // Очистка поля ввода
    } catch (error) {
        console.error("Error adding task:", error);
        alert("Ошибка при добавлении задачи");
    }
}

async function updateTask(id) {
    const newContent = prompt("Введите новое содержание задачи:");
    if (newContent) {
        try {
            const tx = await todoListContract.updateTask(id, newContent);
            await tx.wait();
            loadTasks(); // Перезагрузка задач
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Ошибка при обновлении задачи");
        }
    }
}

async function deleteTask(id) {
    const confirmation = confirm("Вы уверены, что хотите удалить эту задачу?");
    if (confirmation) {
        try {
            const tx = await todoListContract.deleteTask(id);
            await tx.wait();
            loadTasks(); // Перезагрузка задач
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Ошибка при удалении задачи");
        }
    }
}

async function toggleCompleted(id) {
    try {
        const tx = await todoListContract.toggleCompleted(id);
        await tx.wait();
        loadTasks(); // Перезагрузка задач
    } catch (error) {
        console.error("Error toggling task completion:", error);
        alert("Ошибка при переключении статуса задачи");
    }
}

// Обработчик события для добавления задачи
document.getElementById("taskForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    addTask(); // Добавление новой задачи
});

init();
