import copy
from .att_xml_base import att_xml_base


class lte_42_mme(att_xml_base):
    def create_rpc_msg(self):
        if self.no_eq_change_with_dcgk_flag and self.enbdata.get('Lrat'): return
        self.motype = 'Lrat'
        mos = self.site.find_mo_ending_with_parent_str(moc='TermPointToMme') if self.site else []
        if len(mos) > 0:
            for mo in mos:
                mo_dict = self.get_mo_dict_from_moc_node_fdn_moid('TermPointToMme', self.node, mo, mo.split('=')[-1])
                mo_dict |= {'additionalCnRef': ''}
                self.mo_dict[F'ENodeBFunction=1,TermPointToMme={mo_dict.get("termPointToMmeId")}'] = {
                    'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1', 'TermPointToMme': copy.deepcopy(mo_dict)}}
        else:
            for mo in self.usid.client.mmepool.termpointtomme_set.all():
                self.mo_dict[F'ENodeBFunction=1,TermPointToMme={mo.termPointToMmeId}'] = {
                    'managedElementId': self.node,
                    'ENodeBFunction': {
                        'eNodeBFunctionId': '1',
                        'TermPointToMme': {
                            'attributes': {'xc:operation': 'create'}, 'additionalCnRef': '', 'termPointToMmeId': mo.termPointToMmeId,
                            'administrativeState': '1 (UNLOCKED)', 'ipAddress1': mo.ipAddress1, 'ipAddress2': mo.ipAddress2,
                            'ipv6Address1': mo.ipv6Address1, 'ipv6Address2': mo.ipv6Address2, 'mmeSupportNbIoT': mo.mmeSupportNbIoT,
                            'mmeSupportLegacyLte': mo.mmeSupportLegacyLte
                        }
                    }
                }
