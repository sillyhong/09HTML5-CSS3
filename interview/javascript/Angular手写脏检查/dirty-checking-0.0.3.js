/*
* @Author: Marte
* @Date:   2018-02-26 10:21:48
* @Last Modified by:   Marte
* @Last Modified time: 2018-02-26 16:03:06
*/

//结合了1和2版本
//整合事件绑定和属性绑定显示数据
//使用$digest实现数据脏检查

'use strict';
window.onload = function(){

    //$scope
   var scope = {
        increase: function(){
            this.data++
        },
        decrease: function(){
            this.data--
        },
        equal: function(){

        },
        data: 0,
        add: 3,
   }


  // 首先定义$scope构造函数、在定义原型方法$watch和$digest

  //Angular $scope
  function $scope(){
    this.$$watchList = []
  }

  //$scope原型方法 $watch $digest
  $scope.prototype.$watch = function(name, getNewValue, listener){
    var watch = {
      name: name,
      getNewValue: getNewValue,//获取最新的值
      listener: listener || function(){}//观察者
    };
    //自动把监听的变量添加到$$watachList队列中
    this.$$watchList.push(watch);
  }

  $scope.prototype.$digest = function(){
      // 默认为dirty
      var dirty = true
      //寻循环计数器
      var checkTimes = 0

      while(dirty){
        dirty = this.$$digestOnce()
        checkTimes++

        //更稳定的$digest  迭代的最大值TTL（time to live）
        if(checkTimes >=10 && dirty){
            throw new　Error('检测超过10次')
        }
      }
  }

  // 优化$digestOnce
  $scope.prototype.$$digestOnce = function(){
    var dirty
    var list = this.$$watchList
    for(var i = 0; i < list.length; i++){
        //发挥监听者的作用
        var watch = list[i]
        console.log(watch)
        // $digest 第一次调用，last 为undefined,所以一定会进行一次数据呈现.
        var newValue = watch.getNewValue(this.name)
        var oldValue = watch.last
        //判断数据是否为脏
        if(newValue !== oldValue){
          //调用listener方法
          watch.listener(newValue, oldValue)
          //是脏值
          dirty = true
        }else{
          dirty = false
        }

        //替换现在的新老值
        watch.last = newValue

        return dirty
    }
  }

//实例化scope
  var $scope = new $scope()
  $scope.sum = 0
  //一个watch对应一个变量
  $scope.$watch('sum', function(){
      $scope.sum = scope.data * scope.add
     // 这样调用，那么 this 就指的是当前监听器watch，所以可以得到name
    return $scope[this.name]
    // console.log('hey i have got newValue')
  },
  function(newValue, oldValue){
    scope.sum = newValue
    console.log('newValue:'+ newValue,'~~~~~~~~~', 'oldValue:' + oldValue)
  })

  function bind(){
    var list = document.querySelectorAll('[ng-click]');
    for(var i = 0, len = list.length; i < len; i++){
        list[i].onclick = (function(index){
            return function(){
              var func = this.getAttribute('ng-click')
              scope[func](scope);
              //自动调用$digest一次
              $scope.$digest()
              apply()
            }
        })(i)
    }
   }

   //apply
   function apply(){
      var list = document.querySelectorAll('[ng-bind]')
      for(var i = 0, len = list.length; i < len; i++){
          var bindData = list[i].getAttribute('ng-bind')
          console.log('引用属性:' + bindData + '为' + scope[bindData])
          list[i].innerHTML = scope[bindData]
      }
   }

   bind()
   $scope.$digest()
   apply()




}