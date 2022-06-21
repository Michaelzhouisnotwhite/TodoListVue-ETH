// noinspection JSUnresolvedVariable

const Migrations = artifacts.require("Migrations");
const TodoLIst = artifacts.require("TodoList");
const TodoListUpgrade = artifacts.require("TodoListUpgrade");
module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(TodoLIst);
  deployer.deploy(TodoListUpgrade);
};
