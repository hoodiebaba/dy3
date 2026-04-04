import copy
import re
from .att_xml_base import att_xml_base


class co2_SiteBasic(att_xml_base):
    def create_rpc_msg(self):
        if self.no_eq_change_with_dcgk_flag: return



        node = self.enbdata if self.enbdata.get('postsite') == self.node else self.gnbdata
        oam_vlan_id = node['oam_van']
        oam_ip_add = node['oam_ip']
        oam_gway_add = node['oam_gway']
        next_hop = '1'
        if self.enbdata.get('postsite') == self.node and self.enbdata.get('mmbb'):
            if oam_vlan_id == '': oam_vlan_id = self.gnbdata['oam_van']
            if oam_ip_add == '': oam_ip_add = self.gnbdata['oam_ip']
            if oam_gway_add == '': oam_gway_add = self.gnbdata['oam_gway']
            next_hop = 'LTE'
        oam_access = F'ManagedElement=1,Transport=1,Router={node["oam"]},InterfaceIPv6={node["oam_interface"]},AddressIPv6={node["oam_add"]}'
        # trustCategory = 'ManagedElement=1,SystemFunctions=1,SecM=1,CertM=1,TrustCategory=oamTrustCategory'
        # nodeCredential = 'ManagedElement=1,ManagedElement=1,SystemFunctions=1,SecM=1,CertM=1,NodeCredential=oamNodeCredential'

        # massage-1 for Site Basic
        tmp_dict = {
            'managedElementId': '1',
            'dnPrefix': F'{node["dnPrefix"]},MeContext={node["postsite"]}',
            'SystemFunctions': {'systemFunctionsId': '1', 'Lm': {'lmId': '1', 'fingerprint': node['fingerprint']}}
        }
        tmp_doc = self.netconf_doc_form_dict(tmp_dict, '1')[0]
        for _ in tmp_doc.getElementsByTagName('dnPrefix'): _.firstChild.nodeValue = F'{node["dnPrefix"]},MeContext={node["postsite"]}'
        self.s_dict['ap'] += self.netconf_hello_msg() + [tmp_doc.toprettyxml(encoding='UTF-8', indent='  ').decode('utf-8').replace(
            '<?xml version="1.0" encoding="UTF-8"?>', '').strip()] + [']]>]]>'] + self.netconf_close_msg()

        # massage-2 for Site Basic
        tmp_dict = {
            'managedElementId': '1',
            'SystemFunctions': {
                'systemFunctionsId': '1',
                'Lm': {
                    'lmId': '1',
                    'FeatureState': [{
                        'featureStateId': 'CXC4011823', 'featureState': '1 (ACTIVATED)'}
                    ]
                }
            }
        }
        if self.usid.client.software.swname < 'ATT_23_Q3':
            tmp_dict['SystemFunctions']['Lm']['FeatureState'].append({'featureStateId': 'CXC4040006', 'featureState': '1 (ACTIVATED)'})
        if node['bbtype'] in ['5216', '6630']:
            tmp_dict['SystemFunctions']['Lm']['FeatureState'].append({'featureStateId': 'CXC4011838', 'featureState': '1 (ACTIVATED)'})
        tmp_doc = self.netconf_doc_form_dict(tmp_dict, '2')[0]
        self.s_dict['ap'] += self.netconf_hello_msg() + [tmp_doc.toprettyxml(encoding='UTF-8', indent='  ').decode('utf-8').replace(
            '<?xml version="1.0" encoding="UTF-8"?>', '').strip()] + [']]>]]>'] + self.netconf_close_msg()
        
        # massage-3 for Site Basic
        tmp_dict = {
            'managedElementId': '1',
            'SystemFunctions': {
                'systemFunctionsId': '1',
                'SecM': {'secMId': '1', 'UserManagement': {'userManagementId': '1', 'UserIdentity': {
                    'userIdentityId': '1', 'MaintenanceUser': {
                        'maintenanceUserId': '1', 'userName': node['username'], 'password': {
                            'cleartext': 'AjayOjha', 'password': node['password']}}}}},
                'SysM': {'sysMId': '1',
                         'OamAccessPoint': {'oamAccessPointId': '1', 'accessPoint': oam_access},
                         'TimeM': {'timeMId': '1',
                                   'DateAndTime': {'dateAndTimeId': '1', 'timeZone': node['timeZone']},
                                   'Ntp': {'ntpId': '1',
                                           'NtpServer': [{'ntpServerId': i, 'serverAddress': node[F'ntpip{i}'], 'administrativeState': '1 (UNLOCKED)',
                                                          'userLabel': F'NTP{i}'} for i in [1, 2] if node[F'ntpip{i}'] != '']}},
                         # 'CliTls': {'cliTlsId': 1, 'administrativeState': '1 (UNLOCKED)', 'port': '9830', 'trustCategory': trustCategory,
                         #            'nodeCredential':  nodeCredential},
                         # 'HttpM': {'httpMId': 1, 'Https': {'httpsId': 1, 'nodeCredential': nodeCredential, 'trustCategory': trustCategory}},
                         'OamTrafficClass': {'oamTrafficClassId': '1', 'dscp': '10' if self.enbdata.get('mmbb') is False else '0'},
                         },
                'SwM': {'swMId': '1'}
            },
            'Equipment': {'equipmentId': '1', 'FieldReplaceableUnit': {
                'fieldReplaceableUnitId': node['bbuid'], 'TnPort': {'tnPortId': node['TnPort']}, 'SyncPort': {'syncPortId': '1'}}},
            'Transport': {
                'transportId': '1',
                'EthernetPort': {'ethernetPortId': node['TnPort'], 'administrativeState': '1 (UNLOCKED)', 'admOperatingMode': node['tnbw'],
                                 'autoNegEnable': 'false' if node['tnbw'] in ['9 (10G_FULL)'] else 'true', 'userLabel': node['TnPort'],
                                 'encapsulation': F'ManagedElement=1,Equipment=1,FieldReplaceableUnit={node["bbuid"]},TnPort={node["TnPort"]}'},
                'VlanPort': [
                    {'vlanPortId': node['oam_vlanid'], 'vlanId': oam_vlan_id,
                     'encapsulation': F'ManagedElement=1,Transport=1,EthernetPort={node["TnPort"]}'},
                    {'vlanPortId': node['lte_vlanid'], 'vlanId': node['lte_vlan'],
                     'encapsulation': F'ManagedElement=1,Transport=1,EthernetPort={node["TnPort"]}'}
                ],
                'Router': [
                    {'routerId': node['oam'],
                     'InterfaceIPv6': {'interfaceIPv6Id': node['oam_interface'],
                                       'encapsulation': F'ManagedElement=1,Transport=1,VlanPort={node["oam_vlanid"]}',
                                       'AddressIPv6': {'addressIPv6Id': node['oam_add'], 'address': F'{oam_ip_add}/64'}},
                     'RouteTableIPv6Static': {'routeTableIPv6StaticId': '1',
                                              'Dst': {'dstId': '1', 'dst': '::/0',
                                                      'NextHop': {'nextHopId': '1', 'adminDistance': '1', 'address': oam_gway_add}}},
                     },
                    {'routerId': node['lte'],
                     'InterfaceIPv6': {'interfaceIPv6Id': node['lte_interface'],
                                       'mtu': '1954' if 'NR' in node['tech'] else '1500',
                                       'encapsulation': F'ManagedElement=1,Transport=1,VlanPort={node["lte_vlanid"]}',
                                       'AddressIPv6': {'addressIPv6Id': node["lte_add"], 'address': F'{node["lte_ip"]}/64'}},
                     'RouteTableIPv6Static': {'routeTableIPv6StaticId': '1',
                                              'Dst': {'dstId': '1', 'dst': '::/0',
                                                      'NextHop': {'nextHopId': next_hop, 'adminDistance': node['lte_dist'],
                                                                  'address': node["lte_gway"]}}},
                     },

                ],
            }
        }
        # Moved From TN to SiteBasic
        tmp_dict['Transport']['Synchronization'] = self.get_db_dict_for_mo_moid('Synchronization', '1')
        tmp_dict['Transport']['Synchronization']['TimeSyncIO'] = self.get_db_dict_with_cr_for_mo_moid('TimeSyncIO', '1')
        tmp_dict['Transport']['Synchronization']['TimeSyncIO']['GnssInfo'] = self.get_db_dict_with_cr_for_mo_moid('GnssInfo', '1')
        tmp_dict['Transport']['Synchronization']['TimeSyncIO']['encapsulation'] = F'Equipment=1,FieldReplaceableUnit={node["bbuid"]},SyncPort=1'
        tmp_dict['Transport']['Synchronization']['RadioEquipmentClock'] = self.get_db_dict_with_cr_for_mo_moid('RadioEquipmentClock', '1')
        tmp_dict['Transport']['Synchronization']['RadioEquipmentClock']['RadioEquipmentClockReference'] = \
            self.get_db_dict_with_cr_for_mo_moid('RadioEquipmentClockReference', '1')
        if len(self.gnbdata) > 0: tmp_dict['Transport']['Synchronization']['RadioEquipmentClock'] |= {'selectionProcessMode': '1 (QL_ENABLED)'}

        if len(node['postsite']) >= 10:
            tmp_dict['SystemFunctions']['SecM']['UserManagement']['LocalAuthorizationMethod'] = {
                'localAuthorizationMethodId': '1',
                'CustomRule': {'customRuleId': 'expert', 'ruleName': 'expert', 'permission': 'RWX', 'ruleData': 'ManagedElement,*'}}
        tmp_doc = self.netconf_doc_form_dict(tmp_dict, '3')[0]
        self.s_dict['ap'] += self.netconf_hello_msg() + [tmp_doc.toprettyxml(encoding='UTF-8', indent='  ').decode('utf-8').replace(
            '<?xml version="1.0" encoding="UTF-8"?>', '').strip()] + [']]>]]>'] + self.netconf_close_msg()
        
        # massage-4 for Site Basic
        tmp_doc = self.netconf_doc_form_dict({'managedElementId': 1, 'networkManagedElementId': node['postsite']}, '4')[0]
        self.s_dict['ap'] += self.netconf_hello_msg() + [tmp_doc.toprettyxml(encoding='UTF-8', indent='  ').decode('utf-8').replace(
            '<?xml version="1.0" encoding="UTF-8"?>', '').strip()] + [']]>]]>'] + self.netconf_close_msg() + ['']

    def netconf_value_update(self, val):
        if val in [None, 'None', '', '""', [], {}]: return ''
        else: val = str(val).strip('"')
        if len([_ for _ in [',', '='] if _ in val]) == 2:
            val = re.sub(r'ManagedElement=[^,]*,', F'ManagedElement=1,', val)
            if 'ManagedElement=' not in val: val = F'ManagedElement=1,{val}'
            if re.match('.*,(ManagedElement=.*)', val): val = re.match('.*,(ManagedElement=.*)', val).group(1)
            return val
        elif re.match('.*\s\((.*)\)$', val): val = re.match('.*\s\((.*)\)$', val).group(1)
        return val

    def netconf_hello_msg(self):
        doc = copy.deepcopy(self.xml_doc)
        doc.appendChild(self.netconf_mo_form_dict(
            {'attributes': {'xmlns': 'urn:ietf:params:xml:ns:netconf:base:1.0'}, 'capabilities': {'capability': [
                'urn:ietf:params:netconf:base:1.0']}}, 'hello'))
        lines = [doc.toprettyxml(encoding='UTF-8', indent='  ').decode('utf-8').strip()] + [']]>]]>']
        return lines

    def netconf_close_msg(self):
        """ :rtype: list """
        doc = copy.deepcopy(self.xml_doc)
        doc.appendChild(self.netconf_mo_form_dict({'attributes': {'message-id': 'Closing', 'xmlns': 'urn:ietf:params:xml:ns:netconf:base:1.0'},
                                                   'close-session': 'AjayOjha'}, 'rpc'))
        lines = [doc.toprettyxml(encoding='UTF-8', indent='  ').decode('utf-8').replace(
            '<?xml version="1.0" encoding="UTF-8"?>', '').strip()] + [']]>]]>']
        return lines
