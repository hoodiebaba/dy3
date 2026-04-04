import copy
from .att_xml_base import att_xml_base


class co_10_feature(att_xml_base):
    def create_rpc_msg(self):
        self.exclude_keys = []
        self.exclude_keys.extend(['CXC4012396', 'CXC4012392', 'CXC4011968'])  # Not prestent in DUS
        self.exclude_keys.extend(['CXC4011823', 'CXC4040006', 'CXC4011915'])  # Defined in SB
        self.exclude_keys.extend(['CXC4040015', 'CXC4040017'])  # Excluded from Scripts
        feature_dict = {}
        capacity_dict = {}

        feat = self.get_lte_feature()
        feature_dict |= feat[0]
        capacity_dict |= feat[1]
        feat = self.get_nr_feature()
        feature_dict |= feat[0]
        capacity_dict |= feat[1]

        for feat in feature_dict.keys():
            self.mo_dict[F'FeatureState_{feat}'] = {'managedElementId': self.node, 'SystemFunctions': {'systemFunctionsId': '1', 'Lm': {
                'lmId': '1', 'FeatureState': {'attributes': {'xc:operation': 'update'},
                                              'featureStateId': feat, 'featureState': feature_dict.get(feat)}}}}
        for feat in capacity_dict.keys():
            self.mo_dict[F'CapacityState_{feat}'] = {'managedElementId': self.node, 'SystemFunctions': {'systemFunctionsId': '1', 'Lm': {
                'lmId': '1', 'CapacityState': {'attributes': {'xc:operation': 'update'},
                                               'capacityStateId': feat, 'featureState': capacity_dict.get(feat)}}}}

    def get_lte_feature(self):
        fea_dict = {}
        cap_dict = {}
        if self.no_eq_change_with_dcgk_flag and self.enbdata.get('Lrat') is not None: return fea_dict, cap_dict

        if self.site is not None and self.eq_flag and len(self.df_enb_cell.index) > 0:
            featurekey = 'keyId' if self.site.equipment_type != 'BB' else 'featureStateId'
            for mo in (self.site.find_mo_ending_with_parent_str('OptionalFeatureLicense', '') +
                       self.site.find_mo_ending_with_parent_str('FeatureState', '')):
                mo_dict = self.site.dcg.get(mo)
                if mo_dict.get(featurekey) in self.exclude_keys: continue
                elif mo_dict.get('featureState') == '1 (ACTIVATED)': fea_dict[mo_dict.get(featurekey)] = mo_dict.get('featureState')
        elif len(self.df_enb_cell.index) > 0 and self.enbdata.get('Lrat') is None:
            for child in self.MoName.objects.filter(moc='FeatureState', software=self.usid.client.software, motype='Lrat'):
                if child.moid in [None, '', '""', 'XX']: continue
                if child.modetail_set.filter(flag=True).exists():
                    child_mo = self.get_db_mo_related_parameter(child)
                    if 'ACTIVATED' in child_mo.get('featureState', '') and child_mo.get("featureStateId", '') not in self.exclude_keys:
                        fea_dict[child_mo.get("featureStateId")] = child_mo.get('featureState', '')
        # Logical Features
        elif len(self.df_enb_cell.loc[self.df_enb_cell.addcell].index) > 0:
            # MMBB
            if self.enbdata.get('mmbb'): fea_dict['CXC4012554'] = '1 (ACTIVATED)'
            # CA Features Based o no of earfcn
            noofearfcn = self.usid.df_enb_cell.loc[self.usid.df_enb_cell.celltype.isin(['FDD', 'TDD'])]['earfcndl'].nunique(dropna=True)
            if noofearfcn > 1: fea_dict |= {'CXC4011973': '1 (ACTIVATED)', 'CXC4011476': '1 (ACTIVATED)'}
            if noofearfcn > 2: fea_dict['CXC4011714'] = '1 (ACTIVATED)'
            if noofearfcn > 3: fea_dict['CXC4011980'] = '1 (ACTIVATED)'
            if noofearfcn > 4: fea_dict['CXC4011981'] = '1 (ACTIVATED)'
            # No of Cells
            cell_count = len(self.df_enb_cell.loc[self.df_enb_cell.celltype.str.lower().isin(['FDD', 'TDD'])].index)
            if cell_count > 18: fea_dict['CXC4011974'] = '1 (ACTIVATED)'
            if cell_count > 12: fea_dict['CXC4011917'] = '1 (ACTIVATED)'
            if cell_count > 6: fea_dict['CXC4011356'] = '1 (ACTIVATED)'
            if cell_count > 3: fea_dict['CXC4011317'] = '1 (ACTIVATED)'
            if cell_count > 1: fea_dict['CXC4011444'] = '1 (ACTIVATED)'
            # Multi Sector
            if self.df_enb_cell.loc[self.df_enb_cell.celltype.isin(['FDD', 'TDD'])]['sc'].nunique(dropna=True) > \
                    self.df_enb_cell.loc[self.df_enb_cell.celltype.isin(['FDD', 'TDD'])]['sef'].nunique(dropna=True):
                fea_dict['CXC4011802'] = '1 (ACTIVATED)'

            # DLOnly_USID
            if len(self.usid.df_enb_cell.loc[(self.usid.df_enb_cell.noofrx.isin(['0', '1']))].index) > 0:
                fea_dict['CXC4011567'] = '1 (ACTIVATED)'
            # 2RXTX_ONLY
            if len(self.df_enb_cell.loc[(self.df_enb_cell.noofrx == "4") | (self.df_enb_cell.nooftx == "4")].index) == 0:
                fea_dict['CXC4011056'] = '0 (DEACTIVATED)'
            # Cell Sleep and MIMO Sleep
            if (self.node[-1] not in ['F', 'L']) and \
                    (self.usid.df_enb_cell[~self.usid.df_enb_cell.freqband.isin(['14', '17'])]['earfcndl'].nunique(dropna=True) > 2):
                fea_dict |= {'CXC4011803': '1 (ACTIVATED)', 'CXC4011808': '1 (ACTIVATED)'}
            # B14
            if len(self.df_enb_cell.loc[self.df_enb_cell.freqband.isin(['14'])].index) > 0:
                fea_dict |= {'CXC4011736': '1 (ACTIVATED)', 'CXC4012157': '1 (ACTIVATED)', 'CXC4012275': '1 (ACTIVATED)',
                             'CXC4012296': '1 (ACTIVATED)'}
            else: fea_dict |= {'CXC4011736': '0 (DEACTIVATED)', 'CXC4012157': '0 (DEACTIVATED)',
                               'CXC4012275': '0 (DEACTIVATED)', 'CXC4012296': '0 (DEACTIVATED)'}
            # B14_USID
            if len(self.usid.df_enb_cell.loc[(self.usid.df_enb_cell.freqband.str.lower().isin(['14']))].index) > 0:
                fea_dict |= {'CXC4011814': '1 (ACTIVATED)', 'CXC4011557': '1 (ACTIVATED)', 'CXC4012258': '1 (ACTIVATED)'}
            else: fea_dict |= {'CXC4011814': '0 (DEACTIVATED)', 'CXC4011557': '0 (DEACTIVATED)', 'CXC4012258': '0 (DEACTIVATED)'}
            # B30
            if len(self.df_enb_cell.loc[self.df_enb_cell.freqband.isin(['30'])].index) > 0:
                fea_dict |= {'CXC4010955': '1 (ACTIVATED)', 'CXC4011815': '1 (ACTIVATED)'}
            else: fea_dict |= {'CXC4011815': '0 (DEACTIVATED)'}
            # B14 or B30 USID
            if len(self.usid.df_enb_cell.loc[(self.usid.df_enb_cell.freqband.str.lower().isin(['14', '30']))].index) > 0:
                fea_dict['CXC4011063'] = '1 (ACTIVATED)'
            # B2, B4 or B17
            if len(self.df_enb_cell.loc[self.df_enb_cell.freqband.isin(['2', '4', '14'])].index) > 0:
                fea_dict |= {'CXC4012451': '1 (ACTIVATED)', 'CXC4012516': '1 (ACTIVATED)'}
            # B46 - LLA and TDD cells
            if len(self.df_enb_cell.loc[self.df_enb_cell.freqband.isin(['46'])].index) > 0:
                fea_dict |= {'CXC4011973': '1 (ACTIVATED)', 'CXC4011476': '1 (ACTIVATED)', 'CXC4011714': '1 (ACTIVATED)',
                             'CXC4011980': '1 (ACTIVATED)', 'CXC4011981': '1 (ACTIVATED)', 'CXC4011922': '1 (ACTIVATED)',
                             'CXC4012020': '1 (ACTIVATED)', 'CXC4011930': '1 (ACTIVATED)', 'CXC4011802': '1 (ACTIVATED)',
                             'CXC4011820': '0 (DEACTIVATED)', 'CXC4012034': '0 (DEACTIVATED)'}
            # FWLL
            if self.node[-1] == 'L':
                fea_dict |= {
                    'CXC4040004': '0 (DEACTIVATED)', 'CXC4010613': '0 (DEACTIVATED)', 'CXC4010616': '0 (DEACTIVATED)',
                    'CXC4010618': '0 (DEACTIVATED)', 'CXC4010620': '0 (DEACTIVATED)', 'CXC4010770': '0 (DEACTIVATED)',
                    'CXC4010841': '0 (DEACTIVATED)', 'CXC4010912': '0 (DEACTIVATED)', 'CXC4010956': '0 (DEACTIVATED)',
                    'CXC4010962': '0 (DEACTIVATED)', 'CXC4010974': '0 (DEACTIVATED)', 'CXC4011011': '0 (DEACTIVATED)',
                    'CXC4011055': '0 (DEACTIVATED)', 'CXC4011068': '0 (DEACTIVATED)', 'CXC4011075': '0 (DEACTIVATED)',
                    'CXC4011157': '0 (DEACTIVATED)', 'CXC4011247': '0 (DEACTIVATED)', 'CXC4011252': '0 (DEACTIVATED)',
                    'CXC4011319': '0 (DEACTIVATED)', 'CXC4011327': '0 (DEACTIVATED)', 'CXC4011345': '0 (DEACTIVATED)',
                    'CXC4011373': '0 (DEACTIVATED)', 'CXC4011376': '0 (DEACTIVATED)', 'CXC4011479': '0 (DEACTIVATED)',
                    'CXC4011481': '0 (DEACTIVATED)', 'CXC4011554': '0 (DEACTIVATED)', 'CXC4011666': '0 (DEACTIVATED)',
                    'CXC4011911': '0 (DEACTIVATED)', 'CXC4011966': '0 (DEACTIVATED)', 'CXC4012079': '0 (DEACTIVATED)',
                    'CXC4012082': '0 (DEACTIVATED)', 'CXC4012187': '0 (DEACTIVATED)', 'CXC4012241': '0 (DEACTIVATED)',
                    'CXC4012278': '0 (DEACTIVATED)', 'CXC4012287': '0 (DEACTIVATED)', 'CXC4012311': '0 (DEACTIVATED)',
                    'CXC4012336': '0 (DEACTIVATED)', 'CXC4010955': '0 (DEACTIVATED)', 'CXC4011063': '0 (DEACTIVATED)',
                    'CXC4012095': '0 (DEACTIVATED)'
                }
            # catm1SupportEnabled
            catm1 = False
            for row in self.df_enb_cell.loc[self.df_enb_cell.celltype == 'FDD'].itertuples():
                if row.fdn not in [None, 'None', ''] and row.presite not in [None, 'None', '']:
                    catm1 = self.usid.sites.get(F'site_{row.presite}').dcg.get(row.fdn, {}).get('catm1SupportEnabled', False) == 'true'
                    if catm1: break
                elif row.freqband == '17' and row.dlchannelbandwidth in ['10000', '5000']:
                    catm1 = True
                    break
            if catm1:
                fea_dict |= {'CXC4012302': '1 (ACTIVATED)', 'CXC4012320': '1 (ACTIVATED)', 'CXC4012323': '1 (ACTIVATED)',
                             'CXC4012359': '1 (ACTIVATED)', 'CXC4012425': '1 (ACTIVATED)'}
            else:
                fea_dict |= {'CXC4012302': '0 (DEACTIVATED)', 'CXC4012320': '0 (DEACTIVATED)', 'CXC4012323': '0 (DEACTIVATED)',
                             'CXC4012359': '0 (DEACTIVATED)', 'CXC4012425': '0 (DEACTIVATED)'}
            # NbIotCell
            if len(self.df_enb_cell.loc[self.df_enb_cell.celltype == 'IOT'].index) > 0:
                cap_dict['CXC4013000'] = '1 (ACTIVATED)'

        return fea_dict, cap_dict

    def get_nr_feature(self):
        f_dict = {}
        cap_dict = {}
        if len(self.df_gnb_cell.loc[self.df_gnb_cell.addcell].index) == 0: return f_dict, cap_dict

        nr_feature_dict = {
            'ALL': {'CXC4011823': '1 (ACTIVATED)', 'CXC4012273': '1 (ACTIVATED)', 'CXC4012325': '1 (ACTIVATED)', 'CXC4012373': '1 (ACTIVATED)',
                    'CXC4012375': '1 (ACTIVATED)', 'CXC4012424': '1 (ACTIVATED)', 'CXC4012479': '1 (ACTIVATED)', 'CXC4012492': '1 (ACTIVATED)',
                    'CXC4012531': '1 (ACTIVATED)', 'CXC4012548': '1 (ACTIVATED)', 'CXC4012558': '1 (ACTIVATED)', 'CXC4040006': '1 (ACTIVATED)',
                    'CXC4040007': '1 (ACTIVATED)', 'CXC4040009': '1 (ACTIVATED)', 'CXC4012601': '1 (ACTIVATED)', 'CXC4012562': '1 (ACTIVATED)',
                    'CXC4012589': '1 (ACTIVATED)', 'CXC4040010': '1 (ACTIVATED)',
                    },
            'LB': {},
            'MB': {},
            'MB+': {},
            'HB': {'CXC4011838': '1 (ACTIVATED)', 'CXC4012273': '0 (DEACTIVATED)', 'CXC4012315': '1 (ACTIVATED)', 'CXC4012353': '1 (ACTIVATED)',
                   'CXC4012373': '0 (DEACTIVATED)', 'CXC4012376': '1 (ACTIVATED)', 'CXC4012408': '1 (ACTIVATED)', 'CXC4012424': '0 (DEACTIVATED)',
                   'CXC4012482': '1 (ACTIVATED)', 'CXC4012492': '0 (DEACTIVATED)', 'CXC4012500': '1 (ACTIVATED)', 'CXC4012531': '0 (DEACTIVATED)',
                   'CXC4012535': '1 (ACTIVATED)', 'CXC4012586': '1 (ACTIVATED)', 'CXC4012598': '1 (ACTIVATED)',
                   'CXC4012558': '0 (DEACTIVATED)', 'CXC4040007': '0 (DEACTIVATED)', 'CXC4012589': '0 (DEACTIVATED)',
                   },
            'N077': {'CXC4012272': '1 (ACTIVATED)', 'CXC4012330': '1 (ACTIVATED)', 'CXC4012347': '1 (ACTIVATED)', 'CXC4012406': '1 (ACTIVATED)',
                     'CXC4012424': '0 (DEACTIVATED)', 'CXC4012478': '1 (ACTIVATED)', 'CXC4012493': '1 (ACTIVATED)', 'CXC4012500': '1 (ACTIVATED)',
                     'CXC4012510': '1 (ACTIVATED)', 'CXC4012519': '1 (ACTIVATED)', 'CXC4012570': '1 (ACTIVATED)', 'CXC4012590': '1 (ACTIVATED)',
                     'CXC4012477': '1 (ACTIVATED)',
                     'CXC4040007': '0 (DEACTIVATED)', 'CXC4012334': '0 (DEACTIVATED)'}
        }
        f_dict |= nr_feature_dict['ALL']
        if len(self.df_gnb_cell.loc[self.df_gnb_cell.freqband.isin(["N260", "N261", "N258"])].index) > 0 and len(nr_feature_dict['HB']) > 0:
            f_dict |= nr_feature_dict['HB']
        if len(self.df_gnb_cell.loc[self.df_gnb_cell.freqband.isin(["N005", "N012", "N014", "N029"])].index) > 0 and len(nr_feature_dict['LB']) > 0:
            f_dict |= nr_feature_dict['LB']

        if len(self.df_gnb_cell.loc[self.df_gnb_cell.freqband.isin(["N002", "N004", "N066", "N030"])].index) > 0 and len(nr_feature_dict['MB']) > 0:
            f_dict |= nr_feature_dict['MB']
        if len(self.df_gnb_cell.loc[self.df_gnb_cell.freqband.isin(["N046", "N048", "N077"])].index) > 0 and len(nr_feature_dict['MB+']) > 0:
            f_dict |= nr_feature_dict['MB+']

        if len(self.df_gnb_cell.loc[self.df_gnb_cell.freqband.isin(["N077"])].index) > 0 and len(nr_feature_dict['N077']) > 0:
            f_dict |= nr_feature_dict['N077']
        if (self.usid.df_gnb_cell["arfcndl"].nunique(dropna=True) > 1) and \
                (len(self.usid.df_gnb_cell.loc[self.usid.df_gnb_cell.freqband.isin(["N077", "N260", "N261", "N258"])].index) > 0):
            f_dict |= {'CXC4012555': '1 (ACTIVATED)'}
        if len(self.df_gnb_cell.index) > 0 and len(self.df_enb_cell.index) > 0:
            f_dict |= {'CXC4012554': '1 (ACTIVATED)'}
        return f_dict, cap_dict

