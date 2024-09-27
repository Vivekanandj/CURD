angular.module('crudApp', [])
  .controller('mainController', function ($http) {
    var vm = this;
    vm.items = [];
    vm.item = {};
    vm.editing = false;

    vm.loadItems = function () {
      $http.get('http://localhost:3306/items')
        .then(function (response) {
          vm.items = response.data;
        });
    };

    vm.saveItem = function () {
      if (vm.editing) {
        $http.put(`http://localhost:3306/items/${vm.item.id}`, vm.item)  
          .then(function () {
            vm.resetForm();
            vm.loadItems();
          });
      } else {
        $http.post('http://localhost:3306/items', vm.item)
          .then(function () {
            vm.resetForm();
            vm.loadItems();
          });
      }
    };

    vm.editItem = function (item) {
      vm.item = angular.copy(item);
      vm.editing = true;
    };

    vm.deleteItem = function (id) {
      $http.delete(`http://localhost:3306/items/${id}`)
        .then(function () {
          vm.loadItems();
        });
    };

    vm.resetForm = function () {
      vm.item = {};
      vm.editing = false;
    };
  });
