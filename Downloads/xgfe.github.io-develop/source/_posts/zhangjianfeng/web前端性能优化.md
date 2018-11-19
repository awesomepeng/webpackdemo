title: web前端性能优化
date: 2018-04-15 15:00:00
categories: zhangjianfeng
tags:
- 性能优化
- web性能
- 前端优化实践
---
在构建web站点的过程中，任何一个细节都有可能影响网站的访问速度，如果不了解性能优化知识，很多不利网站访问速度的因素会形成累加，从而严重影响网站的性能，导致网站访问速度变慢，用户体验低下，最终导致用户流失。本文主要围绕以下几点讲解：

1. 客户端请求
2. 客户端渲染
3. 服务端响应
4. 网络
<!--more-->

## 客户端请求

每个请求都是有成本的，既包含时间成本也包含资源成本。一个完整的请求都需要经过 DNS寻址、与服务器建立连接、发送数据、等待服务器响应、接收数据这样一个 “漫长” 而复杂的过程。时间成本就是用户需要看到或者 “感受” 到这个资源是必须要等待这个过程结束的，资源上由于每个请求都需要携带数据，因此每个请求都需要占用带宽。另外，由于浏览器进行并发请求的请求数是有上限的，因此请求数多了以后，浏览器需要分批进行请求，因此会增加用户的等待时间，会给用户造成站点速度慢这样一个印象。
### 资源压缩与合并

压缩可以减少资源的体积，从而增加加载速度。将资源文件合并，减少资源的请求数。但并不意味着，一个资源越大越好，资源太大，会影响资源加载速度。针对这一问题，利用webpack模块化打包工具分块打包、按需加载以及提取公共部分代码，利用缓存可以得到解决。具体可参考[webpack的使用](http://mp.weixin.qq.com/s/BVYgLeOEIJp5xY55Rcrszg)。
### DNS预解析

从用户输入一个网址到网页最终展现到用户面前，中间的大致发生以下几个流程：
1. 发送到DNS（域名服务器）获得域名对应的WEB服务器的IP地址。
2. 客户端浏览器与WEB服务器建立TCP（传输控制协议）连接。
3. 客户端浏览器向对应IP地址的WEB服务器发送相应的HTTP或HTTPS请求。
4. WEB服务器响应请求，返回指定的URL数据或错误信息；如果设定重定向，则重定向到新的URL地址。
5. 客户端浏览器下载数据，解析HTML源文件，解析的过程中实现对页面的排版，解析完成后，在浏览器中显示基础的页面。
6. 分析页面中的超链接，显示在当前页面，重复以上过程直至没有超链接需要发送，完成页面的全部显示。
DNS解析时间可能导致大量用户感知延迟，DNS解析所需的时间差异非常大，延迟范围可以从1ms（本地缓存结果）到普遍的几秒钟时间。所以利用DNS预解析是有意义的。
具体实现方式：
```javascript
    <link rel="dns-prefetch" href="hostname" />
```
### 预加载
预加载是一种浏览器机制，使用浏览器空闲时间来预先下载/加载用户接下来很可能会浏览的页面/资源。页面提供给浏览器需要预加载的集合。浏览器载入当前页面完成后，将会在后台下载需要预加载的页面并添加到缓存中。当用户访问某个预加载的链接时，如果从缓存命中，页面就得以快速呈现。 实现方式：
```javascript
// 页面，可以使用绝对或者相对路径
<link rel="prefetch" href="page2.html" /> 
// 图片，也可以是其他类型的文件
<link rel="prefetch" href="sprite.png" /> 
```
从上面的HTML代码可以看出，预加载使用 <link> 标签，并指定 rel="prefetch" 属性，而href属性就是需要预加载的文件路径。
### 懒加载

一个页面有很多图片，而首屏出现的图片大概就一两张，如果一次性把所有图片都加载出来，不仅影响页面渲染速度，还浪费带宽。这也就是们通常所说的首屏加载，其中要用的技术就是图片懒加载--到可视区域再加载。简单实现如下：
```javascript
function lazyload () {
    // 获取所有要进行懒加载的图片
    var eles = document.querySelectorAll('img[data-original][lazyload]');
    var viewHeight = window.innerHeight;
    eles.forEach(function (item, index) {
        var rect;
        if (item.dataset.original === '') {
            return;
        }
        rect = item.getBoundingClientRect();
        // 图片一进入可视区，动态加载
        if (rect.bottom >= 0 && rect.top < viewHeight) {
            item.src = item.dataset.original;
            item.removeAttribute('data-original');
            item.removeAttribute('lazyload');
        }
    });
}
```
### CSS Sprites

合并 CSS图片，也就是通过将多个图片或者icon放在一张图片中，利用css的background-position属性控制每个图片或icon的位置。
## 客户端渲染

客户端优化 dom、css 和 js 的代码和加载顺序
### 什么是DOM

> Document Object Model 文档对象模型

DOM是Model，是Object Model，对象模型，是为HTML（and XML）提供的API。HTML（Hyper Text Markup Language）是一种标记语言，HTML在DOM的模型标准中被视为对象，DOM只提供编程接口，却无法实际操作HTML里面的内容。但在浏览器端，我们可以用脚本语言（JavaScript）通过DOM去操作HTML内容。
### 为什么DOM很慢

首先，我们来了解一下网页的生成过程。浏览器在收到 HTML 文档之后会对文档进行解析开始构建 DOM （Document Object Model） 树，进而在文档中发现样式表，开始解析 CSS 来构建 CSSOM（CSS Object Model）树，这两者都构建完成后，开始构建渲染树。大致可分为以下几个过程：
1. 构建DOM树
2. 构建CSSOM树
3. 生成render树
4. Layout 布局
5. Paint 绘制

在每次修改了 DOM 或者其样式之后都要进行 DOM树的构建，CSSOM 的重新计算，进而得到新的渲染树。浏览器会利用新的渲染树对页面进行重排和重绘，以及图层的合并。通常浏览器会批量进行重排和重绘，以提高性能。但当我们试图通过 JavaScript 获取某个节点的尺寸信息的时候，为了获得当前真实的信息，浏览器会立刻进行一次重排。

通过js操作DOM，影响页面性能的主要原因有如下几点：
* 访问和修改DOM元素
* 修改DOM元素的样式，导致重绘和重排
* 通过对DOM元素的事件处理，完成与用户的交互功能

### 重绘（也称为回流reflow）和重排
重排和重绘是DOM编程中耗能的主要原因之一。
> 重绘

重绘意味着元素发生的改变只影响了节点的一些样式（背景色，边框颜色，文字颜色等），只需要应用新样式绘制这个元素就可以了。
> 引起重绘的操作

* 重排必定引起repaint重绘，重绘可以单独触发
* 背景色、颜色、字体改变（注意：字体大小发生变化时，会触发回流）

> 重排

根据Render Tree布局（几何属性），意味着元素的内容、结构、位置或尺寸发生了变化，需要重新计算样式和渲染树。
> 引起重排的操作

* 内容改变
    文本改变或图片尺寸改变
* DOM元素的几何属性的变化
    例如改变DOM元素的宽高值时，原渲染树中的相关节点会失效，浏览器会根据变化后的DOM重新排建渲染树中的相关节点。如果父节点的几何属性变化时，还会使其子节点及后续兄弟节点重新计算位置等，造成一系列的重排。
* DOM树的结构变化
    添加DOM节点、修改DOM节点位置及删除某个节点都是对DOM树的更改，会造成页面的重排。浏览器布局是从上到下的过程，修改当前元素不会对其前边已经遍历过的元素造成影响，但是如果在所有的节点前添加一个新的元素，则后续的所有元素都要进行重排。
* 浏览器窗口尺寸改变
    窗口尺寸的改变会影响整个网页内元素的尺寸的改变，即DOM元素的集合属性变化，因此会造成重排。
* 获取某些属性
    除了渲染树的直接变化，当获取一些属性值时，浏览器为取得正确的值也会发生重排，这些属性包括：offsetTop、offsetLeft、 offsetWidth、offsetHeight、scrollTop、scrollLeft、scrollWidth、scrollHeight、 clientTop、clientLeft、clientWidth、clientHeight、getComputedStyle()。

### 对性能的影响

重排和重绘会不断触发，这是不可避免的。但是，它们非常耗费资源，是导致网页性能低下的根本原因。
提高网页性能，就是要降低“重排”和“重绘”的频率和成本，尽量少触发重新渲染。
前面提到，DOM变动和样式变动，都会触发重新渲染。但是，浏览器已经很智能了，会尽量把所有的变动集中在一起，排成一个队列，然后一次性执行，尽量避免多次重新渲染。
```javascript
div.style.color = 'blue';
div.style.marginTop = '30px';
```
上面代码中，div元素有两个样式变动，但是浏览器只会触发一次重排和重绘。

如果写得不好，就会触发两次重排和重绘。
```javascript
div.style.color = 'blue';
var margin = parseInt(div.style.marginTop);
div.style.marginTop = (margin + 10) + 'px';
```
上面代码对div元素设置颜色以后，第二行要求浏览器给出该元素的位置，所以浏览器不得不立即重排。

一般来说，样式的写操作之后，如果有下面这些属性的读操作，都会引发浏览器立即重新渲染。
    * offsetTop/offsetLeft/offsetWidth/offsetHeight
    * scrollTop/scrollLeft/scrollWidth/scrollHeight
    * clientTop/clientLeft/clientWidth/clientHeight
    * getComputedStyle()
所以，从性能角度考虑，尽量不要把读操作和写操作，放在一个语句里面。
```javascript
//bad
div.style.left = div.offsetLeft + 10 + "px";
div.style.top = div.offsetTop + 10 + "px";
//good
var left = div.offsetLeft;
var top  = div.offsetTop;
div.style.left = left + 10 + "px";
div.style.top = top + 10 + "px";
```
### 关于DOM操作的几个技巧

* DOM 的多个读操作（或多个写操作），应该放在一起。不要两个读操作之间，加入一个写操作。
* 如果某个样式是通过重排得到的，那么最好缓存结果。避免下一次用到的时候，浏览器又要重排。
* 不要一条条地改变样式，而要通过改变class，或者csstext属性，一次性地改变样式。
```javascript
// bad
var left = 10;
var top = 10;
el.style.left = left + "px";
el.style.top  = top  + "px";
// good
el.className += " theclassname";
// good
el.style.cssText += "; left: " + left + "px; top: " + top + "px;";
```
* 先将元素设为display: none（需要1次重排和重绘），然后对这个节点进行100次操作，最后再恢复显示（需要1次重排和重绘）。这样一来，你就用两次重新渲染，取代了可能高达100次的重新渲染。
* position属性为absolute或fixed的元素，重排的开销会比较小，因为不用考虑它对其他元素的影响。
* 只在必要的时候，才将元素的display属性为可见，因为不可见的元素不影响重排和重绘。另外，visibility : hidden的元素只对重绘有影响，不影响重排。
* 在涉及到吸顶相关及scroll滚动优化
    1. 尽量控制DOM的显示或隐藏，而不是删除或添加
    2. 一次性操作DOM
    3. 多做缓存
    4. 注意节流，避免频繁触发滚动事件

    ```javascript
    var throttle = function (fn, threshhold = 200) {
        var last;
        var timer;
        return function () {
            var context = this;
            var args = arguments;
            var now = +new Date();
            if (last && now < last + threshhold) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    };
    ```
### 代码优化和加载顺序

尽量较少不必要的代码，比如html和css的多层嵌套，代码结构尽量精简。了解js内存泄漏，避免导致内存泄漏的写法。HTML和CSS都会阻塞渲染。所以需要让CSS尽早加载（如：放在头部），以缩短首次渲染的时间。js脚本会阻塞浏览器解析，将脚本放在页面底部加载。
## 服务端响应

尽量减少响应的体积，比如用 gzip 压缩，优化图片字节数，加快文件读取速度，优化服务端的缓存策略。
## 网络

优化网络路由，比如增加 CDN 缓存；或增加并发处理能力，比如服务端设置多个域名，客户端使用多个域名同时请求资源，增加并发量。
### 浏览器并发请求限制

基于端口数量和线程切换开销的考虑，浏览器不可能无限量的并发请求，因此衍生出来了并发限制。浏览器的并发请求数目限制是针对同一域名的。因此静态资源可以引用不同域名下的资源文件，间接增加浏览器请求资源的并发数。


## 总结
以上介绍了性能优化的几个方面，因个人能力有限，有总结不到或者错误的地方，还请各位大神不吝指教。




