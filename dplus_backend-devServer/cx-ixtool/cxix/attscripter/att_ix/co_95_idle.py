import copy
from .att_xml_base import att_xml_base


class co_95_idle(att_xml_base):
    def create_rpc_msg(self):
        if self.usid.script.get(self.__class__.__name__, False): return
        else: self.usid.script[self.__class__.__name__] = True
        if len(self.usid.df_idle.index) == 0: return
        for node in self.usid.df_idle.siteid.unique():
            self.set_node_site_and_para_for_dcgk(node)
            # self.node = node
            for row in self.usid.df_idle.loc[self.usid.df_idle.siteid == self.node].itertuples():
                moid = F'idle-{self.node}-{row.eran_type}--TnPort={row.tnport}|VlanPort={row.ethport}'
                self.mo_dict[moid] = {
                    'managedElementId': self.node,
                    'Equipment': {'equipmentId': '1', 'FieldReplaceableUnit': {'fieldReplaceableUnitId': row.bbuid, 'TnPort': {
                        'attributes': {'xc:operation': 'create'}, 'tnPortId': row.tnport, 'userLabel': F'eth_{row.ethport}'}}},
                    'Transport': {'transportId': '1',
                                  'EthernetPort': {'attributes': {'xc:operation': 'create'}, 'ethernetPortId': row.ethport,
                                                   'administrativeState': '1 (UNLOCKED)', 'autoNegEnable': 'false',
                                                   'admOperatingMode': '9 (10G_FULL)', 'userLabel': F'IDL_{row.tnport}_port',
                                                   'encapsulation': F'Equipment=1,FieldReplaceableUnit={row.bbuid},TnPort={row.tnport}'},
                                  'VlanPort': {'attributes': {'xc:operation': 'create'}, 'vlanPortId': F'{row.ethport}',
                                               'vlanId': row.vlanid, 'userLabel': F'l3_vlan_{row.vlanid}',
                                               'encapsulation': F'Transport=1,EthernetPort={row.ethport}'},
                                  },
                }
                t_row = self.usid.df_idle.loc[((self.usid.df_idle.idle_pair == row.idle_pair) & (self.usid.df_idle.siteid != self.node))].iloc[0]
                if row.tech == 'LTE' and row.nodeid is not None:
                    self.mo_dict[F'{moid}_ENodeBFunction=1-eranVlanPortRef'] = {'managedElementId': self.node, 'ENodeBFunction': {
                        'attributes': {'xc:operation': 'update'}, 'eNodeBFunctionId': '1',
                        'eranVlanPortRef': F'Transport=1,VlanPort={row.ethport}',
                        'QciTable': {'qciTableId': 'default', 'QciProfilePredefined': {
                            'attributes': {'xc:operation': 'update'}, 'qciProfilePredefinedId': 'qci1', 'schedulingAlgorithm': '6 (DELAY_BASED)'}}}}
                elif row.tech == 'NR' and row.nodeid is not None and t_row.nodeid is not None:
                    self.mo_dict[F'{moid}-ExtGNBDUPartnerFunction={t_row.siteid}'] = {
                        'managedElementId': self.node,
                        'GNBDUFunction': {
                            'attributes': {'xc:operation': 'update'}, 'gNBDUFunctionId': '1', 'caVlanPortRef': F'Transport=1,VlanPort={row.ethport}',
                            'ExtGNBDUPartnerFunction': {
                                'attributes': {'xc:operation': 'create'}, 'extGNBDUPartnerFunctionId': t_row.siteid, 'gNBDUId': '1',
                                'gNBId': t_row.nodeid, 'gNBIdLength': '26'
                            }
                        }
                    }
            self.mo_dict[F'{self.node}-idle-feature-CXC4011700|CXC4011983|CXC4012034|CXC4011980'] = {
                'managedElementId': self.node, 'SystemFunctions': {'systemFunctionsId': '1', 'Lm': {'lmId': '1', 'FeatureState': [
                    {'attributes': {'xc:operation': 'update'}, 'featureStateId': 'CXC4011700', 'featureState': '0 (DEACTIVATED)'},
                    {'attributes': {'xc:operation': 'update'}, 'featureStateId': 'CXC4011983', 'featureState': '0 (DEACTIVATED)'},
                    {'attributes': {'xc:operation': 'update'}, 'featureStateId': 'CXC4012034', 'featureState': '1 (ACTIVATED)'},
                    {'attributes': {'xc:operation': 'update'}, 'featureStateId': 'CXC4011980', 'featureState': '1 (ACTIVATED)'}]}}}

            # Write Script to File
            self.create_script_from_mo_dict()
            self.write_script_file()
            self.mo_dict = {}
