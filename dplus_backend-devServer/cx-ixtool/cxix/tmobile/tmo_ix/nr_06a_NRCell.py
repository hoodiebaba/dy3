from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class nr_06a_NRCell(tmo_xml_base):
    def initialize_var(self):
        self.relative_path = [F'REMOTE_{self.node}', F'{self.__class__.__name__}_{self.node}.mos']
        if self.df_gnb_cell.loc[self.df_gnb_cell.addcell].shape[0] > 0:
            self.script_elements = self.create_mos_msg()

    def create_mos_msg(self):
        lines = []
        for _, row in self.df_gnb_cell.loc[self.df_gnb_cell.addcell].iterrows():
            lines.append(F'####:----------------> NRSectorCarrier, CommonBeamforming, NRCellDU & NRCellCU for {row.postcell} <----------------:####')
            self.motype = 'GNBDU'
            sc_ldn = F'GNBDUFunction=1,NRSectorCarrier={row.sc}'
            temp_dict = self.update_db_with_mo_for_siteid_and_fdn('NRSectorCarrier', row.presite, row.scfdn)
            temp_dict.update({
                'nRSectorCarrierId': row.sc,
                'administrativeState': '0 (LOCKED)',
                'arfcnDL': row.arfcndl,
                'arfcnUL': row.arfcnul,
                'bSChannelBwDL': int(int(row.bschannelbwdl)/1000),
                'bSChannelBwUL': int(int(row.bschannelbwul)/1000),
                'configuredMaxTxPower': row.confpow,
                'sectorEquipmentFunctionRef': F'NodeSupport=1,SectorEquipmentFunction={row.sef}',
            })
            lines.extend(self.create_mos_script_from_dict(temp_dict, 'NRSectorCarrier', sc_ldn))
            if str(row.postcell)[0] == 'A':
                temp_dict = self.update_db_with_mo_for_siteid_and_fdn('CommonBeamforming', row.presite, F'{row.scfdn},CommonBeamforming=1')
                temp_dict.update({'commonBeamformingId': '1'})
                lines.extend(self.create_mos_script_from_dict(temp_dict, 'CommonBeamforming', F'{sc_ldn},CommonBeamforming=1'))
           
            temp_dict = self.update_db_with_mo_for_siteid_and_fdn('NRCellDU', None, None)
            temp_dict.update({
                'administrativeState': '0 (LOCKED)',
                'cellBarred': '0 (BARRED)',
                'cellReservedForOperator': '0 (RESERVED)',
                'nRCellDUId': row.postcell,
                'cellLocalId': row.cellid,
                'nRPCI': row.nrpci,
                'nRSectorCarrierRef': sc_ldn,
                'nRTAC': row.nrtac,
                'rachRootSequence': row.rachrootsequence,
                'ssbFrequency': '0',
                'ssbSubCarrierSpacing': row.ssbsubcarrierspacing,
                'subCarrierSpacing': row.ssbsubcarrierspacing,
            })
            if int(row.rachrootsequence) > 137: temp_dict.update({'rachPreambleFormat': '0 (RACH_PREAMBLE_FORMAT_00)'})
            if row.arfcndl == row.arfcnul: temp_dict.update({'tddUlDlPattern': '1 (TDD_ULDL_PATTERN_01)',
                                                             'tddSpecialSlotPattern': '1 (TDD_SPECIAL_SLOT_PATTERN_01)'})
            lines.extend(self.create_mos_script_from_dict(temp_dict, 'NRCellDU', F'GNBDUFunction=1,NRCellDU={row.postcell}'))

            temp_dict = self.update_db_with_mo_for_siteid_and_fdn('AdditionalPLMNInfo', row.presite, row.scfdn)
            temp_dict.update({'additionalPLMNInfoId': '1', 'nRTAC': row.nrtac})
            lines.extend(self.create_mos_script_from_dict(temp_dict, 'AdditionalPLMNInfo', F'GNBDUFunction=1,NRCellDU={row.postcell},AdditionalPLMNInfo=1'))

            self.motype = 'GNBCUCP'
            temp_dict = self.update_db_with_mo_for_siteid_and_fdn('IntraFreqMCCellProfile', None, None)
            temp_dict.update({'intraFreqMCCellProfileId': row.postcell})
            lines.extend(self.create_mos_script_from_dict(temp_dict, 'IntraFreqMCCellProfile', F'GNBCUCPFunction=1,IntraFreqMC=1,IntraFreqMCCellProfile={row.postcell}'))

            # temp_dict = self.update_db_with_mo_for_siteid_and_fdn('IntraFreqMCCellProfileUeCfg', None, None)
            # temp_dict.update({'intraFreqMCCellProfileUeCfgId': 'Base'})
            # lines.extend(self.create_mos_script_from_dict(temp_dict, 'IntraFreqMCCellProfileUeCfg', F'GNBCUCPFunction=1,IntraFreqMC=1,IntraFreqMCCellProfile={row.postcell},IntraFreqMCCellProfileUeCfg=Base'))

            temp_dict = self.update_db_with_mo_for_siteid_and_fdn('McfbCellProfile',  None, None)
            temp_dict.update({'mcfbCellProfileId': row.postcell})
            lines.extend(self.create_mos_script_from_dict(temp_dict, 'McfbCellProfile', F'GNBCUCPFunction=1,Mcfb=1,McfbCellProfile={row.postcell}'))

            # temp_dict = self.update_db_with_mo_for_siteid_and_fdn('McfbCellProfileUeCfg', None, None)
            # temp_dict.update({'mcfbCellProfileUeCfgId': 'Base'})
            # lines.extend(self.create_mos_script_from_dict(temp_dict, 'McfbCellProfileUeCfg', F'GNBCUCPFunction=1,Mcfb=1,McfbCellProfile={row.postcell},McfbCellProfileUeCfg=Base'))
            
            lines.extend([
                F'ld GNBCUCPFunction=1,Mcfb=1,McfbCellProfile={row.postcell},McfbCellProfileUeCfg=Base',
                F'set GNBCUCPFunction=1,Mcfb=1,McfbCellProfile={row.postcell},McfbCellProfileUeCfg=Base$ epsFallbackOperation 2',
                F'set GNBCUCPFunction=1,Mcfb=1,McfbCellProfile={row.postcell},McfbCellProfileUeCfg=Base$ epsFallbackOperationEm 1',
                F'',
            ])
            
            temp_dict = self.update_db_with_mo_for_siteid_and_fdn('McpcPCellProfile',  None, None)
            temp_dict.update({'mcpcPCellProfileId': row.postcell})
            lines.extend(self.create_mos_script_from_dict(temp_dict, 'McpcPCellProfile', F'GNBCUCPFunction=1,Mcpc=1,McpcPCellProfile={row.postcell}'))

            # temp_dict = self.update_db_with_mo_for_siteid_and_fdn('McpcPCellProfileUeCfg', None, None)
            # temp_dict.update({'mcpcPCellProfileUeCfgId': 'Base'})
            # lines.extend(self.create_mos_script_from_dict(temp_dict, 'McpcPCellProfileUeCfg', F'GNBCUCPFunction=1,Mcpc=1,McpcPCellProfile={row.postcell},McpcPCellProfileUeCfg=Base'))

            temp_dict = self.update_db_with_mo_for_siteid_and_fdn('McpcPSCellProfile',  None, None)
            temp_dict.update({'mcpcPSCellProfileId': row.postcell})
            lines.extend(self.create_mos_script_from_dict(temp_dict, 'McpcPSCellProfile', F'GNBCUCPFunction=1,Mcpc=1,McpcPSCellProfile={row.postcell}'))

            # temp_dict = self.update_db_with_mo_for_siteid_and_fdn('McpcPSCellProfileUeCfg', None, None)
            # temp_dict.update({'mcpcPSCellProfileUeCfgId': 'Base'})
            # lines.extend(self.create_mos_script_from_dict(temp_dict, 'McpcPSCellProfileUeCfg', F'GNBCUCPFunction=1,Mcpc=1,McpcPSCellProfile={row.postcell},McpcPSCellProfileUeCfg=Base'))

            temp_dict = self.update_db_with_mo_for_siteid_and_fdn('UeMCCellProfile',  None, None)
            temp_dict.update({'ueMCCellProfileId': row.postcell})
            lines.extend(self.create_mos_script_from_dict(temp_dict, 'UeMCCellProfile', F'GNBCUCPFunction=1,UeMC=1,UeMCCellProfile={row.postcell}'))

            temp_dict = self.update_db_with_mo_for_siteid_and_fdn('NRCellCU', None, None)
            temp_dict.update({
                'nRCellCUId': row.postcell,
                'cellLocalId': row.cellid,
                'transmitSib2': 'false',
                'transmitSib4': 'false',
                'transmitSib5': 'false',
                'intraFreqMCCellProfileRef': F'GNBCUCPFunction=1,IntraFreqMC=1,IntraFreqMCCellProfile={row.postcell}',
                'mcfbCellProfileRef': F'GNBCUCPFunction=1,Mcfb=1,McfbCellProfile={row.postcell}',
                'mcpcPCellProfileRef': F'GNBCUCPFunction=1,Mcpc=1,McpcPCellProfile={row.postcell}',
                'mcpcPSCellProfileRef': F'GNBCUCPFunction=1,Mcpc=1,McpcPSCellProfile={row.postcell}',
                'ueMCCellProfileRef': F'GNBCUCPFunction=1,UeMC=1,UeMCCellProfile={row.postcell}',
                'nRFrequencyRef': '',
            })
            lines.extend(self.create_mos_script_from_dict(temp_dict, 'NRCellCU', F'GNBCUCPFunction=1,NRCellCU={row.postcell}'))

        lines.extend([
            F'####:----------------> Post Check <----------------:####',
            F'lt all',
            F'hget ^SectorCarrier|NRSectorCarrier= configuredMaxTxPower|noOf.xAntennas|sectorFunctionRef|reservedBy|arfcn|bSChannelBw',
            F'st sec',
            F'hget ^EUtranCell.DD|^NbIotCell|^NRCellDU [el]State|primaryPlmnReserved|cellBarred|sectorCarrierRef|^cellReservedForOperator$|'
            F'^cellid$|^cellLocalId$|^physicalLayerCellId$|^earfcndl$|^channelBandwidth$|^dlchannelBandwidth$|^earfcn$|sectorCarrierRef'
            F'|^cellReservedForOperator$',
            F'hget ^NRCellCU=.* ^cellLocalId$|^transmitSib|CellProfileRef',
            '',
            '',
        ])
        return lines + ['', '']
