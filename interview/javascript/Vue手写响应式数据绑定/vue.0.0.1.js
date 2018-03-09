/*
* @Author: Marte
* @Date:   2018-02-26 22:05:35
* @Last Modified by:   Marte
* @Last Modified time: 2018-02-27 18:43:00
*/

'use strict';
(function(global, factory){
    global.Vue = factory();
})(this, function(){
    var Vue = function(options){
        //挂载的节点
        var id = options.el||"body";
        // console.log(id)

        //模板数据
        this.data = options.data || {}
        var data = this.data

        //监听模板数据
        observer(data, this)

        //节点劫持到一个DOM容器
        var dom  = nodeTodocumentfragment(document.getElementById(id), this)
        //最后挂载
        document.getElementById(id).appendChild(dom)
    }


    //数据监听  递归
    // function observer(obj,vm){
    //     //第一次执行observer data数据模板是一个对象
    //     if(typeof obj !== 'object') return
    //     // console.log(Object.keys(obj))
    //     Object.keys(obj).forEach(function(key){//属性 ['text', 'message']
    //         //过滤对象
    //         console.log(key)
    //         colation(vm, obj, key, obj[key])
    //     })
    // }

    // function colation(vm, obj, key, value){
    //     // alert(1)
    //     observer(value, vm)
    // }

    function Dep(){
        //定义subs数组存储watcher
        this.subs = []
    }

    Dep.prototype.addSub = function(sub){
        this.subs.push(sub)
    }

    Dep.prototype.notify = function(){
        this.subs.forEach(function(sub){
            sub.update()
        })
    }

    //定义wactch
    function Watcher(vm, node, name){
        // console.log(this)
        this.vm = vm
        this.node = node
        this.name = name
        this.update()
    }

    Watcher.prototype = {
        update: function () {
            // alert('Watcher update')
            this.get();
            this.node.nodeValue = this.value;
        },
        // 获取data中的属性值 加入到dep中
        get: function () {
            // alert('Watcher get')
            Dep.target = this

            this.value = this.vm[this.name]; // 触发相应属性的getter，从而添加订阅者
            Dep.target = null

        }
    }

    //数据监听 obj是data对象
    function observer(data, vm){
        if(typeof data !== 'object') return

        Object.keys(data).forEach(function(key){
            defineReactive(vm, key, data[key])
        })
    }

    function defineReactive(obj, key ,val){
        var dep = new Dep()
        Object.defineProperty(obj, key, {
            get: function(){
                // alert('属性监听 get '+Dep.target)
                // // Watcher的实例调用了getter 添加订阅者watcher
                if(Dep.target) dep.addSub(Dep.target)
                    return val
            },
            set: function(newVal){
                // alert('属性监听 set'+newVal)
                if(newVal === val){
                    return
                }else{
                    val = newVal
                    //作为发布者发出通知
                    dep.notify()
                }
            }
        })
    }

    //节点劫持
    //documentfragment DOM 容器
    function nodeTodocumentfragment(obj, vm){
        var flag = document.createDocumentFragment()
        var child
        // appendChild 成功后，会把节点从原来的节点位置移除；
        // 中转站
        while(child = obj.firstChild){
            // console.log(child)
            // 扫描 节点劫持  model数据模板编译
            compile(child, vm)
            flag.appendChild(child)
        }
        // console.log(flag)
        return flag
    }


    // compile扫描每一个子节点
    function compile(node, vm){
        //指令 v- 模板引擎 {{}}
        var reg = /\{\{(.*)\}\}/;
        // 判断节点类型 nodeType  元素1  文本3
        if(node.nodeType === 1){
            var attr = node.attributes
            for(var i = 0; i < attr.length; i++){
                if(attr[i].nodeName == 'v-model'){
                    var name = attr[i].nodeValue//获取v-model绑定的属性名
                    // console.log(name)//text
                    node.addEventListener('input', function(e){
                        console.log(vm)
                        vm[name] = e.target.value
                    })
                    // 给相应的data属性赋值，触发该属性的set方法
                    node.value = vm.data[name]  //将data值赋值给node
                    node.removeAttribute('v-model')
                    // alert('节点赋值')

                }
            }
        }


        //节点类型是文本
        if(node.nodeType === 3){
            if(reg.test(node.nodeValue)){
                var name = RegExp.$1 //获取过来{{text}} =>text
                name = name.trim()//trim
                // node.nodeValue = vm.data[name] //将data.text => {{text}}
                // alert('文本赋值 new Watcher')
                new Watcher(vm, node, name); //这里改成订阅者形式，
            }
        }

    }




    return Vue
})

//浏览器 服务端
//window.vue  global.vue



//在插件中常用选项的方式进行配置