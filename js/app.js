(function () {
    var app = angular.module('toDoList', []);

    //directive to link list html template
    app.directive('list', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/list.html',
        };
    });
    //generalObjects
    app.factory('genObj', function (gettEr, settEr) {
            return {
                setTab: function (tabSelected) {
                    if (tabSelected = null) {

                    } else {

                    }
                },
                ifEmpty: function ($scope, storageName) {
                    if (gettEr.localJson(storageName) === null) {
                        var promise = gettEr.serverJson('ajax', 'savedLists');

                        promise.then(function (payload) {
                            settEr.toLocal(storageName, payload, 'fromServer');
                        })
                    } else {
                        $scope.items = gettEr.localJson(storageName);
                    }
                }
            };
        })
        //getterObjects
        .factory('gettEr', function ($http, $window) {
            return {
                serverJson: function (fileLocation, fileName) {
                    return $http.get('../multiView/' + fileLocation + '/' + fileName + '.json')
                },
                localJson: function (storageName) {
                    jsonInfo = $window.localStorage && $window.localStorage.getItem(storageName);
                    return angular.fromJson(jsonInfo);
                }
            };
        })
        //setterObjects
        .factory('settEr', function ($window, gettEr) {
            return {
                toLocal: function (storageName, val, infoOrigin) {
                    var newVal;
                    switch (infoOrigin) {
                    case "fromUser":
                        toLocal = gettEr.localJson(storageName);
                        newVal = toLocal.concat(val);
                        break;
                    case "fromDelete":
                        newVal = val;
                        break;
                    case "fromServer":
                        newVal = val.data[storageName];
                        break;
                    }
                    toJson = angular.toJson(newVal);
                    return $window.localStorage && $window.localStorage.setItem(storageName, toJson);
                },
                toServer: function (fileLocation, fileName, listId) {
                    return $http.post('../multiView/' + fileLocation + '/' + fileName + '.json');
                }
            };
        })
        //removeObjects
        .factory('removEr', function ($window, genObj, gettEr, settEr) {
            return {
                deleteItem: function ($index, storageName) {

                    localJson = gettEr.localJson(storageName);
                    val = localJson.splice($index, 1);

                    $window.localStorage && $window.localStorage.removeItem(storageName);

                    settEr.toLocal(storageName, localJson, "fromDelete");
                }
            }
        });

    app.controller('panelController', function () {
            this.tab = 1;

            this.selectTab = function (tabSelected) {
                this.tab = tabSelected;
            };

            this.isSelected = function (checkTab) {
                return this.tab === checkTab;
            };
        })
        .controller('workController', function (genObj, gettEr, settEr, removEr) {
            var list = this,
                storageName = 'work';

            if (gettEr.localJson(storageName) === null) {
                promise = gettEr.serverJson('ajax', 'savedLists');

                promise.then(function (payload) {
                    list.items = payload.data[storageName];
                })
            }

            //if localStorage is empty fetch Json through Ajax and place
            genObj.ifEmpty(list, storageName);

            list.addItem = function () {
                val = {
                    string: list.itemInput
                };

                settEr.toLocal(storageName, val, 'fromUser');
                list.items.push(val);
                list.itemInput = '';
            }

            list.deleteItem = function ($index) {
                list.items.splice($index, 1);
                removEr.deleteItem($index, storageName);
            }
        })
        .controller('groceriesController', function (genObj, gettEr, settEr, removEr) {
            var list = this,
                storageName = 'groceries';

            if (gettEr.localJson(storageName) === null) {
                promise = gettEr.serverJson('ajax', 'savedLists');

                promise.then(function (payload) {
                    list.items = payload.data[storageName];
                })
            }

            genObj.ifEmpty(list, storageName);

            list.addItem = function () {
                val = {
                    string: list.itemInput
                };

                settEr.toLocal(storageName, val, 'fromUser');
                list.items.push(val);
                list.itemInput = '';
            }

            list.deleteItem = function ($index) {
                list.items.splice($index, 1);
                removEr.deleteItem($index, storageName);
            }
        })
        .controller('choresController', function (genObj, gettEr, settEr, removEr) {
            var list = this,
                storageName = 'chores';

            if (gettEr.localJson(storageName) === null) {
                promise = gettEr.serverJson('ajax', 'savedLists');

                promise.then(function (payload) {
                    list.items = payload.data[storageName];
                })
            }

            genObj.ifEmpty(list, storageName);

            list.addItem = function () {
                val = {
                    string: list.itemInput
                };

                settEr.toLocal(storageName, val, 'fromUser');
                list.items.push(val);
                list.itemInput = '';
            }

            list.deleteItem = function ($index) {
                list.items.splice($index, 1);
                removEr.deleteItem($index, storageName);
            }
        });
})();