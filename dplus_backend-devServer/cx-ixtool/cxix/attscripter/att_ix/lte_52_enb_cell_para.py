import copy
from .att_xml_base import att_xml_base


class lte_52_enb_cell_para(att_xml_base):
    def create_rpc_msg(self):
        if len(self.df_enb_cell.loc[((self.usid.df_enb_cell.addcell) & (self.usid.df_enb_cell.celltype.isin(['FDD', 'TDD'])))].index) == 0: return
        self.motype = 'Lrat'
        self.systemCreated_list = self.get_systemCreated_list()
        celltype_dict = {'FDD': 'EUtranCellFDD', 'TDD': 'EUtranCellTDD', 'IOT': 'NbIotCell'}
        enb_dict = {'eNodeBFunctionId': '1', 'EUtranCellFDD': [], 'EUtranCellTDD': [], 'NbIotCell': []}
        for row in self.df_enb_cell.loc[((self.df_enb_cell.addcell) & (self.df_enb_cell.celltype.isin(['FDD', 'TDD'])))].itertuples():
            moc = celltype_dict.get(row.celltype)
            rel_tag = F'{moc}MO'
            cell_dict = {self.get_moc_id(moc): row.postcell}
            parent_str = '' if row.fdn is None else row.fdn
            childs = self.MoRelation.objects.filter(parent=moc, tag=rel_tag, software=self.usid.client.software)
            for child in childs:
                mos = self.log_append_child_tags(child.child, rel_tag=rel_tag, parent_mo=parent_str, node=row.presite)
                for key in mos: cell_dict[key] = mos[key]
            enb_dict[moc].append(copy.deepcopy(cell_dict))
        self.mo_dict['lte_cell_para_update'] = {'managedElementId': self.node, 'ENodeBFunction': copy.deepcopy(enb_dict)}
        # PmUeMeasControl
        self.mo_dict['lte_cell_pmuemeascontrol'] = {'managedElementId': self.node, 'ENodeBFunction': {
            'eNodeBFunctionId': '1', 'EUtranCellFDD': self.pmuemeascontrol_for_fdd_cells()}}

    def pmuemeascontrol_for_fdd_cells(self):
        msgs = []
        for row in self.df_enb_cell.loc[((self.df_enb_cell.addcell) & (self.df_enb_cell.celltype == 'FDD') & (self.df_enb_cell.noofrx != '0') &
                                        (~self.df_enb_cell.postcell.str.upper().str.endswith('_L', na=False)))].itertuples():
            if len(self.usid.df_enb_ef.loc[(self.usid.df_enb_ef.postsite == row.postsite) &
                                           (self.usid.df_enb_ef.earfcndl == row.earfcndl)].index) == 0: continue
            freqid = self.usid.df_enb_ef.loc[(self.usid.df_enb_ef.postsite == row.postsite) &
                                             (self.usid.df_enb_ef.earfcndl == row.earfcndl)].freqid.iloc[0]
            rep_mo_dict = {'reportConfigEUtraIntraFreqPmId': '1'}
            if row.fdn is not None:
                site = self.usid.sites.get(F'site_{row.presite}', None)
                mos = [_.split('=')[-1] for _ in site.find_mo_ending_with_parent_str(moc='ReportConfigEUtraIntraFreqPm',
                                                                      parent=F'{row.fdn},UeMeasControl=1') if site]
                if '1' not in mos:
                    rep_mo_dict = self.get_mo_dict_from_moc_node_fdn_moid('ReportConfigEUtraIntraFreqPm', None, None, '1')
            msgs.append(self.pmuemeascontrol_dict(row.postcell, freqid, rep_mo_dict))
        return msgs

    def pmuemeascontrol_dict(self, postcell, freqid, rep_mo_dict):
        return {
            'eUtranCellFDDId': postcell,
            'UeMeasControl': {
                'ueMeasControlId': '1',
                'ReportConfigEUtraIntraFreqPm': copy.deepcopy(rep_mo_dict),
                'PmUeMeasControl': {
                    'attributes': {'xc:operation': 'create'},
                    'pmUeMeasControlId': '1',
                    'ueMeasIntraFreq1': {
                        'eutranFrequencyRef': F'ENodeBFunction=1,EUtraNetwork=1,EUtranFrequency={freqid}',
                        'reportConfigEUtraIntraFreqPmRef': F'ENodeBFunction=1,EUtranCellFDD={postcell},UeMeasControl=1,ReportConfigEUtraIntraFreqPm=1'},
                    'ueMeasIntraFreq2': {
                        'eutranFrequencyRef': F'ENodeBFunction=1,EUtraNetwork=1,EUtranFrequency={freqid}',
                        'reportConfigEUtraIntraFreqPmRef': F'ENodeBFunction=1,EUtranCellFDD={postcell},UeMeasControl=1,ReportConfigEUtraIntraFreqPm=1'}
                }
            }
        }

    def get_systemCreated_list(self):
        return [
            'CellPerformance',
            'CellPortionRd',
            'CellSleepFunction',
            'Etws',
            'InstantUplinkAccess',
            'MimoSleepFunction',
            'UeMeasControl',
            'ReportConfigA1A2Br',
            'ReportConfigA1A2Endc',
            'ReportConfigA1Prim',
            'ReportConfigA1Sec',
            'ReportConfigA4',
            'ReportConfigA5DlComp',
            'ReportConfigA5EndcHo',
            'ReportConfigA5SoftLock',
            'ReportConfigA5Spifho',
            'ReportConfigA5UlTraffic',
            'ReportConfigA5UlTrig',
            'ReportConfigA5UlVolte',
            'ReportConfigA5',
            'ReportConfigA5Anr',
            'ReportConfigB1GUtra',
            'ReportConfigB1Geran',
            'ReportConfigB1NR',
            'ReportConfigB1Utra',
            'ReportConfigB2Cdma20001xRtt',
            'ReportConfigB2Cdma2000',
            'ReportConfigB2Geran',
            'ReportConfigB2GeranUlTrig',
            'ReportConfigB2Utra',
            'ReportConfigB2UtraUlTrig',
            'ReportConfigCsfbCdma2000',
            'ReportConfigCsfbGeran',
            'ReportConfigCsfbUtra',
            'ReportConfigCsg',
            'ReportConfigEUtraBadCovPrim',
            'ReportConfigEUtraBadCovSec',
            'ReportConfigEUtraBestCell',
            'ReportConfigEUtraBestCellAnr',
            'ReportConfigEUtraIFA3UlTrig',
            'ReportConfigEUtraIFBestCell',
            'ReportConfigEUtraInterFreqLb',
            'ReportConfigEUtraInterFreqMbms',
            'ReportConfigElcA1A2',
            'ReportConfigErabSetup',
            'ReportConfigInterEnbUlComp',
            'ReportConfigInterRatLb',
            'ReportConfigSCellA1A2',
            'ReportConfigSCellA4',
            'ReportConfigSCellA6',
            'ReportConfigSearch',

        ]