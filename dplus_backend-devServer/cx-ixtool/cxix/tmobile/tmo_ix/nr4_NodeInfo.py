from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class nr4_NodeInfo(tmo_xml_base):
    def initialize_var(self):
        if self.gnbdata.get('equ_change') and not self.gnbdata.get('mmbb'):
            self.relative_path = [self.node, 'NodeInfo.xml']
            self.create_xml_doc()

    def create_xml_doc(self):
        tmp_dict = {
            'name': self.node,
            'nodeIdentifier': self.gnbdata['nodeidentifier'],
            'ipAddress': self.gnbdata['oam_ip'],
            'nodeType': self.gnbdata['nodetype'],
            'ossPrefix': F'{self.gnbdata["dnPrefix"]},MeContext={self.node}',
            'timeZone': self.gnbdata['timeZone'],
            'autoIntegration':  {'upgradePackageName': self.gnbdata['sw']},
            'users': {'secureUser': {'name': 'prbs', 'password': 'prbs1234'}},
            'license': {
                # 'licenseFile': F'ATTL-{self.node}-BB{self.gnbdata["bbtype"]}.zip',
                'installLicense': 'true' if self.gnbdata.get("fingerprint") == self.node else 'false'
            },
            'artifacts': {
                'siteBasic': self.gnbdata["SB_File"],
                'siteEquipment': self.gnbdata["SE_File"],
                'siteInstallation': self.gnbdata["SI_File"],
                # 'configurations': {
                #     'nodeConfiguration': [
                #         F'RN_01_TMO_Transport_{self.gnbdata["bbtype"]}_{self.node}.xml',
                #         F'RN_02_TMO_ENodeBFunction_{self.gnbdata["bbtype"]}_{self.node}.xml',
                #         F'RN_03_TMO_TermPointToMme_{self.gnbdata["bbtype"]}_{self.node}.xml',
                #     ]
                # }
            }
        }
        node_info = self.mo_add_form_dict_xml(tmp_dict, 'nodeInfo')
        self.doc.appendChild(node_info)
    
    def writexml(self):
        if self.doc.firstChild is not None:
            self.doc.firstChild.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
            self.doc.firstChild.setAttribute('xsi:noNamespaceSchemaLocation', F'{self.__class__.__name__.split("_")[-1]}.xsd')
            self.doc.writexml(open(self.script_file, 'w'), addindent='  ', newl='\n', encoding='UTF-8')
