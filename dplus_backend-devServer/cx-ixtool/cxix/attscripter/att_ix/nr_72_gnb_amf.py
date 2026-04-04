import copy
from .att_xml_base import att_xml_base


class nr_72_gnb_amf(att_xml_base):
    def create_rpc_msg(self):
        if self.no_eq_change_with_dcgk_flag and self.gnbdata.get('GNBCUCP'): return
        self.motype = 'GNBCUCP'
        mo_list = []
        mos = self.site.find_mo_ending_with_parent_str(moc='TermPointToAmf') if self.site else []
        if len(mos) > 0:
            for mo in mos:
                mo_dict = self.get_mo_dict_from_moc_node_fdn_moid('TermPointToAmf', self.node, mo, mo.split('=')[-1])
                mo_list.append(mo_dict.copy())
        else:
            for term_point_amf in self.usid.client.amfpool.termpointtoamf_set.all():
                mo_dict = {'attributes': {'xc:operation': 'create'},
                           'termPointToAmfId': term_point_amf.termPointToAmfId, 'administrativeState': '1 (UNLOCKED)',
                           'ipv4Address1': term_point_amf.ipv4Address1, 'ipv4Address2': term_point_amf.ipv4Address2,
                           'ipv6Address1': term_point_amf.ipv6Address1, 'ipv6Address2': term_point_amf.ipv6Address2,
                           'defaultAmf': term_point_amf.defaultAmf}
                mo_list.append(mo_dict.copy())
        if len(mo_list) > 0:
            self.mo_dict['TermPointToAmf'] = {'managedElementId': self.node, 'GNBCUCPFunction': {'gNBCUCPFunctionId': '1', 'TermPointToAmf': mo_list}}
