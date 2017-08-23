package com.meta64.mobile.test;

//NOTE: One online post said use this: (haven't tried this)
//      @RunWith(SpringRunner.class)
//      @SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
//good----> @RunWith(SpringJUnit4ClassRunner.class)
//good----> @ContextConfiguration(classes = AppServer.class)
//good---->@WebAppConfiguration
/*
 * NOTE: You'll need a test.properties file (specify your own path to it), that contains the
 * properties that you want to override from the defaults in application.properties, because you'll
 * need your own passwords, and email servers, etc.
 * 
 * New to SubNode? To find out what important properties need to be set look in the /docs/ folder of
 * github project for some help.
 */
//good---->@TestPropertySource({ "classpath:application.properties", "file:/home/clay/ferguson/meta64Oak-private/test.properties" })
public class AppServerTests {
//	private static final Logger log = LoggerFactory.getLogger(AppServerTests.class);
//
//	@Autowired
//	private RunAsJcrAdmin adminRunner;
//
//	// we probably only need on oakRepository property here and not two, but I'm just not sure how
//	// yet. Is a JUnit detail I haven't worked out yet.
//	@Autowired
//	private OakRepository oakRepository;
//	private static OakRepository _oakRepository;
//
//	@Autowired
//	private AppController controller;
//
//	@Autowired
//	private SessionContext sessionContext;
//
//	@Autowired
//	private NodeSearchService nodeSearchService;
//
//	//good---->@BeforeClass
//	public static void beforeClass() {
//		// not used, leave for reference
//	}
//
//	//good---->@AfterClass
//	public static void afterClass() {
//		/*
//		 * Yes the OakRepository has a @PreDestroy which also would be a fallback way of taking care
//		 * of the shutdown, but I like to call it explicitly here also for clarity of intent.
//		 */
//		_oakRepository.close();
//	}
//
//	//good---->@Test
//	public void simpleTest() throws Exception {
//
//		// we must save on a static variable to have the @AfterClass able to
//		// run. Autowiring a static won't work
//		_oakRepository = oakRepository;
//
//		adminRunner.run(session -> {
//			log.debug("$$$$$$$$$$$$$$$$$$$$ SubNode test is running! You did it!");
//		});
//	}
//	
//	//good---->@Test
//	public void secondTest() throws Exception {
//
//		// we must save on a static variable to have the @AfterClass able to
//		// run. Autowiring a static won't work
//		_oakRepository = oakRepository;
//
//		adminRunner.run(session -> {
//			log.debug("$$$$$$$$$$$$$$$$$$$$ Second SubNode test is running.");
//		});
//	}
}
