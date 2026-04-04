import copy
from .att_xml_base import att_xml_base


class co_21_DELETE_cell(att_xml_base):
    def create_rpc_msg(self):
        if not self.no_eq_change_with_dcgk_flag: return
        df_cell = self.usid.df_enb_cell.copy()
        df_cell = df_cell.loc[((df_cell.presite == self.node) & (df_cell.movement == 'yes') & (~df_cell.fdn.isnull()))]
        if len(df_cell.index) == 0: return
        site = self.usid.sites.get(F'site_{self.node}')
        for mo in site.find_mo_ending_with_parent_str('NodeSupport', self.me):
            for mo_1 in site.find_mo_ending_with_parent_str('CpriLinkIqData', mo):
                self.mo_dict[F'{mo_1}_update_riLinkRef'] = site.get_delete_dict_form_mo(mo_1, 2)
                self.mo_dict[F'{mo_1}_update_riLinkRef']['NodeSupport']['CpriLinkIqData'] |= {
                    'attributes': {'xc:operation': 'update'}, 'riLinkRef': {'attributes': {'xc:operation': 'delete'}}}
        # cell_set = set()
        sc_set = set()
        nbiot_ul_set = set()
        rfb_set = set()
        sef_set = set()
        for row in df_cell.itertuples():
            # NbIotCell, EUtranCellRelation delete
            for ref in [site.get_mo_w_end_str(_) for _ in site.site_extract_data(row.fdn).get('reservedBy')]:
                if ',NbIotCell=' in ref:
                    if ref not in nbiot_ul_set:
                        nbiot_ul_set.add(ref)
                        self.mo_dict[F'{ref}_lock'] = site.get_lock_dict_form_mo(ref, 2)
                        self.mo_dict[F'{ref}_delete'] = site.get_delete_dict_form_mo(ref, 2)
                elif ',EUtranCellRelation=' in ref:
                    self.mo_dict[F'{ref}_delete'] = site.get_delete_dict_form_mo(ref, 4)
            # Cell Child MOs delete
            for moc_name in ['PmUeMeasControl', 'SecPmUeMeasControl', 'ReportConfigEUtraInterFreqPm', 'ReportConfigEUtraInterFreqSec',
                             'ReportConfigEUtraIntraFreqPm', 'ReportConfigEUtraIntraFreqSec', 'ReportConfigInterRatPm', 'ReportConfigInterRatSec']:
                for mo in site.find_mo_ending_with_parent_str(moc_name, F'{row.fdn},UeMeasControl=1'):
                    self.mo_dict[F'{mo}_delete'] = site.get_delete_dict_form_mo(mo, 4)
            # Cell delete
            self.mo_dict[F'{row.fdn}_delete'] = site.get_delete_dict_form_mo(row.fdn, 2)
            for sc in [site.get_mo_w_end_str(_) for _ in site.site_extract_data(row.fdn).get('sectorCarrierRef')]:
                if sc in sc_set: continue
                sc_set.add(sc)
                # UlCompGroup, NbIotCell delete
                for res in [site.get_mo_w_end_str(_) for _ in site.site_extract_data(sc).get('reservedBy')]:
                    if ',UlCompGroup=' in res or ',NbIotCell=' in res:
                        if res not in nbiot_ul_set:
                            nbiot_ul_set.add(res)
                            self.mo_dict[F'{res}_lock'] = site.get_lock_dict_form_mo(res, 2)
                            self.mo_dict[F'{res}_delete'] = site.get_delete_dict_form_mo(res, 2)
                    if ',EUtranCellRelation=' in res:
                        self.mo_dict[F'{res}_delete'] = site.get_lock_dict_form_mo(res, 3)
                rfb_set = rfb_set.union(set([site.get_mo_w_end_str(_) for _ in site.site_extract_data(sc).get('rfBranchTxRef')] +
                                            [site.get_mo_w_end_str(_) for _ in site.site_extract_data(sc).get('rfBranchRxRef')]))
                if site.site_extract_data(sc).get('sectorFunctionRef') not in [None, 'None', 'null', '', {}, []]:
                    sef_set.add(site.get_mo_w_end_str(site.site_extract_data(sc).get('sectorFunctionRef')))
                # SectorCarrier delete
                self.mo_dict[F'{sc}_delete'] = site.get_delete_dict_form_mo(sc, 2)
        # SectorEquipmentFunction delete
        for sef in sef_set:
            rfb_set = rfb_set.union(set([site.get_mo_w_end_str(_) for _ in site.site_extract_data(sef).get('rfBranchRef')]))
            self.mo_dict[F'{sef}_lock'] = site.get_lock_dict_form_mo(sef, 2)
            self.mo_dict[F'{sef}_delete'] = site.get_delete_dict_form_mo(sef, 2)
        # RfBranch delete
        aup_set, rfp_set, anu_set = set(), set(), set()
        for mo in rfb_set:
            if ',Transceiver=' in mo: rfp_set.add(mo); continue
            rfb_data = site.site_extract_data(mo)
            if rfb_data['rfPortRef'] not in [None, 'None', 'null', '', {}, []]: rfp_set.add(site.get_mo_w_end_str(rfb_data['rfPortRef']))
            if rfb_data['tmaRef'] not in [None, 'None', 'null', '', {}, []]:
                anu_set.add(','.join(site.get_mo_w_end_str(rfb_data['tmaRef']).split(',')[:-1]))
            aup_set = aup_set.union(set([site.get_mo_w_end_str(_) for _ in rfb_data['auPortRef']]))
            self.mo_dict[F'{mo}_delete'] = site.get_delete_dict_form_mo(mo, 3)
        # TmaSubUnit
        for mo in anu_set:
            self.mo_dict[F'{mo}_lock'] = site.get_lock_dict_form_mo(mo, 3)
            self.mo_dict[F'{mo}_delete'] = site.get_delete_dict_form_mo(mo, 3)

        ret_asu_set = set()
        ril_set = set()
        for mo in set([','.join(_.split(',')[:-1]) for _ in rfp_set]):
            # lock FieldReplaceableUnit
            self.mo_dict[F'{mo}_lock'] = site.get_lock_dict_form_mo(mo, 2)
            # RiPort
            for mo_1 in site.find_mo_ending_with_parent_str('RiPort', mo):
                for res in [site.get_mo_w_end_str(_) for _ in site.site_extract_data(mo_1).get('reservedBy') if ',RiLink=' in _]:
                    if res not in ril_set:
                        ril_set.add(res)
                        self.mo_dict[F'{res}_delete'] = site.get_delete_dict_form_mo(res, 2)
                self.mo_dict[F'{mo_1}_lock'] = site.get_lock_dict_form_mo(mo_1, 3)
                self.mo_dict[F'{mo_1}_delete'] = site.get_delete_dict_form_mo(mo_1, 3)
            # RfPort
            for mo_1 in site.find_mo_ending_with_parent_str('RfPort', mo):
                for res in [site.get_mo_w_end_str(_) for _ in site.site_extract_data(mo_1).get('reservedBy') if ',AntennaNearUnit=' in _]:
                    if res not in anu_set:
                        for mo_2 in site.find_mo_ending_with_parent_str('RetSubUnit', res):
                            for res2 in [site.get_mo_w_end_str(_) for _ in site.site_extract_data(mo_2).get('reservedBy') if ',AntennaSubunit=' in _]:
                                ret_asu_set.add(res2)
                                self.mo_dict[F'{res2}_retSubunitRef'] = site.get_delete_dict_form_mo(res2, 4)
                                self.mo_dict[F'{res2}_retSubunitRef']['Equipment']['AntennaUnitGroup']['AntennaUnit']['AntennaSubunit'] |= {
                                    'attributes': {'xc:operation': 'update'}, 'retSubunitRef': {'attributes': {'xc:operation': 'delete'}}}
                        anu_set.add(res)
                        self.mo_dict[F'{res}_lock'] = site.get_lock_dict_form_mo(res, 3)
                        self.mo_dict[F'{res}_delete'] = site.get_delete_dict_form_mo(res, 3)
                self.mo_dict[F'{mo_1}_lock'] = site.get_lock_dict_form_mo(mo_1, 3)
                self.mo_dict[F'{mo_1}_delete'] = site.get_delete_dict_form_mo(mo_1, 3)
            # AlarmPort
            for mo_1 in site.find_mo_ending_with_parent_str('AlarmPort', mo):
                self.mo_dict[F'{mo_1}_lock'] = site.get_lock_dict_form_mo(mo_1, 3)
                self.mo_dict[F'{mo_1}_delete'] = site.get_delete_dict_form_mo(mo_1, 3)
            # Transceiver
            for mo_1 in site.find_mo_ending_with_parent_str('Transceiver', mo):
                self.mo_dict[F'{mo_1}_lock'] = site.get_lock_dict_form_mo(mo_1, 3)
                self.mo_dict[F'{mo_1}_delete'] = site.get_delete_dict_form_mo(mo_1, 3)
            # FieldReplaceableUnit
            self.mo_dict[F'{mo}_delete'] = site.get_lock_dict_form_mo(mo, 2)
            self.mo_dict[F'{mo}_delete'] = site.get_delete_dict_form_mo(mo, 2)

        asu_set, au_set = set(), set()
        # AuPort
        for mo in aup_set: self.mo_dict[F'{mo}_delete'] = site.get_delete_dict_form_mo(mo, 5)
        # AntennaSubunit
        for mo in set([site.get_mo_w_end_str(','.join(_.split(',')[:-1])) for _ in aup_set]) | ret_asu_set:
            res = site.site_extract_data(mo).get('retSubunitRef')
            if res not in [None, 'None', 'null', '', {}, []]: res = site.get_mo_w_end_str(','.join(res.split(',')[:-1]))
            if set(site.find_mo_ending_with_parent_str('AuPort', mo)).issubset(aup_set) and \
                    (res in [None, 'None', 'null', '', {}, []] or res in anu_set):
                asu_set.add(mo)
                self.mo_dict[F'{mo}_delete'] = site.get_delete_dict_form_mo(mo, 4)
        # AntennaUnit
        for mo in set([site.get_mo_w_end_str(','.join(_.split(',')[:-2])) for _ in aup_set]):
            if set(site.find_mo_ending_with_parent_str('AntennaSubunit', mo)).issubset(asu_set):
                au_set.add(mo)
                self.mo_dict[F'{mo}_delete'] = site.get_delete_dict_form_mo(mo, 3)
        # AntennaUnitGroup
        for mo in set([site.get_mo_w_end_str(','.join(_.split(',')[:-3])) for _ in aup_set]):
            if set(site.find_mo_ending_with_parent_str('AntennaUnit', mo)).issubset(au_set):
                self.mo_dict[F'{mo}_delete'] = site.get_delete_dict_form_mo(mo, 2)
