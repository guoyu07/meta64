package com.meta64.mobile;

import java.io.File;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.meta64.mobile.aspect.OakSession;
import com.meta64.mobile.config.SessionContext;
import com.meta64.mobile.config.SpringContextUtil;
import com.meta64.mobile.image.CaptchaMaker;
import com.meta64.mobile.request.AddPrivilegeRequest;
import com.meta64.mobile.request.AnonPageLoadRequest;
import com.meta64.mobile.request.BrowseFolderRequest;
import com.meta64.mobile.request.ChangePasswordRequest;
import com.meta64.mobile.request.CloseAccountRequest;
import com.meta64.mobile.request.CreateSubNodeRequest;
import com.meta64.mobile.request.DeleteAttachmentRequest;
import com.meta64.mobile.request.DeleteNodesRequest;
import com.meta64.mobile.request.DeletePropertyRequest;
import com.meta64.mobile.request.ExpandAbbreviatedNodeRequest;
import com.meta64.mobile.request.ExportRequest;
import com.meta64.mobile.request.FileSearchRequest;
import com.meta64.mobile.request.GenerateRSSRequest;
import com.meta64.mobile.request.GetNodePrivilegesRequest;
import com.meta64.mobile.request.GetPlayerInfoRequest;
import com.meta64.mobile.request.GetServerInfoRequest;
import com.meta64.mobile.request.GetSharedNodesRequest;
import com.meta64.mobile.request.ImportRequest;
import com.meta64.mobile.request.InitNodeEditRequest;
import com.meta64.mobile.request.InsertBookRequest;
import com.meta64.mobile.request.InsertNodeRequest;
import com.meta64.mobile.request.LoginRequest;
import com.meta64.mobile.request.LogoutRequest;
import com.meta64.mobile.request.MoveNodesRequest;
import com.meta64.mobile.request.NodeSearchRequest;
import com.meta64.mobile.request.OpenSystemFileRequest;
import com.meta64.mobile.request.RemovePrivilegeRequest;
import com.meta64.mobile.request.RenameNodeRequest;
import com.meta64.mobile.request.RenderNodeRequest;
import com.meta64.mobile.request.ResetPasswordRequest;
import com.meta64.mobile.request.SaveNodeRequest;
import com.meta64.mobile.request.SavePropertyRequest;
import com.meta64.mobile.request.SaveUserPreferencesRequest;
import com.meta64.mobile.request.SetNodePositionRequest;
import com.meta64.mobile.request.SetPlayerInfoRequest;
import com.meta64.mobile.request.SignupRequest;
import com.meta64.mobile.request.SplitNodeRequest;
import com.meta64.mobile.request.UploadFromUrlRequest;
import com.meta64.mobile.response.AddPrivilegeResponse;
import com.meta64.mobile.response.AnonPageLoadResponse;
import com.meta64.mobile.response.BrowseFolderResponse;
import com.meta64.mobile.response.ChangePasswordResponse;
import com.meta64.mobile.response.CloseAccountResponse;
import com.meta64.mobile.response.CreateSubNodeResponse;
import com.meta64.mobile.response.DeleteAttachmentResponse;
import com.meta64.mobile.response.DeleteNodesResponse;
import com.meta64.mobile.response.DeletePropertyResponse;
import com.meta64.mobile.response.ExpandAbbreviatedNodeResponse;
import com.meta64.mobile.response.ExportResponse;
import com.meta64.mobile.response.FileSearchResponse;
import com.meta64.mobile.response.GenerateRSSResponse;
import com.meta64.mobile.response.GetNodePrivilegesResponse;
import com.meta64.mobile.response.GetPlayerInfoResponse;
import com.meta64.mobile.response.GetServerInfoResponse;
import com.meta64.mobile.response.GetSharedNodesResponse;
import com.meta64.mobile.response.ImportResponse;
import com.meta64.mobile.response.InitNodeEditResponse;
import com.meta64.mobile.response.InsertBookResponse;
import com.meta64.mobile.response.InsertNodeResponse;
import com.meta64.mobile.response.LoginResponse;
import com.meta64.mobile.response.LogoutResponse;
import com.meta64.mobile.response.MoveNodesResponse;
import com.meta64.mobile.response.NodeSearchResponse;
import com.meta64.mobile.response.OpenSystemFileResponse;
import com.meta64.mobile.response.RemovePrivilegeResponse;
import com.meta64.mobile.response.RenameNodeResponse;
import com.meta64.mobile.response.RenderNodeResponse;
import com.meta64.mobile.response.ResetPasswordResponse;
import com.meta64.mobile.response.SaveNodeResponse;
import com.meta64.mobile.response.SavePropertyResponse;
import com.meta64.mobile.response.SaveUserPreferencesResponse;
import com.meta64.mobile.response.SetNodePositionResponse;
import com.meta64.mobile.response.SetPlayerInfoResponse;
import com.meta64.mobile.response.SignupResponse;
import com.meta64.mobile.response.SplitNodeResponse;
import com.meta64.mobile.response.UploadFromUrlResponse;
import com.meta64.mobile.service.AclService;
import com.meta64.mobile.service.AttachmentService;
import com.meta64.mobile.service.ExportXmlService;
import com.meta64.mobile.service.ExportZipService;
import com.meta64.mobile.service.FileSystemService;
import com.meta64.mobile.service.ImportBookService;
import com.meta64.mobile.service.ImportXmlService;
import com.meta64.mobile.service.LuceneService;
import com.meta64.mobile.service.NodeEditService;
import com.meta64.mobile.service.NodeMoveService;
import com.meta64.mobile.service.NodeRenderService;
import com.meta64.mobile.service.NodeSearchService;
import com.meta64.mobile.service.RssService;
import com.meta64.mobile.service.SolrSearchService;
import com.meta64.mobile.service.SystemService;
import com.meta64.mobile.service.UserManagerService;
import com.meta64.mobile.util.Convert;
import com.meta64.mobile.util.DesktopApi;
import com.meta64.mobile.util.NotLoggedInException;
import com.meta64.mobile.util.ThreadLocals;
import com.meta64.mobile.util.VarUtil;

/**
 * Primary Spring MVC controller. All application logic from the browser connects directly to this
 * controller which is the only controller. Importantly the main SPA page is retrieved thru this
 * controller, and the binary attachments are also served up thru this interface.
 * 
 * Note, it's critical to understand the OakSession AOP code or else this class will be confusing
 * regarding how the OAK transactions are managed and how logging in is done.
 * 
 * This class has no documentation on the methods because it's a wrapper around the service methods
 * which is where the documentation can be found for each operation in here. It's a better
 * architecture to have all the AOP for any given aspect be in one particular layer, because of how
 * Spring AOP uses Proxies. Things can get pretty ugly when you have various proxied objects calling
 * other proxies objects, so we have all the AOP for a service call in this controller and then all
 * the services are pure and simple Spring Singletons.
 * 
 * There's a lot of boiler-plate code in here, but it's just required. This is probably the only
 * code in the system that looks 'redundant' (non-DRY), but this is because we want certain things
 * in certain layers (abstraction related and for loose-coupling).
 * 
 * TODO: need to get all "program logic" out of this layer (there is a tiny bit of it in here),
 * because it doesn't belong here. Should all be contained in service layer.
 */
@Controller
public class AppController {
	private static final Logger log = LoggerFactory.getLogger(AppController.class);

	private static final String API_PATH = "/mobile/api";

	@Autowired
	private SessionContext sessionContext;

	@Autowired
	private UserManagerService userManagerService;

	@Autowired
	private NodeRenderService nodeRenderService;

	@Autowired
	private NodeSearchService nodeSearchService;

	@Autowired
	private ImportXmlService importXmlService;

	@Autowired
	private ExportXmlService exportXmlService;

	@Autowired
	private ExportZipService exportZipService;
	
	@Autowired
	private ImportBookService importBookService;

	@Autowired
	private NodeEditService nodeEditService;

	@Autowired
	private NodeMoveService nodeMoveService;

	@Autowired
	AttachmentService attachmentService;

	@Autowired
	private AclService aclService;

	@Autowired
	private SystemService systemService;

	@Autowired
	private FileSystemService fileSystemService;

	@Autowired
	private SolrSearchService solrSearchService;

	@Autowired
	private LuceneService luceneService;

	@Autowired
	private RssService rssService;

	private static final boolean logRequests = false;

	/*
	 * This is the actual app page loading request, for his SPA (Single Page Application) this is
	 * the request to load the page.
	 * 
	 * ID is optional url parameter that user can specify to access a specific node in the
	 * repository by uuid.
	 * 
	 * passCode is an auth code for a password reset
	 */
	@RequestMapping("/")
	public String mobile(@RequestParam(value = "id", required = false) String id, //
			@RequestParam(value = "cmd", required = false) String cmd, //
			@RequestParam(value = "signupCode", required = false) String signupCode, //
			// @RequestParam(value = "passCode", required = false) String passCode, //
			Model model) throws Exception {
		logRequest("mobile", null);

		if (signupCode != null) {
			userManagerService.processSignupCode(signupCode, model);
		}

		log.debug("Rendering main page: current userName: " + sessionContext.getUserName() + " id=" + id);

		sessionContext.setUrlId(id);

		/*
		 * url Cmd can be things like "addNode", to trigger quick note-taking under some other node,
		 * so the app can be used as a productivity aid, and take notes quicker than someone could
		 * open nodepad, or whatever other text editor, and deal with where to save file to, etc
		 */
		sessionContext.setUrlCmd(cmd);
		return "index";
	}

	@RequestMapping(value = API_PATH + "/captcha", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
	public @ResponseBody byte[] captcha() throws Exception {
		logRequest("captcha", null);
		String captcha = CaptchaMaker.createCaptchaString();
		sessionContext.setCaptcha(captcha);
		return CaptchaMaker.makeCaptcha(captcha);
	}

	@RequestMapping(value = API_PATH + "/signup", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody SignupResponse signup(@RequestBody SignupRequest req) throws Exception {
		logRequest("signup", req);
		SignupResponse res = new SignupResponse();
		userManagerService.signup(null, req, res, false);
		return res;
	}

	@RequestMapping(value = API_PATH + "/login", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody LoginResponse login(@RequestBody LoginRequest req) throws Exception {
		logRequest("login", req);
		LoginResponse res = new LoginResponse();
		res.setMessage("success: " + String.valueOf(++sessionContext.counter));
		userManagerService.login(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/closeAccount", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody CloseAccountResponse closeAccount(@RequestBody CloseAccountRequest req, HttpSession session) throws Exception {
		logRequest("closeAccount", req);
		CloseAccountResponse res = new CloseAccountResponse();
		checkHttpSession();
		userManagerService.closeAccount(req, res);
		SessionContext sessionContext = (SessionContext) SpringContextUtil.getBean(SessionContext.class);
		if (sessionContext != null) {
			sessionContext.setHttpSessionToInvalidate(session);
		}
		return res;
	}

	@RequestMapping(value = API_PATH + "/logout", method = RequestMethod.POST)
	// @OakSession // commenting since we currently don't touch the DB during a
	// logout.
	public @ResponseBody LogoutResponse logout(@RequestBody LogoutRequest req, HttpSession session) throws Exception {
		logRequest("logout", req);

		/*
		 * DO NOT DELETE:
		 * 
		 * We are defining this method with a 'session' parameter, because Spring will automatically
		 * autowire that correctly, but here is another possible way to do it:
		 * 
		 * ServletRequestAttributes attr = (ServletRequestAttributes)
		 * RequestContextHolder.currentRequestAttributes(); HttpSession session =
		 * attr.getRequest().getSession();
		 */

		session.invalidate();
		LogoutResponse res = new LogoutResponse();
		res.setSuccess(true);
		return res;
	}

	@RequestMapping(value = API_PATH + "/renderNode", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody RenderNodeResponse renderNode(@RequestBody RenderNodeRequest req, //
			HttpServletRequest httpReq) throws Exception {

		logRequest("renderNode", req);
		RenderNodeResponse res = new RenderNodeResponse();
		checkHttpSession();
		nodeRenderService.renderNode(null, req, res, true);
		return res;
	}

	@RequestMapping(value = API_PATH + "/initNodeEdit", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody InitNodeEditResponse initNodeEdit(@RequestBody InitNodeEditRequest req) throws Exception {
		logRequest("initNodeEdit", req);
		InitNodeEditResponse res = new InitNodeEditResponse();
		checkHttpSession();
		nodeRenderService.initNodeEdit(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/expandAbbreviatedNode", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody ExpandAbbreviatedNodeResponse expandAbbreviatedNode(@RequestBody ExpandAbbreviatedNodeRequest req) throws Exception {
		logRequest("expandAbbreviatedNode", req);
		ExpandAbbreviatedNodeResponse res = new ExpandAbbreviatedNodeResponse();
		checkHttpSession();
		nodeRenderService.expandAbbreviatedNode(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/getNodePrivileges", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody GetNodePrivilegesResponse getNodePrivileges(@RequestBody GetNodePrivilegesRequest req) throws Exception {
		logRequest("getNodePrivileges", req);
		GetNodePrivilegesResponse res = new GetNodePrivilegesResponse();
		checkHttpSession();
		aclService.getNodePrivileges(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/addPrivilege", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody AddPrivilegeResponse addPrivilege(@RequestBody AddPrivilegeRequest req) throws Exception {
		logRequest("addPrivilege", req);
		AddPrivilegeResponse res = new AddPrivilegeResponse();
		checkHttpSession();
		aclService.addPrivilege(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/removePrivilege", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody RemovePrivilegeResponse removePrivilege(@RequestBody RemovePrivilegeRequest req) throws Exception {
		logRequest("removePrivilege", req);
		RemovePrivilegeResponse res = new RemovePrivilegeResponse();
		checkHttpSession();
		aclService.removePrivilege(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/export", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody ExportResponse exportToXml(@RequestBody ExportRequest req) throws Exception {
		logRequest("exportToXml", req);
		ExportResponse res = new ExportResponse();
		checkHttpSession();
		if ("xml".equalsIgnoreCase(req.getExportExt())) {
			exportXmlService.export(null, req, res);
		}
		if ("zip".equalsIgnoreCase(req.getExportExt())) {
			//Work in progress: Next thing to do will be add radio button to GUI so we can select which we want XML or ZIP
			exportZipService.export(null, req, res);
		}
		else {
			throw new Exception("Unsupported file extension.");
		}
		return res;
	}

	@RequestMapping(value = API_PATH + "/import", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody ImportResponse importFromFile(@RequestBody ImportRequest req) throws Exception {
		logRequest("import", req);
		ImportResponse res = new ImportResponse();
		checkHttpSession();

		String fileName = req.getSourceFileName();
		if (fileName.toLowerCase().endsWith(".xml") || req.getNodeId().equals("/")) {
			importXmlService.importFromXml(null, req, res);
			/*
			 * It is not a mistake that there is no session.save() here. The import is using the
			 * workspace object which specifically documents that the saving on the session is not
			 * needed.
			 */
		}
		else if (fileName.toLowerCase().endsWith(".zip")) {
			throw new Exception("This code path is currently disabled, but adding an attachment zip file can do this.");
			// importXmlService.importFromZip(null, req, res);
			// ThreadLocals.getJcrSession().save();
		}
		else {
			throw new Exception("Unable to import from file with unknown extension: " + fileName);
		}
		return res;
	}

	@RequestMapping(value = API_PATH + "/setNodePosition", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody SetNodePositionResponse setNodePosition(@RequestBody SetNodePositionRequest req) throws Exception {
		logRequest("setNodePosition", req);
		SetNodePositionResponse res = new SetNodePositionResponse();
		checkHttpSession();
		nodeMoveService.setNodePosition(null, req, res);
		return res;
	}

	/*
	 * http://stackoverflow.com/questions/5567905/jackrabbit-jcr-organisation-of -text-content-data
	 */
	@RequestMapping(value = API_PATH + "/createSubNode", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody CreateSubNodeResponse createSubNode(@RequestBody CreateSubNodeRequest req) throws Exception {
		logRequest("createSubNode", req);
		CreateSubNodeResponse res = new CreateSubNodeResponse();
		checkHttpSession();
		nodeEditService.createSubNode(null, req, res);
		return res;
	}

	/*
	 * Inserts node 'inline' at the position specified in the InsertNodeRequest.targetName
	 */
	@RequestMapping(value = API_PATH + "/insertNode", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody InsertNodeResponse insertNode(@RequestBody InsertNodeRequest req) throws Exception {
		logRequest("insertNode", req);
		InsertNodeResponse res = new InsertNodeResponse();
		checkHttpSession();
		nodeEditService.insertNode(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/renameNode", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody RenameNodeResponse renameNode(@RequestBody RenameNodeRequest req) throws Exception {
		logRequest("renameNode", req);
		RenameNodeResponse res = new RenameNodeResponse();
		checkHttpSession();
		nodeEditService.renameNode(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/insertBook", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody InsertBookResponse insertBook(@RequestBody InsertBookRequest req) throws Exception {
		logRequest("insertBook", req);
		InsertBookResponse res = new InsertBookResponse();
		if (!sessionContext.isAdmin()) {
			throw new Exception("admin only function.");
		}
		checkHttpSession();
		importBookService.insertBook(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/deleteNodes", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody DeleteNodesResponse deleteNodes(@RequestBody DeleteNodesRequest req) throws Exception {
		logRequest("deleteNodes", req);
		DeleteNodesResponse res = new DeleteNodesResponse();
		checkHttpSession();
		nodeMoveService.deleteNodes(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/moveNodes", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody MoveNodesResponse moveNodes(@RequestBody MoveNodesRequest req) throws Exception {
		logRequest("moveNodes", req);
		MoveNodesResponse res = new MoveNodesResponse();
		checkHttpSession();
		nodeMoveService.moveNodes(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/deleteAttachment", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody DeleteAttachmentResponse deleteAttachment(@RequestBody DeleteAttachmentRequest req) throws Exception {
		logRequest("deleteAttachment", req);
		DeleteAttachmentResponse res = new DeleteAttachmentResponse();
		checkHttpSession();
		attachmentService.deleteAttachment(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/deleteProperty", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody DeletePropertyResponse deleteProperty(@RequestBody DeletePropertyRequest req) throws Exception {
		logRequest("deleteProperty", req);
		DeletePropertyResponse res = new DeletePropertyResponse();
		checkHttpSession();
		nodeEditService.deleteProperty(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/saveNode", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody SaveNodeResponse saveNode(@RequestBody SaveNodeRequest req) throws Exception {
		logRequest("saveNode", req);
		SaveNodeResponse res = new SaveNodeResponse();
		checkHttpSession();
		nodeEditService.saveNode(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/saveProperty", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody SavePropertyResponse saveProperty(@RequestBody SavePropertyRequest req) throws Exception {
		logRequest("saveProperty", req);
		SavePropertyResponse res = new SavePropertyResponse();
		checkHttpSession();
		nodeEditService.saveProperty(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/changePassword", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody ChangePasswordResponse changePassword(@RequestBody ChangePasswordRequest req) throws Exception {
		logRequest("changePassword", req);
		ChangePasswordResponse res = new ChangePasswordResponse();
		checkHttpSession();
		userManagerService.changePassword(req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/resetPassword", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody ResetPasswordResponse resetPassword(@RequestBody ResetPasswordRequest req) throws Exception {
		logRequest("resetPassword", req);
		ResetPasswordResponse res = new ResetPasswordResponse();
		checkHttpSession();
		userManagerService.resetPassword(req, res);
		return res;
	}

	/*
	 * We could persist the real filename when uploaded, and then make the links actually reference
	 * that filename on this type of path. Will have to add to binary info property sent to client
	 * in JSON.
	 */
	@RequestMapping(value = API_PATH + "/bin/{fileName}", method = RequestMethod.GET)
	@OakSession
	public @ResponseBody ResponseEntity<InputStreamResource> getBinary(@PathVariable("fileName") String fileName, @RequestParam("nodeId") String nodeId)
			throws Exception {
		logRequest("bin", null);
		return attachmentService.getBinary(null, nodeId);
	}

	@RequestMapping(value = API_PATH + "/upload", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody ResponseEntity<?> upload(//
			@RequestParam(value = "nodeId", required = true) String nodeId, //
			@RequestParam(value = "explodeZips", required = true) String explodeZips, //
			@RequestParam(value = "files", required = true) MultipartFile[] uploadFiles) throws Exception {
		logRequest("upload", null);
		if (nodeId == null) {
			return new ResponseEntity<>(HttpStatus.OK);
		}
		return attachmentService.uploadMultipleFiles(null, nodeId, uploadFiles, explodeZips.equalsIgnoreCase("true"));
	}

	@RequestMapping(value = API_PATH + "/uploadFromUrl", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody UploadFromUrlResponse uploadFromUrl(@RequestBody UploadFromUrlRequest req) throws Exception {
		logRequest("uploadFromUrl", req);
		UploadFromUrlResponse res = new UploadFromUrlResponse();
		checkHttpSession();
		attachmentService.uploadFromUrl(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/anonPageLoad", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody AnonPageLoadResponse anonPageLoad(@RequestBody AnonPageLoadRequest req) throws Exception {
		logRequest("anonPageLoad", req);
		AnonPageLoadResponse res = new AnonPageLoadResponse();
		checkHttpSession();
		nodeRenderService.anonPageLoad(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/nodeSearch", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody NodeSearchResponse nodeSearch(@RequestBody NodeSearchRequest req) throws Exception {
		logRequest("nodeSearch", req);
		NodeSearchResponse res = new NodeSearchResponse();
		checkHttpSession();
		nodeSearchService.search(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/browseFolder", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody BrowseFolderResponse browseFolder(@RequestBody BrowseFolderRequest req) throws Exception {
		logRequest("browseFolder", req);
		if (!sessionContext.isAdmin()) {
			throw new Exception("admin only function.");
		}
		BrowseFolderResponse res = new BrowseFolderResponse();
		checkHttpSession();
		fileSystemService.browseFolder(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/fileSearch", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody FileSearchResponse fileSearch(@RequestBody FileSearchRequest req) throws Exception {
		logRequest("fileSearch", req);
		FileSearchResponse res = new FileSearchResponse();
		checkHttpSession();

		/* todo-1: need to split these out into two separate methods on this controller */
		if (req.isReindex()) {
			luceneService.reindex(null, req, res);
		}
		else if (!StringUtils.isEmpty(req.getSearchText())) {
			luceneService.search(null, req, res);
		}
		/*
		 * SolrSearch Service works perfectly, but I'm just disabling it for now, in to use
		 * FileSystem search instead which directly creates a Lucene index on the local machine
		 * (server machine)
		 * 
		 * solrSearchService.search(null, req, res);
		 * 
		 */
		return res;
	}

	@RequestMapping(value = API_PATH + "/getSharedNodes", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody GetSharedNodesResponse getSharedNodes(@RequestBody GetSharedNodesRequest req) throws Exception {
		logRequest("getSharedNodes", req);
		GetSharedNodesResponse res = new GetSharedNodesResponse();
		checkHttpSession();
		nodeSearchService.getSharedNodes(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/saveUserPreferences", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody SaveUserPreferencesResponse saveUserPreferences(@RequestBody SaveUserPreferencesRequest req) throws Exception {
		logRequest("saveUserPreferences", req);
		SaveUserPreferencesResponse res = new SaveUserPreferencesResponse();
		checkHttpSession();
		userManagerService.saveUserPreferences(req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/getServerInfo", method = RequestMethod.POST)
	// IMPORTANT: No OakSession annotation here, purposefully
	// @OakSession
	//
	public @ResponseBody GetServerInfoResponse getServerInfo(@RequestBody GetServerInfoRequest req) throws Exception {
		logRequest("getServerInfo", req);
		GetServerInfoResponse res = new GetServerInfoResponse();
		if (!sessionContext.isAdmin()) {
			throw new Exception("admin only function.");
		}
		res.setServerInfo(systemService.getSystemInfo());
		res.setSuccess(true);
		checkHttpSession();
		return res;
	}

	@RequestMapping(value = API_PATH + "/generateRSS", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody GenerateRSSResponse generateRSS(@RequestBody GenerateRSSRequest req) throws Exception {
		logRequest("generateRSS", req);
		GenerateRSSResponse res = new GenerateRSSResponse();
		if (!sessionContext.isAdmin()) {
			throw new Exception("admin only function.");
		}
		rssService.readFeedsNow();
		res.setSuccess(true);
		checkHttpSession();
		return res;
	}

	/* Currently only used to update TIME offset of the video player */
	@RequestMapping(value = API_PATH + "/setPlayerInfo", method = RequestMethod.POST)
	/*
	 * We don't want @OakSession here, because this is called at regular interval and also because
	 * it should respond fast (being a background operation of the browser)
	 */
	// @OakSession
	public @ResponseBody SetPlayerInfoResponse playerUpdate(@RequestBody SetPlayerInfoRequest req) throws Exception {
		logRequest("setPlayerInfo", req);
		SetPlayerInfoResponse res = new SetPlayerInfoResponse();
		rssService.setPlayerInfo(req);
		res.setSuccess(true);
		// checkHttpSession();
		return res;
	}

	@RequestMapping(value = API_PATH + "/getPlayerInfo", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody GetPlayerInfoResponse getPlayerInfo(@RequestBody GetPlayerInfoRequest req) throws Exception {
		logRequest("getPlayerInfo", req);
		GetPlayerInfoResponse res = new GetPlayerInfoResponse();
		rssService.getPlayerInfo(req, res);
		res.setSuccess(true);
		checkHttpSession();
		return res;
	}

	@RequestMapping(value = API_PATH + "/splitNode", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody SplitNodeResponse splitNode(@RequestBody SplitNodeRequest req) throws Exception {
		logRequest("splitNode", req);
		SplitNodeResponse res = new SplitNodeResponse();
		checkHttpSession();
		if (!sessionContext.isAdmin()) {
			throw new Exception("generateRSS is an admin only function.");
		}
		nodeEditService.splitNode(null, req, res);
		return res;
	}

	@RequestMapping(value = API_PATH + "/openSystemFile", method = RequestMethod.POST)
	@OakSession
	public @ResponseBody OpenSystemFileResponse saveUserPreferences(@RequestBody OpenSystemFileRequest req) throws Exception {
		logRequest("openSystemFile", req);
		OpenSystemFileResponse res = new OpenSystemFileResponse();
		checkHttpSession();
		DesktopApi.open(new File(req.getFileName()));
		return res;
	}

	private static void logRequest(String url, Object req) throws Exception {
		if (logRequests) {
			log.debug("REQ=" + url + " " + (req == null ? "none" : Convert.JsonStringify(req)));
		}
	}

	private void checkHttpSession() throws NotLoggedInException {
		if (!VarUtil.safeBooleanVal(ThreadLocals.getInitialSessionExisted())) {
			throw new NotLoggedInException();
		}
	}
}
