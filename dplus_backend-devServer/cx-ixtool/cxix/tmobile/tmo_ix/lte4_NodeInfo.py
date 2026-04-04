from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class lte4_NodeInfo(tmo_xml_base):
    def initialize_var(self):
        self.relative_path = [self.node, 'NodeInfo.xml']
        if self.enbdata.get('equ_change'): self.create_xml_doc()
        else: self.relative_path = []
        # self.create_xml_doc()
        
    def create_xml_doc(self):
        tmp_dict = {
            'name': self.node,
            'nodeIdentifier': self.enbdata['nodeidentifier'],
            'ipAddress': self.enbdata['oam_ip'], #.split('/')[0],
            'nodeType': self.enbdata['nodetype'],
            'ossPrefix': F'{self.enbdata["dnPrefix"]},MeContext={self.node}',
            'timeZone': self.enbdata['timeZone'],
            'autoIntegration':  {'upgradePackageName': self.enbdata["sw"]},
            'users': {'secureUser': {'name': 'prbs', 'password': 'prbs1234'}},
            'license': {
                # 'licenseFile': F'ATTL-{self.node}-BB{self.enbdata["bbtype"]}.zip',
                'installLicense': 'true' if self.enbdata["fingerprint"] == self.node else 'false'
            },
            'artifacts': {
                'siteBasic': self.enbdata["SB_File"],
                'siteEquipment': self.enbdata["SE_File"],
                'siteInstallation': self.enbdata["SI_File"],
                # 'configurations': {
                #     'nodeConfiguration': [
                #         F'RN_01_TMO_Transport_{self.enbdata["bbtype"]}_{self.node}.xml',
                #         F'RN_02_TMO_ENodeBFunction_{self.enbdata["bbtype"]}_{self.node}.xml',
                #         F'RN_03_TMO_TermPointToMme_{self.enbdata["bbtype"]}_{self.node}.xml',
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
