import angular = require('angular')
import AngularTodo = require('./AngularTodo')

var app = angular.module('app', []);

app.controller('todoController', ['$scope', AngularTodo.TodoController]);
app.directive('todoList', AngularTodo.TodoListDirective.Factory());
app.directive('todoItem', AngularTodo.TodoItemDirective.Factory());
app.directive('todoFocus', AngularTodo.TodoFocusDirective.Factory());
