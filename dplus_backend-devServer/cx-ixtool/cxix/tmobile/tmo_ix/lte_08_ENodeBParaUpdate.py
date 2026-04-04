from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class lte_08_ENodeBParaUpdate(tmo_xml_base):
    def initialize_var(self):
        if self.enbdata.get('nodefunc', '') is None or self.enbdata.get('equ_change', False):
            self.script_elements.extend([self.rcp_msg_capabilities(), self.create_rpc_msg(), self.rcp_msg_close()])

    def create_rpc_msg(self):
        self.motype = 'Lrat'
        doc, config = self.main_rcp_msg_start('enodeb_para')
        me_mo = self.mo_add_form_dict_xml({'managedElementId': self.node}, 'ManagedElement')
        config.appendChild(me_mo)
        enb_mo = self.mo_add_form_dict_xml({'eNodeBFunctionId': 1}, 'ENodeBFunction')
        me_mo.appendChild(enb_mo)
        rel_tag = 'eNBMO'
        parent = 'ENodeBFunction'
        parent_str = '' if self.enbdata.get("nodefunc") is None else self.enbdata.get("nodefunc")
        childs = self.MoRelation.objects.filter(parent=parent, tag=rel_tag, software=self.client.software)
        for child in childs:
            mos = self.log_append_child_tags(child.child, rel_tag=rel_tag, parent_str=parent_str, prev_site=self.enbdata.get("postsite"))
            for mo in mos: enb_mo.appendChild(mo)
        return doc
