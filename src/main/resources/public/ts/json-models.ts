// Generated using typescript-generator version 1.10-SNAPSHOT on 2016-07-31 20:21:01.

namespace m64 {
    export namespace json {

        export interface AccessControlEntryInfo {
            principalName: string;
            privileges: PrivilegeInfo[];
        }

        export interface NodeInfo {
            id: string;
            path: string;
            name: string;
            primaryTypeName: string;
            properties: PropertyInfo[];
            hasChildren: boolean;
            hasBinary: boolean;
            binaryIsImage: boolean;
            binVer: number;
            width: number;
            height: number;
            childrenOrdered: boolean;
            uid: string;
            createdBy: string;
            lastModified: Date;
            imgId: string;
            owner: string;
        }

        export interface PrivilegeInfo {
            privilegeName: string;
        }

        export interface PropertyInfo {
            type: number;
            name: string;
            value: string;
            values: string[];
            abbreviated: boolean;
        }

        export interface RefInfo {
            id: string;
            path: string;
        }

        export interface UserPreferences {
            editMode: boolean;
            advancedMode: boolean;
            lastNode: string;
            importAllowed: boolean;
            exportAllowed: boolean;
            showMetaData: boolean;
        }

        export interface AddPrivilegeRequest {
            nodeId: string;
            privileges: string[];
            principal: string;
            publicAppend: boolean;
        }

        export interface AnonPageLoadRequest {
            ignoreUrl: boolean;
        }

        export interface ChangePasswordRequest {
            newPassword: string;
            passCode: string;
        }

        export interface CloseAccountRequest {
        }

        export interface GenerateRSSRequest {
        }

        export interface SetPlayerInfoRequest {
            url: string;
            timeOffset: number;
            nodePath: string;
        }

        export interface GetPlayerInfoRequest {
            url: string;
        }

        export interface CreateSubNodeRequest {
            nodeId: string;
            newNodeName: string;
            typeName: string;
            createAtTop: boolean;
        }

        export interface DeleteAttachmentRequest {
            nodeId: string;
        }

        export interface DeleteNodesRequest {
            nodeIds: string[];
        }

        export interface DeletePropertyRequest {
            nodeId: string;
            propName: string;
        }

        export interface ExpandAbbreviatedNodeRequest {
            nodeId: string;
        }

        export interface ExportRequest {
            nodeId: string;
            targetFileName: string;
        }

        export interface GetNodePrivilegesRequest {
            nodeId: string;
            includeAcl: boolean;
            includeOwners: boolean;
        }

        export interface GetServerInfoRequest {
        }

        export interface GetSharedNodesRequest {
            nodeId: string;
        }

        export interface ImportRequest {
            nodeId: string;
            sourceFileName: string;
        }

        export interface InitNodeEditRequest {
            nodeId: string;
        }

        export interface InsertBookRequest {
            nodeId: string;
            bookName: string;
            truncated: boolean;
        }

        export interface InsertNodeRequest {
            parentId: string;
            targetName: string;
            newNodeName: string;
            typeName: string;
        }

        export interface LoginRequest {
            userName: string;
            password: string;
            tzOffset: number;
            dst: boolean;
        }

        export interface LogoutRequest {
        }

        export interface MoveNodesRequest {
            targetNodeId: string;
            targetChildId: string;
            nodeIds: string[];
        }

        export interface NodeSearchRequest {
            sortDir: string;
            sortField: string;
            nodeId: string;
            searchText: string;
            searchProp: string;
        }

        export interface FileSearchRequest {
            nodeId: string;
            searchText: string;
            reindex: boolean
        }

        export interface RemovePrivilegeRequest {
            nodeId: string;
            principal: string;
            privilege: string;
        }

        export interface RenameNodeRequest {
            nodeId: string;
            newName: string;
        }

        export interface RenderNodeRequest {
            nodeId: string;
            upLevel: number;
            offset: number;
            renderParentIfLeaf: boolean;
            goToLastPage: boolean;
        }

        export interface ResetPasswordRequest {
            user: string;
            email: string;
        }

        export interface SaveNodeRequest {
            nodeId: string;
            properties: PropertyInfo[];
            sendNotification: boolean;
        }

        export interface SavePropertyRequest {
            nodeId: string;
            propertyName: string;
            propertyValue: string;
        }

        export interface SaveUserPreferencesRequest {
            userPreferences: UserPreferences;
        }

        export interface OpenSystemFileRequest {
            fileName: string;
        }

        export interface SetNodePositionRequest {
            parentNodeId: string;
            nodeId: string;
            siblingId: string;
        }

        export interface SignupRequest {
            userName: string;
            password: string;
            email: string;
            captcha: string;
        }

        export interface SplitNodeRequest {
            nodeId: string;
            nodeBelowId: string;
            delimiter: string;
        }

        export interface UploadFromUrlRequest {
            nodeId: string;
            sourceUrl: string;
        }

        export interface AddPrivilegeResponse extends OakResponseBase {
        }

        export interface AnonPageLoadResponse extends OakResponseBase {
            content: string;
            renderNodeResponse: RenderNodeResponse;
        }

        export interface ChangePasswordResponse extends OakResponseBase {
            user: string;
        }

        export interface CloseAccountResponse extends OakResponseBase {
        }

        export interface GenerateRSSResponse extends OakResponseBase {
        }

        export interface SetPlayerInfoResponse extends OakResponseBase {
        }

        export interface GetPlayerInfoResponse extends OakResponseBase {
            timeOffset: number;
        }

        export interface CreateSubNodeResponse extends OakResponseBase {
            newNode: NodeInfo;
        }

        export interface DeleteAttachmentResponse extends OakResponseBase {
        }

        export interface DeleteNodesResponse extends OakResponseBase {
        }

        export interface DeletePropertyResponse extends OakResponseBase {
        }

        export interface ExpandAbbreviatedNodeResponse extends OakResponseBase {
            nodeInfo: NodeInfo;
        }

        export interface ExportResponse extends OakResponseBase {
        }

        export interface GetNodePrivilegesResponse extends OakResponseBase {
            aclEntries: AccessControlEntryInfo[];
            owners: string[];
            publicAppend: boolean;
        }

        export interface GetServerInfoResponse extends OakResponseBase {
            serverInfo: string;
        }

        export interface GetSharedNodesResponse extends OakResponseBase {
            searchResults: NodeInfo[];
        }

        export interface ImportResponse extends OakResponseBase {
        }

        export interface InitNodeEditResponse extends OakResponseBase {
            nodeInfo: NodeInfo;
        }

        export interface InsertBookResponse extends OakResponseBase {
            newNode: NodeInfo;
        }

        export interface InsertNodeResponse extends OakResponseBase {
            newNode: NodeInfo;
        }

        export interface LoginResponse extends OakResponseBase {
            rootNode: RefInfo;
            userName: string;
            anonUserLandingPageNode: string;
            homeNodeOverride: string;
            userPreferences: UserPreferences;
            allowFileSystemSearch: boolean;
        }

        export interface LogoutResponse extends OakResponseBase {
        }

        export interface MoveNodesResponse extends OakResponseBase {
        }

        export interface NodeSearchResponse extends OakResponseBase {
            searchResults: NodeInfo[];
        }

        export interface FileSearchResponse extends OakResponseBase {
            searchResultNodeId: string;
        }

        export interface RemovePrivilegeResponse extends OakResponseBase {
        }

        export interface RenameNodeResponse extends OakResponseBase {
            newId: string;
        }

        export interface RenderNodeResponse extends OakResponseBase {
            node: NodeInfo;
            children: NodeInfo[];
            offsetOfNodeFound: number;

            /* holds true if we hit the end of the list of child nodes */
            endReached: boolean;

            displayedParent: boolean;
        }

        export interface ResetPasswordResponse extends OakResponseBase {
        }

        export interface SaveNodeResponse extends OakResponseBase {
            node: NodeInfo;
        }

        export interface SavePropertyResponse extends OakResponseBase {
            propertySaved: PropertyInfo;
        }

        export interface SaveUserPreferencesResponse extends OakResponseBase {
        }

        export interface OpenSystemFileResponse extends OakResponseBase {
        }

        export interface SetNodePositionResponse extends OakResponseBase {
        }

        export interface SignupResponse extends OakResponseBase {
        }

        export interface SplitNodeResponse extends OakResponseBase {
        }

        export interface UploadFromUrlResponse extends OakResponseBase {
        }

        export interface OakResponseBase {
            success: boolean;
            message: string;
        }

    }

}
