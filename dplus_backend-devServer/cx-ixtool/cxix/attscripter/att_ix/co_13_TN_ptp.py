import copy
from .att_xml_base import att_xml_base


class co_13_TN_ptp(att_xml_base):
    def create_rpc_msg(self):
        if self.enbdata.get('ptp_ip', self.gnbdata.get('ptp_ip', None)) in [None, 'None', '', '""']: return
        self.motype = 'default'
        node = self.enbdata if len(self.enbdata) > 0 and self.enbdata.get("ptp_ip", None) is not None else self.gnbdata
        self.mo_dict['ptp'] = {
            'managedElementId': self.node,
            'Transport': {
                'transportId': '1',
                'VlanPort': {'attributes': {'xc:operation': 'create'}, 'vlanPortId': 'PTP', 'isTagged': 'true', 'lowLatencySwitching': 'false',
                             'vlanId': F'{node["ptp_vlan"]}', 'userLabel': 'PTP', 'encapsulation': F'Transport=1,EthernetPort={node["TnPort"]}'},
                'Router': {'attributes': {'xc:operation': 'create'}, 'routerId': 'PTP', 'hopLimit': '64', 'pathMtuExpiresIPv6': '86400', 'ttl': '64',
                           'InterfaceIPv4': {'attributes': {'xc:operation': 'create'},  'interfaceIPv4Id': '1', 'arpTimeout': '300',
                                             'mtu': '1500', 'pcpArp': '6', 'encapsulation': 'Transport=1,VlanPort=PTP',
                                             'AddressIPv4': {'attributes': {'xc:operation': 'create'}, 'addressIPv4Id': '1',
                                                             'address': F'{ node["ptp_ip"]}/30', 'configurationMode': '0 (MANUAL)',
                                                             'dhcpClientIdentifierType': '0 (AUTOMATIC)'}},
                           'RouteTableIPv4Static': {'attributes': {'xc:operation': 'create'}, 'routeTableIPv4StaticId': '1',
                                                    'Dst': {'attributes': {'xc:operation': 'create'}, 'dstId': '1', 'dst': '0.0.0.0/0',
                                                            'NextHop': {'attributes': {'xc:operation': 'create'}, 'nextHopId': '1',
                                                                        'address': node['ptp_gway'], 'adminDistance': '1',
                                                                        'bfdMonitoring': 'true'}}}},
                'Ptp': {'attributes': {'xc:operation': 'create'}, 'ptpId': '1',
                        'BoundaryOrdinaryClock': {'attributes': {'xc:operation': 'create'}, 'boundaryOrdinaryClockId': 'PTP',
                                                  'clockType': '2 (SLAVE_ONLY_ORDINARY_CLOCK)',
                                                  'domainNumber': '0', 'priority1': '255', 'priority2': '255', 'ptpProfile': '3 (G_8265_1)',
                                                  'PtpBcOcPort': {'attributes': {'xc:operation': 'create'}, 'ptpBcOcPortId': '1',
                                                                  'administrativeState': '1 (UNLOCKED)', 'announceMessageInterval': '1',
                                                                  'associatedGrandmaster': node['ptp_server'], 'asymmetryCompensation': '0',
                                                                  'dscp': '54', 'durationField': '300', 'localPriority': '128',
                                                                  'masterOnly': 'false', 'pBit': '1', 'ptpMulticastAddress': '0 (FORWARDABLE)',
                                                                  'transportInterface': F'Transport=1,Router=PTP,InterfaceIPv4=1,AddressIPv4=1'}}},
                'Synchronization': {
                    'synchronizationId': '1',
                    'RadioEquipmentClock': {
                        'radioEquipmentClockId': '1',
                        'RadioEquipmentClockReference': {
                            'attributes': {'xc:operation': 'create'},
                            'radioEquipmentClockReferenceId': 'PTP',
                            'adminQualityLevel': {'qualityLevelValueOptionI': '2 (SSU_A)', 'qualityLevelValueOptionII': '2 (STU)',
                                                  'qualityLevelValueOptionIII': '1 (UNK)'},
                            'administrativeState': '1 (UNLOCKED)', 'encapsulation': 'Transport=1,Ptp=1,BoundaryOrdinaryClock=PTP',
                            'holdOffTime': '1000', 'priority': '2', 'useQLFrom': '1 (RECEIVED_QL)', 'waitToRestoreTime': '60'}}}
            },
            'SystemFunctions': {'systemFunctionsId': '1', 'Lm': {'lmId': '1', 'FeatureState': [{
                'attributes': {'xc:operation': 'update'}, 'featureStateId': 'CXC4040007', 'featureState': '1 (ACTIVATED)'}]}},
        }
        if len(self.enbdata) > 0:
            self.mo_dict['ptp']['SystemFunctions']['Lm']['FeatureState'].append({
                'attributes': {'xc:operation': 'update'}, 'featureStateId': 'CXC4040008', 'featureState': '1 (ACTIVATED)'})
