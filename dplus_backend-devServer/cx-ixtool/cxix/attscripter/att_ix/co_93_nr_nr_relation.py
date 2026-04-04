import copy
import pandas as pd
from .att_xml_base import att_xml_base


class co_93_nr_nr_relation(att_xml_base):
    def create_rpc_msg(self):
        if self.usid.script.get(self.__class__.__name__, False): return
        else: self.usid.script[self.__class__.__name__] = True
        if len(self.usid.df_gnb_cell.index) == 0 or len(self.usid.df_nr_rel.index) == 0: return
        self.motype = 'GNBCUCP'
        self.nw_fdn = F'GNBCUCPFunction=1,NRNetwork=1'
        df_nr = self.usid.df_nr_rel.copy()
        df_nr = df_nr.loc[(~((df_nr.freqband.str.contains('N260|N261|N258')) & (df_nr.carrier.str.contains('MC'))))]
        df_nr = df_nr[['postsite', 'postcell', 'freqband', 'carrier']]

        df_tr = self.usid.df_gnb_cell.copy().assign(lte_ip='::')
        df_tr['lte_ip'] = df_tr.postsite.apply(lambda x: self.usid.gnodeb.get(x).get('lte_ip', '::'))
        df_tr = pd.concat([df_tr, self.usid.df_nr_rel.copy()], join='inner', ignore_index=True)
        df_tr = df_tr.loc[(~((df_tr.freqband.str.contains('N260|N261|N258')) & (df_tr.carrier.str.contains('MC'))))]
        if len(df_nr.index) == 0 or len(df_tr.index) == 0: return
        df_rel = df_nr.assign(flag='a').merge(df_tr.assign(flag='a'), on='flag', suffixes=('_source', '')).assign(
            freq=None, relid=None, ext_id=None, ext_cell_id=None, ext_cell_mo=None)
        df_rel = df_rel.loc[(~((df_rel.postsite_source == df_rel.postsite) & (df_rel.postcell_source == df_rel.postcell)))]
        if len(df_rel.index) == 0: return
        del df_tr, df_nr
        df_rel[['freq', 'relid', 'ext_id', 'ext_cell_id', 'ext_cell_mo']] = df_rel.apply(self.get_mo_ids_for_rel, axis=1, result_type='expand')

        for gnb in df_rel.postsite_source.unique():
            self.set_node_site_and_para_for_dcgk(gnb)
            # self.node = gnb
            # self.site = self.usid.sites.get(F'site_{self.node}')
            me_dict = {'managedElementId': self.node, 'GNBCUCPFunction': {'gNBCUCPFunctionId': '1'}}
            mo_list = []
            for row in df_rel.loc[(df_rel.postsite_source == gnb)].itertuples():
                mos_ldn_dict = {}
                # NRFrequency
                mos_ldn_dict['NRFrequency'] = F'{self.nw_fdn},NRFrequency={row.freq}'
                if mos_ldn_dict['NRFrequency'] in mo_list: pass
                elif self.site is not None and self.no_eq_change_with_dcgk_flag and len(self.site.get_mos_w_end_str(mos_ldn_dict['NRFrequency'])) > 0:
                    mo_list += [mos_ldn_dict['NRFrequency']]
                else:
                    mo_list += [mos_ldn_dict['NRFrequency']]
                    tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('NRFrequency', None, None, row.freq)
                    tmp_dict |= {'arfcnValueNRDl': row.ssbfrequency, 'smtcDuration': row.ssbduration, 'smtcOffset': row.ssboffset,
                                 'smtcPeriodicity': row.ssbperiodicity, 'smtcScs': row.ssbsubcarrierspacing}
                    mo_dict = copy.deepcopy(me_dict)
                    mo_dict['GNBCUCPFunction']['NRNetwork'] = {'nRNetworkId': '1', 'NRFrequency': tmp_dict}
                    self.mo_dict[mos_ldn_dict['NRFrequency']] = copy.deepcopy(mo_dict)
                # McpcPSCellNrFreqRelProfile, UeMCNrFreqRelProfile, McpcPCellNrFreqRelProfile, TrStSaNrFreqRelProfile
                _, _, mos_list = self.get_nr_freq_rel_id_n_profile_mos(row)
                for moc in mos_list:
                    mos_ldn_dict[moc[1]] = F'GNBCUCPFunction=1,{moc[0]}=1,{moc[1]}={row.relid}'
                    if mos_ldn_dict[moc[1]] in mo_list: pass
                    if self.no_eq_change_with_dcgk_flag and len(self.site.get_mos_w_end_str(mos_ldn_dict[moc[1]])) > 0:
                        mo_list += [mos_ldn_dict[moc[1]]]
                    else:
                        mo_list += [mos_ldn_dict[moc[1]]]
                        tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid(moc[1], None, None, row.relid)
                        tmp_dict |= {self.get_moc_id(moc[1]): row.relid}
                        if len(moc) == 3:
                            tmp_dict[moc[2]] = self.get_mo_dict_from_moc_node_fdn_moid(moc[2], None, None, 'Base')
                            tmp_dict |= self.update_rel_cug_profile(row.freqband, moc[2], tmp_dict)
                        mo_dict = copy.deepcopy(me_dict)
                        mo_dict['GNBCUCPFunction'][moc[0]] = {self.get_moc_id(moc[0]): '1', moc[1]: tmp_dict}
                        self.mo_dict[mos_ldn_dict[moc[1]]] = copy.deepcopy(mo_dict)
                # ExternalGNBCUCPFunction
                if row.ext_id:
                    mos_ldn_dict['ExternalGNBCUCPFunction'] = F'{self.nw_fdn},ExternalGNBCUCPFunction={row.ext_id}'
                    if mos_ldn_dict['ExternalGNBCUCPFunction'] not in mo_list:
                        mo_list += [mos_ldn_dict['ExternalGNBCUCPFunction']]
                        tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('ExternalGNBCUCPFunction', None, None, row.ext_id)
                        tmp_dict |= {'gNBId': row.gnbid, 'gNBIdLength': row.gnbidlength}
                        mo_dict = copy.deepcopy(me_dict)
                        mo_dict['GNBCUCPFunction']['NRNetwork'] = {'nRNetworkId': '1', 'ExternalGNBCUCPFunction': tmp_dict}
                        self.mo_dict[mos_ldn_dict['ExternalGNBCUCPFunction']] = copy.deepcopy(mo_dict)
                    # ExternalNRCellCU
                    mos_ldn_dict['ExternalNRCellCU'] = F'{mos_ldn_dict["ExternalGNBCUCPFunction"]},ExternalNRCellCU={row.ext_cell_id}'
                    if mos_ldn_dict['ExternalNRCellCU'] in mo_list: pass
                    elif self.no_eq_change_with_dcgk_flag and len(self.site.get_mos_w_end_str(mos_ldn_dict['ExternalNRCellCU'])) > 0:
                        mo_list += [mos_ldn_dict['ExternalNRCellCU']]
                    else:
                        mo_list += [mos_ldn_dict['ExternalNRCellCU']]
                        tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('ExternalNRCellCU', None, None, row.ext_cell_id)
                        tmp_dict |= {'cellLocalId': row.cellid, 'nRPCI': row.nrpci, 'nRTAC': row.nrtac,
                                     'nRFrequencyRef': mos_ldn_dict.get('NRFrequency')}
                        mo_dict = copy.deepcopy(me_dict)
                        mo_dict['GNBCUCPFunction']['NRNetwork'] = {'nRNetworkId': '1', 'ExternalGNBCUCPFunction': {
                            'externalGNBCUCPFunctionId': row.ext_id, 'ExternalNRCellCU': tmp_dict}}
                        self.mo_dict[mos_ldn_dict['ExternalNRCellCU']] = copy.deepcopy(mo_dict)
                else:
                    mos_ldn_dict['ExternalNRCellCU'] = F'GNBCUCPFunction=1,NRCellCU={row.postcell}'
                # NRFreqRelation
                mos_ldn_dict['NRFreqRelation'] = F'GNBCUCPFunction=1,NRCellCU={row.postcell_source},NRFreqRelation={row.relid}'
                if mos_ldn_dict['NRFreqRelation'] in mo_list: pass
                elif self.no_eq_change_with_dcgk_flag and len(self.site.get_mos_w_end_str(mos_ldn_dict['NRFreqRelation'])) > 0:
                    mo_list += [mos_ldn_dict['NRFreqRelation']]
                else:
                    mo_list += [mos_ldn_dict['NRFreqRelation']]
                    tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('NRFreqRelation', None, None, row.relid)
                    tmp_dict |= {
                        'nRFrequencyRef': mos_ldn_dict.get('NRFrequency'),
                        'mcpcPSCellNrFreqRelProfileRef': mos_ldn_dict.get('McpcPSCellNrFreqRelProfile', ''),
                        'ueMCNrFreqRelProfileRef': mos_ldn_dict.get('UeMCNrFreqRelProfile', ''),
                        'mcpcPCellNrFreqRelProfileRef': mos_ldn_dict.get('McpcPCellNrFreqRelProfile', ''),
                        'trStSaNrFreqRelProfileRef': mos_ldn_dict.get('TrStSaNrFreqRelProfile', ''),
                    }
                    mo_dict = copy.deepcopy(me_dict)
                    mo_dict['GNBCUCPFunction']['NRCellCU'] = {'nRCellCUId': row.postcell_source, 'NRFreqRelation': tmp_dict}
                    self.mo_dict[mos_ldn_dict['NRFreqRelation']] = copy.deepcopy(mo_dict)
                # NRCellRelation
                mos_ldn_dict['NRCellRelation'] = F'{mos_ldn_dict["NRFreqRelation"]},NRCellRelation={row.postcell}'
                if mos_ldn_dict['NRCellRelation'] in mo_list: pass
                elif self.no_eq_change_with_dcgk_flag and len(self.site.get_mos_w_end_str(mos_ldn_dict['NRCellRelation'])) > 0:
                    mo_list += [mos_ldn_dict['NRCellRelation']]
                else:
                    mo_list += [mos_ldn_dict['NRCellRelation']]
                    tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('NRCellRelation', None, None, row.postcell)
                    tmp_dict |= {'nRCellRef': mos_ldn_dict.get('ExternalNRCellCU'), 'nRFreqRelationRef': mos_ldn_dict.get('NRFreqRelation')}
                    mo_dict = copy.deepcopy(me_dict)
                    mo_dict['GNBCUCPFunction']['NRCellCU'] = {'nRCellCUId': row.postcell_source, 'NRCellRelation': tmp_dict}
                    self.mo_dict[mos_ldn_dict['NRCellRelation']] = copy.deepcopy(mo_dict)
            # Write Script to File
            self.create_script_from_mo_dict()
            self.write_script_file()
            self.mo_dict = {}

    def get_mo_ids_for_rel(self, row):
        if self.usid.client.software.swname < 'ATT_22_Q3':
            freq = F'{row.ssbfrequency}-{row.ssbsubcarrierspacing}-{row.ssbperiodicity}-{row.ssboffset}-{row.ssbduration}'
        else: freq = F'{row.ssbfrequency}-{row.ssbsubcarrierspacing}'
        relid = F'{row.ssbfrequency}-{row.ssbsubcarrierspacing}-{row.ssbperiodicity}-{row.ssboffset}-{row.ssbduration}'
        if row.postsite_source == row.postsite:
            ext_id = None
            ext_cell_id = None
            ext_cell_mo = F'GNBCUCPFunction=1,NRCellCU={row.postcell}'
        else:
            ext_id = row.postsite
            ext_cell_id = row.postcell
            ext_cell_mo = F'{self.nw_fdn},ExternalGNBCUCPFunction={ext_id},ExternalNRCellCU={ext_cell_id}'
        return [freq, relid, ext_id, ext_cell_id, ext_cell_mo]

    def get_anr_type_mo_ids_for_rel(self, row):
        # temp_ci = int(row.gnbid) * (2 ** (36 - int(row.gnbidlength)))
        if self.usid.client.software.swname < 'ATT_22_Q3':
            freq = F'{row.ssbfrequency}-{row.ssbsubcarrierspacing}-{row.ssbperiodicity}-{row.ssboffset}-{row.ssbduration}'
        else: freq = F'{row.ssbfrequency}-{row.ssbsubcarrierspacing}'
        relid = F'{row.ssbfrequency}-{row.ssbsubcarrierspacing}-{row.ssbperiodicity}-{row.ssboffset}-{row.ssbduration}'
        if row.postsite_source == row.postsite:
            ext_id = None
            ext_cell_id = None
            ext_cell_mo = F'GNBCUCPFunction=1,NRCellCU={row.postcell}'
        else:
            ext_id = F'auto310_410_3_{row.gnbid}'
            ext_cell_id = F'auto{int(row.gnbid) * (2 ** (36 - int(row.gnbidlength))) + int(row.cellid)}'
            ext_cell_mo = F'{self.nw_fdn},ExternalGNBCUCPFunction={ext_id},ExternalNRCellCU={ext_cell_id}'
        return [freq, relid, ext_id, ext_cell_id, ext_cell_mo]