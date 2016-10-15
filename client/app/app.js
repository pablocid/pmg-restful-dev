'use strict';

angular.module('pmgRestfulApiApp', ['pmgRestfulApiApp.auth', 'pmgRestfulApiApp.admin', 'pmgRestfulApiApp.constants', 'ngCookies', 'ngResource', 'ngSanitize', 'btford.socket-io', 'ui.router', 'ui.bootstrap', 'validation.match', 'ngAnimate', 'ngMaterial']).config(function ($urlRouterProvider, $locationProvider) {
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
    //templateUrl: 'app/account/login/login.html',
    template: '<login></login>',
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

"use strict";

(function (angular, undefined) {
	angular.module("pmgRestfulApiApp.constants", []).constant("appConfig", {
		"userRoles": ["guest", "user", "admin"]
	});
})(angular);
//# sourceMappingURL=app.constant.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginController = function () {
  function LoginController(Auth, $state) {
    _classCallCheck(this, LoginController);

    this.user = {
      email: '',
      password: ''
    };
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

angular.module('pmgRestfulApiApp').component('login', {
  templateUrl: 'app/components/login/login.html',
  bindings: { message: '<' },
  controller: LoginController
});
//# sourceMappingURL=login.component.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mainNavBarController = function () {
  function mainNavBarController($mdSidenav) {
    _classCallCheck(this, mainNavBarController);

    this.sidenav = {
      title: "VineTracker menu"
    };
    this.toggleLeft = function () {
      console.log("HOLI");
      $mdSidenav('left').toggle();
    };
    this.menuList = [{ label: 'login', link: 'state' }, { label: 'logout', link: 'state' }, { label: 'admin area', link: 'state' }];
    this.cardList = [{ title: 'Consultar', subTitle: 'Consultar información de plantas y evaluaciones', imgSrc: 'http://lh6.googleusercontent.com/-zhqjMSQCep8/AAAAAAAAAAI/AAAAAAAAJEU/IEe3YTD2kE0/s60-c/photo.jpg', btnLabel: 'ir' }, { title: 'Editar', subTitle: 'Crea o modifica información de plantas y evaluaciones', imgSrc: 'http://lh6.googleusercontent.com/-zhqjMSQCep8/AAAAAAAAAAI/AAAAAAAAJEU/IEe3YTD2kE0/s60-c/photo.jpg', btnLabel: 'ir' }, { title: 'Admin', subTitle: 'Ingresar al área de administración de la aplicación', imgSrc: 'http://lh6.googleusercontent.com/-zhqjMSQCep8/AAAAAAAAAAI/AAAAAAAAJEU/IEe3YTD2kE0/s60-c/photo.jpg', btnLabel: 'ir' }];
  }

  _createClass(mainNavBarController, [{
    key: "menuListClick",
    value: function menuListClick(index) {
      console.log(this.menuList[index].label);
    }
  }, {
    key: "cardListClick",
    value: function cardListClick(index) {
      console.log(this.cardList[index].title);
    }
  }]);

  return mainNavBarController;
}();

angular.module('pmgRestfulApiApp').component('mainBar', {
  templateUrl: 'app/components/mainNavBar/mainNavBar.html',
  bindings: { message: '<', theme: '<' },
  controller: mainNavBarController
});
//# sourceMappingURL=mainNavBar.component.js.map

'use strict';

angular.module('pmgRestfulApiApp').directive('formAic', function ($compile, $log, SchemaObj) {
  return {
    templateUrl: 'app/directives/formAic/formAic.html',
    restrict: 'EA',
    scope: {
      reg: "=",
      saveCb: '&'
    },
    link: function link(scope, element, attrs) {
      scope.reg.then(function (reg) {
        scope.record = new SchemaObj(reg);
        var theme = element.clone();
        element.empty();
        var form = theme.find("form").clone().empty();

        var inputId = theme.find("#_id").clone();
        var inputType = theme.find("#type").clone();
        inputType.find("select").attr("disabled", "true");
        var inputName = theme.find("#iname").clone();

        form.append(inputId);
        form.append(inputType);
        form.append(inputName);

        var attrForm = theme.find("#attributes").clone().empty();
        attrForm.append('<h3>Attributes</h3>');

        // en el caso del schema los attr fijos son name:string, attributes:list , keys: listOfObj
        var attrName = theme.find("#attrName").clone();
        attrForm.append(attrName);

        var attrDesc = theme.find("#description").clone();
        attrForm.append(attrDesc);

        var attrAttribute = theme.find("#attrAttribute").clone();
        attrForm.append(attrAttribute);

        var attrInput = theme.find("#attrInput").clone();
        attrForm.append(attrInput);

        form.append(attrForm);

        /**************************************** */

        var addAttrForm = theme.find("#addAttrForm").clone().empty();
        form.append(addAttrForm);

        addAttrForm.append('<h3>Attributes adicionales</h3>');
        /***++++ insertar Attributes adicionales */
        function getInput(id, dt) {
          var view;
          //console.log(dt);
          switch (dt) {
            case 'number':
              view = theme.find("#numberTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetNumber('" + id + "','" + dt + "')");
              break;
            case 'string':
              view = theme.find("#stringTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetString('" + id + "','" + dt + "')");
              break;
            case 'boolean':
              view = theme.find("#booleanTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetBoolean('" + id + "','" + dt + "')");
              break;
            case 'date':
              view = theme.find("#dateTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetDate('" + id + "','" + dt + "')");
              //view.find('input').attr("value",new Date())
              break;
            case 'reference':
              view = theme.find("#stringTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetString('" + id + "','" + dt + "')");
              break;
          }
          var eraseBtn = angular.element('<button type="button">Borrar Attributo </button>');
          eraseBtn.attr("attrId", id);
          view.append(eraseBtn);
          eraseBtn.on('click', function (args) {
            var ide = eraseBtn.attr("attrId");
            console.log("/*************************************************** " + ide);
            scope.record.removeKeyAttr(ide);
            scope.record.removeAttr(ide);
            view.remove();
            $compile(form)(scope);
          });
          return view;
        }

        var keys = scope.record.getAttrById("keys", "listOfObj");
        if (keys && keys.length) {
          keys.forEach(function (item) {
            addAttrForm.append(getInput(item.id, item.string));
          });
        }

        /***************************************** */

        var addAttrSelector = theme.find("#addAttrSelector").clone();
        var btnAddAttr = addAttrSelector.find("#btnAddAttr");

        btnAddAttr.on('click', function (args) {
          var attrId = addAttrSelector.find("input").val();
          var attrDt = addAttrSelector.find("select").val();

          if (attrId) {
            var view = getInput(attrId, attrDt);
            $compile(view)(scope);
            //console.log(attrId +" -- "+attrDt)
            addAttrForm.append(view);
            //agregar a lista de keys
            if (!scope.record.getAttrById("keys", "listOfObj")) {
              scope.record.setAttrById("keys", "listOfObj", []);
            }
            var array = scope.record.getAttrById("keys", "listOfObj");
            array.push({ id: attrId, string: attrDt });
            scope.record.setAttrById("keys", "listOfObj", array);
            addAttrSelector.find("input").val('');
          }
        });
        form.append(addAttrSelector);

        /*********************save block******************** */
        var saveBlock = theme.find('#saveBlock').clone();
        saveBlock.find("button").on('click', function () {
          scope.saveCb({ record: scope.record });
        });
        form.append(saveBlock);

        /***************************************** */

        form.append("{{record}}");
        $compile(form)(scope);
        element.append("<h1>Formulario AttrInputConf</h1>");
        element.append(form);
      });
    }
  };
});
//# sourceMappingURL=formAic.directive.js.map

'use strict';

angular.module('pmgRestfulApiApp').directive('formAttr', function ($compile, $log, SchemaObj) {
  return {
    templateUrl: 'app/directives/formAttr/formAttr.html',
    restrict: 'EA',
    scope: {
      reg: '=',
      saveCb: '&'
    },
    link: function link(scope, element, attrs) {
      scope.reg.then(function (reg) {
        scope.record = new SchemaObj(reg);
        var theme = element.clone();
        element.empty();
        var form = theme.find("form").clone().empty();

        var inputId = theme.find("#_id").clone();
        var inputType = theme.find("#type").clone();
        inputType.find("select").attr("disabled", "true");
        var inputName = theme.find("#iname").clone();

        form.append(inputId);
        form.append(inputType);
        form.append(inputName);

        var attrForm = theme.find("#attributes").clone().empty();
        attrForm.append('<h3>Attributes</h3>');

        var attrName = theme.find("#attrName").clone();
        attrForm.append(attrName);

        var attrDesc = theme.find("#description").clone();
        attrForm.append(attrDesc);

        var attrInput = theme.find("#attrInput").clone();
        attrForm.append(attrInput);

        form.append(attrForm);

        /**************************************** */

        var addAttrForm = theme.find("#addAttrForm").clone().empty();
        form.append(addAttrForm);

        addAttrForm.append('<h3>Attributes adicionales</h3>');
        /***++++ insertar Attributes adicionales */
        function getInput(id, dt) {
          var view;
          //console.log(dt);
          switch (dt) {
            case 'number':
              view = theme.find("#numberTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetNumber('" + id + "','" + dt + "')");
              break;
            case 'string':
              view = theme.find("#stringTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetString('" + id + "','" + dt + "')");
              break;
            case 'boolean':
              view = theme.find("#booleanTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetBoolean('" + id + "','" + dt + "')");
              break;
            case 'date':
              view = theme.find("#dateTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetDate('" + id + "','" + dt + "')");
              //view.find('input').attr("value",new Date())
              break;
            case 'reference':
              view = theme.find("#stringTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetString('" + id + "','" + dt + "')");
              break;
            case 'list':
              view = theme.find("#listTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetOptionList('" + id + "','" + dt + "')");
              break;
            case 'listOfObj':
              view = theme.find("#listTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetOptionListOfObj('" + id + "','" + dt + "')");
              break;
          }
          var eraseBtn = angular.element('<button type="button" class="btn btn-danger">Borrar Attributo </button>');
          eraseBtn.attr("attrId", id);
          view.append(eraseBtn);
          eraseBtn.on('click', function (args) {
            var ide = eraseBtn.attr("attrId");
            console.log("/*************************************************** " + ide);
            scope.record.removeKeyAttr(ide);
            scope.record.removeAttr(ide);
            view.remove();
            $compile(form)(scope);
          });
          return view;
        }

        var keys = scope.record.getAttrById("keys", "listOfObj");
        if (keys && keys.length) {
          keys.forEach(function (item) {
            addAttrForm.append(getInput(item.id, item.string));
          });
        }

        /***************************************** */

        var addAttrSelector = theme.find("#addAttrSelector").clone();
        var btnAddAttr = addAttrSelector.find("#btnAddAttr");

        btnAddAttr.on('click', function (args) {
          var attrId = addAttrSelector.find("input").val();
          var attrDt = addAttrSelector.find("select").val();

          if (attrId) {
            var view = getInput(attrId, attrDt);
            $compile(view)(scope);
            //console.log(attrId +" -- "+attrDt)
            addAttrForm.append(view);
            //agregar a lista de keys
            if (!scope.record.getAttrById("keys", "listOfObj")) {
              scope.record.setAttrById("keys", "listOfObj", []);
            }
            var array = scope.record.getAttrById("keys", "listOfObj");
            array.push({ id: attrId, string: attrDt });
            scope.record.setAttrById("keys", "listOfObj", array);
            addAttrSelector.find("input").val('');
          }
        });
        form.append(addAttrSelector);

        /*********************save block******************** */
        var saveBlock = theme.find('#saveBlock').clone();
        saveBlock.find("button").on('click', function () {
          scope.saveCb({ record: scope.record });
        });
        form.append(saveBlock);

        /***************************************** */

        form.append("{{record}}");
        $compile(form)(scope);
        element.append("<h1>Formulario Attributo</h1>");
        element.append(form);
      });
    }
  };
});
//# sourceMappingURL=formAttr.directive.js.map

'use strict';

angular.module('pmgRestfulApiApp').directive('formBuilder', function ($compile, $log, SchemaObj) {
  return {
    templateUrl: 'app/directives/formBuilder/formBuilder.html',
    restrict: 'EA',
    scope: {
      reg: '=',
      saveCb: '&'
    },
    link: function link(scope, element, attrs) {

      scope.reg.then(function (reg) {
        scope.record = new SchemaObj(reg);
        var theme = element.clone();
        element.empty();
        var form = theme.find("form").clone().empty();

        var inputId = theme.find("#_id").clone();
        var inputType = theme.find("#type").clone();
        var inputName = theme.find("#iname").clone();

        form.append(inputId);
        form.append(inputType);
        form.append(inputName);

        var attrForm = theme.find("#attributes").clone().empty();
        attrForm.append('<h3>Attributes</h3>');
        var blockAttr = theme.find("#blockAttr").clone();

        // en el caso del schema los attr fijos son name:string, attributes:list , keys: listOfObj
        var attrName = theme.find("#attrName").clone();
        attrForm.append(attrName);

        var attrDesc = theme.find("#description").clone();
        attrForm.append(attrDesc);

        var attrAttributes = theme.find("#attrAttributes").clone();
        attrForm.append(attrAttributes);

        form.append(attrForm);

        var addAttrForm = theme.find("#addAttrForm").clone().empty();
        form.append(addAttrForm);

        addAttrForm.append('<h3>Attributes adicionales</h3>');
        /***++++ insertar Attributes adicionales */
        function getInput(id, dt) {
          var view;
          //console.log(dt);
          switch (dt) {
            case 'number':
              view = theme.find("#numberTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetNumber('" + id + "','" + dt + "')");
              break;
            case 'string':
              view = theme.find("#stringTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetString('" + id + "','" + dt + "')");
              break;
            case 'boolean':
              view = theme.find("#booleanTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetBoolean('" + id + "','" + dt + "')");
              break;
            case 'date':
              view = theme.find("#dateTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetDate('" + id + "','" + dt + "')");
              //view.find('input').attr("value",new Date())
              break;
            case 'reference':
              view = theme.find("#stringTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetString('" + id + "','" + dt + "')");
              break;
          }
          var eraseBtn = angular.element('<button type="button">Borrar Attributo </button>');
          eraseBtn.attr("attrId", id);
          view.append(eraseBtn);
          eraseBtn.on('click', function (args) {
            var ide = eraseBtn.attr("attrId");
            console.log("/*************************************************** " + ide);
            scope.record.removeKeyAttr(ide);
            scope.record.removeAttr(ide);
            view.remove();
            $compile(form)(scope);
          });
          return view;
        }

        var keys = scope.record.getAttrById("keys", "listOfObj");
        if (keys && keys.length) {
          keys.forEach(function (item) {
            addAttrForm.append(getInput(item.id, item.string));
          });
        }

        /***************************************** */

        var addAttrSelector = theme.find("#addAttrSelector").clone();
        var btnAddAttr = addAttrSelector.find("#btnAddAttr");

        btnAddAttr.on('click', function (args) {
          var attrId = addAttrSelector.find("input").val();
          var attrDt = addAttrSelector.find("select").val();

          if (attrId) {
            var view = getInput(attrId, attrDt);
            $compile(view)(scope);
            //console.log(attrId +" -- "+attrDt)
            addAttrForm.append(view);
            //agregar a lista de keys
            if (!scope.record.getAttrById("keys", "listOfObj")) {
              scope.record.setAttrById("keys", "listOfObj", []);
            }
            var array = scope.record.getAttrById("keys", "listOfObj");
            array.push({ id: attrId, string: attrDt });
            scope.record.setAttrById("keys", "listOfObj", array);
            addAttrSelector.find("input").val('');
          }
        });

        form.append(addAttrSelector);

        /*********************save block******************** */

        var saveBlock = theme.find('#saveBlock').clone();
        saveBlock.find("button").on('click', function () {
          scope.saveCb({ record: scope.record });
        });
        form.append(saveBlock);

        /***************************************** */

        form.append("{{record}}");
        element.append(form);

        scope.find = function (array, key, value, target) {
          var self = this;
          if (!Array.isArray(array)) {
            return null;
          }

          var index = array.map(function (x) {
            return x[key];
          }).indexOf(value);

          if (index !== -1) {
            if (target === undefined) {
              return array[index];
            } else {
              return array[index][target];
            }
          } else {
            return null;
          }
        };
        $compile(form)(scope);
        var DefaultList = [{ id: "name", string: "string" }, { id: "attribute", string: "reference" }, { id: "keys", string: "listOfObj" }];

        var sdf = angular.element('\n            <h3>Lista de attributos compatibles</h3>\n              <ul>\n                  <li ng-repeat="a in find(reg.attributes,\'id\',\'keys\',\'listOfObj\')">id:{{a.id}} - dataType: {{a.string}}</li>\n              </ul>\n\n              <form novalidate name="myForm" class="container-fluid">\n                <div class="form-group has-feedback">\n                  <label for="">_id</label>\n                  <input type="text" ng-model="reg._id"  class="form-control" disabled>\n                </div>\n                <div class="form-group has-feedback">\n                  <label for="">type</label>\n                  <input type="text" ng-model="reg.type"  class="form-control" disabled>\n                </div>\n                <div id="attributes" class="well">\n                  <h3>Attributes</h3>\n                  <div class="form-group has-feedback" ng-repeat="attr in reg.attributes">\n                      <label for="">id: {{attr.id}}</label>\n                      <input type="text" ng-model="attr.id"  class="form-control" >\n                  </div>\n                </div>\n                <button id="btnAddAttr"> {{aa}}</button>\n              </form>\n          ');

        var findDtAttr = function findDtAttr(keys) {
          return function (attrId) {
            var index = keys.map(function (x) {
              return x.id;
            }).indexOf(attrId);
            if (index === -1) {
              return 0;
            }
            return keys[index].string;
          };
        };

        var attributes = element.find("#attributes");

        //attributes.append("<div>HOLA</div>")

      }); //end Then
    }
  };
});
//# sourceMappingURL=formBuilder.directive.js.map

'use strict';

angular.module('pmgRestfulApiApp').directive('formInput', function ($compile, $log, SchemaObj) {
  return {
    templateUrl: 'app/directives/formInput/formInput.html',
    restrict: 'EA',
    scope: {
      reg: '=',
      saveCb: '&'
    },
    link: function link(scope, element, attrs) {
      console.log("formInput");
      scope.dataTypes = ['string', 'number', 'boolean', 'date', 'reference', 'list', 'listOfObj'];
      scope.reg.then(function (reg) {
        scope.record = new SchemaObj(reg);
        var theme = element.clone();
        element.empty();
        var form = theme.find("form").clone().empty();

        var inputId = theme.find("#_id").clone();
        var inputType = theme.find("#type").clone();
        inputType.find("select").attr("disabled", "true");
        var inputName = theme.find("#iname").clone();

        form.append(inputId);
        form.append(inputType);
        form.append(inputName);

        var attrForm = theme.find("#attributes").clone().empty();
        attrForm.append('<h3>Attributes</h3>');
        var blockAttr = theme.find("#blockAttr").clone();

        // en el caso del schema los attr fijos son name:string, attributes:list , keys: listOfObj
        var attrName = theme.find("#attrName").clone();
        attrForm.append(attrName);

        var attrDesc = theme.find("#description").clone();
        attrForm.append(attrDesc);

        var attrDatatype = theme.find("#attrDatatype").clone();
        attrForm.append(attrDatatype);

        form.append(attrForm);

        /************************ attrConfForm *************************/
        var attrConfForm = theme.find("#addAttrForm").clone().empty();
        form.append(attrConfForm);
        attrConfForm.append('<h3>Attributes Configuration: data and type declaration</h3>');

        var blockACKtheme = theme.find("#listOfObj").clone();
        attrConfForm.append(blockACKtheme);
        var ackTable = blockACKtheme.find("table");
        blockACKtheme.append(ackTable);

        var attrConfKeys = scope.record.getAttrById("attrConf", "listOfObj");
        if (attrConfKeys && attrConfKeys.length) {
          attrConfKeys.forEach(function (x) {
            var tr = angular.element('<tr></tr');
            tr.append("<td>" + x.id + "</td>");
            tr.append("<td>" + x.string + "</td>");
            tr.append('<td><button type="button" class="btn btn-sm btn-danger">remove</button></td>');
            tr.attr("attrId", x.id);
            tr.find("button").on('click', function () {
              var id = tr.attr("attrId");
              tr.remove();
              $compile(blockACKtheme)(scope);
            });
            ackTable.append(tr);
          });
        }

        var ackSelector = theme.find("#addAttrSelector").clone();
        blockACKtheme.append(ackSelector);
        var ackAdd = ackSelector.find("#btnAddAttr");

        ackAdd.on('click', function (args) {
          var attrId = ackSelector.find("input").val();
          var attrDt = ackSelector.find("select").val();

          if (attrId && scope.record.addAttrLOO("attrConf", attrId, attrDt)) {
            var tr = angular.element('<tr></tr');
            tr.append("<td>" + attrId + "</td>");
            tr.append("<td>" + attrDt + "</td>");
            tr.append('<td><button type="button" class="btn btn-sm btn-danger">remove</button></td>');
            tr.attr("attrId", attrId);
            tr.find("button").on('click', function () {
              var id = tr.attr("attrId");
              scope.record.removeAttrLOO("attrConf", id);
              tr.remove();
              ackSelector.find("input").val('');
              $compile(form)(scope);
            });
            ackTable.append(tr);
          }
          $compile(form)(scope);
        });

        /************************ attrInputConfForm *************************/

        var attrInputConfForm = theme.find("#addAttrForm").clone().empty();
        form.append(attrInputConfForm);
        attrInputConfForm.append('<h3>Attributes Inputs Configuration: data and type declaration</h3>');

        var attrInpuTheme = theme.find("#listOfObj").clone();
        attrInputConfForm.append(attrInpuTheme);
        var aicTable = attrInpuTheme.find("table");
        attrInpuTheme.append(aicTable);

        var attrConfKeys = scope.record.getAttrById("attrInputConf", "listOfObj");
        if (attrConfKeys) {
          attrConfKeys.forEach(function (x) {
            var tr = angular.element('<tr></tr');
            tr.append("<td>" + x.id + "</td>");
            tr.append("<td>" + x.string + "</td>");
            tr.append('<td><button type="button" class="btn btn-sm btn-danger">remove</button></td>');
            tr.attr("attrId", x.id);
            tr.find("button").on('click', function () {
              var id = tr.attr("attrId");
              tr.remove();
              $compile(attrInpuTheme)(scope);
            });
            aicTable.append(tr);
          });
        }

        var aicSelector = theme.find("#addAttrSelector").clone();
        attrInpuTheme.append(aicSelector);
        var ackAdd = aicSelector.find("#btnAddAttr");

        ackAdd.on('click', function (args) {
          var attrId = aicSelector.find("input").val();
          var attrDt = aicSelector.find("select").val();

          if (attrId && scope.record.addAttrLOO("attrInputConf", attrId, attrDt)) {
            var tr = angular.element('<tr></tr');
            tr.append("<td>" + attrId + "</td>");
            tr.append("<td>" + attrDt + "</td>");
            tr.append('<td><button type="button" class="btn btn-sm btn-danger">remove</button></td>');
            tr.attr("attrId", attrId);
            tr.find("button").on('click', function () {
              var id = tr.attr("attrId");
              console.log("Removing attrInputConf => ID: " + id + " -- ");
              scope.record.removeAttrLOO("attrInputConf", id);
              tr.remove();
              aicSelector.find("input").val('');
              $compile(form)(scope);
            });
            aicTable.append(tr);
          }
          $compile(form)(scope);
        });

        //attrInputConfForm.append(attrInpuTheme);


        /**************************************** */

        /************************ schmAttrInputConfForm *************************/

        var schmAttrInputConfForm = theme.find("#addAttrForm").clone().empty();
        form.append(schmAttrInputConfForm);
        schmAttrInputConfForm.append('<h3>Schema Attributes Inputs Configuration: data and type declaration</h3>');

        var schmAttrInpuTheme = theme.find("#listOfObj").clone();
        schmAttrInputConfForm.append(schmAttrInpuTheme);
        var saicTable = schmAttrInpuTheme.find("table");
        schmAttrInpuTheme.append(saicTable);

        var schmAttrConfKeys = scope.record.getAttrById("schmAttrInputConf", "listOfObj");
        if (schmAttrConfKeys && schmAttrConfKeys.length) {
          schmAttrConfKeys.forEach(function (x) {
            var tr = angular.element('<tr></tr');
            tr.append("<td>" + x.id + "</td>");
            tr.append("<td>" + x.string + "</td>");
            tr.append('<td><button type="button" class="btn btn-sm btn-danger">remove</button></td>');
            tr.attr("attrId", x.id);
            tr.find("button").on('click', function () {
              var id = tr.attr("attrId");
              tr.remove();
              $compile(schmAttrInpuTheme)(scope);
            });
            saicTable.append(tr);
          });
        }

        var saicSelector = theme.find("#addAttrSelector").clone();
        schmAttrInpuTheme.append(saicSelector);
        var ackAdd = saicSelector.find("#btnAddAttr");

        ackAdd.on('click', function (args) {
          var attrId = saicSelector.find("input").val();
          var attrDt = saicSelector.find("select").val();

          if (attrId && scope.record.addAttrLOO("schmAttrInputConf", attrId, attrDt)) {
            var tr = angular.element('<tr></tr');
            tr.append("<td>" + attrId + "</td>");
            tr.append("<td>" + attrDt + "</td>");
            tr.append('<td><button type="button" class="btn btn-sm btn-danger">remove</button></td>');
            tr.attr("attrId", attrId);
            tr.find("button").on('click', function () {
              var id = tr.attr("attrId");
              console.log("Removing schmAttrInputConf => ID: " + id + " -- ");
              scope.record.removeAttrLOO("schmAttrInputConf", id);
              tr.remove();
              saicSelector.find("input").val('');
              $compile(form)(scope);
            });
            saicTable.append(tr);
          }
          $compile(form)(scope);
        });

        /**************************************** */

        /**************************************** */

        var addAttrForm = theme.find("#addAttrForm").clone().empty();
        //form.append(addAttrForm);

        addAttrForm.append('<h3>Attributes adicionales</h3>');
        /***++++ insertar Attributes adicionales */
        function getInput(id, dt) {
          var view;
          //console.log(dt);
          switch (dt) {
            case 'number':
              view = theme.find("#numberTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetNumber('" + id + "','" + dt + "')");
              break;
            case 'string':
              view = theme.find("#stringTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetString('" + id + "','" + dt + "')");
              break;
            case 'boolean':
              view = theme.find("#booleanTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetBoolean('" + id + "','" + dt + "')");
              break;
            case 'date':
              view = theme.find("#dateTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetDate('" + id + "','" + dt + "')");
              //view.find('input').attr("value",new Date())
              break;
            case 'reference':
              view = theme.find("#stringTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetString('" + id + "','" + dt + "')");
              break;
          }
          var eraseBtn = angular.element('<button type="button">Borrar Attributo </button>');
          eraseBtn.attr("attrId", id);
          view.append(eraseBtn);
          eraseBtn.on('click', function (args) {
            var ide = eraseBtn.attr("attrId");
            console.log("/*************************************************** " + ide);
            scope.record.removeKeyAttr(ide);
            scope.record.removeAttr(ide);
            view.remove();
            $compile(form)(scope);
          });
          return view;
        }

        var keys = scope.record.getAttrById("keys", "listOfObj");
        if (keys && keys.length) {
          keys.forEach(function (item) {
            addAttrForm.append(getInput(item.id, item.string));
          });
        }

        /***************************************** */

        var addAttrSelector = theme.find("#addAttrSelector").clone();
        var btnAddAttr = addAttrSelector.find("#btnAddAttr");

        btnAddAttr.on('click', function (args) {
          var attrId = addAttrSelector.find("input").val();
          var attrDt = addAttrSelector.find("select").val();

          if (attrId) {
            var view = getInput(attrId, attrDt);
            $compile(view)(scope);
            //console.log(attrId +" -- "+attrDt)
            addAttrForm.append(view);
            //agregar a lista de keys
            if (!scope.record.getAttrById("keys", "listOfObj")) {
              scope.record.setAttrById("keys", "listOfObj", []);
            }
            var array = scope.record.getAttrById("keys", "listOfObj");
            array.push({ id: attrId, string: attrDt });
            scope.record.setAttrById("keys", "listOfObj", array);
            addAttrSelector.find("input").val('');
          }
        });

        //form.append(addAttrSelector);

        /*********************save block******************** */
        var saveBlock = theme.find('#saveBlock').clone();
        saveBlock.find("button").on('click', function () {
          scope.saveCb({ record: scope.record });
        });
        form.append(saveBlock);

        /***************************************** */

        form.append("{{record}}");
        element.append(form);

        $compile(form)(scope);
      }); //end Then
    }
  };
});
//# sourceMappingURL=formInput.directive.js.map

'use strict';

angular.module('pmgRestfulApiApp').directive('formSaic', function ($compile, $log, SchemaObj) {
  return {
    templateUrl: 'app/directives/formSaic/formSaic.html',
    restrict: 'EA',
    scope: {
      reg: "=",
      saveCb: '&'
    },
    link: function link(scope, element, attrs) {
      scope.reg.then(function (reg) {
        scope.record = new SchemaObj(reg);
        var theme = element.clone();
        element.empty();
        var form = theme.find("form").clone().empty();

        var inputId = theme.find("#_id").clone();
        var inputType = theme.find("#type").clone();
        inputType.find("select").attr("disabled", "true");
        var inputName = theme.find("#iname").clone();

        form.append(inputId);
        form.append(inputType);
        form.append(inputName);

        var attrForm = theme.find("#attributes").clone().empty();
        attrForm.append('<h3>Attributes</h3>');

        // en el caso del schema los attr fijos son name:string, attributes:list , keys: listOfObj
        var attrName = theme.find("#attrName").clone();
        attrForm.append(attrName);

        var attrDesc = theme.find("#description").clone();
        attrForm.append(attrDesc);

        var attrSchema = theme.find("#attrSchema").clone();
        attrForm.append(attrSchema);

        var attrAttribute = theme.find("#attrAttribute").clone();
        attrForm.append(attrAttribute);

        var attrInput = theme.find("#attrInput").clone();
        attrForm.append(attrInput);

        form.append(attrForm);

        /**************************************** */

        var addAttrForm = theme.find("#addAttrForm").clone().empty();
        form.append(addAttrForm);

        addAttrForm.append('<h3>Attributes adicionales</h3>');
        /***++++ insertar Attributes adicionales */
        function getInput(id, dt) {
          var view;
          //console.log(dt);
          switch (dt) {
            case 'number':
              view = theme.find("#numberTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetNumber('" + id + "','" + dt + "')");
              break;
            case 'string':
              view = theme.find("#stringTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetString('" + id + "','" + dt + "')");
              break;
            case 'boolean':
              view = theme.find("#booleanTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetBoolean('" + id + "','" + dt + "')");
              break;
            case 'date':
              view = theme.find("#dateTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetDate('" + id + "','" + dt + "')");
              //view.find('input').attr("value",new Date())
              break;
            case 'reference':
              view = theme.find("#stringTheme").clone();
              view.find("label").text(id);
              view.find('input').attr("ng-model", "record.getsetString('" + id + "','" + dt + "')");
              break;
          }
          var eraseBtn = angular.element('<button type="button">Borrar Attributo </button>');
          eraseBtn.attr("attrId", id);
          view.append(eraseBtn);
          eraseBtn.on('click', function (args) {
            var ide = eraseBtn.attr("attrId");
            console.log("/*************************************************** " + ide);
            scope.record.removeKeyAttr(ide);
            scope.record.removeAttr(ide);
            view.remove();
            $compile(form)(scope);
          });
          return view;
        }

        var keys = scope.record.getAttrById("keys", "listOfObj");
        if (keys && keys.length) {
          keys.forEach(function (item) {
            addAttrForm.append(getInput(item.id, item.string));
          });
        }

        /***************************************** */

        var addAttrSelector = theme.find("#addAttrSelector").clone();
        var btnAddAttr = addAttrSelector.find("#btnAddAttr");

        btnAddAttr.on('click', function (args) {
          var attrId = addAttrSelector.find("input").val();
          var attrDt = addAttrSelector.find("select").val();

          if (attrId) {
            var view = getInput(attrId, attrDt);
            $compile(view)(scope);
            //console.log(attrId +" -- "+attrDt)
            addAttrForm.append(view);
            //agregar a lista de keys
            if (!scope.record.getAttrById("keys", "listOfObj")) {
              scope.record.setAttrById("keys", "listOfObj", []);
            }
            var array = scope.record.getAttrById("keys", "listOfObj");
            array.push({ id: attrId, string: attrDt });
            scope.record.setAttrById("keys", "listOfObj", array);
            addAttrSelector.find("input").val('');
          }
        });
        form.append(addAttrSelector);

        /*********************save block******************** */
        var saveBlock = theme.find('#saveBlock').clone();
        saveBlock.find("button").on('click', function () {
          scope.saveCb({ record: scope.record });
        });
        form.append(saveBlock);

        /***************************************** */

        form.append("{{record}}");
        $compile(form)(scope);
        element.append("<h1>Formulario SchemaAttrInputConf</h1>");
        element.append(form);
      });
    }
  };
});
//# sourceMappingURL=formSaic.directive.js.map

'use strict';

function SchemaObjService() {
  function SchemaObj(r) {
    angular.extend(this, r);
  }
  SchemaObj.prototype.find = function (array, key, value, target) {
    var self = this;
    if (!Array.isArray(array)) {
      return null;
    }

    var index = array.map(function (x) {
      return x[key];
    }).indexOf(value);

    if (index !== -1) {
      if (target === undefined) {
        return array[index];
      } else {
        return array[index][target];
      }
    } else {
      return null;
    }
  };
  SchemaObj.prototype.normalize = function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
        to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
        mapping = {};

    for (var i = 0, j = from.length; i < j; i++) {
      mapping[from.charAt(i)] = to.charAt(i);
    }return function (str) {
      if (!str) {
        return;
      }
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c]);else ret.push(c);
      }
      return ret.join('').replace(/[^-A-Za-z0-9]+/g, '_').toLowerCase();
    };
  }();
  SchemaObj.prototype.getAttrById = function (id, key) {
    if (!this.attributes) {
      return;
    }

    var index = this.attributes.map(function (a) {
      return a.id;
    }).indexOf(id);
    if (index !== -1) {
      if (key) {
        return this.attributes[index][key];
      } else {
        return this.attributes[index];
      }
    } else {
      return;
    }
  };

  SchemaObj.prototype.setAttrById = function (id, key, content) {
    if (!this.attributes) {
      this.attributes = [];
    }
    var index = this.attributes.map(function (a) {
      return a.id;
    }).indexOf(id);
    //console.log(index);
    if (index !== -1) {
      this.attributes[index][key] = content;
      //return this.attributes[index];
    } else {
      var obj = {};
      obj.id = id;
      obj[key] = content;
      this.attributes.push(obj);
      //var length =
      //return this.attributes[length-1];
    }
    return content;
  };

  SchemaObj.prototype.addKeyAttr = function (obj) {
    if (!obj.id) {
      console.log("El objeto no tiene la propiedad id");
      return null;
    }
    var self = this;
    if (!this.attributes) {
      this.attributes = [];
    }
    var index = this.attributes.map(function (a) {
      return a.id;
    }).indexOf("keys");
    //console.log(index);
    if (index !== -1) {
      if (Array.isArray(self.attributes[index]["listOfObj"])) {
        var i = self.attributes[index]["listOfObj"].map(function (x) {
          return x.id;
        }).indexOf(obj.id);
        if (i === -1) {
          self.attributes[index]["listOfObj"].push(obj);
        } else {
          console.log("el attributo ingresado ya esta registrado");
          return null;
        }
      } else {
        self.attributes[index]["listOfObj"] = [obj];
      }
    } else {
      var obj = {};
      obj.id = "keys";
      obj["listOfObj"] = [obj];
      this.attributes.push(obj);
    }
  };
  SchemaObj.prototype.removeKeyAttr = function (id) {
    if (!id) {
      console.log("El objeto no tiene la propiedad id");
      return null;
    }
    var self = this;
    if (!this.attributes) {
      this.attributes = [];
    }
    var index = this.attributes.map(function (a) {
      return a.id;
    }).indexOf("keys");

    if (index !== -1) {
      if (Array.isArray(self.attributes[index]["listOfObj"]) && self.attributes[index]["listOfObj"].length) {

        var i = self.attributes[index]["listOfObj"].map(function (x) {
          return x.id;
        }).indexOf(id);

        if (i !== -1) {
          console.log(index + " ------------------ " + i);
          console.log(self.attributes[index]["listOfObj"]);
          self.attributes[index]["listOfObj"].splice(i, 1);
        }
      }
    }
  };
  SchemaObj.prototype.addAttrLOO = function (id, key, value) {
    if (!id) {
      console.log("El objeto no tiene la propiedad id");
      return null;
    }
    var self = this;
    if (!this.attributes) {
      this.attributes = [];
    }
    var index = this.attributes.map(function (a) {
      return a.id;
    }).indexOf(id);

    if (index !== -1) {
      if (Array.isArray(self.attributes[index]["listOfObj"])) {
        var i = self.attributes[index]["listOfObj"].map(function (x) {
          return x.id;
        }).indexOf(key);
        if (i === -1) {
          self.attributes[index]["listOfObj"].push({ id: key, string: value });
        } else {
          console.log("el attributo ingresado ya esta registrado");
          return null;
        }
      } else {
        self.attributes[index]["listOfObj"] = [obj];
      }
    } else {
      this.attributes.push({ id: key, string: value });
    }
    return true;
  };
  SchemaObj.prototype.removeAttrLOO = function (id, key) {
    if (!id) {
      console.log("El objeto no tiene la propiedad id");
      return null;
    }
    var self = this;
    if (!this.attributes) {
      this.attributes = [];
    }
    var index = this.attributes.map(function (a) {
      return a.id;
    }).indexOf(id);

    if (index !== -1) {
      if (Array.isArray(self.attributes[index]["listOfObj"]) && self.attributes[index]["listOfObj"].length) {

        var i = self.attributes[index]["listOfObj"].map(function (x) {
          return x.id;
        }).indexOf(key);

        if (i !== -1) {
          //console.log(index+" ------------------ "+i);
          //console.log(self.attributes[index]["listOfObj"]);
          self.attributes[index]["listOfObj"].splice(i, 1);
        }
      }
    }
  };
  SchemaObj.prototype.removeAttr = function (id) {
    if (!id) {
      console.log("El objeto no tiene la propiedad id");
      return null;
    }
    var self = this;
    if (!this.attributes) {
      this.attributes = [];
    }
    var index = this.attributes.map(function (a) {
      return a.id;
    }).indexOf(id);

    if (index !== -1) {
      this.attributes.splice(index, 1);
    }
  };
  //getter setter de primer nivel del objeto (no array)
  SchemaObj.prototype.getsetFLString = function (key) {
    var self = this;
    return function (newName) {
      if (angular.isDefined(newName)) {
        self[key] = newVal;
      }

      return self[key];
    };
  };

  SchemaObj.prototype.getsetOptionList = function (id, key) {
    var self = this;
    return function (newName) {
      if (arguments.length) {
        self.setAttrById(id, key, newName.replace(',,', ',').split(',').map(function (a) {
          return a.trim();
        }));
      }

      return self.getAttrById(id, key);
    };
  };
  SchemaObj.prototype.getsetFlat = function (id, key) {
    var self = this;
    return function (newVal) {
      if (arguments.length) {
        newVal = self.normalize(newVal);
        self.setAttrById(id, key, newVal);
        self.getAttrById(id, key);
      } else {
        return self.getAttrById(id, key);
      }
    };
  };
  SchemaObj.prototype.getsetFlatNameReplica = function () {
    var self = this;
    return function (newVal) {
      if (arguments.length) {
        newVal = self.normalize(newVal);
        self.setAttrById("name", "string", newVal);
        self.name = newVal;
      } else {
        return self.getAttrById("name", "string");
      }
    };
  };
  SchemaObj.prototype.getsetString = function (id, key) {
    var self = this;
    return function (newVal) {
      if (arguments.length && id && key && newVal) {
        self.setAttrById(id, key, newVal);
      }
      return self.getAttrById(id, key);
    };
  };
  SchemaObj.prototype.getsetSelect = function (id, key) {
    var self = this;
    return function (newVal) {
      return angular.isDefined(newVal) ? self.setAttrById(id, key, newVal) : self.getAttrById(id, key);
    };
  };
  SchemaObj.prototype.getsetNumber = function (id, key) {
    var self = this;
    return function (newVal) {
      if (arguments.length && id && key && newVal) {
        if (typeof newVal === 'number') {
          self.setAttrById(id, key, newVal);
        }
      }
      return self.getAttrById(id, key);
    };
  };
  SchemaObj.prototype.getsetBooleanNumeric = function (id, key) {

    var self = this;
    return function (newVal) {
      //console.log(typeof newVal)
      if (arguments.length && id && key) {
        if (newVal === 0 || newVal === 1) {
          if (newVal) {
            self.setAttrById(id, key, true);
          } else {
            self.setAttrById(id, key, false);
          }
        }
      }
      return self.getAttrById(id, key) ? 1 : 0;
    };
  };
  SchemaObj.prototype.getsetBoolean = function (id, key) {

    var self = this;
    return function (newVal) {
      //console.log(typeof newVal)
      if (arguments.length && id && key) {
        if (newVal === true) {
          self.setAttrById(id, key, true);
        }
        if (newVal === false) {
          self.setAttrById(id, key, false);
        }
      }
      return self.getAttrById(id, key);
    };
  };
  SchemaObj.prototype.getsetDate = function (id, key) {
    var self = this;
    return function (newVal) {

      if (angular.isDefined(newVal)) {
        //console.log("newVal.getDate(): " +newVal.getDate() + " -  Valor newVal: "+newVal)
        self.setAttrById(id, key, newVal);
        //newVal = new Date( self.getAttrById(id,key) );
      }

      return new Date(self.getAttrById(id, key));
      //console.log(  Date.parse( newVal ) === Date.parse( self.getAttrById(id,key) )     );
      //if( !Date.parse( new Date(newVal) ) === Date.parse( self.getAttrById(id,key) )){
      /*
      if(Date.parse( newVal ) === Date.parse( self.getAttrById(id,key) )){
        return newVal;
      }else{
        if(arguments.length && id && key && newVal && newVal instanceof Date){
          //console.log("newVal.getDate(): " +newVal.getDate() + " -  Valor newVal: "+newVal)
          self.setAttrById(id,key,newVal.toISOString());
        }
        return new Date( self.getAttrById(id,key) )
      }
      */
    };
  };

  SchemaObj.prototype.getsetOptionListOfObj = function (id, key) {
    var self = this;
    return function (newName) {
      if (arguments.length) {
        self.setAttrById(id, key, newName.replace(',,', ',').split(',').map(function (a) {
          return a.trim();
        }).map(function (b) {
          var a = b.split('-');
          return { id: a[0], string: a[1] };
        }));
      }
      if (self.getAttrById(id, key)) {
        return self.getAttrById(id, key).map(function (x) {
          return x.id + '-' + x.string;
        }).join(',');
      } else {
        return '';
      }
    };
  };

  return SchemaObj;
}

angular.module('pmgRestfulApiApp').factory('SchemaObj', SchemaObjService);
//# sourceMappingURL=SchemaObj.service.js.map

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
    template: '\n      <main-bar></main-bar>\n      <main></main>\n      '
  });
});
//# sourceMappingURL=main.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var RecordsComponent = function () {
    function RecordsComponent($http, $scope, socket) {
      _classCallCheck(this, RecordsComponent);

      this.$http = $http;
      this.socket = socket;
      this.message = 'Hello';
    }

    _createClass(RecordsComponent, [{
      key: '$onInit',
      value: function $onInit() {
        var _this = this;

        this.$http.get('/api/records?schm=57c42f2fc8307cd5b82f4484').then(function (response) {
          _this.data = response.data;
          _this.records = _this.data.items;
          _this.socket.syncUpdates('record', _this.records, function (event, item, obj) {
            this.records = item;
            console.log(obj);
          });
        });
      }
    }]);

    return RecordsComponent;
  }();

  angular.module('pmgRestfulApiApp').component('records', {
    templateUrl: 'app/records/records.html',
    controller: RecordsComponent,
    controllerAs: 'recordsCtrl'
  });
})();
//# sourceMappingURL=records.controller.js.map

'use strict';

angular.module('pmgRestfulApiApp').config(function ($stateProvider) {
  $stateProvider.state('records', {
    url: '/records',
    template: '<records></records>'
  });
});
//# sourceMappingURL=records.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var SchemasComponent = function () {
        function SchemasComponent($http, $scope, socket) {
            _classCallCheck(this, SchemasComponent);

            this.$http = $http;
            this.socket = socket;
            this.items = [];
        }

        _createClass(SchemasComponent, [{
            key: '$onInit',
            value: function $onInit() {
                var _this = this;

                this.$http.get('api/schemas').then(function (response) {
                    console.log(response.data);
                    _this.items = response.data.items;
                    //this.socket.syncUpdates('thing', this.awesomeThings);
                });
                this.typeFilter = function (idType) {
                    return function (item) {
                        return item.type === idType;
                    };
                };
            }
        }, {
            key: 'find',
            value: function find(array, key, value, target) {
                if (!Array.isArray(array)) {
                    return null;
                }

                var index = array.map(function (x) {
                    return x[key];
                }).indexOf(value);

                if (index !== -1) {
                    if (target === undefined) {
                        return array[index];
                    } else {
                        return array[index][target];
                    }
                } else {
                    return null;
                }
            }
        }]);

        return SchemasComponent;
    }();

    var SchemaTypeComponent = function () {
        function SchemaTypeComponent($http, $scope, socket, $stateParams) {
            _classCallCheck(this, SchemaTypeComponent);

            this.$http = $http;
            this.socket = socket;
            this.items = [];
            this.type = $stateParams.type;
            console.log(this.$stateParams);
        }

        _createClass(SchemaTypeComponent, [{
            key: '$onInit',
            value: function $onInit() {
                var _this2 = this;

                this.$http.get('api/schemas?type=' + this.type) //record_only
                .then(function (response) {
                    console.log(response.data);
                    _this2.items = response.data.items;
                    //this.socket.syncUpdates('thing', this.awesomeThings);
                });
            }
        }, {
            key: 'find',
            value: function find(array, key, value, target) {
                var self = this;
                if (!Array.isArray(array)) {
                    return null;
                }

                var index = array.map(function (x) {
                    return x[key];
                }).indexOf(value);

                if (index !== -1) {
                    if (target === undefined) {
                        return array[index];
                    } else {
                        return array[index][target];
                    }
                } else {
                    return null;
                }
            }
        }]);

        return SchemaTypeComponent;
    }();

    var SchemaEditComponent = function () {
        function SchemaEditComponent($http, $scope, socket, $stateParams) {
            _classCallCheck(this, SchemaEditComponent);

            this.$http = $http;
            this.http = $http;
            this.socket = socket;
            this.items = [];
            this.id = $stateParams.id;
            this.record = {};
            console.log("this.$stateParams:  " + this.$stateParams);
        }

        _createClass(SchemaEditComponent, [{
            key: '$onInit',
            value: function $onInit() {
                var self = this;
                console.log(this.http.put);
                this.response = this.$http.get('api/schemas/' + this.id + '?record_only=true') //record_only
                .then(function (response) {
                    //this.socket.syncUpdates('thing', this.awesomeThings);
                    self.record = response.data;
                    return self.record;
                });
            }
        }, {
            key: 'saveRecord',
            value: function saveRecord(record) {
                var self = this;
                //console.log("Saving .............................................")
                //console.log("passing record")
                //console.log(record)
                if (record._id) {
                    this.$http.put('api/schemas/' + record._id, record).then(function (x) {
                        console.log(x);
                        //self.record = x.data;
                    });
                }
            }
        }]);

        return SchemaEditComponent;
    }();

    var SchemaNewComponent = function () {
        function SchemaNewComponent($http, $scope, socket, $stateParams, $q) {
            _classCallCheck(this, SchemaNewComponent);

            this.$http = $http;
            this.socket = socket;
            this.items = [];
            this.q = $q;
            this.id = $stateParams.id;
            console.log("this.$stateParams:  " + this.$stateParams);
        }

        _createClass(SchemaNewComponent, [{
            key: '$onInit',
            value: function $onInit() {
                var self = this;
                this.response = this.q(function (resolve, reject) {
                    self.record = { type: "schema " };
                    resolve(self.record);
                    reject(self.record);
                });
            }
        }, {
            key: 'saveRecord',
            value: function saveRecord(record) {
                if (record._id) {
                    this.$http.put('api/schemas/' + record._id, record).then(function (x) {
                        console.log(x);
                        //self.record = x.data;
                    });
                } else {
                    this.$http.post('api/schemas', record).then(function (x) {
                        console.log(x);
                    });
                }
                //redireccionar
            }
        }]);

        return SchemaNewComponent;
    }();

    var SchemaAttrEditComponent = function () {
        function SchemaAttrEditComponent($http, $scope, socket, $stateParams) {
            _classCallCheck(this, SchemaAttrEditComponent);

            this.$http = $http;
            this.http = $http;
            this.socket = socket;
            this.items = [];
            this.id = $stateParams.id;
            this.record = {};
            console.log("this.$stateParams:  " + this.$stateParams);
        }

        _createClass(SchemaAttrEditComponent, [{
            key: '$onInit',
            value: function $onInit() {
                var self = this;
                console.log(this.http.put);
                this.response = this.$http.get('api/schemas/' + this.id + '?record_only=true') //record_only
                .then(function (response) {
                    //this.socket.syncUpdates('thing', this.awesomeThings);
                    self.record = response.data;
                    return self.record;
                });
            }
        }, {
            key: 'saveRecord',
            value: function saveRecord(record) {
                var self = this;
                //console.log("Saving .............................................")
                //console.log("passing record")
                //console.log(record)
                if (record._id) {
                    this.$http.put('api/schemas/' + record._id, record).then(function (x) {
                        console.log(x);
                        //self.record = x.data;
                    });
                }
            }
        }]);

        return SchemaAttrEditComponent;
    }();

    var SchemaAttrNewComponent = function () {
        function SchemaAttrNewComponent($http, $scope, socket, $stateParams, $q) {
            _classCallCheck(this, SchemaAttrNewComponent);

            this.$http = $http;
            this.socket = socket;
            this.items = [];
            this.q = $q;
            this.id = $stateParams.id;
            console.log("this.$stateParams:  " + this.$stateParams);
        }

        _createClass(SchemaAttrNewComponent, [{
            key: '$onInit',
            value: function $onInit() {
                var self = this;
                this.response = this.q(function (resolve, reject) {
                    self.record = { type: "attribute" };
                    resolve(self.record);
                    reject(self.record);
                });
            }
        }, {
            key: 'saveRecord',
            value: function saveRecord(record) {
                if (record._id) {
                    this.$http.put('api/schemas/' + record._id, record).then(function (x) {
                        console.log(x);
                        //self.record = x.data;
                    });
                } else {
                    this.$http.post('api/schemas', record).then(function (x) {
                        console.log(x);
                    });
                }
                //redireccionar
            }
        }]);

        return SchemaAttrNewComponent;
    }();

    var SchemaInputEditComponent = function () {
        function SchemaInputEditComponent($http, $scope, socket, $stateParams) {
            _classCallCheck(this, SchemaInputEditComponent);

            this.$http = $http;
            this.socket = socket;
            this.items = [];
            this.id = $stateParams.id;
            console.log("this.$stateParams:  " + $stateParams.id);
        }

        _createClass(SchemaInputEditComponent, [{
            key: '$onInit',
            value: function $onInit() {
                this.response = this.$http.get('api/schemas/' + this.id + '?record_only=true') //record_only
                .then(function (response) {
                    console.log(response.data);
                    //this.socket.syncUpdates('thing', this.awesomeThings);
                    return response.data;
                });
            }
        }, {
            key: 'saveRecord',
            value: function saveRecord(record) {
                if (record._id) {
                    this.$http.put('api/schemas/' + record._id, record).then(function (x) {
                        console.log(x);
                        //self.record = x.data;
                    });
                }
            }
        }]);

        return SchemaInputEditComponent;
    }();

    var SchemaInputNewComponent = function () {
        function SchemaInputNewComponent($http, $scope, socket, $stateParams, $q) {
            _classCallCheck(this, SchemaInputNewComponent);

            this.$http = $http;
            this.socket = socket;
            this.items = [];
            this.q = $q;
            this.id = $stateParams.id;
            console.log("SchemaInputNewComponent");
        }

        _createClass(SchemaInputNewComponent, [{
            key: '$onInit',
            value: function $onInit() {
                var self = this;
                this.response = this.q(function (resolve, reject) {
                    self.record = { type: "input" };
                    resolve(self.record);
                    reject(self.record);
                });
            }
        }, {
            key: 'saveRecord',
            value: function saveRecord(record) {
                if (record._id) {
                    this.$http.put('api/schemas/' + record._id, record).then(function (x) {
                        console.log(x);
                        //self.record = x.data;
                    });
                } else {
                    this.$http.post('api/schemas', record).then(function (x) {
                        console.log(x);
                    });
                }
                //redireccionar
            }
        }, {
            key: 'saveRecord',
            value: function saveRecord(record) {
                if (record._id) {
                    this.$http.put('api/schemas/' + record._id, record).then(function (x) {
                        console.log(x);
                        //self.record = x.data;
                    });
                } else {
                    this.$http.post('api/schemas', record).then(function (x) {
                        console.log(x);
                    });
                }
                //redireccionar
            }
        }]);

        return SchemaInputNewComponent;
    }();

    var SchemaAttrInputEditComponent = function () {
        function SchemaAttrInputEditComponent($http, $scope, socket, $stateParams) {
            _classCallCheck(this, SchemaAttrInputEditComponent);

            this.$http = $http;
            this.socket = socket;
            this.items = [];
            this.id = $stateParams.id;
            console.log("this.$stateParams:  " + this.$stateParams);
        }

        _createClass(SchemaAttrInputEditComponent, [{
            key: '$onInit',
            value: function $onInit() {
                this.response = this.$http.get('api/schemas/' + this.id + '?record_only=true') //record_only
                .then(function (response) {
                    //console.log(response.data);
                    //this.socket.syncUpdates('thing', this.awesomeThings);
                    return response.data;
                });
            }
        }, {
            key: 'saveRecord',
            value: function saveRecord(record) {
                if (record._id) {
                    this.$http.put('api/schemas/' + record._id, record).then(function (x) {
                        console.log(x);
                        //self.record = x.data;
                    });
                }
            }
        }]);

        return SchemaAttrInputEditComponent;
    }();

    var SchemaAttrInputNewComponent = function () {
        function SchemaAttrInputNewComponent($http, $scope, socket, $stateParams, $q) {
            _classCallCheck(this, SchemaAttrInputNewComponent);

            this.$http = $http;
            this.socket = socket;
            this.items = [];
            this.q = $q;
            this.id = $stateParams.id;
            console.log("SchemaInputNewComponent");
        }

        _createClass(SchemaAttrInputNewComponent, [{
            key: '$onInit',
            value: function $onInit() {
                var self = this;
                this.response = this.q(function (resolve, reject) {
                    self.record = { type: "attrInputConf" };
                    resolve(self.record);
                    reject(self.record);
                });
            }
        }, {
            key: 'saveRecord',
            value: function saveRecord(record) {
                if (record._id) {
                    this.$http.put('api/schemas/' + record._id, record).then(function (x) {
                        console.log(x);
                        //self.record = x.data;
                    });
                } else {
                    this.$http.post('api/schemas', record).then(function (x) {
                        console.log(x);
                    });
                }
                //redireccionar
            }
        }]);

        return SchemaAttrInputNewComponent;
    }();

    var schemaSchmAttrInputEdit = function () {
        function schemaSchmAttrInputEdit($http, $scope, socket, $stateParams) {
            _classCallCheck(this, schemaSchmAttrInputEdit);

            this.$http = $http;
            this.socket = socket;
            this.items = [];
            this.id = $stateParams.id;
            console.log("this.$stateParams:  " + this.$stateParams);
        }

        _createClass(schemaSchmAttrInputEdit, [{
            key: '$onInit',
            value: function $onInit() {
                this.response = this.$http.get('api/schemas/' + this.id + '?record_only=true') //record_only
                .then(function (response) {
                    //console.log(response.data);
                    //this.socket.syncUpdates('thing', this.awesomeThings);
                    return response.data;
                });
            }
        }, {
            key: 'saveRecord',
            value: function saveRecord(record) {
                if (record._id) {
                    this.$http.put('api/schemas/' + record._id, record).then(function (x) {
                        console.log(x);
                        //self.record = x.data;
                    });
                }
            }
        }]);

        return schemaSchmAttrInputEdit;
    }();

    var SchemaSchmAttrInputNewComponent = function () {
        function SchemaSchmAttrInputNewComponent($http, $scope, socket, $stateParams, $q) {
            _classCallCheck(this, SchemaSchmAttrInputNewComponent);

            this.$http = $http;
            this.socket = socket;
            this.items = [];
            this.q = $q;
            this.id = $stateParams.id;
            console.log("SchemaInputNewComponent");
        }

        _createClass(SchemaSchmAttrInputNewComponent, [{
            key: '$onInit',
            value: function $onInit() {
                var self = this;
                this.response = this.q(function (resolve, reject) {
                    self.record = { type: "schmAttrInputConf" };
                    resolve(self.record);
                    reject(self.record);
                });
            }
        }, {
            key: 'saveRecord',
            value: function saveRecord(record) {
                if (record._id) {
                    this.$http.put('api/schemas/' + record._id, record).then(function (x) {
                        console.log(x);
                        //self.record = x.data;
                    });
                } else {
                    this.$http.post('api/schemas', record).then(function (x) {
                        console.log(x);
                    });
                }
                //redireccionar
            }
        }]);

        return SchemaSchmAttrInputNewComponent;
    }();

    angular.module('pmgRestfulApiApp').component('schemas', {
        templateUrl: 'app/schemas/schemas.html',
        controller: SchemasComponent,
        controllerAs: 'schmCtrl'
    }).component('schemaEdit', {
        template: '<h1>Schema Edit</h1><form-builder reg="seCtrl.response" save-cb="seCtrl.saveRecord(record)" ></form-builder>',
        controller: SchemaEditComponent,
        controllerAs: 'seCtrl'
    }).component('schemaNew', {
        template: '<h1>Schema Edit</h1><form-builder reg="senCtrl.response" save-cb="senCtrl.saveRecord(record)" ></form-builder>',
        controller: SchemaNewComponent,
        controllerAs: 'senCtrl'
    }).component('schemaAttrEdit', {
        template: '<h1>Attribute Edit</h1><form-attr reg="saeCtrl.response" save-cb="saeCtrl.saveRecord(record)" ></form-attr>',
        controller: SchemaAttrEditComponent,
        controllerAs: 'saeCtrl'
    }).component('schemaAttrNew', {
        template: '<h1>Attribute Edit</h1><form-attr reg="saenCtrl.response" save-cb="saenCtrl.saveRecord(record)" ></form-attr>',
        controller: SchemaAttrNewComponent,
        controllerAs: 'saenCtrl'
    }).component('schemaInputEdit', {
        template: '<h1>Input Edit</h1><form-input reg="sieCtrl.response" save-cb="sieCtrl.saveRecord(record)"></form-input>',
        controller: SchemaInputEditComponent,
        controllerAs: 'sieCtrl'
    }).component('schemaInputNew', {
        template: '<h1>Input New</h1><form-input reg="sienCtrl.response" save-cb="sienCtrl.saveRecord(record)"></form-input>',
        controller: SchemaInputNewComponent,
        controllerAs: 'sienCtrl'
    }).component('schemaAttrInputEdit', {
        //templateUrl: 'app/schemas/schema-edit.html',
        template: '<h1>Attribute-Input Edit</h1><form-aic reg="aicCtrl.response" save-cb="aicCtrl.saveRecord(record)"></form-aic>',
        controller: SchemaAttrInputEditComponent,
        controllerAs: 'aicCtrl'
    }).component('schemaAttrInputNew', {
        //templateUrl: 'app/schemas/schema-edit.html',
        template: '<h1>Attribute-Input New</h1><form-aic reg="aicnCtrl.response" save-cb="aicnCtrl.saveRecord(record)"></form-aic>',
        controller: SchemaAttrInputNewComponent,
        controllerAs: 'aicnCtrl'
    }).component('schemaSchmAttrInputEdit', {
        template: '<form-saic reg="saicCtrl.response" save-cb="saicCtrl.saveRecord(record)"></form-saic>',
        controller: schemaSchmAttrInputEdit,
        controllerAs: 'saicCtrl'
    }).component('schemaSchmAttrInputNew', {
        template: '<form-saic reg="saicnCtrl.response" save-cb="saicnCtrl.saveRecord(record)"></form-saic>',
        controller: SchemaSchmAttrInputNewComponent,
        controllerAs: 'saicnCtrl'
    }).component('schemaType', {
        templateUrl: 'app/schemas/schemas.html',
        controller: SchemaTypeComponent,
        controllerAs: 'schmCtrl'
    });
})();
//# sourceMappingURL=schemas.controller.js.map

'use strict';

angular.module('pmgRestfulApiApp').config(function ($stateProvider) {
  $stateProvider.state('schemas', {
    url: '/schemas',
    template: '<schemas></schemas>'
  }).state('schemaType', {
    url: '/schemas/type/:type',
    template: '<schema-type></schema-type>'
  })

  /**************SCHEMA************ */
  .state('schemaEdit', {
    url: '/schemas/schema/:id/edit',
    template: '<schema-edit></schema-edit>'
  }).state('schemaNew', {
    url: '/schemas/schema/new',
    template: '<schema-new></schema-new>'
  })

  /**************INPUT************ */
  .state('schemaInputEdit', {
    url: '/schemas/input/:id/edit',
    template: '<schema-input-edit></schema-input-edit>'
  }).state('schemaInputNew', {
    url: '/schemas/input/new',
    template: '<schema-input-new></schema-input-new>'
  })

  /**************ATTRIBUTE************ */
  .state('schemaAttrEdit', {
    url: '/schemas/attribute/:id/edit',
    template: '<schema-attr-edit></schema-attr-edit>'
  }).state('schemaAttrNew', {
    url: '/schemas/attribute/new',
    template: '<schema-attr-new></schema-attr-new>'
  })

  /**************ATTRIBUTE INPUTE ************ */

  .state('schemaAttrInputEdit', {
    url: '/schemas/attrInputConf/:id/edit',
    template: '<schema-attr-input-edit></schema-attr-input-edit>'
  }).state('schemaAttrInputNew', {
    url: '/schemas/attrInputConf/new',
    template: '<schema-attr-input-new></schema-attr-input-new>'
  })

  /**************SCHEMA ATTRIBUTE INPUTE ************ */
  .state('schemaSchmAttrInputEdit', {
    url: '/schemas/schmAttrInputConf/:id/edit',
    template: '<schema-schm-attr-input-edit></schema-schm-attr-input-edit>'
  }).state('schemaSchmAttrInputNew', {
    url: '/schemas/schmAttrInputConf/new',
    template: '<schema-schm-attr-input-new></schema-schm-attr-input-new>'
  });
});
//# sourceMappingURL=schemas.js.map

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

angular.module('pmgRestfulApiApp').config(function ($provide, $mdThemingProvider) {
  /*
  var colorStore = {};
   //fetch the colors out of the themeing provider
  Object.keys($mdThemingProvider._PALETTES).forEach(
    // clone the pallete colors to the colorStore var
    function(palleteName) {
      var pallete = $mdThemingProvider._PALETTES[palleteName];
      var colors  = [];
      colorStore[palleteName]=colors;
      Object.keys(pallete).forEach(function(colorName) {
        // use an regex to look for hex colors, ignore the rest
        if (/#[0-9A-Fa-f]{6}|0-9A-Fa-f]{8}\b/.exec(pallete[colorName])) {
          colors[colorName] = pallete[colorName];
        }
      });
    });
   $provide.factory('mdThemeColors', [
    function() {
       Object.defineProperty(service,'primary', {
        get: getColorFactory('primary')
      });
       Object.defineProperty(service,'accent', {
        get: getColorFactory('accent')
      });
       Object.defineProperty(service,'warn', {
        get: getColorFactory('warn')
      });
       Object.defineProperty(service,'background', {
        get: getColorFactory('background')
      });
       return {
        getColorFactory: function(intent,nameTheme){
            var nameThemes = nameTheme || 'default';
            var colors = $mdThemingProvider._THEMES[nameThemes].colors[intent];
            var name = colors.name;
            // Append the colors with links like hue-1, etc
            colorStore[name].default = colorStore[name][colors.hues['default']];
            colorStore[name].hue1 = colorStore[name][colors.hues['hue-1']];
            colorStore[name].hue2 = colorStore[name][colors.hues['hue-2']];
            colorStore[name].hue3 = colorStore[name][colors.hues['hue-3']];
            return colorStore[name];
         }
      };
    }
  ]);
  */
  /*********NAVBAR*********/
  //$mdThemingProvider.theme('navbar')
  //.primaryPalette('indigo')
  //.warnPalette('purple')
  //.accentPalette('pink')
  //.backgroundPalette('indigo');
  /*********END NAVBAR*********/
  $mdThemingProvider.theme('default').primaryPalette('indigo').accentPalette('pink').warnPalette('red');

  $mdThemingProvider.theme('dark-indigo').backgroundPalette('indigo').dark();
  $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
  $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
  $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
  $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
  //.backgroundPalette('grey')
});
//# sourceMappingURL=color.js.map

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NavbarController = function () {
  //end-non-standard

  //start-non-standard
  function NavbarController(Auth, $mdSidenav) {
    _classCallCheck(this, NavbarController);

    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.hola = 'Hola';
    this.$mdSidenav = $mdSidenav;
  }

  _createClass(NavbarController, [{
    key: '$onInit',
    value: function $onInit() {
      var self = this;
      this.buildToggler = function (componentId) {
        return function () {
          self.$mdSidenav(componentId).toggle();
        };
      };
    }
  }]);

  return NavbarController;
}();

angular.module('pmgRestfulApiApp').controller('NavbarController', NavbarController);

/*

$scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }


*/
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

angular.module("pmgRestfulApiApp").run(["$templateCache", function($templateCache) {$templateCache.put("components/footer/footer.html","<md-content layout=\"column\" layout-align=\"center center\">\n  <p flex> PMGV - INIA La Platina -  2016</p>\n  <md-button class=\"md-raised\" >Click me</md-button>\n  <md-button class=\"md-raised md-accent\">or maybe me</md-button>\n  <md-button class=\"md-raised md-primary\" >Careful</md-button>\n</md-content>");
$templateCache.put("components/modal/modal.html","<div class=\"modal-header\">\n  <button ng-if=\"modal.dismissable\" type=\"button\" ng-click=\"$dismiss()\" class=\"close\">&times;</button>\n  <h4 ng-if=\"modal.title\" ng-bind=\"modal.title\" class=\"modal-title\"></h4>\n</div>\n<div class=\"modal-body\">\n  <p ng-if=\"modal.text\" ng-bind=\"modal.text\"></p>\n  <div ng-if=\"modal.html\" ng-bind-html=\"modal.html\"></div>\n</div>\n<div class=\"modal-footer\">\n  <button ng-repeat=\"button in modal.buttons\" ng-class=\"button.classes\" ng-click=\"button.click($event)\" ng-bind=\"button.text\" class=\"btn\"></button>\n</div>\n");
$templateCache.put("components/navbar/navbar.html","<!-- <div class=\"navbar navbar-default navbar-static-top\" ng-controller=\"NavbarController\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <button class=\"navbar-toggle\" type=\"button\" ng-click=\"nav.isCollapsed = !nav.isCollapsed\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a href=\"/\" class=\"navbar-brand\">pmg-restful-api</a>\n    </div>\n    <div uib-collapse=\"nav.isCollapsed\" class=\"navbar-collapse collapse\" id=\"navbar-main\">\n      <ul class=\"nav navbar-nav\">\n        <li ng-repeat=\"item in nav.menu\" ui-sref-active=\"active\">\n            <a ui-sref=\"{{item.state}}\">{{item.title}}</a>\n        </li>\n        <li ng-show=\"nav.isAdmin()\" ui-sref-active=\"active\"><a ui-sref=\"admin\">Admin</a></li>\n      </ul>\n\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li ng-hide=\"nav.isLoggedIn()\" ui-sref-active=\"active\"><a ui-sref=\"signup\">Sign up</a></li>\n        <li ng-hide=\"nav.isLoggedIn()\" ui-sref-active=\"active\"><a ui-sref=\"login\">Login</a></li>\n        <li ng-show=\"nav.isLoggedIn()\"><p class=\"navbar-text\">Hello {{ nav.getCurrentUser().name }}</p> </li>\n        <li ng-show=\"nav.isLoggedIn()\" ui-sref-active=\"active\"><a ui-sref=\"settings\"><span class=\"glyphicon glyphicon-cog\"></span></a></li>\n        <li ng-show=\"nav.isLoggedIn()\"><a ui-sref=\"logout\">Logout</a></li>\n      </ul>\n    </div>\n  </div>\n</div>\n-->\n<!--\n  <md-toolbar  theme=\"cira\" class=\"mg-padding\">\n     <h2 flex>Toolbar: md-warn</h2>\n     <md-button class=\"md-icon-button\" aria-label=\"More\">\n        <md-icon md-svg-icon=\"img/icons/more_vert.svg\"></md-icon>\n      </md-button>\n  </md-toolbar>-->\n\n  \n<main-bar></main-bar>\n\n\n\n<!--\n   <section layout=\"row\" flex>\n     <h1>{{nav.hola}}</h1>\n    <md-sidenav class=\"md-sidenav-left\" md-component-id=\"left\"\n                md-disable-backdrop md-whiteframe=\"4\">\n\n      <md-toolbar class=\"md-theme-indigo\">\n        <h1 class=\"md-toolbar-tools\">Disabled Backdrop</h1>\n      </md-toolbar>\n\n      <md-content layout-margin>\n        <p>\n          This sidenav is not showing any backdrop, where users can click on it, to close the sidenav.\n        </p>\n        <md-button ng-click=\"nav.toggleLeft()\" class=\"md-accent\">\n          Close this Sidenav\n        </md-button>\n      </md-content>\n\n    </md-sidenav>\n\n    <md-content flex layout-padding>\n\n      <div layout=\"column\" layout-align=\"top center\">\n        <p>\n          Developers can also disable the backdrop of the sidenav.<br/>\n          This will disable the functionality to click outside to close the sidenav.\n        </p>\n\n        <div>\n          <md-button ng-click=\"nav.toggleLeft()\" class=\"md-raised\">\n            Toggle Sidenav\n          </md-button>\n        </div>\n\n      </div>\n\n    </md-content>\n\n  </section>\n-->");
$templateCache.put("components/oauth-buttons/oauth-buttons.html","<a ng-class=\"classes\" ng-click=\"OauthButtons.loginOauth(\'facebook\')\" class=\"btn btn-social btn-facebook\">\n  <i class=\"fa fa-facebook\"></i>\n  Connect with Facebook\n</a>\n<a ng-class=\"classes\" ng-click=\"OauthButtons.loginOauth(\'google\')\" class=\"btn btn-social btn-google\">\n  <i class=\"fa fa-google-plus\"></i>\n  Connect with Google+\n</a>\n<a ng-class=\"classes\" ng-click=\"OauthButtons.loginOauth(\'twitter\')\" class=\"btn btn-social btn-twitter\">\n  <i class=\"fa fa-twitter\"></i>\n  Connect with Twitter\n</a>\n");
$templateCache.put("app/admin/admin.html","<div class=\"container\">\n  <p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p>\n  <ul class=\"list-group user-list\">\n    <li class=\"list-group-item\" ng-repeat=\"user in admin.users\">\n	    <div class=\"user-info\">\n	        <strong>{{user.name}}</strong><br>\n	        <span class=\"text-muted\">{{user.email}}</span>\n	    </div>\n        <a ng-click=\"admin.delete(user)\" class=\"trash\"><span class=\"fa fa-trash fa-2x\"></span></a>\n    </li>\n  </ul>\n</div>\n");
$templateCache.put("app/main/main.html","\n<md-content layout=\"column\" flex-offset-gt-md=\"15\" flex-gt-md=\"70\" flex=\"100\" layout-align=\"center none\">\n  <schemas flex layout-padding></schemas>\n\n</md-content>");
$templateCache.put("app/records/records.html","<div>Records</div>\n\n<table class=\"table\">\n    <tr>\n        <td>ID</td>\n        <td>Schema</td>\n    </tr>\n    <tr ng-repeat=\"record in recordsCtrl.records | orderBy:\'-created\'\">\n        <td>{{record._id}}</td>\n        <td>{{record.schm}}</td>\n    </tr>\n</table>");
$templateCache.put("app/schemas/schema-edit.html","<form-builder reg=\"seCtrl.response\"></form-builder>");
$templateCache.put("app/schemas/schemas.html","<div class=\"col-md-12\">\n  <h1>Schemas disponibles</h1>\n   <uib-tabset active=\"active\">\n    <uib-tab index=\"0\" heading=\"SCHEMAS\">\n      <table class=\"table\">\n        <tr>\n          <td>ID</td>\n          <td>Created</td>\n          <td>Tipo</td>\n          <td>Nombre</td>\n          <td>Descripción</td>\n          <td>Edit</td>\n        </tr>\n        <tr ng-repeat=\"section in schmCtrl.items | filter:{type:\'schema\'}:true | orderBy:\'-created\'\">\n          <td>{{section._id}}</td>\n          <td>{{section.created | date:\'yyyy-MM-dd HH:mm:ss\'}}</td>\n          <td>{{section.type}}</td>\n          <td><a href=\"javascript:;\" >{{schmCtrl.find(section.attributes, \"id\",\"name\", \"string\")}}</a></td>\n          <td>{{schmCtrl.find(section.attributes, \"id\",\"description\", \"string\")}}</td>\n          <td><a class=\"btn btn-primary\" href=\"/schemas/{{section.type}}/{{section._id}}/edit\" >Editar</a></td>\n        </tr>\n      </table>\n      <a type=\"button\" class=\"btn btn-success\" href=\"schemas/schema/new\">NEW</a>\n    </uib-tab>\n    <uib-tab index=\"1\" heading=\"ATTRIBUTES\">\n      <table class=\"table\">\n        <tr>\n          <td>ID</td>\n          <td>Created</td>\n          <td>Tipo</td>\n          <td>Nombre</td>\n          <td>Descripción</td>\n          <td>Edit</td>\n        </tr>\n        <tr ng-repeat=\"section in schmCtrl.items | filter:{type:\'attribute\'}:true | orderBy:\'-created\'\">\n          <td>{{section._id}}</td>\n          <td>{{section.created | date:\'yyyy-MM-dd HH:mm:ss\'}}</td>\n          <td>{{section.type}}</td>\n          <td><a href=\"javascript:;\" >{{schmCtrl.find(section.attributes, \"id\",\"name\", \"string\")}}</a></td>\n          <td>{{schmCtrl.find(section.attributes, \"id\",\"description\", \"string\")}}</td>\n          <td><a class=\"btn btn-primary\" href=\"/schemas/{{section.type}}/{{section._id}}/edit\" >Editar</a></td>\n        </tr>\n      </table>\n      <a type=\"button\" class=\"btn btn-success\" href=\"schemas/attribute/new\">NEW</a>\n    </uib-tab>\n    <uib-tab index=\"2\" heading=\"INPUTS\">\n      <table class=\"table\">\n        <tr>\n          <td>ID</td>\n          <td>Created</td>\n          <td>Tipo</td>\n          <td>Nombre</td>\n          <td>Descripción</td>\n          <td>Edit</td>\n        </tr>\n        <tr ng-repeat=\"section in schmCtrl.items | filter:{type:\'input\'}:true | orderBy:\'-created\'\">\n          <td>{{section._id}}</td>\n          <td>{{section.created | date:\'yyyy-MM-dd HH:mm:ss\'}}</td>\n          <td>{{section.type}}</td>\n          <td><a href=\"javascript:;\" >{{schmCtrl.find(section.attributes, \"id\",\"name\", \"string\")}}</a></td>\n          <td>{{schmCtrl.find(section.attributes, \"id\",\"description\", \"string\")}}</td>\n          <td><a class=\"btn btn-primary\" href=\"/schemas/{{section.type}}/{{section._id}}/edit\" >Editar</a></td>\n        </tr>\n      </table>\n      <a type=\"button\" class=\"btn btn-success\" href=\"schemas/input/new\">NEW</a>\n    </uib-tab>\n    <uib-tab index=\"3\" heading=\"ATTRIBUTES-INPUTS\">\n      <table class=\"table\">\n        <tr>\n          <td>ID</td>\n          <td>Created</td>\n          <td>Tipo</td>\n          <td>Nombre</td>\n          <td>Descripción</td>\n          <td>Edit</td>\n        </tr>\n        <tr ng-repeat=\"section in schmCtrl.items | filter:{type:\'attrInputConf\'}:true | orderBy:\'-created\'\">\n          <td>{{section._id}}</td>\n          <td>{{section.created | date:\'yyyy-MM-dd HH:mm:ss\'}}</td>\n          <td>{{section.type}}</td>\n          <td><a href=\"javascript:;\" >{{schmCtrl.find(section.attributes, \"id\",\"name\", \"string\")}}</a></td>\n          <td>{{schmCtrl.find(section.attributes, \"id\",\"description\", \"string\")}}</td>\n          <td><a class=\"btn btn-primary\" href=\"/schemas/{{section.type}}/{{section._id}}/edit\" >Editar</a></td>\n        </tr>\n      </table>\n      <a type=\"button\" class=\"btn btn-success\" href=\"schemas/attrInputConf/new\">NEW</a>\n    </uib-tab>\n    <uib-tab index=\"4\" heading=\"SCHEMA-ATTRIBUTES-INPUTS\">\n      <table class=\"table\">\n        <tr>\n          <td>ID</td>\n          <td>Created</td>\n          <td>Tipo</td>\n          <td>Nombre</td>\n          <td>Descripción</td>\n          <td>Edit</td>\n        </tr>\n        <tr ng-repeat=\"section in schmCtrl.items | filter:{type:\'schmAttrInputConf\'}:true | orderBy:\'-created\'\">\n          <td>{{section._id}}</td>\n          <td>{{section.created | date:\'yyyy-MM-dd HH:mm:ss\'}}</td>\n          <td>{{section.type}}</td>\n          <td><a href=\"javascript:;\" >{{schmCtrl.find(section.attributes, \"id\",\"name\", \"string\")}}</a></td>\n          <td>{{schmCtrl.find(section.attributes, \"id\",\"description\", \"string\")}}</td>\n          <td><a class=\"btn btn-primary\" href=\"/schemas/{{section.type}}/{{section._id}}/edit\" >Editar</a></td>\n        </tr>\n      </table>\n      <a type=\"button\" class=\"btn btn-success\" href=\"schemas/schmAttrInputConf/new\">NEW</a>\n    </uib-tab>\n    <uib-tab index=\"0\" heading=\"ALL\">\n      <table class=\"table\">\n        <tr>\n          <td>ID</td>\n          <td>Created</td>\n          <td>Tipo</td>\n          <td>Nombre</td>\n          <td>Descripción</td>\n          <td>Edit</td>\n        </tr>\n        <tr ng-repeat=\"section in schmCtrl.items | orderBy:\'-created\'\">\n          <td>{{section._id}}</td>\n          <td>{{section.created | date:\'yyyy-MM-dd HH:mm:ss\'}}</td>\n          <td>{{section.type}}</td>\n          <td><a href=\"javascript:;\" >{{schmCtrl.find(section.attributes, \"id\",\"name\", \"string\")}}</a></td>\n          <td>{{schmCtrl.find(section.attributes, \"id\",\"description\", \"string\")}}</td>\n          <td><a class=\"btn btn-primary\" href=\"/schemas/{{section.type}}/{{section._id}}/edit\" >Editar</a></td>\n        </tr>\n      </table>\n    </uib-tab>\n    <uib-tab index=\"4\" heading=\"RAW\">\n      <pre>\n        {{schmCtrl}}\n      </pre>\n      \n    </uib-tab>\n\n\n\n\n  </uib-tabset>\n</div>");
$templateCache.put("app/account/login/login.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-sm-12\">\n      <h1>Login</h1>\n      <p>Accounts are reset on server restart from <code>server/config/seed.js</code>. Default account is <code>test@example.com</code> / <code>test</code></p>\n      <p>Admin account is <code>admin@example.com</code> / <code>admin</code></p>\n    </div>\n    <div class=\"col-sm-12\">\n      <form class=\"form\" name=\"form\" ng-submit=\"vm.login(form)\" novalidate>\n\n        <div class=\"form-group\">\n          <label>Email</label>\n\n          <input type=\"email\" name=\"email\" class=\"form-control\" ng-model=\"vm.user.email\" required>\n        </div>\n\n        <div class=\"form-group\">\n          <label>Password</label>\n\n          <input type=\"password\" name=\"password\" class=\"form-control\" ng-model=\"vm.user.password\" required>\n        </div>\n\n        <div class=\"form-group has-error\">\n          <p class=\"help-block\" ng-show=\"form.email.$error.required && form.password.$error.required && vm.submitted\">\n             Please enter your email and password.\n          </p>\n          <p class=\"help-block\" ng-show=\"form.email.$error.email && vm.submitted\">\n             Please enter a valid email.\n          </p>\n\n          <p class=\"help-block\">{{ vm.errors.other }}</p>\n        </div>\n\n        <div>\n          <button class=\"btn btn-inverse btn-lg btn-login\" type=\"submit\">\n            Login\n          </button>\n          <a class=\"btn btn-default btn-lg btn-register\" ui-sref=\"signup\">\n            Register\n          </a>\n        </div>\n\n        <hr/>\n        <div class=\"row\">\n          <div class=\"col-sm-4 col-md-3\">\n            <oauth-buttons classes=\"btn-block\"></oauth-buttons>\n          </div>\n        </div>\n      </form>\n    </div>\n  </div>\n  <hr>\n</div>\n");
$templateCache.put("app/account/settings/settings.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-sm-12\">\n      <h1>Change Password</h1>\n    </div>\n    <div class=\"col-sm-12\">\n      <form class=\"form\" name=\"form\" ng-submit=\"vm.changePassword(form)\" novalidate>\n\n        <div class=\"form-group\">\n          <label>Current Password</label>\n\n          <input type=\"password\" name=\"password\" class=\"form-control\" ng-model=\"vm.user.oldPassword\"\n                 mongoose-error/>\n          <p class=\"help-block\" ng-show=\"form.password.$error.mongoose\">\n              {{ vm.errors.other }}\n          </p>\n        </div>\n\n        <div class=\"form-group\">\n          <label>New Password</label>\n\n          <input type=\"password\" name=\"newPassword\" class=\"form-control\" ng-model=\"vm.user.newPassword\"\n                 ng-minlength=\"3\"\n                 required/>\n          <p class=\"help-block\"\n             ng-show=\"(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || vm.submitted)\">\n            Password must be at least 3 characters.\n          </p>\n        </div>\n\n        <div class=\"form-group\">\n          <label>Confirm New Password</label>\n\n          <input type=\"password\" name=\"confirmPassword\" class=\"form-control\" ng-model=\"vm.user.confirmPassword\"\n                 match=\"vm.user.newPassword\"\n                 ng-minlength=\"3\"\n                 required=\"\"/>\n          <p class=\"help-block\"\n             ng-show=\"form.confirmPassword.$error.match && vm.submitted\">\n            Passwords must match.\n          </p>\n\n        </div>\n\n        <p class=\"help-block\"> {{ vm.message }} </p>\n\n        <button class=\"btn btn-lg btn-primary\" type=\"submit\">Save changes</button>\n      </form>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("app/account/signup/signup.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-sm-12\">\n      <h1>Sign up</h1>\n    </div>\n    <div class=\"col-sm-12\">\n      <form class=\"form\" name=\"form\" ng-submit=\"vm.register(form)\" novalidate>\n\n        <div class=\"form-group\" ng-class=\"{ \'has-success\': form.name.$valid && vm.submitted,\n                                            \'has-error\': form.name.$invalid && vm.submitted }\">\n          <label>Name</label>\n\n          <input type=\"text\" name=\"name\" class=\"form-control\" ng-model=\"vm.user.name\"\n                 required/>\n          <p class=\"help-block\" ng-show=\"form.name.$error.required && vm.submitted\">\n            A name is required\n          </p>\n        </div>\n\n        <div class=\"form-group\" ng-class=\"{ \'has-success\': form.email.$valid && vm.submitted,\n                                            \'has-error\': form.email.$invalid && vm.submitted }\">\n          <label>Email</label>\n\n          <input type=\"email\" name=\"email\" class=\"form-control\" ng-model=\"vm.user.email\"\n                 required\n                 mongoose-error/>\n          <p class=\"help-block\" ng-show=\"form.email.$error.email && vm.submitted\">\n            Doesn\'t look like a valid email.\n          </p>\n          <p class=\"help-block\" ng-show=\"form.email.$error.required && vm.submitted\">\n            What\'s your email address?\n          </p>\n          <p class=\"help-block\" ng-show=\"form.email.$error.mongoose\">\n            {{ vm.errors.email }}\n          </p>\n        </div>\n\n        <div class=\"form-group\" ng-class=\"{ \'has-success\': form.password.$valid && vm.submitted,\n                                            \'has-error\': form.password.$invalid && vm.submitted }\">\n          <label>Password</label>\n\n          <input type=\"password\" name=\"password\" class=\"form-control\" ng-model=\"vm.user.password\"\n                 ng-minlength=\"3\"\n                 required\n                 mongoose-error/>\n          <p class=\"help-block\"\n             ng-show=\"(form.password.$error.minlength || form.password.$error.required) && vm.submitted\">\n            Password must be at least 3 characters.\n          </p>\n          <p class=\"help-block\" ng-show=\"form.password.$error.mongoose\">\n            {{ vm.errors.password }}\n          </p>\n        </div>\n\n        <div class=\"form-group\" ng-class=\"{ \'has-success\': form.confirmPassword.$valid && vm.submitted,\n                                            \'has-error\': form.confirmPassword.$invalid && vm.submitted }\">\n          <label>Confirm Password</label>\n          <input type=\"password\" name=\"confirmPassword\" class=\"form-control\" ng-model=\"vm.user.confirmPassword\"\n                 match=\"vm.user.password\"\n                 ng-minlength=\"3\" required/>\n          <p class=\"help-block\"\n             ng-show=\"form.confirmPassword.$error.match && vm.submitted\">\n            Passwords must match.\n          </p>\n        </div>\n\n        <div>\n          <button class=\"btn btn-inverse btn-lg btn-register\" type=\"submit\">\n            Sign up\n          </button>\n          <a class=\"btn btn-default btn-lg btn-login\" ui-sref=\"login\">\n            Login\n          </a>\n        </div>\n\n        <hr/>\n        <div class=\"row\">\n          <div class=\"col-sm-4 col-md-3\">\n            <oauth-buttons classes=\"btn-block\"></oauth-buttons>\n          </div>\n        </div>\n      </form>\n    </div>\n  </div>\n  <hr>\n</div>\n");
$templateCache.put("app/components/login/login.html","<div layout=\"column\" ng-cloak class=\"md-inline-form\" flex-offset-gt-md=\"25\" flex-gt-md=\"50\" flex=\"100\" layout-align=\"center none\">\n\n  <md-content md-theme=\"dark-grey\" layout-gt-sm=\"row\" layout-padding>\n        <h1>Login</h1>\n  </md-content>\n\n  <md-content layout-padding>\n      <form ng-submit=\"$ctrl.login(form)\"  name=\"form\" novalidate>\n        <md-input-container class=\"md-block\">\n            <label>Email</label>\n            <input ng-model=\"$ctrl.user.email\" type=\"email\" required>\n        </md-input-container>\n        <md-input-container class=\"md-block\">\n            <label>Password</label>\n            <input ng-model=\"$ctrl.user.password\" type=\"password\" required>\n        </md-input-container>\n        <md-button type=\"submit\">Enter</md-button>\n      </form>\n  </md-content>\n\n</div>");
$templateCache.put("app/components/mainNavBar/mainNavBar.html","<style>\n    #container_fm{\n        position:relative;\n    }\n    #fabmenu {\n        position: absolute;\n        top:25px\n        \n    }\n</style>\n\n<md-toolbar id=\"container_fm\" layout=\"row\" flex ng-cloack>\n\n    <md-button id=\"fabmenu\" class=\"md-fab\" ng-click=\"$ctrl.toggleLeft()\">\n        <md-icon><i class=\"material-icons\">menu</i></md-icon>\n    </md-button>\n    <span flex></span>\n\n    <md-menu md-position-mode=\"target-right target\">\n        <md-button aria-label=\"Open demo menu\" class=\"md-icon-button\" ng-click=\"$mdOpenMenu($event)\">\n            <i class=\"material-icons\" >more_vert</i>\n        </md-button>\n        <md-menu-content width=\"4\" >\n            <md-menu-item ng-repeat=\"item in $ctrl.menuList\" >\n                <md-button ng-click=\"$ctrl.menuListClick($index)\">\n                    <div layout=\"row\" flex>\n                        <p flex>{{item.label}}</p>\n                    </div>\n                </md-button>\n            </md-menu-item>\n        </md-menu-content>\n    </md-menu>\n</md-toolbar>\n\n<md-sidenav \n    class=\"md-sidenav-left\" \n    md-component-id=\"left\" \n    md-disable-backdrop \n    md-whiteframe=\"4\" \n    >\n  <md-toolbar>\n    <h1 class=\"md-toolbar-tools\">{{$ctrl.sidenav.title}}</h1>\n  </md-toolbar>\n\n  <md-content layout-margin class=\"\">\n    <md-card md-theme=\"dark-indigo\" md-theme-watch ng-repeat=\"card in $ctrl.cardList\">\n        <md-card-title>\n          <md-card-title-text>\n            <span class=\"md-headline\">{{card.title}}</span>\n            <span class=\"md-subhead\">{{card.subTitle}}</span>\n          </md-card-title-text>\n          <md-card-title-media>\n            <div class=\"md-media-sm card-media\">\n                <img src=\"{{card.imgSrc}}\" alt=\"\">\n            </div>\n          </md-card-title-media>\n        </md-card-title>\n        <md-card-actions layout=\"row\" layout-align=\"end center\">\n          <md-button class=\"md-raised\" ng-click=\"$ctr.cardListClick($index)\">{{card.btnLabel}}</md-button>\n        </md-card-actions>\n      </md-card>\n\n    <md-button ng-click=\"$ctrl.toggleLeft()\" class=\"md-raised\">\n      close\n    </md-button>\n  </md-content>\n</md-sidenav>");
$templateCache.put("app/directives/formAic/formAic.html","<h3>Lista de attributos compatibles</h3>\n<ul>\n    <li ng-repeat=\"a in find(record.attributes,\'id\',\'keys\',\'listOfObj\')\">id:{{a.id}} - dataType: {{a.string}}</li>\n</ul>\n\n<form novalidate name=\"myForm\" class=\"container-fluid\">\n  <div id=\"_id\" class=\"form-group has-feedback\">\n    <label for=\"\">_id</label>\n    <input type=\"text\" ng-model=\"record._id\"  class=\"form-control\" disabled>\n  </div>\n\n  <div id=\"type\" class=\"form-group has-feedback\">\n    <label for=\"\">Tipo de schema</label>\n    <select ng-model=\"record.type\" class=\"form-control\">\n        <option value=\"schema\">schema</option>\n        <option value=\"input\">input</option>\n        <option value=\"attrInputConf\">attrInputConf</option>\n        <option value=\"schmAttrInputConf\">schmAttrInputConf</option>\n    </select>\n  </div>\n\n  <div id=\"iname\" class=\"form-group has-feedback\">\n    <label for=\"\">name</label>\n    <input type=\"text\" ng-model=\"record.name\" class=\"form-control\" disabled>\n  </div>\n\n  <div id=\"description\" class=\"form-group has-feedback\">\n    <label for=\"\">Descripción</label>\n    <input type=\"text\" ng-model=\"record.getsetString(\'description\',\'string\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\n\n  <div id=\"attributes\" class=\"well\">\n    <h3>Attributes</h3>\n    <div id=\"blockAttr\" class=\"form-group has-feedback\">\n        <label for=\"\">id: {{attr.id}}</label>\n        <input type=\"text\" ng-model=\"record.getsetFlatNameReplica()\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n\n    <div id=\"attrDatatype\" class=\"form-group has-feedback\">\n        <label for=\"\">Tipo de dato del input : Valor que se ingresa a la base de datos</label>\n        <select class=\"form-control\" ng-model=\"record.getsetSelect(\'dataType\',\'string\')\" \n        ng-model-options=\"{ getterSetter: true }\" ng-options=\"item as item for item in dataTypes track by item\">\n        </select>\n    </div>\n\n\n    <div id=\"attrName\" class=\"form-group has-feedback\">\n        <label for=\"\">Nombre</label>\n        <input type=\"text\" ng-model=\"record.getsetFlatNameReplica()\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n\n    <div id=\"attrAttribute\" class=\"form-group has-feedback\">\n        <label for=\"\">Vínculo con el attributo: referencia</label>\n        <input type=\"text\" ng-model=\"record.getsetString(\'attribute\',\'reference\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n    <div id=\"attrInput\" class=\"form-group has-feedback\">\n        <label for=\"\">Vínculo con el input: referencia</label>\n        <input type=\"text\" ng-model=\"record.getsetString(\'input\',\'reference\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n\n    <div id=\"attrAttributes\" class=\"form-group has-feedback\">\n        <label for=\"\">Attributos incorporados al Schema</label>\n        <input type=\"text\" ng-model=\"record.getsetOptionList(\'attributes\',\'list\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n\n    <div id=\"listOfObj\" class=\"form-group has-feedback\">\n        <table class=\"table\">\n            <tr>\n                <td>ID</td>\n                <td>DataType</td>\n                <td></td>\n            </tr>\n        </table>\n    </div>\n\n\n\n    <div id=\"addAttrForm\" class=\"well\">\n        \n    </div>\n    <div id=\"addAttrSelector\" class=\"form-group has-feedback\">\n        <label for=\"\">id</label>\n        <input type=\"text\" class=\"form-control\">\n        <label for=\"\">dataType</label>\n        <select class=\"form-control\">\n            <option value=\"string\">string</option>\n            <option value=\"number\">number</option>\n            <option value=\"boolean\">boolean</option>\n            <option value=\"date\">date</option>\n            <option value=\"list\">list</option>\n            <option value=\"listOfObj\">listOfObj</option>\n            <option value=\"reference\">reference</option>\n        </select>\n        <br>\n        <button id=\"btnAddAttr\" type=\"button\" class=\"form-control btn btn-success\">Add attribute</button>\n    </div>\n  </div>\n  <button > {{aa}}</button>\n</form>\n\n\n<!-- themes segun datatypes -->\n<!--- number --->\n<div id=\"numberTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"number\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\n<!--- string --->\n<div id=\"stringTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"text\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\n<!--- date --->\n<div id=\"dateTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"date\" ng-model-options=\"{ getterSetter: true, updateOn: \'blur\' }\" class=\"form-control\" >\n</div>\n<!--- list --->\n<!--- listOfObj --->\n<!--- boolean --->\n<div id=\"booleanTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"checkbox\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\nuib-datepicker-popup=\"dd-MMMM-yyyy\"\n{{record}}\n\n<div id=\"saveBlock\" class=\"well\">\n    <button type=\"button\" class=\"btn btn-lg btn-success\">SAVE</button>\n</div>");
$templateCache.put("app/directives/formAttr/formAttr.html","<h3>Lista de attributos compatibles</h3>\n<ul>\n    <li ng-repeat=\"a in find(record.attributes,\'id\',\'keys\',\'listOfObj\')\">id:{{a.id}} - dataType: {{a.string}}</li>\n</ul>\n\n<form novalidate name=\"myForm\" class=\"container-fluid\">\n  <div id=\"_id\" class=\"form-group has-feedback\">\n    <label for=\"\">_id</label>\n    <input type=\"text\" ng-model=\"record._id\"  class=\"form-control\" disabled>\n  </div>\n\n  <div id=\"type\" class=\"form-group has-feedback\">\n    <label for=\"\">Tipo de schema</label>\n    <select ng-model=\"record.type\" class=\"form-control\">\n        <option value=\"schema\">schema</option>\n        <option value=\"attribute\">attribute</option>\n        <option value=\"input\">input</option>\n        <option value=\"attrInputConf\">attrInputConf</option>\n        <option value=\"schmAttrInputConf\">schmAttrInputConf</option>\n    </select>\n  </div>\n\n  <div id=\"iname\" class=\"form-group has-feedback\">\n    <label for=\"\">name</label>\n    <input type=\"text\" ng-model=\"record.name\" class=\"form-control\" disabled>\n  </div>\n\n  <div id=\"description\" class=\"form-group has-feedback\">\n    <label for=\"\">Descripción</label>\n    <input type=\"text\" ng-model=\"record.getsetString(\'description\',\'string\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\n\n  <div id=\"attributes\" class=\"well\">\n    <h3>Attributes</h3>\n    <div id=\"blockAttr\" class=\"form-group has-feedback\">\n        <label for=\"\">id: {{attr.id}}</label>\n        <input type=\"text\" ng-model=\"record.getsetFlatNameReplica()\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n\n    <div id=\"attrDatatype\" class=\"form-group has-feedback\">\n        <label for=\"\">Tipo de dato del input : Valor que se ingresa a la base de datos</label>\n        <select class=\"form-control\" ng-model=\"record.getsetSelect(\'dataType\',\'string\')\" \n        ng-model-options=\"{ getterSetter: true }\" ng-options=\"item as item for item in dataTypes track by item\">\n        </select>\n    </div>\n\n\n    <div id=\"attrName\" class=\"form-group has-feedback\">\n        <label for=\"\">Nombre</label>\n        <input type=\"text\" ng-model=\"record.getsetFlatNameReplica()\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n    <div id=\"attrSchema\" class=\"form-group has-feedback\">\n        <label for=\"\">Vínculo con el attributo: referencia</label>\n        <input type=\"text\" ng-model=\"record.getsetString(\'schema\',\'reference\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n\n    <div id=\"attrAttribute\" class=\"form-group has-feedback\">\n        <label for=\"\">Vínculo con el attributo: referencia</label>\n        <input type=\"text\" ng-model=\"record.getsetString(\'attribute\',\'reference\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n    <div id=\"attrInput\" class=\"form-group has-feedback\">\n        <label for=\"\">Vínculo con el input: referencia</label>\n        <input type=\"text\" ng-model=\"record.getsetString(\'input\',\'reference\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n\n    <div id=\"attrAttributes\" class=\"form-group has-feedback\">\n        <label for=\"\">Attributos incorporados al Schema</label>\n        <input type=\"text\" ng-model=\"record.getsetOptionList(\'attributes\',\'list\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n\n    <div id=\"listOfObj\" class=\"form-group has-feedback\">\n        <table class=\"table\">\n            <tr>\n                <td>ID</td>\n                <td>DataType</td>\n                <td></td>\n            </tr>\n        </table>\n    </div>\n\n\n\n    <div id=\"addAttrForm\" class=\"well\">\n        \n    </div>\n    <div id=\"addAttrSelector\" class=\"form-group has-feedback\">\n        <label for=\"\">id</label>\n        <input type=\"text\" class=\"form-control\">\n        <label for=\"\">dataType</label>\n        <select class=\"form-control\">\n            <option value=\"string\">string</option>\n            <option value=\"number\">number</option>\n            <option value=\"boolean\">boolean</option>\n            <option value=\"date\">date</option>\n            <option value=\"list\">list</option>\n            <option value=\"listOfObj\">listOfObj</option>\n            <option value=\"reference\">reference</option>\n        </select>\n        <br>\n        <button id=\"btnAddAttr\" type=\"button\" class=\"form-control btn btn-success\">Add attribute</button>\n    </div>\n  </div>\n  <button > {{aa}}</button>\n</form>\n\n\n<!-- themes segun datatypes -->\n<!--- number --->\n<div id=\"numberTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"number\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\n<!--- string --->\n<div id=\"stringTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"text\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\n<!--- date --->\n<div id=\"dateTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"date\" ng-model-options=\"{ getterSetter: true, updateOn: \'blur\' }\" class=\"form-control\" >\n</div>\n<!--- list --->\n<div id=\"listTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"text\" ng-model-options=\"{ getterSetter: true, updateOn: \'blur\'}\" class=\"form-control\" >\n</div>\n<!--- listOfObj --->\n<!--- boolean --->\n<div id=\"booleanTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"checkbox\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\nuib-datepicker-popup=\"dd-MMMM-yyyy\"\n{{record}}\n\n<div id=\"saveBlock\" class=\"well\">\n    <button type=\"button\" class=\"btn btn-lg btn-success\">SAVE</button>\n</div>");
$templateCache.put("app/directives/formBuilder/formBuilder.html","<h3>Lista de attributos compatibles</h3>\n<ul>\n    <li ng-repeat=\"a in find(record.attributes,\'id\',\'keys\',\'listOfObj\')\">id:{{a.id}} - dataType: {{a.string}}</li>\n</ul>\n\n<form novalidate name=\"myForm\" class=\"container-fluid\">\n  <div id=\"_id\" class=\"form-group has-feedback\">\n    <label for=\"\">_id</label>\n    <input type=\"text\" ng-model=\"record._id\"  class=\"form-control\" disabled>\n  </div>\n\n  <div id=\"type\" class=\"form-group has-feedback\">\n    <label for=\"\">Tipo de schema</label>\n    <select ng-model=\"record.type\" class=\"form-control\">\n        <option value=\"schema\">schema</option>\n        <option value=\"input\">input</option>\n        <option value=\"attrInputConf\">attrInputConf</option>\n        <option value=\"schmAttrInputConf\">schmAttrInputConf</option>\n    </select>\n  </div>\n\n  <div id=\"iname\" class=\"form-group has-feedback\">\n    <label for=\"\">name</label>\n    <input type=\"text\" ng-model=\"record.getsetFLString(\'name\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" disabled>\n  </div>\n\n  <div id=\"description\" class=\"form-group has-feedback\">\n    <label for=\"\">Descripción</label>\n    <input type=\"text\" ng-model=\"record.getsetString(\'description\',\'string\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\n\n  <div id=\"attributes\" class=\"well\">\n    <h3>Attributes</h3>\n    <div id=\"blockAttr\" class=\"form-group has-feedback\">\n        <label for=\"\">id: {{attr.id}}</label>\n        <input type=\"text\" ng-model=\"record.getsetFlatNameReplica()\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n\n\n\n\n    <div id=\"attrName\" class=\"form-group has-feedback\">\n        <label for=\"\">Nombre</label>\n        <input type=\"text\" ng-model=\"record.getsetFlatNameReplica()\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n    <div id=\"attrAttributes\" class=\"form-group has-feedback\">\n        <label for=\"\">Attributos incorporados al Schema</label>\n        <input type=\"text\" ng-model=\"record.getsetOptionList(\'attributes\',\'list\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n\n    <div id=\"addAttrForm\" class=\"well\">\n        \n    </div>\n    <div id=\"addAttrSelector\" class=\"form-group has-feedback\">\n        <label for=\"\">id</label>\n        <input type=\"text\" class=\"form-control\">\n        <label for=\"\">dataType</label>\n        <select class=\"form-control\">\n            <option value=\"string\">string</option>\n            <option value=\"number\">number</option>\n            <option value=\"boolean\">boolean</option>\n            <option value=\"date\">date</option>\n            <option value=\"list\">list</option>\n            <option value=\"listOfObj\">listOfObj</option>\n            <option value=\"reference\">reference</option>\n        </select>\n        <br>\n        <button id=\"btnAddAttr\" type=\"button\" class=\"form-control btn btn-success\">Add attribute</button>\n    </div>\n  </div>\n  <button > {{aa}}</button>\n</form>\n\n\n<!-- themes segun datatypes -->\n<!--- number --->\n<div id=\"numberTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"number\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\n<!--- string --->\n<div id=\"stringTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"text\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\n<!--- date --->\n<div id=\"dateTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"date\" ng-model-options=\"{ getterSetter: true, updateOn: \'blur\' }\" class=\"form-control\" >\n</div>\n<!--- list --->\n<!--- listOfObj --->\n<!--- boolean --->\n<div id=\"booleanTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"checkbox\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\nuib-datepicker-popup=\"dd-MMMM-yyyy\"\n{{record}}\n\n<div id=\"saveBlock\" class=\"well\">\n    <button type=\"button\" class=\"btn btn-lg btn-success\">SAVE</button>\n</div>");
$templateCache.put("app/directives/formInput/formInput.html","<h3>Lista de attributos compatibles</h3>\n<ul>\n    <li ng-repeat=\"a in find(record.attributes,\'id\',\'keys\',\'listOfObj\')\">id:{{a.id}} - dataType: {{a.string}}</li>\n</ul>\n\n<form novalidate name=\"myForm\" class=\"container-fluid\">\n  <div id=\"_id\" class=\"form-group has-feedback\">\n    <label for=\"\">_id</label>\n    <input type=\"text\" ng-model=\"record._id\"  class=\"form-control\" disabled>\n  </div>\n\n  <div id=\"type\" class=\"form-group has-feedback\">\n    <label for=\"\">Tipo de schema</label>\n    <select ng-model=\"record.type\" class=\"form-control\">\n        <option value=\"schema\">schema</option>\n        <option value=\"input\">input</option>\n        <option value=\"attrInputConf\">attrInputConf</option>\n        <option value=\"schmAttrInputConf\">schmAttrInputConf</option>\n    </select>\n  </div>\n\n  <div id=\"iname\" class=\"form-group has-feedback\">\n    <label for=\"\">name</label>\n    <input type=\"text\" ng-model=\"record.name\" class=\"form-control\" disabled>\n  </div>\n\n  <div id=\"description\" class=\"form-group has-feedback\">\n    <label for=\"\">Descripción</label>\n    <input type=\"text\" ng-model=\"record.getsetString(\'description\',\'string\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\n\n  <div id=\"attributes\" class=\"well\">\n    <h3>Attributes</h3>\n    <div id=\"blockAttr\" class=\"form-group has-feedback\">\n        <label for=\"\">id: {{attr.id}}</label>\n        <input type=\"text\" ng-model=\"record.getsetFlatNameReplica()\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n\n    <div id=\"attrDatatype\" class=\"form-group has-feedback\">\n        <label for=\"\">Tipo de dato del input : Valor que se ingresa a la base de datos</label>\n        <select class=\"form-control\" ng-model=\"record.getsetSelect(\'dataType\',\'string\')\" \n        ng-model-options=\"{ getterSetter: true }\" ng-options=\"item as item for item in dataTypes track by item\">\n        </select>\n    </div>\n\n\n    <div id=\"attrName\" class=\"form-group has-feedback\">\n        <label for=\"\">Nombre</label>\n        <input type=\"text\" ng-model=\"record.getsetFlatNameReplica()\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n\n\n\n    <div id=\"attrAttributes\" class=\"form-group has-feedback\">\n        <label for=\"\">Attributos incorporados al Schema</label>\n        <input type=\"text\" ng-model=\"record.getsetOptionList(\'attributes\',\'list\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n\n    <div id=\"listOfObj\" class=\"form-group has-feedback\">\n        <table class=\"table\">\n            <tr>\n                <td>ID</td>\n                <td>DataType</td>\n                <td></td>\n            </tr>\n        </table>\n    </div>\n\n\n\n    <div id=\"addAttrForm\" class=\"well\">\n        \n    </div>\n    <div id=\"addAttrSelector\" class=\"form-group has-feedback\">\n        <label for=\"\">id</label>\n        <input type=\"text\" class=\"form-control\">\n        <label for=\"\">dataType</label>\n        <select class=\"form-control\">\n            <option value=\"string\">string</option>\n            <option value=\"number\">number</option>\n            <option value=\"boolean\">boolean</option>\n            <option value=\"date\">date</option>\n            <option value=\"list\">list</option>\n            <option value=\"listOfObj\">listOfObj</option>\n            <option value=\"reference\">reference</option>\n        </select>\n        <br>\n        <button id=\"btnAddAttr\" type=\"button\" class=\"form-control btn btn-success\">Add attribute</button>\n    </div>\n  </div>\n  <button > {{aa}}</button>\n</form>\n\n\n<!-- themes segun datatypes -->\n<!--- number --->\n<div id=\"numberTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"number\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\n<!--- string --->\n<div id=\"stringTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"text\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\n<!--- date --->\n<div id=\"dateTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"date\" ng-model-options=\"{ getterSetter: true, updateOn: \'blur\' }\" class=\"form-control\" >\n</div>\n<!--- list --->\n<!--- listOfObj --->\n<!--- boolean --->\n<div id=\"booleanTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"checkbox\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\nuib-datepicker-popup=\"dd-MMMM-yyyy\"\n{{record}}\n\n\n<div id=\"saveBlock\" class=\"well\">\n    <button type=\"button\" class=\"btn btn-lg btn-success\">SAVE</button>\n</div>");
$templateCache.put("app/directives/formSaic/formSaic.html","<h3>Lista de attributos compatibles</h3>\n<ul>\n    <li ng-repeat=\"a in find(record.attributes,\'id\',\'keys\',\'listOfObj\')\">id:{{a.id}} - dataType: {{a.string}}</li>\n</ul>\n\n<form novalidate name=\"myForm\" class=\"container-fluid\">\n  <div id=\"_id\" class=\"form-group has-feedback\">\n    <label for=\"\">_id</label>\n    <input type=\"text\" ng-model=\"record._id\"  class=\"form-control\" disabled>\n  </div>\n\n  <div id=\"type\" class=\"form-group has-feedback\">\n    <label for=\"\">Tipo de schema</label>\n    <select ng-model=\"record.type\" class=\"form-control\">\n        <option value=\"schema\">schema</option>\n        <option value=\"input\">input</option>\n        <option value=\"attrInputConf\">attrInputConf</option>\n        <option value=\"schmAttrInputConf\">schmAttrInputConf</option>\n    </select>\n  </div>\n<div id=\"description\" class=\"form-group has-feedback\">\n    <label for=\"\">Descripción</label>\n    <input type=\"text\" ng-model=\"record.getsetString(\'description\',\'string\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\n  <div id=\"iname\" class=\"form-group has-feedback\">\n    <label for=\"\">name</label>\n    <input type=\"text\" ng-model=\"record.name\" class=\"form-control\" disabled>\n  </div>\n\n  <div id=\"attributes\" class=\"well\">\n    <h3>Attributes</h3>\n    <div id=\"blockAttr\" class=\"form-group has-feedback\">\n        <label for=\"\">id: {{attr.id}}</label>\n        <input type=\"text\" ng-model=\"record.getsetFlatNameReplica()\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n\n    <div id=\"attrDatatype\" class=\"form-group has-feedback\">\n        <label for=\"\">Tipo de dato del input : Valor que se ingresa a la base de datos</label>\n        <select class=\"form-control\" ng-model=\"record.getsetSelect(\'dataType\',\'string\')\" \n        ng-model-options=\"{ getterSetter: true }\" ng-options=\"item as item for item in dataTypes track by item\">\n        </select>\n    </div>\n\n\n    <div id=\"attrName\" class=\"form-group has-feedback\">\n        <label for=\"\">Nombre</label>\n        <input type=\"text\" ng-model=\"record.getsetFlatNameReplica()\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n    <div id=\"attrSchema\" class=\"form-group has-feedback\">\n        <label for=\"\">Vínculo con el attributo: referencia</label>\n        <input type=\"text\" ng-model=\"record.getsetString(\'schema\',\'reference\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n\n    <div id=\"attrAttribute\" class=\"form-group has-feedback\">\n        <label for=\"\">Vínculo con el attributo: referencia</label>\n        <input type=\"text\" ng-model=\"record.getsetString(\'attribute\',\'reference\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n    <div id=\"attrInput\" class=\"form-group has-feedback\">\n        <label for=\"\">Vínculo con el input: referencia</label>\n        <input type=\"text\" ng-model=\"record.getsetString(\'input\',\'reference\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n\n    <div id=\"attrAttributes\" class=\"form-group has-feedback\">\n        <label for=\"\">Attributos incorporados al Schema</label>\n        <input type=\"text\" ng-model=\"record.getsetOptionList(\'attributes\',\'list\')\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n    </div>\n\n    <div id=\"listOfObj\" class=\"form-group has-feedback\">\n        <table class=\"table\">\n            <tr>\n                <td>ID</td>\n                <td>DataType</td>\n                <td></td>\n            </tr>\n        </table>\n    </div>\n\n\n\n    <div id=\"addAttrForm\" class=\"well\">\n        \n    </div>\n    <div id=\"addAttrSelector\" class=\"form-group has-feedback\">\n        <label for=\"\">id</label>\n        <input type=\"text\" class=\"form-control\">\n        <label for=\"\">dataType</label>\n        <select class=\"form-control\">\n            <option value=\"string\">string</option>\n            <option value=\"number\">number</option>\n            <option value=\"boolean\">boolean</option>\n            <option value=\"date\">date</option>\n            <option value=\"list\">list</option>\n            <option value=\"listOfObj\">listOfObj</option>\n            <option value=\"reference\">reference</option>\n        </select>\n        <br>\n        <button id=\"btnAddAttr\" type=\"button\" class=\"form-control btn btn-success\">Add attribute</button>\n    </div>\n  </div>\n  <button > {{aa}}</button>\n</form>\n\n\n<!-- themes segun datatypes -->\n<!--- number --->\n<div id=\"numberTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"number\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\n<!--- string --->\n<div id=\"stringTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"text\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\n<!--- date --->\n<div id=\"dateTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"date\" ng-model-options=\"{ getterSetter: true, updateOn: \'blur\' }\" class=\"form-control\" >\n</div>\n<!--- list --->\n<!--- listOfObj --->\n<!--- boolean --->\n<div id=\"booleanTheme\" class=\"form-group has-feedback\">\n    <label for=\"\"></label>\n    <input type=\"checkbox\" ng-model-options=\"{ getterSetter: true }\" class=\"form-control\" >\n</div>\nuib-datepicker-popup=\"dd-MMMM-yyyy\"\n{{record}}\n\n<div id=\"saveBlock\" class=\"well\">\n    <button type=\"button\" class=\"btn btn-lg btn-success\">SAVE</button>\n</div>");}]);