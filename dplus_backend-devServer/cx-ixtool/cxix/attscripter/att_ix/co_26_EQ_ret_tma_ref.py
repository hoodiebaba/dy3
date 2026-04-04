import copy
from .att_xml_base import att_xml_base


class co_26_EQ_ret_tma_ref(att_xml_base):
    def create_rpc_msg(self):
        self.df_ant = self.usid.df_ant.copy().loc[self.usid.df_ant.postsite == self.node]
        self.df_ant = self.df_ant.loc[~(self.df_ant.carrier.str.contains('MC'))]
        new_fru = list(self.df_ant.loc[(self.df_ant.addcell & (~self.df_ant.antflag)) |
                                       (self.df_ant.addcell & self.df_ant.presite.isnull())].fru.unique())
        self.df_ant_near_unit = self.usid.df_ant_near_unit.copy().loc[(self.usid.df_ant_near_unit.postsite == self.node) &
                                                                      (self.usid.df_ant_near_unit.fru.isin(new_fru))]
        aug_dict = {}
        auu_dict = {}
        asu_dict = {}
        rfb_dict = {}
        for row_ret in self.df_ant_near_unit.itertuples():
            if row_ret.anufdn in [None, 'None', '']: continue
            ant_near_mo = F'Equipment=1,AntennaUnitGroup={row_ret.aug},AntennaNearUnit={row_ret.anu}'
            site = self.usid.sites.get(F'site_{row_ret.presite}')
            # RetSubUnit
            for ret_mo in site.find_mo_ending_with_parent_str('RetSubUnit', row_ret.anufdn):
                tmp_dict = site.dcg.get(ret_mo)
                ret_mo_id = 'RetSubUnitId' if 'RetSubUnitId' in tmp_dict.keys() else 'retSubUnitId'
                ret_fdn = F'{ant_near_mo},RetSubUnit={tmp_dict[ret_mo_id]}'
                for asu_ref in tmp_dict['reservedBy']:
                    if ',AntennaSubunit=' in asu_ref:
                        asu_list = [_.split('=')[-1] for _ in asu_ref.split(',')[-3:]]
                        aug_fdn = F'Equipment=1,AntennaUnitGroup={asu_list[0]}'
                        auu_fdn = F'{aug_fdn},AntennaUnit={asu_list[1]}'
                        asu_fdn = F'{auu_fdn},AntennaSubunit={asu_list[2]}'
                        if aug_fdn not in aug_dict:
                            aug_dict[aug_fdn] = {'attributes': {'xc:operation': 'create'}, 'antennaUnitGroupId': asu_list[0], 'AntennaUnit': [],
                                                 'RfBranch': []}
                            if self.validate_mo_exist_on_site_with_no_eq_change(aug_fdn): del aug_dict[aug_fdn]['attributes']
                            elif len(self.df_ant.loc[self.df_ant.aug == asu_list[0]].index) > 0: del aug_dict[aug_fdn]['attributes']
                        if auu_fdn not in auu_dict:
                            auu_dict[auu_fdn] = {'attributes': {'xc:operation': 'create'}, 'antennaUnitId': asu_list[1],
                                                'mechanicalAntennaTilt': '0', 'AntennaSubunit': []}
                            if self.validate_mo_exist_on_site_with_no_eq_change(auu_fdn) or \
                                len(self.df_ant.loc[(self.df_ant.aug == asu_list[0]) & (self.df_ant.au == asu_list[1])].index) > 0:
                                del auu_dict[auu_fdn]['attributes']
                        if asu_fdn not in asu_dict:
                            asu_dict[asu_fdn] = {'attributes': {'xc:operation': 'create'}, 'antennaSubunitId':  asu_list[2],
                                                 'retSubunitRef': ret_fdn}
                            if self.validate_mo_exist_on_site_with_no_eq_change(asu_fdn) or \
                                    len(self.df_ant.loc[(self.df_ant.aug == asu_list[0]) & (self.df_ant.au == asu_list[1]) &
                                                        (self.df_ant.asu == asu_list[2])].index) > 0:
                                asu_dict[asu_fdn]['attributes'] = {'xc:operation': 'update'}
            #   TmaSubUnit
            for ret_mo in site.find_mo_ending_with_parent_str('TmaSubUnit', row_ret.anufdn):
                tmp_dict = site.dcg.get(ret_mo)
                ret_mo_id = 'TmaSubUnitId' if 'TmaSubUnitId' in tmp_dict.keys() else 'tmaSubUnitId'
                ret_fdn = F'{ant_near_mo},TmaSubUnit={tmp_dict[ret_mo_id]}'
                for asu_ref in tmp_dict['reservedBy']:
                    if ',RfBranch=' in asu_ref:
                        asu_list = [_.split('=')[-1] for _ in asu_ref.split(',')[-2:]]
                        aug_fdn = F'Equipment=1,AntennaUnitGroup={asu_list[0]}'
                        rfb_fdn = F'{aug_fdn},RfBranch={asu_list[1]}'
                        if aug_fdn not in aug_dict:
                            aug_dict[aug_fdn] = {'attributes': {'xc:operation': 'create'}, 'antennaUnitGroupId': asu_list[0], 'AntennaUnit': [],
                                                 'RfBranch': []}
                            if self.validate_mo_exist_on_site_with_no_eq_change(aug_fdn) or \
                                    len(self.df_ant.loc[self.df_ant.aug == asu_list[0]].index) > 0:
                                del aug_dict[aug_fdn]['attributes']
                        if rfb_fdn not in rfb_dict:
                            rfb_dict[rfb_fdn] = {'attributes': {'xc:operation': 'create'}, 'rfBranchId': asu_list[1], 'tmaRef': ret_fdn}
                            if self.validate_mo_exist_on_site_with_no_eq_change(rfb_fdn) or \
                                    len(self.df_ant.loc[(self.df_ant.aug == asu_list[0]) & (self.df_ant.rfb == asu_list[1])].index) > 0:
                                rfb_dict[rfb_fdn]['attributes'] = {'xc:operation': 'update'}

        eq_dict = {'managedElementId': self.node, 'Equipment': {'equipmentId': '1', 'AntennaUnitGroup': []}}
        # Antenna Systems
        for j in auu_dict.keys():
            for i in [_ for _ in asu_dict.keys() if _.startswith(F'{j},AntennaSubunit=')]: auu_dict[j]['AntennaSubunit'].append(asu_dict[i].copy())
        for j in aug_dict.keys():
            for i in [_ for _ in auu_dict.keys() if _.startswith(F'{j},AntennaUnit=')]: aug_dict[j]['AntennaUnit'].append(auu_dict[i].copy())
            for i in [_ for _ in rfb_dict.keys() if _.startswith(F'{j},RfBranch=')]: aug_dict[j]['RfBranch'].append(rfb_dict[i].copy())
            eq_dict['Equipment']['AntennaUnitGroup'].append(aug_dict[j].copy())
        if len(eq_dict['Equipment']['AntennaUnitGroup']) > 0:
            self.mo_dict['AntennaSubunit=ret,RfBranch=tma'] = copy.deepcopy(eq_dict)
