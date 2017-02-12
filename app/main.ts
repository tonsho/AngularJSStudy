var app = angular.module('app', []);

app.controller('todoController', ['$scope', ($scope) => {
    $scope.todoItems = [];
    $scope.message = '';
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

    // 完了アイテム数を取得
    $scope.remaining = () => {
        var count = 0;
        $scope.todoItems.forEach((todo) => {
            count += todo.done;
        });
        return count;
    };
}]);

app.directive('todoList', [() => {
    interface ImyScope extends ng.IScope {
        todoItems: any;
        update: (x: any, y: any) => void;
        delete: (x: any, y: any) => void;
    }
    return {
        restrict: 'EA',
        replace: true,
        template:
            '<ul class="list-group">' +
                '<li class="list-group-item" ng-repeat="todoItem in todoItems">' +
                    '<div class="list-group-item-inner">' +
                        '<div class="item-wrapper"><input type="checkbox" ng-model="todoItem.done"></div>' +
                        '<label class="done-{{todoItem.done}}" ng-dblclick="update($event, todoItem)">{{todoItem.message}}</label>' +
                        '<div class="item-wrapper">' +
                            '<button class="btn btn-xs btn-danger" ng-click="delete($event, todoItem.id)">&times;</button>' +
                        '</div>' +
                    '</div>' +
                '</li>' +
            '</ul>',
        link: (scope: ImyScope, iElement) => {
            // todoItem を更新
            scope.update = ($event, todoItem) => {
                var message = window.prompt('変更', todoItem.message);
                if (message) {
                    var t;
                    for (var i = 0; i < scope.todoItems.length; i++) {
                        t = scope.todoItems[i];
                        if (t.id == todoItem.id) {
                            t.message = message;
                            break;
                        }
                    }
                }
            };
            // todoItem を削除
            scope.delete = ($event, itemId) => {
                var index = 1;
                var t;
                for (var i = 0; i < scope.todoItems.length; i++) {
                    t = scope.todoItems[i];
                    if (t.id == itemId) {
                        index = i;
                        break;
                    }
                }
                scope.todoItems.splice(index, 1);
            };
        }
    }
}]);

