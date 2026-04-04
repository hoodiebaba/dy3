import copy
import json
from .att_xml_base import att_xml_base


class nr_71_gnbfunction(att_xml_base):
    def create_rpc_msg(self):
        #   GNBCUUPFunction
        if self.no_eq_change_with_dcgk_flag is False or self.gnbdata.get('GNBCUUP') is None:
            self.motype = 'GNBCUUP'
            interfaceList = self.get_mo_dict_for_moc_node_fdn('LocalIpEndpoint', self.node, None).get('interfaceList')
            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('GNBCUUPFunction', self.node, self.gnbdata['GNBCUUP'], '1')
            tmp_dict |= {
                'gNBCUUPFunctionId': '1',
                'gNBId': self.gnbdata["nodeid"],
                'gNBIdLength': self.gnbdata['gnbidlength'],
                'pLMNIdList': {'mcc': self.gnbdata['plmnlist'].get('mcc'), 'mnc': self.gnbdata['plmnlist'].get('mnc')},
                'endpointResourceRef': '',
                # 'endpointResourceRef': F'GNBCUUPFunction=1,EndpointResource=1',
                'EndpointResource': {
                    'attributes': {'xc:operation': 'create'},
                    'endpointResourceId': '1',
                    'LocalIpEndpoint': {
                        'attributes': {'xc:operation': 'create'},
                        'localIpEndpointId': '1', 'interfaceList': interfaceList,
                        'addressRef': F'Transport=1,Router={self.gnbdata["lte"]},InterfaceIPv6={self.gnbdata["lte_interface"]},AddressIPv6=1'
                    }
                }
            }
            self.mo_dict['GNBCUUP'] = {'managedElementId': self.node, 'GNBCUUPFunction': copy.deepcopy(tmp_dict)}
            self.mo_dict['GNBCUUP_endpoint'] = {'managedElementId': self.node, 'GNBCUUPFunction': {
                'attributes': {'xc:operation': 'update'}, 'gNBCUUPFunctionId': '1', 'endpointResourceRef': F'GNBCUUPFunction=1,EndpointResource=1'}}

        #   GNBDUFunction
        if self.no_eq_change_with_dcgk_flag is False or self.gnbdata.get('GNBDU') is None:
            self.motype = 'GNBDU'
            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('GNBDUFunction', self.node, self.gnbdata['GNBDU'], '1')
            tmp_dict |= {
                'gNBDUFunctionId': '1',
                'gNBDUId': '1',
                'gNBId': self.gnbdata['nodeid'],
                'gNBIdLength': self.gnbdata['gnbidlength'],
                'endpointResourceRef': '',
                # 'endpointResourceRef': F'GNBDUFunction=1,EndpointResource=1',
                'EndpointResource': {
                    'attributes': {'xc:operation': 'create'},
                    'endpointResourceId': '1',
                    'LocalSctpEndpoint': {'attributes': {'xc:operation': 'create'}, 'localSctpEndpointId': '1', 'interfaceUsed': '3 (F1)',
                                          'sctpEndpointRef': F'Transport=1,SctpEndpoint=F1_NRDU'}
                },
                'TermPointToGNBCUCP': {'attributes': {'xc:operation': 'create'}, 'termPointToGNBCUCPId': '1',
                                       'administrativeState': '1 (UNLOCKED)', 'ipv4Address': '169.254.42.42'}
            }
            self.mo_dict['GNBDU'] = {'managedElementId': self.node, 'GNBDUFunction': copy.deepcopy(tmp_dict)}
            self.mo_dict['GNBDU_endpoint'] = {'managedElementId': self.node, 'GNBDUFunction': {
                'attributes': {'xc:operation': 'update'}, 'gNBDUFunctionId': '1', 'endpointResourceRef': F'GNBDUFunction=1,EndpointResource=1'}}

        #   GNBCUCPFunction
        # 7 (X2) --- 36422      3 (F1) --- 38472      4 (NG) --- 38412      6 (XN) --- 38422
        if self.no_eq_change_with_dcgk_flag is False or self.gnbdata.get('GNBCUCP') is None:
            self.motype = 'GNBCUCP'
            if len(self.df_gnb_cell.loc[self.df_gnb_cell.freqband == 'N077'].index) > 0:
                sctp = [
                    {'attributes': {'xc:operation': 'create'}, 'localSctpEndpointId': '3', 'interfaceUsed': '7 (X2)',
                     'sctpEndpointRef': F'Transport=1,SctpEndpoint={self.gnbdata["sctpendpoint"]}'},
                    {'attributes': {'xc:operation': 'create'}, 'localSctpEndpointId': '4', 'interfaceUsed': '3 (F1)',
                     'sctpEndpointRef': F'Transport=1,SctpEndpoint=F1_NRCUCP'}
                ]
            else:
                sctp = [
                    {'attributes': {'xc:operation': 'create'}, 'localSctpEndpointId': '1', 'interfaceUsed': '7 (X2)',
                     'sctpEndpointRef': F'Transport=1,SctpEndpoint={self.gnbdata["sctpendpoint"]}'},
                    {'attributes': {'xc:operation': 'create'}, 'localSctpEndpointId': '2', 'interfaceUsed': '3 (F1)',
                     'sctpEndpointRef': F'Transport=1,SctpEndpoint=F1_NRCUCP'}
                ]

            # if len(self.df_gnb_cell.loc[self.df_gnb_cell.freqband == 'N077'].index) > 0:
            #     try: a = int(self.gnbdata["sctpendpoint"])
            #     except: a = 1
            #     try: b = int(self.enbdata.get("sctpendpoint", "1"))
            #     except: b = 1
            #     sctp_end_nr_2 = max(a, b) + 1
            #     sctp = [
            #         {'attributes': {'xc:operation': 'create'}, 'localSctpEndpointId': '1', 'interfaceUsed': '4 (NG)',
            #          'sctpEndpointRef': F'Transport=1,SctpEndpoint={self.gnbdata["sctpendpoint"]}'},
            #         {'attributes': {'xc:operation': 'create'}, 'localSctpEndpointId': '2', 'interfaceUsed': '6 (XN)',
            #          'sctpEndpointRef': F'Transport=1,SctpEndpoint={sctp_end_nr_2}'},
            #         {'attributes': {'xc:operation': 'create'}, 'localSctpEndpointId': '3', 'interfaceUsed': '7 (X2)',
            #          'sctpEndpointRef': F'Transport=1,SctpEndpoint={sctp_end_nr_2 + 1}'},
            #         {'attributes': {'xc:operation': 'create'}, 'localSctpEndpointId': '4', 'interfaceUsed': '3 (F1)',
            #          'sctpEndpointRef': F'Transport=1,SctpEndpoint=F1_NRCUCP'}
            #     ]
            # else:
            #     sctp = [
            #         {'attributes': {'xc:operation': 'create'}, 'localSctpEndpointId': '1', 'interfaceUsed': '7 (X2)',
            #          'sctpEndpointRef': F'Transport=1,SctpEndpoint={self.gnbdata["sctpendpoint"]}'},
            #         {'attributes': {'xc:operation': 'create'}, 'localSctpEndpointId': '2', 'interfaceUsed': '3 (F1)',
            #          'sctpEndpointRef': F'Transport=1,SctpEndpoint=F1_NRCUCP'}
            #     ]

            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('GNBCUCPFunction', self.node, self.gnbdata['GNBCUCP'], '1')
            tmp_dict |= {
                'gNBCUCPFunctionId': '1',
                'gNBCUName': '1',
                'gNBId': self.gnbdata["nodeid"],
                'gNBIdLength': self.gnbdata['gnbidlength'],
                'endpointResourceRef': '',
                # 'endpointResourceRef': 'GNBCUCPFunction=1,EndpointResource=1',
                'EndpointResource': {'attributes': {'xc:operation': 'create'}, 'endpointResourceId': '1', 'LocalSctpEndpoint': sctp},
            }
            self.mo_dict['GNBCUCP'] = {'managedElementId': self.node, 'GNBCUCPFunction': copy.deepcopy(tmp_dict)}
            self.mo_dict['GNBCUCP_endpoint'] = {'managedElementId': self.node, 'GNBCUCPFunction': {
                'attributes': {'xc:operation': 'update'}, 'gNBCUCPFunctionId': '1', 'endpointResourceRef': 'GNBCUCPFunction=1,EndpointResource=1'}}
