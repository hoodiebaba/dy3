import copy
from .att_xml_base import att_xml_base


class nr_85_gnb_eutran_relation(att_xml_base):
    def create_rpc_msg(self):
        enbid_list = list(set(list(self.usid.df_lte_rel.enbid.unique()) +
                              [self.usid.enodeb[enb]['nodeid'] for enb in self.usid.enodeb.keys()]))
        if len(enbid_list) == 0: return
        nw_ldn = F'GNBCUCPFunction=1,EUtraNetwork={self.gnbdata.get("EUtraNetwork")}'
        allowed_bw_dict = {'3000': '15', '5000': '25', '10000': '50', '15000': '75', '20000': '100'}
        self.motype = 'GNBCUCP'
        me_dict = {'managedElementId': self.node, 'GNBCUCPFunction': {
            'gNBCUCPFunctionId': '1', 'EUtraNetwork': {'eUtraNetworkId': self.gnbdata['EUtraNetwork']}}}
        nw_id = F'GNBCUCPFunction=1,EUtraNetwork={self.gnbdata["EUtraNetwork"]}'
        freq_list = []
        for enb in enbid_list:
            mo_id = 'auto310_410_3_' + str(enb)
            mo_fdn = F'{nw_ldn},ExternalENodeBFunction={mo_id}'
            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('ExternalENodeBFunction', None, None, mo_id)
            tmp_dict |= {'externalENodeBFunctionId': mo_id, 'eNodeBId': str(enb), 'pLMNId': {'mcc': '310', 'mnc': '410'}}
            mo_dict = copy.deepcopy(me_dict)
            mo_dict['GNBCUCPFunction']['EUtraNetwork']['ExternalENodeBFunction'] = tmp_dict
            self.mo_dict[mo_fdn] = copy.deepcopy(mo_dict)

            mo_dict['GNBCUCPFunction']['EUtraNetwork']['ExternalENodeBFunction'] = {'externalENodeBFunctionId': mo_id}
            mo_dict['GNBCUCPFunction']['EUtraNetwork']['ExternalENodeBFunction']['TermPointToENodeB'] = \
                self.get_mo_dict_from_moc_node_fdn_moid('TermPointToENodeB', None, None, 'auto1')
            mo_dict['GNBCUCPFunction']['EUtraNetwork']['ExternalENodeBFunction']['TermPointToENodeB'] |= {
                'termPointToENodeBId': 'auto1', 'administrativeState': '1 (UNLOCKED)'}
            self.mo_dict[F'{mo_fdn},TermPointToENodeB=auto1'] = copy.deepcopy(mo_dict)
