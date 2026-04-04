import copy
from .att_xml_base import att_xml_base


class lte_41_enodebfunction(att_xml_base):
    def create_rpc_msg(self):
        if self.no_eq_change_with_dcgk_flag and self.enbdata.get('Lrat'): return
        self.motype = 'Lrat'
        mo_dict = self.get_mo_dict_from_moc_node_fdn_moid('ENodeBFunction', self.node, self.enbdata.get("Lrat"), '1')
        mo_dict |= {
            'eNodeBFunctionId': '1',
            'eNBId': self.enbdata['nodeid'],
            'eNodeBPlmnId': self.enbdata['plmnlist'],
            'sctpRef': F'Transport=1,SctpEndpoint={self.enbdata["sctpendpoint"]}',
            'upIpAddressRef': F'Transport=1,Router={self.enbdata["lte"]},InterfaceIPv6={self.enbdata["lte_interface"]},AddressIPv6=1',
            'dnsSelectionS1X2Ref': '', 'eranUlCompVlanPortRef': '',
            'eranVlanPortRef': '', 'intraRanIpAddressRef': '',
            'ipsecEndcEpAddressRef': '', 'ipsecEpAddress2Ref': '',
            'ipsecEpAddressRef': '', 'rpUpIpAddressRef': '',
            'sctpEndcX2Ref': '', 'sctpX2Ref': '',
            'upEndcX2IpAddressRef': '', 'upIpAddress2Ref': '',
            'upX2IpAddress2Ref': '', 'upX2IpAddressRef': '',
        }
        self.mo_dict['ENodeBFunction=1'] = {'managedElementId': self.node, 'ENodeBFunction': copy.deepcopy(mo_dict)}
