import angular = require('angular')
import AWS = require('aws-sdk')

interface ITodoItemDirectiveScope extends ng.IScope {
    isEditMode: boolean;
    startEdit: Function;
    updateTodoItem: Function;
    cancelEdit: Function;
    removeTodoItem: Function;
}

export class TodoItem {
    id: number;
    message: string;
    done: boolean;
    isEditMode: boolean;
}

export class TodoController {
    private index = 0;
    public todoItems: TodoItem[]
    public message: string;

    constructor() {
        this.todoItems = [];
    }

    // todoItem を追加
    public addTodoItem(msg: string) {
        this.todoItems.push({
            id: this.index,
            message: msg,
            done: false,
            isEditMode: false
        });
        this.message = "";
        this.index++;
        var s3 = new AWS.S3();
        s3.listBuckets((err, data) => {
            console.log(err);
            console.log(data);
        });
    }

    // todoItem を削除
    public removeTodoItem(todoItem: TodoItem) {
        var index = 0;
        var t;
        for (var i = 0; i < this.todoItems.length; i++) {
            t = this.todoItems[i];
            if (t.id == todoItem.id) {
                index = i;
                break;
            }
        }
        this.todoItems.splice(index, 1);
    }

    // 完了アイテム数を取得
    public remaining() {
        var count = 0;
        this.todoItems.forEach((todo: TodoItem) => {
            if (todo.done) {
                count += 1;
            }
        });
        return count;
    }
};

export class TodoItemDirective implements ng.IDirective {
    public restrict: string;
    public require: string;
    public replace: boolean;
    public template: string;
    public scope: any;
    public link: (scope: ITodoItemDirectiveScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, todoController: TodoController) => void;

    constructor() {
        this.restrict = 'EA';
        this.require = '^todoList';
        this.replace = true;
        this.template = '<div class="list-group-item">'+
                    '<div class="list-group-item-inner" ng-hide="isEditMode">' +
                        '<div class="item-wrapper"><input type="checkbox" ng-model="todo.done" /></div>'+
                        '<label class="done-{{todo.done}}" ng-dblclick="startEdit(todo)">{{todo.message}}</label>' +
                        '<div class="item-wrapper"><button class="btn btn-danger btn-xs" ng-click="removeTodoItem(todo)">&times;</button></div>' +
                    '</div>'+
                    '<div ng-show="isEditMode">'+
                        '<input ng-model="todo.message" class="form-control input-sm" todo-focus ng-blur="updateTodoItem($event)" ng-keyup="updateTodoItem($event)" />' +
                    '</div>'+
                  '</div>';
        this.scope = {
            todo: '='
        }
        this.link = (scope, element, attrs, todoController) => {
            scope.isEditMode = false;

            // 編集モードの開始
            scope.startEdit = (todo) => {
                scope.isEditMode = true;
            };
            // 編集終了
            scope.updateTodoItem = ($event) => {
                if ($event.type === 'keyup') {
                    if ($event.which !== 13) return;
                } else if ($event.type !== 'blur') {
                    return;
                }
                scope.isEditMode = false;
                $event.stopPropagation();
            };
            // 編集キャンセル
            scope.cancelEdit = () => {
                if (!scope.isEditMode) return;
                scope.isEditMode = false;
            };
            // Todo アイテムを削除
            scope.removeTodoItem = (todo) => {
                todoController.removeTodoItem(todo);
            };
        }
    }

    public static Factory(): ng.IDirectiveFactory {
        var directive = () => {
            return new TodoItemDirective();
        }
        directive.$inject = []
        return directive;
    }
}

export class TodoListDirective implements ng.IDirective {
    public restrict: string;
    public controller: string;
    public controllerAs: string;
    public bindToController: boolean;

    constructor() {
        this.restrict = 'EA';
        this.controller = 'todoController';
        this.controllerAs = 'c';
        this.bindToController = true;
    }

    public static Factory(): ng.IDirectiveFactory {
        var directive = () => {
            return new TodoListDirective();
        }
        directive.$inject = []
        return directive;
    }
};

export class TodoFocusDirective implements ng.IDirective {
    public link: (scope: any, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

    constructor($timeout) {
        this.link = (scope, element, attrs) => {
            scope.$watch('isEditMode', (newVal) => {
                $timeout(() => {
                    element[0].focus();
                }, 0, false);
            });
        }
    }

    public static Factory(): ng.IDirectiveFactory {
        var directive = ($timeout) => {
            return new TodoFocusDirective($timeout);
        }
        directive.$inject = ['$timeout']
        return directive;
    }
};
