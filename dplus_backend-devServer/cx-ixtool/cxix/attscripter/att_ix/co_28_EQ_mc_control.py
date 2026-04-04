import copy
from .att_xml_base import att_xml_base


class co_28_EQ_mc_control(att_xml_base):
    def create_rpc_msg(self):
        xmu_row = self.usid.df_xmu.loc[self.usid.df_xmu.postsite == self.node].iloc[0]
        if xmu_row.flag1 != True and xmu_row.flag2 != True: return
        # XMU MultiCabinate Control
        bbtype = self.enbdata.get('bbtype', self.gnbdata.get('bbtype', '1'))
        mo_dict = {
            'managedElementId': self.node,
            'Equipment': {'equipmentId': '1', 'Cabinet': [], 'EcBus': [], 'FieldReplaceableUnit': []},
            'EquipmentSupportFunction': {'equipmentSupportFunctionId': '1', 'Climate': []},
            'SystemFunctions': {'systemFunctionsId': '1', 'Lm': {'lmId': '1', 'FeatureState': []}},
        }
        ec_type = 'SAU' if '6630' in bbtype else 'EC'
        if xmu_row.flag1 is False and xmu_row.flag2 is False: pass
        elif '5216' in bbtype:
            if xmu_row.flag1:
                mo_dict['Equipment']['FieldReplaceableUnit'].append(
                    {'attributes': {'xc:operation': 'update'}, 'fieldReplaceableUnitId': xmu_row.xmu1, 'positionRef': F'Equipment=1,Cabinet=1'})
                if self.eq_flag is False and len(self.site.get_mos_w_end_str('Equipment=1,Cabinet=1')) == 0:
                    mo_dict['Equipment']['Cabinet'].append({'attributes': {'xc:operation': 'create'}, 'cabinetId': '1', 'smokeDetector': 'false',
                                                            'climateSystem': '0 (STANDARD)'})
                if self.eq_flag is False and len(self.site.get_mos_w_end_str('EquipmentSupportFunction=1,Climate=1')) == 0:
                    mo_dict['EquipmentSupportFunction']['Climate'].append({'attributes': {'xc:operation': 'create'}, 'climateId': '1',
                                                                           'controlDomainRef': F'Equipment=1,Cabinet=1'})
            if xmu_row.flag2:
                mo_dict['Equipment']['FieldReplaceableUnit'].append(
                    {'attributes': {'xc:operation': 'update'}, 'fieldReplaceableUnitId': xmu_row.xmu2, 'positionRef': F'Equipment=1,Cabinet=2'})
                if self.eq_flag or (self.eq_flag is False and len(self.site.get_mos_w_end_str('EquipmentSupportFunction=1,Climate=2')) == 0):
                    mo_dict['EquipmentSupportFunction']['Climate'].append({'attributes': {'xc:operation': 'create'}, 'climateId': '2',
                                                                           'controlDomainRef': F'Equipment=1,Cabinet=2'})
                if self.eq_flag or (self.eq_flag is False and len(self.site.get_mos_w_end_str('Equipment=1,Cabinet=2')) == 0):
                    mo_dict['Equipment']['Cabinet'].append({'attributes': {'xc:operation': 'create'}, 'cabinetId': '2',
                                                            'smokeDetector': 'false', 'climateSystem': '0 (STANDARD)'})
                if self.eq_flag or (self.eq_flag is False and len(self.site.get_mos_w_end_str('Equipment=1,EcBus=2')) == 0):
                    mo_dict['Equipment']['EcBus'].append({'attributes': {'xc:operation': 'create'}, 'ecBusId': '2', 'ecBusConnectionType': ec_type,
                                                          'ecBusConnectorRef': F'Equipment=1,FieldReplaceableUnit={xmu_row.xmu2}',
                                                          'equipmentSupportFunctionRef': F'ManagedElement=1,EquipmentSupportFunction=1'})
                if self.eq_flag or (self.eq_flag is False and len(self.site.get_mos_w_end_str('Equipment=1,FieldReplaceableUnit=SUP-2')) == 0):
                    mo_dict['Equipment']['FieldReplaceableUnit'].append(
                        {'attributes': {'xc:operation': 'create'}, 'fieldReplaceableUnitId': 'SUP-2', 'administrativeState': '1 (UNLOCKED)',
                         'positionRef': F'Equipment=1,Cabinet=2',
                         'AlarmPort': [{'attributes': {'xc:operation': 'create'}, 'alarmPortId': str(_)} for _ in range(1, 17)],
                         'EcPort': {'attributes': {'xc:operation': 'create'}, 'ecPortId': '1', 'hubPosition': 'NA',
                                    'ecBusRef': F'Equipment=1,EcBus=2'}}
                    )
        else:
            if xmu_row.flag1:
                mo_dict['Equipment']['FieldReplaceableUnit'].append(
                    {'attributes': {'xc:operation': 'update'}, 'fieldReplaceableUnitId': xmu_row.xmu1, 'positionRef': F'Equipment=1,Cabinet=2'})
                if self.eq_flag or (self.eq_flag is False and len(self.site.get_mos_w_end_str('Equipment=1,Cabinet=2'))) == 0:
                    mo_dict['Equipment']['Cabinet'].append({'attributes': {'xc:operation': 'create'}, 'cabinetId': '2', 'smokeDetector': 'false',
                                                            'climateSystem': '0 (STANDARD)'})
                if self.eq_flag or (self.eq_flag is False and len(self.site.get_mos_w_end_str('EquipmentSupportFunction=1,Climate=2')) == 0):
                    mo_dict['EquipmentSupportFunction']['Climate'].append({'attributes': {'xc:operation': 'create'}, 'climateId': '2',
                                                                           'controlDomainRef': F'Equipment=1,Cabinet=2'})
                if self.eq_flag or (self.eq_flag is False and len(self.site.get_mos_w_end_str('Equipment=1,EcBus=2')) == 0):
                    mo_dict['Equipment']['EcBus'].append({'attributes': {'xc:operation': 'create'}, 'ecBusId': '2', 'ecBusConnectionType': ec_type,
                                                          'ecBusConnectorRef': F'Equipment=1,FieldReplaceableUnit={xmu_row.xmu1}',
                                                          'equipmentSupportFunctionRef': F'ManagedElement=1,EquipmentSupportFunction=1'})
                if self.eq_flag or (self.eq_flag is False and len(self.site.get_mos_w_end_str('Equipment=1,FieldReplaceableUnit=SUP-1')) == 0):
                    mo_dict['Equipment']['FieldReplaceableUnit'].append(
                        {'attributes': {'xc:operation': 'create'}, 'fieldReplaceableUnitId': 'SUP-1', 'administrativeState': '1 (UNLOCKED)',
                         'positionRef': F'Equipment=1,Cabinet=2',
                         'AlarmPort': [{'attributes': {'xc:operation': 'create'}, 'alarmPortId': str(_)} for _ in range(1, 17)],
                         'EcPort': {'attributes': {'xc:operation': 'create'}, 'ecPortId': '1', 'hubPosition': 'NA',
                                    'ecBusRef': F'Equipment=1,EcBus=2'}}
                    )
            if xmu_row.flag2:
                mo_dict['Equipment']['FieldReplaceableUnit'].append(
                    {'attributes': {'xc:operation': 'update'}, 'fieldReplaceableUnitId': xmu_row.xmu2, 'positionRef': F'Equipment=1,Cabinet=2'})
                if xmu_row.flag1 is False:
                    if self.eq_flag is False and len(self.site.get_mos_w_end_str('Equipment=1,Cabinet=2')) == 0:
                        mo_dict['Equipment']['Cabinet'].append({'attributes': {'xc:operation': 'create'}, 'cabinetId': '2', 'smokeDetector': 'false',
                                                                'climateSystem': '0 (STANDARD)'})
                    if self.eq_flag is False and len(self.site.get_mos_w_end_str('EquipmentSupportFunction=1,Climate=2')) == 0:
                        mo_dict['EquipmentSupportFunction']['Climate'].append({'attributes': {'xc:operation': 'create'}, 'climateId': '2',
                                                                               'controlDomainRef': F'Equipment=1,Cabinet=2'})
                    if self.eq_flag or (self.eq_flag is False and len(self.site.get_mos_w_end_str('Equipment=1,EcBus=2')) == 0):
                        mo_dict['Equipment']['EcBus'].append({'attributes': {'xc:operation': 'create'}, 'ecBusId': '2',
                                                              'ecBusConnectionType': ec_type,
                                                              'ecBusConnectorRef': F'Equipment=1,FieldReplaceableUnit={xmu_row.xmu1}',
                                                              'equipmentSupportFunctionRef': F'ManagedElement=1,EquipmentSupportFunction=1'})
                    if self.eq_flag or (
                            self.eq_flag is False and len(self.site.get_mos_w_end_str('Equipment=1,FieldReplaceableUnit=SUP-1')) == 0):
                        mo_dict['Equipment']['FieldReplaceableUnit'].append(
                            {'attributes': {'xc:operation': 'create'}, 'fieldReplaceableUnitId': 'SUP-1', 'administrativeState': '1 (UNLOCKED)',
                             'positionRef': F'Equipment=1,Cabinet=2',
                             'AlarmPort': [{'attributes': {'xc:operation': 'create'}, 'alarmPortId': str(_), 'administrativeState': '0 (LOCKED)'}
                                           for _ in range(1, 17)],
                             'EcPort': {'attributes': {'xc:operation': 'create'}, 'ecPortId': '1', 'hubPosition': 'NA',
                                        'ecBusRef': F'Equipment=1,EcBus=2'}}
                        )

        if xmu_row.flag1 or xmu_row.flag2:
            mo_dict['SystemFunctions']['Lm']['FeatureState'].append({'attributes': {'xc:operation': 'update'},
                                                                     'featureStateId': 'CXC4011809', 'featureState': '1 (ACTIVATED)'})
            self.mo_dict['MultiCabinate_Control'] = mo_dict
