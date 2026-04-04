import copy
from .att_xml_base import att_xml_base


class nr_82_gnb_relation(att_xml_base):
    def create_rpc_msg(self):
        if len(self.df_gnb_cell.loc[self.df_gnb_cell.addcell].index) == 0: return
        self.motype = 'GNBCUCP'
        me_dict = {'managedElementId': self.node, 'GNBCUCPFunction': {'gNBCUCPFunctionId': '1'}}
        nw_fdn = F'GNBCUCPFunction=1,NRNetwork={self.gnbdata.get("NRNetwork", "1")}'
        freq_list = []
        cell_mask = (~((self.df_gnb_cell.freqband.str.contains('N260|N261|N258')) & (self.df_gnb_cell.carrier.str.contains('MC'))))
        for freq in self.df_gnb_cell.loc[cell_mask].groupby(['ssbfrequency'], sort=False, as_index=False).head(1).itertuples():
            mos_ldn_dict = {}
            freq_id, freq_mo_id, mos_list = self.get_nr_freq_rel_id_n_profile_mos(freq)
            mos_ldn_dict['NRFrequency'] = F'{nw_fdn},NRFrequency={freq_id}'
            if mos_ldn_dict['NRFrequency'] in freq_list: pass
            elif self.no_eq_change_with_dcgk_flag and len(self.site.get_mos_w_end_str(mos_ldn_dict['NRFrequency'])) > 0:
                freq_list += [mos_ldn_dict['NRFrequency']]
            else:
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('NRFrequency', None, None, freq_id)
                tmp_dict |= {'nRFrequencyId': freq_id, 'arfcnValueNRDl': freq.ssbfrequency, 'smtcDuration': freq.ssbduration,
                             'smtcOffset': freq.ssboffset, 'smtcPeriodicity': freq.ssbperiodicity, 'smtcScs': freq.ssbsubcarrierspacing}
                mo_dict = copy.deepcopy(me_dict)
                mo_dict['GNBCUCPFunction']['NRNetwork'] = {'nRNetworkId': self.gnbdata.get("NRNetwork", "1"), 'NRFrequency': copy.deepcopy(tmp_dict)}
                self.mo_dict[mos_ldn_dict['NRFrequency']] = copy.deepcopy(mo_dict)
                freq_list += [mos_ldn_dict['NRFrequency']]
            for moc in mos_list:
                mos_ldn_dict[moc[1]] = F'GNBCUCPFunction=1,{moc[0]}=1,{moc[1]}={freq_mo_id}'
                if mos_ldn_dict[moc[1]] in freq_list: pass
                if self.no_eq_change_with_dcgk_flag and len(self.site.get_mos_w_end_str(mos_ldn_dict[moc[1]])) > 0:
                    freq_list += [mos_ldn_dict[moc[1]]]
                else:
                    tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid(moc[1], None, None, freq_mo_id)
                    tmp_dict |= {self.get_moc_id(moc[1]): freq_mo_id}
                    if len(moc) == 3:
                        tmp_dict[moc[2]] = self.get_mo_dict_from_moc_node_fdn_moid(moc[2], None, None, 'Base')
                        tmp_dict[moc[2]] |= {'attributes': {'xc:operation': 'create'}, self.get_moc_id(moc[2]): 'Base'}
                        tmp_dict |= self.update_rel_cug_profile(freq.freqband, moc[2], tmp_dict)
                    mo_dict = copy.deepcopy(me_dict)
                    mo_dict['GNBCUCPFunction'][moc[0]] = {self.get_moc_id(moc[0]): '1', moc[1]: tmp_dict}
                    self.mo_dict[mos_ldn_dict[moc[1]]] = copy.deepcopy(mo_dict)
                    freq_list += [mos_ldn_dict[moc[1]]]
            # NRFreqRelation
            for row in self.df_gnb_cell.loc[cell_mask].itertuples():
                mos_ldn_dict['NRFreqRelation'] = F'GNBCUCPFunction=1,NRCellCU={row.postcell},NRFreqRelation={freq_mo_id}'
                if mos_ldn_dict['NRFreqRelation'] in freq_list: pass
                elif self.no_eq_change_with_dcgk_flag and len(self.site.get_mos_w_end_str(mos_ldn_dict['NRFreqRelation'])) > 0:
                    freq_list += [mos_ldn_dict['NRFreqRelation']]
                else:
                    tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('NRFreqRelation', None, None, freq_mo_id)
                    tmp_dict |= {
                        'nRFreqRelationId': freq_mo_id,
                        'nRFrequencyRef': mos_ldn_dict.get('NRFrequency', ''),
                        'mcpcPSCellNrFreqRelProfileRef': mos_ldn_dict.get('McpcPSCellNrFreqRelProfile', ''),
                        'ueMCNrFreqRelProfileRef': mos_ldn_dict.get('UeMCNrFreqRelProfile', ''),
                        'mcpcPCellNrFreqRelProfileRef': mos_ldn_dict.get('McpcPCellNrFreqRelProfile', ''),
                        'trStSaNrFreqRelProfileRef': mos_ldn_dict.get('TrStSaNrFreqRelProfile', ''),
                    }
                    mo_dict = copy.deepcopy(me_dict)
                    mo_dict['GNBCUCPFunction']['NRCellCU'] = {'nRCellCUId': row.postcell, 'NRFreqRelation': tmp_dict}
                    self.mo_dict[mos_ldn_dict['NRFreqRelation']] = copy.deepcopy(mo_dict)
                    freq_list += [mos_ldn_dict['NRFreqRelation']]
                    # NRCellRelation
                    for row_t in self.df_gnb_cell.loc[(cell_mask & (self.df_gnb_cell.ssbfrequency == freq.ssbfrequency))].itertuples():
                        if row.postcell == row_t.postcell: continue
                        cell_rel_id = row_t.postcell
                        mos_ldn_dict['NRCellRelation'] = F'GNBCUCPFunction=1,NRCellCU={row.postcell},NRCellRelation={cell_rel_id}'
                        if mos_ldn_dict['NRCellRelation'] in freq_list: pass
                        elif self.no_eq_change_with_dcgk_flag and len(self.site.get_mos_w_end_str(mos_ldn_dict['NRCellRelation'])) > 0:
                            freq_list += [mos_ldn_dict['NRCellRelation']]
                        else:
                            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('NRCellRelation', None, None, cell_rel_id)
                            tmp_dict |= {
                                'nRCellRelationId': cell_rel_id,
                                'nRCellRef': F'GNBCUCPFunction=1,NRCellCU={row_t.postcell}',
                                'nRFreqRelationRef': mos_ldn_dict.get('NRFreqRelation', ''),
                            }
                            mo_dict = copy.deepcopy(me_dict)
                            mo_dict['GNBCUCPFunction']['NRCellCU'] = {'nRCellCUId': row.postcell, 'NRCellRelation': tmp_dict}
                            self.mo_dict[mos_ldn_dict['NRCellRelation']] = copy.deepcopy(mo_dict)
                            freq_list += [mos_ldn_dict['NRCellRelation']]
        # N260, N261, N258 Relations for multi-Carrir
        cell_mask = ((self.df_gnb_cell.addcell) & (self.df_gnb_cell.freqband.str.contains('N260|N261|N258')))
        for row in self.df_gnb_cell.loc[(cell_mask & (~self.df_gnb_cell.carrier.str.contains('MC')))].itertuples():
            for freq in self.df_gnb_cell.loc[(cell_mask & (self.df_gnb_cell.carrier.str.contains(row.carrier)))].itertuples():
                mos_ldn_dict = {}
                freq_id, freq_mo_id, mos_list = self.get_nr_freq_rel_id_n_profile_mos(freq)
                mos_ldn_dict['NRFrequency'] = F'{nw_fdn},NRFrequency={freq_id}'
                if mos_ldn_dict['NRFrequency'] in freq_list: pass
                elif self.no_eq_change_with_dcgk_flag and len(self.site.get_mos_w_end_str(mos_ldn_dict['NRFrequency'])) > 0:
                    freq_list += [mos_ldn_dict['NRFrequency']]
                else:
                    tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('NRFrequency', None, None, freq_id)
                    tmp_dict |= {'nRFrequencyId': freq_id, 'arfcnValueNRDl': freq.ssbfrequency, 'smtcDuration': freq.ssbduration,
                                 'smtcOffset': freq.ssboffset, 'smtcPeriodicity': freq.ssbperiodicity, 'smtcScs': freq.ssbsubcarrierspacing}
                    mo_dict = copy.deepcopy(me_dict)
                    mo_dict['GNBCUCPFunction']['NRNetwork'] = {'nRNetworkId': self.gnbdata.get("NRNetwork", "1"),
                                                               'NRFrequency': copy.deepcopy(tmp_dict)}
                    self.mo_dict[mos_ldn_dict['NRFrequency']] = copy.deepcopy(mo_dict)
                    freq_list += [mos_ldn_dict['NRFrequency']]
                for moc in mos_list:
                    mos_ldn_dict[moc[1]] = F'GNBCUCPFunction=1,{moc[0]}=1,{moc[1]}={freq_mo_id}'
                    if mos_ldn_dict[moc[1]] in freq_list: pass
                    if self.no_eq_change_with_dcgk_flag and len(self.site.get_mos_w_end_str(mos_ldn_dict[moc[1]])) > 0:
                        freq_list += [mos_ldn_dict[moc[1]]]
                    else:
                        tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid(moc[1], None, None, freq_mo_id)
                        tmp_dict |= {self.get_moc_id(moc[1]): freq_mo_id}
                        if len(moc) == 3:
                            tmp_dict[moc[2]] = self.get_mo_dict_from_moc_node_fdn_moid(moc[2], None, None, 'Base')
                            tmp_dict[moc[2]] |= {'attributes': {'xc:operation': 'create'}, self.get_moc_id(moc[2]): 'Base'}
                            tmp_dict |= self.update_rel_cug_profile(row.freqband, moc[2], tmp_dict)
                        mo_dict = copy.deepcopy(me_dict)
                        mo_dict['GNBCUCPFunction'][moc[0]] = {self.get_moc_id(moc[0]): '1', moc[1]: tmp_dict}
                        self.mo_dict[mos_ldn_dict[moc[1]]] = copy.deepcopy(mo_dict)
                        freq_list += [mos_ldn_dict[moc[1]]]
                # NRFreqRelation
                mos_ldn_dict['NRFreqRelation'] = F'GNBCUCPFunction=1,NRCellCU={row.postcell},NRFreqRelation={freq_mo_id}'
                if mos_ldn_dict['NRFreqRelation'] in freq_list: pass
                elif self.no_eq_change_with_dcgk_flag and len(self.site.get_mos_w_end_str(mos_ldn_dict['NRFreqRelation'])) > 0:
                    freq_list += [mos_ldn_dict['NRFreqRelation']]
                else:
                    tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('NRFreqRelation', None, None, freq_mo_id)
                    tmp_dict |= {
                        'nRFreqRelationId': freq_mo_id,
                        'nRFrequencyRef': mos_ldn_dict.get('NRFrequency', ''),
                        'mcpcPSCellNrFreqRelProfileRef': mos_ldn_dict.get('McpcPSCellNrFreqRelProfile', ''),
                        'ueMCNrFreqRelProfileRef': mos_ldn_dict.get('UeMCNrFreqRelProfile', ''),
                        'mcpcPCellNrFreqRelProfileRef': mos_ldn_dict.get('McpcPCellNrFreqRelProfile', ''),
                        'trStSaNrFreqRelProfileRef': mos_ldn_dict.get('TrStSaNrFreqRelProfile', ''),
                    }
                    mo_dict = copy.deepcopy(me_dict)
                    mo_dict['GNBCUCPFunction']['NRCellCU'] = {'nRCellCUId': row.postcell, 'NRFreqRelation': tmp_dict}
                    self.mo_dict[mos_ldn_dict['NRFreqRelation']] = copy.deepcopy(mo_dict)
                    freq_list += [mos_ldn_dict['NRFreqRelation']]
                # NRCellRelation
                if row.postcell == freq.postcell: continue
                cell_rel_id = freq.postcell
                mos_ldn_dict['NRCellRelation'] = F'GNBCUCPFunction=1,NRCellCU={row.postcell},NRCellRelation={cell_rel_id}'
                if mos_ldn_dict['NRCellRelation'] in freq_list: pass
                elif self.no_eq_change_with_dcgk_flag and len(self.site.get_mos_w_end_str(mos_ldn_dict['NRCellRelation'])) > 0:
                    freq_list += [mos_ldn_dict['NRCellRelation']]
                else:
                    tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('NRCellRelation', None, None, cell_rel_id)
                    tmp_dict |= {
                        'nRCellRelationId': cell_rel_id,
                        'nRCellRef': F'GNBCUCPFunction=1,NRCellCU={freq.postcell}',
                        'nRFreqRelationRef': mos_ldn_dict.get('NRFreqRelation', ''),
                        'coverageIndicator': '2 (OVERLAP)',
                        'sCellCandidate': '1 (ALLOWED)',
                    }
                    mo_dict = copy.deepcopy(me_dict)
                    mo_dict['GNBCUCPFunction']['NRCellCU'] = {'nRCellCUId': row.postcell, 'NRCellRelation': tmp_dict}
                    self.mo_dict[mos_ldn_dict['NRCellRelation']] = copy.deepcopy(mo_dict)
                    freq_list += [mos_ldn_dict['NRCellRelation']]
