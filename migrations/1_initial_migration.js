const Migrations = artifacts.require("Migrations");
const TodoLIst = artifacts.require("TodoList");
module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(TodoLIst);
};
