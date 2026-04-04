import copy
from .att_xml_base import att_xml_base


class nr_81_gnb_cell(att_xml_base):
    def create_rpc_msg(self):
        if len(self.df_gnb_cell.loc[self.df_gnb_cell.addcell].index) == 0: return
        nw_fdn = F'GNBCUCPFunction=1,NRNetwork={self.gnbdata.get("NRNetwork", "1")}'
        tmp_list = [{'attributes': {'xc:operation': 'update'}, 'nRCellDUId': row.postcell,
                     'pLMNIdList': [{'mcc': '310', 'mnc': '410'}, {'mcc': '313', 'mnc': '100'}]} for row in
                    self.df_gnb_cell.loc[~self.df_gnb_cell.addcell].itertuples()]
        if len(tmp_list) > 0:
            self.mo_dict['existing_NRCellDU_update'] = {'managedElementId': self.node, 'GNBDUFunction': {
                'gNBDUFunctionId': '1', 'NRCellDU': copy.deepcopy(tmp_list)}}

        # NRFrequency, NRSectorCarrier, NRCellDU & NRCellCU
        freq_list = []
        for row in self.df_gnb_cell.loc[self.df_gnb_cell.addcell].itertuples():
            self.motype = 'GNBDU'
            me_dict = {'managedElementId': self.node, 'GNBDUFunction': {'gNBDUFunctionId': '1'}}
            # NRSectorCarrier
            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('NRSectorCarrier', row.sc, row.fdn, row.postcell)
            tmp_dict |= {'nRSectorCarrierId': row.sc, 'arfcnDL': row.arfcndl, 'arfcnUL': row.arfcnul,
                         'bSChannelBwDL': row.bschannelbwdl, 'bSChannelBwUL': row.bschannelbwul, 'configuredMaxTxPower': row.confpow,
                         'sectorEquipmentFunctionRef': F'NodeSupport=1,SectorEquipmentFunction={row.sef}'}
            if row.fdn in [None, 'None', '', '""']:
                if row.freqband in ["N260", "N261", "N258"]:
                    tmp_list = str(row.postcell).split('_')
                    tmp_list = tmp_list[-1] if len(tmp_list) == 3 else tmp_list[-2]
                    if int(tmp_list) > 2: tmp_dict |= {'txDirection': '1 (DL)'}
            mo_dict = copy.deepcopy(me_dict)
            mo_dict['GNBDUFunction']['NRSectorCarrier'] = tmp_dict
            self.mo_dict[F'GNBDUFunction=1,NRSectorCarrier={row.sc}'] = copy.deepcopy(mo_dict)

            # NRCellDU
            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('NRCellDU', row.presite, row.fdn, row.postcell)
            tmp_dict |= {
                'nRCellDUId': row.postcell, 'administrativeState': '0 (LOCKED)', 'cellLocalId': row.cellid, 'nRPCI': row.nrpci, 'nRTAC': row.nrtac,
                'rachRootSequence': row.rachrootsequence, 'ssbFrequency': row.ssbfrequency, 'subCarrierSpacing': row.ssbsubcarrierspacing,
                'ssbSubCarrierSpacing': row.ssbsubcarrierspacing, 'ssbPeriodicity': row.ssbperiodicity, 'ssbDuration': row.ssbduration,
                'ssbOffset': row.ssboffset, 'userLabel': row.userlabel, 'nRSectorCarrierRef': F'GNBDUFunction=1,NRSectorCarrier={row.sc}'
            }
            if row.fdn in [None, 'None', '', '""']:
                if row.freqband in ["N005", "N012", "N014", "N029"]:
                    tmp_dict |= {'cellRange': '23000', 'endcUlNrQualHyst': '4', 'rachPreambleFormat': '2 (RACH_PREAMBLE_FORMAT_02)'}
                elif row.freqband in ["N260", "N261", "N258"]:
                    tmp_dict |= {
                        'cellRange': '1100', 'dftSOfdmMsg3Enabled': 'false', 'drxInactivityTimer': '7 (INACTIVITYTIMER_8MS)',
                        'drxLongCycle': '8 (LONGCYCLE_80MS)', 'drxOnDurationTimer': '38 (ONDURATIONTIMER_8MS)', 'endcDlNrLowQualThresh': '5',
                        'endcDlNrQualHyst': '5', 'endcUlNrLowQualThresh': '12', 'endcUlNrQualHyst': '5', 'maxUeSpeed': '0 (UP_TO_10KMPH)',
                        'pZeroNomPucch': '-110', 'pdschAllowedInDmrsSym': 'false', 'rachPreambleFormat': '3 (RACH_PREAMBLE_FORMAT_03)',
                        'secondaryCellOnly': 'true', 'trsPeriodicity': '20', 'ul256QamEnabled': 'false'
                    }
                elif row.freqband in ["N077"]:
                    tmp_dict |= {
                        'additionalPucchForCaEnabled': 'true', 'cellRange': '15000', 'dftSOfdmPuschStartRsrpThresh': '-104', 'pMax': '26',
                        'rachPreambleFormat': '0 (RACH_PREAMBLE_FORMAT_00)',
                        'sibType6': {'siBroadcastStatus': '0 (BROADCASTING)', 'siPeriodicity': '32'},
                        # 'sNSSAIList': {'sd': '16777215', 'sst': '1'},
                        'ssbPowerBoost': '6', 'tddSpecialSlotPattern': '3 (TDD_SPECIAL_SLOT_PATTERN_03)',
                        'tddUlDlPattern': '1 (TDD_ULDL_PATTERN_01)', 'advancedDlSuMimoEnabled': 'true',
                        'csiRsConfig16P': {'csiRsControl16Ports': '0 (OFF)', 'i11Restriction': '', 'i12Restriction': ''},
                        'csiRsConfig32P': {'csiRsControl32Ports': '1 (EIGHT_TWO_N1AZ)', 'i11Restriction': 'FFFFFFFF', 'i12Restriction': 'FF'},
                        'dlMaxMuMimoLayers': '8', 'ulMaxMuMimoLayers': '4', 'trsResourceShifting': '1 (ACTIVATED)',
                        # 'secondaryCellOnly': 'true',
                    }
                    if ('8863' in row.frutypecix) or ('4435' in row.frutypecix):
                        tmp_dict |= {'advancedDlSuMimoEnabled': 'false', 'csiRsConfig16P': '', 'csiRsConfig32P': '', 'dlMaxMuMimoLayers': '0',
                                     'ulMaxMuMimoLayers': '0', 'ssbPowerBoost': '0'}
            mo_dict = copy.deepcopy(me_dict)
            mo_dict['GNBDUFunction']['NRCellDU'] = tmp_dict
            self.mo_dict[F'GNBDUFunction=1,NRCellDU={row.postcell}'] = copy.deepcopy(mo_dict)

            # NRCellCU
            self.motype = 'GNBCUCP'
            me_dict = {'managedElementId': self.node, 'GNBCUCPFunction': {'gNBCUCPFunctionId': '1'}}
            mos_ldn_dict = {}
            freq_id, freq_mo_id, mos_list = self.get_nr_freq_rel_id_n_profile_mos(row)
            mos_ldn_dict['NRFrequency'] = F'{nw_fdn},NRFrequency={freq_id}'
            if mos_ldn_dict['NRFrequency'] in freq_list: pass
            elif self.no_eq_change_with_dcgk_flag and len(self.site.get_mos_w_end_str(mos_ldn_dict['NRFrequency'])) > 0:
                freq_list += [mos_ldn_dict['NRFrequency']]
            else:
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('NRFrequency', None, None, freq_id)
                tmp_dict |= {'nRFrequencyId': freq_id, 'arfcnValueNRDl': row.ssbfrequency, 'smtcDuration': row.ssbduration,
                             'smtcOffset': row.ssboffset, 'smtcPeriodicity': row.ssbperiodicity, 'smtcScs': row.ssbsubcarrierspacing}
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
                        tmp_dict |= self.update_rel_cug_profile(row.freqband, moc[2], tmp_dict)
                    mo_dict = copy.deepcopy(me_dict)
                    mo_dict['GNBCUCPFunction'][moc[0]] = {self.get_moc_id(moc[0]): '1', moc[1]: tmp_dict}
                    self.mo_dict[mos_ldn_dict[moc[1]]] = copy.deepcopy(mo_dict)
                    freq_list += [mos_ldn_dict[moc[1]]]

            mos_list = self.get_nr_cellcu_profile_mos(row)
            for moc in mos_list:
                mos_ldn_dict[moc[1]] = F'GNBCUCPFunction=1,{moc[0]}=1,{moc[1]}={row.postcell}'
                if mos_ldn_dict[moc[1]] in freq_list: pass
                elif self.no_eq_change_with_dcgk_flag and len(self.site.get_mos_w_end_str(mos_ldn_dict[moc[1]])) > 0:
                    freq_list += [mos_ldn_dict[moc[1]]]
                else:
                    tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid(moc[1], None, None, row.postcell)
                    tmp_dict |= {self.get_moc_id(moc[1]): row.postcell}
                    if len(moc) == 3:
                        tmp_dict[moc[2]] = self.get_mo_dict_from_moc_node_fdn_moid(moc[2], None, None, 'Base')
                        tmp_dict[moc[2]] |= {'attributes': {'xc:operation': 'create'}, self.get_moc_id(moc[2]): 'Base'}
                        freq_list += [mos_ldn_dict[moc[1]]]
                    mo_dict = copy.deepcopy(me_dict)
                    mo_dict['GNBCUCPFunction'][moc[0]] = {self.get_moc_id(moc[0]): '1', moc[1]: tmp_dict}
                    self.mo_dict[mos_ldn_dict[moc[1]]] = copy.deepcopy(mo_dict)

            if row.fdn is not None: cu_fdn = row.fdn.replace('GNBDUFunction=1,NRCellDU=', 'GNBCUCPFunction=1,NRCellCU=')
            else: cu_fdn = None
            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('NRCellCU', row.presite, cu_fdn, row.postcell)
            tmp_dict |= {
                'nRCellCUId': row.postcell, 'cellLocalId': row.cellid, 'primaryPLMNId': '',
                'mcfbCellProfileRef': mos_ldn_dict.get('McfbCellProfile', ''),
                'mcpcPCellProfileRef': mos_ldn_dict.get('McpcPCellProfile', ''),
                'mcpcPSCellProfileRef': mos_ldn_dict.get('McpcPSCellProfile', ''),
                'intraFreqMCCellProfileRef': mos_ldn_dict.get('IntraFreqMCCellProfile', ''),
                'nRFrequencyRef': mos_ldn_dict.get('NRFrequency', ''),
                'trStPSCellProfileRef': mos_ldn_dict.get('TrStPSCellProfile', ''),
                'trStSaCellProfileRef': mos_ldn_dict.get('TrStSaCellProfile', ''),
                'ueMCCellProfileRef': mos_ldn_dict.get('UeMCCellProfile', ''),
            }
            mo_dict = copy.deepcopy(me_dict)
            mo_dict['GNBCUCPFunction']['NRCellCU'] = tmp_dict
            self.mo_dict[F'GNBCUCPFunction=1,NRCellCU={row.postcell}'] = copy.deepcopy(mo_dict)

    @staticmethod
    def get_nr_cellcu_profile_mos(cell_row):
        """ :rtype: list """
        mos_list = [
            ('Mcpc', 'McpcPSCellProfile', 'McpcPSCellProfileUeCfg'),
            ('IntraFreqMC', 'IntraFreqMCCellProfile', 'IntraFreqMCCellProfileUeCfg'),
            ('TrafficSteering', 'TrStPSCellProfile', 'TrStPSCellProfileUeCfg'),
            ('TrafficSteering', 'TrStSaCellProfile', 'TrStSaCellProfileUeCfg'),
            ('UeMC', 'UeMCCellProfile'),
        ]
        if cell_row.freqband in ["N260", "N261", "N258"] and 'MC' in cell_row.carrier: mos_list = []
        elif cell_row.freqband in ['N077']:
            mos_list += [('Mcfb', 'McfbCellProfile', 'McfbCellProfileUeCfg'),
                         ('Mcpc', 'McpcPCellProfile', 'McpcPCellProfileUeCfg')]
        return mos_list
