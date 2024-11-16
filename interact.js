const { ethers } = require("hardhat");

async function main() {
    const todoListAddress = "0xeCf3B6817F33d761966b2DDFDd52d0b62382f1A3"; // Замените на ваш адрес
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = TodoList.attach(todoListAddress);

    // Пример добавления задачи
    const tx1 = await todoList.addTask("Learn Solidity");
    await tx1.wait();
    console.log("Task added: Learn Solidity");

    // Пример получения задачи
    const task = await todoList.getTask(1);
    console.log(`Task 1: ${task.content}, Completed: ${task.completed}`);

    // Пример обновления задачи
    const tx2 = await todoList.updateTask(1, "Learn Solidity and Smart Contracts");
    await tx2.wait();
    console.log("Task updated");

    // Пример переключения статуса задачи
    const tx3 = await todoList.toggleCompleted(1);
    await tx3.wait();
    console.log("Task 1 completed status toggled");

    // Пример получения всех задач
    const allTasks = await todoList.getAllTasks();
    console.log("All tasks:");
    allTasks.forEach((task) => {
        console.log(`ID: ${task.id}, Content: ${task.content}, Completed: ${task.completed}, Deleted: ${task.isDeleted}`);
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
