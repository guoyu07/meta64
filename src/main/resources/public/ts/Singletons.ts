console.log("Singletons.ts");

import { Meta64Intf } from "./intf/Meta64Intf";
//import { SystemFolderIntf } from "./intf/SystemFolderIntf";
import { AttachmentIntf } from "./intf/AttachmentIntf";
import { EditIntf } from "./intf/EditIntf";
import { EncryptionIntf } from "./intf/EncryptionIntf";
import { Constants } from "./Constants";
import { DomBindIntf } from "./intf/DomBindIntf";
import { NavIntf } from "./intf/NavIntf";
import { PodcastIntf } from "./intf/PodcastIntf";
import { PropsIntf } from "./intf/PropsIntf";
import { RenderIntf } from "./intf/RenderIntf";
import { SearchIntf } from "./intf/SearchIntf";
import { ShareIntf } from "./intf/ShareIntf";
import { TagIntf } from "./intf/TagIntf";
import { UserIntf } from "./intf/UserIntf";
import { UtilIntf } from "./intf/UtilIntf";
import { ViewIntf } from "./intf/ViewIntf";
import { RssPluginIntf } from "./intf/RssPluginIntf";
import { CoreTypesPluginIntf } from "./intf/CoreTypesPluginIntf";

export interface Singletons {
    meta64: Meta64Intf;
    tag: TagIntf;
    util: UtilIntf;
    edit: EditIntf;
    attachment: AttachmentIntf;
    encryption: EncryptionIntf;
    nav: NavIntf;
    props: PropsIntf;
    render: RenderIntf;
    srch: SearchIntf;
    share: ShareIntf;
    user: UserIntf;
    view: ViewIntf;
    podcast: PodcastIntf;
    //systemFolder: SystemFolderIntf;
    domBind: DomBindIntf;
    rssPlugin: RssPluginIntf;
    coreTypesPlugin: CoreTypesPluginIntf;
}