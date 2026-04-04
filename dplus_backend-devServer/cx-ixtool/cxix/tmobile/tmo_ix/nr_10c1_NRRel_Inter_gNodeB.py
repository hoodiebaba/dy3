from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class nr_10c1_NRRel_Inter_gNodeB(tmo_xml_base):
    def initialize_var(self):
        self.relative_path = [F'NR_NR_Relation', self.node, F'{self.__class__.__name__}_{self.node}.mos']
        self.nrnwmo = F'GNBCUCPFunction=1,NRNetwork={self.gnbdata.get("NRNetwork")}'
        if len(self.usid.df_gnb_cell.postsite.unique()) > 1:
            self.script_elements.extend(self.pre_post_check('Pre'))
            self.script_elements.extend(self.externalgnbcucpfunction_mos_create())
            self.script_elements.extend(self.pre_post_check('Post'))

    def externalgnbcucpfunction_mos_create(self):
        lines = []
        lines += [
            F'#################################################################################################',
            F'####:----------------> Pre Check <----------------:####',
            F'hget ExternalGNBCUCPFunction= gNBId|gNBIdLength|pLMNId',
            F'lst ExternalGNBCUCPFunction=.*({"|".join(self.usid.gnodeb.keys())})',
            F'lpr ExternalGNBCUCPFunction=.*({"|".join(self.usid.gnodeb.keys())})',
            F'#################################################################################################',
            F'',
            F'pr GNBCUCPFunction=1,NRNetwork=1$',
            F'if $nr_of_mos = 0',
            F'    cr GNBCUCPFunction=1,NRNetwork=1',
            F'fi',
            F'',
        ]
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
        lines += [
            F'#################################################################################################',
            F'####:----------------> Post Check <----------------:####',
            F'hget ExternalGNBCUCPFunction= gNBId|gNBIdLength|pLMNId',
            F'lst ExternalGNBCUCPFunction=.*({"|".join(self.usid.gnodeb.keys())})',
            F'lpr ExternalGNBCUCPFunction=.*({"|".join(self.usid.gnodeb.keys())})',
            F'#################################################################################################',
        ]
        return lines

    def pre_post_check(self, activity): return []
    
    def create_data_path(self):
        if len(self.script_elements) == 0: return
        import os
        self.script_file = os.path.join(self.usid.base_dir, *self.relative_path)
        out_dir = os.path.dirname(self.script_file)
        if not os.path.exists(out_dir): os.makedirs(out_dir)
