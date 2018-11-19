title: Web 端屏幕适配方案
date: 2018-01-26
categories: zhoushiqi
tags: 
- CSS
- 屏幕适配
- 移动端

---

通过对现有 Web 端屏幕适配方案的总结，引起对更好的 Web 端屏幕适配方案的调研。在调研中发现了现实中出现的 Web 端移动端适配相关问题，并推荐相应解决方案，和屏幕适配方案。

<!--more-->
## 基础知识

### 像素相关
1. **像素** ：像素是屏幕显示最小的单位。
1. 	**设备像素** ：设备像素又称物理像素（physical pixel），设备能控制显示的最小单位，我们可以把这些像素看作成显示器上一个个的点。 iPhone5 的物理像素是 640 X 1136 。
1. **逻辑像素**（logical pixel）：独立于设备的用于逻辑上衡量像素的单位。CSS 像素就是逻辑像素，CSS 像素是 Web 编程的概念。
1. **设备独立像素**（density-independent pixel）：简称 dip ，单位 dp ，独立于设备的用于逻辑上衡量像素的单位 。且逻辑像素 ≈ 设备独立像素。
1. 	**设置像素比**（device pixel ratiodpr）：dpr = 物理像素 / 设备独立像素。可通过 window.devicePixelRatio 获取。所谓的一倍屏、二倍屏(Retina)、三倍屏，指的是设备以多少物理像素来显示一个 CSS 像素即：几 dpr。
普通 Android 是一倍屏，在 Retina 屏的 iPhone 上，devicePixelRatio 的值为 2，也就是说 1 个 CSS 像素相当于 2 个物理像素。通常所说的二倍屏（Retina）的 dpr 是 2， 三倍屏（IPhoneX 等）是 3 。

### viewport 相关

`<meta name="viewport"   content="width=device-width, initial-scale=1,
 maximum-scale=1, user-scalable=no">`
 
1. **visual viewport 可见视口** ：屏幕宽度window.innerWidth/Height
1. **layout viewport 布局视口** ：DOM宽document.documentElement.clientWidth/Height
1. **ideal viewport 理想视口** ：使布局视口就是可见视口
1. **width=device-width** ：表示宽度是设备屏幕的宽度
1. **initial-scale** ：表示初始的缩放比例
1. **minimum-scale** ：表示最小的缩放比例
1. **maximum-scale** ：表示最大的缩放比例
1. **user-scalable** ：表示用户是否可以调整缩放比例


## 总结现有方案优劣

**现有屏幕适配方案 ：** 

* 设置 viewport 的 scale 值为 1

`<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">`

* 根据屏幕的分辨率动态设置 html 的文字大小，达到等比缩放的功能

`375 屏幕为 20px，以此为基础计算出每一种宽度的字体大小`

* Rem.less 中设置其他基础尺寸 @bps ：320px， 360px， 375px， 400px， 414px， 480px， 768px， 1024px
并计算相应的比例缩放：

		.loop(@i: 1) when (@i <= length(@bps)) {  //注意less数组是从1开始的
		  @bp: extract(@bps, @i);
		  @font: round(@bp/@baseWidth*@baseFont, 1);
		  @media only screen and (min-width: @bp){
		    html {
		      font-size: @font !important;
		    }
		  }
		  .loop((@i + 1));
		};

* 然后在 variables.less 中设置比例和行高： 

`@2ptr : 1/2/20rem @ptr : 1/20rem`

* 最后所有 CSS 使用 @2ptr 和 @ptr 利用 rem 缩放 dom 、字体
	
## 其他主流适配方案优劣

### 方案：

#### 1. 媒体查询 Media Queries

`@media screen and (max-width: 300px){}`

* 优点：
	* Media Queries 可以做到设备像素比的判断，方法简单，成本低，特别是对移动和 PC 维护同一套代码的时候。目前像 Bootstrap 等框架使用这种方式布局
	* 图片便于修改，只需修改 CSS 文件
	* 调整屏幕宽度的时候不用刷新页面即可响应式展示
* 缺点：
	* 代码量比较大，维护不方便
	* 为了兼顾大屏幕或高清设备，会造成其他设备资源浪费，特别是加载图片资源
	* 为了兼顾移动端和PC端各自响应式的展示效果，难免会损失各自特有的交互方式

##### 浏览器兼容

* 不支持 IE 8.0 及以下、Safari 3.2 及以下、FireFox 3.0 及以下
* <img width = "600px" height = "300px" src="https://ws1.sinaimg.cn/large/d0ba619egy1fqnv6ygswjj21ic0v0428.jpg">

#### 2. Flex 弹性布局

* 固定 viewport 的高度等于设备高度，宽度自适应，元素都采用 px 做单位
 
`<meta name="viewport" content="width=device-width,initial-scale=1"> `

* 随着屏幕宽度变化，页面也会跟着变化，效果就和PC页面的流体布局差不多，在哪个宽度需要调整的时候使用响应式布局调调就行（比如网易新闻）

<img width = "600px" height = "300px" src="https://ws1.sinaimg.cn/large/d0ba619egy1fqj1u1yzs5j20oa0e6taz.jpg">

* 优点：布局更加精简，直接用 CSS 的方式，你不用再引入 Bootstrap ，使用栅格系统
* 缺点：IE10 及 IE10 以上才支持，所以目前主要应用在移动端上

##### 浏览器支持

* 不支持 IE 9.0 及以下、Opera 11.5 及以下、Opera Mobile 12及以下
* <img width = "800px" height = "200px" src="https://ws1.sinaimg.cn/large/d0ba619egy1fqnvqmc091j21hi0f2q4y.jpg">

#### 3. rem + viewport 
* 根据屏幕宽度设定 rem 值，需要适配的元素都使用 rem 为单位，不需要适配的元素还是使用 px 为单位
* 根据 rem 将页面放大 dpr 倍， 然后 viewport 设置为 1 / dpr

 	*如 iPhone6 plus 的 dpr 为 3， 则页面整体放大 3 倍， 1px (css单位)在plus下默认为 3px (物理像素)*
 	
* 然后 viewport 设置为 1/3， 这样页面整体缩回原始大小，从而实现高清。这样整个网页在设备内显示时的页面宽度就会等于设备逻辑像素大小，也就是 device-width 。这个 device-width 的计算公式为：
设备的物理分辨率 / (devicePixelRatio * scale)，在 scale 为 1 的情况下，device-width = 设备的物理分辨率 / devicePixelRatio 

##### rem弊端

&nbsp;&nbsp;&nbsp;&nbsp;iOS 与 Android 平台的适配方式背后隐藏的设计哲学是这样的：阅读文字时，可读性较好的文字字号行距等绝对尺寸数值组合与文字所在媒介的绝对尺寸关系不大。（可以这样简单理解：A4 大小的报纸和 A3 大小甚至更大的报纸，舒适的阅读字号绝对尺寸是一样的，因为他们都需要拿在手里阅读，在手机也是上同理）。在看图片视频时，图片、视频的比例应该是固定的，不应该出现拉伸变形的情况。而 rem 用在字号时，使字号在不同屏幕上的绝对尺寸不一致，违背了设计哲学。

##### 浏览器兼容

* 不支持 IE 8.0 以下 、Safari 4.0 以下、FireFox 3.5以下
* <img width = "800px" height = "200px" src="https://ws1.sinaimg.cn/large/d0ba619egy1fqnvyg6do9j21he0f4ac2.jpg">

#### 4. VW适配 

[如何在Vue项目中使用vw实现移动端适配](https://juejin.im/entry/5aa09c3351882555602077ca
)

	1vw ＝ 1/100th viewport width
	1vh ＝ 1/100th viewport height
	vmin ：选取 vw 和 vh 中最小的那个
	vmax ：选取 vw 和 vh 中最大的那个 
	
**vw 可以轻松搞定弹性布局，流体布局。vw 逻辑非常清晰**其实 vw 的方案的写法和 flexible 方案的写法一致
～～因为 flexible 其实就是用 hack 的手段模拟了 vw 的实现而已。
具体写法：针对 750px 的设计稿，将相应的 px 值除以 75 就是 vw 的值。
 
使用 vw 来实现页面的适配，并且通过 PostCSS 的插件 [postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport) 把 px 转换成 vw 。这样的好处是，我们在撸码的时候，不需要进行任何的计算，你只需要根据设计图写 px 单位。[postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport) 插件主要用来把 px 单位转换为 vw 、vh 、vmin 或者 vmax 这样的视窗单位，也是 vw 适配方案的核心插件之一。


为了更好的实现长宽比，特别是针对于 img、video 和 iframe 元素，通过 PostCSS 插件[postcss-aspect-ratio-mini](https://github.com/yisibl/postcss-aspect-ratio-mini) 来实现，在实际使用中，只需要把对应的宽和高写进去即可。

* 优点：rem ，使用 vw 和 wh 是非常直观的，让其他人看到就能知道，该界面是以怎么样的结构进行布局，利于维护
* 缺点：vw 在一些三星的机子会有兼容问题，导致失效，以及不同浏览器兼容问题

##### 兼容性对比

 Rem：
![](https://ws1.sinaimg.cn/large/d0ba619egy1fqi26dyf14j20sa052tcg.jpg)
 VW：
![](https://ws1.sinaimg.cn/large/d0ba619egy1fqi26prtssj20su0560xa.jpg)

## 手淘适配方案 Flexible.js

<img width = "600px" height = "300px" src="https://ws1.sinaimg.cn/large/d0ba619egy1fqi3ik1ullj20n20eujud.jpg">

[Github(lib-flexible)](https://github.com/amfe/lib-flexible)

### 使用方法

第一种方法是将文件下载到你的项目中，然后通过相对路径添加：

	<script src="build/flexible_css.debug.js"></script>
	<script src="build/flexible.debug.js"></script>
	
或者直接加载阿里CDN的文件：

	<script src="http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/??flexible_css.js,flexible.js"></script>

### 手机淘宝用 JS 来动态写 meta 标签

手机淘宝的 flexible 方案是综合运用 rem 和 px 两种单位 +js 设置 scale 和 html 字体。

	var metaEl = doc.createElement('meta');
	var scale = isRetina ? 0.5:1;
	metaEl.setAttribute('name', 'viewport');
	metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
	if (docEl.firstElementChild) {
	    document.documentElement.firstElementChild.appendChild(metaEl);
	} else {
	    var wrap = doc.createElement('div');
	    wrap.appendChild(metaEl);
	    documen.write(wrap.innerHTML);
	}
		
### 实质

* 动态改写<meta>标签
* 给<html>元素添加 data-dpr 属性，并且动态改写 data-dpr 的值
* 给<html>元素添加 font-size 属性，并且动态改写 font-size 的值

### 局限性

* 不能与响应式布局兼容
* 对 Android 没有做处理，导致 1px 和 backgroudImage 还要额外做处理的问题

ps.通过一段 JS 代码根据设备的屏幕宽度、dpr 设置根元素的 data-dpr 和 font-size ，这段JS代码要在所有资源加载之前执行，建议做内联处理。

## 常见问题解决方案

### 一、解决 1px 方案

**原因：**css 中的 1px 并不等于移动设备的 1px ，这些由于不同的手机有不同的像素密度。在 window 对象中有一个 devicePixelRatio 属性，他可以反应 css 中的像素与设备的像素比。viewport 的设置和屏幕物理分辨率是按比例而不是相同的。 移动端 window 对象有个 devicePixelRatio 属性， 它表示设备物理像素和 css 像素的比例， 在 retina 屏的 iphone手机上 ，这个值为 2 或 3 ， css 里写的 1px 长度映射到物理像素上就有 2px 或 3px 那么长。

**解决方案：**
#### 1.background 渐变（现有方法）

背景渐变， 渐变在透明色和边框色中间分割，frozenUI 用的就是这种方法， 借用它的上边框写法：
不能实现圆角 1px 效果，css 需要做兼容处理，与 background-image 方案类似，只是将图片替换为 css3 渐变。设置 1px 的渐变背景，50% 有颜色，50% 透明。

	 .border-1px-bottom {
	   background-image: linear-gradient(180deg, @border-default-color, @border-default-color 50%, transparent 0);
	   background-size: 100% 1px;
	   background-repeat: no-repeat;
	   background-position: bottom;
	 }
	
* 优点：
	* 可以实现单条、多条边框
	* 边框的颜色随意设置
* 缺点：
	* 代码量不少
	* 圆角没法实现
	* 多背景图片有兼容性问题

##### 浏览器兼容 

* 不支持 IE 8.0 及以下、FireFox 3.5 及以下
* <img width = "800px" height = "200px" src="https://ws1.sinaimg.cn/large/d0ba619egy1fqnwgdol47j21he0eydhu.jpg">

#### 2.使用 border-image 实现

	.border-image-1px {
	  border-bottom: 1px solid #666;
	}
	@media only screen and (-webkit-min-device-pixel-ratio: 2) {
	  .border-image-1px {
	    border-bottom: none;
	    border-width: 0 0 1px 0;
	    -webkit-border-image: url(../img/linenew.png) 0 0 2 0 stretch;
	    border-image: url(../img/linenew.png) 0 0 2 0 stretch;
	  }
	}
	
* 优点：
	* 可以设置单条，多条边框
	* 没有性能瓶颈的问题
* 缺点：
  * 边框颜色不便修改，修改颜色麻烦， 需要替换图片
  * 圆角需要特殊处理，并且边缘会模糊

##### 浏览器兼容

* 不支持 IE 10.0 及以下 （其他浏览器版本部分支持）
* <img width = "800px" height = "200px" src="https://ws1.sinaimg.cn/large/d0ba619egy1fqnwlgxe6ij21hi0fc40r.jpg">

#### 3、使用 box-shadow 模拟边框

利用 css 对阴影处理的方式实现 0.5px 的效果

	.box-shadow-1px {
	  box-shadow: inset 0px -1px 1px -1px #c8c7cc;
	}
	
* 缺点：颜色不便控制，太淡，有虚边

##### 浏览器兼容

* 不支持 IE 8.0 及以下
* <img width = "800px" height = "200px" src="https://ws1.sinaimg.cn/large/d0ba619egy1fqnwpb7mi1j21i40f4q4y.jpg">

#### 4、viewport + rem 实现（flexible.js）

同时通过设置对应 viewport 的 rem 基准值，这种方式就可以像以前一样轻松愉快的写 1px 了。

* 优点：
	* 所有场景都能满足
	* 一套代码，可以兼容基本所有布局
* 缺点：老项目修改代价过大，只适用于新项目

##### 浏览器兼容

* 不支持 IE 8.0 以下 、Safari 4.0 以下、FireFox 3.5以下
* <img width = "800px" height = "200px" src="https://ws1.sinaimg.cn/large/d0ba619egy1fqnvyg6do9j21he0f4ac2.jpg">

#### 5、伪类 ( :before， :after ) + transform 实现

原理是把原先元素的 border 去掉，然后利用 :before 或者 :after 重做 border ，并 transform 的 scale 缩小一半，原先的元素相对定位，新做的 border 绝对定位。

	.box-shadow-1px{
	    position: relative;
	    border:none;
	}
	.box-shadow-1px:after{
	    content: '';
	    position: absolute;
	    left: 0;
	    background: #000;
	    width: 100%;
	    height: 1px;
	    transform: scaleY(0.5);
	    transform-origin: 50% 100%;
	}

* 优点：
	* 所有场景都能满足
	* 支持圆角(伪类和本体类都需要加 border-radius )
* 缺点：
	* 占用了伪类，容易和原样式冲突
	* 对于已经使用伪类的元素(例如 clearfix )，可能需要多层嵌套
	* 对单个元素的边框进行缩放的方案无法实现圆角

##### 浏览器兼容

* 不支持 IE 8.0 以下
* <img width = "800px" height = "200px" src="https://ws1.sinaimg.cn/large/d0ba619egy1fqnwwok2wnj21hq0f00ur.jpg">

#### 6. 使用 0.5px 适配 iOS8 以上的 iPhone 机型

	@media (-webkit-min-device-pixel-ratio:2){
	 .box5 {border-width:.5px}
	}
	
* 缺点：
	* 只适用于 iOS8+ 以上的 iOS 系统，安卓机不支持 0.5px
	* Chrome 会把小于 0.5px 的当成 0，而 Firefox 会把不小于 0.55px 当成 1px，Safari 是把不小于 0.75px 当成 1px

### 二、Rem 小数问题

**起因：**在开发手机端页面的时候，使用了 rem 单位，实现上比 %、em 等其他的做法更简单了，它可以实现高度和宽度等比例变化。好东西是好，但是不好的一点是 rem 的小数点。但是浏览器在处理小数像素的时候并不是直接舍入处理的，元素依旧占据着应有的空间，只是在计算元素尺寸的时候做了舍入处理。

`例：会出现 font-size：2.1444444444px 的现象`

**目前遇到其他最多的问题就是 background-image 的问题，经常会因为小数像素导致背景图被裁掉一部分。**

**解决方案：**

* 使用 iconfont
* 如需使用 background-image，尽量为背景图设置一定的空白间隙

### 三、高清图问题

**起因：**理论上，1 个位图像素对应于 1 个物理像素（红色点），图片才能得到完美清晰的展示。在普通屏幕下是没有问题的，但是在retina屏幕下就会出现位图像素点不够，从而导致图片模糊的情况。对于 dpr = 2 的Retina 屏幕而言，1 个位图像素对应于 4 个物理像素，由于单个位图像素不可以再进一步分割，所以只能就近取色，从而导致图片模糊(注意上述的几个颜色值)。所以，对于图片高清问题，比较好的方案就是两倍图片(@2x)。

`如：200×300(css pixel)img标签，就需要提供400×600的图片。`

如此一来，位图像素点个数就是原来的 4 倍，在 Retina 屏幕下，位图像素点个数就可以跟物理像素点个数形成 1 : 1 的比例，图片自然就清晰了（这也解释了为啥视觉稿的画布大小要 × 2 ？）。

**衍生问题：**如果普通屏幕下，也用了两倍 图片，会怎样呢 ？

在普通屏幕下，200 × 300（CSS pixel）img 标签，所对应的物理像素个数就是 200 × 300 个，而两倍图片的位图像素个数是 200 × 300 × 4 个，所以就出现一个物理像素点对应 4 个位图像素点，但它的取色也只能通过一定的算法取某一个位图像素点上的色值，这个过程叫做 downsampling（大图放入比图片尺寸小的容器中时，出现像素分割成就近色），肉眼看上去虽然图片不会模糊，但是会觉得图片缺少一些锐利度，或者是有点色差。所以最好的解决办法是：不同的 dpr 下，加载不同的尺寸的图片。不管是通过 CSS 媒体查询，还是通过 JS 条件判断都是可以的。

**得出结论**：
一般来说 dpr = 2 为多，dpr = 1 为普通屏幕，dpr = 3 占少数。所以我们至少做 2 套图片，一套是兼容dpr = 1 的小图；一套是兼容 dpr = 2 的大图；dpr = 3 的可以兼容到 dpr = 2 的图片中，虽然有点失色，但还是可以接受的。



## 小结（我推荐）

### 屏幕适配方案 

&nbsp;&nbsp;&nbsp;&nbsp;使用 [**flexible.js**](https://github.com/amfe/lib-flexible) 方案，较为稳定，提供了用一套 CSS 去适应多种屏幕的方法，不用考虑适应屏幕的高宽比、物理尺寸等，切图成本比较低。

&nbsp;&nbsp;&nbsp;&nbsp;flexible 方案是综合运用 rem 和 px（避免字体放大模糊）两种单位 + js 设置 scale 和 html 字体达到效果。它动态改写 meta 标签，动态改写 dpr 的值，动态改写 font-size 的值。我们现有也是 rem 方法，可以减少代码修改。

**Install**

	npm i -S amfe-flexible
	
**Import**

	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
	<script src="./node_modules/amfe-flexible/index.js"></script>

ps. 虽然 VW 方案似乎也不错，但是考虑兼容性问题，flexible 更宜。

### 1px border 单独解决方案 

&nbsp;&nbsp;&nbsp;&nbsp;1px border 问题使用 **伪类 + transform** 的方式实现。
能解决现有虚假 1px 问题，和无法实现圆角问题，而且兼容性良好，唯一不足：可能需要每个使用 1px border 的地方做相应的 css 调整，配合使用。




