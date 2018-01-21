var authConfig = {
    headers: {
        Authorization: "Basic ZWxld2luc286RXlhbDMwMDc="
    }
};

var app = angular.module("iridizeApp", ['angularUtils.directives.dirPagination']);
app.controller("appCtrl", function ($scope, $http) {
    $scope.baseUrl = "https://cs1.iridize.com/api/latest/app/8MXQlGj6R8Ogx2PohL9E+w/guide/";
    $http.get($scope.baseUrl, authConfig).then(function (res) {
        $scope.rows = res.data;
        createFilterList();
        setIsChecked(false, false);
    });

    $scope.guidesPerPage = 30;
    $scope.checked = [];
    $scope.uniqueTypes = [];


    $scope.onCheckBoxClicked = function () {
        var row = this["row"];
        var apiName = getApiName(row);

        if (row.isChecked === true) {
            var index = $scope.checked.indexOf(apiName);
            $scope.checked.splice(index, 1);
            row.isChecked = false;
        } else {
            $scope.checked.push(apiName);
            row.isChecked = true;
        }
    };

    $scope.onSelectAllClicked = function () {
        if ($scope.checked.length === $scope.rows.length) {
            setIsChecked(false, false);
            $scope.checked = [];
        } else {
            $scope.checked = [];
            setIsChecked(true, true);
        }
    };

    $scope.doGuideAction = function (cmd) {
        var apiName = encodeURIComponent(getApiName(this["row"]));
        var url = $scope.baseUrl + apiName + "/" + cmd;
        $http.get(url, authConfig).then(function (res) {
        });
    };

    $scope.onBulkButtonPressed = function () {
        var bulkAction = $scope.bulkChoice;
        for (var check in $scope.checked) {
            var apiName = encodeURIComponent($scope.checked[check]);
            var url = $scope.baseUrl + apiName + "/" + bulkAction;
            $http.get(url, authConfig).then(function (res) {
            });
        }
    };

    $scope.onSearchButtonPressed = function () {
        var search = $scope.searchChoice;
        search = encodeURIComponent(search);
        var url = $scope.baseUrl + "?k=" + search + "/";
        $http.get(url, authConfig).then(function (res) {
            $scope.rows = res.data;
            $scope.searchChoice = "";
            createFilterList();

        });
    };

    function createFilterList() {
        var types = [];
        $scope.uniqueTypes = [];
        for (var row in $scope.rows) {
            types.push($scope.rows[row].guide_type);
        }
        $scope.uniqueTypes = types.filter(function (item, i, arr) {
            return arr.indexOf(item) === i;
        });
    }

    function setIsChecked(bool, selectAll) {
        for (var row in $scope.rows) {
            $scope.rows[row].isChecked = bool;
            if (selectAll) {
                var apiName = getApiName($scope.rows[row]);
                $scope.checked.push(apiName);
            }
        }
    }

    function getApiName(arr) {
        var apiName = arr.apiName;
        if (apiName === undefined) {
            apiName = arr.api_name;
        }
        return apiName;
    }

});


