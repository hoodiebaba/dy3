from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class nr_10a_EUtranRelation(tmo_xml_base):
    def initialize_var(self):
        self.relative_path = [F'REMOTE_{self.node}', F'{self.__class__.__name__}_{self.node}.mos']
        if self.usid.df_enb_cell.shape[0] > 0:
            self.script_elements.extend(self.activity_check('Pre'))
            self.script_elements.extend(self.eutran_relations())
            self.script_elements.extend(self.east_parameter_for_n19())
            self.script_elements.extend(self.activity_check('Post'))

    def market_guidelines_to_not_cr_nr_lte_relations(self, row):
        if row is None: row = {}
        rel_flag = False
        # if self.client.mname in self.market_dict.get('ncal', ''):
        #     if row.earfcndl in ['1000', '2300', '5035', '68661', '68611']:
        #         rel_flag = True
        if self.client.mname in self.market_dict.get('tri_la', '') + self.market_dict.get('ncal', ''):
            if (row.get("celltype", "") in ['TDD']) or \
                    (row.get("postcell", "").upper().startswith('B') and row.get("postcell", "A")[-1] in ['2', '3', '4', '5']):
                rel_flag = True
        return rel_flag

    def eutran_relations(self):
        gutran_ldn = F'GNBCUCPFunction=1,EUtraNetwork={self.gnbdata.get("EUtraNetwork")}'
        allowed_bw_dict = {3000: 15, 5000: 25, 10000: 50, 15000: 75, 20000: 100}

        lines = [
            F'####:----------------> NR_to_LTE_Relations --- EUtraNetwork, EUtranFrequency,EUtranFreqRelation <----------------:####',
            F'pr {gutran_ldn}$',
            F'if $nr_of_mos = 0',
            F'cr {gutran_ldn}',
            F'fi'
            F'',
            F'',
        ]
        if self.client.mname in self.market_dict.get('ncal', ''):
            lines += [
                F'#############################################################################################',
                F'#### Market Guideline -- No NR to LTE Relations for TDD, L1900 2nd Carrier in Tri-LA and NCAL Market',
                F'#############################################################################################',
                '',
            ]
        
        freq_list = []
        for _, row in self.usid.df_enb_cell.loc[self.usid.df_enb_cell.celltype.isin(['FDD', 'TDD'])][
                ['postcell', 'earfcndl', 'dlchannelbandwidth', 'freqband', 'celltype']].drop_duplicates(subset=["earfcndl"]).iterrows():
            if self.market_guidelines_to_not_cr_nr_lte_relations(row): continue
            UeMCEUtra = F'GNBCUCPFunction=1,UeMC=1,UeMCEUtranFreqRelProfile={row.earfcndl}'
            McpcPCellEUtran = F'GNBCUCPFunction=1,Mcpc=1,McpcPCellEUtranFreqRelProfile={row.earfcndl}'
            lines.extend([
                F'pr {gutran_ldn},EUtranFrequency={row.earfcndl}$',
                F'if $nr_of_mos = 0',
                F'  crn {gutran_ldn},EUtranFrequency={row.earfcndl}',
                F'  arfcnValueEUtranDl {row.earfcndl}',
                F'  end',
                F'fi',
                F'pr {UeMCEUtra}$',
                F'if $nr_of_mos = 0',
                F'  crn {UeMCEUtra}',
                F'  ueConfGroupType 0',
                F'  end',
                F'fi',
                F'pr {McpcPCellEUtran}$',
                F'if $nr_of_mos = 0',
                F'  crn {McpcPCellEUtran}',
                F'  ueConfGroupType 0',
                F'  end',
                F'fi',
                F'',
            ])
       
        for enb in self.usid.enodeb.keys():
            enbid = self.usid.enodeb.get(enb, {}).get("nodeid", "")
            ext_enb = F'{gutran_ldn},ExternalENodeBFunction=auto310_260_3_{enbid}'
            lines.extend([
                F'####:---- ExternalENodeBFunction, TermPointToENodeB & ExternalEUtranCell  for eNodeB {enb} ----:####',
                F'pr {ext_enb}$',
                F'if $nr_of_mos = 0',
                F'  crn {ext_enb}',
                F'  eNodeBId {enbid}',
                F'  isRemoveAllowed false',
                F'  pLMNId mcc=310,mnc=260',
                F'  end',
                F'fi',
                F'ld {ext_enb},TermPointToENodeB=auto1',
                F'pr {ext_enb},TermPointToENodeB=auto1$',
                F'if $nr_of_mos = 0',
                F'  crn {ext_enb},TermPointToENodeB=auto1',
                F'  administrativeState 1',
                F'  ipsecEpAddress',
                F'  upIpAddress',
                F'  end',
                F'fi',
                F''
            ])
            for _, row in self.usid.df_enb_cell.loc[self.usid.df_enb_cell.celltype.isin(['FDD', 'TDD']) & (self.usid.df_enb_cell.enbid == enbid)][
                    ['postcell', 'celltype', 'enbid', 'cellid', 'earfcndl', 'dlchannelbandwidth', 'physicallayercellid', 'tac']].iterrows():
                if self.market_guidelines_to_not_cr_nr_lte_relations(row): continue
                lines.extend([
                    F'pr {ext_enb},ExternalEUtranCell=310260-{enbid}-{row.cellid}$',
                    F'if $nr_of_mos = 0',
                    F'  crn {ext_enb},ExternalEUtranCell=310260-{enbid}-{row.cellid}',
                    F'  cellLocalId {row.cellid}',
                    F'  eUtranFrequencyRef {gutran_ldn},EUtranFrequency={row.earfcndl}',
                    F'  physicalLayerCellId {row.physicallayercellid}',
                    F'  tac {row.tac}',
                    F'  end',
                    F'fi',
                    F'',
                ])
            lines.extend([F'', F'', F''])
        
        for _, row in self.usid.df_enb_cell.loc[self.usid.df_enb_cell.celltype.isin(['FDD', 'TDD'])][
                ['postcell', 'earfcndl', 'dlchannelbandwidth', 'freqband', 'celltype']].drop_duplicates(subset=["earfcndl"]).iterrows():
            if self.market_guidelines_to_not_cr_nr_lte_relations(row): continue
            all_bw = allowed_bw_dict.get(int(row.dlchannelbandwidth), 25)
            resel_prio = 6 if str(row.freqband) == "4" else 5 if str(row.freqband) == "2" else 2
            fallbackec = 6 if str(row.freqband) in ["71"] or row.postcell.upper().startswith('E') else 0
            v_prio = 6 if str(row.freqband) in ["71"] or row.postcell.upper().startswith('E') else 0
            
            for _, row_gcell in self.df_gnb_cell.iterrows():
                lines.extend([
                    F'####:---- EUtranFreqRelation for NRCellCU-{row_gcell.postcell} to earfcn-{row.earfcndl} ----:####',
                    F'pr GNBCUCPFunction=1,NRCellCU={row_gcell.postcell},EUtranFreqRelation={row.earfcndl}$',
                    F'if $nr_of_mos = 0',
                    F'  crn GNBCUCPFunction=1,NRCellCU={row_gcell.postcell},EUtranFreqRelation={row.earfcndl}',
                    F'  allowedMeasBandwidth {all_bw}',
                    F'  cellReselectionPriority {resel_prio}',
                    F'  eUtranFallbackPrioEc {fallbackec}',
                    F'  voicePrio {v_prio}',
                    F'  eUtranFrequencyRef {gutran_ldn},EUtranFrequency={row.earfcndl}',
                    F'  userLabel {row.earfcndl}',
                    F'  qRxLevMin -124',
                    F'  tReselectionEUtra 1',
                    F'  ueMCEUtranFreqRelProfileRef GNBCUCPFunction=1,UeMC=1,UeMCEUtranFreqRelProfile={row.earfcndl}',
                    F'  mcpcPCellEUtranFreqRelProfileRef GNBCUCPFunction=1,Mcpc=1,McpcPCellEUtranFreqRelProfile={row.earfcndl}',
                    F'  end',
                    F'fi',
                    F'',
                ])
                for _, row_c in self.usid.df_enb_cell.loc[
                    self.usid.df_enb_cell.celltype.isin(['FDD', 'TDD']) & (self.usid.df_enb_cell.earfcndl == row.earfcndl)][[
                        'postcell', 'enbid', 'cellid', 'earfcndl', 'dlchannelbandwidth', 'freqband', 'celltype']].iterrows():
                    ext_enb = F'{gutran_ldn},ExternalENodeBFunction=auto310_260_3_{row_c.enbid}'
                    lines.extend([
                        F'####:---- EUtranCellRelation for NRCellCU-{row_gcell.postcell} to EUtranCell-{row_c.postcell} ----:####',
                        F'pr GNBCUCPFunction=1,NRCellCU={row_gcell.postcell},EUtranCellRelation={row_c.postcell}$',
                        F'if $nr_of_mos = 0',
                        F'  crn GNBCUCPFunction=1,NRCellCU={row_gcell.postcell},EUtranCellRelation={row_c.postcell}',
                        F'  isHoAllowed true',
                        F'  neighborCellRef {ext_enb},ExternalEUtranCell=310260-{row_c.enbid}-{row_c.cellid}',
                        F'  end',
                        F'fi',
                        F'',
                    ])
                lines.extend([F'', F''])
        # Setting Parameter and remove wrong EUtranFreqRelation reference mcpcPCellEUtranFreqRelProfileRef and ueMCEUtranFreqRelProfileRef
        if len(lines) > 0:
            lines.extend([
                F'',
                F'############ remove wrong EUtranFreqRelation reference mcpcPCellEUtranFreqRelProfileRef and ueMCEUtranFreqRelProfileRef',
                F'',
                F'lt all',
                F'mr NRCellCU_EUtranFreqRelation',
                F'ma NRCellCU_EUtranFreqRelation NRCellCU=.*.,EUtranFreqRelation=',
                F'for $mo in NRCellCU_EUtranFreqRelation',
                F'  $NRCellCU_EUtranFreqRelationLdn = ldn($mo)',
                F'  get $NRCellCU_EUtranFreqRelationLdn eUtranFreqRelationId > $eUtranFreqRelationId',
                F'  ',
                F'  mr ueMCEUtranFreqRelProfileRef_group',
                F'  ma ueMCEUtranFreqRelProfileRef_group $NRCellCU_EUtranFreqRelationLdn ueMCEUtranFreqRelProfileRef',
                F'  get ueMCEUtranFreqRelProfileRef_group ueMCEUtranFreqRelProfileId > $ueMCEUtranFreqRelProfileId',
                F'  if $eUtranFreqRelationId != $ueMCEUtranFreqRelProfileId',
                F'    set $NRCellCU_EUtranFreqRelationLdn ueMCEUtranFreqRelProfileRef',
                F'  fi',
                F'  ',
                F'  mr mcpcPCellEUtranFreqRelProfileRef_group',
                F'  ma mcpcPCellEUtranFreqRelProfileRef_group $NRCellCU_EUtranFreqRelationLdn mcpcPCellEUtranFreqRelProfileRef',
                F'  get mcpcpcelleutranfreqrelprofileref_group mcpcPCellEUtranFreqRelProfileId > $mcpcPCellEUtranFreqRelProfileId',
                F'  ',
                F'  if $eUtranFreqRelationId != $mcpcPCellEUtranFreqRelProfileId',
                F'    set $NRCellCU_EUtranFreqRelationLdn mcpcPCellEUtranFreqRelProfileRef',
                F'  fi',
                F'done',
                F'',
                F'######################## Create McpcPCellProfile and Update',
                F'func Create_McpcPCellProfile',
                F'  mr nrcells',
                F'  ma nrcells GNBCUCPFunction=1,NRCellCU=',
                F'  for $mo in nrcells',
                F'    $cellLdn = ldn($mo)',
                F'    get $mo nRCellCUId > $nrcellid',
                F'    pr GNBCUCPFunction=1,Mcpc=1,McpcPCellProfile=$nrcellid$',
                F'    if $nr_of_mos = 0',
                F'      crn GNBCUCPFunction=1,Mcpc=1,McpcPCellProfile=$nrcellid',
                F'      ueConfGroupType 0',
                F'      end',
                F'    fi',
                F'    ',
                F'    get GNBCUCPFunction=1,NRCellCU=$nrcellid$ mcpcPCellProfileRef GNBCUCPFunction=1,Mcpc=1,McpcPCellProfile=$nrcellid',
                F'    if $nr_of_mos = 0',
                F'      set GNBCUCPFunction=1,NRCellCU=$nrcellid mcpcPCellProfileRef GNBCUCPFunction=1,Mcpc=1,McpcPCellProfile=$nrcellid',
                F'    fi',
                F'  done',
                F'  mr nrcells',
                F'  unset $mo',
                F'  unset $nrcellid',
                F'endfunc',
                F'',
                F'Create_McpcPCellProfile',
                F'',
                F'lt all',
                F'pr McpcPCellProfileUeCfg=',
                F'if $nr_of_mos = 0',
                F'  lset McpcPCellProfileUeCfg= lowHighFreqPrioClassification 5',
                F'  lset McpcPCellProfileUeCfg= mcpcQuantityList 0',
                F'  lset McpcPCellProfileUeCfg= rsrpCandidateB2 hysteresis=10,threshold1=-50,threshold2Eutra=-110,timeToTrigger=640',
                F'  lset McpcPCellProfileUeCfg= rsrpCriticalEnabled true',
                F'  lset McpcPCellProfileUeCfg= rsrpCritical hysteresis=10,threshold=-118,timeToTrigger=1280,timeToTriggerA1=640',
                F'  lset McpcPCellProfileUeCfg= rsrpSearchTimeRestriction -1',
                F'  lset McpcPCellProfileUeCfg= rsrpSearchZone hysteresis=20,threshold=-50,timeToTrigger=320,timeToTriggerA1=320',
                F'fi',
                F'',
                F'########################## create McpcPCellEUtranFreqRelProfile and UeMCEUtranFreqRelProfile',
                F'',
                F'mr EUtranFrequency_McpcPCellEUtranFreqRelProfile',
                F'ma EUtranFrequency_McpcPCellEUtranFreqRelProfile ,EUtraNetwork=1,EUtranFrequency= reservedBy NRCellCU',
                F'mr EUtranFrequency_McpcPCellEUtranFreqRelProfile GNBCUCPFunction=1,EUtraNetwork=1,EUtranFrequency=3',
                F'mr EUtranFrequency_McpcPCellEUtranFreqRelProfile GNBCUCPFunction=1,EUtraNetwork=1,EUtranFrequency=4',
                F'for $mo in EUtranFrequency_McpcPCellEUtranFreqRelProfile',
                F'  $EUtranFrequencyLdn = ldn($mo)',
                F'  get $EUtranFrequencyLdn arfcnValueEUtranDl > $arfcnValueEUtranDl',
                F'  pr McpcPCellEUtranFreqRelProfile=$arfcnValueEUtranDl$',
                F'  if $nr_of_mos = 0',
                F'    crn GNBCUCPFunction=1,Mcpc=1,McpcPCellEUtranFreqRelProfile=$arfcnValueEUtranDl',
                F'    ueConfGroupType 0',
                F'    end',
                F'  fi',
                F'  pr GNBCUCPFunction=1,UeMC=1,UeMCEUtranFreqRelProfile=$arfcnValueEUtranDl$',
                F'  if $nr_of_mos = 0',
                F'    crn GNBCUCPFunction=1,UeMC=1,UeMCEUtranFreqRelProfile=$arfcnValueEUtranDl',
                F'    ueConfGroupType 0',
                F'    end',
                F'  fi',
                F'done',
                F'',
                F'',
                F'### set referece EUtranFreqRelation mcpcPCellEUtranFreqRelProfileRef and ueMCEUtranFreqRelProfileRef',
                F'',
                F'lt all',
                F'mr EUtranFreqRelation_Ref',
                F'ma EUtranFreqRelation_Ref NRCellCU=.*.,EUtranFreqRelation=',
                F'### ## remove EUtranFreqRelation=3 and EUtranFreqRelation=4',
                F'mr eutranfreqrelation_ref EUtranFreqRelation=3',
                F'mr eutranfreqrelation_ref EUtranFreqRelation=4',
                F'for $mo in EUtranFreqRelation_Ref',
                F'  $EUtranFreqRelation_RefLdn = ldn($mo)',
                F'  get $EUtranFreqRelation_RefLdn eUtranFreqRelationId > $eUtranFreqRelationId',
                F'  set $EUtranFreqRelation_RefLdn ueMCEUtranFreqRelProfileRef UeMC=1,UeMCEUtranFreqRelProfile=$eUtranFreqRelationId',
                F'  set $EUtranFreqRelation_RefLdn mcpcPCellEUtranFreqRelProfileRef Mcpc=1,McpcPCellEUtranFreqRelProfile=$eUtranFreqRelationId',
                F'done',
                F'',
                F'### Base line',
                F'pr McpcPCellEUtranFreqRelProfile=68.*.,McpcPCellEUtranFreqRelProfileUeCfg=',
                F'if $nr_of_mos > 0',
                F'  lset McpcPCellEUtranFreqRelProfile=68.*.,McpcPCellEUtranFreqRelProfileUeCfg= inhibitMeasForCellCandidate false',
                F'  lset McpcPCellEUtranFreqRelProfile=68.*.,McpcPCellEUtranFreqRelProfileUeCfg= rsrpCandidateB2Offsets threshold1Offset=-66,threshold2EUtraOffset=-6',
                F'fi',
                F'pr McpcPCellEUtranFreqRelProfile=5035,McpcPCellEUtranFreqRelProfileUeCfg=',
                F'if $nr_of_mos > 0',
                F'  lset McpcPCellEUtranFreqRelProfile=5035,McpcPCellEUtranFreqRelProfileUeCfg= inhibitMeasForCellCandidate false',
                F'  lset McpcPCellEUtranFreqRelProfile=5035,McpcPCellEUtranFreqRelProfileUeCfg= rsrpCandidateB2Offsets threshold1Offset=-66,threshold2EUtraOffset=-6',
                F'fi',
                F'pr McpcPCellEUtranFreqRelProfile=[12].*.,McpcPCellEUtranFreqRelProfileUeCfg=',
                F'if $nr_of_mos > 0',
                F'  lset McpcPCellEUtranFreqRelProfile=[12].*.,McpcPCellEUtranFreqRelProfileUeCfg= inhibitMeasForCellCandidate false',
                F'  lset McpcPCellEUtranFreqRelProfile=[12].*.,McpcPCellEUtranFreqRelProfileUeCfg= rsrpCandidateB2Offsets threshold1Offset=0,threshold2EUtraOffset=0',
                F'fi',
                F'',
                F'pr UeMCEUtranFreqRelProfile=68.*.,UeMCEUtranFreqRelProfileUeCfg=',
                F'if $nr_of_mos > 0',
                F'  lset UeMCEUtranFreqRelProfile=68.*.,UeMCEUtranFreqRelProfileUeCfg= blindRwrAllowed true',
                F'  lset UeMCEUtranFreqRelProfile=68.*.,UeMCEUtranFreqRelProfileUeCfg= connModeAllowedPCell true',
                F'  lset UeMCEUtranFreqRelProfile=68.*.,UeMCEUtranFreqRelProfileUeCfg= connModePrioPCell 6',
                F'fi',
                F'pr UeMCEUtranFreqRelProfile=5035,UeMCEUtranFreqRelProfileUeCfg=',
                F'if $nr_of_mos > 0',
                F'  lset UeMCEUtranFreqRelProfile=5035,UeMCEUtranFreqRelProfileUeCfg= blindRwrAllowed false',
                F'  lset UeMCEUtranFreqRelProfile=5035,UeMCEUtranFreqRelProfileUeCfg= connModeAllowedPCell false',
                F'  lset UeMCEUtranFreqRelProfile=5035,UeMCEUtranFreqRelProfileUeCfg= connModePrioPCell 6',
                F'fi',
                F'pr UeMCEUtranFreqRelProfile=[12].*.,UeMCEUtranFreqRelProfileUeCfg=',
                F'if $nr_of_mos > 0',
                F'  lset UeMCEUtranFreqRelProfile=[12].*.,UeMCEUtranFreqRelProfileUeCfg= blindRwrAllowed false',
                F'  lset UeMCEUtranFreqRelProfile=[12].*.,UeMCEUtranFreqRelProfileUeCfg= connModeAllowedPCell true',
                F'  lset UeMCEUtranFreqRelProfile=[12].*.,UeMCEUtranFreqRelProfileUeCfg= connModePrioPCell 6',
                F'fi',
                F'',
                F'set UeMC freqSelAtBlindRwrToEutran 1',
                F'',
                F'',
            ])
        
        return lines

    def east_parameter_for_n19(self):
        lines = []
        if self.usid.client.mname not in ['Bloomfield', 'Norfolk', 'Philadelphia', 'Salina']: return lines
        if len(self.df_gnb_cell.loc[self.df_gnb_cell.postcell.str.startswith('J', na=False)].index) == 0: return lines
        lines.extend([
            F'',
            F'####:----------------> EAST Market Parameter Settings for N1900 <----------------:####',
            F'',
            F'pr GNBCUCPFunction=1,UeMC=1,UeMCEUtranFreqRelProfile=.*.,UeMCEUtranFreqRelProfileUeCfg=Base',
            F'if $nr_of_mos > 0',
            F'    set GNBCUCPFunction=1,UeMC=1,UeMCEUtranFreqRelProfile=.*.,UeMCEUtranFreqRelProfileUeCfg=Base connModePrioPCell 4',
            F'fi',
            F'pr GNBCUCPFunction=1,UeMC=1,UeMCEUtranFreqRelProfile=68.*.,UeMCEUtranFreqRelProfileUeCfg=Base',
            F'if $nr_of_mos > 0',
            F'    set GNBCUCPFunction=1,UeMC=1,UeMCEUtranFreqRelProfile=68.*.,UeMCEUtranFreqRelProfileUeCfg=Base connModePrioPCell 2',
            F'fi',
            F'pr GNBCUCPFunction=1,UeMC=1,UeMCEUtranFreqRelProfile=5035,UeMCEUtranFreqRelProfileUeCfg=Base',
            F'if $nr_of_mos > 0',
            F'    set GNBCUCPFunction=1,UeMC=1,UeMCEUtranFreqRelProfile=5035,UeMCEUtranFreqRelProfileUeCfg=Base connModePrioPCell 2',
            F'fi',
            F'',
        ])
        return lines


    @staticmethod
    def activity_check(activity=''):
        return [
            F'',
            F'####:----------------> {activity} Check <----------------:####',
            F'hget GNBCUCPFunction=1,EUtraNetwork=.*,EUtranFrequency= arfcnValueEUtranDl|userLabel',
            F'hget NRCellCU=.*,EUtranFreqRelation= allowedMeasBandwidth|cellReselectionPriority|connectedModeMobilityPrio|eUtranFallbackPrioEc|voicePrio',
            F'hget ,UeMCEUtranFreqRelProfileUeCfg= connModePrioPCell',
            F'',
            F'',
        ]
