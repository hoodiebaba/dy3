from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class lte_01_Transport(tmo_xml_base):
    def initialize_var(self):
        if self.enbdata.get('equ_change'):
            self.script_elements.extend([self.rcp_msg_capabilities(), self.create_rpc_msg(), self.rcp_msg_close()])

    def create_rpc_msg(self):
        DscpPcpMap, _ = self.get_mo_dict_for_id_tag('DscpPcpMap', '1')
        SctpProfile_LTE, _ = self.get_mo_dict_for_id_tag('SctpProfile', '1')
        SctpProfile_Node_Internal_F1, _ = self.get_mo_dict_for_id_tag('SctpProfile', 'Node_Internal_F1')

        Synchronization, _ = self.get_mo_dict_for_id_tag('Synchronization', '1')
        Synchronization['RadioEquipmentClock'], _ = self.get_mo_dict_for_id_tag('RadioEquipmentClock', '1')
        Synchronization['RadioEquipmentClock']['RadioEquipmentClockReference'], _ = \
            self.get_mo_dict_for_id_tag('RadioEquipmentClockReference', '1')
        Synchronization['TimeSyncIO'], _ = self.get_mo_dict_for_id_tag('TimeSyncIO', '1')
        Synchronization['TimeSyncIO']['encapsulation'] = F'Equipment=1,FieldReplaceableUnit={self.enbdata["bbuid"]},SyncPort=1'
        Synchronization['TimeSyncIO']['GnssInfo'], _ = self.get_mo_dict_for_id_tag('GnssInfo', '1')

        egressQosMarking_nroam = {
            'routerId': self.gnbdata.get("oam", ""),
            'InterfaceIPv4': {'interfaceIPv4Id': 1, 'egressQosMarking': 'Transport=1,QosProfiles=1,DscpPcpMap=1'}
        }
        egressQosMarking_nr = {
            'routerId': self.gnbdata.get("lte", ""),
            'InterfaceIPv4': {
                'interfaceIPv4Id': self.gnbdata.get("lte_interface", ""),
                'egressQosMarking': 'Transport=1,QosProfiles=1,DscpPcpMap=1'
            }
        }
        nr_barrer_router_mmbb = {
            'routerId': self.gnbdata.get("lte", ""),
            'InterfaceIPv4': {
                'interfaceIPv4Id': self.gnbdata.get("lte_interface", ""),
                'loopback': 'true',
                'AddressIPv4': {'addressIPv4Id': 1, 'address': F'{self.gnbdata.get("lte_ip", "")}/{self.gnbdata.get("lte_plength", "")}'}}}
        NR_Router = {
            'routerId': 'Node_Internal_F1',
            'InterfaceIPv4': [
                {'interfaceIPv4Id': 'NRCUCP', 'loopback': 'true', 'AddressIPv4': {'addressIPv4Id': 1, 'address': '169.254.42.42/32'}},
                {'interfaceIPv4Id': 'NRDU', 'loopback': 'true', 'AddressIPv4': {'addressIPv4Id': 1, 'address': '169.254.42.43/32'}}
            ]
        }

        egressQosMarking_lteoam = {
            'routerId': self.enbdata.get("oam", ""),
            'InterfaceIPv4': {'interfaceIPv4Id': 1, 'egressQosMarking': 'Transport=1,QosProfiles=1,DscpPcpMap=1'}
        }
        egressQosMarking_lte = {
            'routerId': self.enbdata.get("lte", ""),
            'InterfaceIPv4': {'interfaceIPv4Id': self.enbdata.get("lte_interface", ""), 'egressQosMarking': 'Transport=1,QosProfiles=1,DscpPcpMap=1'}
        }
        lte_barrer_router_mmbb = {
            'routerId': self.enbdata.get("lte", ""),
            'InterfaceIPv4': {
                'interfaceIPv4Id': self.enbdata.get("lte_interface", ""),
                'loopback': 'true',
                'AddressIPv4': {'addressIPv4Id': 1, 'address': F'{self.enbdata.get("lte_ip", "")}/{self.enbdata.get("lte_plength", "")}'}}}
        lte_barrer_router_mmbb_bridge = {
            'routerId': self.enbdata.get("lte", ""),
            'InterfaceIPv4': {
                'interfaceIPv4Id': self.enbdata.get("lte_interface", ""),
                'routesHoldDownTimer': 180,
                'encapsulation': F'ManagedElement=1,Transport=1,Bridge=1',
                'egressQosMarking': 'Transport=1,QosProfiles=1,DscpPcpMap=1',
                'AddressIPv4': {'addressIPv4Id': 1, 'address': F'{self.enbdata.get("lte_ip", "")}/{self.enbdata.get("lte_plength", "")}'}
            },
            'RouteTableIPv4Static': {
                'routeTableIPv4StaticId': 1,
                'Dst': {'dstId': 1, 'dst': '0.0.0.0/0',
                        'NextHop': {'nextHopId': 1, 'adminDistance': 10, 'address': self.enbdata.get('lte_gway', '')}}
            }
        }

        SctpEndpoint_LTE, _ = self.get_mo_dict_for_id_tag('SctpEndpoint', 'LTE')
        SctpEndpoint_LTE.update({
            'sctpEndpointId': 'LTE', 'portNumber': '36422', 'sctpProfile': 'Transport=1,SctpProfile=1',
            'localIpAddress':
                F'Transport=1,Router={self.enbdata.get("lte", "")},InterfaceIPv4={self.enbdata.get("lte_interface", "")},AddressIPv4=1'})

        SctpEndpoint_NR_X2, _ = self.get_mo_dict_for_id_tag('SctpEndpoint', 'NR_X2')
        SctpEndpoint_NR_X2.update({
            'sctpEndpointId': 'NR_X2', 'portNumber': '36422', 'sctpProfile': 'Transport=1,SctpProfile=1',
            'localIpAddress':
                F'Transport=1,Router={self.gnbdata.get("lte", "")},InterfaceIPv4={self.gnbdata.get("lte_interface" , "")},AddressIPv4=1'})
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
                'QosProfiles': {'qosProfilesId': 1, 'DscpPcpMap': DscpPcpMap},
                'Router': [],
                'Synchronization': Synchronization,
                'SctpProfile': [SctpProfile_LTE],
                'SctpEndpoint': [SctpEndpoint_LTE],
            },
        }

        if self.enbdata.get("mmbb", False):
            tmp_dict['Transport']['SctpProfile'].extend([SctpProfile_Node_Internal_F1])
            tmp_dict['Transport']['SctpEndpoint'].extend([SctpEndpoint_NR_X2, SctpEndpoint_NR_N2, SctpEndpoint_NR_Xn,
                                                          SctpEndpoint_F1_NRCUCP, SctpEndpoint_F1_NRDU])
            tmp_dict['Transport']['Router'].extend([NR_Router])
            if self.enbdata.get("mmbb", False):
                if self.enbdata.get('lte_plength', "") != '32' and self.gnbdata.get('lte_plength', "") != '32':
                    tmp_dict['Transport']['Router'].extend([egressQosMarking_nroam, egressQosMarking_nr, lte_barrer_router_mmbb_bridge])
                elif self.enbdata.get('lte_plength', "") != '32' and self.gnbdata.get('lte_plength', "") == '32':
                    tmp_dict['Transport']['Router'].extend([egressQosMarking_lteoam, egressQosMarking_lte, nr_barrer_router_mmbb])
                elif self.enbdata.get('lte_plength', "") == '32' and self.gnbdata.get('lte_plength', "") != '32':
                    tmp_dict['Transport']['Router'].extend([egressQosMarking_nroam, egressQosMarking_nr, lte_barrer_router_mmbb])
        else: tmp_dict['Transport']['Router'].extend([egressQosMarking_lteoam, egressQosMarking_lte])

        if len(self.usid.gnodeb.keys()) > 0:
            tmp_dict.update({'NodeSupport': {'nodeSupportId': '1'}})

        doc, config = self.main_rcp_msg_start('transport')
        config.appendChild(self.mo_add_form_dict_xml(tmp_dict, 'ManagedElement'))
        for aa in doc.getElementsByTagName("loopback"): aa.firstChild.nodeValue = ''
        return doc
