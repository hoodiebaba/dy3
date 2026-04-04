import copy
from .att_xml_base import att_xml_base


class lte_55_enb_lla_relation(att_xml_base):
    def create_rpc_msg(self):
        """ --- UnlicensedBandProfile, EUtranFreqRelationUnlicensed, EUtranCellRelationUnlicensed --- """
        if len(self.df_enb_cell.loc[self.df_enb_cell.addcell & self.df_enb_cell.freqband.isin(['46'])].index) == 0: return
        self.motype = 'Lrat'
        celltype_dict = {'FDD': 'EUtranCellFDD', 'TDD': 'EUtranCellTDD', 'IOT': 'NbIotCell'}
        df_enb_cell = self.df_enb_cell.copy()
        df_enb_cell['location'] = df_enb_cell.postcell.apply(lambda x: x.split('_')[1])
        nw_fdn = F'ENodeBFunction=1,EUtraNetwork={self.enbdata.get("EUtraNetwork", "1")}'
        unlic_band_mo = self.site.get_mos_with_parent_moc(F'.*{nw_fdn}', 'UnlicensedBandProfile') if self.site else []
        band = F'{nw_fdn},UnlicensedBandProfile={unlic_band_mo[0].split("=")[-1] if len(unlic_band_mo) > 0 else "1"}'
        for location in df_enb_cell.location.unique():
            if len(df_enb_cell.loc[(df_enb_cell.location == location) & (df_enb_cell.freqband == '46')].index) == 0: continue
            # EUtranCellFDD ---> EUtranFreqRelationUnlicensed
            for _, row in df_enb_cell.loc[(df_enb_cell.location == location) & (df_enb_cell.celltype == 'FDD')].iterrows():
                fdd_fdn = F'ENodeBFunction=1,EUtranCellFDD={row.postcell}'
                r_dict = {'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1', 'EUtranCellFDD': {
                    'eUtranCellFDDId': row.postcell}}}
                unlic_rel_mo = []
                if self.site:
                    unlic_rel_mo = self.site.get_mos_with_parent_moc(F'.*EUtranCellFDD={row.postcell}', 'EUtranFreqRelationUnlicensed')
                if len(unlic_rel_mo) == 0:
                    r_fdn = F'{fdd_fdn},EUtranFreqRelationUnlicensed=1'
                    temp_dict = self.get_mo_dict_from_moc_node_fdn_moid('EUtranFreqRelationUnlicensed', None, None, '1')
                    temp_dict |= {'eUtranFreqRelationUnlicensedId': '1', 'unlicensedBandProfileRef': band}
                    r_dict['ENodeBFunction']['EUtranCellFDD']['EUtranFreqRelationUnlicensed'] = temp_dict
                    self.mo_dict[r_fdn] = copy.deepcopy(r_dict)
                    r_dict['ENodeBFunction']['EUtranCellFDD']['EUtranFreqRelationUnlicensed'] = {'eUtranFreqRelationUnlicensedId': '1'}
                else:
                    r_fdn = F'{fdd_fdn},EUtranFreqRelationUnlicensed={unlic_rel_mo[0].split("=")[-1]}'
                    r_dict['ENodeBFunction']['EUtranCellFDD']['EUtranFreqRelationUnlicensed'] = {
                        'eUtranFreqRelationUnlicensedId': unlic_rel_mo[0].split('=')[-1]}
                # EUtranCellFDD ---> EUtranFreqRelationUnlicensed ---> EUtranCellRelationUnlicensed
                for _, row_tdd in df_enb_cell.loc[(df_enb_cell.location == location) & (df_enb_cell.freqband == '46')].iterrows():
                    if not (row.addcell or row_tdd.addcell): continue
                    c_ldn = F'{r_fdn},EUtranCellRelationUnlicensed={row_tdd.postcell}'
                    temp_dict = self.get_mo_dict_from_moc_node_fdn_moid('EUtranCellRelationUnlicensed', None, None, row_tdd.postcell)
                    temp_dict |= {'eUtranCellRelationUnlicensedId': row_tdd.postcell, 'earfcn': row_tdd.earfcndl,
                                  'neighborCellRef': F'ENodeBFunction=1,EUtranCellTDD={row_tdd.postcell}'}
                    r_dict['ENodeBFunction']['EUtranCellFDD']['EUtranFreqRelationUnlicensed']['EUtranCellRelationUnlicensed'] = temp_dict
                    self.mo_dict[r_fdn] = copy.deepcopy(r_dict)
