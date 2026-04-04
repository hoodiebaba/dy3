from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class nr_05a_gNB_MOs(tmo_xml_base):
    def initialize_var(self):
        if self.gnbdata.get('nodefunc', '') is None or self.gnbdata.get('equ_change', False):
            self.script_elements.extend([self.rcp_msg_capabilities(), self.create_rpc_msg(), self.rcp_msg_close()])

    def create_rpc_msg(self):
        doc, config = self.main_rcp_msg_start('gnb_mos')
        me_mo = self.mo_add_form_dict_xml({'managedElementId': self.node}, 'ManagedElement')
        config.appendChild(me_mo)
        cucp_mo = self.mo_add_form_dict_xml({'gNBCUCPFunctionId': '1'}, 'GNBCUCPFunction')
        me_mo.appendChild(cucp_mo)
        self.motype = 'GNBCUCP'
        rel_tag = 'GNBCUCP'
        parent = 'GNBCUCPFunction'
        parent_str = '' if self.gnbdata.get("nodefunc") is None else F'{",".join(self.gnbdata.get("nodefunc").split(",")[:-1])},GNBCUCPFunction=1'
        childs = self.MoRelation.objects.filter(parent=parent, tag=rel_tag, software=self.client.software)
        for child in childs:
            mos = self.log_append_child_tags(child.child, rel_tag=rel_tag, parent_str=parent_str, prev_site=self.gnbdata.get("postsite"))
            for mo in mos: cucp_mo.appendChild(mo)

        cuup_mo = self.mo_add_form_dict_xml({'gNBCUUPFunctionId': '1'}, 'GNBCUUPFunction')
        me_mo.appendChild(cuup_mo)
        self.motype = 'GNBCUUP'
        rel_tag = 'GNBCUUP'
        parent = 'GNBCUUPFunction'
        parent_str = '' if self.gnbdata.get("nodefunc") is None else F'{",".join(self.gnbdata.get("nodefunc").split(",")[:-1])},GNBCUUPFunction=1'
        childs = self.MoRelation.objects.filter(parent=parent, tag=rel_tag, software=self.client.software)
        for child in childs:
            mos = self.log_append_child_tags(child.child, rel_tag=rel_tag, parent_str=parent_str, prev_site=self.gnbdata.get("postsite"))
            for mo in mos: cuup_mo.appendChild(mo)
        if self.client.software.swname[:9] < 'TMO_23_Q1':
            temp_dict = {'gNBDUFunctionId': '1', 'DU5qiTable': {'dU5qiTableId': '1', 'LogicalChannelGroup': {'logicalChannelGroupId': '1'}}}
            me_mo.appendChild(self.mo_add_form_dict_xml(temp_dict, 'GNBDUFunction'))

        du_mo = self.mo_add_form_dict_xml({'gNBDUFunctionId': '1'}, 'GNBDUFunction')
        me_mo.appendChild(du_mo)
        self.motype = 'GNBDU'
        rel_tag = 'GNBDU'
        parent = 'GNBDUFunction'
        parent_str = '' if self.gnbdata.get("nodefunc") is None else F'{",".join(self.gnbdata.get("nodefunc").split(",")[:-1])},GNBDUFunction=1'
        childs = self.MoRelation.objects.filter(parent=parent, tag=rel_tag, software=self.client.software)
        for child in childs:
            mos = self.log_append_child_tags(child.child, rel_tag=rel_tag, parent_str=parent_str, prev_site=self.gnbdata.get("postsite"))
            for mo in mos: du_mo.appendChild(mo)

        return doc
