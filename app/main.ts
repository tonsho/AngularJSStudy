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

    // todoItem を更新
    $scope.updateTodoItem = (todoItem => {
        var message = window.prompt('変更', todoItem.message);
        if (message) {
            var t;
            for (var i = 0; i < $scope.todoItems.length; i++) {
                t = $scope.todoItems[i];
                if (t.id == todoItem.id) {
                    t.message = message;
                    break;
                }
            }
        }
    });

    // todoItem を削除
    $scope.removeTodoItem = (id) => {
        var index = 1;
        var t;
        for (var i = 0; i < $scope.todoItems.length; i++) {
            t = $scope.todoItems[i];
            if (t.id == id) {
                index = i;
                break;
            }
        }
        $scope.todoItems.splice(index, 1);
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
