import angular = require('angular')

interface ITodoItemDirectiveScope extends ng.IScope {
    isEditMode: boolean;
    startEdit: Function;
    updateTodoItem: Function;
    cancelEdit: Function;
    removeTodoItem: Function;
}

interface ITodoScope extends ng.IScope {
    todoItems: TodoItem[];
    addTodoItem: Function;
    remaining: Function;
    message: string;
}

export class TodoItem {
    id: number;
    message: string;
    done: boolean;
    isEditMode: boolean;
}

export class TodoController {
    private index = 0;

    constructor(private $scope: ITodoScope) {
        this.$scope = $scope
        $scope.addTodoItem = angular.bind(this, this.addTodoItem);
        $scope.remaining = angular.bind(this, this.remaining);
        $scope.message = "";
        $scope.todoItems = [];
    }

    // todoItem を追加
    public addTodoItem(msg: string) {
        this.$scope.todoItems.push({
            id: this.index,
            message: msg,
            done: false,
            isEditMode: false
        });
        this.$scope.message = "";
        this.index++;
    }

    // todoItem を削除
    public removeTodoItem(todoItem: TodoItem) {
        var index = 0;
        var t;
        for (var i = 0; i < this.$scope.todoItems.length; i++) {
            t = this.$scope.todoItems[i];
            if (t.id == todoItem.id) {
                index = i;
                break;
            }
        }
        this.$scope.todoItems.splice(index, 1);
    }

    // 完了アイテム数を取得
    public remaining() {
        var count = 0;
        this.$scope.todoItems.forEach((todo: TodoItem) => {
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

    constructor() {
        this.restrict = 'EA';
        this.controller = 'todoController';
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
