import copy
from .att_xml_base import att_xml_base


class lte_46_enb_qcitable(att_xml_base):
    def create_rpc_msg(self):
        if self.no_eq_change_with_dcgk_flag and self.enbdata.get('Lrat'): return
        self.systemCreated_list = ['QciTable', 'LogicalChannelGroup', 'QciProfilePredefined', 'SciProfile', 'QciProfileOperatorDefined']
        self.motype = 'Lrat'
        enb_dict = {'eNodeBFunctionId': '1'}
        # parent_mo = '' if self.enbdata.get("Lrat") is None else self.enbdata.get("Lrat")
        childs = self.MoRelation.objects.filter(parent='ENodeBFunction', tag='eNBMO__45_enb_qcitable', software=self.usid.client.software)
        for child in childs:
            mos = self.log_append_child_tags(child.child, rel_tag='eNBMO__45_enb_qcitable', parent_mo=self.enbdata.get("Lrat"), node=self.node)
            for key in mos: enb_dict[key] = mos[key]
        self.mo_dict['lte_nodeb_para_update'] = {'managedElementId': self.node, 'ENodeBFunction': enb_dict}
