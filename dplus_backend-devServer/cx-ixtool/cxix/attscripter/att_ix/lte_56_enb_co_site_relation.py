import copy
from .att_xml_base import att_xml_base


class lte_56_enb_co_site_relation(att_xml_base):
    def create_rpc_msg(self):
        self.motype = 'Lrat'
        self.usid_enbids = list(self.usid.df_enb_cell.enbid.unique())
        # --- EUtraNetwork, UnlicensedBandProfile, EUtranFrequency, ExternalENodeBFunction, TermPointToENB,
        # ExternalEUtranCellFDD, ExternalEUtranCellTDD ---
        self.nw_fdn = F'ENodeBFunction=1,EUtraNetwork={self.enbdata.get("EUtraNetwork")}'
        self.nw_dict = {'managedElementId': self.node, 'ENodeBFunction': {
            'eNodeBFunctionId': '1', 'EUtraNetwork': {'eUtraNetworkId': self.enbdata.get('EUtraNetwork')}}}
        self.eutran_network_externals()

        # FreqRelation and CellRelations
        self.nw_fdn = F'ENodeBFunction=1,EUtraNetwork={self.enbdata.get("EUtraNetwork")}'
        self.me_dict = {'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1'}}
        celltype_dict = {'FDD': 'EUtranCellFDD', 'TDD': 'EUtranCellTDD', 'IOT': 'NbIotCell'}
        for row in self.df_enb_cell.itertuples():
            moc = celltype_dict.get(row.celltype)
            mo_dict = copy.deepcopy(self.me_dict)
            mo_dict['ENodeBFunction'][celltype_dict.get(row.celltype)] = {self.get_moc_id(moc): row.postcell}
            cell_fdn = F'ENodeBFunction=1,{moc}={row.postcell}'
            self.eutran_network_cosite(postcell=row.postcell, mo_dict=mo_dict, cell_fdn=cell_fdn, addcell=row.addcell)
        if len(self.df_enb_cell.loc[self.df_enb_cell.addcell & self.df_enb_cell.freqband.isin(['46'])].index) > 0:
            self.eutran_network_unlicrelations()

    def eutran_network_externals(self):
        # --- EUtraNetwork ---
        # --- EUtraNetwork ---> EUtranFrequency, ExternalENodeBFunction, TermPointToENB, ExternalEUtranCellFDD, ExternalEUtranCellTDD ---
        df_ef = self.usid.df_enb_ef.loc[(self.usid.df_enb_ef.postsite == self.node)]
        df_enx = self.usid.df_enb_ex.loc[(self.usid.df_enb_ex.postsite == self.node) & (self.usid.df_enb_ex.enbid.isin(self.usid_enbids))]
        df_fdd = self.usid.df_enb_ec.loc[(self.usid.df_enb_ec.postsite == self.node) & (self.usid.df_enb_ec.enbid.isin(self.usid_enbids))]
        # --- EUtraNetwork ---> EUtranFrequency ---
        nw_dict = copy.deepcopy(self.nw_dict)
        for row in df_ef.itertuples():
            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('EUtranFrequency', row.postsite, row.fdn, row.freqid)
            tmp_dict |= {'attributes': {'xc:operation': 'create'}, 'eUtranFrequencyId': row.freqid, 'arfcnValueEUtranDl': row.earfcndl}
            nw_dict['ENodeBFunction']['EUtraNetwork']['EUtranFrequency'] = tmp_dict
            self.mo_dict[F'{self.nw_fdn},EUtranFrequency={row.freqid}'] = copy.deepcopy(nw_dict)
        # --- EUtraNetwork ---> ExternalENodeBFunction, TermPointToENB, ExternalEUtranCellFDD, ExternalEUtranCellTDD ---
        nw_dict = copy.deepcopy(self.nw_dict)
        for xid in set(list(df_enx.xid.unique()) + list(df_fdd.xid.unique())):
            x_fdn = F'{self.nw_fdn},ExternalENodeBFunction={xid}'
            if len(df_enx.loc[df_enx.xid == xid].index) > 0:
                row_ext = df_enx.loc[df_enx.xid == xid].iloc[0]
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('ExternalENodeBFunction', row_ext.postsite, row_ext.fdn, row_ext.xid)
                tmp_dict |= {'attributes': {'xc:operation': 'create'}, 'externalENodeBFunctionId': row_ext.xid, 'eNBId': row_ext.enbid,
                             'eNodeBPlmnId': row_ext.plmn}
                nw_dict['ENodeBFunction']['EUtraNetwork']['ExternalENodeBFunction'] = copy.deepcopy(tmp_dict)
                self.mo_dict[x_fdn] = copy.deepcopy(nw_dict)
                nw_dict['ENodeBFunction']['EUtraNetwork']['ExternalENodeBFunction'] = {'externalENodeBFunctionId': row_ext.xid}
                if row_ext.x2id is not None:
                    tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('TermPointToENB', row_ext.postsite, row_ext.x2fdn, row_ext.x2id)
                    tmp_dict |= {'attributes': {'xc:operation': 'create'}, 'termPointToENBId': row_ext.x2id}
                    if row_ext.ipv4 is not None: tmp_dict |= {'ipAddress': row_ext.ipv4}
                    if row_ext.ipv6 is not None: tmp_dict |= {'ipv6Address': row_ext.ipv6}
                    if row_ext.domain is not None: tmp_dict |= {'domainName': row_ext.domain}
                    nw_dict['ENodeBFunction']['EUtraNetwork']['ExternalENodeBFunction']['TermPointToENB'] = copy.deepcopy(tmp_dict)
                    self.mo_dict[F'{x_fdn},TermPointToENB={row_ext.x2id}'] = copy.deepcopy(nw_dict)
                else:
                    tmp_dict = {'attributes': {'xc:operation': 'create'}, 'termPointToENBId': row_ext.xid,
                                'administrativeState': '1 (UNLOCKED)', 'ipAddress': '0.0.0.0', 'ipv6Address': '::'}
                    nw_dict['ENodeBFunction']['EUtraNetwork']['ExternalENodeBFunction']['TermPointToENB'] = copy.deepcopy(tmp_dict)
                    self.mo_dict[F'{x_fdn},TermPointToENB={row_ext.xid}'] = copy.deepcopy(nw_dict)
            for row in (df_fdd.loc[df_fdd.xid == xid]).itertuples():
                nw_dict['ENodeBFunction']['EUtraNetwork']['ExternalENodeBFunction'] = {'externalENodeBFunctionId': xid}
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid(F'ExternalEUtranCell{row.celltype}', row.postsite, row.fdn, row.xcellid)
                tmp_dict |= {'attributes': {'xc:operation': 'create'}, F'externalEUtranCell{row.celltype}Id': row.xcellid,
                             'localCellId': row.cellid, 'tac': row.tac,
                              'physicalLayerCellIdGroup': F'{int(row.pci) // 3}', 'physicalLayerSubCellId': F'{int(row.pci) % 3}',
                             'eutranFrequencyRef': F'{self.nw_fdn},EUtranFrequency={row.freqid}'}
                nw_dict['ENodeBFunction']['EUtraNetwork']['ExternalENodeBFunction'][F'ExternalEUtranCell{row.celltype}'] = copy.deepcopy(tmp_dict)
                self.mo_dict[F'{x_fdn},ExternalEUtranCell{row.celltype}={row.xcellid}'] = copy.deepcopy(nw_dict)

    def eutran_network_cosite(self, postcell, mo_dict, cell_fdn, addcell):
        moc = self.get_end_moc(cell_fdn)
        df_rel = self.usid.df_enb_er.loc[(self.usid.df_enb_er.postsite == self.node) & (self.usid.df_enb_er.postcell == postcell)]
        df_cell = self.usid.df_enb_ee.loc[(self.usid.df_enb_ee.postsite == self.node) &
                                          (self.usid.df_enb_ee.postcell == postcell) & (self.usid.df_enb_ee.enbid.isin(self.usid_enbids))]
        # --- EUtranCellFDD ---> EUtranFreqRelation ---
        for relid in set(list(df_cell.relid.unique())):
            rel_fdn = F'{cell_fdn},EUtranFreqRelation={relid}'
            nw_dict = copy.deepcopy(mo_dict)
            if len(df_rel.loc[df_rel.relid == relid].index) > 0:
                row_rel = df_rel.loc[df_rel.relid == relid].iloc[0]
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('EUtranFreqRelation', row_rel.presite, row_rel.fdn, row_rel.relid)
                tmp_dict |= {'attributes': {'xc:operation': 'create'}, 'eUtranFreqRelationId': row_rel.relid,
                             'cellReselectionPriority': row_rel.creprio, 'userLabel': '',
                             'eutranFrequencyRef': F'{self.nw_fdn},EUtranFrequency={row_rel.freqid}'}
                nw_dict['ENodeBFunction'][moc]['EUtranFreqRelation'] = tmp_dict
                self.mo_dict[rel_fdn] = copy.deepcopy(nw_dict)
            # --- EUtranCellFDD ---> EUtranFreqRelation ---> EUtranCellRelation ---
            nw_dict['ENodeBFunction'][moc]['EUtranFreqRelation'] = {'eUtranFreqRelationId': relid}
            for row in df_cell.loc[df_cell.relid == relid].itertuples():
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('EUtranCellRelation', row.presite, row.fdn, row.crelid)
                tmp_dict |= {'attributes': {'xc:operation': 'create'}, 'eUtranCellRelationId': row.crelid, 'isRemoveAllowed': row.israllowed,
                             'sCellCandidate': row.scell, 'neighborCellRef': row.extcell}
                nw_dict['ENodeBFunction'][moc]['EUtranFreqRelation']['EUtranCellRelation'] = tmp_dict
                self.mo_dict[F'{rel_fdn},EUtranCellRelation={row.crelid}'] = copy.deepcopy(nw_dict)

    def eutran_network_unlicrelations(self):
        if len(self.df_enb_cell.loc[self.df_enb_cell.addcell & self.df_enb_cell.freqband.isin(['46'])].index) == 0: return
        # --- EUtraNetwork ---> UnlicensedBandProfile ---
        if len(self.df_enb_cell.loc[self.df_enb_cell.freqband == '46'].index) > 0:
            mos_ids = [_.split("=")[-1] for _ in self.site.find_mo_ending_with_parent_str(
                'UnlicensedBandProfile', F'.*EUtraNetwork={self.enbdata.get("EUtraNetwork")}')] if self.site else []
            if '1' not in mos_ids or self.eq_flag:
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('EUtranFreqRelationUnlicensed', None, None, '1')
                tmp_dict |= {'attributes': {'xc:operation': 'create'}, 'unlicensedBandProfileId': '1',
                             'unlicensedBandProfileList': self.get_unlic_bandprofile_dict(self.usid.client.mname)}
                nw_dict = copy.deepcopy(self.nw_dict)
                nw_dict['ENodeBFunction']['EUtraNetwork']['UnlicensedBandProfile'] = tmp_dict
                self.mo_dict[F'{self.nw_fdn},UnlicensedBandProfile=1'] = copy.deepcopy(nw_dict)
        df_enb_cell = self.df_enb_cell.copy()
        df_enb_cell['location'] = df_enb_cell.postcell.apply(lambda x: x.split('_')[1])
        unlic_band_mo = self.site.find_mo_ending_with_parent_str(moc='UnlicensedBandProfile', parent=F'.*{self.nw_fdn}') if self.site else []
        band = F'{self.nw_fdn},UnlicensedBandProfile={unlic_band_mo[0].split("=")[-1] if len(unlic_band_mo) > 0 else "1"}'
        for location in df_enb_cell.location.unique():
            if len(df_enb_cell.loc[(df_enb_cell.location == location) & (df_enb_cell.freqband == '46')].index) == 0: continue
            # EUtranCellFDD ---> EUtranFreqRelationUnlicensed ---> EUtranCellRelationUnlicensed
            for row in df_enb_cell.loc[(df_enb_cell.location == location) & (df_enb_cell.celltype == 'FDD')].itertuples():
                fdd_fdn = F'ENodeBFunction=1,EUtranCellFDD={row.postcell}'
                nw_dict = copy.deepcopy(self.me_dict)
                nw_dict['ENodeBFunction']['EUtranCellFDD'] = {'eUtranCellFDDId': row.postcell}
                unlic_rel_mo = self.site.find_mo_ending_with_parent_str('EUtranFreqRelationUnlicensed', F'.*EUtranCellFDD={row.postcell}') if self.site else []
                if len(unlic_rel_mo) == 0:
                    rel_fdn = F'{fdd_fdn},EUtranFreqRelationUnlicensed=1'
                    tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('EUtranFreqRelationUnlicensed', None, None, '1')
                    tmp_dict |= {'attributes': {'xc:operation': 'create'}, 'eUtranFreqRelationUnlicensedId': '1', 'unlicensedBandProfileRef': band}
                    nw_dict['ENodeBFunction']['EUtranCellFDD']['EUtranFreqRelationUnlicensed'] = tmp_dict
                    self.mo_dict[rel_fdn] = copy.deepcopy(nw_dict)
                    nw_dict['ENodeBFunction']['EUtranCellFDD']['EUtranFreqRelationUnlicensed'] = {'eUtranFreqRelationUnlicensedId': '1'}
                else:
                    rel_fdn = F'{fdd_fdn},EUtranFreqRelationUnlicensed={unlic_rel_mo[0].split("=")[-1]}'
                    nw_dict['ENodeBFunction']['EUtranCellFDD']['EUtranFreqRelationUnlicensed'] = {
                        'eUtranFreqRelationUnlicensedId': unlic_rel_mo[0].split('=')[-1]}
                for row_tdd in df_enb_cell.loc[(df_enb_cell.location == location) & (df_enb_cell.freqband == '46')].itertuples():
                    if not (row.addcell or row_tdd.addcell): continue
                    tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('EUtranCellRelationUnlicensed', None, None, row_tdd.postcell)
                    tmp_dict |= {'attributes': {'xc:operation': 'create'}, 'eUtranCellRelationUnlicensedId': row_tdd.postcell,
                                 'earfcn': row_tdd.earfcndl, 'neighborCellRef': F'ENodeBFunction=1,EUtranCellTDD={row_tdd.postcell}'}
                    nw_dict['ENodeBFunction']['EUtranCellFDD']['EUtranFreqRelationUnlicensed']['EUtranCellRelationUnlicensed'] = tmp_dict
                    self.mo_dict[F'{rel_fdn},EUtranCellRelationUnlicensed={row_tdd.postcell}'] = copy.deepcopy(nw_dict)
