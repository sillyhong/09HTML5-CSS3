/*
* @Author: Marte
* @Date:   2018-03-09 10:59:22
* @Last Modified by:   Marte
* @Last Modified time: 2018-03-09 12:07:59
*/

// 'use strict';
//commonjs是同步加载

//模拟require
 function myRequire(path){
   //定义一个构造函数Module
      function Module(){
           this.exports={}
      }
    // 引入nodejs 文件模块 下面是nodejs中原生的require方法
    var fs=require('fs');
   //同步读文件
   //我们读出来的代码source
     var source= fs.readFileSync(path,'utf8');
     //拼接代码变成一个函数的string
    var package='(function(exports,module){'+source+' return module.exports;})';
      //字符串转换为函数
       var packObj=eval(package);


    // function packageObj(module, exports){
            //访问了Module构造函数
    //     module.exports=function(){
    //       return "!23";
    //     };

    //     return module.exports || exports
    // }

      //调用构造函数创建module
       var module=new Module();
      //   var exports=module.exports   把module.exports当实参传入，exports当形参穿出去
      //   并得到挂载到module.exports或exprots的功能
      var obj=packObj(module.exports,module);

      return obj;
 }





var foo= myRequire('./foo.js');
console.log(foo());
