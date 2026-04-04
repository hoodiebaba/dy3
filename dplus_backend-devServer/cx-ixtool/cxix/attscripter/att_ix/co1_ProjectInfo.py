from .att_xml_base import att_xml_base


class co1_ProjectInfo(att_xml_base):
    def create_rpc_msg(self):
        if self.no_eq_change_with_dcgk_flag: return
        self.relative_path['ap'] = ['AP_SCRIPT', self.node, F'ProjectInfo.xml']
        node = self.enbdata if self.enbdata.get('postsite') == self.node else self.gnbdata
        tmp_dict = {
            'attributes': {'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance', 'xsi:noNamespaceSchemaLocation': 'ProjectInfo.xsd'},
            'name': self.node,
            'description': 'Standard Project',
            'creator': self.usid.client.creator
        }
        self.xml_doc.appendChild(self.netconf_mo_form_dict(tmp_dict, 'projectInfo'))
        self.s_dict['ap'] += [self.xml_doc.toprettyxml(encoding='UTF-8', indent='  ').decode('utf-8').strip()] + ['']
