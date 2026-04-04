from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class lte_02_ENodeBFunction(tmo_xml_base):
    def initialize_var(self):
        if self.enbdata.get('nodefunc', '') is None or self.enbdata.get('equ_change', False):
            self.script_elements.extend([self.rcp_msg_capabilities(), self.create_rpc_msg(), self.rcp_msg_close()])

    def create_rpc_msg(self):
        self.motype = 'Lrat'
        doc, config = self.main_rcp_msg_start('enodeb')
        me_mo = self.mo_add_form_dict_xml({'managedElementId': self.node}, 'ManagedElement')
        config.appendChild(me_mo)
        tmp_dict, _ = self.get_mo_dict_for_id_tag('ENodeBFunction', '1', self.node if self.site else None)
        tmp_dict.update({
            'eNodeBFunctionId': 1,
            'eNBId': self.enbdata['nodeid'],
            'eNodeBPlmnId': self.enbdata['plmnlist'],
            'sctpRef': 'Transport=1,SctpEndpoint=LTE',
            'upIpAddressRef': F'Transport=1,Router={self.enbdata.get("lte")},InterfaceIPv4={self.enbdata.get("lte_interface")},AddressIPv4=1'
        })
        me_mo.appendChild(self.mo_add_form_dict_xml(tmp_dict, 'ENodeBFunction'))
        return doc
