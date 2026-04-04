import copy
from .att_xml_base import att_xml_base


class lte_99_post_gs_relation(att_xml_base):
    def create_rpc_msg(self):
        self.motype = 'Lrat'
        celltype_dict = {'FDD': 'EUtranCellFDD', 'TDD': 'EUtranCellTDD', 'IOT': 'NbIotCell'}
        msgs, sc_msgs, cell_msgs, rel_msgs = [], [], [], []
        enb_ldn = 'ENodeBFunction=1'

        for row in self.usid.df_enb_cell.loc[(self.usid.df_enb_cell.postsite == self.node)].itertuples():
            moc = celltype_dict.get(row.celltype)
            mo_dict = {'managedElementId': self.node, 'ENodeBFunction': {
                'eNodeBFunctionId': '1', F'{moc}': {self.get_moc_id(moc): row.postcell}}}
            self.eutran_utran_network_relation(mo_dict, cell_fdn=F'ENodeBFunction=1,{moc}={row.postcell}')
        return msgs

    def eutran_utran_network_relation(self, mo_dict, cell_fdn):
        """
        EUtranFreqRelation, UtranFreqRelation
        :rtype: None
         """
        moc = self.get_end_moc(cell_fdn)
        postcell = cell_fdn.split('=')[-1]
        rmoc = 'EUtranFreqRelation'
        for row in self.usid.df_enb_er.loc[((self.usid.df_enb_er.postsite == self.node) &
                                           (self.usid.df_enb_er.postcell == postcell) & (~self.usid.df_enb_er.fdn.isna()))].itertuples():
            r_dict = copy.deepcopy(mo_dict)
            r_dict['ENodeBFunction'][moc][rmoc] = self.get_mo_dict_from_moc_node_fdn_moid(rmoc, row.presite, row.fdn, row.relid)
            r_dict['ENodeBFunction'][moc][rmoc] |= {'attributes': {'xc:operation': 'update'}, 'eUtranFreqRelationId': row.relid,
                                                    'cellReselectionPriority': row.creprio, 'userLabel': '', 'eutranFrequencyRef': ''}
            self.mo_dict[F'{cell_fdn},{rmoc}={row.relid}'] = copy.deepcopy(r_dict)

        rmoc = 'UtranFreqRelation'
        for row in self.usid.df_enb_ur.loc[((self.usid.df_enb_ur.postsite == self.node) &
                                           (self.usid.df_enb_ur.postcell == postcell) & (~self.usid.df_enb_ur.fdn.isna()))].itertuples():
            r_dict = copy.deepcopy(mo_dict)
            r_dict['ENodeBFunction'][moc][rmoc] = self.get_mo_dict_from_moc_node_fdn_moid(rmoc, row.presite, row.fdn, row.relid)
            r_dict['ENodeBFunction'][moc][rmoc] |= {'attributes': {'xc:operation': 'update'}, 'utranFreqRelationId': row.relid,
                                                    'cellReselectionPriority': row.creprio, 'userLabel': '', 'utranFrequencyRef': ''}
            self.mo_dict[F'{cell_fdn},{rmoc}={row.relid}'] = copy.deepcopy(r_dict)
