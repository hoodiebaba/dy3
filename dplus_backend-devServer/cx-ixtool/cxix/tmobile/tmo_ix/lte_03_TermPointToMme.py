from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class lte_03_TermPointToMme(tmo_xml_base):
    def initialize_var(self):
        # pass
        if self.enbdata.get('nodefunc', '') is None or self.enbdata.get('equ_change', False):
            self.script_elements.extend([self.rcp_msg_capabilities(), self.create_rpc_msg(), self.rcp_msg_close()])

    def create_rpc_msg(self):
        self.motype = 'Lrat'
        if self.usid.df_enb_cell.loc[(self.usid.df_enb_cell.postsite == self.node) &
                                     self.usid.df_enb_cell.celltype.isin(['IOT'])].shape[0] > 0: iot_mme = True
        else: iot_mme = False

        doc, config = self.main_rcp_msg_start('mme')
        temp_dict = {'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1', 'TermPointToMme': []}}
        if self.site is None:
            for term_point_mme in self.client.mmepool.termpointtomme_set.all():
                if (not iot_mme) and (term_point_mme.mmeSupportNbIoT == 'true') and (term_point_mme.mmeSupportLegacyLte == 'false'): continue
                tmp_dict_1 = {'termPointToMmeId': term_point_mme.termPointToMmeId, 'administrativeState': '1 (UNLOCKED)',
                              'ipAddress1': term_point_mme.ipAddress1, 'ipAddress2': term_point_mme.ipAddress2,
                              'ipv6Address1': term_point_mme.ipv6Address1, 'ipv6Address2': term_point_mme.ipv6Address2,
                              'mmeSupportNbIoT': term_point_mme.mmeSupportNbIoT, 'mmeSupportLegacyLte': term_point_mme.mmeSupportLegacyLte}
                temp_dict['ENodeBFunction']['TermPointToMme'].append(tmp_dict_1)
        else:
            mos = self.site.find_mo_ending_with_parent_str('TermPointToMme', '')
            for mo in mos: temp_dict['ENodeBFunction']['TermPointToMme'].append(self.mo_para_db_dict(mo, self.site))
        config.appendChild(self.mo_add_form_dict_xml(temp_dict, 'ManagedElement'))
        return doc
