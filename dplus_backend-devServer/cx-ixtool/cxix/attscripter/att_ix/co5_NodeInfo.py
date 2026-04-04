from .att_xml_base import att_xml_base


class co5_NodeInfo(att_xml_base):
    def create_rpc_msg(self):
        if self.no_eq_change_with_dcgk_flag: return
        self.relative_path['ap'] = ['AP_SCRIPT', self.node, self.node, F'NodeInfo.xml']
        node = self.enbdata if self.enbdata.get('postsite') == self.node else self.gnbdata
        tmp_dict = {
            'attributes': {'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance', 'xsi:noNamespaceSchemaLocation': 'NodeInfo.xsd'},
            'name': self.node,
            'nodeIdentifier': node['nodeident'],
            'ipAddress': node['oam_ip'],
            'nodeType': node['nodetype'],
            'userLabel': node['userLabel'],
            'ossPrefix': F'{node["dnPrefix"]},MeContext={self.node}',
            'timeZone': node['timeZone'],
            'autoIntegration':  {'upgradePackageName': node["sw"]},
            'license': {
                'licenseFile': F'ATTL-{self.node}-BB{node.get("bbtype")}.zip',
                'installLicense': 'true' if node["fingerprint"] == self.node else 'false'
            },
            # 'security': {'targetGroups': {'targetGroup': {}}, 'ipSecurity': {'ipSecLevel': {}, 'subjectAltNameType': {}, 'subjectAltName': {}},},
            'location': {'latitude': node['latitude'], 'longitude': node['longitude']},
            'users': {'secureUser': {'name': node['username'], 'password': node['password']}},
            # 'supervision': {'fm': 'enabled', 'pm': 'enabled'},
            'artifacts': {
                'siteBasic': F'SiteBasic_{self.node}.xml',
                'siteEquipment': F'SiteEquipment_{self.node}.xml',
                'siteInstallation': F'SiteInstallation_{self.node}.xml',
                # 'configurations': {
                #     'nodeConfiguration': [
                #         F'RN_01_TMO_Transport_{self.enbdata["bbtype"]}_{self.node}.xml',
                #         F'RN_02_TMO_ENodeBFunction_{self.enbdata["bbtype"]}_{self.node}.xml',
                #         F'RN_03_TMO_TermPointToMme_{self.enbdata["bbtype"]}_{self.node}.xml',
                #     ],
                #     'optionalFeature': [],
                #     'baseline': [],
                #     'remoteNodeConfiguration': [],
                #     'unlockCell': [],
                # }
            }
        }
        if self.validate_empty_none_value(tmp_dict['location']['latitude']) or self.validate_empty_none_value(tmp_dict['location']['longitude']):
            del tmp_dict['location']

        self.xml_doc.appendChild(self.netconf_mo_form_dict(tmp_dict, 'nodeInfo'))
        for _ in self.xml_doc.getElementsByTagName('ossPrefix'): _.firstChild.nodeValue = F'{node["dnPrefix"]},MeContext={self.node}'
        self.s_dict['ap'] += [self.xml_doc.toprettyxml(encoding='UTF-8', indent='  ').decode('utf-8').strip()] + ['']
