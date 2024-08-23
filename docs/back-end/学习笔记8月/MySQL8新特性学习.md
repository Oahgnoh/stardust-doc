# MySQL8新特性学习

# 一、窗口函数（重点 - over）

## 0、测试建表语句

```sql
CREATE TABLE `goods`  (
   `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
   `category_id` int(0) NULL DEFAULT NULL COMMENT '商品类型ID',
   `category` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '商品类型',
   `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '商品名称',
   `price` decimal(10, 2) NULL DEFAULT NULL COMMENT '价格',
   `stock` int(0) NULL DEFAULT NULL COMMENT '库存',
   `upper_time` datetime(0) NULL DEFAULT NULL COMMENT '上架时间',
   PRIMARY KEY (`id`) USING BTREE
 ) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

 INSERT INTO `goods` VALUES (1, 2, '户外运动', '登山杖', 59.90, 1500, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (2, 1, '女装/女士精品', 'T恤', 39.90, 1000, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (3, 3, '电子设备', '华为手机', 3200.00, 100, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (4, 2, '户外运动', '山地自行车', 1399.90, 2500, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (5, 1, '女装/女士精品', '卫衣', 89.90, 1500, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (6, 1, '女装/女士精品', '呢绒外套', 399.90, 1200, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (7, 2, '户外运动', '自行车', 399.90, 1000, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (8, 3, '电子设备', '平板', 2000.00, 300, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (9, 2, '户外运动', '运动外套', 799.90, 500, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (10, 3, '电子设备', '显示器', 1000.00, 500, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (11, 2, '户外运动', '滑板', 499.90, 1200, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (12, 1, '女装/女士精品', '牛仔裤', 89.90, 3500, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (13, 2, '户外运动', '骑行装备', 399.90, 3500, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (14, 1, '女装/女士精品', '百褶裙', 29.90, 500, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (15, 3, '电子设备', '小米手机', 3100.00, 100, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (16, 1, '女装/女士精品', '连衣裙', 79.90, 2500, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (17, 3, '电子设备', '笔记本', 500.00, 1200, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (18, 3, '电子设备', '手机支架', 500.00, 1200, '2020-11-10 00:00:00');
 INSERT INTO `goods` VALUES (19, 3, '电子设备', 'U盘', 100.00, 1200, '2020-11-10 00:00:00');
```



## 1、窗口函数

**窗口函数的作用类似于在查询中对数据进行分组：**
但不同的是，分组操作并不会把分组后的结果合并成一条记录，**而窗口函数则将结果置于每一条记录中，**可以更加方便的进行实时分析处理。



### 语法结构：

```sql
窗口函数 OVER ([PARTITION BY 窗口列清单] ORDER BY 排序列清单 ASC|DESC)
 -- 在查询的时候,窗口函数列,就想是一个单独的结果集一样,将查询的结果集单独的进行分组排序,返回的一个新的列,而不会对原SELECT结果集改变.
```

或

```sql
窗口函数 OVER 窗口名
 WINDOW 窗口名 AS ([PARTITION BY 窗口列清单] ORDER BY 排序列清单 ASC|DESC)
 -- 为了可以方便查看|复用,可以在查询 WHERE Group By...之后，WINDOW声明定义窗口, 方便上面SELECT 上窗口函数直接引用;
```

**OVER() 关键字指定窗口函数的，范围：**

- 若后面括号中什么都不写,则意味着窗口包含满足WHERE条件的所有行，窗口函数基于所有行进行计算。

- - **如果不为空,则支持以下4中语法来设置窗口** window_name窗口名、partition by 窗口分组、order by 窗口排序、frame 滑动窗口



### 静态和动态窗口函数：

####  静态窗口函数

**定义**：静态窗口函数在计算时对整个窗口内的所有行使用相同的计算逻辑，不依赖于行的位置变化。

**特点**：

- 不受当前行位置影响。
- 适用于全局聚合或统计。

**常用函数**：`SUM()`, `AVG()`, `COUNT()`, `MIN()`, `MAX()`

**模版**：

```sql
SELECT
    column1,
    column2,
    AGGREGATE_FUNCTION(column) OVER (PARTITION BY partition_column) AS static_result
FROM table_name;
```



#### 动态窗口函数

**定义**：动态窗口函数会根据当前行的位置动态调整计算结果，通常与 `ORDER BY` 和窗口范围（如 `ROWS BETWEEN`）结合使用。

**特点**：

- 结果会随着当前行的位置变化而变化。
- 适用于累积计算、排名函数等。

**常用函数**：`ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LEAD()`, `LAG()`, `FIRST_VALUE()`, `LAST_VALUE()`

**模版**：

```sql
SELECT
    column1,
    column2,
    WINDOW_FUNCTION(column) OVER (PARTITION BY partition_column ORDER BY order_column ROWS BETWEEN range_start AND range_end) AS dynamic_result
FROM table_name;
```



### 常用窗口函数：

#### 序号函数：

#### ① ROW_NUMBER()

ROW_NUMBER()函数能够对数据中的序号进行顺序显示

```sql
-- 窗体函数 ROW_NUMBER();
-- 就相当于窗体中每一行记录,下标行号,表示当前行数据对于窗体的第几行;
SELECT ROW_NUMBER() OVER () AS rownum,-- 设置表查询结果集行号列名 AS rownum;
       god.*
FROM Goods AS god;
-- 因为OVER()是设置窗体的,如果什么都没控制则默认是整个结果集是一个窗体;
-- 窗体函数最大的特点是基于 OVER(); 设置窗体大小范围在通过窗口函数进行各种复杂聚合操作,很是方便;

-- 查询每个商品类型进行分组并标记行号
SELECT ROW_NUMBER() OVER ( PARTITION BY category_id ) AS rownum,-- 基于商品类型进行分组,ROW——NUMBER()每一个窗口内计算行号;
       category_id,
       category,
       NAME,
       price,
       stock,
       upper_time
FROM Goods;
```

查询每个商品分类价格前三的商品:

```sql
-- 窗口函数写法
-- 基于商品类型进行分组,ROW——NUMBER()每一个窗口内计算行号;
SELECT *
FROM (SELECT ROW_NUMBER() OVER ( PARTITION BY category_id ORDER BY price DESC ) AS rownum,
             category_id,
             category,
             NAME,
             price,
             stock,
             upper_time
      FROM Goods) A
WHERE A.rownum <= 3

-- 之前写法 （也能实现但是逻辑更难理解）
SELECT *
FROM goods g1
WHERE (SELECT COUNT(1) FROM goods g2 WHERE g2.category_id = g1.category_id AND g2.price > g1.price) < 3
ORDER BY category_id
```



#### ② RANK()

和 ROW_NUMBER() 类型，也是一种序号函数：

RANK()函数能够对序号进行并列排序，并且会跳过重复的序号，比如序号为1、1、3

- 对于排序相同的值，序号是一样的，同时后面的序号会跳过当前的序号. **后面的商品序号是不连续的.**
- **业务场景：**
  **比如班级考试，相同分数的同学应该是并列第一，而第三个同学是第三名，就出现了排名：1、1、3，就可以使用RANK，而ROW_NUMBER会将排名显示为1、2、3**

```sql
-- 使用RANK()函数获取 goods 数据表中类别为“女装/女士精品”的价格最高的4款商品信息
-- 并进行排序：
--  相同价格的商品并列排序,后面的商品排名跳过.
SELECT *
FROM (SELECT RANK() OVER (PARTITION BY category_id ORDER BY price DESC) AS row_num,
             id,
             category_id,
             category,
             NAME,
             price,
             stock
      FROM goods) A
WHERE category_id = 1
  AND row_num <= 4;
```



#### ③ DENSE_RANK()

DENSE_RANK() 函数和 RANK() 函数类似,相同值的顺序会并列排序，但不同的是，后面的顺序不会跨值，而是继续的顺序下去.

- **业务场景：**
  **班级考试，相同分数的同学应该是并列第一，而第三个同学是第二名，就出现了排名：1、1、2 的情况**

```sql
SELECT *
FROM (SELECT DENSE_RANK() OVER (PARTITION BY category_id ORDER BY price DESC) AS row_num,
             id,
             category_id,
             category,
             NAME,
             price,
             stock
      FROM goods) A
WHERE category_id = 1
  AND row_num <= 4;
```



#### 分布函数：概率统计

#### ① PERCENT_RANK()

函数是等值百分比函数。按照如下方式进行计算 (rank - 1) / (rows - 1) , 实际场景使用较少，了解即可。

- rank 相当于RANK()函数产生的序号.
- rows 相当于当前窗口的总记录数. **count() 函数**

没明白这个函数的应用场景...

```sql
-- 计算 "电子设备"类别商品的 PERCENT_RANK 值
SELECT PERCENT_RANK() OVER (PARTITION BY god.category_id ORDER BY price DESC) AS 'PERCENT_RANK'
     -- 如果想要展示百分比的话可以使用 ROUND(,);函数进行运算;
     --  ,ROUND(PERCENT_RANK() OVER(PARTITION BY god.category_id ORDER BY price DESC)*100,2) AS 'PERCENT_RANK'
     , RANK() OVER (PARTITION BY god.category_id ORDER BY price DESC)         AS 'RANK'
     , COUNT(*) OVER (PARTITION BY god.category_id)                           AS 'COUNT'
     , god.*
FROM Goods god
WHERE category_id = 3
```



#### ② CUME_DIST()

常用于计算某一值在当前中记录中的随机率，公式： rank/count。

**业务场景：**

- **计算当前商品价格是最贵的概率....**

```sql
-- 计算 "电子设备"类别商品的价格最大的概率
SELECT CONCAT(ROUND(CUME_DIST() OVER (PARTITION BY god.category_id ORDER BY price ASC) * 100, 2), '%') AS '价格是最大的概率'
     --  ,CUME_DIST() OVER(PARTITION BY god.category_id ORDER BY price ASC) AS '价格是最大的概率'
     , god.*
FROM Goods god
WHERE category_id = 3
```



#### 聚合函数：

#### ① SUM()求和、AVG()平局数、COUNT()总记录数、MIN()最小值、MAX()最大值

注：聚合函数 可以结合 over(..) 一起使用，但是over中分组字段和排序字段必须同一个。（聚合函数的over里加排序没啥意义）

```sql
-- 分组查看电子设备: 求和、平局价格、总计数、最贵商品价格、最便宜商品价格。
-- 错误写法
SELECT god.*,
       SUM(price) OVER CK1 AS '总价', -- 必须写OVER，不能写OVER()
       AVG(price) OVER CK1 AS '平局数',
       MIN(price) OVER CK1 AS '最小值',
       MAX(price) OVER CK1 AS '最大值',
       COUNT(*) OVER CK1   AS '总记录数'
FROM Goods god
WHERE category_id = 3
WINDOW CK1 AS (PARTITION BY category_id ORDER BY price DESC); -- () 相当于就是OVER()，只是这里必须写 ()

-- 运行发现这里的聚合函数,如果OVER()中进行了排序,每一行都是与上面的结果进行对比.（排序后以当前行作为一个端点）
-- 如果不加排序,则总数 平均数 ... 都会根据窗口进行计算

-- 正确写法
SELECT god.*,
       SUM(price) OVER CK1 AS '总价',
       AVG(price) OVER CK1 AS '平局数',
       MIN(price) OVER CK1 AS '最小值',
       MAX(price) OVER CK1 AS '最大值',
       COUNT(*) OVER CK1   AS '总记录数'
FROM Goods god
WHERE category_id = 3
WINDOW CK1 AS (PARTITION BY category_id);
```



#### 前后函数：

#### ① LAG(expr,n)

返回位于当前行之前的第n行的expr值。

```sql
-- LAG(要获取的列,当前行往下第n行数据)
-- 查询 "电子设备"类别的商品,升序排序,并每个商品与前一个商品价格差;
SELECT god.id,
       god.category,
       god.NAME,
       god.price,
       LAG(price, 1) OVER ( ORDER BY price ASC )           AS '上一个记录price值',
       price - (LAG(price, 1) OVER ( ORDER BY price ASC )) AS '上一个商品价格差'
FROM Goods god
WHERE category_id = 3
```

这个函数应该很常用，比如商店统计，今天商品出售比昨天多少、对比等情况，这个LAG(,) 就很方便的能获取。



#### ② LEAD(expr,n)

与LAG(,) 相反 返回当前行的后n行的expr的值。

```sql
-- 获取商品表每个记录下一个记录的值.
SELECT god.id
     , god.category
     , god.name
     , god.price
     , LEAD(price, 1) OVER (ORDER BY price ASC) AS '下一个记录price值'
FROM Goods god
WHERE category_id = 3
```



#### ③ FIRST_VALUE(列)

FIRST_VALUE(列) 可以返回第一条记录的某个列值。

```sql
#获取商品价格与最贵的价格差
SELECT god.id
     , god.category
     , god.name
     , god.price
     , FIRST_VALUE(price) OVER (ORDER BY price DESC)           AS '最贵的商品价格'
     , (FIRST_VALUE(price) OVER (ORDER BY price DESC)) - price AS '与最贵商品价格差'
FROM Goods god
WHERE category_id = 3
```



#### ④ LAST_VALUE(列)

LAST_VALUE() 与FIRST_VALUE() 相反，是获取最后一列的值。

```sql
#获取商品价格与最贵的价格差
#简单写法
SELECT god.id
     , god.category
     , god.name
     , god.price
     , LAST_VALUE(price) OVER ()           AS '最贵的商品价格'
     , (LAST_VALUE(price) OVER ()) - price AS '与最贵商品价格差'
FROM Goods god
WHERE category_id = 3
ORDER BY price ASC

#详细写法
-- 错误写法（OVER(ORDER BY xx) 中添加了ORDER BY进行排序,会根据当前排序的行数,影响当前窗口函数的窗口大小）
SELECT god.id,
       god.category,
       god.name,
       god.price,
       LAST_VALUE(price) OVER (ORDER BY price ASC) AS '最贵的商品价格'
FROM Goods god
WHERE category_id = 3
ORDER BY price ASC;
-- 正确写法 （需要明确窗口范围，通常会使用 ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING 来确保窗口包含所有行。）
SELECT
     god.id,
     god.category,
     god.name,
     god.price,
     LAST_VALUE(price) OVER(ORDER BY price ASC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS '最贵的商品价格'
FROM Goods god  
WHERE category_id = 3
ORDER BY price ASC;
```



#### 其他函数：

#### ① NTH_VALUE(expr,n)

函数返会第n行,e列的数据，和上面的LAG(e,n) 很类似，不同的是LAG(e,n) 是当前行往下 NTH_VALUE 是基于整个窗口的第n行。

```sql
-- NTH_VALUE(要获取的列,总窗口第n行数据)
SELECT god.id
     , god.category
     , god.name
     , god.price
     , NTH_VALUE(price, 1) OVER (ORDER BY price ASC) AS '第一个记录price值'
     , NTH_VALUE(price, 2) OVER (ORDER BY price ASC) AS '第二个记录price值'
FROM Goods god
WHERE category_id = 3
```

#### ② NTILE(n)

相当于对于分组后的组，在进行一次划分，数将分区中的有序数据分为n个桶，记录桶编号 n不能为-数。

```sql
#给电子设备中根据序号分为 n 组
-- 分区1：只分1个桶，则所有记录都在1个桶里
-- 分区2：只分2个桶，则所有记录尽量平局的分在2个桶里
-- 分区3：只分3个桶，则所有记录尽量平局的分在3个桶里
-- 分区8：只分8个桶，则所有记录尽量平局的分在8个桶里（当分区数已经大于总行数时，不会报错，最多就是1记录1个桶）
SELECT god.id
     , god.category
     , god.name
     , god.price
     , NTILE(1) OVER (ORDER BY price ASC) AS '分区1'
     , NTILE(2) OVER (ORDER BY price ASC) AS '分区2'
     , NTILE(3) OVER (ORDER BY price ASC) AS '分区3'
     , NTILE(8) OVER (ORDER BY price ASC) AS '分区8'
FROM Goods god
WHERE category_id = 3
```



### 小结：

**窗口函数概述：**
OVER() 子句：用于定义窗口函数的作用范围，包括窗口如何被划分以及窗口中的数据如何排序。
PARTITION BY：类似于 GROUP BY，但它不会减少输出行的数量。它将数据划分为多个分区，窗口函数在每个分区内部独立计算。
ORDER BY：在每个分区内部对数据进行排序，影响窗口函数的计算结果。
ROWS 或 RANGE：定义窗口的范围，即参与计算的具体行数或行范围。
**窗口函数的执行顺序：**
执行顺序：FROM > JOIN > WHERE > GROUP BY > HAVING > WINDOW (窗口函数定义) > ORDER BY > LIMIT
**特点：**
分组与排序：可以在分组内进行排序，不会因为分组而减少原表中的行数。



# 二、公用表表达式（重点 - with）

公用表表达式简称为 CTE 。是一个命名的临时结果集，作用范围是当前语句。cte可以理解为一个可以复用的子查询，同时cte可以引用其他的cte。

依据语法结构和执行方式的不同，公用表表达式可分为 普通公用表表达式 和 递归公用表表达式。

## 1、普通公用表表达式

- 可以把公用表表达式理解为根据子查询获得的一个虚拟表（简化写子查询的代码，方便阅读），在查询过程中可以频繁使用，**生命周期随着查询结束而结束。**

普通公用表表达式的语法结构：

```sql
WITH cte名称 -- 相当于表名
AS (子查询)
SELECT|DELETE|UPDATE 语句;
```

例如：

```sql
WITH cte_xld 
AS (SELECT * FROM base_obj_category)
SELECT * FROM base_obj bo LEFT JOIN cte_xld c 
ON bo.OBJ_TYPE = c.id

-- 查询部门人数前三个的部门信息
WITH depempCount
AS (SELECT department_id FROM employees GROUP BY department_id ORDER BY count(1) DESC LIMIT 0,3)
SELECT dep.*
FROM departments dep
         INNER JOIN depempCount depc ON dep.department_id = depc.department_id;
```



## 2、递归公用表表达式

递归公用表表达式也是一种公用表表达式，只不过，除了普通公用表表达式的特点以外，它还有自己的特点，就是 **可以调用自己**。

递归公用表表达式的语法结构：

```sql
-- 语法结构和普通公用表表达式,相差不大，就在在定义：CTE别名之前加一个 RECURSIVE关键字;
WITH recursive cte名称 -- 相当于表名
AS (子查询)
SELECT|DELETE|UPDATE 语句;
     -- 递归公用表表达式由 2 部分组成
     -- 它的子查询分为两种查询, "种子查询" "递归子查询"
```

**种子查询**

- **种子查询，意思就是获得递归的初始值**
- 这个查询只会运行一次，以创建初始数据集，之后递归 查询会一直执行，直到没有任何新的查询数据产生，递归返回。

**递归子查询**

中间通过关键字 UNION [ALL]进行连接，将返回最终的结果集。

**实例代码：**

针对于我们常用的employees表，包含employee_id，last_name和manager_id三个字段

- 如果a是b 的管理者，那么，我们可以把b叫做a的下属
- 如果同时b又是c的管理者，那么c就是b的下属，是a的下下 属。

下面我们尝试用查询语句列出所有具有下下属身份的人员信息：

**公用表表达式之前的处理方式：**

- 第一步，先找出初代管理者，就是不以任何别人为管理者的人，把结果存入临时表
- 第二步，找出所有以初代管理者为管理者的人，得到一个下属集，把结果存入临时表
- 第三步，找出所有以下属为管理者的人，得到一个下下属集，把结果存入临时表
- 第四步，找出所有以下下属为管理者的人，得到一个结果集

注：临时表,也类似与 公用表，但它生命周期定义在一次服务会话中，只有服务重启才会进行回收，不然一直存在服务中.相对影响性能。

**递归共用表表达式的处理方式：**

- 用递归公用表表达式中的种子查询，找出初代管理者。字段 n 表示代次，初始值为 1 **表示是第一 代管理者**
- 用递归公用表表达式中的递归查询，查出以这个递归公用表表达式中的人为管理者的人，**并且代次 的值加 1**
  直到没有人以这个递归公用表表达式中的人为管理者了，递归返回。
- **在最后的查询中，选出所有代次大于等于 3 的人，他们肯定是第三代及以上代次的下属了，也就是 下下属了**

```sql
WITH RECURSIVE cte AS (
    -- 种子查询，找到第一代领导
    SELECT employee_id,
           last_name,
           manager_id,
           1 AS n
    FROM employees
    WHERE employee_id = 100
    UNION ALL
    -- 递归子查询，自己调用自己 cte 循环递归,并且每次n+1,用来区分员工的等级n越高则级别越低
    SELECT a.employee_id,
           a.last_name,
           a.manager_id,
           n + 1
    FROM employees AS a
             JOIN cte ON (a.manager_id = cte.employee_id) -- 递归查询，找出以递归公用表表达式的人为领导的人

)
SELECT employee_id,
       last_name
FROM cte
WHERE n >= 3;-- 最后通过n>3获得所有大领导 中领导 小领导
```



## 3、小结

- 普通公用表表达式的作用是可以替代子查询的，而且可以被多次引用（是真正的表）
- 递归公用表表达式对查询有一个共同根节点的树形结构数据非常高效，可以轻松搞定其他查询方式难以处理的查询。



# 三、增强的JSON支持

MySQL 8.0 对JSON的支持进行了进一步增强，引入了JSON数据类型和一系列内置函数。JSON数据类型允许用户在列中直接存储JSON数据，提高了数据的灵活性和可读性。同时，MySQL 8.0还提供了一系列内置函数，如JSON_EXTRACT()、JSON_ARRAY()、JSON_OBJECT()等，用于提取、操作和验证JSON数据。这使得MySQL能够更好地处理非结构化数据，满足日益增长的数据处理需求。

### 0、测试数据

```sql
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    address JSON
);

INSERT INTO employees (name, age, address) VALUES
('John', 30, '{"street": "123 Elm St", "city": "Springfield", "zip": "12345"}'),
('Jane', 25, '{"street": "456 Oak St", "city": "Springfield", "zip": "54321"}'),
('Mike', 35, '{"street": "789 Pine St", "city": "Springfield", "zip": "67890"}');

```



### JSON_EXTRACT()

用途：从 JSON 值中提取一个或多个值。
例子：

```sql
  SELECT JSON_EXTRACT(address, '$.city', '$.zip') FROM employees;
```

### JSON_SET()

用途：设置 JSON 文档中的值。
例子：

```sql
  UPDATE employees SET address = JSON_SET(address, '$.city', 'Metropolis');
```

### JSON_INSERT()

用途：向 JSON 文档中插入新的键值对。
例子：

```sql
  UPDATE employees SET address = JSON_INSERT(address, '$.state', 'NY');
```

### JSON_REMOVE()

用途：从 JSON 文档中移除一个或多个键。
例子：

```sql
  UPDATE employees SET address = JSON_REMOVE(address, '$.zip');
```

### JSON_MODIFY()

用途：修改 JSON 文档中的值。
例子：

```sql
  UPDATE employees SET address = JSON_MODIFY(address, '$.street', 'Broadway');
```

### JSON_OBJECT()

用途：构建一个新的 JSON 对象。
例子：

```sql
  SELECT JSON_OBJECT('name', name, 'age', age) AS employee_info FROM employees;
```

### JSON_OBJECTAGG()

用途：将多行数据聚合为一个 JSON 对象。
例子：

```sql
  SELECT JSON_OBJECTAGG(name, address) AS all_employees FROM employees;
```

### JSON_TABLE()

用途：将 JSON 数据转换为表格形式。
例子：

```sql
  SELECT e.id, e.name, j.city, j.street
  FROM employees e
  JOIN JSON_TABLE(
      e.address,
      "$"
      COLUMNS(
          city VARCHAR(100) PATH '$.city',
          street VARCHAR(100) PATH '$.street'
      )
  ) j;
```

### JSON_SEARCH()

用途：查找 JSON 值中的字符串。
例子：

```sql
  SELECT JSON_SEARCH(address, 'one', 'Springfield') FROM employees;
```

### JSON_CONTAINS()

用途：检查 JSON 值是否包含另一个 JSON 值或字符串。
例子：

```sql
  SELECT JSON_CONTAINS(address, '"Springfield"', '$') FROM employees;
```

### JSON_TYPE()

用途：确定 JSON 值的类型。
例子：

```sql
  SELECT JSON_TYPE(address) FROM employees;
```

### JSON_LENGTH()

用途：返回 JSON 值中元素的数量。
例子：

```sql
  SELECT JSON_LENGTH(address) FROM employees;
```

### JSON_DEPTH()

用途：返回 JSON 值的最大嵌套深度。
例子：

```sql
  SELECT JSON_DEPTH(address) FROM employees;
```

### JSON_PRETTY()

用途：以易读的格式输出 JSON 值。
例子：

```sql
  SELECT JSON_PRETTY(address) FROM employees;
```

### JSON_ARRAY()

用途：将零个或多个值转换成 JSON 数组。
例子：

```sql
  SELECT JSON_ARRAY('street', 'city', 'zip') AS address_fields FROM employees;
```

### JSON_ARRAYAGG()

用途：将多行数据聚合为一个 JSON 数组。
例子：

```sql
  SELECT JSON_ARRAYAGG(address) AS all_addresses FROM employees;
```

### JSON_MERGE()

用途：合并两个或多个 JSON 值。
例子：

```sql
  SELECT JSON_MERGE(address, '{"country": "USA"}') AS merged_address FROM employees;
```

### JSON_QUOTE()

用途：将字符串转换为 JSON 字符串。
例子：

```sql
  SELECT JSON_QUOTE('Springfield') AS quoted_string;
```

### JSON_VALID()

用途：验证一个字符串是否是一个有效的 JSON 值。
例子：

```sql
  SELECT JSON_VALID(address) FROM employees;
```



# 四、隐藏索引

隐藏一个索引的语法是：

```sql
ALTER TABLE t ALTER INDEX i INVISIBLE;
```

恢复显示该索引的语法是：

```sql
ALTER TABLE t ALTER INDEX i VISIBLE;
```

当一个索引被隐藏时，我们可以从 show index 命令的输出中看到，该索引的 Visible 属性值为 NO。

```sql
SHOW INDEX FROM t WHERE Key_name = 'i';
```

注意：当索引被隐藏时，它的内容仍然是和正常索引一样实时更新的，这个特性本身是专门为优化调试使用。如果你长期隐藏一个索引，那还不如干脆删掉，因为毕竟索引的存在会影响插入、更新和删除的性能。

