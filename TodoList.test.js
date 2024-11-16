const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList Contract", function () {
    let TodoList;
    let todoList;
    let owner;
    let addr1;

    beforeEach(async function () {
        TodoList = await ethers.getContractFactory("TodoList");
        todoList = await TodoList.deploy();
        [owner, addr1] = await ethers.getSigners();
        
        await todoList.addTask("Test Task 1");
        await todoList.addTask("Test Task 2");
    });

    describe("Function Return Values", function () {
        it("should return the correct task after addition", async function () {
            const task = await todoList.getTask(1);
            expect(task.content).to.equal("Test Task 1");
            expect(task.completed).to.equal(false);
            expect(task.isDeleted).to.equal(false);
        });
    });

    describe("State Changes", function () {
        it("should increment taskCount when a new task is added", async function () {
            await todoList.addTask("Task 3");
            expect(await todoList.taskCount()).to.equal(3);
        });
        
        it("should update task as completed", async function () {
            await todoList.toggleCompleted(1);
            const task = await todoList.getTask(1);
            expect(task.completed).to.equal(true);
        });

        // it("should delete a task (soft delete)", async function () {
        //     await todoList.deleteTask(1);
        //     const task = await todoList.getTask(1);
        //     expect(task.isDeleted).to.equal(true);
        // });

        it("should revert when trying to get a deleted task", async function () {
            await todoList.deleteTask(1);
            await expect(todoList.getTask(1)).to.be.revertedWith("Task does not exist or has been deleted");
        });
    });

    describe("Event Emission", function () {
        it("should emit TaskAdded event when a task is added", async function () {
            await expect(todoList.addTask("New Task"))
                .to.emit(todoList, "TaskAdded")
                .withArgs(3, "New Task");
        });

        it("should emit TaskCompleted event when a task is completed", async function () {
            await expect(todoList.toggleCompleted(1))
                .to.emit(todoList, "TaskCompleted")
                .withArgs(1, true);
        });

        it("should emit TaskDeleted event when a task is deleted", async function () {
            await expect(todoList.deleteTask(1))
                .to.emit(todoList, "TaskDeleted")
                .withArgs(1);
        });

        it("should emit TaskUpdated event when a task is updated", async function () {
            await expect(todoList.updateTask(1, "Updated Task"))
                .to.emit(todoList, "TaskUpdated")
                .withArgs(1, "Updated Task");
        });
    });

    describe("Input Restrictions", function () {
        it("should revert if task content is empty", async function () {
            await expect(todoList.addTask("")).to.be.revertedWith("Content must not be empty");
        });

        it("should revert if updating task with empty content", async function () {
            await expect(todoList.updateTask(1, "")).to.be.revertedWith("Content must not be empty");
        });
    });

    describe("Error Handling", function () {
        it("should revert if trying to complete a non-existent task", async function () {
            await expect(todoList.toggleCompleted(99)).to.be.revertedWith("Task does not exist or has been deleted");
        });

        it("should revert if trying to delete a non-existent task", async function () {
            await expect(todoList.deleteTask(99)).to.be.revertedWith("Task does not exist or has been deleted");
        });

        it("should revert if trying to update a non-existent task", async function () {
            await expect(todoList.updateTask(99, "New Content")).to.be.revertedWith("Task does not exist or has been deleted");
        });
    });

    describe("Get All Tasks", function () {
        it("should return all tasks", async function () {
            await todoList.addTask("Task 3");
            const allTasks = await todoList.getAllTasks();
            expect(allTasks.length).to.equal(3);
            expect(allTasks[0].content).to.equal("Test Task 1");
            expect(allTasks[1].content).to.equal("Test Task 2");
            expect(allTasks[2].content).to.equal("Task 3");
        });
    });

    describe("Get Task", function () {
        it("should return a specific task by ID", async function () {
            const task = await todoList.getTask(1);
            expect(task.content).to.equal("Test Task 1");
            expect(task.completed).to.equal(false);
            expect(task.isDeleted).to.equal(false);
        });

        it("should revert when trying to get a non-existent task", async function () {
            await expect(todoList.getTask(99)).to.be.revertedWith("Task does not exist or has been deleted");
        });
    });

    describe("Get Multiple Tasks", function () {
        it("should return multiple tasks", async function () {
            const taskIds = [1, 2];
            const tasks = await todoList.getMultipleTasks(taskIds);
            expect(tasks.length).to.equal(2);
            expect(tasks[0].content).to.equal("Test Task 1");
            expect(tasks[1].content).to.equal("Test Task 2");
        });

        it("should revert if one of the task IDs does not exist", async function () {
            const taskIds = [1, 99];
            await expect(todoList.getMultipleTasks(taskIds)).to.be.revertedWith("One of the tasks does not exist or has been deleted");
        });
    });
});
