import copy
import re
import pandas as pd
from .att_xml_base import att_xml_base


class co_ESS(att_xml_base):
    def create_rpc_msg(self):
        df_ess = pd.concat([self.df_enb_cell.copy().loc[((~self.df_enb_cell.esssclocalid.isna()) & (self.df_enb_cell.esssclocalid != '0'))],
                            self.df_gnb_cell.copy().loc[((~self.df_gnb_cell.esssclocalid.isna()) & (self.df_gnb_cell.esssclocalid != '0'))]],
                           ignore_index=True)
        df_ess = df_ess.merge(df_ess.groupby('esssclocalid')['essscpairid'].value_counts(sort=False).reset_index(name='freq'),
                              on=['esssclocalid', 'essscpairid'], how='left')
        if len(df_ess.index) == 0: return

        assert len(df_ess.index) == len(df_ess.loc[(df_ess.freq == 2)]), F'!!! esssclocalid & essscpairid missmap occured for site {self.node} !!!'
        for row in df_ess.groupby('esssclocalid')['essscpairid'].value_counts(sort=False).reset_index(name='freq').itertuples():
            row_lte = df_ess.loc[(df_ess.esssclocalid == row.esssclocalid) &
                                 (df_ess.essscpairid == row.essscpairid) & (df_ess.celltype == 'FDD')].iloc[0]
            row_nr = df_ess.loc[(df_ess.esssclocalid == row.esssclocalid) &
                                (df_ess.essscpairid == row.essscpairid) & (df_ess.celltype == '5G')].iloc[0]
            if row_lte.addcell or row_nr.addcell:
                self.mo_dict[F'ESS_EUtranCellFDD_{row_lte.postcell}_NRCellDU_{row_nr.postcell}'] = {
                    'managedElementId': self.node,
                    'ENodeBFunction': {
                        'eNodeBFunctionId': '1',
                        'EUtranCellFDD': {
                            'attributes': {'xc:operation': 'update'},
                            'eUtranCellFDDId': row_lte.postcell,
                            # 'administrativeState': '0 (LOCKED)'
                            'adjustCrsPowerEnhEnabled': 'false', 'ulSrsEnable': 'false', 'prsConfigIndex': '11',
                            'prsMutingPatternLen': '4', 'pdcchCfiMode': '5 (CFI_AUTO_MAXIMUM_3)', 'prescheduling': 'false',
                            'prsPeriod': '0 (PP160)', 'noConsecutiveSubframes': '0 (SF1)', 'prsPowerBoosting': '0',
                            'prsTransmisScheme': '0 (ANTENNA_SWITCHING)', 'dlInterferenceManagementActive': 'false',
                            'cellRange': '23', 'catm1SupportEnabled': 'false', 'ttiBundlingAtSetup': '0 (OFF)',
                            'CellSleepFunction': {'cellSleepFunctionId': '1', 'sleepMode': '0 (DEACTIVATED)'}
                        },
                        'SectorCarrier': {
                            'attributes': {'xc:operation': 'update'},
                            'sectorCarrierId': row_lte.sc,
                            'essScLocalId': row_lte.esssclocalid,
                            'essScPairId': row_lte.essscpairid,
                            'rfBranchTxRef': {'attributes': {'xc:operation': 'delete'}},
                            'rfBranchRxRef': {'attributes': {'xc:operation': 'delete'}}
                        }
                    },
                    'GNBDUFunction': {
                        'gNBDUFunctionId': '1',
                        'NRCellDU': {
                            'attributes': {'xc:operation': 'update'},
                            'nRCellDUId': row_nr.postcell,
                            # 'administrativeState': '0 (LOCKED)'
                            # 'cellBarred': '0 (BARRED)',
                            # 'cellReservedForOperator': '0 (RESERVED)'
                            'csiRsPeriodicity': '20',
                            'trsPeriodicity': '40',
                            'secondaryCellOnly': 'false',
                            'rachPreambleFormat': '2 (RACH_PREAMBLE_FORMAT_02)',
                            'ssbPeriodicity': '20',
                            'pdschStartPrbStrategy': '3 (RANDOM_START_WITHIN_BAND)',
                            'cellRange': '23000',
                            'csiRsConfig2P': {'aRestriction': {'attributes': {'xc:operation': 'delete'}}, 'csiRsControl2Ports': '0 (OFF)'},
                            'csiRsConfig4P': {'i11Restriction': 'FF', 'csiRsControl4Ports': '1 (TWO_ONE)'},
                            'csiRsConfig8P': {'i11Restriction': {'attributes': {'xc:operation': 'delete'}},
                                              'i12Restriction': {'attributes': {'xc:operation': 'delete'}}, 'csiRsControl8Ports': '0 (OFF)'},
                            'csiRsConfig16P': {'i11Restriction': {'attributes': {'xc:operation': 'delete'}},
                                               'i12Restriction': {'attributes': {'xc:operation': 'delete'}}, 'csiRsControl8Ports': '0 (OFF)'},
                            'csiRsConfig32P': {'i11Restriction': {'attributes': {'xc:operation': 'delete'}},
                                               'i12Restriction': {'attributes': {'xc:operation': 'delete'}}, 'csiRsControl8Ports': '0 (OFF)'},
                        },
                        'NRSectorCarrier': {
                            'nRSectorCarrierId': row_nr.sc,
                            'essScLocalId': row_nr.esssclocalid,
                            'essScPairId': row_nr.essscpairid,
                            # 'administrativeState': '0 (LOCKED)'
                        },
                    }
                }

        if len(self.mo_dict) == 0: return
        self.mo_dict[F'CapacityState_CXC4012411'] = {'managedElementId': self.node, 'SystemFunctions': {'systemFunctionsId': '1', 'Lm': {
            'lmId': '1', 'CapacityState': {
                'attributes': {'xc:operation': 'update'}, 'capacityStateId': 'CXC4012411', 'featureState': '1 (ACTIVATED)'}}}}
        for _ in ['CXC4011802', 'CXC4012218', 'CXC4012381', 'CXC4012543', 'CXC4012581', 'CXC4012583', ]:
            self.mo_dict[F'FeatureState_{_}'] = {'managedElementId': self.node, 'SystemFunctions': {'systemFunctionsId': '1', 'Lm': {
                'lmId': '1', 'FeatureState': {'attributes': {'xc:operation': 'update'}, 'featureStateId': _, 'featureState': '1 (ACTIVATED)'}}}}

        mos_ldn_dict, freq_list = {}, []
        # # LTE -- NR
        # SpectrumSharingFunction
        mos_ldn_dict['SpectrumSharingFunction'] = F'ENodeBFunction=1,SpectrumSharingFunction=1'
        freq_list += [mos_ldn_dict['SpectrumSharingFunction']]
        spe_mo = {'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1', 'SpectrumSharingFunction': {
            'spectrumSharingFunctionId': '1'}}}
        mo_dict = copy.deepcopy(spe_mo)
        mo_dict['ENodeBFunction']['SpectrumSharingFunction'] |= {'attributes': {'xc:operation': 'create'}}
        self.mo_dict[mos_ldn_dict['SpectrumSharingFunction']] = copy.deepcopy(mo_dict)
        # GUtraNetwork
        mos_ldn_dict['GUtraNetwork'] = F'ENodeBFunction=1,GUtraNetwork={self.enbdata["GUtraNetwork"]}'
        freq_list += [mos_ldn_dict['GUtraNetwork']]
        gnb_nw = {'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1'}}
        gnb_nw['ENodeBFunction']['GUtraNetwork'] = {'gUtraNetworkId': self.enbdata['GUtraNetwork']}
        mo_dict = copy.deepcopy(gnb_nw)
        mo_dict['ENodeBFunction']['GUtraNetwork'] |= {'attributes': {'xc:operation': 'create'}}
        self.mo_dict[mos_ldn_dict['GUtraNetwork']] = copy.deepcopy(mo_dict)
        # ExternalGNodeBFunction, TermPointToGNB
        ext_nw = copy.deepcopy(gnb_nw)
        gnb = self.node
        ext_id = F'{self.gnbdata["plmnlist"]["mcc"]}{self.gnbdata["plmnlist"]["mnc"]}-000000{self.gnbdata["nodeid"]}'
        mos_ldn_dict['ExternalGNodeBFunction'] = F'{mos_ldn_dict["GUtraNetwork"]},ExternalGNodeBFunction={gnb}'
        freq_list += [mos_ldn_dict['ExternalGNodeBFunction']]
        ext_nw['ENodeBFunction']['GUtraNetwork']['ExternalGNodeBFunction'] = {'externalGNodeBFunctionId': self.node}
        mo_dict = copy.deepcopy(ext_nw)
        mo_dict['ENodeBFunction']['GUtraNetwork']['ExternalGNodeBFunction'] |= {
            'attributes': {'xc:operation': 'create'}, 'gNodeBPlmnId':  self.gnbdata['plmnlist'], 'gNodeBId': self.gnbdata['nodeid'],
            'gNodeBIdLength': self.gnbdata['gnbidlength']}
        self.mo_dict[mos_ldn_dict['ExternalGNodeBFunction']] = copy.deepcopy(mo_dict)
        mo_dict = copy.deepcopy(ext_nw)
        mo_dict['ENodeBFunction']['GUtraNetwork']['ExternalGNodeBFunction']['TermPointToGNB'] = {
            'attributes': {'xc:operation': 'create'}, 'termPointToGNBId': self.node, 'administrativeState': '1 (UNLOCKED)',
            'ipAddress': '0.0.0.0', 'ipv6Address': self.gnbdata['lte_ip']
        }
        self.mo_dict[F'create_{mos_ldn_dict["ExternalGNodeBFunction"]},TermPointToGNB={gnb}'] = copy.deepcopy(mo_dict)
        mo_dict = copy.deepcopy(ext_nw)
        mo_dict['ENodeBFunction']['GUtraNetwork']['ExternalGNodeBFunction']['TermPointToGNB'] = {
            'attributes': {'xc:operation': 'update'}, 'termPointToGNBId': self.node, 'administrativeState': '1 (UNLOCKED)',
            'ipv6Address': self.gnbdata['lte_ip']
        }
        self.mo_dict[F'update_{mos_ldn_dict["ExternalGNodeBFunction"]},TermPointToGNB={gnb}'] = copy.deepcopy(mo_dict)

        # # NR -- LTE
        # EUtraNetwork
        mos_ldn_dict['EUtraNetwork'] = F'GNBCUCPFunction=1,EUtraNetwork={self.gnbdata["EUtraNetwork"]}'
        freq_list += [mos_ldn_dict['EUtraNetwork']]
        enb_nw = {'managedElementId': self.node, 'GNBCUCPFunction': {'gNBCUCPFunctionId': '1'}}
        enb_nw['GNBCUCPFunction']['EUtraNetwork'] = {'eUtraNetworkId': self.gnbdata['EUtraNetwork']}
        mo_dict = copy.deepcopy(enb_nw)
        mo_dict['GNBCUCPFunction']['EUtraNetwork'] |= {'attributes': {'xc:operation': 'create'}}
        self.mo_dict[mos_ldn_dict['EUtraNetwork']] = copy.deepcopy(mo_dict)
        # ExternalENodeBFunction, TermPointToGNB
        nr_ext_nw = copy.deepcopy(enb_nw)
        nr_ext_id = F'auto{self.gnbdata["plmnlist"]["mcc"]}_{self.gnbdata["plmnlist"]["mnc"]}_{self.gnbdata["plmnlist"]["mncLength"]}_{self.enbdata["nodeid"]}'
        enb = self.node
        mos_ldn_dict['ExternalENodeBFunction'] = F'{mos_ldn_dict["EUtraNetwork"]},ExternalENodeBFunction={enb}'
        freq_list += [mos_ldn_dict['ExternalENodeBFunction']]
        nr_ext_nw['GNBCUCPFunction']['EUtraNetwork']['ExternalENodeBFunction'] = {'externalENodeBFunctionId': enb}
        mo_dict = copy.deepcopy(nr_ext_nw)
        mo_dict['GNBCUCPFunction']['EUtraNetwork']['ExternalENodeBFunction'] |= {
            'attributes': {'xc:operation': 'create'},
            'pLMNId': {'mcc': self.enbdata['plmnlist']['mcc'], 'mnc': self.enbdata['plmnlist']['mnc']}, 'eNodeBId': self.enbdata['nodeid']}
        self.mo_dict[mos_ldn_dict['ExternalENodeBFunction']] = copy.deepcopy(mo_dict)
        mo_dict = copy.deepcopy(nr_ext_nw)
        mo_dict['GNBCUCPFunction']['EUtraNetwork']['ExternalENodeBFunction']['TermPointToENodeB'] = {
            'attributes': {'xc:operation': 'create'}, 'termPointToENodeBId': 'auto1', 'administrativeState': '1 (UNLOCKED)'}
        self.mo_dict[F'create_{mos_ldn_dict["ExternalENodeBFunction"]},TermPointToENodeB={gnb}'] = copy.deepcopy(mo_dict)
        mo_dict = copy.deepcopy(nr_ext_nw)
        mo_dict['GNBCUCPFunction']['EUtraNetwork']['ExternalENodeBFunction']['TermPointToENodeB'] = {
            'attributes': {'xc:operation': 'update'}, 'termPointToENodeBId': 'auto1', 'administrativeState': '1 (UNLOCKED)'}
        self.mo_dict[F'update_{mos_ldn_dict["ExternalENodeBFunction"]},TermPointToENodeB={gnb}'] = copy.deepcopy(mo_dict)
        # GUtranSyncSignalFrequency
        for row in df_ess.groupby('esssclocalid')['essscpairid'].value_counts(sort=False).reset_index(name='freq').itertuples():
            row_lte = df_ess.loc[(df_ess.esssclocalid == row.esssclocalid) & (df_ess.essscpairid == row.essscpairid) &
                                 (df_ess.celltype == 'FDD')].iloc[0]
            row_nr = df_ess.loc[(df_ess.esssclocalid == row.esssclocalid) & (df_ess.essscpairid == row.essscpairid) &
                                (df_ess.celltype == '5G')].iloc[0]
            # LTE-NR Relations
            self.motype = 'Lrat'
            band = '' if re.search(r'\d+', row_nr.freqband) is None else str(int(re.search(r'\d+', row_nr.freqband).group(0)))
            freq_id = F'{row_nr.ssbfrequency}-{row_nr.ssbsubcarrierspacing}'
            mos_ldn_dict['GUtranSyncSignalFrequency'] = F'{mos_ldn_dict["GUtraNetwork"]},GUtranSyncSignalFrequency={freq_id}'
            if mos_ldn_dict['GUtranSyncSignalFrequency'] not in freq_list:
                freq_list += [mos_ldn_dict['GUtranSyncSignalFrequency']]
                mo_dict = copy.deepcopy(gnb_nw)
                mo_dict['ENodeBFunction']['GUtraNetwork']['GUtranSyncSignalFrequency'] = \
                    self.get_mo_dict_from_moc_node_fdn_moid('GUtranSyncSignalFrequency', self.node, None, freq_id)
                mo_dict['ENodeBFunction']['GUtraNetwork']['GUtranSyncSignalFrequency'] |= {
                    'arfcn': row_nr.ssbfrequency, 'band': band, 'smtcDuration': row_nr.ssbduration, 'smtcOffset': row_nr.ssboffset,
                    'smtcPeriodicity': row_nr.ssbperiodicity, 'smtcScs': row_nr.ssbsubcarrierspacing}
                self.mo_dict[mos_ldn_dict['GUtranSyncSignalFrequency']] = copy.deepcopy(mo_dict)
            # ExternalGUtranCell
            ext_cell_id = F'{ext_id}-{row_nr.cellid}'
            mos_ldn_dict['ExternalGUtranCell'] = F'{mos_ldn_dict["ExternalGNodeBFunction"]},ExternalGUtranCell={ext_cell_id}'
            if mos_ldn_dict['ExternalGUtranCell'] not in freq_list:
                freq_list += [mos_ldn_dict['ExternalGUtranCell']]
                mo_dict = copy.deepcopy(ext_nw)
                mo_dict['ENodeBFunction']['GUtraNetwork']['ExternalGNodeBFunction']['ExternalGUtranCell'] = \
                    self.get_mo_dict_from_moc_node_fdn_moid('ExternalGUtranCell', self.node, None, ext_cell_id)
                mo_dict['ENodeBFunction']['GUtraNetwork']['ExternalGNodeBFunction']['ExternalGUtranCell'] |= {
                    'physicalLayerCellIdGroup': F'{int(row_nr.nrpci) // 3}',
                    'physicalLayerSubCellId': F'{int(row_nr.nrpci) % 3}',
                    'localCellId': row_nr.cellid,
                    'isRemoveAllowed': 'false',
                    'gUtranSyncSignalFrequencyRef': mos_ldn_dict['GUtranSyncSignalFrequency'],
                }
                self.mo_dict[mos_ldn_dict['ExternalGUtranCell']] = copy.deepcopy(mo_dict)
            # GUtranFreqRelation
            rel_id = '-'.join([row_nr[_] for _ in ['ssbfrequency', 'ssbsubcarrierspacing', 'ssbperiodicity', 'ssboffset', 'ssbduration']])
            mos_ldn_dict['GUtranFreqRelation'] = F'ENodeBFunction=1,EUtranCellFDD={row_lte.postcell},GUtranFreqRelation={rel_id}'
            freq_list += [mos_ldn_dict['GUtranFreqRelation']]
            mo_dict = self.get_mo_dict_from_moc_node_fdn_moid('GUtranFreqRelation', self.node, None, rel_id)
            mo_dict |= {'cellReselectionPriority': '-1', 'gUtranSyncSignalFrequencyRef': mos_ldn_dict['GUtranSyncSignalFrequency']}
            self.mo_dict[mos_ldn_dict['GUtranFreqRelation']] = {'managedElementId': self.node, 'ENodeBFunction': {
                'eNodeBFunctionId': '1', 'EUtranCellFDD': {'eUtranCellFDDId': row_lte.postcell, 'GUtranFreqRelation': copy.deepcopy(mo_dict)}}}
            # GUtranCellRelation
            mos_ldn_dict['GUtranCellRelation'] = F'{ mos_ldn_dict["GUtranFreqRelation"]},GUtranCellRelation={row_nr.postcell}'
            freq_list += [mos_ldn_dict['GUtranCellRelation']]
            mo_dict = self.get_mo_dict_from_moc_node_fdn_moid('GUtranCellRelation', self.node, None, row_nr.postcell)
            mo_dict |= {'essEnabled': 'true', 'isRemoveAllowed': 'false', 'neighborCellRef': mos_ldn_dict['ExternalGUtranCell']}
            self.mo_dict[mos_ldn_dict['GUtranCellRelation']] = {'managedElementId': self.node, 'ENodeBFunction': {
                'eNodeBFunctionId': '1', 'EUtranCellFDD': {'eUtranCellFDDId': row_lte.postcell, 'GUtranFreqRelation': {
                    'gUtranFreqRelationId': rel_id, 'GUtranCellRelation': copy.deepcopy(mo_dict)}}}}
            self.mo_dict[F'update_{mos_ldn_dict["GUtranCellRelation"]}'] = {'managedElementId': self.node, 'ENodeBFunction': {
                'eNodeBFunctionId': '1', 'EUtranCellFDD': {'eUtranCellFDDId': row_lte.postcell, 'GUtranFreqRelation': {
                    'gUtranFreqRelationId': rel_id, 'GUtranCellRelation': {
                        'attributes': {'xc:operation': 'update'}, 'gUtranCellRelationId': row_nr.postcell, 'essEnabled': 'true',
                        'isRemoveAllowed': 'false'}}}}}
            # SharingGroup
            mos_ldn_dict['SharingGroup'] = F'{ mos_ldn_dict["SpectrumSharingFunction"]},SharingGroup={row_lte.postcell}:{row_nr.postcell}'
            freq_list += [mos_ldn_dict['SharingGroup']]
            mo_dict = copy.deepcopy(spe_mo)
            mo_dict['ENodeBFunction']['SpectrumSharingFunction']['SharingGroup'] = \
                self.get_mo_dict_from_moc_node_fdn_moid('SharingGroup', self.node, None, F'{row_lte.postcell}:{row_nr.postcell}')
            mo_dict['ENodeBFunction']['SpectrumSharingFunction']['SharingGroup'] |= {
                'eUtranCellRef': F'ENodeBFunction=1,EUtranCellFDD={row_lte.postcell}', 'gUtranCellRelationRef': mos_ldn_dict['GUtranCellRelation']}
            self.mo_dict[mos_ldn_dict['SharingGroup']] = copy.deepcopy(mo_dict)
            # NR-LTE Relations
            # ExternalEUtranCell
            self.motype = 'GNBCUCP'
            mos_ldn_dict['ExternalEUtranCell'] = F'{mos_ldn_dict["ExternalENodeBFunction"]},ExternalEUtranCell={row_lte.postcell}'
            if mos_ldn_dict['ExternalEUtranCell'] not in freq_list:
                freq_list += [mos_ldn_dict['ExternalEUtranCell']]
                mo_dict = copy.deepcopy(nr_ext_nw)
                mo_dict['GNBCUCPFunction']['EUtraNetwork']['ExternalENodeBFunction']['ExternalEUtranCell'] = \
                    self.get_mo_dict_from_moc_node_fdn_moid('ExternalEUtranCell', self.node, None, row_lte.postcell)
                mo_dict['GNBCUCPFunction']['EUtraNetwork']['ExternalENodeBFunction']['ExternalEUtranCell'] |= {'cellLocalId': row_lte.cellid}
                self.mo_dict[mos_ldn_dict['ExternalEUtranCell']] = copy.deepcopy(mo_dict)

            mos_ldn_dict['EUtranCellRelation'] = F'GNBCUCPFunction=1,NRCellCU={row_nr.postcell},EUtranCellRelation={row_lte.postcell}'
            mo_dict = self.get_mo_dict_from_moc_node_fdn_moid('EUtranCellRelation', self.node, None, row_lte.postcell)
            mo_dict |= {'essEnabled': 'true', 'neighborCellRef': mos_ldn_dict['ExternalEUtranCell']}
            if mos_ldn_dict['EUtranCellRelation'] not in freq_list:
                freq_list += [mos_ldn_dict['EUtranCellRelation']]
                self.mo_dict[mos_ldn_dict['EUtranCellRelation']] = {'managedElementId': self.node, 'GNBCUCPFunction': {
                'gNBCUCPFunctionId': '1', 'NRCellCU': {'nRCellCUId': row_nr.postcell, 'EUtranCellRelation': copy.deepcopy(mo_dict)}}}
            self.mo_dict[F'update_{mos_ldn_dict["EUtranCellRelation"]}'] = {'managedElementId': self.node, 'GNBCUCPFunction': {
                'gNBCUCPFunctionId': '1', 'NRCellCU': {'nRCellCUId': row_nr.postcell, 'EUtranCellRelation': {
                    'attributes': {'xc:operation': 'update'}, 'eUtranCellRelationId': row_lte.postcell, 'essEnabled': 'true'}}}}
        # Write Script to File in Main_Folder/ESS
        for sc in ['ap', 'cli', 'cmedit']:
            self.relative_path[sc][0] = 'ESS_SCRIPT'
            del self.relative_path[sc][1]
