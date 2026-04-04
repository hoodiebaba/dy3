from xml.dom.minidom import Document
from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class lte2_SiteEquipment(tmo_xml_base):
    def initialize_var(self):
        if self.enbdata.get('equ_change'):
            self.enbdata["SE_File"] = F'lte_SiteEquipment_{self.node}.xml'
            self.relative_path = [self.node, self.enbdata["SE_File"]]
            self.script_elements = [self.rcp_msg_capabilities(), self.create_rpc_msg(), self.rcp_msg_close()]

    def create_rpc_msg(self):
        doc, config = self.main_rcp_msg_start('1')
        if self.enbdata['bbtype'] == '5216': ri_no = 6
        elif self.enbdata['bbtype'] == '6648': ri_no = 12
        elif self.enbdata['bbtype'] == '6651': ri_no = 12
        elif self.enbdata['bbtype'] == '6630': ri_no = 15
        else: ri_no = 15
        ri_port_list = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U']
        tmp_dict = {
            'managedElementId': '1',
            'userLabel': self.node,
            'Equipment': {
                'equipmentId': '1',
                'Cabinet': {'cabinetId': '1', 'smokeDetector': 'false', 'climateSystem': 'STANDARD'},
                'EcBus': {'ecBusId': '1', 'ecBusConnectorRef': F'ManagedElement=1,Equipment=1,FieldReplaceableUnit={self.enbdata["bbuid"]}',
                          'equipmentSupportFunctionRef': 'ManagedElement=1,EquipmentSupportFunction=1'},
                'FieldReplaceableUnit': {'fieldReplaceableUnitId': self.enbdata['bbuid'], 'administrativeState': 'UNLOCKED',
                                         'SyncPort': {'syncPortId': '1'},
                                         'EcPort': {'ecPortId': '1', 'ecBusRef': 'ManagedElement=1,Equipment=1,EcBus=1', 'hubPosition': 'A'},
                                         'RiPort': [{'riPortId': _, 'administrativeState': 'UNLOCKED'} for _ in ri_port_list[:ri_no]]}
            },
            'EquipmentSupportFunction': {
                'equipmentSupportFunctionId': '1', 'supportSystemControl': 'true',
                'BatteryBackup': {'batteryBackupId': '1', 'controlDomainRef': F'ManagedElement=1,Equipment=1,Cabinet=1'},
                'Climate': {'climateId': '1', 'climateControlMode': 'NORMAL', 'controlDomainRef': F'ManagedElement=1,Equipment=1,Cabinet=1'},
                'PowerDistribution': {'powerDistributionId': '1', 'controlDomainRef': F'ManagedElement=1,Equipment=1,Cabinet=1'},
                'PowerSupply': {'powerSupplyId': '1', 'controlDomainRef': F'ManagedElement=1,Equipment=1,Cabinet=1'},
            },
            'NodeSupport': {
                'nodeSupportId': '1',
                'MpClusterHandling': {'mpClusterHandlingId': '1',
                                      'primaryCoreRef': F'ManagedElement=1,Equipment=1,FieldReplaceableUnit={self.enbdata["bbuid"]}'},
                'CpriLinkSupervision': {'cpriLinkSupervisionId': '1', 'cpriLinkFilterTime': '400'},
                'EquipmentDiscovery': {'equipmentDiscoveryId': '1', 'antennaDeviceScanInBackground': 'false', 'dataRate': 'BITRATE_9600',
                                       'portVoltage': 'DC_12V', 'portConfiguration': 'SCAN_ALL_PORTS_WITH_CHOSEN_VOLTAGE'}
            }
        }

        if self.enbdata['bbtype'] == '6648': del tmp_dict['Equipment']['FieldReplaceableUnit']['EcPort']
        elif self.enbdata['bbtype'] == '6651': del tmp_dict['Equipment']['FieldReplaceableUnit']['EcPort']
        me_mo = self.mo_add_form_dict_xml(tmp_dict, 'ManagedElement', change_me=False)
        config.appendChild(me_mo)
        # # SUP - Start
        if '5216' in self.enbdata['bbtype']:
            tmp_dict = {'fieldReplaceableUnitId': 'SUP-1', 'administrativeState': 'UNLOCKED', 'positionRef': F'ManagedElement=1,Equipment=1,Cabinet=1',
                        'AlarmPort': [{'alarmPortId': str(i), 'administrativeState': 'UNLOCKED'} for i in range(1, 17)],
                        'EcPort': {'ecPortId': '1', 'ecBusRef': F'ManagedElement=1,Equipment=1,EcBus=1', 'hubPosition': 'NA'}}
            sup_mo = self.mo_add_form_dict_xml(tmp_dict, 'FieldReplaceableUnit', change_me=False)
            mc = doc.getElementsByTagName("Equipment")[0]
            mc.appendChild(sup_mo)

        # # SAU - Start
        tmp_dict = {'fieldReplaceableUnitId': self.site.get_sau_id() if self.site else 'SAU-1', 'administrativeState': 'UNLOCKED',
                    'positionRef': F'ManagedElement=1,Equipment=1,Cabinet=1',
                    'EcPort': {'ecPortId': '1', 'ecBusRef': F'ManagedElement=1,Equipment=1,EcBus=1', 'hubPosition': 'SAU'}}
        if self.site:
            site = self.usid.sites.get(F'site_{self.node}')
            equip_str = 'FieldReplaceableUnit' if site.equipment_type == 'BB' else 'HwUnit'
            mo = site.find_mo_ending_with_id(equip_str, self.site.get_sau_id())
            if len(mo) > 0:
                sau_mo = self.mo_add_form_dict_xml(tmp_dict, 'FieldReplaceableUnit', change_me=False)
                self.append_equipment_elems(site, sau_mo, mo[0], 'AlarmPort')
                mc = doc.getElementsByTagName("Equipment")[0]
                mc.appendChild(sau_mo)
        return doc
    
    def rcp_msg_capabilities(self):
        doc = Document()
        mo1 = doc.createElement('hello')
        mo1.setAttribute('xmlns', 'urn:ietf:params:xml:ns:netconf:base:1.0')
        doc.appendChild(mo1)
        mo1.appendChild(self.mo_add_form_dict_xml({'capability': ['urn:ietf:params:netconf:base:1.0']}, 'capabilities', change_me=False))
        return doc
