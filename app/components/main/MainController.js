app.controller('MainController', function($scope, $rootScope, Movie, $document, $window, $state){

    var vm = this; // vm stands for viewmodel

    // LOADING ======================
    // use $rootScope.$broadcast('loading'); to show data is loading
    // use $rootScope.$broadcast('loaded'); to show data was loaded
    // when loading = 0 (false), root loading "spinner" will dissapear
    vm.loading = 0;

    $scope.$on('loading', function() {
        vm.loading++;
    });
    $scope.$on('loaded', function() {
        vm.loading--;
    });

    $rootScope.$broadcast('loading');

    // INDEX =====================
    Movie.news()
        .success(function(data){
            $rootScope.$broadcast('loaded');
            $rootScope.movies = data.data;
        });


    // NAVIGATION ================
    var tvKey = new Sanatorium.KeyValues();

    vm.keyDown = function($event) {

        alert('keyCode: '+$event.keyCode);

        switch( $event.keyCode )
        {
            case tvKey.KEY_RETURN:
            case tvKey.KEY_PANEL_RETURN:
                Sanatorium.blockKeys();
                vm.back();
            break;
            case tvKey.KEY_LEFT:
                vm.left();
            break;
            case tvKey.KEY_RIGHT:
                vm.right();
            break;
            case tvKey.KEY_UP:
                vm.up();
            break;
            case tvKey.KEY_DOWN:
                vm.down();
            break;
            case tvKey.KEY_ENTER:
            case tvKey.KEY_PANEL_ENTER:
                vm.enter();
            break;

            case 71:
                // play
                vm.play();
            break;

            case 74:
                // pause

                vm.pause();
            break;

            default:
                alert("Unhandled key, code: "+$event.keyCode);
            break;
        }
    };

    vm.up = function() {
        $rootScope.$broadcast('up');
    };

    vm.down = function() {
        $rootScope.$broadcast('down');
    };

    vm.left = function() {
        $rootScope.$broadcast('left');
    };

    vm.right = function() {
        $rootScope.$broadcast('right');
    };

    vm.enter = function() {
        $rootScope.$broadcast('enter');
    };

    vm.back = function() {
        $rootScope.$broadcast('back');
    };

    vm.play = function() {
        $rootScope.$broadcast('play');
    };

    vm.pause = function() {
        $rootScope.$broadcast('pause');
    };

    $scope.xposition = 0;
    $scope.activeMain = false;
    $scope.activeMovie = 0;

    $scope.$on('right', function() {

        if ( $scope.xposition < $rootScope.movies.length + 1 ) {
            // Activate main area
            $rootScope.$broadcast('mainActivated');
        }

        // Navigate on xposition if main scope is active
        if ( $scope.activeMain && $scope.xposition < $rootScope.movies.length ) {
            $scope.xposition++;
            $scope.activeMovie++;
        }
    });

    $scope.$on('left', function() {
        // Navigate on xposition if main scope is active
        if ( $scope.activeMain ) {
            $scope.xposition--;
            $scope.activeMovie--;
        }

        if ( $scope.xposition < 1 ) {
            // Deactivate main area
            $rootScope.$broadcast('mainDeactivated');
        }
    });

    $scope.$on('mainActivated', function() {
        $scope.activeMain = true;
    });

    $scope.$on('mainDeactivated', function() {
        $scope.activeMain = false;
        $scope.xposition = 0;
        $scope.activeMovie = 0;
    });

    $scope.$on('enter', function(){

        if ( $scope.activeMain && $scope.activeMovie > 0 ) {

            var movie = $rootScope.movies[$scope.activeMovie - 1];
            $state.go('movie.show', {id: movie['id_item']});

        } else {

        }

    });

    $scope.$on('play', function(){
        $scope._video = document.getElementById("video");
        $scope._video.play();
    });

    $scope.$on('pause', function(){
        $scope._video.pause();
    });

    // go back to menu OR return to smartHUB (TV apps menu)
    $scope.$on('back', function(){

        if ( $scope.activeMain ) {
            $rootScope.$broadcast('mainDeactivated');
        } else {
           Sanatorium.exit();
        }

    });

    return vm;

});