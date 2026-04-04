import copy
import re
from .att_xml_base import att_xml_base


class co3_SiteEquipment(att_xml_base):
    def create_rpc_msg(self):
        if self.no_eq_change_with_dcgk_flag: return
        node = self.enbdata if self.enbdata.get('postsite') == self.node else self.gnbdata
        tmp_dict = {
            'managedElementId': '1',
            'userLabel': self.node,
            'Equipment': {
                'equipmentId': '1',
                'Cabinet': {'cabinetId': '1', 'smokeDetector': 'false', 'climateSystem': '0 (STANDARD)'},
                'EcBus': {'ecBusId': '1',
                          'ecBusConnectionType': 'SAU' if '6630' in node['bbtype'] else 'EC',
                          'ecBusConnectorRef': F'ManagedElement=1,Equipment=1,FieldReplaceableUnit={node["bbuid"]}',
                          'equipmentSupportFunctionRef': 'ManagedElement=1,EquipmentSupportFunction=1'},
                'FieldReplaceableUnit': {
                    'fieldReplaceableUnitId': node['bbuid'], 'administrativeState': '1 (UNLOCKED)',
                    'positionRef': 'ManagedElement=1,Equipment=1,Cabinet=1',
                    # 'SyncPort': {'syncPortId': '1'},
                    'EcPort': {'ecPortId': '1', 'ecBusRef': 'ManagedElement=1,Equipment=1,EcBus=1', 'hubPosition': 'A'},
                    'RiPort': [{'riPortId': _, 'administrativeState': '1 (UNLOCKED)'} for _ in self.bb_riport_list(node['bbtype'])]
                }
            },
            'EquipmentSupportFunction': {
                'equipmentSupportFunctionId': '1',
                'supportSystemControl': 'true',
                'BatteryBackup': {'batteryBackupId': '1', 'controlDomainRef': F'ManagedElement=1,Equipment=1,Cabinet=1'},
                'Climate': {'climateId': '1', 'climateControlMode': '0 (NORMAL)', 'controlDomainRef': F'ManagedElement=1,Equipment=1,Cabinet=1'},
                'PowerDistribution': {'powerDistributionId': '1', 'controlDomainRef': F'ManagedElement=1,Equipment=1,Cabinet=1'},
                'PowerSupply': {'powerSupplyId': '1', 'controlDomainRef': F'ManagedElement=1,Equipment=1,Cabinet=1'},
            },
            'NodeSupport': {
                'nodeSupportId': '1',
                'MpClusterHandling': {'mpClusterHandlingId': '1',
                                      'primaryCoreRef': F'ManagedElement=1,Equipment=1,FieldReplaceableUnit={node["bbuid"]}'},
                'CpriLinkSupervision': {'cpriLinkSupervisionId': '1', 'cpriLinkFilterTime': '400'},
                'EquipmentDiscovery': {'equipmentDiscoveryId': '1', 'antennaDeviceScanInBackground': 'false',
                                       'portVoltage': '0 (DC_12V)', 'portConfiguration': '2 (SCAN_ALL_PORTS_WITH_CHOSEN_VOLTAGE)'}
            }
        }
        if node['bbtype'] in ['6648', '6651']:
            del tmp_dict['Equipment']['FieldReplaceableUnit']['EcPort']
            del tmp_dict['Equipment']['EcBus']
        doc = self.netconf_doc_form_dict(tmp_dict, 'equipment')[0]
        # SUP - Start
        if node['bbtype'] in ['5216']:
            tmp_dict = {'fieldReplaceableUnitId': 'SUP-1', 'administrativeState': '1 (UNLOCKED)',
                        'positionRef': F'ManagedElement=1,Equipment=1,Cabinet=1',
                        'AlarmPort': [{'alarmPortId': str(_), 'administrativeState': '1 (UNLOCKED)'} for _ in range(1, 17)],
                        'EcPort': {'ecPortId': '1', 'ecBusRef': F'ManagedElement=1,Equipment=1,EcBus=1', 'hubPosition': 'NA'}}
            sup_mo = self.netconf_mo_form_dict(tmp_dict, 'FieldReplaceableUnit')
            doc.getElementsByTagName("Equipment")[0].appendChild(sup_mo)
        # # SAU - Start
        if self.site:
            site = self.usid.sites.get(F'site_{self.node}')
            mo = site.find_mo_ending_with_id('FieldReplaceableUnit', self.site.get_sau_id())
            if len(mo) > 0:
                tmp_dict = {'fieldReplaceableUnitId': self.site.get_sau_id() if self.site else 'SAU-1', 'administrativeState': '1 (UNLOCKED)',
                            'positionRef': F'ManagedElement=1,Equipment=1,Cabinet=1',
                            'EcPort': {'ecPortId': '1', 'ecBusRef': F'ManagedElement=1,Equipment=1,EcBus=1', 'hubPosition': 'SAU'}}
                sau_mo = self.netconf_mo_form_dict(tmp_dict, 'FieldReplaceableUnit')
                self.append_equipment_elems(site, sau_mo, mo[0], 'AlarmPort')
                doc.getElementsByTagName("Equipment")[0].appendChild(sau_mo)
        elif self.enbdata.get('postsite') == self.node:
            tmp_dict = {'fieldReplaceableUnitId': self.site.get_sau_id() if self.site else 'SAU-1', 'administrativeState': '1 (UNLOCKED)',
                        'positionRef': F'ManagedElement=1,Equipment=1,Cabinet=1',
                        'EcPort': {'ecPortId': '1', 'ecBusRef': F'ManagedElement=1,Equipment=1,EcBus=1', 'hubPosition': 'SAU'},
                        'AlarmPort': [{'alarmPortId': str(_), 'administrativeState': '1 (UNLOCKED)'} for _ in range(1, 33)]}
            doc.getElementsByTagName("Equipment")[0].appendChild(self.netconf_mo_form_dict(tmp_dict, 'FieldReplaceableUnit'))
        self.s_dict['ap'] += self.netconf_hello_msg() + [doc.toprettyxml(encoding='UTF-8', indent='  ').decode('utf-8').replace(
            '<?xml version="1.0" encoding="UTF-8"?>', '').strip()] + [']]>]]>'] + self.netconf_close_msg()

    def bb_riport_list(self, bbtype):
        no_of_bb_ports = {'5216': 6, '6630': 15, '6648': 12, '6651': 12}.get(str(bbtype), 6)
        return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U'][:no_of_bb_ports]

    def append_equipment_elems(self, site, parent_mo, parent_mo_tag, mo_tag):

        db_dict = self.get_db_dict_with_cr_for_mo_moid(mo_tag)
        for c_mo in site.find_mo_ending_with_parent_str(moc=mo_tag, parent=parent_mo_tag):
            db_dict_c = copy.deepcopy(db_dict)
            tmp_dict = site.site_extract_data(c_mo)
            for para in db_dict_c: db_dict_c[para] = tmp_dict.get(para, db_dict[para])
            parent_mo.appendChild(self.netconf_mo_form_dict(db_dict_c, mo_tag))

    def netconf_value_update(self, val):
        if val in [None, 'None', '', '""', [], {}]:
            return ''
        else:
            val = str(val).strip('"')
        if len([_ for _ in [',', '='] if _ in val]) == 2:
            val = re.sub(r'ManagedElement=[^,]*,', F'ManagedElement=1,', val)
            if 'ManagedElement=' not in val: val = F'ManagedElement=1,{val}'
            if re.match('.*,(ManagedElement=.*)', val): val = re.match('.*,(ManagedElement=.*)', val).group(1)
            return val
        elif re.match('.*\s\((.*)\)$', val):
            val = re.match('.*\s\((.*)\)$', val).group(1)
        return val

    def netconf_hello_msg(self):
        doc = copy.deepcopy(self.xml_doc)
        doc.appendChild(
            self.netconf_mo_form_dict({'attributes': {'xmlns': 'urn:ietf:params:xml:ns:netconf:base:1.0'},
                                       'capabilities': {'capability': ['urn:ietf:params:netconf:base:1.0']}}, 'hello')
        )
        lines = [doc.toprettyxml(encoding='UTF-8', indent='  ').decode('utf-8').strip()] + [']]>]]>']
        return lines
