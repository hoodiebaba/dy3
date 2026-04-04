from attgsaudit.att_gsaudit.GSAuditBase import GSAuditBase


class Audit12NRCell(GSAuditBase):
    def generate_audit_report(self):
        if len([_ for _ in self.usid.sites if len(self.usid.sites.get(_).gnb) > 0 or len(self.usid.sites.get(_).gnb_cucp) > 0]) > 0:
            self.nrcellcu_rel = {'intraFreqMCCellProfileRef', 'mcfbCellProfileRef', 'mcpcNrdcPSCellProfileRef', 'mcpcPCellProfileRef',
                                 'mcpcPSCellProfileRef', 'mdtCellProfileRef', 'nrdcMnCellProfileRef', 'pmUeIntraFreqCellProfileRef',
                                 'trStPSCellProfileRef', 'trStSaCellProfileRef', 'ueMCCellProfileRef'}
            
            self.gs_audit_for_nrcelldu()
            self.admin_missing_gs_audit_for_nrcelldu()
            self.gs_audit_for_nrcellcu()
            self.admin_missing_gs_audit_for_nrcellcu()
    
    def gs_audit_for_nrcelldu(self):
        skip_moc = ['GNBCUCPFunction', 'GNBCUUPFunction', 'ENodeBFunction']
        for site_key in self.usid.sites:
            site = self.usid.sites.get(site_key)
            if len(site.gnb) == 0: continue
            cells = site.get_mos_with_parent_moc(parent=site.gnb, moc='NRCellDU')
            for cell_mo in cells[:]:
                cell = cell_mo.split('=')[-1]
                if cell not in self.usid.param_dict['sites'][site.siteid]['cells'].keys(): continue
                self.air = 1 if self.usid.param_dict['sites'][site.siteid]['cells'][cell]['OnAir'] else 0
                c_mos = [_ for _ in site.sorted_mo if _.startswith(cell_mo) and len([_ for val in skip_moc if F',{val}=' in _]) == 0]
                sec_mo = self.usid.param_dict.get('sites').get(site.siteid).get('cells').get(cell).get('sec_mo')
                if sec_mo not in ['', None, 'None']:
                    c_mos += [_ for _ in site.sorted_mo if _.startswith(sec_mo) and len([_ for val in skip_moc if F',{val}=' in _]) == 0]
                for mo in c_mos:
                    para_dict = site.dcg.get(mo, {})
                    for row_gs in self.df_gs.loc[(self.df_gs.MOC == mo.split(',')[-1].split('=')[0])].itertuples():
                        if F'{mo}.{row_gs.Parameter}' in self.process_list: continue
                        if self.logic.evaluate(row_gs.Logic, cell=cell, site=site.siteid, mo_level='cell'):
                            self.r_list_for_gs_para(site.siteid, mo, para_dict.get(row_gs.Parameter, 'N/F'), row_gs)
    
    def admin_missing_gs_audit_for_nrcelldu(self):
        skip_moc = ['GNBCUCPFunction', 'GNBCUUPFunction', 'ENodeBFunction']
        for site_key in self.usid.sites:
            site = self.usid.sites.get(site_key)
            if len(site.gnb) == 0: continue
            cells = site.get_mos_with_parent_moc(parent=site.gnb, moc='NRCellDU')
            for cell_mo in cells[:]:
                cell = cell_mo.split('=')[-1]
                if cell not in self.usid.param_dict['sites'][site.siteid]['cells'].keys(): continue
                self.air = 1 if self.usid.param_dict['sites'][site.siteid]['cells'][cell]['OnAir'] else 0
                c_mos = [_ for _ in site.sorted_mo if _.startswith(cell_mo) and len([_ for val in skip_moc if F',{val}=' in _]) == 0]
                sec_mo = self.usid.param_dict.get('sites').get(site.siteid).get('cells').get(cell).get('sec_mo')
                if sec_mo not in ['', None, 'None']:
                    c_mos += [_ for _ in site.sorted_mo if _.startswith(sec_mo) and len([_ for val in skip_moc if F',{val}=' in _]) == 0]
                for mo in c_mos:
                    for para in self.df_gs.loc[(self.df_gs.MOC == mo.split(',')[-1].split('=')[0])].Parameter.unique():
                        if F'{mo}.{para}' not in self.process_list:
                            self.r_list_for_missing_gs_para(site.siteid, mo, site.dcg.get(mo, {}).get(para, 'N/F'), para)

    def gs_audit_for_nrcellcu(self):
        skip_moc = ['EUtranCellRelation', 'EUtranFreqRelation', 'NRCellRelation', 'NRFreqRelation', 'GNBDUFunction', 'GNBCUUPFunction',
                    'ENodeBFunction']
        for site_key in self.usid.sites:
            site = self.usid.sites.get(site_key)
            if len(site.gnb_cucp) == 0: continue
            cells = site.get_mos_with_parent_moc(parent=site.gnb_cucp, moc='NRCellCU')
            for cell_mo in cells[:]:
                cell = cell_mo.split('=')[-1]
                if cell not in self.usid.param_dict["sites"][site.siteid]["cells"].keys(): continue
                self.air = 1 if self.usid.param_dict['sites'][site.siteid]['cells'][cell]['OnAir'] else 0
                c_mos = [_ for _ in site.sorted_mo if _.startswith(cell_mo)]
                ref_mos = []
                # NRCellCU ref MOS additions
                for para_ref in self.nrcellcu_rel:
                    ref_mo = site.get_first_mo_from_ref_parameter(site.get_mo_para(cell_mo, para_ref))
                    if ref_mo in [None, 'N/F', '', []]: continue
                    ref_mos += site.get_mos_and_its_child_with_mo(ref_mo)
                c_mos += ref_mos
                c_mos = [_ for _ in c_mos if len([_ for val in skip_moc if F',{val}=' in _]) == 0]
                for mo in c_mos:
                    para_dict = site.dcg.get(mo, {})
                    df_gs = self.df_gs.copy().loc[(self.df_gs.MOC == mo.split(',')[-1].split('=')[0])]
                    df_gs['GSValue'] = df_gs.GSValue.str.replace(r'NR__CELL__NAME$', cell, regex=True)
                    for row_gs in df_gs.itertuples():
                        if F'{mo}.{row_gs.Parameter}' in self.process_list: continue
                        if self.logic.evaluate(row_gs.Logic, cell=cell, site=site.siteid, mo_level='cell'):
                            self.r_list_for_gs_para(site.siteid, mo, para_dict.get(row_gs.Parameter, 'N/F'), row_gs)

    def admin_missing_gs_audit_for_nrcellcu(self):
        skip_moc = ['EUtranCellRelation', 'EUtranFreqRelation', 'NRCellRelation', 'NRFreqRelation', 'GNBDUFunction', 'GNBCUUPFunction',
                    'ENodeBFunction']
        for site_key in self.usid.sites:
            site = self.usid.sites.get(site_key)
            if len(site.gnb_cucp) == 0: continue
            cells = site.get_mos_with_parent_moc(parent=site.gnb_cucp, moc='NRCellCU')
            for cell_mo in cells[:]:
                cell = cell_mo.split('=')[-1]
                if cell not in self.usid.param_dict["sites"][site.siteid]["cells"].keys(): continue
                self.air = 1 if self.usid.param_dict['sites'][site.siteid]['cells'][cell]['OnAir'] else 0
                c_mos = [_ for _ in site.sorted_mo if _.startswith(cell_mo)]
                ref_mos = []
                # NRCellCU ref MOS additions
                for para_ref in self.nrcellcu_rel:
                    ref_mo = site.get_first_mo_from_ref_parameter(site.get_mo_para(cell_mo, para_ref))
                    if ref_mo in [None, 'N/F', '', []]: continue
                    ref_mos += site.get_mos_and_its_child_with_mo(ref_mo)
                c_mos += ref_mos
                c_mos = [_ for _ in c_mos if len([_ for val in skip_moc if F',{val}=' in _]) == 0]
                for mo in c_mos:
                    for para in self.df_gs.copy().loc[(self.df_gs.MOC == mo.split(',')[-1].split('=')[0])].Parameter.unique():
                        if F'{mo}.{para}' not in self.process_list:
                            self.r_list_for_missing_gs_para(site.siteid, mo, site.dcg.get(mo, {}).get(para, 'N/F'), para)
