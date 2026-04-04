from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class nr_01a_Transport(tmo_xml_base):
    def initialize_var(self):
        if not self.gnbdata.get('mmbb'):
            self.script_elements.extend([self.rcp_msg_capabilities(), self.create_rpc_msg(), self.rcp_msg_close()])

    def create_rpc_msg(self):
        doc, config = self.main_rcp_msg_start('tn')
        DscpPcpMap_dict, _ = self.get_mo_dict_for_id_tag('DscpPcpMap', '1')
        SctpProfile_1, _ = self.get_mo_dict_for_id_tag('SctpProfile', '1')
        SctpProfile_Node_Internal_F1, _ = self.get_mo_dict_for_id_tag('SctpProfile', 'Node_Internal_F1')

        Synchronization, _ = self.get_mo_dict_for_id_tag('Synchronization', '1')
        Synchronization['RadioEquipmentClock'], _ = self.get_mo_dict_for_id_tag('RadioEquipmentClock', '1')
        Synchronization['RadioEquipmentClock']['RadioEquipmentClockReference'], _ = \
            self.get_mo_dict_for_id_tag('RadioEquipmentClockReference', '1')
        Synchronization['TimeSyncIO'], _ = self.get_mo_dict_for_id_tag('TimeSyncIO', '1')
        Synchronization['TimeSyncIO']['encapsulation'] = F'Equipment=1,FieldReplaceableUnit={self.gnbdata["bbuid"]},SyncPort=1'
        Synchronization['TimeSyncIO']['GnssInfo'], _ = self.get_mo_dict_for_id_tag('GnssInfo', '1')

        NR_Router = {
            'routerId': 'Node_Internal_F1',
            'InterfaceIPv4': [
                {'interfaceIPv4Id': 'NRCUCP', 'loopback': 'true', 'AddressIPv4': {'addressIPv4Id': 1, 'address': '169.254.42.42/32'}},
                {'interfaceIPv4Id': 'NRDU', 'loopback': 'true', 'AddressIPv4': {'addressIPv4Id': 1, 'address': '169.254.42.43/32'}}
            ]
        }
        InterfaceIPv4_OAM = {'interfaceIPv4Id': 1, 'egressQosMarking': 'Transport=1,QosProfiles=1,DscpPcpMap=1'}
        InterfaceIPv4_LTE = {'interfaceIPv4Id': self.enbdata.get("lte_interface", ""),
                             'egressQosMarking': 'Transport=1,QosProfiles=1,DscpPcpMap=1'}
        InterfaceIPv4_NR = {'interfaceIPv4Id': self.gnbdata.get("lte_interface", ""),
                            'egressQosMarking': 'Transport=1,QosProfiles=1,DscpPcpMap=1'}

        SctpEndpoint_LTE, _ = self.get_mo_dict_for_id_tag('SctpEndpoint', 'LTE')
        SctpEndpoint_LTE.update({
            'sctpEndpointId': 'LTE', 'portNumber': '36422', 'sctpProfile': 'Transport=1,SctpProfile=1',
            'localIpAddress':
                F'Transport=1,Router={self.enbdata.get("lte", "")},InterfaceIPv4={self.enbdata.get("lte_interface", "")},AddressIPv4=1'})

        SctpEndpoint_NR_X2, _ = self.get_mo_dict_for_id_tag('SctpEndpoint', 'NR_X2')
        SctpEndpoint_NR_X2.update({
            'sctpEndpointId': 'NR_X2', 'portNumber': '36422', 'sctpProfile': 'Transport=1,SctpProfile=1',
            'localIpAddress':
                F'Transport=1,Router={self.gnbdata.get("lte", "")},InterfaceIPv4={self.gnbdata.get("lte_interface", "")},AddressIPv4=1'})
        SctpEndpoint_NR_N2, _ = self.get_mo_dict_for_id_tag('SctpEndpoint', 'NR_N2')
        SctpEndpoint_NR_N2.update({
            'sctpEndpointId': 'NR_N2', 'portNumber': '38412', 'sctpProfile': 'Transport=1,SctpProfile=1',
            'localIpAddress':
                F'Transport=1,Router={self.gnbdata.get("lte", "")},InterfaceIPv4={self.gnbdata.get("lte_interface", "")},AddressIPv4=1'})
        SctpEndpoint_NR_Xn, _ = self.get_mo_dict_for_id_tag('SctpEndpoint', 'NR_Xn')
        SctpEndpoint_NR_Xn.update({
            'sctpEndpointId': 'NR_Xn', 'portNumber': '38422', 'sctpProfile': 'Transport=1,SctpProfile=1',
            'localIpAddress':
                F'Transport=1,Router={self.gnbdata.get("lte", "")},InterfaceIPv4={self.gnbdata.get("lte_interface", "")},AddressIPv4=1'})
        SctpEndpoint_F1_NRCUCP, _ = self.get_mo_dict_for_id_tag('SctpEndpoint', 'F1_NRCUCP')
        SctpEndpoint_F1_NRCUCP.update({
            'sctpEndpointId': 'F1_NRCUCP', 'portNumber': '38472', 'sctpProfile': 'Transport=1,SctpProfile=Node_Internal_F1',
            'localIpAddress': F'Transport=1,Router=Node_Internal_F1,InterfaceIPv4=NRCUCP,AddressIPv4=1'})
        SctpEndpoint_F1_NRDU, _ = self.get_mo_dict_for_id_tag('SctpEndpoint', 'F1_NRDU')
        SctpEndpoint_F1_NRDU.update({
            'sctpEndpointId': 'F1_NRDU', 'portNumber': '38472', 'sctpProfile': 'Transport=1,SctpProfile=Node_Internal_F1',
            'localIpAddress': F'Transport=1,Router=Node_Internal_F1,InterfaceIPv4=NRDU,AddressIPv4=1'})

        tmp_dict = {
            'managedElementId': self.node, 'userLabel': self.node,
            'Transport': {
                'transportId': 1,
                'QosProfiles': {'qosProfilesId': 1, 'DscpPcpMap': DscpPcpMap_dict},
                'Router': [
                    {'routerId': self.gnbdata.get('oam', ''), 'InterfaceIPv4': InterfaceIPv4_OAM},
                    {'routerId': self.gnbdata.get('lte', ''), 'InterfaceIPv4': InterfaceIPv4_NR},
                    NR_Router,
                ],
                'SctpProfile': [SctpProfile_1, SctpProfile_Node_Internal_F1],
                'SctpEndpoint': [SctpEndpoint_NR_X2, SctpEndpoint_NR_N2, SctpEndpoint_NR_Xn, SctpEndpoint_F1_NRCUCP, SctpEndpoint_F1_NRDU],
                'Synchronization': [Synchronization],
            },
        }

        if self.gnbdata.get('mmbb'):
            tmp_dict['Transport']['SctpProfile'].extend([SctpProfile_Node_Internal_F1])
            tmp_dict['Transport']['SctpEndpoint'].extend([SctpEndpoint_LTE])
            tmp_dict['Transport']['Router'].extend([NR_Router, {'routerId': self.enbdata['lte'], 'InterfaceIPv4': InterfaceIPv4_LTE}])

        if len(self.gnbdata.keys()) > 0:
            tmp_dict.update({'NodeSupport': {'nodeSupportId': '1'}})

        config.appendChild(self.mo_add_form_dict_xml(tmp_dict, 'ManagedElement'))
        for aa in doc.getElementsByTagName("loopback"): aa.firstChild.nodeValue = ''

        return doc
