from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class nr_10c_NRRel_Inter_gNodeB(tmo_xml_base):
    def initialize_var(self):
        self.relative_path = [F'NR_NR_Relation', F'{self.__class__.__name__}_{self.node}.mos']
        self.nrnwmo = F'GNBCUCPFunction=1,NRNetwork={self.gnbdata.get("NRNetwork")}'
        if len(self.usid.df_gnb_cell.postsite.unique()) > 1:
            self.script_elements.extend(self.pre_post_check('Pre'))
            self.script_elements.extend(self.externalgnbcucpfunction_mos_create())
            self.script_elements.extend(self.nr_relation_creation())
            self.script_elements.extend(self.pre_post_check('Post'))

    def externalgnbcucpfunction_mos_create(self):
        lines = []
        lines.extend(get_nr_freq_rel_cellrel_functions())
        for gnb in self.usid.gnodeb.keys():
            if gnb == self.node: continue
            extgnb = F'auto{self.usid.gnodeb[gnb]["plmnlist"]["mcc"]}_{self.usid.gnodeb[gnb]["plmnlist"]["mnc"]}_' \
                     F'{self.usid.gnodeb[gnb]["plmnlist"]["mncLength"]}_{self.usid.gnodeb[gnb]["nodeid"]}'

            lines.extend([
                F'####:----------------> ExternalGNBCUCPFunction & TermPointToGNB for {gnb} <----------------:####',
                F'get {self.nrnwmo},ExternalGNBCUCPFunction=.* gNBId {self.usid.gnodeb[gnb]["nodeid"]}',
                F'if $nr_of_mos = 0',
                F'    crn {self.nrnwmo},ExternalGNBCUCPFunction={extgnb}',
                F'    gNBId {self.usid.gnodeb[gnb]["nodeid"]}',
                F'    gNBIdLength {self.usid.gnodeb[gnb]["gnbidlength"]}',
                F'    pLMNId mcc={self.usid.gnodeb[gnb]["plmnlist"]["mcc"]},mnc={self.usid.gnodeb[gnb]["plmnlist"]["mnc"]}',
                F'    end',
                F'fi',
                F'  ',
                F'get {self.nrnwmo},ExternalGNBCUCPFunction={extgnb},TermPointToGNodeB=auto1$',
                F'if $nr_of_mos = 0',
                F'    crn {self.nrnwmo},ExternalGNBCUCPFunction={extgnb},TermPointToGNodeB=auto1',
                F'    administrativeState 1',
                F'    ipv4Address {self.usid.gnodeb[gnb]["lte_ip"]}',
                F'    end',
                F'    wait 30',
                F'fi',
                F'',
                
                F'lt all',
                F'st {self.nrnwmo},ExternalGNBCUCPFunction={extgnb},TermPointToGNodeB=auto1',
                F'lpr {self.nrnwmo},ExternalGNBCUCPFunction={extgnb}',
                F'if $nr_of_mos < 3',
                F'  lst {self.nrnwmo},ExternalGNBCUCPFunction={extgnb}',
                F'  lpr {self.nrnwmo},ExternalGNBCUCPFunction={extgnb}',
                F'  print ERROR ALART: !!! Check if ExternalNRCellCU are auto created for the NR Node {gnb} !!! ',
                F'  wait 20',
                F'fi',
                F'wait 10',
                F'',
                F'',
            ])
        
        return lines
    
    def nr_relation_creation(self):
        lines = []
        gnodebids = [str(self.usid.gnodeb[_]["nodeid"]) for _ in self.usid.gnodeb.keys() if _ != self.node] + \
                    [str(_) for _ in self.usid.gnodeb.keys() if _ != self.node]
        lines.extend([
            F'####:----------------> NRFreqRelation & NRCellRelation for ExternalNRCellCU with gNBId --- {gnodebids} <----------------:####',
            F'func get_nrfreq',
            F'    mr nrfreqrels',
            F'    ma nrfreqrels $nrcellldn,NRFreqRelation= ^nRFrequencyRef$ $frqldn',
            F'    for $nrfreqrel in nrfreqrels',
            F'        $nrfreqrelldn = ldn($nrfreqrel)',
            F'    done',
            F'    mr $nrfreqrel',
            F'    mr nrfrerels',
            F'endfunc',
            F'',
            F'func val_cr_nrfreq_rel_cellrel',
            F'  for $cu_cell in cucells',
            F'      get $cu_cell ^nRCellCUId$ > $scellcuid',
            F'      $nrcellldn = ldn($cu_cell)',
            F'      $nrfreqrelldn = $nrcellldn,NRFreqRelation=$arfcnval',
            F'      $nrcellrelldn = $nrcellldn,NRCellRelation=$ducelllid',
            F'      get $nrcellldn,NRFreqRelation= ^nRFrequencyRef$ $frqldn',
            F'      if $nr_of_mos > 0',
            F'          get_nrfreq',
            F'      else',
            F'          createnrfreqrelation',
            F'      fi',
            F'      if $scellcuid != $ducelllid',
            F'          createnrcellrelation',
            F'      fi',
            F'  done',
            F'endfunc',
            F'',
    
            F'lt all',
            F'mr cucells',
            F'mr extgnbs',
            F'mr extcucells',
            F'ma cucells GNBCUCPFunction=1,NRCellCU=',
            F'ma extgnbs ^ExternalGNBCUCPFunction=.*({"|".join(gnodebids)})',
            F'for $extgnb in extgnbs',
            F'    $extgnb = ldn($extgnb)',
            F'    ma extcucells $extgnb,ExternalNRCellCU=',
            F'done',
            F'pr extcucells',
            F'for $extcell in extcucells',
            F'  get $extcell ^externalNRCellCUId$ > $ducelllid',
            F'  get $extcell ^nRFrequencyRef$ > $frqldn',
            F'  get $frqldn ^arfcnValueNRDl$ > $arfcnval',
            F'  $targetcucell = ldn($extcell)',
            F'  createnrfreqprofile',
            F'  val_cr_nrfreq_rel_cellrel',
            F'done',
            F'mr cucells',
            F'mr extnrcells',
            F'',
            F'',
        ])

        lines.extend([
            F'####:----------------> Parameter Setting <----------------:####',
            F'pr GNBCUCPFunction=1,NRCellCU=',
            F'if $nr_of_mos > 0',
            F'    set GNBCUCPFunction=1,NRCellCU= transmitSib2 true',
            F'    set GNBCUCPFunction=1,NRCellCU= transmitSib4 true',
            F'    set GNBCUCPFunction=1,NRCellCU= transmitSib5 true',
            F'    set GNBCUCPFunction=1,NRCellCU= mcpcPCellEnabled true',
            F'fi',
            F'',
        ])
        
        return lines
    
    def pre_post_check(self, activity):
        return [
            F'#################################################################################################',
            F'##############################################################',
            F'####:----------------> {activity} Check <----------------:####',
            F'hget ^NRCellDU=.* ^ssb(FrequencyAutoSelected|Frequency|SubCarrierSpacing|Periodicity|Offset|Duration)$',
            F'hget ^NRCellCU=.* ^smtc(Periodicity|Offset|Duration)$|transmitSib(2|4|5)$',
            F'hget ^NRFrequency=.* arfcnValueNRDl|^band(List|ListManual)|gscn$|^smtc(Duration|Offset|Periodicity|Scs)$',
            F'hget ^NRFreqRelation=.* cellReselectionPriority|nRFrequencyRef|qRxLevMin|^tReselectionNR$|threshXHighP|threshXLowP',
            F'hget ExternalGNBCUCPFunction= gNBId|gNBIdLength|pLMNId',
            F'lst ExternalGNBCUCPFunction=',
            F'#################################################################################################',
            F'',
            F'',
            ]
    
    def create_data_path(self):
        import os
        self.script_file = os.path.join(self.usid.base_dir, *self.relative_path)
        out_dir = os.path.dirname(self.script_file)
        if not os.path.exists(out_dir): os.makedirs(out_dir)
