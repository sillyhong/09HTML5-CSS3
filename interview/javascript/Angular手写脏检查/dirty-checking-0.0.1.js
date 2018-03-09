/*
* @Author: Marte
* @Date:   2018-02-26 10:21:48
* @Last Modified by:   Marte
* @Last Modified time: 2018-02-26 15:42:19
*/

//原理：  单纯的绑定click事件  然后把数据显示出来

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
        data: 0
   }


   function bind(){
    var list = document.querySelectorAll('[ng-click]');
    for(var i = 0, len = list.length; i < len; i++){
        list[i].onclick = (function(index){
            return function(){
              var func = this.getAttribute('ng-click')
              scope[func](scope);
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
        list[i].innerHTML = scope[bindData]
    }
   }

   bind()
   apply()

}