import copy
from .att_xml_base import att_xml_base


class co_11_TN_reconfig(att_xml_base):
    def create_rpc_msg(self):
        if (not self.enbdata.get('mmbb', self.gnbdata.get('mmbb', False))) or self.eq_flag or \
                (self.enbdata.get('Lrat') and self.gnbdata.get('GNBDU')): return
        elif self.enbdata.get('rou_change'): self.enodeb_mmbb_router_reconfig()
        elif self.gnbdata.get('rou_change'): self.gnodeb_mmbb_router_reconfig()

    def enodeb_mmbb_router_reconfig(self):
        node_data = self.enbdata.get
        mo_ids = self.site.get_transport_mos_id()
        ipint = F'Transport=1,Router={node_data("lte")},InterfaceIPv6={node_data("lte_interface")},AddressIPv6={node_data("lte_add")}'
        tmp_vlan = str(max([int(self.enbdata.get('lte_vlan', '50')), int(self.gnbdata.get('lte_vlan', '50'))]) + 1)
        eth_port = F'Transport=1,EthernetPort={node_data("TnPort")}'
        self.tn_dict = {'managedElementId': self.node, 'Transport': {'transportId': '1'}}

        tmp_vlan_dict = {'managedElementId': self.node, 'Transport': {
            'transportId': '1', 'VlanPort': {'vlanPortId': 'Temp1', 'vlanId': tmp_vlan, 'encapsulation': eth_port}}}
        old_router_dict = {'managedElementId': self.node, 'Transport': {'transportId': '1', 'Router': {
            'routerId': mo_ids.get('4g_lte'), 'InterfaceIPv6': {'interfaceIPv6Id': mo_ids.get('4g_lte_interface')}}}}

        vlan_dict = copy.deepcopy(tmp_vlan_dict)
        vlan_dict['Transport']['VlanPort'] |= {'attributes': {'xc:operation': 'create'}}
        self.mo_dict['create_vlan_Temp1'] = copy.deepcopy(vlan_dict)

        mo_dict = copy.deepcopy(old_router_dict)
        mo_dict['Transport']['Router']['InterfaceIPv6'] |= {
            'attributes': {'xc:operation': 'update'}, 'encapsulation': F'Transport=1,VlanPort=Temp1'}
        self.mo_dict[F'interfaceipv6_update_with_temp_vlan'] = copy.deepcopy(mo_dict)

        mo_dict = copy.deepcopy(tmp_vlan_dict)
        mo_dict['Transport']['VlanPort'] = {'attributes': {'xc:operation': 'delete'}, 'vlanPortId': mo_ids.get("4g_lte_vlanid")}
        self.mo_dict[F'delete_old_vlan_{mo_ids.get("4g_lte_vlanid")}'] = copy.deepcopy(mo_dict)
        # New Router
        self.mo_dict[F'create_new_vlan_router'] = {
            'managedElementId': self.node,
            'Transport': {
                'transportId': '1',
                'VlanPort': {'attributes': {'xc:operation': 'create'}, 'vlanPortId': F'{node_data("lte_vlanid")}',
                             'vlanId': F'{node_data("lte_vlan")}', 'encapsulation': eth_port},
                'Router': {
                    'attributes': {'xc:operation': 'create'}, 'routerId': F'{node_data("lte")}', 'hopLimit': '64', 'pathMtuExpiresIPv6': '86400',
                    'ttl': '64',
                    'InterfaceIPv6': {'attributes': {'xc:operation': 'create'}, 'interfaceIPv6Id': F'{node_data("lte_interface")}',
                                      # 'loopback': {'attributes': {'xc:operation': 'delete'}},
                                      'mtu': '1500', 'encapsulation': F'Transport=1,VlanPort={node_data("lte_vlanid")}',
                                      'AddressIPv6': {'attributes': {'xc:operation': 'create'}, 'addressIPv6Id': F'{node_data("lte_add")}',
                                                      'address': F'{node_data("lte_ip")}/64', 'configurationMode': '0 (MANUAL)'}
                                      },
                    'RouteTableIPv6Static': {'attributes': {'xc:operation': 'create'}, 'routeTableIPv6StaticId': '1',
                                             'Dst': {'attributes': {'xc:operation': 'create'}, 'dstId': '1', 'dst': '::/0',
                                                     'NextHop': {'attributes': {'xc:operation': 'create'}, 'nextHopId': 'LTE',
                                                                 'address': F'{node_data("lte_gway")}',
                                                                 'adminDistance': F'{node_data("lte_dist")}'}}},
                    'TwampResponder': [{'attributes': {'xc:operation': 'create'}, 'twampResponderId': F'{_}', 'ipAddress': ipint,
                                        'udpPort': F'400{_}'} for _ in [1, 2, 3, 4]],
                },
            }
        }
        # IPSec Configuration Migration
        ipsec = dict()
        mos_list = []
        for mo in self.site.find_mo_ending_with_parent_str(moc='DnsClient', parent=F'{node_data("me")},Transport=1,Router={mo_ids.get("4g_lte")}'):
            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('DnsClient', self.node, mo, mo.split('=')[-1])
            tmp_dict |= {'attributes': {'xc:operation': 'create'}, 'localIpAddress': ipint}
            mos_list.append(tmp_dict.copy())
        if len(mos_list) > 0: self.mo_dict[F'create_new_vlan_router']['Transport']['Router']['DnsClient'] = copy.deepcopy(mos_list)
        mos_list = []
        for mo in self.site.find_mo_ending_with_parent_str(moc='PeerIPv6', parent=F'{node_data("me")},Transport=1,Router={mo_ids.get("4g_lte")}'):
            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('PeerIPv6', self.node, mo, mo.split('=')[-1])
            tmp_dict |= {'attributes': {'xc:operation': 'create'}}
            mos_list.append(tmp_dict.copy())
            for _ in self.site.site_extract_data(mo).get('reservedBy', []):
                if ',IpsecTunnel=' in _:
                    tmp_mo = self.site.get_mo_w_end_str(_)
                    if tmp_mo not in ipsec.keys(): ipsec[tmp_mo] = {}
                    ipsec[tmp_mo]['attributes'] = {'xc:operation': 'update'}
                    ipsec[tmp_mo]['ipsecTunnelId'] = tmp_mo.split('=')[-1]
                    ipsec[tmp_mo]['remoteAddress'] = F'Transport=1,Router={node_data("lte")},PeerIPv6={tmp_dict.get("peerIPv6Id", "1")}'
        if len(mos_list) > 0:
            self.mo_dict[F'create_new_vlan_router']['Transport']['Router']['PeerIPv6'] = copy.deepcopy(mos_list)

        for o in self.site.find_mo_ending_with_parent_str(moc='InterfaceIPv6', parent=F'{node_data("me")},Transport=1,Router={mo_ids.get("4g_lte")}'):
            for mo in self.site.find_mo_ending_with_parent_str(moc='AddressIPv6', parent=o):
                for _ in self.site.site_extract_data(mo).get('reservedBy', []):
                    if ',IpsecTunnel=' in _:
                        tmp_mo = self.site.get_mo_w_end_str(_)
                        if tmp_mo not in ipsec.keys(): ipsec[tmp_mo] = {}
                        ipsec[tmp_mo]['attributes'] = {'xc:operation': 'update'}
                        ipsec[tmp_mo]['ipsecTunnelId'] = tmp_mo.split('=')[-1]
                        ipsec[tmp_mo]['localAddress'] = ipint
        if len(ipsec) > 0:
            self.mo_dict[F'create_new_vlan_router']['Transport']['Router'] = \
                [copy.deepcopy(self.mo_dict[F'create_new_vlan_router']['Transport']['Router'])]
            for mo in ipsec.keys():
                tmp_mo = {'routerId': mo.split(',')[-2].split('=')[-1], 'IpsecTunnel': copy.deepcopy(ipsec[mo])}
                self.mo_dict[F'create_new_vlan_router']['Transport']['Router'].append(tmp_mo.copy())
        # ENodeBFunction_SctpEndpoint update for IP
        self.mo_dict[F'update_ENodeBFunction_SctpEndpoint_with_new_router'] = {
            'managedElementId': self.node, 'Transport': {'transportId': '1', 'SctpEndpoint': {
                'attributes': {'xc:operation': 'update'}, 'sctpEndpointId': node_data("sctpendpoint"), 'localIpAddress': ipint}},
            'ENodeBFunction': {'attributes': {'xc:operation': 'update'}, 'eNodeBFunctionId': '1', 'upIpAddressRef': ipint,
                               'intraRanIpAddressRef': ipint}}

        mo_dict = copy.deepcopy(old_router_dict)
        mo_dict['Transport']['Router'] |= {'attributes': {'xc:operation': 'delete'}}
        self.mo_dict[F'delete_old_router'] = copy.deepcopy(mo_dict)
        mo_dict = copy.deepcopy(tmp_vlan_dict)
        mo_dict['Transport']['VlanPort'] |= {'attributes': {'xc:operation': 'delete'}}
        self.mo_dict[F'delete_Temp1_vlan'] = copy.deepcopy(mo_dict)

    def gnodeb_mmbb_router_reconfig(self):
        node_data = self.gnbdata.get
        mo_ids = self.usid.sites.get(F'site_{self.node}').get_transport_mos_id()
        old_ipint = F'Transport=1,Router={mo_ids["lte"]},InterfaceIPv6={ mo_ids["lte_interface"]},AddressIPv6={mo_ids["lte_add"]}'
        ipint = F'Transport=1,Router={node_data("lte")},InterfaceIPv6={node_data("lte_interface")},AddressIPv6={node_data("lte_add")}'
        eth_port = F'Transport=1,EthernetPort={node_data("TnPort")}'
        tmp_vlan = str(max([int(self.enbdata.get('lte_vlan', '50')), int(self.gnbdata.get('lte_vlan', '50'))]) + 3)
        self.tn_dict = {'managedElementId': self.node, 'Transport': {'transportId': '1'}}

        old_router_dict = {'managedElementId': self.node, 'Transport': {'transportId': '1', 'Router': {
            'routerId': mo_ids['lte'], 'InterfaceIPv6': {'interfaceIPv6Id': mo_ids['lte_interface']}}}}
        tmp_vlan_dict = {'managedElementId': self.node, 'Transport': {
            'transportId': '1', 'VlanPort': {'vlanPortId': 'Temp1', 'vlanId': tmp_vlan, 'encapsulation': eth_port}}}

        vlan_dict = copy.deepcopy(tmp_vlan_dict)
        vlan_dict['Transport']['VlanPort'] |= {'attributes': {'xc:operation': 'create'}}
        self.mo_dict['create_vlan_Temp1'] = copy.deepcopy(vlan_dict)

        mo_dict = copy.deepcopy(old_router_dict)
        mo_dict['Transport']['Router']['InterfaceIPv6'] |= {
            'attributes': {'xc:operation': 'update'}, 'encapsulation': F'Transport=1,VlanPort=Temp1'}
        self.mo_dict[F'interfaceipv6_update_with_temp_vlan'] = copy.deepcopy(mo_dict)

        self.mo_dict[F'delete_old_vlan_{mo_ids.get("lte_vlanid")}'] = {'managedElementId': self.node, 'Transport': {
            'transportId': '1', 'VlanPort': {'attributes': {'xc:operation': 'delete'}, 'vlanPortId': mo_ids.get("lte_vlanid")}}}
        # New Router
        self.mo_dict[F'create_new_vlan_router'] = {
            'managedElementId': self.node,
            'Transport': {
                'transportId': '1',
                'VlanPort': {'attributes': {'xc:operation': 'create'}, 'vlanPortId': F'{node_data("lte_vlanid")}',
                             'vlanId': F'{node_data("lte_vlan")}', 'encapsulation': eth_port},
                'Router': {
                    'attributes': {'xc:operation': 'create'}, 'routerId': node_data("lte"), 'hopLimit': '64', 'pathMtuExpiresIPv6': '86400',
                    'ttl': '64',
                    'InterfaceIPv6': {'attributes': {'xc:operation': 'create'}, 'interfaceIPv6Id': node_data("lte_interface"), #'loopback': 'false',
                                      'mtu': '1954', 'encapsulation': F'Transport=1,VlanPort={node_data("lte_vlanid")}',
                                      'AddressIPv6': {'attributes': {'xc:operation': 'create'}, 'addressIPv6Id': node_data("lte_add"),
                                                      'address': F'{node_data("lte_ip")}/64', 'configurationMode': '0 (MANUAL)'}},
                    'RouteTableIPv6Static': {'attributes': {'xc:operation': 'create'}, 'routeTableIPv6StaticId': '1',
                                             'Dst': {'attributes': {'xc:operation': 'create'}, 'dstId': '1', 'dst': '::/0',
                                                     'NextHop': {'attributes': {'xc:operation': 'create'}, 'nextHopId': 'NR',
                                                                 'address': node_data("lte_gway"), 'adminDistance': node_data("lte_dist")}}
                                             },
                    'TwampResponder': [{'attributes': {'xc:operation': 'create'}, 'twampResponderId': F'{_}',
                                        'ipAddress': ipint, 'udpPort': F'400{_}'} for _ in [1, 2, 3, 4]],
                }
            }
        }
        # IPSec Configuration Migration
        ipsec = dict()
        mos_list = []
        for mo in self.site.find_mo_ending_with_parent_str(moc='DnsClient', parent=F'{node_data("me")},Transport=1,Router={mo_ids.get("lte")}'):
            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('DnsClient', self.node, mo, mo.split('=')[-1])
            tmp_dict |= {'attributes': {'xc:operation': 'create'}, 'localIpAddress': ipint}
            mos_list.append(tmp_dict.copy())
        if len(mos_list) > 0: self.mo_dict[F'create_new_vlan_router']['Transport']['Router']['DnsClient'] = copy.deepcopy(mos_list)
        mos_list = []
        for mo in self.site.find_mo_ending_with_parent_str(moc='PeerIPv6', parent=F'{node_data("me")},Transport=1,Router={mo_ids.get("lte")}'):
            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('PeerIPv6', self.node, mo, mo.split('=')[-1])
            tmp_dict |= {'attributes': {'xc:operation': 'create'}}
            mos_list.append(tmp_dict.copy())
            for _ in self.site.site_extract_data(mo).get('reservedBy', []):
                if ',IpsecTunnel=' in _:
                    tmp_mo = self.site.get_mo_w_end_str(_)
                    if tmp_mo not in ipsec.keys(): ipsec[tmp_mo] = {}
                    ipsec[tmp_mo]['attributes'] = {'xc:operation': 'update'}
                    ipsec[tmp_mo]['ipsecTunnelId'] = tmp_mo.split('=')[-1]
                    ipsec[tmp_mo]['remoteAddress'] = F'Transport=1,Router={node_data("lte")},PeerIPv6={tmp_dict.get("peerIPv6Id", "1")}'
        if len(mos_list) > 0:
            self.mo_dict[F'create_new_vlan_router']['Transport']['Router']['PeerIPv6'] = copy.deepcopy(mos_list)

        for o in self.site.find_mo_ending_with_parent_str(moc='InterfaceIPv6', parent=F'{node_data("me")},Transport=1,Router={mo_ids.get("lte")}'):
            for mo in self.site.find_mo_ending_with_parent_str(moc='AddressIPv6', parent=o):
                for _ in self.site.site_extract_data(mo).get('reservedBy', []):
                    if ',IpsecTunnel=' in _:
                        tmp_mo = self.site.get_mo_w_end_str(_)
                        if tmp_mo not in ipsec.keys(): ipsec[tmp_mo] = {}
                        ipsec[tmp_mo]['attributes'] = {'xc:operation': 'update'}
                        ipsec[tmp_mo]['ipsecTunnelId'] = tmp_mo.split('=')[-1]
                        ipsec[tmp_mo]['localAddress'] = ipint
        if len(ipsec) > 0:
            self.mo_dict[F'create_new_vlan_router']['Transport']['Router'] = \
                [copy.deepcopy(self.mo_dict[F'create_new_vlan_router']['Transport']['Router'])]
            for mo in ipsec.keys():
                tmp_mo = {'routerId': mo.split(',')[-2].split('=')[-1], 'IpsecTunnel': copy.deepcopy(ipsec[mo])}
                self.mo_dict[F'create_new_vlan_router']['Transport']['Router'].append(tmp_mo.copy())
        # SctpEndpoint Update
        tmp_list = []
        for mo in self.site.find_mo_ending_with_parent_str(moc='SctpEndpoint', parent=F'{node_data("me")},Transport=1'):
            mo_dict = self.get_mo_dict_from_moc_node_fdn_moid('SctpEndpoint', self.node, mo, mo.split('=')[-1])
            if max([_.endswith(old_ipint) for _ in mo_dict['localIpAddress']]):
                mo_dict = {'attributes': {'xc:operation': 'update'}, 'sctpEndpointId': mo_dict['sctpEndpointId'],  'localIpAddress': [ipint]}
                tmp_list.append(mo_dict.copy())
        if len(tmp_list) > 0:
            self.mo_dict[F'Transport=1,SctpEndpoint=-localIpAddress'] = {'managedElementId': self.node, 'Transport': {
                'transportId': '1', 'SctpEndpoint': tmp_list}}

        if node_data('GNBCUUP'):
            self.mo_dict[F'delete_GNBCUUPFunction'] = {'managedElementId': self.node, 'GNBCUUPFunction': {
                'attributes': {'xc:operation': 'delete'}, 'gNBCUUPFunctionId': '1'}}
        mo_dict = copy.deepcopy(old_router_dict)
        mo_dict['Transport']['Router'] |= {'attributes': {'xc:operation': 'delete'}}
        self.mo_dict[F'delete_old_router'] = copy.deepcopy(mo_dict)
        mo_dict = copy.deepcopy(tmp_vlan_dict)
        mo_dict['Transport']['VlanPort'] |= {'attributes': {'xc:operation': 'delete'}}
        self.mo_dict[F'delete_Temp1_vlan'] = copy.deepcopy(mo_dict)

        if node_data('GNBCUUP'):
            self.motype = 'GNBCUUP'
            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('GNBCUUPFunction', self.node, node_data('GNBCUUP'), '1')
            tmp_dict |= {'attributes': {'xc:operation': 'create'}, 'gNBCUUPFunctionId': '1',
                         'endpointResourceRef': '', 'EndpointResource': [], 'ResourcePartitions': []}
            # 'endpointResourceRef': 'GNBCUUPFunction=1,EndpointResource=1',
            # EndpointResource
            for mo in self.site.find_mo_ending_with_parent_str(moc='EndpointResource', parent=node_data("GNBCUUP")):
                mo_dict = self.get_mo_dict_from_moc_node_fdn_moid('EndpointResource', self.node, mo, mo.split('=')[-1])
                mo_dict |= {'attributes': {'xc:operation': 'create'}, 'LocalIpEndpoint': []} #'endpointResourceId': '1',
                for lmo in self.site.find_mo_ending_with_parent_str(moc='LocalIpEndpoint', parent=mo):
                    lmo_dict = self.get_mo_dict_from_moc_node_fdn_moid('LocalIpEndpoint', self.node, lmo, lmo.split('=')[-1])
                    lmo_dict |= {'attributes': {'xc:operation': 'create'}}
                    if max([_.endswith(old_ipint) for _ in lmo_dict['addressRef']]): lmo_dict |= {'addressRef': [ipint]}
                    mo_dict['LocalIpEndpoint'].append(lmo_dict.copy())
                tmp_dict['EndpointResource'].append(mo_dict.copy())
            # ResourcePartitions
            for mo in self.site.find_mo_ending_with_parent_str(moc='ResourcePartitions', parent=node_data("GNBCUUP")):
                mo_dict = self.get_mo_dict_from_moc_node_fdn_moid('ResourcePartitions', self.node, mo, mo.split('=')[-1])
                mo_dict |= {'attributes': {'xc:operation': 'create'}, 'ResourcePartition': []} #'endpointResourceId': '1',
                for lmo in self.site.find_mo_ending_with_parent_str(moc='ResourcePartition', parent=mo):
                    lmo_dict = self.get_mo_dict_from_moc_node_fdn_moid('ResourcePartition', self.node, lmo, lmo.split('=')[-1])
                    lmo_dict |= {'attributes': {'xc:operation': 'create'}, 'ResourcePartitionMember': []}
                    for lmo2 in self.site.find_mo_ending_with_parent_str(moc='ResourcePartitionMember', parent=lmo):
                        lmo_dict2 = self.get_mo_dict_from_moc_node_fdn_moid('ResourcePartitionMember', self.node, lmo2, lmo2.split('=')[-1])
                        lmo_dict2 |= {'attributes': {'xc:operation': 'create'}}
                        lmo_dict['ResourcePartitionMember'].append(lmo_dict2.copy())
                    mo_dict['ResourcePartition'].append(lmo_dict.copy())
                tmp_dict['ResourcePartitions'].append(mo_dict.copy())

            self.mo_dict['GNBCUUPFunction'] = {'managedElementId': self.node, 'GNBCUUPFunction': copy.deepcopy(tmp_dict)}

            self.mo_dict['GNBCUUPFunction_endpointResourceRef_update'] = {'managedElementId': self.node, 'GNBCUUPFunction': {
                'attributes': {'xc:operation': 'update'}, 'gNBCUUPFunctionId': '1',
                'endpointResourceRef': F'GNBCUUPFunction=1,EndpointResource=1'}}

    def special_formate_scripts(self):
        if not self.enbdata.get('mmbb', False): return
        elif self.enbdata.get('rou_change'): return
        elif self.eq_flag: return
        elif self.gnbdata.get('GNBDU') is None: return
        
        for sc in ['ap', 'cli', 'cmedit']:
            sc_name = self.relative_path[sc][-1].split('_')
            sc_name[0] = sc_name[0] + 'b'
            sc_name[-2] = sc_name[-2] + '_5qitable'
            self.relative_path[sc][-1] = '_'.join(sc_name)
            self.s_dict[sc] = []
        self.mo_dict = {}
        node_data = self.gnbdata.get
        self.motype = 'GNBCUUP'
        tmp_list = []
        for mo in self.site.find_mo_ending_with_parent_str(moc='CUUP5qiTable', parent=node_data("GNBCUUP")):
            mo_dict = self.update_db_attr_with_mo_data('CUUP5qiTable', self.site, mo)
            mo_dict |= {'attributes': {'xc:operation': 'create'}}
            mo_dict['CUUP5qi'] = []
            for mo_child in self.site.find_mo_ending_with_parent_str(moc='CUUP5qi', parent=mo):
                tmp_dict = self.update_db_attr_with_mo_data('CUUP5qi', self.site, mo_child)
                tmp_dict |= {'attributes': {'xc:operation': 'create'}}
                mo_dict['CUUP5qi'].append(tmp_dict.copy())
            tmp_list.append(mo_dict.copy())
        # Write Script to New File
        if len(tmp_list):
            self.mo_dict['gnbcuup_cuup5qitable_update_delete'] = {'managedElementId': self.node, 'GNBCUUPFunction': {
                'gNBCUUPFunctionId': '1', 'CUUP5qiTable': copy.deepcopy(tmp_list)}}
            self.create_script_from_mo_dict()
            self.write_script_file()
