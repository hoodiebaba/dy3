from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class lte_10_CellParaUpdate(tmo_xml_base):
    def initialize_var(self):
        if self.usid.df_enb_cell.loc[(self.usid.df_enb_cell.postsite == self.node) & self.usid.df_enb_cell.addcell &
                                     self.usid.df_enb_cell.celltype.isin(['FDD', 'TDD'])].shape[0] > 0:
            self.script_elements.extend([self.rcp_msg_capabilities(), self.create_rpc_msg(), self.rcp_msg_close()])

    def create_rpc_msg(self):
        self.motype = 'Lrat'
        doc, config = self.main_rcp_msg_start('cell_para')
        me_mo = self.mo_add_form_dict_xml({'managedElementId': self.node}, 'ManagedElement')
        config.appendChild(me_mo)
        enb_mo = self.mo_add_form_dict_xml({'eNodeBFunctionId': '1'}, 'ENodeBFunction')
        me_mo.appendChild(enb_mo)
        tmp_celltype = {'FDD': 'EUtranCellFDD', 'FDDId': 'eUtranCellFDDId', 'TDD': 'EUtranCellTDD', 'TDDId': 'eUtranCellTDDId', 'IOT': 'NbIotCell', 'IOTId': 'NbIotCellId'}
        for index, row in self.usid.df_enb_cell.loc[(self.usid.df_enb_cell.postsite == self.node) &
                                                    self.usid.df_enb_cell.addcell & self.usid.df_enb_cell.celltype.isin(['FDD', 'TDD'])].iterrows():
            rel_tag = F'{tmp_celltype.get(row.celltype, "")}MO'
            parent = tmp_celltype.get(row.celltype, "")
            parentid = tmp_celltype.get(F'{row.celltype}Id', "")
            ecell_mo = self.mo_add_form_dict_xml({parentid: row.postcell}, parent)
            enb_mo.appendChild(ecell_mo)
            parent_str = '' if row.fdn is None else row.fdn
            childs = self.MoRelation.objects.filter(parent=parent, tag=rel_tag, software=self.client.software)
            for child in childs:
                mos = self.log_append_child_tags(child.child, rel_tag=rel_tag, parent_str=parent_str, prev_site=row.presite)
                for mo in mos: ecell_mo.appendChild(mo)
        return doc
