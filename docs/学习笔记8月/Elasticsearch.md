##### 注意



##### 学习文章

```
https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/java-rest-low-config.html
```







##### 安装

1、官网下载es，解压，修改配置如下

```
##### ES启动报错:received plaintext http traffic on an https channel, closing connection Netty4HttpChannel

原因:
ES8默认开启了ssl认证，导致无法访问9200端口

修改：
elasticsearch.yml配置:xpack.security.enabled:把true改成false
```

2、把ik分词器解压到Elasticsearch的plugins目录下，并把文件夹名称修改为ik。

3、打开bin目录，双击下面的文件启动Elasticsearch，访问`localhost:9200`

4、安装kibana，修改配置如下，启动，访问http://localhost:5601/app/kibana#/dev_tools/console

```
server.port: 5601
 
server.host: "localhost"
 
server.name: "heyunlin" # 这个可以随意取名
 
elasticsearch.hosts: ["http://localhost:9200"] # elasticsearch服务器的地址
 
i18n.locale: "zh-CN" # 页面使用中文
```





##### 笔记

#### 1.2 数据格式

Elassitiesearch 是面向文档型数据库，一条数据在这里就是一个文档。为了方便大家理解，我们将 Elastlesearch 里存储文档数据和关系型数据库MySQL存储数据的概念进行一个类比

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/ad3f324d5535282c37183741aa571854.png)

ES 里的 Index 可以看做一个库，而 Types 相当于表， Documents 则相当于表的行。这里 Types 的概念已经被逐渐弱化， Elasticsearch 6.X 中，一个 index 下已经只能包含一个type， Elasticsearch 7.X 中, Type 的概念已经被删除了。

