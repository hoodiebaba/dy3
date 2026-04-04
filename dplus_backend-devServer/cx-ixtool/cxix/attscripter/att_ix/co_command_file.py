import copy
import os
import re
from .att_xml_base import att_xml_base


class co_command_file(att_xml_base):
    def create_rpc_msg(self):
        # Change location of the file in Script Folder
        for sc in ['ap', 'cli', 'cmedit']: del self.relative_path[sc][1]
        node_data = self.enbdata if len(self.enbdata) > 0 else self.gnbdata

        self.s_dict['cli'] = [
            F'#######:-GET_ENM {self.node} COMMAND-:#######',
            F'cmedit get NetworkElement={self.node}',
            F'cmedit get NetworkElement={self.node},CppConnectivityInformation=1',
            F'secadm credentials get --nodelist {self.node}',
            F'secadm credentials get -pt show -n {self.node}',
            F'cmedit get NetworkElement={self.node},CmNodeHeartbeatSupervision=1',
            F'cmedit get NetworkElement={self.node},FmAlarmSupervision=1',
            F'cmedit get NetworkElement={self.node},InventorySupervision=1',
            F'cmedit get NetworkElement={self.node},PmFunction=1',
            F'cmedit get NetworkElement={self.node},CmFunction=1',
            F'alarm status {self.node}',
            F'ap status -p {self.node}',
            F'',
            F'cmedit get {self.node} NetworkElement.userLabel',
            F'cmedit get {self.node} NetworkElement.timeZone',
            F'cmedit get {self.node} ,GeographicLocation=1,GeometricPoint=1',
            F'',
            
            F'#######:-SET_ENM {self.node} COMMAND-:#######',
            F'cmedit set NetworkElement={self.node},CmNodeHeartbeatSupervision=1 active=true',
            F'cmedit set NetworkElement={self.node},FmAlarmSupervision=1 active=true',
            F'cmedit set NetworkElement={self.node},InventorySupervision=1 active=true',
            F'cmedit set NetworkElement={self.node},PmFunction=1 pmEnabled=true',
            F'cmedit action NetworkElement={self.node},CmFunction=1 sync',
            F'alarm enable {self.node}',
            F'alarm enable {self.node} automaticSynchronization=true',
            F'',
            F'',
            F'cmedit set {self.node} NetworkElement timeZone="{self.usid.client.timeZone}"',
            F'cmedit set {self.node} NetworkElement userLabel="{node_data["userLabel"]}"',
            F'cmedit set {self.node} GeometricPoint latitude="{node_data["latitude"]}"',
            F'cmedit set {self.node} GeometricPoint longitude="{node_data["longitude"]}"',
            F'',
            F'',
            
            F'#######:-AP Delete {self.node}-:#######',
            F'ap view -n {self.node}',
            F'ap status -p {self.node}',
            F'ap status -n {self.node}',
            F'ap delete -i -p {self.node}',
            F'cmedit get NetworkElement={self.node}',
            F'cmedit set NetworkElement={self.node},PmFunction=1 pmEnabled=false',
            F'cmedit set NetworkElement={self.node},FmAlarmSupervision=1 active=false',
            F'cmedit set NetworkElement={self.node},InventorySupervision=1 active=false',
            F'cmedit set NetworkElement={self.node},CmNodeHeartbeatSupervision=1 active=false',
            F'cmedit action NetworkElement={self.node},CmFunction=1 deleteNrmDataFromEnm',
            F'cmedit delete NetworkElement={self.node} -ALL --force',
            F'cmedit get NetworkElement={self.node}',
            F'',
            F'#######:-AP Add {self.node}-:#######',
            F'ap order file:{self.node}.zip',
            F'ap view -n {self.node}',
            F'ap status -p {self.node}',
            F'ap status -n {self.node}',
            F'ap download -o -n {self.node}',
            F'',
            F'',
            F'',
            
            F'#######:-BBU ADD COMMAND {self.node}-:#######',
            F'cmedit create NetworkElement={self.node} networkElementId={self.node}, neType="RadioNode", ossModelIdentity="{node_data["nodeident"]}", ossPrefix="SubNetwork=ONRM_ROOT_MO,MeContext={self.node}" -ns=OSS_NE_DEF -v=2.0.0',
            F'cmedit create NetworkElement={self.node},ComConnectivityInformation=1 ComConnectivityInformationId=1, ipAddress="{node_data["oam_ip"]}", port=6513, snmpWriteCommunity="enm-public", transportProtocol="TLS", snmpSecurityLevel="NO_AUTH_NO_PRIV", snmpReadCommunity="enm-public" -ns=COM_MED -v=1.1.0',
            F'',
            F'### for LTE Node',
            F'secadm credentials create --secureusername "rbs" --secureuserpassword "StArW@r$1977#" -n {self.node}',
            F'### for 5G Node',
            F'secadm credentials create --secureusername "rbs" --secureuserpassword "StArW@r$1977#" -n {self.node}',
            F'cmedit set NetworkElement={self.node},InventorySupervision=1 active=true',
            F'cmedit set NetworkElement={self.node},PmFunction=1 pmEnabled=true',
            F'alarm enable {self.node}',
            F'cmedit set NetworkElement={self.node},CmNodeHeartbeatSupervision=1 active=true',
            F'',
            F'alarm enable {self.node} automaticSynchronization=true',
            F'cmedit set NetworkElement={self.node},FmAlarmSupervision=1 active=true',
            F'cmedit get NetworkElement={self.node},CmFunction=1',
            F'cmedit action NetworkElement={self.node},CmFunction=1 sync',
            F'alarm status {self.node}',
            F'secadm credentials get -pt show -n {self.node}',
            F'',
            F'',
            F'#######:-DUS ADD COMMAND {self.node}-:#######',
            F'cmedit create NetworkElement={self.node} networkElementId={self.node}, neType="ERBS", platformType="CPP", ossModelIdentity="16B-G.1.308", ossPrefix="SubNetwork=ONRM_ROOT_MO,MeContext={self.node}" -ns=OSS_NE_DEF -v=2.0.0',
            F'cmedit create NetworkElement={self.node},CppConnectivityInformation=1 CppConnectivityInformationId=1, ipAddress="{node_data["oam_ip"]}", port=80 -ns=CPP_MED -v=1.0.0',
            F'cmedit set NetworkElement={self.node},InventorySupervision=1 active=true',
            F'cmedit set NetworkElement={self.node},PmFunction=1 pmEnabled=true',
            F'secadm credentials create --rootusername "rbs" --rootuserpassword "StArW@r$1977#" --secureusername "rbs" --secureuserpassword "StArW@r$1977#" --normalusername "rbs" --normaluserpassword "StArW@r$1977#" -n {self.node}',
            F'cmedit action NetworkElement={self.node},SHMFunction=1,InventoryFunction=1 synchronize.(invType=ALL)',
            F'alarm enable {self.node}',
            F'alarm enable {self.node} automaticSynchronization=true',
            F'cmedit set NetworkElement={self.node},CmNodeHeartbeatSupervision=1 active=true',
            F'cmedit set NetworkElement={self.node},FmAlarmSupervision=1 active=true',
            F'cmedit action NetworkElement={self.node},CmFunction=1 sync',
            F'cmedit get NetworkElement={self.node},CmFunction=1 ',
            F'alarm status {self.node}',
            F'secadm credentials get -pt show -n {self.node}',
            F'',
            F'',
            F'############################################################################',
            F'                           CLI Commands Sample                              ',
            F'############################################################################',
            F'cmedit import -f file:filename.txt --filetype dynamic --validate noinstance --error operation',
            F'cmedit import --status --job jobid',
            F'cmedit import --status --job jobid -v',
            F'',
            F'cmedit import --retry --job yyyyyy ',
            F'cmedit import --retry --job yyyyyy --error operation',
            F'',
            F'To Create PCA',
            F'config create PCAName',

            F'To import on PCA',
            F'cmedit import -f file:filename.txt --filetype dynamic -t PCAName',
            F'cmedit import -f file:filename2.txt --filetype dynamic -t PCAName',
            F'cmedit import --status --job jobid',
            F'cmedit import --status --job jobid --verbose',
            F'config activate --source PCAName',
            F'config activate --status --job jobid',
            F'config activate --status --job jobid --verbose',
            F'',
            F'To Delete the PCA',
            F'config delete PCAName',
            F'config delete --status --job jobid',
            F'',
            F'############################################################################',
            F'                           cmedit Commands Sample                           ',
            F'############################################################################',
            F'####CV Commands',
            F'batch execute file:FileName.txt',
            F'',
            F'####CV Commands',
            F'cmedit action {self.node} BrmBackupManager=1 createBackup.(name="Pre_IX_Activity")',
            F'cmedit action {self.me},SystemFunctions=1,BrM=1,BrmBackupManager=1 createBackup.(name="Pre_IX_Activity")',
            F'cmedit action {self.me},SystemFunctions=1,BrM=1,BrmBackupManager=1 deleteBackup.(name="Pre_IX_Activity")',
            F'cmedit action {self.me},SystemFunctions=1,BrM=1,BrmBackupManager=1,BrmBackup=<Backup_ID> restore --force',
            F'',

            F'#### Lock/Sector/ Cells',
            F'',
            F'cmedit set {self.node} NbIotCell administrativeState=SHUTTINGDOWN',
            F'cmedit set {self.node} EUtrancellFDD administrativeState=SHUTTINGDOWN',
            F'cmedit set {self.node} NRCellDU administrativeState=SHUTTINGDOWN',
            F'',
            F'cmedit set {self.node} ENodeBFunction=1 checkEmergencySoftLock=true',
            F'cmedit set {self.me},ENodeBFunction=1 checkEmergencySoftLock=true',
            F'cmedit set {self.me},ENodeBFunction=1 checkEmergencySoftLock=false',
            F'',
            F'cmedit set {self.node} NodeSupport=1,SectorEquipmentFunction=Name administrativeState=LOCKED',
            F'cmedit set {self.node} NRSectorCarrier=Name administrativeState=LOCKED',
            F'cmedit set {self.node} FieldReplaceableUnit=RRUName administrativeState=LOCKED',
            F'',

            F'#### FRU Restart [1: RESTART_COLD, 2: RESTART_COLDWTEST]',
            F'cmedit action {self.me},Equipment=1,FieldReplaceableUnit=1 restartUnit.(restartrank=RESTART_COLD,'
            F'restartreason=PLANNED_RECONFIGURATION,restartInfo=TS) --force',
            F'',
            F'cmedit set {self.node} FieldReplaceableUnit=RRUName administrativeState=LOCKED',
            F'cmedit action {self.me},Equipment=1,FieldReplaceableUnit=RRU-1 '
            F'restartUnit.(RestartRank=RESTART_COLD,RestartReason=PLANNED_RECONFIGURATION,restartInfo=TS) --force',
            F'cmedit set {self.node} FieldReplaceableUnit=RRUName administrativeState=UNLOCKED',
            F'',
            F'',
            F'',
            F'#### Remove RiLink Ref from CpriLinkIqData MO to delete RiLink',
            F'cmedit set {self.me},NodeSupport=1,CpriLinkIqData=1 riLinkRef=<empty>',
            F'',
            F'#### set uri and password for SW {self.enbdata.get("sw", self.gnbdata.get("sw", "sw"))}',
            F'cmedit set {self.me},SystemFunctions=1,SwM=1,UpgradePackage='
            F'{"-".join(self.enbdata.get("sw", self.gnbdata.get("sw", "sw")).split(" ")[1:3])} '
            F'uri:"sftp://{self.usid.enm.get("uri_user")}@[{self.usid.enm.get("uri")}]'
            F'/smrsroot/software/radionode/{self.enbdata.get("sw", self.gnbdata.get("sw", "sw")).replace(" ", "_").replace("/", "_")}"; '
            F'password:{{cleartext:true,password:"{self.usid.enm.get("uri_password")}"}}',
            F'',
            F'',
        ]

        self.s_dict['cli'] += [
            F'############################################################################',
            F'                           Commands for Remote                              ',
            F'############################################################################',
            F'#### CLI Sample Commands'
            F'cmedit import -f file:filename.txt --filetype dynamic --validate noinstance --error operation',
            F'cmedit import --status --job jobid',
            F'cmedit import --status --job jobid -v',
            F'',
            F'',
        ]
        files = []
        rempte_path = os.path.join(self.usid.base_dir, 'REMOTE_SCRIPT', self.node)
        if os.path.exists(rempte_path):
            files = [i for i in os.listdir(rempte_path)]
            files.sort()
        cv_name = {
            10: 'Pre_Remote_Activity',
            20: 'Post_TN_Complete',
            30: 'Post_EQ_Complete',
            50: 'Post_enb_Complete',
            60: 'Post_enb_cell_Complete',
            80: 'Post_gnb_Complete',
            90: 'Post_gnb_cell_Complete',
            100: 'Post_BL_Complete',
        }
        cv_int = 0
        cv_command = F'cmedit action {self.me},SystemFunctions=1,BrM=1,BrmBackupManager=1 createBackup'
        all_key = [key for key in cv_name]
        for i in files:
            file_no = 10 if re.search(r'^\d+', i) is None else int(re.search(r'^\d+', i)[0])
            file_no = file_no//10*10
            if cv_int == file_no: pass
            elif cv_int == 0:
                self.s_dict['cli'] += [F'{cv_command}.(name="{cv_name[10]}")']
                cv_int = file_no
            elif cv_int < file_no:
                self.s_dict['cli'] += [F'{cv_command}.(name="{cv_name[cv_int + 10]}")']
                cv_int = file_no
            if i.endswith('_cmedit.txt'): self.s_dict['cli'] += [F'batch execute file:{i}']
            elif i.endswith('_mosscript.mos'): self.s_dict['cli'] += [F'run {i}']
            elif i.endswith('.txt'): self.s_dict['cli'] += [F'cmedit import -f file:{i} --filetype dynamic --validate noinstance --error operation']
        if len(files) > 0:
            self.s_dict['cli'] += [F'{cv_command}.(name="Post_Remote_Activity")', F'']
