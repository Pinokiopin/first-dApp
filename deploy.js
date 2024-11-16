async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = await TodoList.deploy();
  
    // This will print the deployed contract address in the console
    console.log("TodoList contract deployed to:", todoList.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  