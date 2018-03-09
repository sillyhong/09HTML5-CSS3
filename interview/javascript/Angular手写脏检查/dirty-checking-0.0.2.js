/*
* @Author: Marte
* @Date:   2018-02-26 10:21:48
* @Last Modified by:   Marte
* @Last Modified time: 2018-02-26 21:14:45
*/

//$watch 使用$watch去监听$scope


//Angular是如何知道什么时候触发$wacth?怎么去触发$watch？
//如果你是作者，你会怎么做
//找一个函数循环检测scope中的值是否发生变化
//发生值得变化去修改相对应的值

//这个函数就是$scope.$digest()
//
//当修改了$scope里面的值 $inertval $Timeout
//自动触发一次$digest循环

'use strict';
window.onload = function(){
  // 首先定义$scope构造函数、getNewValue和$digest
  // function getNewValue(scope){
  //   return scope[this.name];
  // }

  //Angular $scope
  function $scope(){
    this.$$watchList = []
  }

  //$scope原型方法 $watch $digest
  $scope.prototype.$watch = function(name, getNewValue, listener){
    var watch = {
      name: name,
      getNewValue: getNewValue,//获取最新的值
      listener: listener//观察者
    };
    //自动把监听的变量添加到$$watachList队列中
    this.$$watchList.push(watch);
  }

  $scope.prototype.$digest = function(){
      var list = this.$$watchList

      // 默认为dirty
      var dirty = true
      //寻循环计数器
      var checkTimes = 0

      while(dirty){
        dirty = false
        checkTimes++
        for(var i = 0; i < list.length; i++){
        //发挥监听者的作用
        var watch = list[i]
        console.log(watch)
        // $digest 第一次调用，last 为undefined,所以一定会进行一次数据呈现.
        var oldValue = watch.last
        var newValue = watch.getNewValue(this)
        //判断数据是否为脏
        if(newValue !== oldValue){
          //调用listener方法
          watch.listener(newValue, oldValue)
          //替换现在的新老值
          watch.last = newValue
          //是脏值
          dirty = true
        }

        //更稳定的$digest  迭代的最大值TTL（time to live）
        if(checkTimes >=10 && checkTimes){
            throw new　Error('检测超过10次')
        }
      }
    }

  }

//实例化scope
  var scope = new $scope()
  scope.first = 0
  scope.second = 0

  //一个watch对应一个变量
  scope.$watch('first', function(scope){
     // 这样调用，那么 this 就指的是当前监听器watch，所以可以得到name
    return scope[this.name]
    // console.log('hey i have got newValue')
  },function(newValue, oldValue){
    scope.first++//$watch是实时观察的
    console.log('newValue:'+ newValue,'~~~~~~~~~', 'oldValue:' + oldValue)
  })

  scope.$watch('second', function(scope){
    return scope[this.name]
    // console.log('hey i have got newValue')
  },function(newValue, oldValue){
    console.log('newValue:'+ newValue,'~~~~~~~~~', 'oldValue:' + oldValue)
  })

  //自动调用$digest一次
  scope.$digest()
}