import copy
from .att_xml_base import att_xml_base


class co_27_EQ_nodegroupsync(att_xml_base):
    def create_rpc_msg(self):
        xmu_row = self.usid.df_xmu.loc[self.usid.df_xmu.postsite == self.node].iloc[0]
        # NGS
        lte_cell_list = [_ for _ in self.df_enb_cell.loc[~self.df_enb_cell.nodegroupsyncltenr.isnull()].postcell.unique() if _ is not None]
        nr_cell_list = [_ for _ in self.df_gnb_cell.loc[~self.df_gnb_cell.nodegroupsyncltenr.isnull()].postcell.unique() if _ is not None]
        cell_list = lte_cell_list + nr_cell_list
        if len(cell_list) > 0:
            sef, fru, riport = [], [], []
            df_ant = self.usid.df_ant.copy().loc[(self.usid.df_ant.postsite == self.node) & (self.usid.df_ant.postcell.isin(cell_list))]
            df_ril = self.usid.df_ril.copy().loc[(self.usid.df_ril.postsite == self.node) & (self.usid.df_ril.postcell.isin(cell_list))]
            if len(df_ant.index) > 0 and len(df_ril.index) > 0:
                sef = list(df_ant.sef.unique())
                fru = list(df_ant.fru.unique())
                bbu_xmu_port_mapping = {'1': ['4', '5', '6', '7'], '2': ['9', '10', '11', '12'], '3': ['13', '14', '15', '16']}
                for row in df_ril.groupby(['fru1', 'rip1'], sort=False, as_index=False).head(1).itertuples():
                    ri_fru, ri_rfp = str(row.fru1), str(row.rip1)
                    if ri_fru in [xmu_row.xmu1, xmu_row.xmu2]:
                        ri_rfp = [_ for _ in bbu_xmu_port_mapping.keys() if ri_rfp in bbu_xmu_port_mapping[_]][0]
                        tmp_ril_row = self.usid.df_ril.loc[(self.usid.df_ril.postsite == self.node) &
                                                           (self.usid.df_ril.fru2 == ri_fru) & (self.usid.df_ril.rip2 == ri_rfp)].iloc[0]
                        ri_fru, ri_rfp = tmp_ril_row.fru1, tmp_ril_row.rip1
                    riport.append(F'Equipment=1,FieldReplaceableUnit={ri_fru},RiPort={ri_rfp}')
                riport = list(set(riport))
                # Update userLabel for TMRadioNode (TMBB) if N077 and other freq exist on MMBB node, syncNodePriority --- 1
                if len(self.df_gnb_cell.index) > 0 and len(self.df_enb_cell.index) > 0 and len(self.df_gnb_cell.freqband.unique()) > 1 and \
                    len([_ for _ in self.df_gnb_cell.freqband.unique() if _ in ['n077', 'N077']]) > 0: syncNodePriority = '1'
                elif len(lte_cell_list) > 0: syncNodePriority = '1'
                else: syncNodePriority = '2'

                self.mo_dict['Lock_SectorEquipmentFunction_FieldReplaceableUnit'] = {
                    'managedElementId': self.node,
                    'Equipment': {'equipmentId': '1',
                                  'FieldReplaceableUnit': [{'attributes': {'xc:operation': 'update'}, 'fieldReplaceableUnitId': _,
                                                            'administrativeState': '0 (LOCKED)'} for _ in fru]},
                    'NodeSupport': {'nodeSupportId': '1',
                                    'SectorEquipmentFunction': [{'attributes': {'xc:operation': 'update'}, 'sectorEquipmentFunctionId': _,
                                                                 'administrativeState': '0 (LOCKED)'} for _ in sef]},
                }
                self.mo_dict['set-FieldReplaceableUnit-isSharedWithExternalMe-false'] = {
                    'managedElementId': self.node, 'Equipment': {'equipmentId': '1', 'FieldReplaceableUnit': [
                        {'attributes': {'xc:operation': 'update'}, 'fieldReplaceableUnitId': _, 'isSharedWithExternalMe': 'true'} for _ in fru]}}

                self.mo_dict['create-NodeGroupSyncMember'] = {
                    'managedElementId': self.node,
                    'Transport': {'transportId': '1', 'Synchronization': {'synchronizationId': '1', 'RadioEquipmentClock': {
                        'radioEquipmentClockId': '1', 'NodeGroupSyncMember': {
                            'attributes': {'xc:operation': 'create'}, 'nodeGroupSyncMemberId': '1', 'administrativeState': '0 (LOCKED)',
                            'syncNodePriority': syncNodePriority, 'selectionMode': '2 (REFERENCE_AND_NODE_PRIORITY)',
                            'syncRiPortCandidate': riport}}}}}
                self.mo_dict['lock-NodeGroupSyncMember'] = {
                    'managedElementId': self.node,
                    'Transport': {'transportId': '1', 'Synchronization': {'synchronizationId': '1', 'RadioEquipmentClock': {
                        'radioEquipmentClockId': '1', 'NodeGroupSyncMember': {'attributes': {'xc:operation': 'update'},
                                                                              'nodeGroupSyncMemberId': '1', 'administrativeState': '0 (LOCKED)'}}}}}
                self.mo_dict['update-NodeGroupSyncMember'] = {
                    'managedElementId': self.node,
                    'Transport': {'transportId': '1', 'Synchronization': {'synchronizationId': '1', 'RadioEquipmentClock': {
                        'attributes': {'xc:operation': 'update'}, 'radioEquipmentClockId': '1', 'freqDeviationThreshold': '600',
                        'NodeGroupSyncMember': {
                            'attributes': {'xc:operation': 'update'}, 'nodeGroupSyncMemberId': '1', 'syncRiPortCandidate': riport,
                            'selectionMode': '2 (REFERENCE_AND_NODE_PRIORITY)', 'syncNodePriority': syncNodePriority}}}}}

                self.mo_dict['set-FeatureState-CXC4012015-CXC4011018'] = {'managedElementId': self.node, 'SystemFunctions': {
                    'systemFunctionsId': '1', 'Lm': {'lmId': '1', 'FeatureState': [
                        {'attributes': {'xc:operation': 'update'}, 'featureStateId': 'CXC4012015', 'featureState': '1 (ACTIVATED)'},
                        {'attributes': {'xc:operation': 'update'}, 'featureStateId': 'CXC4011018', 'featureState': '1 (ACTIVATED)'}
                    ]}}}
                self.mo_dict['unlock-SectorEquipmentFunction-FieldReplaceableUnit-NodeGroupSyncMember'] = {
                    'managedElementId': self.node,
                    'Equipment': {'equipmentId': '1',
                                  'FieldReplaceableUnit': [{'attributes': {'xc:operation': 'update'}, 'fieldReplaceableUnitId': _,
                                                            'administrativeState': '1 (UNLOCKED)'} for _ in fru]},
                    'NodeSupport': {'nodeSupportId': '1',
                                    'SectorEquipmentFunction': [{'attributes': {'xc:operation': 'update'}, 'sectorEquipmentFunctionId': _,
                                                                 'administrativeState': '1 (UNLOCKED)'} for _ in sef]},
                    'Transport': {'transportId': '1', 'Synchronization': {'synchronizationId': '1', 'RadioEquipmentClock': {
                        'radioEquipmentClockId': '1', 'NodeGroupSyncMember': {
                            'attributes': {'xc:operation': 'update'}, 'nodeGroupSyncMemberId': '1', 'administrativeState': '1 (UNLOCKED)'}}}},

                }
