import copy
from .att_xml_base import att_xml_base


class lte_53_enb_cell_relation(att_xml_base):
    def create_rpc_msg(self):
        self.motype = 'Lrat'
        celltype_dict = {'FDD': 'EUtranCellFDD', 'TDD': 'EUtranCellTDD', 'IOT': 'NbIotCell'}
        # EUtranFreqRelation, EUtranCellRelation
        nw_fdn = F'ENodeBFunction=1,EUtraNetwork={self.enbdata["EUtraNetwork"]}'
        df_enb_er = self.usid.df_enb_er.copy().loc[(self.usid.df_enb_er.postsite == self.node)]
        df_enb_ee = self.usid.df_enb_ee.copy().loc[(self.usid.df_enb_ee.postsite == self.node)]
        for row in self.df_enb_cell.loc[(self.df_enb_cell.celltype.isin(['FDD', 'TDD']))].itertuples():
            moc = celltype_dict.get(row.celltype)
            cell_fdn = F'ENodeBFunction=1,{moc}={row.postcell}'
            log = None if row.addcell else False
            mo_dict = {'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1', moc: {self.get_moc_id(moc): row.postcell}}}
            # EUtranFreqRelation
            for r in df_enb_er.loc[((df_enb_er.postcell == row.postcell) & (df_enb_er.flag != log))].itertuples():
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('EUtranFreqRelation', r.presite, r.fdn, r.relid)
                tmp_dict |= {'attributes': {'xc:operation': 'create'},
                             'cellReselectionPriority': r.creprio, 'eutranFrequencyRef': F'{nw_fdn},EUtranFrequency={r.freqid}', 'userLabel': ''}
                r_dict = copy.deepcopy(mo_dict)
                r_dict['ENodeBFunction'][moc]['EUtranFreqRelation'] = tmp_dict
                self.mo_dict[F'{cell_fdn},EUtranFreqRelation={r.relid}'] = copy.deepcopy(r_dict)
            # EUtranCellRelation
            for c in df_enb_ee.loc[((df_enb_ee.postcell == row.postcell) & (df_enb_ee.flag != log))].itertuples():
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('EUtranCellRelation', c.presite, c.fdn, c.crelid)
                tmp_dict |= {'attributes': {'xc:operation': 'create'},
                             'isRemoveAllowed': c.israllowed, 'sCellCandidate': c.scell, 'neighborCellRef': c.extcell}
                r_dict = copy.deepcopy(mo_dict)
                r_dict['ENodeBFunction'][moc]['EUtranFreqRelation'] = {'eUtranFreqRelationId': c.relid, 'EUtranCellRelation': tmp_dict}
                self.mo_dict[F'{cell_fdn},EUtranFreqRelation={c.relid},EUtranCellRelation={c.crelid}'] = copy.deepcopy(r_dict)

        # GUtranFreqRelation, GUtranCellRelation
        nw_fdn = F'ENodeBFunction=1,GUtraNetwork={self.enbdata.get("GUtraNetwork")}'
        df_enb_nr = self.usid.df_enb_nr.copy().loc[(self.usid.df_enb_nr.postsite == self.node)]
        df_enb_ne = self.usid.df_enb_ne.copy().loc[(self.usid.df_enb_ne.postsite == self.node)]
        for row in self.df_enb_cell.loc[(self.df_enb_cell.celltype.isin(['FDD', 'TDD']))].itertuples():
            moc = celltype_dict.get(row.celltype)
            cell_fdn = F'ENodeBFunction=1,{moc}={row.postcell}'
            log = None if row.addcell else False
            mo_dict = {'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1', moc: {self.get_moc_id(moc): row.postcell}}}
            # GUtranFreqRelation
            for r in df_enb_nr.loc[((df_enb_nr.postcell == row.postcell) & (df_enb_nr.flag != log))].itertuples():
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('GUtranFreqRelation', r.presite, r.fdn, r.relid)
                tmp_dict |= {'attributes': {'xc:operation': 'create'},
                             'cellReselectionPriority': r.creprio, 'gUtranSyncSignalFrequencyRef': F'{nw_fdn},GUtranSyncSignalFrequency={r.freqid}'}
                r_dict = copy.deepcopy(mo_dict)
                r_dict['ENodeBFunction'][moc]['GUtranFreqRelation'] = tmp_dict
                self.mo_dict[F'{cell_fdn},GUtranFreqRelation={r.relid}'] = copy.deepcopy(r_dict)
            # GUtranCellRelation
            for c in df_enb_ne.loc[((df_enb_ne.postcell == row.postcell) & (df_enb_ne.flag != log))].itertuples():
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('GUtranCellRelation', c.presite, c.fdn, c.crelid)
                tmp_dict |= {'attributes': {'xc:operation': 'create'},
                             'gUtranCellRelationId': c.crelid, 'isRemoveAllowed': c.israllowed,
                             'neighborCellRef': F'{nw_fdn},ExternalGNodeBFunction={c.xid},ExternalGUtranCell={c.xcellid}'}
                r_dict = copy.deepcopy(mo_dict)
                r_dict['ENodeBFunction'][moc]['GUtranFreqRelation'] = {'gUtranFreqRelationId': c.relid, 'GUtranCellRelation': tmp_dict}
                self.mo_dict[F'{cell_fdn},GUtranFreqRelation={c.relid},GUtranCellRelation={c.crelid}'] = copy.deepcopy(r_dict)

        # UtranFreqRelation, UtranCellRelation
        nw_fdn = F'ENodeBFunction=1,UtraNetwork={self.enbdata["UtraNetwork"]}'
        df_enb_ur = self.usid.df_enb_ur.copy().loc[(self.usid.df_enb_ur.postsite == self.node)]
        df_enb_ue = self.usid.df_enb_ue.copy().loc[(self.usid.df_enb_ue.postsite == self.node)]
        for row in self.df_enb_cell.loc[(self.df_enb_cell.celltype.isin(['FDD', 'TDD']))].itertuples():
            moc = celltype_dict.get(row.celltype)
            cell_fdn = F'ENodeBFunction=1,{moc}={row.postcell}'
            log = None if row.addcell else False
            mo_dict = {'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1', moc: {self.get_moc_id(moc): row.postcell}}}
            # UtranFreqRelation
            for r in df_enb_ur.loc[((df_enb_ur.postcell == row.postcell) & (df_enb_ur.flag != log))].itertuples():
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('UtranFreqRelation', r.presite, r.fdn, r.relid)
                tmp_dict |= {'attributes': {'xc:operation': 'create'},
                             'cellReselectionPriority': r.creprio, 'utranFrequencyRef': F'{nw_fdn},UtranFrequency={r.freqid}', 'userLabel': ''}
                r_dict = copy.deepcopy(mo_dict)
                r_dict['ENodeBFunction'][moc]['UtranFreqRelation'] = tmp_dict
                self.mo_dict[F'{cell_fdn},UtranFreqRelation={r.relid}'] = copy.deepcopy(r_dict)
            # UtranCellRelation
            for c in df_enb_ue.loc[((df_enb_ue.postcell == row.postcell) & (df_enb_ue.flag != log))].itertuples():
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('UtranCellRelation', c.presite, c.fdn, c.crelid)
                tmp_dict |= {'attributes': {'xc:operation': 'create'},
                             'externalUtranCellFDDRef': F'{nw_fdn},UtranFrequency={c.freqid},ExternalUtranCellFDD={c.xcellid}'}
                r_dict = copy.deepcopy(mo_dict)
                r_dict['ENodeBFunction'][moc]['UtranFreqRelation'] = {'utranCellRelationId': c.relid, 'UtranCellRelation': tmp_dict}
                self.mo_dict[F'{cell_fdn},UtranFreqRelation={c.relid},UtranCellRelation={c.crelid}'] = copy.deepcopy(r_dict)
