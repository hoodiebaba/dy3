import copy
from .att_xml_base import att_xml_base


class co_12_TN_transport(att_xml_base):
    def create_rpc_msg(self):
        self.motype = 'default'
        self.s_flag = True
        self.sctpprofile_flag = True
        self.mo_dict['tn'] = {
            'managedElementId': self.node,
            'Transport': {
                'transportId': '1',
                'BfdProfile': [],
                'QosProfiles': [],
                'VlanPort': [],
                'Router': [],
                'SctpProfile': [],
                'SctpEndpoint': [],
            }
        }
        if len(self.enbdata) > 0 and (self.enbdata["Lrat"] is None or self.eq_flag):
            self.s_flag = False
            self.get_lte_transport_data()
        if len(self.gnbdata) > 0 and (self.gnbdata["GNBDU"] is None or self.eq_flag):
            self.s_flag = False
            self.get_nr_transport_data()
        if self.s_flag:
            del self.mo_dict['tn']

    def get_lte_transport_data(self):
        lte_ip_mo = F'Transport=1,Router={self.enbdata["lte"]},InterfaceIPv6={self.enbdata["lte_interface"]},AddressIPv6={self.enbdata["lte_add"]}'
        self.mo_dict['tn']['Transport']['BfdProfile'].append(self.get_db_dict_with_cr_for_mo_moid('BfdProfile', '1'))
        self.mo_dict['tn']['Transport']['QosProfiles'] = {'qosProfilesId': '1',
                                                          'DscpPcpMap': copy.deepcopy(self.get_db_dict_with_cr_for_mo_moid('DscpPcpMap', '1'))}
        if self.sctpprofile_flag:
            SctpProfile = self.get_db_dict_with_cr_for_mo_moid('SctpProfile', '1')
            SctpProfile['sctpProfileId'] = self.enbdata["sctpprofile"]
            self.mo_dict['tn']['Transport']['SctpProfile'].append(copy.deepcopy(SctpProfile))
            self.sctpprofile_flag = False
        
        SctpEndpoint = self.get_db_dict_with_cr_for_mo_moid('SctpEndpoint', '1')
        SctpEndpoint |= {'sctpEndpointId': self.enbdata["sctpendpoint"], 'localIpAddress': lte_ip_mo, 'portNumber': '36422',
                         'sctpProfile': F'Transport=1,SctpProfile={self.enbdata["sctpprofile"]}'}
        self.mo_dict['tn']['Transport']['SctpEndpoint'].append(copy.deepcopy(SctpEndpoint))
        
        if self.eq_flag is False and len(self.gnbdata) > 0:
            nexthop_id = 'LTE'
            tmp_dict = self.get_db_dict_with_cr_for_mo_moid('VlanPort', self.enbdata['lte_vlanid'])
            tmp_dict |= {'attributes': {'xc:operation': 'create'}, 'vlanPortId': self.enbdata['lte_vlanid'], 'vlanId': self.enbdata['lte_vlan'],
                         'encapsulation': F'Transport=1,EthernetPort={self.enbdata["TnPort"]}'}
            self.mo_dict['tn']['Transport']['VlanPort'].append({
                'attributes': {'xc:operation': 'create'}, 'vlanPortId': self.enbdata['lte_vlanid'], 'vlanId': self.enbdata['lte_vlan'],
                'encapsulation': F'Transport=1,EthernetPort={self.enbdata["TnPort"]}'
            })
            self.mo_dict['tn']['Transport']['Router'].append({
                'routerId': self.enbdata["oam"],
                'InterfaceIPv6': {'attributes': {'xc:operation': 'update'}, 'interfaceIPv6Id': self.enbdata["oam_interface"],
                                  'egressQosMarking': F'Transport=1,QosProfiles=1,DscpPcpMap=1'}
            })
            self.mo_dict['tn']['Transport']['Router'].append({
                'routerId': self.enbdata['lte'],
                'InterfaceIPv6': {'attributes': {'xc:operation': 'create'}, 'interfaceIPv6Id': self.enbdata['lte_interface'],
                                  'encapsulation': F'Transport=1,VlanPort={self.enbdata["lte_vlanid"]}',
                                  'egressQosMarking': F'Transport=1,QosProfiles=1,DscpPcpMap=1',
                                  'AddressIPv6': {'attributes': {'xc:operation': 'create'}, 'addressIPv6Id': self.enbdata['lte_add'],
                                                  'address': F'{self.enbdata["lte_ip"]}/64'}},
                'RouteTableIPv6Static': {'attributes': {'xc:operation': 'create'}, 'routeTableIPv6StaticId': '1',
                                         'Dst': {'attributes': {'xc:operation': 'create'}, 'dstId': '1', 'dst': '::/0',
                                                 'NextHop': {'attributes': {'xc:operation': 'create'}, 'nextHopId': nexthop_id,
                                                             'adminDistance': self.enbdata["lte_dist"], 'address': self.enbdata['lte_gway']}}},
                'TwampResponder': [{'attributes': {'xc:operation': 'create'}, 'twampResponderId': F'{_}',
                                    'udpPort': F'400{_}', 'ipAddress': lte_ip_mo} for _ in range(1, 5)],
            })
        else:
            self.mo_dict['tn']['Transport']['Router'].append({
                'routerId': self.enbdata["oam"],
                'InterfaceIPv6': {'attributes': {'xc:operation': 'update'}, 'interfaceIPv6Id': self.enbdata["oam_interface"],
                                  'egressQosMarking': F'Transport=1,QosProfiles=1,DscpPcpMap=1'}
            })
            self.mo_dict['tn']['Transport']['Router'].append({
                'routerId': self.enbdata["lte"],
                'InterfaceIPv6': {'attributes': {'xc:operation': 'update'}, 'interfaceIPv6Id': self.enbdata["lte_interface"],
                                  'egressQosMarking': F'Transport=1,QosProfiles=1,DscpPcpMap=1'},
                'TwampResponder': [{'attributes': {'xc:operation': 'create'}, 'twampResponderId': F'{_}',
                                    'udpPort': F'400{_}', 'ipAddress': lte_ip_mo} for _ in range(1, 5)],
            })

    def get_nr_transport_data(self):
        lte_ip_mo = F'Transport=1,Router={self.gnbdata["lte"]},InterfaceIPv6={self.gnbdata["lte_interface"]},AddressIPv6={self.gnbdata["lte_add"]}'
        self.mo_dict['tn']['Transport']['SctpProfile'].append({
            'attributes': {'xc:operation': 'create'}, 'sctpProfileId': 'Node_Internal_F1',
            'maxSctpPduSize': '0', 'bundlingTimer': '0', 'hbMaxBurst': '1', 'initialHeartbeatInterval': '500',
            'maxInStreams': '2', 'maxOutStreams': '2', 'noSwitchback': 'true', 'pathMaxRtx': '10',
            'primaryPathMaxRtx': '0', 'sackTimer': '10', 'transmitBufferSize': '64'
        })
        self.mo_dict['tn']['Transport']['SctpEndpoint'].extend([
            {'attributes': {'xc:operation': 'create'}, 'sctpEndpointId': 'F1_NRCUCP', 'portNumber': '38472',
             'sctpProfile': 'Transport=1,SctpProfile=Node_Internal_F1',
             'localIpAddress': 'Transport=1,Router=Node_Internal_F1,InterfaceIPv4=NRCUCP,AddressIPv4=1'},
            {'attributes': {'xc:operation': 'create'}, 'sctpEndpointId': 'F1_NRDU', 'portNumber': '38472',
             'sctpProfile': 'Transport=1,SctpProfile=Node_Internal_F1',
             'localIpAddress': 'Transport=1,Router=Node_Internal_F1,InterfaceIPv4=NRDU,AddressIPv4=1'}
        ])
        self.mo_dict['tn']['Transport']['Router'].append({
            'attributes': {'xc:operation': 'create'}, 'routerId': 'Node_Internal_F1',
            'InterfaceIPv4': [
                {'attributes': {'xc:operation': 'create'}, 'interfaceIPv4Id': 'NRCUCP', 'loopback': 'true',
                 'AddressIPv4': {'attributes': {'xc:operation': 'create'}, 'address': '169.254.42.42/32', 'addressIPv4Id': '1'}},
                {'attributes': {'xc:operation': 'create'}, 'interfaceIPv4Id': 'NRDU', 'loopback': 'true',
                 'AddressIPv4': {'attributes': {'xc:operation': 'create'}, 'address': '169.254.42.43/32', 'addressIPv4Id': '1'}}
            ],
        })

        if self.sctpprofile_flag:
            SctpProfile = self.get_db_dict_with_cr_for_mo_moid('SctpProfile', self.gnbdata['sctpprofile'])
            SctpProfile |= {'attributes': {'xc:operation': 'create'}, 'sctpProfileId': self.gnbdata['sctpprofile']}
            if len(self.df_gnb_cell.loc[(self.df_gnb_cell.freqband.str.upper() == 'N077')].index) == 0:
                SctpProfile |= {'assocMaxRtx': '20', 'bundlingTimer': '0', 'hbMaxBurst': '1', 'initialHeartbeatInterval': '500',
                                'maxInStreams': '2', 'maxOutStreams': '2', 'noSwitchback': 'true', 'pathMaxRtx': '10',
                                'primaryPathMaxRtx': '0', 'sackTimer': '10', 'transmitBufferSize': '64'}
            self.mo_dict['tn']['Transport']['SctpProfile'].append(copy.deepcopy(SctpProfile))
            self.sctpprofile_flag = False
        
        SctpEndpoint = self.get_db_dict_with_cr_for_mo_moid('SctpEndpoint', '1')
        SctpEndpoint |= {'attributes': {'xc:operation': 'create'}, 'sctpEndpointId': self.gnbdata['sctpendpoint'], 'portNumber': '36422',
                         'localIpAddress': lte_ip_mo, 'userLabel': 'X2', 'sctpProfile': F'Transport=1,SctpProfile={self.gnbdata["sctpprofile"]}'}
        self.mo_dict['tn']['Transport']['SctpEndpoint'].append(copy.deepcopy(SctpEndpoint))
        if len(self.df_gnb_cell.loc[self.df_gnb_cell.freqband.str.upper() == 'N077'].index) > 0:
            SctpEndpoint_NG = copy.deepcopy(SctpEndpoint)
            SctpEndpoint_NG |= {'sctpEndpointId': '1', 'portNumber': '38412', 'userLabel': 'NG'}
            self.mo_dict['tn']['Transport']['SctpEndpoint'].append(copy.deepcopy(SctpEndpoint_NG))
            SctpEndpoint_XN = copy.deepcopy(SctpEndpoint)
            SctpEndpoint_XN |= {'sctpEndpointId': '2', 'portNumber': '38422', 'userLabel': 'XN'}
            self.mo_dict['tn']['Transport']['SctpEndpoint'].append(copy.deepcopy(SctpEndpoint_XN))
            # SctpEndpoint_X2 = copy.deepcopy(SctpEndpoint)
            # SctpEndpoint_X2 |= {'sctpEndpointId': F'{sctp_end_nr_2 + 1}', 'portNumber': '36422', 'userLabel': 'X2',
            #                  'sctpProfile': F'Transport=1,SctpProfile={sctp_prof_nr_2}'}
            # self.mo_dict['tn']['Transport']['SctpEndpoint'].append(copy.deepcopy(SctpEndpoint_X2))

        # SctpProfile = self.get_db_dict_with_cr_for_mo_moid('SctpProfile', self.gnbdata['sctpprofile'])
        # SctpProfile |= {'attributes': {'xc:operation': 'create'}, 'sctpProfileId': self.gnbdata['sctpprofile']}
        # SctpProfile |= {'assocMaxRtx': '20', 'bundlingTimer': '0', 'hbMaxBurst': '1', 'initialHeartbeatInterval': '500',
        #                 'maxInStreams': '2', 'maxOutStreams': '2', 'noSwitchback': 'true', 'pathMaxRtx': '10',
        #                 'primaryPathMaxRtx': '0', 'sackTimer': '10', 'transmitBufferSize': '64'}
        # self.mo_dict['tn']['Transport']['SctpProfile'].append(copy.deepcopy(SctpProfile))
        #
        # SctpEndpoint = self.get_db_dict_with_cr_for_mo_moid('SctpEndpoint', '1')
        # SctpEndpoint |= {'attributes': {'xc:operation': 'create'}, 'sctpEndpointId': self.gnbdata['sctpendpoint'], 'portNumber': '36422',
        #                  'localIpAddress': lte_ip_mo, 'userLabel': 'X2', 'sctpProfile': F'Transport=1,SctpProfile={self.gnbdata["sctpprofile"]}'}
        # self.mo_dict['tn']['Transport']['SctpEndpoint'].append(copy.deepcopy(SctpEndpoint))
        #
        # # 1:4 (NG) --- 38412      2:6 (XN) --- 38422    3:7 (X2) --- 36422        4:3 (F1) --- 38472
        # if len(self.df_gnb_cell.loc[self.df_gnb_cell.freqband.str.upper() == 'N077'].index) > 0:
        #     try: a = int(self.gnbdata["sctpprofile"])
        #     except: a = 1
        #     try: b = int(self.enbdata.get("sctpprofile", "1"))
        #     except: b = 1
        #     sctp_prof_nr_2 = max(a, b) + 1
        #     try: a = int(self.gnbdata["sctpendpoint"])
        #     except: a = 1
        #     try: b = int(self.enbdata.get("sctpendpoint", "1"))
        #     except: b = 1
        #     sctp_end_nr_2 = max(a, b) + 1
        #     SctpProfile_1 = copy.deepcopy(SctpProfile)
        #     SctpProfile_1 |= {
        #         'assocMaxRtx': '8', 'bundlingTimer': '10', 'hbMaxBurst': '0', 'initialHeartbeatInterval': '1000',
        #         'maxInStreams': '17', 'maxOutStreams': '17', 'maxSctpPduSize': '1460', 'noSwitchback': 'false', 'pathMaxRtx': '4',
        #         'primaryPathMaxRtx': '4', 'sackTimer': '40', 'transmitBufferSize': '256', 'userLabel': '1'
        #     }
        #     self.mo_dict['tn']['Transport']['SctpProfile'].append(copy.deepcopy(SctpProfile_1))
        #     SctpProfile |= {'maxSctpPduSize': '0', 'sctpProfileId': F'{sctp_prof_nr_2}'}
        #     self.mo_dict['tn']['Transport']['SctpProfile'].append(copy.deepcopy(SctpProfile))
        #
        #     SctpEndpoint_NG = copy.deepcopy(SctpEndpoint)
        #     SctpEndpoint_NG |= {'sctpEndpointId': self.gnbdata['sctpendpoint'], 'portNumber': '38412', 'userLabel': 'NG'}
        #     self.mo_dict['tn']['Transport']['SctpEndpoint'].append(copy.deepcopy(SctpEndpoint_NG))
        #     SctpEndpoint_XN = copy.deepcopy(SctpEndpoint)
        #     SctpEndpoint_XN |= {'sctpEndpointId': F'{sctp_end_nr_2}', 'portNumber': '38422', 'userLabel': 'XN'}
        #     self.mo_dict['tn']['Transport']['SctpEndpoint'].append(copy.deepcopy(SctpEndpoint_XN))
        #     SctpEndpoint_X2 = copy.deepcopy(SctpEndpoint)
        #     SctpEndpoint_X2 |= {'sctpEndpointId': F'{sctp_end_nr_2 + 1}', 'portNumber': '36422', 'userLabel': 'X2',
        #                      'sctpProfile': F'Transport=1,SctpProfile={sctp_prof_nr_2}'}
        #     self.mo_dict['tn']['Transport']['SctpEndpoint'].append(copy.deepcopy(SctpEndpoint_X2))
        # else:
        #     self.mo_dict['tn']['Transport']['SctpProfile'].append(copy.deepcopy(SctpProfile))
        #     self.mo_dict['tn']['Transport']['SctpEndpoint'].append(copy.deepcopy(SctpEndpoint))

        if len(self.enbdata) > 0 and (self.eq_flag or self.gnbdata["GNBDU"] is None):
            nexthop_id = 'NR'
            self.mo_dict['tn']['Transport']['VlanPort'].append({
                'attributes': {'xc:operation': 'create'}, 'vlanPortId': self.gnbdata['lte_vlanid'], 'vlanId': self.gnbdata['lte_vlan'],
                'encapsulation': F'Transport=1,EthernetPort={self.gnbdata["TnPort"]}'})
            self.mo_dict['tn']['Transport']['Router'].append({
                'attributes': {'xc:operation': 'create'}, 'routerId': self.gnbdata['lte'],
                'InterfaceIPv6': {'attributes': {'xc:operation': 'create'}, 'interfaceIPv6Id': self.gnbdata['lte_interface'],
                                  'encapsulation': F'Transport=1,VlanPort={self.gnbdata["lte_vlanid"]}',
                                  'AddressIPv6': {'attributes': {'xc:operation': 'create'}, 'addressIPv6Id': self.gnbdata['lte_add'],
                                                  'address': F'{self.gnbdata["lte_ip"]}/64'}},
                'RouteTableIPv6Static': {'attributes': {'xc:operation': 'create'}, 'routeTableIPv6StaticId': '1',
                                         'Dst': {'attributes': {'xc:operation': 'create'}, 'dstId': '1', 'dst': '::/0',
                                                 'NextHop': {'attributes': {'xc:operation': 'create'}, 'nextHopId': nexthop_id,
                                                             'adminDistance': self.gnbdata['lte_dist'], 'address': self.gnbdata['lte_gway']}}},
                'TwampResponder': [{'attributes': {'xc:operation': 'create'}, 'twampResponderId': F'{_}', 'udpPort': F'400{_}',
                                    'ipAddress': lte_ip_mo} for _ in range(1, 5)]
            })
        else:
            self.mo_dict['tn']['Transport']['Router'].append({
                'routerId': self.gnbdata["lte"],
                'TwampResponder': [{'attributes': {'xc:operation': 'create'}, 'twampResponderId': F'{_}', 'udpPort': F'400{_}',
                                    'ipAddress': lte_ip_mo} for _ in range(1, 5)]})

    def special_formate_scripts(self):
        import fileinput
        import sys
        import os
        def replace_mathod(file, searchExp, replaceExp):
            for line in fileinput.input(file, inplace=1):
                line = line.replace(searchExp, replaceExp)
                sys.stdout.write(line)
        # if os.path.exists(self.relative_path[F'f_netconf']) and os.path.isfile(self.relative_path[F'f_netconf']):
        #     replace_mathod(self.relative_path[F'f_netconf'], '<loopback>true</loopback>', '<loopback/>')
