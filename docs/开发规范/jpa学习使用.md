jpa学习使用



1、定义实体类

实体类添加如下注解

~~~java
@Data
@Entity
@Table(name = "student") // 指定表名
public class Student implements Serializable {

    @Id // 指定主键
    @Column(name="id")
    private int id;

    @Column(name="name")
    private String name;

    @Column(name="sex")
    private String sex;

    @Column(name="age")
    private int age;
}
~~~



2、定义dao继承JpaRepository<T, ID>，T为对应的实体类

~~~java
@Repository
public interface StudentDao extends JpaRepository<Student, Integer> {

    // 简单查询：自定义方法（根据方法名来自动生成 SQL）
    List<Student> findByName(String name);
    
    // 复杂查询：分页查询（传入Pageable，建议做为最后一个参数传入）
    // Pageable pageable = new PageRequest(page, size, sort);
    Page<Student> findALL(Pageable pageable);
	Page<Student> findByName(String name,Pageable pageable);
    
    // 限制查询
    Student findFirstByOrderByNameAsc();
    Student findTopByOrderByAgeDesc();
    Page<Student> queryFirst10ByName(String name, Pageable pageable);
    List<Student> findFirst10ByName(String name, Sort sort);
    
    // 自定义SQL查询
    // 在 SQL 的查询方法上面使用@Query注解，如涉及到删除和修改再需要加上@Modifying，也可以根据需要添加 @Transactional对事物的支持，查询超时的设置等。
    @Modifying
    @Query("update student stu set stu.name = ?1 where stu.id = ?2")
    int modifyNameById(String name, Long id);
    @Transactional
    @Modifying
    @Query("delete from student where id = ?1")
    void deleteById(Long id);
    @Transactional(timeout = 10)
    @Query("select stu from student stu where stu.id = ?1")
    User findById(Long id);
    
    // 多表查询
    // 第一种是利用 Hibernate 的级联查询来实现，第二种是创建一个结果集的接口来接收连表查询后的结果


}
~~~



**复杂查询**

在实际的开发中我们需要用到分页、删选、连表等查询的时候就需要特殊的方法或者自定义 SQL。

https://blog.csdn.net/qq_30614345/article/details/131873042

