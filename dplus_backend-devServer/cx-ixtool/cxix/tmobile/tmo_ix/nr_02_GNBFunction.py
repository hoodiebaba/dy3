from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class nr_02_GNBFunction(tmo_xml_base):
    def initialize_var(self):
        if self.gnbdata.get('nodefunc', '') is None or self.gnbdata.get('equ_change', True):
            self.script_elements = [self.rcp_msg_capabilities(), self.create_rpc_msg(), self.rcp_msg_close()]

    def create_rpc_msg(self):
        self.motype = 'GNBCUUP'
        gnb_ipendpoint, _ = self.get_mo_dict_for_id_tag('LocalIpEndpoint', '1', self.node if self.site else None)
        gnb_cuup, _ = self.get_mo_dict_for_id_tag('GNBCUUPFunction', '1', self.node if self.site else None)
        gnb_cuup.update({
            'gNBCUUPFunctionId': 1,
            'gNBId': self.gnbdata.get('nodeid'),
            'gNBIdLength': self.gnbdata.get('gnbidlength'),
            'pLMNIdList': {'mcc': self.gnbdata.get('plmnlist', {}).get('mcc'), 'mnc': self.gnbdata.get('plmnlist', {}).get('mnc')},
            'endpointResourceRef': 'GNBCUUPFunction=1,EndpointResource=1',
            'EndpointResource': {
                'endpointResourceId': '1',
                'LocalIpEndpoint': {
                    'localIpEndpointId': '1',
                    'interfaceList': gnb_ipendpoint.get('interfaceList', ['NG', 'S1', 'X2', 'XN', 'E1', 'F1']),
                    'addressRef': F'Transport=1,Router={self.gnbdata.get("lte")},InterfaceIPv4={self.gnbdata.get("lte_interface")},AddressIPv4=1',
                }
            },
        })
        self.motype = 'GNBDU'
        gnb_du, _ = self.get_mo_dict_for_id_tag('GNBDUFunction', '1', self.node if self.site else None)
        gnb_du.update({
            'gNBDUFunctionId': 1,
            'gNBDUId': 1,
            'gNBId': self.gnbdata.get('nodeid'),
            'gNBIdLength': self.gnbdata.get('gnbidlength'),
            'endpointResourceRef': 'GNBDUFunction=1,EndpointResource=1',
            'EndpointResource': {
                'endpointResourceId': '1',
                'LocalSctpEndpoint': {
                    'localSctpEndpointId': '1',
                    'interfaceUsed': '3 (F1)',
                    'sctpEndpointRef': 'Transport=1,SctpEndpoint=F1_NRDU',
                }
            },
            'TermPointToGNBCUCP': {'termPointToGNBCUCPId': 1, 'administrativeState': '1 (UNLOCKED)', 'ipv4Address': '169.254.42.42'}
        })
        self.motype = 'GNBCUCP'
        gnb_cucp, _ = self.get_mo_dict_for_id_tag('GNBCUCPFunction', '1', self.node if self.site else None)
        gnb_cucp.update({
            'gNBCUCPFunctionId': 1,
            'gNBCUName': 1,
            'gNBId': self.gnbdata.get("nodeid"),
            'gNBIdLength': self.gnbdata.get('gnbidlength'),
            'pLMNId': {'mcc': self.gnbdata.get('plmnlist', {}).get('mcc'), 'mnc': self.gnbdata.get('plmnlist', {}).get('mnc')},
            'endpointResourceRef': 'GNBCUCPFunction=1,EndpointResource=1',
            'EndpointResource': {
                'endpointResourceId': '1',
                'LocalSctpEndpoint': [
                    {'localSctpEndpointId': '1', 'interfaceUsed': '4 (NG)', 'sctpEndpointRef': 'Transport=1,SctpEndpoint=NR_N2'},
                    {'localSctpEndpointId': '2', 'interfaceUsed': '7 (X2)', 'sctpEndpointRef': 'Transport=1,SctpEndpoint=NR_X2'},
                    {'localSctpEndpointId': '3', 'interfaceUsed': '6 (XN)', 'sctpEndpointRef': 'Transport=1,SctpEndpoint=NR_Xn'},
                    {'localSctpEndpointId': '4', 'interfaceUsed': '3 (F1)', 'sctpEndpointRef': 'Transport=1,SctpEndpoint=F1_NRCUCP'},
                ]
            },
            'NRNetwork': {'nRNetworkId': self.gnbdata.get('NRNetwork')},
            'EUtraNetwork': {'eUtraNetworkId': self.gnbdata.get('EUtraNetwork')},
        })
        tmp_dict = {'managedElementId': self.node, 'GNBCUUPFunction': gnb_cuup, 'GNBDUFunction': gnb_du, 'GNBCUCPFunction': gnb_cucp}
        doc, config = self.main_rcp_msg_start('gnodeb')
        config.appendChild(self.mo_add_form_dict_xml(tmp_dict, 'ManagedElement'))
        return doc
