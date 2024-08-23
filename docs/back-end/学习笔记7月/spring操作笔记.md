##### spring事件监听简单实现

~~~java
// 在需要发布事件的地方，使用applicationContext.publishEvent()
// 注意：只有事务方法才能被监听
@Autowired
private ApplicationContext applicationContext;
applicationContext.publishEvent(new MyEvent(mySource));

// 创建事件对象
@Getter
public class MyEvent extends ApplicationEvent {

    // 来源对象，可以任意指定，但不可以没有
    private MySource mySource;

    public MyEvent(MySource mySource) {
        super(mySource);
        this.mySource = mySource;
    }
}

// 创建事件监听器
@Component
@Async
public class MyListener {

    @TransactionalEventListener(MyEvent.class)
    public void doSomething(MyEvent event) {
        // 监听到事件之后要做的操作...
    }
}
~~~



##### ApplicationContextAware 

实现这个接口，可以手动获取已实例化的bean。

在一些开源的Spring工具库中会看到这种技术的使用，因为这些库往往需要与Spring容器交互，比如读取容器的配置，访问其他的bean等等。

但注意，一般不推荐在的业务代码中使用，因为这样会增加代码与Spring的耦合性。





