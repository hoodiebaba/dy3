from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class nr_03_TermPointToAmf(tmo_xml_base):
    def initialize_var(self):
        if self.gnbdata.get('nodefunc', '') is None or self.gnbdata.get('equ_change', False):
            self.script_elements.extend([self.rcp_msg_capabilities(), self.create_rpc_msg(), self.rcp_msg_close()])

    def create_rpc_msg(self):
        doc, config1 = self.main_rcp_msg_start('amf')
        temp_dict = {'managedElementId': self.node, 'GNBCUCPFunction': {'gNBCUCPFunctionId': '1', 'TermPointToAmf': []}}
        if self.site is None:
            for term_point_amf in self.client.amfpool.termpointtoamf_set.all():
                tmp_dict_1 = {'termPointToAmfId': term_point_amf.termPointToAmfId, 'administrativeState': '1 (UNLOCKED)',
                              'ipv4Address1': term_point_amf.ipv4Address1, 'ipv4Address2': term_point_amf.ipv4Address2,
                              'ipv6Address1': term_point_amf.ipv6Address1, 'ipv6Address2': term_point_amf.ipv6Address2,
                              'defaultAmf': term_point_amf.defaultAmf}
                temp_dict['GNBCUCPFunction']['TermPointToAmf'].append(tmp_dict_1)
        else:
            mos = self.site.find_mo_ending_with_parent_str('TermPointToAmf', '')
            for mo in mos:
                mo_data = self.mo_para_db_dict(mo, self.site)
                temp_dict['GNBCUCPFunction']['TermPointToAmf'].append(mo_data)
        config1.appendChild(self.mo_add_form_dict_xml(temp_dict, 'ManagedElement'))
        return doc
