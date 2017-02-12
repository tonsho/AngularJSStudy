var app = angular.module('app', []);

app.controller('todoController', ['$scope', function($scope) {
    $scope.todoItems = [];
    var index = 0;

    // todoItem を追加
    $scope.addTodoItem = (msg) => {
        $scope.todoItems.push({
            id: index,
            message: msg,
            done: false
        });
        $scope.message = '';
        index++;
    };

    // todoItem を削除
    this.removeTodoItem = (todoItem) => {
        var index = 0;
        var t;
        for (var i = 0; i < $scope.todoItems.length; i++) {
            t = $scope.todoItems[i];
            if (t.id == todoItem.id) {
                index = i;
                break;
            }
        }
        $scope.todoItems.splice(index, 1);
    };

    // 管理している todoItem の編集モードを全てキャンセルする
    this.cancelAll = () => {
        $scope.todoItems.forEach((todoItem) => {
            if (todoItem.isEditMode) {
                todoItem.cancel();
            }
        });
    };

    // 完了アイテム数を取得
    $scope.remaining = () => {
        var count = 0;
        $scope.todoItems.forEach((todo) => {
            count += todo.done;
        });
        return count;
    };
}]);

app.directive('todoList', () => {
    return {
        restrict: 'EA',
        replace: true,
        controller: 'todoController'
    }
});

app.directive('todoItem', () => {
    return {
        restrict: 'EA',
        require: '^todoList',
        replace: true,
        template: '<div class="list-group-item">'+
                    '<div class="list-group-item-inner" ng-hide="isEditMode">' +
                        '<div class="item-wrapper"><input type="checkbox" ng-model="todo.done" /></div>'+
                        '<label class="done-{{todo.done}}" ng-dblclick="startEdit(todo)">{{todo.message}}</label>' +
                        '<div class="item-wrapper"><button class="btn btn-danger btn-xs" ng-click="delete(todo)">&times;</button></div>' +
                    '</div>'+
                    '<div ng-show="isEditMode">'+
                        '<input ng-model="todo.message" class="form-control input-sm" todo-focus ng-blur="updateTodoItem($event)" ng-keyup="updateTodoItem($event)" />' +
                    '</div>'+
                  '</div>',
        scope: {
            todo: '='
        },
        link: (scope: any, element, attrs, TodoController: any) => {
            scope.isEditMode = false;

            // 編集モードの開始
            scope.startEdit = (todo) => {
                TodoController.cancelAll();
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
            scope.cancel = () => {
                if (!scope.isEditMode) return;
                scope.isEditMode = false;
            };
            // Todo アイテムを削除
            scope.delete = (todo) => {
                TodoController.removeTodoItem(todo);
            };
        }
    }
});

app.directive('todoFocus', ($timeout) => {
    return {
        link: (scope: any, element, attrs)=> {
            scope.$watch('isEditMode', (newVal) => {
                $timeout(() => {
                    element[0].focus();
                }, 0, false);
            });
        }
    }
});
