#Old file that was originally used for merging into one large file. No longer being used.

#!/bin/bash
source ./setenv.sh

cd $META64/build

cat ../src/main/resources/public/ts/json-models.ts > all.ts
cat ../src/main/resources/public/ts/app.ts >> all.ts

cat ../src/main/resources/public/ts/cnst.ts >> all.ts
cat ../src/main/resources/public/ts/models.ts >> all.ts
cat ../src/main/resources/public/ts/util.ts >> all.ts

cat ../src/main/resources/public/ts/jcrCnst.ts >> all.ts
cat ../src/main/resources/public/ts/attachment.ts >> all.ts
cat ../src/main/resources/public/ts/edit.ts >> all.ts

cat ../src/main/resources/public/ts/meta64.ts >> all.ts
cat ../src/main/resources/public/ts/nav.ts >> all.ts
cat ../src/main/resources/public/ts/prefs.ts >> all.ts

cat ../src/main/resources/public/ts/props.ts >> all.ts
cat ../src/main/resources/public/ts/render.ts >> all.ts
cat ../src/main/resources/public/ts/search.ts >> all.ts

cat ../src/main/resources/public/ts/share.ts >> all.ts
cat ../src/main/resources/public/ts/user.ts >> all.ts
cat ../src/main/resources/public/ts/view.ts >> all.ts

cat ../src/main/resources/public/ts/menu.ts >> all.ts
cat ../src/main/resources/public/ts/podcast.ts >> all.ts
cat ../src/main/resources/public/ts/systemfolder.ts >> all.ts


cat ../src/main/resources/public/ts/dlg/base/DialogBase.ts >> all.ts
cat ../src/main/resources/public/ts/dlg/ConfirmDlg.ts >> all.ts
cat ../src/main/resources/public/ts/dlg/EditSystemFileDlg.ts >> all.ts
cat ../src/main/resources/public/ts/dlg/MessageDlg.ts >> all.ts
cat ../src/main/resources/public/ts/dlg/LoginDlg.ts >> all.ts
cat ../src/main/resources/public/ts/dlg/SignupDlg.ts >> all.ts
cat ../src/main/resources/public/ts/dlg/PrefsDlg.ts >> all.ts

cat ../src/main/resources/public/ts/dlg/ManageAccountDlg.ts >> all.ts
cat ../src/main/resources/public/ts/dlg/ExportDlg.ts >> all.ts
cat ../src/main/resources/public/ts/dlg/ImportDlg.ts >> all.ts

cat ../src/main/resources/public/ts/dlg/SearchContentDlg.ts >> all.ts
cat ../src/main/resources/public/ts/dlg/SearchTagsDlg.ts >> all.ts
cat ../src/main/resources/public/ts/dlg/SearchFilesDlg.ts >> all.ts

cat ../src/main/resources/public/ts/dlg/ChangePasswordDlg.ts >> all.ts
cat ../src/main/resources/public/ts/dlg/ResetPasswordDlg.ts >> all.ts

cat ../src/main/resources/public/ts/dlg/UploadFromFileDlg.ts >> all.ts
cat ../src/main/resources/public/ts/dlg/UploadFromFileDropzoneDlg.ts >> all.ts
cat ../src/main/resources/public/ts/dlg/UploadFromUrlDlg.ts >> all.ts

cat ../src/main/resources/public/ts/dlg/EditNodeDlg.ts >> all.ts
cat ../src/main/resources/public/ts/dlg/EditPropertyDlg.ts >> all.ts

cat ../src/main/resources/public/ts/dlg/ShareToPersonDlg.ts >> all.ts

cat ../src/main/resources/public/ts/dlg/SharingDlg.ts >> all.ts

cat ../src/main/resources/public/ts/dlg/RenameNodeDlg.ts >> all.ts

cat ../src/main/resources/public/ts/dlg/AudioPlayerDlg.ts >> all.ts
cat ../src/main/resources/public/ts/dlg/CreateNodeDlg.ts >> all.ts

cat ../src/main/resources/public/ts/panel/searchResultsPanel.ts >> all.ts
cat ../src/main/resources/public/ts/panel/timelineResultsPanel.ts >> all.ts

read -p "All done."


