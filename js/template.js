function $(id){
    return angular.element(document.querySelector(id))
}    
var products = [
    {
        name:'HP Pavilion 15-n012TX Laptop (4th Generation Intel Core i5-4200U- 4GB RAM- 1TB HDD- 15.6 I...',
        imgUrl:'img/HP-Pavilion-15-n012TX-Laptop-SDL055278304-1-db1a0.jpg',
        price:'999',
        qty:1,
        vendorCode:'asdad333'
    },
    {
        name:'ZEBU Grey Half Polo T-Shirt',
        imgUrl:'img/ZEBU-Grey-Half-Polo-T-SDL737525832-1-b89df.jpg',
        price:'333',
        qty:1,
        vendorCode:'asdad334'
    },
    {
        name:'Allen Solly Blue Denim Slim Fit Jeans',
        imgUrl:'img/Allen-Solly-Blue-Denim-Slim-SDL712215964-1-f10f4.jpg',
        price:'5565',
        qty:1,
        vendorCode:'asdad332'
    },
    {
        name:'Hidesign Samantha Black Croc Finish Handbag',
        imgUrl:'img/SDL263002397_1370612452_image1-8a890.JPG',
        price:'744',
        qty:1,
        vendorCode:'asdad331'
    },
    {
        name:'Shoppertree White Maxi Skirt For Ki...',
        imgUrl:'img/Shoppertree-White-Maxi-Skirt-For-SDL173946633-1-4ffb5.jpg',
        price:'4464',
        qty:1,
        vendorCode:'asdad330'
    }
];


angular.module('services.cart', [])
    .service('Cart', ['$rootScope', 'LS', function ($rootScope, LS) { 

        this.getCart = function(){
            var cartJSON = LS.getData();
            $rootScope.cart = (cartJSON !== '' || null || undefined ) ? JSON.parse(cartJSON): {};
            if($rootScope.cart === undefined  || $rootScope.cart === null){
                $rootScope.cart = {};
            }
        }; 
 
        this.addItem = function(itemJson){
            var 
                itemJson = JSON.parse(itemJson)
            ;

            if($rootScope.cart.items === undefined){
              itemId = 'item0';
              $rootScope.cart.items = [];
            } else{
                for(var i in $rootScope.cart.items){

                    if($rootScope.cart.items[i].vendorCode == itemJson.vendorCode){
                        $rootScope.cart.items[i].qty++;
                        $rootScope.cart.items[i].itemTotal = $rootScope.cart.items[i].qty * $rootScope.cart.items[i].price;
                        this.save();
                        return
                    }
                }
                itemId='item'+($rootScope.cart.items.length+1);
            }

            itemJson.itemId = itemId;
            itemJson.itemTotal = itemJson.price * itemJson.qty;
            $rootScope.cart.items.push(itemJson);
            this.save();
        };
 
        this.addItems = function(items) {
            for(var i =0; i<items.length; i++){
                this.addItem(items[i]);
            }
        };
 
        this.save = function() {
            LS.setData(JSON.stringify($rootScope.cart));
        };

        this.remove = function (vendorCode) {
            for(var i in $rootScope.cart.items){
                if($rootScope.cart.items[i].vendorCode == vendorCode){
                    $rootScope.cart.items.splice(i,1);
                }
            }
            this.save();
        };
 
        this.clear = function() {
            LS.setData('{}')
        };
 
        this.persist = function() {


        };
 
        this.changeQuantity = function ( vendorCode, qty ){
            for(var i in $rootScope.cart.items){
                if($rootScope.cart.items[i].vendorCode == vendorCode){
                    $rootScope.cart.items[i].qty = qty;
                    $rootScope.cart.items[i].itemTotal = qty * $rootScope.cart.items[i].price;
                }
            }
            
            this.save();
        };
 
        this.refresh = function() {
            
        };


    }]).controller('cartController',['$scope','$rootScope','Cart','LS',function($scope, $rootScope, Cart, LS){
        
        $scope.products = products;

        $rootScope.$watch('cart', function(){
            Cart.getCart();
            $scope.cart = $rootScope.cart;
        })

        $scope.buy = function(objId){
            var itemJson = $('#'+objId).attr('data-json');
            Cart.addItem(itemJson);
        }

        $scope.total = function(){
            var cartTotal = 0;

            angular.forEach($scope.cart.items, function(cartItem){
                cartTotal += cartItem.qty * cartItem.price;
            });
            return cartTotal;
        }

        $scope.update = function( vendorCode, qty ){
            Cart.changeQuantity( vendorCode, qty );
        };

        $scope.remove=function( objId, vendorCode ){
            Cart.remove(vendorCode);
            $('#'+objId).remove();

        };
    }])
    .factory("LS", function($window, $rootScope) {
    angular.element($window).on('storage', function(event) {
        if (event.key === 'cart') {
            try{
                $rootScope.$apply();
            }catch(e){}
        }
    });
    return {
        setData: function(val) {
            $window.localStorage && $window.localStorage.setItem('cart', val);
            return this;
        },
        getData: function() {
            return $window.localStorage && $window.localStorage.getItem('cart');
        }
    };
});