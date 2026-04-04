from .att_xml_base import att_xml_base


class co4_SiteInstallation(att_xml_base):
    def create_rpc_msg(self):
        if self.no_eq_change_with_dcgk_flag: return
        node = self.enbdata if self.enbdata.get('postsite') == self.node else self.gnbdata
        tmp_dict = {
            'attributes': {'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance', 'xsi:noNamespaceSchemaLocation': 'SiteInstallation.xsd'},
            'Format': {'attributes': {'revision': 'K'}},
            'InstallationData': {
                'attributes': {'logicalName': self.node, 'tnPort': node["TnPort"], 'vlanId': node['oam_van']},
                'OamIpConfigurationData': {'attributes': {'defaultRouter0': node['oam_gway'], 'ipAddress': node['oam_ip'], 'networkPrefixLength': '64'}},
                'SmrsData': {'attributes': {'summaryFilePath': '', 'address': ''}},
            },
        }
        self.xml_doc.appendChild(self.netconf_mo_form_dict(tmp_dict, 'RbsSiteInstallationFile'))
        self.s_dict['ap'] += [self.xml_doc.toprettyxml(encoding='UTF-8', indent='  ').decode('utf-8').strip()] + ['']
