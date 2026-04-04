import copy
from .att_xml_base import att_xml_base


class lte_51_enb_cell(att_xml_base):
    def create_rpc_msg(self):
        self.motype = 'Lrat'
        celltype_dict = {'FDD': 'EUtranCellFDD', 'TDD': 'EUtranCellTDD', 'IOT': 'NbIotCell'}
        self.enb_dict = {'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1'}}
        B14_USID = len(self.usid.df_enb_cell.loc[self.usid.df_enb_cell.freqband == '14'].index) > 0
        # maxNoOfPagingRecords for Paging=1
        site_records, cal_ecords = '3', self.paging_max_records()
        if self.site and self.enbdata.get('Lrat'):
            mo = self.site.find_mo_ending_with_parent_str('Paging', self.enbdata.get('Lrat', ''))
            if len(mo) > 0: site_records = self.site.site_extract_data(mo[0]).get('maxNoOfPagingRecords', '')
        if site_records != cal_ecords and len(self.df_enb_cell.loc[self.df_enb_cell.addcell].index) > 0:
            mo_dict = copy.deepcopy(self.enb_dict)
            mo_dict['ENodeBFunction']['Paging'] = {'attributes': {'xc:operation': 'update'}, 'pagingId': '1', 'maxNoOfPagingRecords': str(cal_ecords)}
            self.mo_dict[F'Paging=1_maxNoOfPagingRecords'] = copy.deepcopy(mo_dict)
        # --- SectorCarrier ---
        for row in self.df_enb_cell.loc[self.df_enb_cell.addcell].itertuples():
            if row.celltype not in ['FDD', 'TDD']: continue
            row_rx = [F'Equipment=1,AntennaUnitGroup={row_ant.raug},RfBranch={row_ant.rfb}' for row_ant in self.usid.df_ant.loc[
                (self.usid.df_ant.postsite == self.node) & (self.usid.df_ant.postcell == row.postcell)].itertuples()]
            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('SectorCarrier', row.presite, row.scfdn, row.sc)
            tmp_dict |= {
                'configuredMaxTxPower': row.confpow,
                'noOfRxAntennas': row.noofrx if int(row.freqband) != 46 else '1',
                'noOfTxAntennas': row.nooftx,
                'sectorFunctionRef': F'NodeSupport=1,SectorEquipmentFunction={row.sef}',
                'rfBranchRxRef': row_rx[:int(row.noofrx)] if int(row.freqband) != 46 else '',
                'rfBranchTxRef': row_rx[:int(row.nooftx)],
            }
            mo_dict = copy.deepcopy(self.enb_dict)
            mo_dict['ENodeBFunction']['SectorCarrier'] = copy.deepcopy(tmp_dict)
            self.mo_dict[F'ENodeBFunction=1,SectorCarrier={row.sc}'] = copy.deepcopy(mo_dict)
        # --- New EUtranCellFDD, EUtranCellTDD & NbIotCell ---
        for row in self.df_enb_cell.loc[self.df_enb_cell.addcell].itertuples():
            moc = celltype_dict.get(row.celltype)
            mo_fdn = F'ENodeBFunction=1,{moc}={row.postcell}'
            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid(moc, row.presite, row.fdn, row.postcell)
            if row.celltype == 'FDD':
                tmp_dict |= {
                    'eUtranCellFDDId': row.postcell,
                    'administrativeState': '0 (LOCKED)',
                    'cellRange': row.cellrange,
                    'cellId': row.cellid,
                    'earfcndl': row.earfcndl,
                    'earfcnul': row.earfcnul,
                    'dlChannelBandwidth': row.dlchannelbandwidth,
                    'ulChannelBandwidth': row.ulchannelbandwidth,
                    'physicalLayerCellIdGroup': int(row.physicallayercellid) // 3,
                    'physicalLayerSubCellId': int(row.physicallayercellid) % 3,
                    'rachRootSequence': row.rachrootsequence,
                    'tac': row.tac,
                    'isDlOnly': row.isdlonly,
                    'userLabel': row.userlabel,
                    'sectorCarrierRef': F'ENodeBFunction=1,SectorCarrier={row.sc}',
                }
                if row.fdn in [None, 'None', '']:
                    if B14_USID: tmp_dict |= {'diffAdmCtrlFilteringProfRef': F'ENodeBFunction=1,AdmissionControl=1,DiffAdmCtrlFilteringProfile=1',
                                              'ptmCellProfileRef': F'ENodeBFunction=1,PtmFunction=1,PtmCellProfile=2'}
                    if row.freqband == '4': tmp_dict |= {'mfbiFreqBandIndPrio': 'true'}
                    if row.noofrx == '0': tmp_dict |= {'endcAllowedPlmnList': '', 'maxNoClusteredPuschAlloc': '0'}
                    if int(row.dlchannelbandwidth) < 5000: tmp_dict |= {'estCellCapUsableFraction': '10', 'noConsecutiveSubframes': '1 (SF2)',
                                                                        'systemInformationBlock6': {"tReselectionUtra": "2",
                                                                                                    "tReselectionUtraSfHigh": "100",
                                                                                                    "tReselectionUtraSfMedium": "100"}}
                    if row.freqband == '30':
                        tmp_dict |= {'networkSignallingValue': '21 (NS_21)', 'ailgAutoRestartEnabled': 'true',
                                     'ailgRef': 'ENodeBFunction=1,AirIfLoadProfile=4'}
                    elif row.freqband == '14':
                        tmp_dict |= {
                            'arpPriorityLevelForSPIFHo': ['false', 'false', 'false', 'false', 'false', 'false', 'false', 'true',
                                                          'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'],
                            'networkSignallingValue': '6 (NS_06)', 'highBasebandPriority': 'true', 'ulTrigActive': 'false',
                            'lbEUtranAcceptOffloadThreshold': '70', 'lbEUtranTriggerOffloadThreshold': '140', 'loadBasedCaEnabled': 'true',
                            'qRxLevMin': '-128', 'pMaxServingCell': '1000', 'servOrPrioIFHoSetupBearer': 'true', 'threshServingLow': '10',
                            'servOrPrioTriggeredIFHo': '1 (ARP)', 'primaryUpperLayerInd': '0 (OFF)', 'prioHpueCapability': '1 (PRIORITIZE_IN_CA)',
                            'loadBasedCaMsrThr': {
                                'cceUtilThreshHigh': '45', 'cceUtilThreshLow': '30', 'dlPrbUtilThreshHigh': '45', 'dlPrbUtilThreshLow': '30',
                                'dlSeUtilThreshHigh': '45', 'dlSeUtilThreshLow': '30', 'ulPrbUtilThreshHigh': '45', 'ulPrbUtilThreshLow': '30',
                                'ulSeUtilThreshHigh': '45', 'ulSeUtilThreshLow': '30'},
                            'measCellGroupUeRef': 'ENodeBFunction=1,MeasCellGroup=1',
                            'ptmCellProfileRef': 'ENodeBFunction=1,PtmFunction=1,PtmCellProfile=1',
                        }
                    # FWLL
                    if row.postcell[-2] == '_L':
                        tmp_dict |= {'plmn1AbConfProfileRef': '', 'plmn2AbConfProfileRef': ''}
            elif row.celltype == 'TDD':
                tmp_dict |= {
                    'eUtranCellTDDId': row.postcell,
                    'administrativeState': '0 (LOCKED)',
                    'cellRange': row.cellrange,
                    'cellId': row.cellid,
                    'earfcn': row.earfcndl,
                    'channelBandwidth': row.dlchannelbandwidth,
                    'physicalLayerCellIdGroup': F'{int(row.physicallayercellid) // 3}',
                    'physicalLayerSubCellId': F'{int(row.physicallayercellid) % 3}',
                    'rachRootSequence': row.rachrootsequence,
                    'tac': row.tac,
                    'isDlOnly': row.isdlonly,
                    'userLabel': row.userlabel,
                    'sectorCarrierRef': F'ENodeBFunction=1,SectorCarrier={row.sc}',
                    'isLaa': 'false',
                }
                if int(row.freqband) == 46: tmp_dict |= {'isDlOnly': 'true', 'isLaa': 'true'}
            elif row.celltype == 'IOT':
                tmp_dict |= {
                    'administrativeState': '0 (LOCKED)',
                    'nbIotCellId': row.postcell,
                    'cellId': row.cellid,
                    'nbIotCellType': row.nbiotcelltype,
                    'tac': row.tac,
                    'earfcndl': row.earfcndl,
                    'earfcnul': row.earfcnul,
                    'physicalLayerCellId': row.physicallayercellid,
                    'eutranCellRef': F'ENodeBFunction=1,EUtranCellFDD={row.postcellref}',
                    'userLabel': '',
                    # 'sectorCarrierRef': F'ENodeBFunction=1,SectorCarrier={row.sc}',
                }
            mo_dict = copy.deepcopy(self.enb_dict)
            mo_dict['ENodeBFunction'][moc] = copy.deepcopy(tmp_dict)
            self.mo_dict[mo_fdn] = copy.deepcopy(mo_dict)
