title: 正则表达式总结
date: 2018-01-22
categories: liuhaifeng
tags:
- 正则表达式
- Regular Expression

---

主要讲解JavaScript语言中的正则表达式用法及匹配原理。

<!--more-->

## 字符匹配
> 正则表达式是匹配模式，要么匹配字符，要么匹配位置。  

### 模糊匹配

模糊匹配有两个方向上的“模糊”： 横向模糊和纵向模糊。   

**横向模糊匹配：** 指正则可匹配的字符串的长度不固定，或是匹配多种情况。

其主要实现方式是：使用量词。如：{m,n}   

**例** ：`var regex = /ab{2,5}c/ `

**纵向模糊匹配：** 指具体到一位字符时，他可以不是确定的字符，匹配多种可能。

其主要实现方式是：使用字符组。如：[abc]   

**例** ：`var regex = /a[123]b/ `

### 字符组
**常见写法** ：`[abc]` 

**范围表示法** ： `[1-9] [a-z]` 等  **// 注意：** 要匹配`"a"`、`"-"`、`"z"`任意一字符，排除歧义写法即可。—> 即不能写成 `[a-z]` ,而应形成 `[-az]` 或 `[az-]`。

**排除字符组** ：`[^ab]`：表示除ab以外的任意字符，^(脱字符)

**常见简写形式** ：

| 字符组  | 具体含义                                     |
| ---- | ---------------------------------------- |
| \d   | 表示：一位数字，`[0-9]`。                         |
| \D   | 表示：非数字的任意字符，` [^0-9]` 。                  |
| \w   | 表示：数字、大小写字母和下划线，`[0-9a-zA-Z]`。           |
| \W   | 表示：非数字、大小写字母和下划线，`[^0-9a-zA-Z]`。         |
| \s   | 表示：空白符，包括空格、水平制表符、垂直制表符、换行符、回车符、换页符,`[\t\v\n\r\f]`。 |
| \S   | 表示：非空白符，`[^\t\v\n\r\f]`。                 |
| .    | 表述：通配符，几乎任意字符。但不包括：换行符、回车符、行分隔符、段分隔符。`[^\n\r\u2028\u2029]`。 |

### 量词

| 量词   | 具体含义                  |
| ---- | --------------------- |
| {m,} | 至少出现m次。 
| {m}  | 等价于{m,m}，表示出现m次。      |
| ?    | 等价于{0,1}表示出现或不出现。     |
| +    | 等价于{1,}表示出现至少一次。      |
| *    | 等价于{0,}表示出现任意次，或者不出现。 |

| 惰性量词  | 贪婪量词 |
| ----- | ---- |
| {m,}? | {m,} |
| {m}?  | {m}  |
| ??    | ？    |
| +?    | +    |
| *?    | *    |

### 多选分支

**常见写法** ： `/good|nice/`  `/(p1|p2|p3)ab/` , 其中 p1、p2、p3是子模式，用 |（管道符）分割 。

**注意** ：分支结构是惰性的，即匹配了前边子模式后，就不再去尝试匹配了。

```
var regex1 = /goodbye|good/g;
var regex2 = /good|goodbye/g;
var str = "goodbye";
console.log( str.match(regex1) ); // => ["goodbye"]
console.log( str.match(regex2) ); // => ["good"]
```



## 位置匹配

> 正则表达式是匹配模式，要么匹配字符，要么匹配位置。

### 什么是位置？

位置（锚）是相邻字符之间的位置（非字符的位置）。

如`'good'`字符串,它的位置有5个，用\*表示位置即：\*g\*o\*o\*d\* 。


**位置匹配：**

在ES5中，共有**6个锚**（用来定位的符号）：

| \^    | \$    | \b   | \B   | (?=p) | (?!p) |
| :--- | :--- | :--- | :--- | :---- | ----- |
| 开头 | 结尾  | **单词边界**。具体就是\w与\W之间的位置，也包括\w与\^和\w与\$之间的位置。如：`"good\_nice"`,对应为：`\*good\*_\*nice\*`。（\*号位置即为单词边界）。 | **非单词边界**。具体就是\w与\w、\W与\W、\^与\W、\W与\$之间的位置。如：`"[big\_go]"`,对应为：`\*[b\*i\*g\_g\*o]\*`。（\*号位置即为单词边界,注意`[`与`^`、`]`与`$`之间也是！） | **p 前边的位置**（该位置后边的字符要匹配p，*其中p是一个子集*）。如：`console.log("hello".replace(/(?=l)/g,'#'))// => "he#l#l0"`。  | **非p 前边的位置**（该位置后边不能匹配p子集）。如：`console.log("hello".replace(/(?！l)/g,'#'))// => "#h#ell#0#"`。 |

可以把位置理解成空字符串`""`，如：

```
"hello" == "" + "h" + "" + "e" + "" + "l" + "" + "l" + "" + "o"  + "" == "" + "" + "h";
```



## 括号的作用

> 并非仅是为了提高优先级！它的功能蛮强大的！

### 分组和分支结构

**分组** ：匹配连续出现多个`"ab"`时，用`/(ab)+/`。(括号提供了分组功能，使量词+作用于`"ab"`这个整体)

**分支结构** ：(p1|p2)

```
var regex = /^I Love (JavaScript|CSS)$/;
console.log( regex.test("I Love JavaScript") );
console.log( regex.test("I Love CSS") );
// => true 
// => true 
```

若去掉括号，即：`/^I Love JavaScript|CSS$/`，匹配的字符串便是`"I Love JavaScript"`和`"CSS"`。

### 分组引用

正则在匹配时，会把每个括号的部分分组编号，为每个分组开辟个空间来存储关于括号内的数据。

即：分组是可以捕获的，并且我们可以使用它。

```
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var str = "2018-01-12";
console.log( str.match(regex) );
// => ["2018-01-12", "2018", "01", "12", index: 0, input: "2018-01-12"]
```

> NOTE : match返回的一个数组，第一个元素是整体匹配结果，然后是各个分组（括号里）匹配的内容，然后是匹配下标，最后是输入的文本。另外，正则表达式是否有修饰符g，match返回的数组格式是不一样的。
>
> ```
> var regex = /(\d{4})-(\d{2})-(\d{2})/g;
> var str = "2018-01-12,2018-02-13";
> console.log( str.match(regex) );
> // => ["2018-01-12", "2018-02-13"]
> ```

正则有分组行为后，构造函数上对应的$1至$9属性就被赋予相应分组匹配的内容。

```
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var str = "2018-01-12";
regex.test(str);
//regex.exec(str);
//str.match(regex);
console.log(RegExp.$1);// => "2018"
console.log(RegExp.$2);// => "01"
console.log(RegExp.$3);// => "12"
console.log(RegExp.$4);// => "" (没有被赋值)

```

```
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var str = "2018-01-12";
var result1 = str.replace(regex,"$2/$3/$1");
var result2 = str.replace(regex,function(){
  return RegExp.$2 + "/" + RegExp.$3 + "/" + RegExp.$1;
});
var result3 = str.replace(regex,function(match,year,month,day){
  return month + "/" + day + "/" + year;
});
console.log(result1,result2,result3);// => "01/12/2018" "01/12/2018" "01/12/2018"
```

### 反向引用

上一小节通过使用相应API来引用分组，其实也可以在正则自身里引用分组。但只能引用之前出现的分组，即反向引用。

```
var regex = /\d{4}(-|\/|\.)\d{2}\1\d{2}/;
var str1 = "2018-01-12";
var str2 = "2018/01/12";
var str3 = "2018.01.12";
var str4 = "2018-01/12";
console.log( regex.test(str1) ); //true
console.log( regex.test(str2) ); //true
console.log( regex.test(str3) ); //true
console.log( regex.test(str4) ); //false
```

**括号嵌套：** 以左开括号为准！

```
var regex = /^((\d)(\d(\d)))\1\2\3\4$/;
var str = "1231231233";
console.log( regex.test(str) );// true
console.log( RegExp.$1 );// 123
console.log( RegExp.$2 );// 1
console.log( RegExp.$3 );// 23
console.log( RegExp.$4 );// 3
console.log( str.match(regex) );
// => ["1231231233", "123", "1", "23", "3", index: 0, input: "1231231233"]
```

**`\10` ：表示第10个分组**（不是\1和0）。

**引用不存在的分组时：** 不报错，匹配转义的字符。例如 \2，就匹配 \2。`"\2"`表示对`"2"`进行了转义。

**分组后边有量！：** 捕获到的数据是最后一次的匹配。（**反向引用也是如此！**）

```
var regex = /(\d)+/;
var str = "12345";
console.log( str.match(regex) ); // ["12345", "5", index: 0, input: "12345"]
var regex2 = /(\d)+ \1/;
console.log( regex2.test("12345 1") );// false
console.log( regex2.test("12345 5") );// true
```

### 非捕获括号

之前文中出现的括号，都会捕获它们匹配的数据，以便后续引用，因此也称它们是捕获型分组和捕获型分支。
如果不想捕获，只想要括号的原始功能，即:既不在API里引用，也不在正则里引用。此时：

使用非捕获型括号`(?:p)`和`(?:p1|p2)`。


```
var regex1 = /(ab)+/;
var regex2 = /(?:ab)+/;
var str = "ababa ccc";
console.log( str.match(regex1) ); // ["abab", "ab", index: 0, input: "ababa ccc"]
console.log( str.match(regex2) ); // ["abab", index: 0, input: "ababa ccc"]
```



## 回溯法原理

> 回溯法也称试探法，它的基本思想是：从问题的某一种状态（初始状态）出发，搜索从这种状态出发所能达到的所有“状态”，当一条路走到“尽头”的时候（不能再前进），再后退一步或若干步，从另一种可能“状态”出发，继续搜索，直到所有的“路径”（状态）都试探过。这种不断“前进”、不断“回溯”寻找解的方法，就称作“回溯法”。
>
> 个人理解：当正则匹配多种情况时，会对每种情况进行尝试，若第一次没有尝试成功，就会回退到可以发生其他情况的地方，再次尝试另一种匹配。

###  没有回溯的匹配

当`/ab{1,3}c/`去匹配`"abbbc"`时，过程如图：![](https://ws4.sinaimg.cn/large/006tKfTcly1fne19t4c22j30go0bydg0.jpg)

### 有回溯的匹配

当`/ab{1,3}c/`去匹配`"abbc"`时，中间就有回溯。过程如图：![](https://ws4.sinaimg.cn/large/006tKfTcly1fne0xzz5lej30go0ehwf3.jpg)

图中第5步有红颜色，表示匹配不成功。

图中的第6步，就是“回溯”。

**这里再看一个清晰的回溯，正则是：** `/".*"/`

目标字符串是：`"acd"ef`，匹配过程是：![](https://ws3.sinaimg.cn/large/006tKfTcly1fne1fi1yi2j30go0g7jrl.jpg)

图中省略了尝试匹配双引号失败的过程。可以看出`.*`是非常影响效率的。

为了减少一些不必要的回溯，可以把正则修改为`/"[^"]*"/`。

**贪婪量词**  注意：当多个贪婪量词挨着存在，并相互有冲突时，先下手为强！

```
var string = "12345";
var regex = /(\d{1,3})(\d{1,3})/;
console.log( string.match(regex) );
// => ["12345", "123", "45", index: 0, input: "12345"]
```

**惰性量词**  虽然不贪婪，但为了整体匹配成功，可能也会发生回溯。

```
var string = "12345";
var regex = /^\d{1,3}?\d{1,3}$/;
console.log( string.match(regex) );
```

其匹配过程为：![](https://ws1.sinaimg.cn/large/006tKfTcly1fne1uulh11j30go0bldgo.jpg)

**分支结构**  前面的子模式会形成局部匹配，如果接下来表达式整体不匹配时，仍会继续尝试剩下的分支。这种尝试也可以看成一种回溯。



## 正则表达式的拆分

### 结构和操作符

编程语言一般都有操作符。有操作符，往往就需要语言本身定义好操作顺序，即所谓的优先级。

**JS正则表达式中的结构：**

> 字符字面量、字符组、量词、锚字符、分组、选择分支、反向引用。

| 结构   | 说明                                       |
| ---- | ---------------------------------------- |
| 字面量  | 匹配一个具体字符，包括不用转义的和需要转义的。比如a匹配字符`"a"`，又比如`\n`匹配换行符，又比如`\.`匹配小数点。 |
| 字符组  | 匹配一个字符，可以是多种可能之一，比如`[0-9]`，表示匹配一个数字。也有`\d`的简写形式。另外还有反义字符组，表示可以是除了特定字符之外任何一个字符，比如`[^0-9]`，表示一个非数字字符，也有`\D`的简写形式。 |
| 量词   | 表示一个字符连续出现，比如`a{1,3}`表示`"a"`字符连续出现3次。另外还有常见的简写形式，比如`a+`表示`"a"`字符连续出现至少一次。 |
| 锚    | 匹配一个位置，而不是字符。比如^匹配字符串的开头，又比如`\b`匹配单词边界，又比如`(?=\d)`表示数字前面的位置。 |
| 分组   | 用括号表示一个整体，比如`(ab)+`，表示`"ab"`两个字符连续出现多次，也可以使用非捕获分组`(?:ab)+`。 |
| 分支   | 多个子表达式多选一                                |

其中涉及到的操作符有：

| 操作符描述  | 操作符                                      | 优先级  |
| ------ | ---------------------------------------- | ---- |
| 转义符    | `\`                                      | 1    |
| 括号和方括号 | `(...)`、`(?:...)`、`(?=...)`、`(?!...)`、`[...]` | 2    |
| 量词限定符  | `{m}`、`{m,n}`、`{m,}`、`?`、`*`、`+`         | 3    |
| 位置和序列  | `^` 、`$`、` \`元字符、 一般字符                   | 4    |
| 管道符    | （竖杠）                                     | 5    |   

**分析一个正则：**

`/ab?(c|de*)+|fg/`

1. 由于括号的存在，所以，`(c|de*)`是一个整体结构。
2. 在`(c|de*)`中，注意其中的量词`*`，因此`e*`是一个整体结构。
3. 又因为分支结构`"|"`优先级最低，因此`c`是一个整体、而`de*`是另一个整体。
4. 同理，整个正则分成了 `a`、`b?`、`(...)+`、`f`、`g`。而由于分支的原因，又可以分成`ab?(c|de*)+`和`fg`这两部分。

###  注意:

**1. 量词连缀问题：**

假设，要匹配这样的字符串：

> 1. 每个字符为a、b、c任选其一
> 1. 字符串的长度是3的倍数

此时正则不能想当然地写成`/^[abc]{3}+$/`，这样会报错，说`+`前面没什么可重复的

此时要修改成：`/^([abc]{3})+$/`

**2. 元字符转义问题**

所谓元字符，就是正则中有特殊含义的字符。

所有结构里，用到的元字符总结如下：

```
^ & . * + ? | \ / ( ) [ ] { } = ! : - ,
```

当匹配上面的字符本身时，可以一律转义：

```
var string = "^$.*+?|\\/[]{}=!:-,";
var regex = /\^\$\.\*\+\?\|\\\/\[\]\{\}\=\!\:\-\,/;
console.log( regex.test(string) ); 
// => true
```

其中`string`中的`\`字符也要转义的。

另外，在`string`中，也可以把每个字符转义，当然，转义后的结果仍是本身：

```
var string = "^$.*+?|\\/[]{}=!:-,";
var string2 = "\^\$\.\*\+\?\|\\\/\[\]\{\}\=\!\:\-\,";
console.log( string == string2 ); 
// => true
```

现在的问题是，是不是每个字符都需要转义呢？否，看情况。

**3. 字符组中的元字符**

跟字符组相关的元字符有`[]`、`^`、`-`。因此在会引起歧义的地方进行转义。例如开头的`^`必须转义，不然会把整个字符组，看成反义字符组。

```
var string = "^$.*+?|\\/[]{}=!:-,";
var regex = /[\^$.*+?|\\/\[\]{}=!:\-,]/g;
console.log( string.match(regex) );
// => ["^", "$", ".", "*", "+", "?", "|", "\", "/", "[", "]", "{", "}", "=", "!", ":", "-", ","]
```

**4. 匹配`"[abc]"`和`"{3,5}"`**

我们知道`[abc]`，是个字符组。如果要匹配字符串`"[abc]"`时，该怎么办？

可以写成`/\[abc\]/`，也可以写成`/\[abc]/`，测试如下：

```
var string = "[abc]";
var regex = /\[abc]/g;
console.log( string.match(regex)[0] ); 
// => "[abc]"
```

只需要在第一个方括号转义即可，因为后面的方括号构不成字符组，正则不会引发歧义，自然不需要转义。

同理，要匹配字符串`"{3,5}"`，只需要把正则写成`/\{3,5}/`即可。

另外，我们知道量词有简写形式`{m,}`，却没有`{,n}`的情况。虽然后者不构成量词的形式，但此时并不会报错。当然，匹配的字符串也是`"{,n}"`，测试如下：

```
var string = "{,3}";
var regex = /{,3}/g;
console.log( string.match(regex)[0] ); 
// => "{,3}"
```

**5. 其余情况**

比如`=` `!` `:` `-` `,`等符号，只要不在特殊结构中，也不需要转义。

但是，括号需要前后都转义的，如`/\(123\)/`。

至于剩下的`^` `$` `.` `*` `+` `?` `|` `\` `/`等字符，只要不在字符组内，都需要转义的。



## 正则表达式的构建

> 针对每种情形，分别写出正则，然用分支把他们合并在一起，再提取分支公共部分，就能得到准确的正则。

### 平衡法则

构建正则有一点非常重要，需要做到下面几点的平衡：

1. 匹配预期的字符串
2. 不匹配非预期的字符串
3. 可读性和可维护性
4. 效率

### 构建正则前提

**1. 是否能使用正则:**  如匹配这样的字符串：1010010001….。虽然很有规律，但是只靠正则就是无能为力。

**2. 是否有必要使用正则:**  能用字符串API解决的简单问题，就不该正则出马。

 比如，从日期中提取出年月日:

```
var string = "2017-07-01";
var regex = /^(\d{4})-(\d{2})-(\d{2})/;
console.log( string.match(regex) );
// => ["2017-07-01", "2017", "07", "01", index: 0, input: "2017-07-01"]
var result = string.split("-"); // 优先用法
console.log( result );
// => ["2017", "07", "01"] 
```

 比如，判断是否有问号:

```
var string = "?id=xx&act=search";
console.log( string.search(/\?/) );// => 0
console.log( string.indexOf("?") );// => 0  优先用法
```
 比如获取子串:

```
var string = "JavaScript";
console.log( string.match(/.{4}(.+)/)[1] );// => Script
console.log( string.substring(4) );// => Script
```

**3. 是否有必要构建一个复杂的正则：** 

```
/(?!^[0-9]{6,12}$)(?!^[a-z]{6,12}$)(?!^[A-Z]{6,12}$)^[0-9A-Za-z]{6,12}$/
```

上边正则可以使用多个小正则来做：

```
var regex1 = /^[0-9A-Za-z]{6,12}$/;
var regex2 = /^[0-9]{6,12}$/;
var regex3 = /^[A-Z]{6,12}$/;
var regex4 = /^[a-z]{6,12}$/;
function checkPassword(string) {
	if (!regex1.test(string)) return false;
	if (regex2.test(string)) return false;
	if (regex3.test(string)) return false;
	if (regex4.test(string)) return false;
	return true;
}
```

### 准确性

所谓准确性，就是能匹配预期的目标，并且不匹配非预期的目标。

这里提到了“预期”二字，那么我们就需要知道目标的组成规则。



### 效率

保证了准确性后，才需要是否要考虑要优化。大多数情形是不需要优化的，除非运行的非常慢。什么情形正则表达式运行才慢呢？我们需要考察正则表达式的运行过程（原理）。

正则表达式的运行分为如下的阶段：

1. 编译
2. 设定起始位置
3. 尝试匹配
4. 匹配失败的话，从下一位开始继续第3步
5. 最终结果：匹配成功或失败

**1. 使用具体型字符组来代替通配符，来消除回溯**

例如，匹配双引用号之间的字符。如，匹配字符串`123"abc"456`中的`"abc"`。

如果正则用的是：`/".*"/`，，会在第3阶段产生4次回溯

如果正则用的是：`/".*?"/`，会产生2次回溯

因为回溯的存在，需要引擎保存多种可能中未尝试过的状态，以便后续回溯时使用。注定要占用一定的内存。

此时要使用具体化的字符组，来代替通配符`.`，以便消除不必要的字符，此时使用正则`/"[^"]*"/`，即可。

**2. 使用非捕获型分组**

因为括号的作用之一是，可以捕获分组和分支里的数据。那么就需要内存来保存它们。

当我们不需要使用分组引用和反向引用时，此时可以使用非捕获分组。例如：

`/^[+-]?(\d+\.\d+|\d+|\.\d+)$/`

可以修改成：

`/^[+-]?(?:\d+\.\d+|\d+|\.\d+)$/`

**3. 独立出确定字符**

例如`/a+/`，可以修改成`/aa*/`。

**4. 提取分支公共部分**

比如/`^abc|^def/`，修改成`/^(?:abc|def)/`。

又比如`/this|that/`，修改成`/th(?:is|at)/`。

**5. 减少分支的数量，缩小它们的范围**

`/red|read/`，可以修改成`/rea?d/`。此时分支和量词产生的回溯的成本是不一样的。但这样优化后，可读性会降低的。



## 正则表达式编程

> 什么叫知识，能指导我们实践的东西才叫知识。
>
> 纸上得来终觉浅，绝知此事要躬行。

### 正则表达式的四种操作

> 验证、切分、提取、替换。

**1. 验证** 

所谓匹配，就是看目标字符串里是否有满足匹配的子串。因此，“匹配”的本质就是“查找”。

有没有匹配，是不是匹配上，判断是否的操作，即称为“验证”。

比如，判断一个字符串中是否有数字。

```
var regex= /\d/;
var string = "abc123";
console.log( !!~string.search(regex) );// => true
// (~ 是按位非运算符，简单理解就是，改变运算数的符号并减去1(好处是，它可以把NaN转化为-1,将-1转化为0)。
console.log( regex.test(string) );// => true
console.log( !!string.match(regex) );// => true
console.log( !!regex.exec(string) );// => true
```

**2. 切分** 

```
var regex = /,/;
var string = "html,css,javascript";
console.log( string.split(regex) );
// => ["html", "css", "javascript"]
```

**3. 提取** 

虽然整体匹配上了，但有时需要提取部分匹配的数据。

此时正则通常要使用分组引用（分组捕获）功能，还需要配合使用相关API。

这里，还是以日期为例，提取出年月日。注意下面正则中的括号：

```
var regex = /^(\d{4})\D(\d{2})\D(\d{2})$/;
var string = "2017-06-26";

console.log( string.match(regex) );
// =>["2017-06-26", "2017", "06", "26", index: 0, input: "2017-06-26"]

console.log( regex.exec(string) );
// =>["2017-06-26", "2017", "06", "26", index: 0, input: "2017-06-26"]

regex.test(string);
console.log( RegExp.$1, RegExp.$2, RegExp.$3 );
// => "2017" "06" "26"

string.search(regex);
console.log( RegExp.$1, RegExp.$2, RegExp.$3 );
// => "2017" "06" "26"

var date = [];
string.replace(regex, function(match, year, month, day) {
	date.push(year, month, day);
});
console.log(date);
// => ["2017", "06", "26"]
```

其中，最常用的是`match`。

**4. 替换**

```
var string = "2017-06-26";
var today = new Date( string.replace(/-/g, "/") );
console.log( today );
// => Mon Jun 26 2017 00:00:00 GMT+0800 (中国标准时间)
```

### 相关API注意要点

从上面可以看出用于正则操作的方法，共有6个，字符串实例4个，正则实例2个：

> String#search
>
> String#split
>
> String#match
>
> String#replace
>
> RegExp#test
>
> RegExp#exec

方法使用细节，可参考《JavaScript权威指南》的第三部分

**1. search和match的参数问题**

我们知道字符串实例的那4个方法参数都支持正则和字符串。

但`search`和`match`，会把字符串转换为正则的。

```
var string = "2017.06.27";

console.log( string.search(".") );
// => 0
//需要修改成下列形式之一
console.log( string.search("\\.") );
console.log( string.search(/\./) );
// => 4
// => 4

console.log( string.match(".") );
// => ["2", index: 0, input: "2017.06.27"]
//需要修改成下列形式之一
console.log( string.match("\\.") );
console.log( string.match(/\./) );
// => [".", index: 4, input: "2017.06.27"]
// => [".", index: 4, input: "2017.06.27"]

console.log( string.split(".") );
// => ["2017", "06", "27"]

console.log( string.replace(".", "/") );
// => "2017/06.27"
```

**2. match返回结果的格式问题**

`match`返回结果的格式，与正则对象是否有修饰符`g`有关。

```
var string = "2017.06.27";
var regex1 = /\b(\d+)\b/;
var regex2 = /\b(\d+)\b/g;
console.log( string.match(regex1) );
console.log( string.match(regex2) );
// => ["2017", "2017", index: 0, input: "2017.06.27"]
// => ["2017", "06", "27"]

```

没有`g`，返回的是标准匹配格式，即，数组的第一个元素是整体匹配的内容，接下来是分组捕获的内容，然后是整体匹配的第一个下标，最后是输入的目标字符串。

有`g`，返回的是所有匹配的内容。

当没有匹配时，不管有无`g`，都返回`null`。

**3.  exec方法**

```
var string = "2018.01.15";
var regex2 = /\b(\d+)\b/g;
console.log( regex2.exec(string) ); // => ["2018", "2018", index: 0, input: "2018.01.15"]
console.log( regex2.lastIndex); // => 4
console.log( regex2.exec(string) ); // => ["01", "01", index: 5, input: "2018.01.15"]
console.log( regex2.lastIndex); // => 7
console.log( regex2.exec(string) ); // => ["15", "15", index: 8, input: "2018.01.15"]
console.log( regex2.lastIndex); // => 10
console.log( regex2.exec(string) ); // => null
console.log( regex2.lastIndex); // => 0

```

其中正则实例`lastIndex`属性，表示下一次匹配开始的位置。

比如第一次匹配了`“2018”`，开始下标是0，共4个字符，因此这次匹配结束的位置是3，下一次开始匹配的位置是4。

从上述代码看出，在使用`exec`时，经常需要配合使用`while`循环：

```
var string = "2018.01.15";
var regex2 = /\b(\d+)\b/g;
var result;
while ( result = regex2.exec(string) ) {
	console.log( result, regex2.lastIndex );
}
// => ["2018", "2018", index: 0, input: "2018.01.15"] 4
// => ["01", "01", index: 5, input: "2018.01.15"] 7
// => ["15", "15", index: 8, input: "2018.01.15"] 10
```

**4. 修饰符g，对exex和test的影响**

上面提到了正则实例的`lastIndex`属性，表示尝试匹配时，从字符串的`lastIndex`位开始去匹配。

字符串的四个方法，每次匹配时，都是从0开始的，即`lastIndex`属性始终不变。

而正则实例的两个方法`exec`、`test`，当正则是全局匹配时，每一次匹配完成后，都会修改`lastIndex`。

```
var regex = /a/g;
console.log( regex.test("a"), regex.lastIndex );
console.log( regex.test("aba"), regex.lastIndex );
console.log( regex.test("ababc"), regex.lastIndex );
// => true 1
// => true 3
// => false 0

```

注意上面代码中的第三次调用`test`，因为这一次尝试匹配，开始从下标`lastIndex`即3位置处开始查找，自然就找不到了。

如果没有`g`，自然都是从字符串第0个字符处开始尝试匹配。

**5. split方法**

1.  它可以有第二个参数，表示结果数组的最大长度。

1.  正则使用分组时，结果数组中是包含分隔符的。

```
var string = "good,nice,well";
console.log( string.split(/,/, 2) ); // =>["good", "nice"]
console.log( string.split(/(,)/) ); // =>["good", ",", "nice", ",", "well"]
```

**6. replace方法**

`replace`有两种使用形式，这是因为它的第二个参数，可以是字符串，也可以是函数。

当第二个参数是字符串时，如下的字符有特殊的含义：

```
$1,$2,...,$99 匹配第1~99个分组里捕获的文本   
$& 匹配到的子串文本
$` 匹配到的子串的左边文本 
$' 匹配到的子串的右边文本
$$ 美元符号

```
例如，把`"2,3,5"`，变成`"5=2+3"`：

```
var result = "2,3,5".replace(/(\d+),(\d+),(\d+)/, "$3=$1+$2");
console.log(result);
// => "5=2+3"
```
又例如，把`"2,3,5"`，变成`"222,333,555"`:

```
var result = "2,3,5".replace(/(\d+)/g, "$&$&$&");
console.log(result);
// => "222,333,555"

```

再例如，把`"2+3=5"`，变成`"2+3=2+3=5=5"`:

```
var result = "2+3=5".replace(/=/, "$&$`$&$'$&");
console.log(result);
// => "2+3=2+3=5=5"
```

当第二个参数是函数时，我们需要注意该回调函数的参数具体是什么：

```
"1234 2345 3456".replace(/(\d)\d{2}(\d)/g, function(match, $1, $2, index, input) {
	console.log([match, $1, $2, index, input]);
});
// => ["1234", "1", "4", 0, "1234 2345 3456"]
// => ["2345", "2", "5", 5, "1234 2345 3456"]
// => ["3456", "3", "6", 10, "1234 2345 3456"]

```

**7. 使用构造函数需要注意的问题**

一般不推荐使用构造函数生成正则，而应该优先使用字面量。因为用构造函数会多写很多`\`。

```
var string = "2017-06-27 2017.06.27 2017/06/27";
var regex = /\d{4}(-|\.|\/)\d{2}\1\d{2}/g;
console.log( string.match(regex) );
// => ["2017-06-27", "2017.06.27", "2017/06/27"]

regex = new RegExp("\\d{4}(-|\\.|\\/)\\d{2}\\1\\d{2}", "g");
console.log( string.match(regex) );
// => ["2017-06-27", "2017.06.27", "2017/06/27"]
```

**8. 修饰符**

ES5中修饰符，共3个：

> `g` 全局匹配，即找到所有匹配的，单词是global
>
> `i` 忽略字母大小写，单词ingoreCase
>
> `m` 多行匹配，只影响`^`和`$`，二者变成行的概念，即行开头和行结尾。单词是multiline

当然正则对象也有相应的只读属性：

```
var regex = /\w/img;
console.log( regex.global );
console.log( regex.ignoreCase );
console.log( regex.multiline );
// => true
// => true
// => true
```

**9. source属性**

正则实例对象属性，除了`global`、`ingnoreCase`、`multiline`、`lastIndex`属性之外，还有一个`source`属性。可以通过查看该属性，来确认构建出的正则到底是什么：

```
var className = "high";
var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");
console.log( regex.source )
// => (^|\s)high(\s|$) 即字符串"(^|\\s)high(\\s|$)"
```

**10. 构造函数属性**

构造函数的静态属性基于所执行的最近一次正则操作而变化。除了是`$1,...,$9`之外，还有几个不太常用的属性（有兼容性问题）：

```
RegExp.input 最近一次目标字符串，简写成RegExp["$_"]
RegExp.lastMatch 最近一次匹配的文本，简写成RegExp["$&"]
RegExp.lastParen 最近一次捕获的文本，简写成RegExp["$+"]
RegExp.leftContext 目标字符串中`lastMatch`之前的文本，简写成RegExp["$`"]
RegExp.rightContext目标字符串中`lastMatch`之后的文本，简写成RegExp["$'"]

```

**总结自：老姚的《正则表达式迷你书》。**

推荐通读：[JS正则表达式完整教程](https://juejin.im/post/5965943ff265da6c30653879)

作者推荐阅读： 《JavaScript权威指南》、《精通正则表达式》、《正则表达式必知必会》、《正则指引》、《正则表达式入门》、《正则表达式经典实例》、《JavaScript Regular Expressions》、《高性能JavaScript 》、《JavaScript忍者秘籍》、《JavaScript高级程序设计》