// var app = angular.module('LojaApp', ['ui.router']);
var app = angular.module('starter');

app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('principal', {
        url: '/',
        templateUrl: 'views/principal.html',
        // precisamos adicionar o controlador aqui,
        // uma vez que ele não está indicado no index.html
        controller: 'PrincipalCtrl'
    });

    $stateProvider.state('produto', {
        url: '/produtos/:id',
        templateUrl: 'views/produto.html',
        controller: 'ProdutoCtrl'
    });

    $stateProvider.state('filtros', {
        url: '/filtros',
        templateUrl: 'views/filtros.html',
        controller: 'FiltrosCtrl'
    });

    $urlRouterProvider.otherwise('/');

});

app.controller('PrincipalCtrl', function ($scope, $produtoDao, $state, $filtros) {

    // $scope.min = 0;
    // $scope.max = 10000
    $scope.produtos = [];

    $produtoDao.getProdutos().then(function (produtos) {
        $scope.produtos = produtos;
    });

    // $http.get('produtos.json').then(function (response) {
    //     $scope.produtos = response.data;
    // });

    $scope.minmax = function (produto) {
        // return produto.preco >= $scope.min && produto.preco <= $scope.max;
        return produto.preco >= $filtros.getMin() && produto.preco <= $filtros.getMax();
    };

    $scope.filtros = function () {
        $state.go('filtros');
    };

});

app.controller('ProdutoCtrl', function ($scope, $produtoDao, $stateParams) {

    $scope.produto = $produtoDao.getProdutoById($stateParams.id);

});

app.factory('$produtoDao', function ($http, $q) {

    var produtos = [];

    function getProdutos() {
        return $q(function (resolve, reject) {
            $http.get('produtos.json').then(function (response) {
                produtos = response.data;
                resolve(produtos);
            });
        });
    }

    function getProdutoById(id) {
        for (var i = 0; i < produtos.length; i++) {
            var produto = produtos[i];
            if (produto.id == id) {
                return produto;
            }
        }
        return null;
    }

    return {
        getProdutos,
        getProdutoById
    };

});

app.controller('FiltrosCtrl', function ($scope, $filtros) {

    $scope.min = $filtros.getMin();
    $scope.max = $filtros.getMax();

    $scope.setMin = function (v) {
        $filtros.setMin(v);
    }
    $scope.setMax = function (v) {
        $filtros.setMax(v);
    }

});

app.factory('$filtros', function () {

    var min = 0;
    var max = 10000;

    function getMin() { return min; }
    function setMin(v) { min = v; }
    function getMax() { return max; }
    function setMax(v) { max = v; }

    return {
        getMin,
        setMin,
        getMax,
        setMax
    };

});
