# RESTful API 设计规范

REST全称是Representational State Transfer，中文意思是`表述性状态转移`。REST指的是一组架构约束条件和原则。 如果一个架构符合REST的约束条件和原则，我们就称它为RESTful架构。

RESTful架构，就是目前最流行的一种互联网软件架构。它结构清晰、符合标准、易于理解、扩展方便，所以正得到越来越多网站的采用。

## 1、URL 定义

### 1.1、协议

**https协议** ：生产环境使用
**http协议**：其它环境使用

### 1.2、域名

不同的应用、环境会使用不同的域名。

### 1.3、路径（Endpoint）定义

- **资源描述**：使用名词，而且复数的形式，蛇形（带下划线的小写方式）命名。

```javascript
  GET http://example.com/users/112            //user表示用户，加s变为复数
  GET http://example.com/article_groups            //article_groups 蛇形命名
```

- **版本号**：API的版本号放在URI上。这种方式比放在HTTP头信息中更方便、直观。版本号格式：小写字母v+整数（从1开始）。

  ```javascript
  	 GET http://example.com/v1/users/112          //版本号 v1,紧跟在域名之后
  ```

  

- **资源层级**：使用"/" 分隔，

  ```javascript
    GET http://example.com/v1/users/112/roles/11
  ```

  

  - 路径定义会使用到变量占位符，要避免路径冲突。

    ```javascript
      	GET http://example.com/article/{article_id}		// A
      	GET http://example.com/article/groups			// B
      	// B只是A的一种具体形式，表示同一个路径，通过调整资源命名可以化解冲突
      	 GET http://example.com/article_groups	//资源名改为article_groups
    ```

    

- **查询参数**

  - 变量命名规范：蛇形（带下划线的小写格式）命名。

    ```javascript
    		 GET http://example.com/v1/users?user_name=xxx		//问号?后的user_name为查询参数
    ```

    

  - 分页参数

    - page: 分页参数，第几页，从1开始
    - size: 分页数据量

- **非资源请求用动词**
  有时API调用并不涉及资源（如计算，翻译或转换）。例：

  ```javascript
  	GET /translate?from=de_DE&to=en_US&text=Hallo
  	GET /calculate?para2=23&para3=432
  ```

  在这种情况下，API响应不会返回任何资源。而是执行一个操作并将结果返回给客户端。因此，应该在URL中使用动词而不是名词，来区分资源请求和非资源请求。

  

## 2、HTTP 动词

|  动作   |  功能  | 说明                                               | 安全性 | 幂等性 |
| :-----: | :----: | :------------------------------------------------- | :----: | :----: |
|   GET   | SELECT | 从服务器获取资源（一项或多项）                     |   √    |   √    |
|  POST   | CREATE | 在服务器创建资源                                   |   X    |   X    |
|   PUT   | UPDATE | 在服务器更新资源（客户端提供改变后的完整资源）     |   X    |   √    |
| DELETE  | DELETE | 从服务器删除资源                                   |   X    |   √    |
| OPTIONS |        | 允许客户端查看服务器的性能，跨域中作为预请求的方式 |   √    |   √    |

> 安全性：指调用 HTTP 接口请求时，是否会导致资源状态变化。
> 幂等性：指多次调用 HTTP 接口请求时，只要输入不变，那么执行的结果也是不变的。
> `PATCH`方式不使用，第三方如微信H5不支持，修改操作统一使用`PUT`方法。

 

## 3、请求头

HTTP Header中会附带当前登录用户相关的认证信息，组织信息，角色信息等。如果要新增请求参数，需要在跨域请求的`Access-Control-Allow-Headers`增加对应的参数名。

常见的请求参数有：

- Authorization：Token认证信息（基于OAuth 2.0框架）
- CHEERSMIND-APPID：应用appid
- CHEERSMIND-ORG-ID：组织ID
- CHEERSMIND-ORG-TYPE: 组织类型
- CHEERSMIND-ROLE-ID：角色ID
- CHEERSMIND-CHILD-ID：学生ID

## 4、请求体

当请求为POST、PUT时,部分参数放在request body中进行传输，数据使用json格式，变量名使用蛇形（带下划线的小写格式）命名。

## 5、状态码

对接口响应的状态码进行了简化，特别是请求异常时，主要由返回的响应体来承载异常信息。

- 200 OK ：服务器成功响应用户请求的数据。
- 400 INVALID REQUEST：用户发出的请求有错误。
- 401 Unauthorized ：表示用户未被认证（令牌、用户名、密码错误）。
- 403 Forbidden ：表示用户得到认证，但是访问是被禁止的，即没有权限。
- 404 NOT FOUND：用户发出的请求的资源不存，或URI未被定义。
- 500 INTERNAL SERVER ERROR ：服务器发生错误，用户将无法判断发出的请求是否成功。
- 502 网关错误。
- 503 Service Unavailable 服务器端当前无法处理请求。

## 6、响应体

- 当无数据返回时，响应体为空，接口的请求成功与否应根据返回的状态码进行判断。
- response body中的数据和request body一样，也是使用json格式传输，变量名使用蛇形（带下划线的小写格式）命名。
- 返回的数据如果是数组，统一封装在对象中，变量名为`items`，对象便于扩展而数组不便于扩展

```json
	{
	    "total":10,
	    "items":[
	        ...
	    ]
	}
```

- 返回数据的字段需要**根据实际需求**返回，不多不少。

  > 不能为了方便**直接把数据库映射的POJO对象输出到接口**，多余的参数不仅占用网络带宽，还会给接口使用者带来不必要的困扰，甚至字段被误用。

  

- 时间格式：ISO8601时间标准格式

  ```javascript
  	2021-07-12T16:05:18.042+08:00			// T是日期和时间连接符，+08:00表示时区，东八区
  ```

  

 

## 7、错误信息

如果状态码是4xx或者5xx，response body 中的错误信息如下：

```json
{
    "code": "CHS_AUTHENTICATE_HEADER_ILLEGAL",
    "message": "无效的Authenticate",
    "detail": "Stack trace:\r\n",
    "host_id": "localhost",
    "request_id": "4cdca8f5-99bf-4a0b-be52-e38289d672fe",
    "server_time": "2021-07-12T16:05:18.042+08:00"
}
```

- code:错误码，格式为业务代码“CHS_”+自定义编码（大写字母+"_"）
- message：错误的详细描述，可用于客户端呈现。
- detail: 异常堆栈信息，生产环境不会返回。
- host_id:服务器域名或者IP
- request_id:接口请求的唯一标识
- server_time:异常发生时间（服务器时间）