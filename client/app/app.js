'use strict';

angular.module('pmgRestfulApiApp', ['pmgRestfulApiApp.auth', 'pmgRestfulApiApp.admin', 'pmgRestfulApiApp.constants', 'ngCookies', 'ngResource', 'ngSanitize', 'btford.socket-io', 'ui.router', 'ui.bootstrap', 'validation.match']).config(function ($urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');

  $locationProvider.html5Mode(true);
});
//# sourceMappingURL=app.js.map

'use strict';

angular.module('pmgRestfulApiApp.admin', ['pmgRestfulApiApp.auth', 'ui.router']);
//# sourceMappingURL=admin.module.js.map

'use strict';

angular.module('pmgRestfulApiApp.auth', ['pmgRestfulApiApp.constants', 'pmgRestfulApiApp.util', 'ngCookies', 'ui.router']).config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});
//# sourceMappingURL=auth.module.js.map

'use strict';

angular.module('pmgRestfulApiApp.util', []);
//# sourceMappingURL=util.module.js.map

'use strict';

angular.module('pmgRestfulApiApp').config(function ($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'app/account/login/login.html',
    controller: 'LoginController',
    controllerAs: 'vm'
  }).state('logout', {
    url: '/logout?referrer',
    referrer: 'main',
    template: '',
    controller: function controller($state, Auth) {
      var referrer = $state.params.referrer || $state.current.referrer || 'main';
      Auth.logout();
      $state.go(referrer);
    }
  }).state('signup', {
    url: '/signup',
    templateUrl: 'app/account/signup/signup.html',
    controller: 'SignupController',
    controllerAs: 'vm'
  }).state('settings', {
    url: '/settings',
    templateUrl: 'app/account/settings/settings.html',
    controller: 'SettingsController',
    controllerAs: 'vm',
    authenticate: true
  });
}).run(function ($rootScope) {
  $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current) {
    if (next.name === 'logout' && current && current.name && !current.authenticate) {
      next.referrer = current.name;
    }
  });
});
//# sourceMappingURL=account.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginController = function () {
  function LoginController(Auth, $state) {
    _classCallCheck(this, LoginController);

    this.user = {};
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.$state = $state;
  }

  _createClass(LoginController, [{
    key: 'login',
    value: function login(form) {
      var _this = this;

      this.submitted = true;

      if (form.$valid) {
        this.Auth.login({
          email: this.user.email,
          password: this.user.password
        }).then(function () {
          // Logged in, redirect to home
          _this.$state.go('main');
        }).catch(function (err) {
          _this.errors.other = err.message;
        });
      }
    }
  }]);

  return LoginController;
}();

angular.module('pmgRestfulApiApp').controller('LoginController', LoginController);
//# sourceMappingURL=login.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SettingsController = function () {
  function SettingsController(Auth) {
    _classCallCheck(this, SettingsController);

    this.Auth = Auth;
  }

  _createClass(SettingsController, [{
    key: 'changePassword',
    value: function changePassword(form) {
      var _this = this;

      this.submitted = true;

      if (form.$valid) {
        this.Auth.changePassword(this.user.oldPassword, this.user.newPassword).then(function () {
          _this.message = 'Password successfully changed.';
        }).catch(function () {
          form.password.$setValidity('mongoose', false);
          _this.errors.other = 'Incorrect password';
          _this.message = '';
        });
      }
    }
  }]);

  return SettingsController;
}();

angular.module('pmgRestfulApiApp').controller('SettingsController', SettingsController);
//# sourceMappingURL=settings.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SignupController = function () {
  //end-non-standard

  function SignupController(Auth, $state) {
    _classCallCheck(this, SignupController);

    this.Auth = Auth;
    this.$state = $state;
  }
  //start-non-standard


  _createClass(SignupController, [{
    key: 'register',
    value: function register(form) {
      var _this = this;

      this.submitted = true;

      if (form.$valid) {
        this.Auth.createUser({
          name: this.user.name,
          email: this.user.email,
          password: this.user.password
        }).then(function () {
          // Account created, redirect to home
          _this.$state.go('main');
        }).catch(function (err) {
          err = err.data;
          _this.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function (error, field) {
            form[field].$setValidity('mongoose', false);
            _this.errors[field] = error.message;
          });
        });
      }
    }
  }]);

  return SignupController;
}();

angular.module('pmgRestfulApiApp').controller('SignupController', SignupController);
//# sourceMappingURL=signup.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var AdminController = function () {
    function AdminController(User) {
      _classCallCheck(this, AdminController);

      // Use the User $resource to fetch all users
      this.users = User.query();
    }

    _createClass(AdminController, [{
      key: 'delete',
      value: function _delete(user) {
        user.$remove();
        this.users.splice(this.users.indexOf(user), 1);
      }
    }]);

    return AdminController;
  }();

  angular.module('pmgRestfulApiApp.admin').controller('AdminController', AdminController);
})();
//# sourceMappingURL=admin.controller.js.map

'use strict';

angular.module('pmgRestfulApiApp.admin').config(function ($stateProvider) {
  $stateProvider.state('admin', {
    url: '/admin',
    templateUrl: 'app/admin/admin.html',
    controller: 'AdminController',
    controllerAs: 'admin',
    authenticate: 'admin'
  });
});
//# sourceMappingURL=admin.router.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var MainController = function () {
    function MainController($http, $scope, socket) {
      _classCallCheck(this, MainController);

      this.$http = $http;
      this.socket = socket;
      this.awesomeThings = [];

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('thing');
      });
    }

    _createClass(MainController, [{
      key: '$onInit',
      value: function $onInit() {
        var _this = this;

        this.$http.get('/api/things').then(function (response) {
          _this.awesomeThings = response.data;
          _this.socket.syncUpdates('thing', _this.awesomeThings);
        });
      }
    }, {
      key: 'addThing',
      value: function addThing() {
        if (this.newThing) {
          this.$http.post('/api/things', {
            name: this.newThing
          });
          this.newThing = '';
        }
      }
    }, {
      key: 'deleteThing',
      value: function deleteThing(thing) {
        this.$http.delete('/api/things/' + thing._id);
      }
    }]);

    return MainController;
  }();

  angular.module('pmgRestfulApiApp').component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });
})();
//# sourceMappingURL=main.controller.js.map

'use strict';

angular.module('pmgRestfulApiApp').config(function ($stateProvider) {
  $stateProvider.state('main', {
    url: '/',
    template: '<main></main>'
  });
});
//# sourceMappingURL=main.js.map

'use strict';

(function () {

  function AuthService($location, $http, $cookies, $q, appConfig, Util, User) {
    var safeCb = Util.safeCb;
    var currentUser = {};
    var userRoles = appConfig.userRoles || [];

    if ($cookies.get('token') && $location.path() !== '/logout') {
      currentUser = User.get();
    }

    var Auth = {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional, function(error, user)
       * @return {Promise}
       */
      login: function login(_ref, callback) {
        var email = _ref.email;
        var password = _ref.password;

        return $http.post('/auth/local', {
          email: email,
          password: password
        }).then(function (res) {
          $cookies.put('token', res.data.token);
          currentUser = User.get();
          return currentUser.$promise;
        }).then(function (user) {
          safeCb(callback)(null, user);
          return user;
        }).catch(function (err) {
          Auth.logout();
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        });
      },


      /**
       * Delete access token and user info
       */
      logout: function logout() {
        $cookies.remove('token');
        currentUser = {};
      },


      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional, function(error, user)
       * @return {Promise}
       */
      createUser: function createUser(user, callback) {
        return User.save(user, function (data) {
          $cookies.put('token', data.token);
          currentUser = User.get();
          return safeCb(callback)(null, user);
        }, function (err) {
          Auth.logout();
          return safeCb(callback)(err);
        }).$promise;
      },


      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional, function(error, user)
       * @return {Promise}
       */
      changePassword: function changePassword(oldPassword, newPassword, callback) {
        return User.changePassword({
          id: currentUser._id
        }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function () {
          return safeCb(callback)(null);
        }, function (err) {
          return safeCb(callback)(err);
        }).$promise;
      },


      /**
       * Gets all available info on a user
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, funciton(user)
       * @return {Object|Promise}
       */
      getCurrentUser: function getCurrentUser(callback) {
        if (arguments.length === 0) {
          return currentUser;
        }

        var value = currentUser.hasOwnProperty('$promise') ? currentUser.$promise : currentUser;
        return $q.when(value).then(function (user) {
          safeCb(callback)(user);
          return user;
        }, function () {
          safeCb(callback)({});
          return {};
        });
      },


      /**
       * Check if a user is logged in
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, function(is)
       * @return {Bool|Promise}
       */
      isLoggedIn: function isLoggedIn(callback) {
        if (arguments.length === 0) {
          return currentUser.hasOwnProperty('role');
        }

        return Auth.getCurrentUser(null).then(function (user) {
          var is = user.hasOwnProperty('role');
          safeCb(callback)(is);
          return is;
        });
      },


      /**
       * Check if a user has a specified role or higher
       *   (synchronous|asynchronous)
       *
       * @param  {String}     role     - the role to check against
       * @param  {Function|*} callback - optional, function(has)
       * @return {Bool|Promise}
       */
      hasRole: function hasRole(role, callback) {
        var hasRole = function hasRole(r, h) {
          return userRoles.indexOf(r) >= userRoles.indexOf(h);
        };

        if (arguments.length < 2) {
          return hasRole(currentUser.role, role);
        }

        return Auth.getCurrentUser(null).then(function (user) {
          var has = user.hasOwnProperty('role') ? hasRole(user.role, role) : false;
          safeCb(callback)(has);
          return has;
        });
      },


      /**
       * Check if a user is an admin
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, function(is)
       * @return {Bool|Promise}
       */
      isAdmin: function isAdmin() {
        return Auth.hasRole.apply(Auth, [].concat.apply(['admin'], arguments));
      },


      /**
       * Get auth token
       *
       * @return {String} - a token string used for authenticating
       */
      getToken: function getToken() {
        return $cookies.get('token');
      }
    };

    return Auth;
  }

  angular.module('pmgRestfulApiApp.auth').factory('Auth', AuthService);
})();
//# sourceMappingURL=auth.service.js.map

'use strict';

(function () {

  function authInterceptor($rootScope, $q, $cookies, $injector, Util) {
    var state;
    return {
      // Add authorization token to headers
      request: function request(config) {
        config.headers = config.headers || {};
        if ($cookies.get('token') && Util.isSameOrigin(config.url)) {
          config.headers.Authorization = 'Bearer ' + $cookies.get('token');
        }
        return config;
      },


      // Intercept 401s and redirect you to login
      responseError: function responseError(response) {
        if (response.status === 401) {
          (state || (state = $injector.get('$state'))).go('login');
          // remove any stale tokens
          $cookies.remove('token');
        }
        return $q.reject(response);
      }
    };
  }

  angular.module('pmgRestfulApiApp.auth').factory('authInterceptor', authInterceptor);
})();
//# sourceMappingURL=interceptor.service.js.map

'use strict';

(function () {

  angular.module('pmgRestfulApiApp.auth').run(function ($rootScope, $state, Auth) {
    // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role
    $rootScope.$on('$stateChangeStart', function (event, next) {
      if (!next.authenticate) {
        return;
      }

      if (typeof next.authenticate === 'string') {
        Auth.hasRole(next.authenticate, _.noop).then(function (has) {
          if (has) {
            return;
          }

          event.preventDefault();
          return Auth.isLoggedIn(_.noop).then(function (is) {
            $state.go(is ? 'main' : 'login');
          });
        });
      } else {
        Auth.isLoggedIn(_.noop).then(function (is) {
          if (is) {
            return;
          }

          event.preventDefault();
          $state.go('main');
        });
      }
    });
  });
})();
//# sourceMappingURL=router.decorator.js.map

'use strict';

(function () {

  function UserResource($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    }, {
      changePassword: {
        method: 'PUT',
        params: {
          controller: 'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      }
    });
  }

  angular.module('pmgRestfulApiApp.auth').factory('User', UserResource);
})();
//# sourceMappingURL=user.service.js.map

'use strict';

angular.module('pmgRestfulApiApp').directive('footer', function () {
  return {
    templateUrl: 'components/footer/footer.html',
    restrict: 'E',
    link: function link(scope, element) {
      element.addClass('footer');
    }
  };
});
//# sourceMappingURL=footer.directive.js.map

'use strict';

angular.module('pmgRestfulApiApp').factory('Modal', function ($rootScope, $uibModal) {
  /**
   * Opens a modal
   * @param  {Object} scope      - an object to be merged with modal's scope
   * @param  {String} modalClass - (optional) class(es) to be applied to the modal
   * @return {Object}            - the instance $uibModal.open() returns
   */
  function openModal() {
    var scope = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var modalClass = arguments.length <= 1 || arguments[1] === undefined ? 'modal-default' : arguments[1];

    var modalScope = $rootScope.$new();

    angular.extend(modalScope, scope);

    return $uibModal.open({
      templateUrl: 'components/modal/modal.html',
      windowClass: modalClass,
      scope: modalScope
    });
  }

  // Public API here
  return {

    /* Confirmation modals */
    confirm: {

      /**
       * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
       * @param  {Function} del - callback, ran when delete is confirmed
       * @return {Function}     - the function to open the modal (ex. myModalFn)
       */
      delete: function _delete() {
        var del = arguments.length <= 0 || arguments[0] === undefined ? angular.noop : arguments[0];

        /**
         * Open a delete confirmation modal
         * @param  {String} name   - name or info to show on modal
         * @param  {All}           - any additional args are passed straight to del callback
         */
        return function () {
          var args = Array.prototype.slice.call(arguments),
              name = args.shift(),
              deleteModal;

          deleteModal = openModal({
            modal: {
              dismissable: true,
              title: 'Confirm Delete',
              html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
              buttons: [{
                classes: 'btn-danger',
                text: 'Delete',
                click: function click(e) {
                  deleteModal.close(e);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click: function click(e) {
                  deleteModal.dismiss(e);
                }
              }]
            }
          }, 'modal-danger');

          deleteModal.result.then(function (event) {
            del.apply(event, args);
          });
        };
      }
    }
  };
});
//# sourceMappingURL=modal.service.js.map

'use strict';

/**
 * Removes server error when user updates input
 */

angular.module('pmgRestfulApiApp').directive('mongooseError', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function link(scope, element, attrs, ngModel) {
      element.on('keydown', function () {
        return ngModel.$setValidity('mongoose', true);
      });
    }
  };
});
//# sourceMappingURL=mongoose-error.directive.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NavbarController =
//end-non-standard

//start-non-standard
function NavbarController(Auth) {
  _classCallCheck(this, NavbarController);

  this.isLoggedIn = Auth.isLoggedIn;
  this.isAdmin = Auth.isAdmin;
  this.getCurrentUser = Auth.getCurrentUser;
};

angular.module('pmgRestfulApiApp').controller('NavbarController', NavbarController);
//# sourceMappingURL=navbar.controller.js.map

'use strict';

angular.module('pmgRestfulApiApp').directive('navbar', function () {
  return {
    templateUrl: 'components/navbar/navbar.html',
    restrict: 'E',
    controller: 'NavbarController',
    controllerAs: 'nav'
  };
});
//# sourceMappingURL=navbar.directive.js.map

'use strict';

angular.module('pmgRestfulApiApp').controller('OauthButtonsCtrl', function ($window) {
  this.loginOauth = function (provider) {
    $window.location.href = '/auth/' + provider;
  };
});
//# sourceMappingURL=oauth-buttons.controller.js.map

'use strict';

angular.module('pmgRestfulApiApp').directive('oauthButtons', function () {
  return {
    templateUrl: 'components/oauth-buttons/oauth-buttons.html',
    restrict: 'EA',
    controller: 'OauthButtonsCtrl',
    controllerAs: 'OauthButtons',
    scope: {
      classes: '@'
    }
  };
});
//# sourceMappingURL=oauth-buttons.directive.js.map

/* global io */
'use strict';

angular.module('pmgRestfulApiApp').factory('socket', function (socketFactory) {
  // socket.io now auto-configures its connection when we ommit a connection url
  var ioSocket = io('', {
    // Send auth token on connection, you will need to DI the Auth service above
    // 'query': 'token=' + Auth.getToken()
    path: '/socket.io-client'
  });

  var socket = socketFactory({
    ioSocket: ioSocket
  });

  return {
    socket: socket,

    /**
     * Register listeners to sync an array with updates on a model
     *
     * Takes the array we want to sync, the model name that socket updates are sent from,
     * and an optional callback function after new items are updated.
     *
     * @param {String} modelName
     * @param {Array} array
     * @param {Function} cb
     */
    syncUpdates: function syncUpdates(modelName, array, cb) {
      cb = cb || angular.noop;

      /**
       * Syncs item creation/updates on 'model:save'
       */
      socket.on(modelName + ':save', function (item) {
        var oldItem = _.find(array, {
          _id: item._id
        });
        var index = array.indexOf(oldItem);
        var event = 'created';

        // replace oldItem if it exists
        // otherwise just add item to the collection
        if (oldItem) {
          array.splice(index, 1, item);
          event = 'updated';
        } else {
          array.push(item);
        }

        cb(event, item, array);
      });

      /**
       * Syncs removed items on 'model:remove'
       */
      socket.on(modelName + ':remove', function (item) {
        var event = 'deleted';
        _.remove(array, {
          _id: item._id
        });
        cb(event, item, array);
      });
    },


    /**
     * Removes listeners for a models updates on the socket
     *
     * @param modelName
     */
    unsyncUpdates: function unsyncUpdates(modelName) {
      socket.removeAllListeners(modelName + ':save');
      socket.removeAllListeners(modelName + ':remove');
    }
  };
});
//# sourceMappingURL=socket.service.js.map

'use strict';

(function () {

  /**
   * The Util service is for thin, globally reusable, utility functions
   */
  function UtilService($window) {
    var Util = {
      /**
       * Return a callback or noop function
       *
       * @param  {Function|*} cb - a 'potential' function
       * @return {Function}
       */
      safeCb: function safeCb(cb) {
        return angular.isFunction(cb) ? cb : angular.noop;
      },


      /**
       * Parse a given url with the use of an anchor element
       *
       * @param  {String} url - the url to parse
       * @return {Object}     - the parsed url, anchor element
       */
      urlParse: function urlParse(url) {
        var a = document.createElement('a');
        a.href = url;

        // Special treatment for IE, see http://stackoverflow.com/a/13405933 for details
        if (a.host === '') {
          a.href = a.href;
        }

        return a;
      },


      /**
       * Test whether or not a given url is same origin
       *
       * @param  {String}           url       - url to test
       * @param  {String|String[]}  [origins] - additional origins to test against
       * @return {Boolean}                    - true if url is same origin
       */
      isSameOrigin: function isSameOrigin(url, origins) {
        url = Util.urlParse(url);
        origins = origins && [].concat(origins) || [];
        origins = origins.map(Util.urlParse);
        origins.push($window.location);
        origins = origins.filter(function (o) {
          var hostnameCheck = url.hostname === o.hostname;
          var protocolCheck = url.protocol === o.protocol;
          // 2nd part of the special treatment for IE fix (see above):  
          // This part is when using well-known ports 80 or 443 with IE,
          // when $window.location.port==='' instead of the real port number.
          // Probably the same cause as this IE bug: https://goo.gl/J9hRta
          var portCheck = url.port === o.port || o.port === '' && (url.port === '80' || url.port === '443');
          return hostnameCheck && protocolCheck && portCheck;
        });
        return origins.length >= 1;
      }
    };

    return Util;
  }

  angular.module('pmgRestfulApiApp.util').factory('Util', UtilService);
})();
//# sourceMappingURL=util.service.js.map

angular.module("pmgRestfulApiApp").run(["$templateCache", function($templateCache) {$templateCache.put("app/admin/admin.html","<div class=\"container\">\n  <p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p>\n  <ul class=\"list-group user-list\">\n    <li class=\"list-group-item\" ng-repeat=\"user in admin.users\">\n	    <div class=\"user-info\">\n	        <strong>{{user.name}}</strong><br>\n	        <span class=\"text-muted\">{{user.email}}</span>\n	    </div>\n        <a ng-click=\"admin.delete(user)\" class=\"trash\"><span class=\"fa fa-trash fa-2x\"></span></a>\n    </li>\n  </ul>\n</div>\n");
$templateCache.put("app/main/main.html","<header class=\"hero-unit\" id=\"banner\">\n  <div class=\"container\">\n    <h1>\'Allo, \'Allo!</h1>\n    <p class=\"lead\">Kick-start your next web app with Angular Fullstack</p>\n    <img src=\"assets/images/yeoman-462ccecbb1.png\" alt=\"I\'m Yeoman\">\n  </div>\n</header>\n\n<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-lg-12\">\n      <h1 class=\"page-header\">Features:</h1>\n      <ul class=\"nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6\" ng-repeat=\"thing in $ctrl.awesomeThings\">\n        <li><a href=\"#\" uib-tooltip=\"{{thing.info}}\">{{thing.name}}<button type=\"button\" class=\"close\" ng-click=\"$ctrl.deleteThing(thing)\">&times;</button></a></li>\n      </ul>\n    </div>\n  </div>\n\n  <form class=\"thing-form\">\n    <label>Syncs in realtime across clients</label>\n    <p class=\"input-group\">\n      <input type=\"text\" class=\"form-control\" placeholder=\"Add a new thing here.\" ng-model=\"$ctrl.newThing\">\n      <span class=\"input-group-btn\">\n        <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"$ctrl.addThing()\">Add New</button>\n      </span>\n    </p>\n  </form>\n</div>\n");
$templateCache.put("components/footer/footer.html","<div class=\"container\">\n  <p>Angular Fullstack v3.7.6 |\n    <a href=\"https://twitter.com/tyhenkel\">@tyhenkel</a> |\n    <a href=\"https://github.com/DaftMonk/generator-angular-fullstack/issues?state=open\">Issues</a>\n  </p>\n</div>\n");
$templateCache.put("components/modal/modal.html","<div class=\"modal-header\">\n  <button ng-if=\"modal.dismissable\" type=\"button\" ng-click=\"$dismiss()\" class=\"close\">&times;</button>\n  <h4 ng-if=\"modal.title\" ng-bind=\"modal.title\" class=\"modal-title\"></h4>\n</div>\n<div class=\"modal-body\">\n  <p ng-if=\"modal.text\" ng-bind=\"modal.text\"></p>\n  <div ng-if=\"modal.html\" ng-bind-html=\"modal.html\"></div>\n</div>\n<div class=\"modal-footer\">\n  <button ng-repeat=\"button in modal.buttons\" ng-class=\"button.classes\" ng-click=\"button.click($event)\" ng-bind=\"button.text\" class=\"btn\"></button>\n</div>\n");
$templateCache.put("components/navbar/navbar.html","<div class=\"navbar navbar-default navbar-static-top\" ng-controller=\"NavbarController\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <button class=\"navbar-toggle\" type=\"button\" ng-click=\"nav.isCollapsed = !nav.isCollapsed\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a href=\"/\" class=\"navbar-brand\">pmg-restful-api</a>\n    </div>\n    <div uib-collapse=\"nav.isCollapsed\" class=\"navbar-collapse collapse\" id=\"navbar-main\">\n      <ul class=\"nav navbar-nav\">\n        <li ng-repeat=\"item in nav.menu\" ui-sref-active=\"active\">\n            <a ui-sref=\"{{item.state}}\">{{item.title}}</a>\n        </li>\n        <li ng-show=\"nav.isAdmin()\" ui-sref-active=\"active\"><a ui-sref=\"admin\">Admin</a></li>\n      </ul>\n\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li ng-hide=\"nav.isLoggedIn()\" ui-sref-active=\"active\"><a ui-sref=\"signup\">Sign up</a></li>\n        <li ng-hide=\"nav.isLoggedIn()\" ui-sref-active=\"active\"><a ui-sref=\"login\">Login</a></li>\n        <li ng-show=\"nav.isLoggedIn()\"><p class=\"navbar-text\">Hello {{ nav.getCurrentUser().name }}</p> </li>\n        <li ng-show=\"nav.isLoggedIn()\" ui-sref-active=\"active\"><a ui-sref=\"settings\"><span class=\"glyphicon glyphicon-cog\"></span></a></li>\n        <li ng-show=\"nav.isLoggedIn()\"><a ui-sref=\"logout\">Logout</a></li>\n      </ul>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("components/oauth-buttons/oauth-buttons.html","<a ng-class=\"classes\" ng-click=\"OauthButtons.loginOauth(\'facebook\')\" class=\"btn btn-social btn-facebook\">\n  <i class=\"fa fa-facebook\"></i>\n  Connect with Facebook\n</a>\n<a ng-class=\"classes\" ng-click=\"OauthButtons.loginOauth(\'google\')\" class=\"btn btn-social btn-google\">\n  <i class=\"fa fa-google-plus\"></i>\n  Connect with Google+\n</a>\n<a ng-class=\"classes\" ng-click=\"OauthButtons.loginOauth(\'twitter\')\" class=\"btn btn-social btn-twitter\">\n  <i class=\"fa fa-twitter\"></i>\n  Connect with Twitter\n</a>\n");
$templateCache.put("app/account/login/login.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-sm-12\">\n      <h1>Login</h1>\n      <p>Accounts are reset on server restart from <code>server/config/seed.js</code>. Default account is <code>test@example.com</code> / <code>test</code></p>\n      <p>Admin account is <code>admin@example.com</code> / <code>admin</code></p>\n    </div>\n    <div class=\"col-sm-12\">\n      <form class=\"form\" name=\"form\" ng-submit=\"vm.login(form)\" novalidate>\n\n        <div class=\"form-group\">\n          <label>Email</label>\n\n          <input type=\"email\" name=\"email\" class=\"form-control\" ng-model=\"vm.user.email\" required>\n        </div>\n\n        <div class=\"form-group\">\n          <label>Password</label>\n\n          <input type=\"password\" name=\"password\" class=\"form-control\" ng-model=\"vm.user.password\" required>\n        </div>\n\n        <div class=\"form-group has-error\">\n          <p class=\"help-block\" ng-show=\"form.email.$error.required && form.password.$error.required && vm.submitted\">\n             Please enter your email and password.\n          </p>\n          <p class=\"help-block\" ng-show=\"form.email.$error.email && vm.submitted\">\n             Please enter a valid email.\n          </p>\n\n          <p class=\"help-block\">{{ vm.errors.other }}</p>\n        </div>\n\n        <div>\n          <button class=\"btn btn-inverse btn-lg btn-login\" type=\"submit\">\n            Login\n          </button>\n          <a class=\"btn btn-default btn-lg btn-register\" ui-sref=\"signup\">\n            Register\n          </a>\n        </div>\n\n        <hr/>\n        <div class=\"row\">\n          <div class=\"col-sm-4 col-md-3\">\n            <oauth-buttons classes=\"btn-block\"></oauth-buttons>\n          </div>\n        </div>\n      </form>\n    </div>\n  </div>\n  <hr>\n</div>\n");
$templateCache.put("app/account/settings/settings.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-sm-12\">\n      <h1>Change Password</h1>\n    </div>\n    <div class=\"col-sm-12\">\n      <form class=\"form\" name=\"form\" ng-submit=\"vm.changePassword(form)\" novalidate>\n\n        <div class=\"form-group\">\n          <label>Current Password</label>\n\n          <input type=\"password\" name=\"password\" class=\"form-control\" ng-model=\"vm.user.oldPassword\"\n                 mongoose-error/>\n          <p class=\"help-block\" ng-show=\"form.password.$error.mongoose\">\n              {{ vm.errors.other }}\n          </p>\n        </div>\n\n        <div class=\"form-group\">\n          <label>New Password</label>\n\n          <input type=\"password\" name=\"newPassword\" class=\"form-control\" ng-model=\"vm.user.newPassword\"\n                 ng-minlength=\"3\"\n                 required/>\n          <p class=\"help-block\"\n             ng-show=\"(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || vm.submitted)\">\n            Password must be at least 3 characters.\n          </p>\n        </div>\n\n        <div class=\"form-group\">\n          <label>Confirm New Password</label>\n\n          <input type=\"password\" name=\"confirmPassword\" class=\"form-control\" ng-model=\"vm.user.confirmPassword\"\n                 match=\"vm.user.newPassword\"\n                 ng-minlength=\"3\"\n                 required=\"\"/>\n          <p class=\"help-block\"\n             ng-show=\"form.confirmPassword.$error.match && vm.submitted\">\n            Passwords must match.\n          </p>\n\n        </div>\n\n        <p class=\"help-block\"> {{ vm.message }} </p>\n\n        <button class=\"btn btn-lg btn-primary\" type=\"submit\">Save changes</button>\n      </form>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("app/account/signup/signup.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-sm-12\">\n      <h1>Sign up</h1>\n    </div>\n    <div class=\"col-sm-12\">\n      <form class=\"form\" name=\"form\" ng-submit=\"vm.register(form)\" novalidate>\n\n        <div class=\"form-group\" ng-class=\"{ \'has-success\': form.name.$valid && vm.submitted,\n                                            \'has-error\': form.name.$invalid && vm.submitted }\">\n          <label>Name</label>\n\n          <input type=\"text\" name=\"name\" class=\"form-control\" ng-model=\"vm.user.name\"\n                 required/>\n          <p class=\"help-block\" ng-show=\"form.name.$error.required && vm.submitted\">\n            A name is required\n          </p>\n        </div>\n\n        <div class=\"form-group\" ng-class=\"{ \'has-success\': form.email.$valid && vm.submitted,\n                                            \'has-error\': form.email.$invalid && vm.submitted }\">\n          <label>Email</label>\n\n          <input type=\"email\" name=\"email\" class=\"form-control\" ng-model=\"vm.user.email\"\n                 required\n                 mongoose-error/>\n          <p class=\"help-block\" ng-show=\"form.email.$error.email && vm.submitted\">\n            Doesn\'t look like a valid email.\n          </p>\n          <p class=\"help-block\" ng-show=\"form.email.$error.required && vm.submitted\">\n            What\'s your email address?\n          </p>\n          <p class=\"help-block\" ng-show=\"form.email.$error.mongoose\">\n            {{ vm.errors.email }}\n          </p>\n        </div>\n\n        <div class=\"form-group\" ng-class=\"{ \'has-success\': form.password.$valid && vm.submitted,\n                                            \'has-error\': form.password.$invalid && vm.submitted }\">\n          <label>Password</label>\n\n          <input type=\"password\" name=\"password\" class=\"form-control\" ng-model=\"vm.user.password\"\n                 ng-minlength=\"3\"\n                 required\n                 mongoose-error/>\n          <p class=\"help-block\"\n             ng-show=\"(form.password.$error.minlength || form.password.$error.required) && vm.submitted\">\n            Password must be at least 3 characters.\n          </p>\n          <p class=\"help-block\" ng-show=\"form.password.$error.mongoose\">\n            {{ vm.errors.password }}\n          </p>\n        </div>\n\n        <div class=\"form-group\" ng-class=\"{ \'has-success\': form.confirmPassword.$valid && vm.submitted,\n                                            \'has-error\': form.confirmPassword.$invalid && vm.submitted }\">\n          <label>Confirm Password</label>\n          <input type=\"password\" name=\"confirmPassword\" class=\"form-control\" ng-model=\"vm.user.confirmPassword\"\n                 match=\"vm.user.password\"\n                 ng-minlength=\"3\" required/>\n          <p class=\"help-block\"\n             ng-show=\"form.confirmPassword.$error.match && vm.submitted\">\n            Passwords must match.\n          </p>\n        </div>\n\n        <div>\n          <button class=\"btn btn-inverse btn-lg btn-register\" type=\"submit\">\n            Sign up\n          </button>\n          <a class=\"btn btn-default btn-lg btn-login\" ui-sref=\"login\">\n            Login\n          </a>\n        </div>\n\n        <hr/>\n        <div class=\"row\">\n          <div class=\"col-sm-4 col-md-3\">\n            <oauth-buttons classes=\"btn-block\"></oauth-buttons>\n          </div>\n        </div>\n      </form>\n    </div>\n  </div>\n  <hr>\n</div>\n");}]);