package com.meta64.mobile;

import static org.junit.Assert.assertTrue;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.repo.OakRepository;
import com.meta64.mobile.request.SignupRequest;
import com.meta64.mobile.response.SignupResponse;
import com.meta64.mobile.user.RunAsJcrAdmin;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = AppServer.class)
@WebAppConfiguration
@TestPropertySource({"classpath:application.properties", "classpath:application-dev.properties", "file:/home/clay/ferguson/meta64Oak-private/test.properties"})
public class AppServerTests {

	private static final String fakeCaptcha = "nocaptcha";
	private static final Logger log = LoggerFactory.getLogger(AppServerTests.class);

	@Autowired
	private RunAsJcrAdmin adminRunner;

	@Autowired
	private OakRepository oakRepository;

	private static OakRepository _oakRepository;

	@Autowired
	private AppController controller;

	@Autowired
	private SessionContext sessionContext;

	@BeforeClass
	public static void beforeClass() {
		// not used, leave for reference
	}

	@AfterClass
	public static void afterClass() {
		/*
		 * Yes the OakRepository has a @PreDestroy which also would be a
		 * fallback way of taking care of the shutdown, but I like to call it
		 * explicitly here also for clarity of intent.
		 */
		_oakRepository.close();
	}

	/*
	 * Test annotation currently commented out. To run this test you will need
	 * to edit application.properties and put in a jcrAdminPassword property. I
	 * don't have spring profiles working yet and I'm currently passing
	 * jcrAdminPassword on command line, so it's not set in properties
	 * currently.
	 */
	@Test
	public void contextLoads() throws Exception {

		// we must save on a static variable to have the @AfterClass able to
		// run. Autowiring a static won't work
		_oakRepository = oakRepository;

		adminRunner.run(session -> {
			SignupRequest signupReq = new SignupRequest();

			/* setup fake captcha */
			sessionContext.setCaptcha(fakeCaptcha);

			/*
			 * Signup a new user
			 */
			String userName = "beavis";
			signupReq.setUserName(userName);
			signupReq.setPassword(userName);
			signupReq.setEmail("beavis@gmail.com");
			signupReq.setCaptcha(fakeCaptcha);
			SignupResponse signupRes = controller.signup(signupReq);
			assertTrue(signupRes.isSuccess());

//			/*
//			 * Login the new user
//			 */
//			LoginRequest loginReq = new LoginRequest();
//			loginReq.setUserName(userName);
//			loginReq.setPassword(userName);
//			LoginResponse loginRes = controller.login(loginReq);
//			assertTrue(loginRes.isSuccess());
//
//			String userRoot = loginRes.getRootNode().getId();
//
//			/*
//			 * Create a new node under the root node for user.
//			 */
//			CreateSubNodeRequest createSubNodeReq = new CreateSubNodeRequest();
//			createSubNodeReq.setNodeId(userRoot);
//			createSubNodeReq.setNewNodeName("test-new-node-name");
//			CreateSubNodeResponse createSubNodeRes = controller.createSubNode(createSubNodeReq);
//			assertTrue(createSubNodeRes.isSuccess());
//
//			String newNodeId = createSubNodeRes.getNewNode().getId();
//
//			/*
//			 * Add a public share privilege on the new node
//			 */
//			AddPrivilegeRequest addPrivReq = new AddPrivilegeRequest();
//			addPrivReq.setPrincipal("everyone");
//
//			List<String> privs = new LinkedList<String>();
//			privs.add("read");
//			addPrivReq.setPrivileges(privs);
//			addPrivReq.setNodeId(newNodeId);
//			AddPrivilegeResponse addPrivRes = controller.addPrivilege(addPrivReq);
//			assertTrue(addPrivRes.isSuccess());
//
//			/*
//			 * Query the privileges to verify that we see the public share
//			 */
//			GetNodePrivilegesRequest getPrivsReq = new GetNodePrivilegesRequest();
//			getPrivsReq.setNodeId(newNodeId);
//			GetNodePrivilegesResponse getPrivsRes = controller.getNodePrivileges(getPrivsReq);
//			assertTrue(getPrivsRes.isSuccess());
//
//			/*
//			 * Verify public share (in a very lazy hacky way for now)
//			 */
//			String privsCheck = Convert.JsonStringify(getPrivsRes);
//			log.debug("***** PRIVS (with public): " + privsCheck);
//			assertTrue(privsCheck.contains("read"));
//
//			/*
//			 * Now we remove the share we just added
//			 */
//			RemovePrivilegeRequest removePrivReq = new RemovePrivilegeRequest();
//			removePrivReq.setNodeId(newNodeId);
//			removePrivReq.setPrincipal("everyone");
//			removePrivReq.setPrivilege("jcr:read");
//			RemovePrivilegeResponse removePrivRes = controller.removePrivilege(removePrivReq);
//			assertTrue(removePrivRes.isSuccess());
//
//			/*
//			 * now read back in privileges to verify the one we removed is now
//			 * gone
//			 */
//			getPrivsReq = new GetNodePrivilegesRequest();
//			getPrivsReq.setNodeId(newNodeId);
//			getPrivsRes = controller.getNodePrivileges(getPrivsReq);
//			assertTrue(getPrivsRes.isSuccess());
//
//			privsCheck = Convert.JsonStringify(getPrivsRes);
//			log.debug("***** PRIVS (with public REMOVED): " + privsCheck);
//			assertTrue(!privsCheck.contains("read"));
//
//			// shareNodeTest(newUserName);
		});
	}

	public void shareNodeTest(String userName) throws Exception {
	}
}
