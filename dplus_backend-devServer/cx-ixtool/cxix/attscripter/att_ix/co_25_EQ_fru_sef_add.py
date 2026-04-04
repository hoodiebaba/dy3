import copy
from .att_xml_base import att_xml_base


class co_25_EQ_fru_sef_add(att_xml_base):
    def create_rpc_msg(self):
        self.df_ant_near_unit = self.usid.df_ant_near_unit.copy().loc[self.usid.df_ant_near_unit.postsite == self.node]
        self.df_ant = self.usid.df_ant.copy().loc[self.usid.df_ant.postsite == self.node]
        self.df_ant = self.df_ant.loc[~(self.df_ant.carrier.str.contains('MC'))]
        self.df_ant = self.df_ant.loc[(self.df_ant.addcell & ~self.df_ant.antflag) | (self.df_ant.addcell & self.df_ant.presite.isnull())]

        #   XMU Create
        aug_dict = {}
        anu_dict = {}
        auu_dict = {}
        asu_dict = {}
        fru_dict = {}
        rfb_dict = {}
        sef_dict = {}
        ril_dict = {}
        iqd_ref = []
        row = self.usid.df_xmu.copy().loc[self.usid.df_xmu.postsite == self.node].iloc[0]
        if row.flag1 or row.flag1:
            mo_dict = self.get_mo_dict_from_moc_node_fdn_moid('FieldReplaceableUnit', None, None, 'XMU')
            mo_dict['RiPort'] = [{'attributes': {'xc:operation': 'create'}, 'riPortId': F'{i}', 'administrativeState': '1 (UNLOCKED)'}
                                 for i in [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16]]
            for i in range(1, 3):
                if row.get(F'flag{i}'):
                    fru_fdn = F'Equipment=1,FieldReplaceableUnit={row.get(F"xmu{i}")}'
                    if fru_fdn not in fru_dict.keys():
                        mo_dict |= {'fieldReplaceableUnitId': row.get(F'xmu{i}')}
                        fru_dict[fru_fdn] = copy.deepcopy(mo_dict)
        #   Radio, Antenna System & SectorEquipmentFunction for cell
        for postcell in self.df_ant.postcell.unique():
            rfb_ref = []
            df_temp = self.df_ant.loc[self.df_ant.postcell == postcell]
            for fru in df_temp.fru.unique():
                row = df_temp.loc[df_temp.fru == fru].head(1).iloc[0]
                fru_fdn = F'Equipment=1,FieldReplaceableUnit={fru}'
                if self.site and len(self.site.get_mos_w_end_str(fru_fdn)) > 0: fru_fdn = self.site.get_mo_w_end_str(fru_fdn)
                frutype = ''.join(row.frutypecix)
                sup = ['false', '-1'] if 'AIR' in frutype else ['true', '70']
                if self.validate_mo_exist_on_site_with_no_eq_change(fru_fdn):
                    rfports = [_.get('rfPortId') for _ in self.append_mos_equipment_elems(self.site, fru_fdn, 'RfPort')]
                    transrecivers = [_.get('transceiverId') for _ in self.append_mos_equipment_elems(self.site, fru_fdn, 'Transceiver')]
                    mo_dict = {'fieldReplaceableUnitId': fru, 'RfPort': [], 'Transceiver': []}
                    for row_rfp in df_temp.loc[df_temp.fru == fru, ['rfp', 'trecid']].drop_duplicates().itertuples():
                        if (not self.validate_empty_none_value(row_rfp.rfp)) and row_rfp.rfp not in rfports:
                            temp_dict = self.get_mo_dict_from_moc_node_fdn_moid('RfPort', None, None, row_rfp.rfp)
                            temp_dict |= {'vswrSupervisionActive': sup[0], 'vswrSupervisionSensitivity': sup[1]}
                            mo_dict['RfPort'].append(copy.deepcopy(temp_dict))
                        elif not self.validate_empty_none_value(row_rfp.trecid):
                            rfb_ref.append(F'{fru_fdn},Transceiver={row_rfp.trecid}')
                            if row_rfp.trecid not in transrecivers:
                                mo_dict['Transceiver'].append(
                                    self.get_mo_dict_from_moc_node_fdn_moid('Transceiver', None, None, row_rfp.trecid))
                    if len(mo_dict['RfPort']) > 0 or len(mo_dict['Transceiver']) > 0:
                        if fru_fdn in fru_dict.keys():
                            fru_dict[fru_fdn]['RfPort'].extend(mo_dict['RfPort'])
                            fru_dict[fru_fdn]['Transceiver'].extend(mo_dict['Transceiver'])
                        else: fru_dict[fru_fdn] = copy.deepcopy(mo_dict)
                elif fru_fdn in fru_dict.keys():
                    rfports = [_.get('rfPortId') for _ in fru_dict[fru_fdn]['RfPort']]
                    transrecivers = [_.get('transceiverId') for _ in fru_dict[fru_fdn]['Transceiver']]
                    for row_rfp in df_temp.loc[df_temp.fru == fru, ['rfp', 'trecid']].drop_duplicates().itertuples():
                        if row_rfp.rfp not in [None, 'None', ''] and row_rfp.rfp not in rfports:
                            temp_dict = self.get_mo_dict_from_moc_node_fdn_moid('RfPort', None, None, row_rfp.rfp)
                            temp_dict |= {'vswrSupervisionActive': sup[0], 'vswrSupervisionSensitivity': sup[1]}
                            fru_dict[fru_fdn]['RfPort'].append(copy.deepcopy(temp_dict))
                        elif row_rfp.trecid not in [None, 'None', '']:
                            rfb_ref.append(F'{fru_fdn},Transceiver={row_rfp.trecid}')
                            if row_rfp.trecid not in transrecivers:
                                fru_dict[fru_fdn]['Transceiver'].append(
                                    self.get_mo_dict_from_moc_node_fdn_moid('Transceiver', None, None, row_rfp.trecid))
                else:
                    mo_dict = self.get_mo_dict_from_moc_node_fdn_moid('FieldReplaceableUnit', row.presite, row.frufdn, fru)
                    mo_dict |= {'isSharedWithExternalMe': row.isshared, 'RiPort': [], 'RfPort': [], 'AlarmPort': [], 'Transceiver': []}
                    if 'auxPlugInUnitId' in mo_dict.keys(): del mo_dict['auxPlugInUnitId']
                    if row.frufdn is not None:
                        for moc in ['RiPort', 'RfPort', 'AlarmPort', 'Transceiver']:
                            mo_dict[moc].extend(self.append_mos_equipment_elems(row.presite, row.frufdn, moc))
                        for tmp_dict in mo_dict['Transceiver']: rfb_ref.append(F'{fru_fdn},Transceiver={tmp_dict.get("transceiverId")}')
                    else:
                        mo_dict['AlarmPort'].extend(self.get_alarmport_mo_list(frutype))
                        mo_dict['RiPort'].extend(self.get_riport_mo_list(frutype))
                        temp_dict = self.get_rfport_transceiver_rfb_ref_mo_dict(
                            df_temp.loc[df_temp.fru == fru, ['rfp', 'trecid']].drop_duplicates(), frutype, sup, fru_fdn)

                        mo_dict['RfPort'].extend(temp_dict['RfPort'])
                        mo_dict['Transceiver'].extend(temp_dict['Transceiver'])
                        rfb_ref.extend(temp_dict['rfb_ref'])
                    fru_dict[fru_fdn] = copy.deepcopy(mo_dict)

                # AntennaNearUnit
                for row_ret in self.df_ant_near_unit.loc[self.df_ant_near_unit.fru == fru].itertuples():
                    aug_fdn = F'Equipment=1,AntennaUnitGroup={row_ret.aug}'
                    if self.site and len(self.site.get_mos_w_end_str(aug_fdn)) > 0: aug_fdn = self.site.get_mo_w_end_str(aug_fdn)
                    anu_fdn = F'{aug_fdn},AntennaNearUnit={row_ret.anu}'
                    if row_ret.anufdn in [None, 'None', ''] or anu_fdn in anu_dict: continue
                    if aug_fdn not in aug_dict.keys():
                        aug_dict[aug_fdn] = {'attributes': {'xc:operation': 'create'}, 'antennaUnitGroupId': row_ret.aug,
                                             'AntennaNearUnit': [], 'AntennaUnit': [], 'RfBranch': []}
                        if self.validate_mo_exist_on_site_with_no_eq_change(aug_fdn): del aug_dict[aug_fdn]['attributes']
                    mo_dict = self.get_mo_dict_from_moc_node_fdn_moid('AntennaNearUnit', row_ret.presite, row_ret.anufdn, row_ret.anu)
                    mo_dict |= {'rfPortRef': F'Equipment=1,FieldReplaceableUnit={row_ret.fru},RfPort={row_ret.rfp}',
                                'TmaSubUnit': [], 'RetSubUnit': []}
                    for moc in ['TmaSubUnit', 'RetSubUnit']:
                        child_mos = self.append_mos_equipment_elems(row_ret.presite, row_ret.anufdn, moc)
                        if len(child_mos) > 0: mo_dict[moc].extend(child_mos)
                    anu_dict[anu_fdn] = copy.deepcopy(mo_dict)

            # AntennaUnitGroup, AntennaUnit, AntennaSubunit,
            if len(rfb_ref) == 0:
                for aug in df_temp.loc[~df_temp.aup.isin([None, 'None', ''])].aug.unique():
                    aug_fdn = F'Equipment=1,AntennaUnitGroup={aug}'
                    if self.site and len(self.site.get_mos_w_end_str(F'Equipment=1,AntennaUnitGroup={aug}')) > 0:
                        aug_fdn = self.site.get_mo_w_end_str(F'Equipment=1,AntennaUnitGroup={aug}')
                    if aug_fdn not in aug_dict.keys():
                        aug_dict[aug_fdn] = {'attributes': {'xc:operation': 'create'}, 'antennaUnitGroupId': aug,
                                             'AntennaNearUnit': [], 'AntennaUnit': [], 'RfBranch': []}
                        if self.validate_mo_exist_on_site_with_no_eq_change(aug_fdn): del aug_dict[aug_fdn]['attributes']
                    for row_au in df_temp.loc[df_temp.aug == aug, ['presite', 'au', 'aufdn', 'mt']].drop_duplicates().itertuples():
                        auu_fdn = F'{aug_fdn},AntennaUnit={row_au.au}'
                        if auu_fdn not in auu_dict.keys() and row_au.au not in [None, 'None', '']:
                            auu_dict[auu_fdn] = self.get_mo_dict_from_moc_node_fdn_moid('AntennaUnit', row_au.presite, row_au.aufdn, row_au.au)
                            auu_dict[auu_fdn] |= {'mechanicalAntennaTilt': row_au.mt, 'AntennaSubunit': []}
                        for row_asu in df_temp.loc[((df_temp.aug == aug) &
                                                    (df_temp.au == row_au.au)), ['presite', 'asu', 'asufdn']].drop_duplicates().itertuples():
                            asu_fdn = F'{auu_fdn},AntennaSubunit={row_asu.asu}'
                            if asu_fdn not in asu_dict.keys() and row_asu.asu not in [None, 'None', '']:
                                asu_dict[asu_fdn] = self.get_mo_dict_from_moc_node_fdn_moid('AntennaSubunit', row_asu.presite, row_asu.asufdn,
                                                                                            row_asu.asu)
                                asu_dict[asu_fdn]['AuPort'] = []
                            for row_aup in df_temp.loc[(df_temp.aug == aug) & (df_temp.au == row_au.au) & (df_temp.asu == row_asu.asu)].itertuples():
                                app_fdn = ''
                                if row_aup.aup not in [None, 'None', '']:
                                    app_fdn = F'{asu_fdn},AuPort={row_aup.aup}'
                                    temp_dict = self.get_mo_dict_from_moc_node_fdn_moid('AuPort', row_aup.presite, row_aup.aupfdn, row_aup.aup)
                                    asu_dict[asu_fdn]['AuPort'].append(copy.deepcopy(temp_dict))
                                rfb_fdn = F'{aug_fdn},RfBranch={row_aup.rfb}'
                                temp_dict = self.get_mo_dict_from_moc_node_fdn_moid('RfBranch', row_aup.presite, row_aup.rfbfdn, row_aup.rfb)
                                temp_dict |= {
                                    'auPortRef': app_fdn, 'rfPortRef': F'Equipment=1,FieldReplaceableUnit={row_aup.fru},RfPort={row_aup.rfp}',
                                    'dlTrafficDelay': [row_aup.dl_ul_delay_att[0]] * 15, 'dlAttenuation': [row_aup.dl_ul_delay_att[2]] * 15,
                                    'ulTrafficDelay': [row_aup.dl_ul_delay_att[1]] * 15, 'ulAttenuation': [row_aup.dl_ul_delay_att[3]] * 15
                                }
                                rfb_dict[rfb_fdn] = copy.deepcopy(temp_dict)
                                rfb_ref += [rfb_fdn]
            # SectorEquipmentFunction
            for sef in df_temp.sef.unique():
                sef_fdn = F'NodeSupport=1,SectorEquipmentFunction={sef}'
                mo_dict = self.get_mo_dict_from_moc_node_fdn_moid('SectorEquipmentFunction', self.node, sef_fdn, sef)
                mo_dict |= {'rfBranchRef': rfb_ref}
                sef_dict[sef_fdn] = copy.deepcopy(mo_dict)
        # RiLink
        for row in self.usid.df_ril.copy().loc[self.usid.df_ril.postsite == self.node].itertuples():
            ril_fdn = F'Equipment=1,RiLink={row.rilid}'
            mo_dict = self.get_mo_dict_from_moc_node_fdn_moid('RiLink', None, None, row.rilid)
            mo_dict |= {'riPortRef1': F'Equipment=1,FieldReplaceableUnit={row.fru1},RiPort={row.rip1}',
                        'riPortRef2': F'Equipment=1,FieldReplaceableUnit={row.fru2},RiPort={row.rip2}'}
            ril_dict[ril_fdn] = copy.deepcopy(mo_dict)
            iqd_ref.append(ril_fdn)

        # CpriLinkIqData
        iqd_fdn = F'NodeSupport=1,CpriLinkIqData=1'
        if self.site and not self.eq_flag and self.site.get_mos_w_end_str(iqd_fdn):
            iqd_fdn = self.site.get_mos_w_end_str(iqd_fdn)[0]
            iqd_dict = self.get_mo_dict_from_moc_node_fdn_moid('CpriLinkIqData', self.node, iqd_fdn, '1')
            iqd_dict |= {'attributes': {'xc:operation': 'update'}, 'riLinkRef': iqd_ref}
        else:
            iqd_dict = self.get_mo_dict_from_moc_node_fdn_moid('CpriLinkIqData', self.node, iqd_fdn, '1')
            iqd_dict |= {'riLinkRef': iqd_ref}
        eq_dict = {
            'managedElementId': self.node,
            'Equipment': {'equipmentId': '1', 'FieldReplaceableUnit': [], 'AntennaUnitGroup': [],  'RiLink': []},
            'NodeSupport': {'nodeSupportId': '1', 'SectorEquipmentFunction': [], 'CpriLinkIqData': copy.deepcopy(iqd_dict)},
        }

        # FieldReplaceableUnit, RiLink, SectorEquipmentFunction
        for _ in fru_dict: eq_dict['Equipment']['FieldReplaceableUnit'].append(copy.deepcopy(fru_dict[_]))
        for _ in ril_dict: eq_dict['Equipment']['RiLink'].append(copy.deepcopy(ril_dict[_]))
        for _ in sef_dict: eq_dict['NodeSupport']['SectorEquipmentFunction'].append(copy.deepcopy(sef_dict[_]))

        # AntennaNearUnit fix for iuantDeviceType 1 (S-RET), 17 (M-RET), 2 (TMA)
        for i in anu_dict:
            if 'iuantDeviceType' in anu_dict[i] and ' (' in anu_dict[i]['iuantDeviceType']:
                anu_dict[i]['iuantDeviceType'] = anu_dict[i]['iuantDeviceType'].split(' (')[0]
        # Antenna Systems
        for j in auu_dict.keys():
            for i in [_ for _ in asu_dict.keys() if _.startswith(F'{j},AntennaSubunit=')]:
                auu_dict[j]['AntennaSubunit'].append(copy.deepcopy(asu_dict[i]))
        for j in aug_dict.keys():
            for i in [_ for _ in anu_dict.keys() if _.startswith(F'{j},AntennaNearUnit=')]: aug_dict[j]['AntennaNearUnit'].append(copy.deepcopy(anu_dict[i]))
            for i in [_ for _ in auu_dict.keys() if _.startswith(F'{j},AntennaUnit=')]: aug_dict[j]['AntennaUnit'].append(copy.deepcopy(auu_dict[i]))
            for i in [_ for _ in rfb_dict.keys() if _.startswith(F'{j},RfBranch=')]: aug_dict[j]['RfBranch'].append(copy.deepcopy(rfb_dict[i]))
            eq_dict['Equipment']['AntennaUnitGroup'].append(copy.deepcopy(aug_dict[j]))

        if len(eq_dict['Equipment']['FieldReplaceableUnit']) > 0 or len(eq_dict['Equipment']['AntennaUnitGroup']) > 0 or \
                len(eq_dict['Equipment']['RiLink']) > 0 or len(eq_dict['NodeSupport']['SectorEquipmentFunction']) > 0:
            self.mo_dict['Equipment=data,NodeSupport=data'] = eq_dict

    def append_mos_equipment_elems(self, node, parent_fdn, moc):
        """
        :rtype: list
        """
        if self.usid.sites.get(F'site_{node}') is None: return []
        site = self.usid.sites.get(F'site_{node}')
        mos = []
        db_dict = self.get_db_dict_with_cr_for_mo_moid(moc)
        parent = F'{parent_fdn},DeviceGroup=ru' if moc == 'RfPort' and site.equipment_name in ['DUS', 'DUL'] else parent_fdn
        for c_mo in site.find_mo_ending_with_parent_str(moc=moc, parent=parent):
            tmp_dict = site.site_extract_data(c_mo)
            db_dict_c = copy.deepcopy(db_dict)
            for para in db_dict_c:
                db_dict_c[para] = tmp_dict.get(para, db_dict[para])
            mos.append(db_dict_c)
        return mos

    def get_rfport_transceiver_rfb_ref_mo_dict(self, df_rfp, frutype, sup, fru_fdn):
        """
        RfPort
        Transceiver
        :rtype: dict
        """
        mo_dict = {'RfPort': [], 'Transceiver': [], 'rfb_ref': []}
        temp_dict = self.get_mo_dict_for_moc_node_fdn('RfPort')
        temp_dict |= {'attributes': {'xc:operation': 'create'}}
        if 'AIR' not in frutype:
            temp_dict |= {'rfPortId': 'R', 'vswrSupervisionActive': 'false', 'vswrSupervisionSensitivity': '-1'}
            mo_dict['RfPort'].append(copy.deepcopy(temp_dict))
        temp_dict |= {'vswrSupervisionActive': sup[0], 'vswrSupervisionSensitivity': sup[1]}
        for row_rfp in df_rfp.itertuples():
            if row_rfp.rfp not in [None, 'None', '']:
                temp_dict['rfPortId'] = row_rfp.rfp
                mo_dict['RfPort'].append(copy.deepcopy(temp_dict))
            elif row_rfp.trecid not in [None, 'None', '']:
                temp_tre_dict = self.get_mo_dict_for_moc_node_fdn('Transceiver')
                temp_tre_dict |= {'attributes': {'xc:operation': 'create'}, 'transceiverId': row_rfp.trecid}
                mo_dict['Transceiver'].append(copy.deepcopy(temp_tre_dict))
                mo_dict['rfb_ref'].append(F'{fru_fdn},Transceiver={row_rfp.trecid}')
        return mo_dict

    def get_alarmport_mo_list(self, frutype):
        mo_list = []
        temp_dict = self.get_mo_dict_for_moc_node_fdn('AlarmPort')
        temp_dict |= {'attributes': {'xc:operation': 'create'}}
        alarm_port = 8
        if len([_ for _ in ['6448', '6449', '3246', '5331', '1281', '5331', '6419'] if _ in frutype]): alarm_port = 0
        elif len([_ for _ in ['2203', '2205', '4402', '4415', '4478', '4449', '8843', '4426', '8863'] if _ in frutype]) > 0: alarm_port = 2
        for port in range(1, alarm_port + 1):
            temp_dict['alarmPortId'] = str(port)
            mo_list.append(copy.deepcopy(temp_dict))
        return mo_list

    def get_riport_mo_list(self, frutype):
        mo_list = []
        temp_dict = self.get_mo_dict_for_moc_node_fdn('RiPort')
        temp_dict |= {'attributes': {'xc:operation': 'create'}}
        riport = ['DATA_1', 'DATA_2']
        if len([_ for _ in ['6449', '6448', '3246', '1281', '5331'] if _ in frutype]) > 0: riport += ['DATA_3', 'DATA_4']
        for port in riport:
            temp_dict['riPortId'] = port
            mo_list.append(copy.deepcopy(temp_dict))
        return mo_list
