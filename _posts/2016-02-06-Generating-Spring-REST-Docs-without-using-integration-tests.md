---
layout: post
authors: [tim_ysewyn]
title: 'Generating Spring REST Docs without using integration tests'
image: /img/spring.png
tags: [Spring, REST Docs, Spring REST Docs, Testing, Integration, Integration Test, Unit Test]
category: Spring
comments: true
---
## The problem

A couple of days ago I was working on a project of one of our customers.
One of their new applications needed to expose a public API, and of course we needed to hand over a set of documentation about those REST endpoints.
Some people were already starting to do this manually in Confluence, but after a while (and we're talking about a timespan just under 2 hours) this became a tedious job. 
We had to continuously adjust the input & output contracts, the different endpoints,...
Using Spring REST Docs I wanted to automatically document all of the public API endpoints, while we were also testing all of the components in the whole application.
For some undisclosed reasons we simply couldn't write integration tests, so we were stuck with our unit tests and mocked objects.

## The solution

Imagine you have following service and controller in a simple Spring Boot application:
    {% highlight java %}
    @Service
    public class DeviceService {

        public List<Device> getDevices() {
        List<Device> devices = new ArrayList<>();

            /*
                Some business logic here...
            */

            return devices;
        }
    }

    @RestController
    @RequestMapping("devices")
    public class DeviceController {

        private DeviceService deviceService;

        @Autowired
        public DeviceController(DeviceService deviceService) {
            this.deviceService = deviceService;
        }

        @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
        public List<Device> getDevices() {
            return this.deviceService.getDevices();
        }
    }
    {% endhighlight %}

<br />
Since this is a Spring Boot application both classes will automagically be instantiated.
Because you need to annotate your unit tests at class level with **@WebAppConfiguration** and **@SpringApplicationConfiguration**, we can easily create a new Spring Boot application and use this for our documentation.
In this new application we set the base package that needs to be scanned to our controller sub package, and create a mock implementation of our `DeviceService`.
    {% highlight java %}
    @SpringBootApplication(scanBasePackages = { "be.ordina.blog.controller" } )
    public class Application {

        @Bean
        public DeviceService getDeviceService() {
            return EasyMock.createStrictMock(DeviceService.class);
        }
    }
    {% endhighlight %}
    
<br />
Our `DeviceControllerTests` class will then look something like this:
    {% highlight java %}
    @RunWith(SpringJUnit4ClassRunner.class)
    @SpringApplicationConfiguration(classes = { Application.class })
    @WebAppConfiguration
    public class DeviceControllerTests {

        @Rule
        public RestDocumentation restDocumentation = new RestDocumentation("target/generated-snippets");

        @Autowired
        private WebApplicationContext context;

        @Autowired
        public DeviceService deviceService;

        private MockMvc mockMvc;

        @Before
        public void setUp() {
            this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context)
                                            .apply(documentationConfiguration(this.restDocumentation))
                                            .build();
        }

        @After
        public void cleanup() {
            EasyMock.verify(deviceService);
            EasyMock.reset(deviceService);
        }

        @Test
        public void getDevices() throws Exception {
            Device firstDevice = new Device("iPhone 6");
            Device secondDevice = new Device("Nexus 5");
            
            List<Device> devices = new ArrayList<>();
            devices.add(firstDevice);
            devices.add(secondDevice);

            EasyMock.expect(deviceService.getDevices()).andReturn(devices);

            EasyMock.replay(deviceService);

            this.mockMvc.perform(get("/devices").accept(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$", hasSize(2)))
                        .andExpect(jsonPath("$[0].name", is(firstDevice.getName())))
                        .andExpect(jsonPath("$[1].name", is(secondDevice.getName())))
                        .andDo(document("device"));
        }
    }
    {% endhighlight %}
    
<br />
So this is how I managed to get rid of the manual, tedious work and keep my unit tests - and got back to the more serious part of my life: coding like a monkey. =)
<br />

> PS: All of the code above is checked in at our public github repo, so you are free to clone the working application! You can find it [here](https://github.com/ordina-jworks/spring-rest-docs-without-integration-tests)!