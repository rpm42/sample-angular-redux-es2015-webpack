import angular from 'angular';
import axios from 'axios';
import {createStore, combineReducers} from 'redux';
import { createLogger } from 'redux-logger'
import ngRedux from 'ng-redux';
import thunk from 'redux-thunk';

var productsReducer = (state = {isFeatching: false, items: []}, action) => {
  switch (action.type) {
    case 'GET_PRODUCTS':
      return {
        isFeatching: true,
        items: []
      };
    case 'GET_PRODUCTS_COMPLETE':
      return {
        isFeatching: false,
        items: action.items
      };
    default:
      return state;
  };
};

class ProductsController {
  constructor($scope) {
    console.log($scope, this);
  }
}

function products() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      items: '='
    },
    controllerAs: 'pc',
    controller: ProductsController,
    template: require('./products.html'),
  };
}

class AppController {

  constructor($ngRedux, $scope, AsyncActions) {
    const unsubscribe = $ngRedux.connect(this.mapStateToThis, AsyncActions)(this);
    $scope.$on('$destroy', unsubscribe);
    this.fetchProducts();
    console.log("AppController", $scope, this);
  }

  mapStateToThis(state) {
    return state.products;
  }
}

export default function app() {
  return {
    restrict: 'E',
    controllerAs: 'app',
    controller: AppController,
    template: require('./app.html'),
    scope: {}
  };
}

function asyncService($http) {

  var getProducts = () => {
    return {
      type: 'GET_PRODUCTS'
    };
  };

  var getProductsComplete = (items) => {
    return {
      type: 'GET_PRODUCTS_COMPLETE',
      items
    };
  };

  var fetchProducts = () => {
    return dispatch => {
      dispatch(getProducts());
      axios.get('/api/items').then((res) => {
        console.log(res)
        let items = res.data;
        dispatch(getProductsComplete(items));
      });
    }
  };

  return {
    getProducts,
    getProductsComplete,
    fetchProducts
  };
}

angular
  .module('app', [ngRedux])
  .config(($ngReduxProvider) => {
    let reducer = combineReducers({products: productsReducer});
    const logger = createLogger();
    $ngReduxProvider.createStoreWith(reducer, [thunk, logger]);
  })
  .service('AsyncActions', asyncService)
  .directive('products', products)
  .directive('app', app);

//angular.module('tabsDemoDynamicHeight', ['ngMaterial']);

  


