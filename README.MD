# 数据处理组件

该组件用于`JavaScript`中进行JSON，XML，String之间的类型转换。代码被`script`标签引入后将会在window对象上挂载一个processData对象该对象中有4个方法，如下API介绍:

- 经本人自测该组件可支持IE5及以上浏览器

## 地址链接

- 源码所在位置：https://github.com/372623460jh/processData/tree/master/dist

- dev链接：http://libs.ijianghe.cn/js/processData/processData.js

- pro链接：http://libs.ijianghe.cn/js/processData/processData.min.js

## API

- **parseJSON(jsonstr)**
    用于`string`转`json对象`
    
	```javascript
    var jsonstr = '{"items":{"-name":"456","item":[{"-name":"123","#text":"123"},{"-name":"456","#text":"678"}]}}';
    //JSON字符串转JSON对象
    var jsonobj = window.processData.parseJSON(jsonstr);
    console.log("JSON字符串转JSON对象: "+jsonstr+" --转为--> "+jsonobj);
    ```
- **json2str(json)**
	用于`json对象`转`string`
	
    ```javascript
    var jsonstr = '{"items":{"-name":"456","item":[{"-name":"123","#text":"123"},{"-name":"456","#text":"678"}]}}';
    var jsonobj = window.processData.parseJSON(jsonstr);
    //JSON对象转JSON字符串
    var jsonstr1 = window.processData.json2str(jsonobj);
    console.log("JSON对象转JSON字符串: "+jsonobj+" --转为--> "+jsonstr1);
    ```
- **parseXML(xmlstr)**
	用于`string`转`xml对象`
	
    ```javascript
    var xmlstr = "<items name='456'><item name='123'>123</item><item name='456'>678</item></items>";
    //XML字符串转XML对象
    var xmlobj = window.processData.parseXML(xmlstr);
    console.log("XML字符串转XML对象: "+xmlstr+" --转为--> "+xmlobj);
    ```
- **xml2str(xml)**
	用于`xml对象`转`string`
	
    ```javascript
    var xmlstr = "<items name='456'><item name='123'>123</item><item name='456'>678</item></items>";
    var xmlobj = window.processData.parseXML(xmlstr);
    //XML对象转XML字符串
    var xmlstr1 = window.processData.xml2str(xmlobj);
    console.log("XML对象转XML字符串: "+xmlobj+" --转为--> "+xmlstr1);
    ```
    
#原生Android与JavaScript交互文档

该组件用于移动端混合开发中`JavaScript`与原生`Android`交互。所以该组件需要`Android`端配合提供接口或主动调用js中的方法

下面会给出一个android demo

## 地址链接

- 源码所在位置：https://github.com/372623460jh/processData/tree/master/dist

- dev链接：http://libs.ijianghe.cn/js/processData/processData.js

- pro链接：http://libs.ijianghe.cn/js/processData/processData.min.js

- WebView实例的常用设置
    - WebView视口：
    ```java
    // 使用webview打开的html中申明的视口mate（viewport）标签
    web.getSettings().setUseWideViewPort(true);
    ```

    - 设置WebView为Chrome客服端（允许js弹出alert）：
    ```java
    // 允许弹出alert
    web.setWebChromeClient(new WebChromeClient() {
        // 设置webview为ChromeClient
    });
    ```

    - 设置js脚本是否可用（android与js需要交互必须设置为此项）
    ```java
    // 设置js可用
    web.getSettings().setJavaScriptEnabled(true);
    ```

    - WebView打开web页面方法
    ```java

    // 设置webview客户端
    web.setWebViewClient(new WebViewClient() {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {

            // 使用webview打开页面，url是loadUrl方法传入的链接地址。
            // url地址可以是一个可访问的链接（http://www.ijianghe.cn）
            // url地址也可以是一个Android客服端本地的静态资源(file:///android_asset/pro/index.html)
            view.loadUrl(url);

            //返回true， 立即跳转，返回false,打开网页有延时
            return true;
        }

        //重写父类方法，该方法用于执行webview加载完js后需要的操作
        @Override
        public void onPageFinished(WebView view, String url) {
            // 当webview中js加载完毕回调方法
            super.onPageFinished(view, url);

            // webview中js加载完后需要执行的初始化方法写在此处
        }
    });

    // 加载url
    web.loadUrl("file:///android_asset/pro/index.html");

    ```


##js调用Android原生方法

    通过使用原生Android中WebView实例的addJavascriptInterface方法，来实现web页面js脚本调用Android原生方法。

    ```java

    // 申明一个继承自Object的供js调用的原生方法类；该类中使用```@JavascriptInterface```注解声明的公用方法将会
    // 绑定到addJavascriptInterface方法声明的JsInterface属性下。通俗说：
    // AndroidtoJs实例化对象中的exit()方法将会被映射到window.JsInterface.exit()从而实现在js中调用原生android
    // 的方法。

    // 通过addJavascriptInterface()将Java对象映射到JS对象
    // 参数1：Javascript对象名
    // 参数2：Java对象名
    web.addJavascriptInterface(new AndroidtoJs(), "JsInterface");//AndroidtoJS类对象映射到js的test对象

    /**
     * 供js调用的Android方法类
     */
    public class AndroidtoJs extends Object {

        // 定义JS需要调用的方法
        // 被JS调用的方法必须加入@JavascriptInterface注解

        // 关闭应用的方法
        @JavascriptInterface
        public void exit() {
            Intent intent = new Intent(Intent.ACTION_MAIN);
            intent.addCategory(Intent.CATEGORY_HOME);
            startActivity(intent);
            System.exit(0);
        }

        //关闭webview的方法
        @JavascriptInterface
        public void closeWebview() {
            //关闭webview的activity
            WebViewActivity.this.finish();
        }
        }
    ```

##Android原生方法调用WebView中js方法

    需要js在webview的window对象上挂载需要提供给原生调用的全局方法。

    ```java
    /**
     * 封装调用js方法的方法
     *
     * @param methodName window下的方法名
     * @param params     需要传递的参数（json字符串）
     */
    public void callJavascript(String methodName, String params) {

        // 使用evaluateJavascript方法来调用js方法；
        // evaluateJavascript("javascript:JS方法名('参数json串')",回调方法对象);

        web.evaluateJavascript("javascript:" + methodName + "('" + params + "')", new ValueCallback<String>() {
            @Override
            public void onReceiveValue(String value) {
                //此处为 js 返回的结果
            }
        });
    }

    //callJavascript("backHandler", "");//相当于执行webviewwindow.backHandler('');

    ```