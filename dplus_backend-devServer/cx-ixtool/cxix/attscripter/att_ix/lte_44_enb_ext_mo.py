import copy
from .att_xml_base import att_xml_base


class lte_44_enb_ext_mo(att_xml_base):
    def create_rpc_msg(self):
        self.motype = 'Lrat'
        self.dcgk_exist = None if self.eq_flag else False
        # --- EUtraNetwork, UnlicensedBandProfile, EUtranFrequency, ExternalENodeBFunction, TermPointToENB,
        # ExternalEUtranCellFDD, ExternalEUtranCellTDD ---
        # --- EUtraNetwork ---
        nw_fdn = F'ENodeBFunction=1,EUtraNetwork={self.enbdata.get("EUtraNetwork")}'
        nw_dict = {'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1', 'EUtraNetwork': {
            'eUtraNetworkId': self.enbdata.get("EUtraNetwork")}}}
        # --- EUtraNetwork ---> UnlicensedBandProfile ---
        if len(self.df_enb_cell.loc[self.df_enb_cell.freqband == '46'].index) > 0:
            mos_ids = [_.split("=")[-1] for _ in
                       self.site.find_mo_ending_with_parent_str('UnlicensedBandProfile', F'.*EUtraNetwork={self.enbdata.get("EUtraNetwork")}')] if \
                self.no_eq_change_with_dcgk_flag else []
            if '1' not in mos_ids:
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('UnlicensedBandProfile', None, None, '1')
                tmp_dict |= {'unlicensedBandProfileList': self.get_unlic_bandprofile_dict(self.usid.client.mname)}
                mos_dict = copy.deepcopy(nw_dict)
                mos_dict['ENodeBFunction']['EUtraNetwork']['UnlicensedBandProfile'] = tmp_dict
                self.mo_dict[F'{nw_fdn},UnlicensedBandProfile='] = copy.deepcopy(mos_dict)

        # --- EUtraNetwork ---> EUtranFrequency, ExternalENodeBFunction, TermPointToENB, ExternalEUtranCellFDD, ExternalEUtranCellTDD ---
        df_ef = self.usid.df_enb_ef.copy().loc[(self.usid.df_enb_ef.postsite == self.node) & (self.usid.df_enb_ef.flag != self.dcgk_exist)]
        df_enx = self.usid.df_enb_ex.copy().loc[(self.usid.df_enb_ex.postsite == self.node) & (self.usid.df_enb_ex.flag != self.dcgk_exist)]
        df_fdd = self.usid.df_enb_ec.copy().loc[(self.usid.df_enb_ec.postsite == self.node) & (self.usid.df_enb_ec.flag != self.dcgk_exist)]
        # --- EUtraNetwork ---> EUtranFrequency ---
        for row in df_ef.itertuples():
            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('EUtranFrequency', row.postsite, row.fdn, row.freqid)
            tmp_dict |= {'arfcnValueEUtranDl': row.earfcndl}
            mos_dict = copy.deepcopy(nw_dict)
            mos_dict['ENodeBFunction']['EUtraNetwork']['EUtranFrequency'] = tmp_dict
            self.mo_dict[F'{nw_fdn},EUtranFrequency={row.freqid}'] = copy.deepcopy(mos_dict)

        # --- EUtraNetwork ---> ExternalENodeBFunction, TermPointToENB, ExternalEUtranCellFDD, ExternalEUtranCellTDD ---
        for xid in set(list(df_enx.xid.unique()) + list(df_fdd.xid.unique())):
            x_ldn = F'{nw_fdn},ExternalENodeBFunction={xid}'
            if len(df_enx.loc[df_enx.xid == xid].index) > 0:
                row_ext_enb = df_enx.loc[df_enx.xid == xid].iloc[0]
                ext_dict = self.get_mo_dict_from_moc_node_fdn_moid('ExternalENodeBFunction', row_ext_enb.postsite, row_ext_enb.fdn, row_ext_enb.xid)
                ext_dict |= {'eNBId': row_ext_enb.enbid, 'eNodeBPlmnId': row_ext_enb.plmn}
                mos_dict = copy.deepcopy(nw_dict)
                mos_dict['ENodeBFunction']['EUtraNetwork']['ExternalENodeBFunction'] = ext_dict
                self.mo_dict[F'{x_ldn}'] = copy.deepcopy(mos_dict)
                if not (row_ext_enb.x2id is None):
                    ext_dict = {'externalENodeBFunctionId': xid}
                    tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('TermPointToENB', row_ext_enb.postsite, row_ext_enb.x2fdn, row_ext_enb.x2id)
                    tmp_dict |= {'termPointToENBId': row_ext_enb.x2id}
                    if row_ext_enb.ipv4 is not None: tmp_dict |= {'ipAddress': row_ext_enb.ipv4}
                    if row_ext_enb.ipv6 is not None: tmp_dict |= {'ipv6Address': row_ext_enb.ipv6}
                    if row_ext_enb.domain is not None: tmp_dict |= {'domainName': row_ext_enb.domain}
                    ext_dict = {'externalENodeBFunctionId': xid, 'TermPointToENB': tmp_dict}
                    mos_dict = copy.deepcopy(nw_dict)
                    mos_dict['ENodeBFunction']['EUtraNetwork']['ExternalENodeBFunction'] = ext_dict
                    self.mo_dict[F'{x_ldn},TermPointToENB={row_ext_enb.x2id}'] = copy.deepcopy(mos_dict)
            for row in (df_fdd.loc[df_fdd.xid == xid]).itertuples():
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid(F'ExternalEUtranCell{row.celltype}', row.postsite, row.fdn, row.xcellid)
                tmp_dict |= {'localCellId': row.cellid, 'tac': row.tac, 'physicalLayerCellIdGroup': F'{int(row.pci) // 3}',
                             'physicalLayerSubCellId': F'{int(row.pci) % 3}', 'eutranFrequencyRef': F'{nw_fdn},EUtranFrequency={row.freqid}'}
                ext_dict = {'externalENodeBFunctionId': xid, F'ExternalEUtranCell{row.celltype}': tmp_dict}
                mos_dict = copy.deepcopy(nw_dict)
                mos_dict['ENodeBFunction']['EUtraNetwork']['ExternalENodeBFunction'] = ext_dict
                self.mo_dict[F'{x_ldn},ExternalEUtranCell{row.celltype}={row.xcellid}'] = copy.deepcopy(mos_dict)

        # --- GUtraNetwork, GUtranSyncSignalFrequency, ExternalGNodeBFunction, TermPointToGNB, ExternalGUtranCell ---
        # ---GUtraNetwork---
        nw_fdn = F'ENodeBFunction=1,GUtraNetwork={self.enbdata.get("GUtraNetwork")}'
        tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('GUtraNetwork', self.node, nw_fdn, self.enbdata.get("GUtraNetwork"))
        self.mo_dict[F'{nw_fdn}'] = {'managedElementId': self.node, 'ENodeBFunction': {
            'eNodeBFunctionId': '1', 'GUtraNetwork': copy.deepcopy(tmp_dict)}}
        nw_dict = {'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1', 'GUtraNetwork': {
            'gUtraNetworkId': self.enbdata.get("GUtraNetwork")}}}
        df_nnf = self.usid.df_enb_nf.copy().loc[(self.usid.df_enb_nf.postsite == self.node) & (self.usid.df_enb_nf.flag != self.dcgk_exist)]
        df_nrx = self.usid.df_enb_nx.copy().loc[(self.usid.df_enb_nx.postsite == self.node) & (self.usid.df_enb_nx.flag != self.dcgk_exist)]
        df_nrc = self.usid.df_enb_nc.copy().loc[(self.usid.df_enb_nc.postsite == self.node) & (self.usid.df_enb_nc.flag != self.dcgk_exist)]
        # --- GUtraNetwork --> GUtranSyncSignalFrequency ---
        for row in df_nnf.itertuples():
            tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('GUtranSyncSignalFrequency', row.postsite, row.fdn, row.freqid)
            tmp_dict |= {'gUtranSyncSignalFrequencyId': row.freqid, 'arfcn': row.arfcn, 'smtcScs': row.smtcscs,
                         'smtcPeriodicity': row.smtcperiodicity, 'smtcOffset': row.smtcoffset, 'smtcDuration': row.smtcduration}
            mos_dict = copy.deepcopy(nw_dict)
            mos_dict['ENodeBFunction']['GUtraNetwork']['GUtranSyncSignalFrequency'] = tmp_dict
            self.mo_dict[F'{nw_fdn},GUtranSyncSignalFrequency={row.freqid}'] = copy.deepcopy(mos_dict)

        # --- GUtraNetwork --> ExternalGNodeBFunction, TermPointToGNB, ExternalGUtranCell
        for xid in set(list(df_nrx.xid.unique()) + list(df_nrc.xid.unique())):
            if len(df_nrx.loc[df_nrx.xid == xid].index) > 0:
                row = df_nrx.loc[df_nrx.xid == xid].iloc[0]
                ext_dict = self.get_mo_dict_from_moc_node_fdn_moid('ExternalGNodeBFunction', row.postsite, row.fdn, xid)
                ext_dict |= {'gNodeBId': row.gnbid, 'gNodeBIdLength': row.gnblen, 'gNodeBPlmnId': row.plmn}
                mos_dict = copy.deepcopy(nw_dict)
                mos_dict['ENodeBFunction']['GUtraNetwork']['ExternalGNodeBFunction'] = ext_dict
                self.mo_dict[F'{nw_fdn},ExternalGNodeBFunction={xid}'] = copy.deepcopy(mos_dict)
                if row.x2id is not None:
                    tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('TermPointToGNB', row.postsite, row.x2fdn, row.x2id)
                    tmp_dict |= {'ipAddress': row.ipv4, 'ipv6Address': row.xt_ipv6, 'domainName': row.xt_domain}
                    ext_dict = {'externalGNodeBFunctionId': xid, 'TermPointToGNB': tmp_dict}
                    mos_dict = copy.deepcopy(nw_dict)
                    mos_dict['ENodeBFunction']['GUtraNetwork']['ExternalGNodeBFunction'] = ext_dict
                    self.mo_dict[F'{nw_fdn},ExternalGNodeBFunction={xid},TermPointToGNB={row.x2id}'] = copy.deepcopy(mos_dict)

            for row in df_nrc.loc[df_nrc.xid == xid].itertuples():
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('ExternalGUtranCell', row.postsite, row.fdn, row.xcellid)
                tmp_dict |= {'localCellId': row.cellid, 'isRemoveAllowed': row.israllowed, 'nRTAC': row.nrtac,
                             'physicalLayerCellIdGroup': row.pci // 3, 'physicalLayerSubCellId': row.pci % 3,
                             'gUtranSyncSignalFrequencyRef': F'{nw_fdn},GUtranSyncSignalFrequency={row.freqid}'}
                ext_dict = {'externalGNodeBFunctionId': xid, 'ExternalGUtranCell': tmp_dict}
                mos_dict = copy.deepcopy(nw_dict)
                mos_dict['ENodeBFunction']['GUtraNetwork']['ExternalGNodeBFunction'] = ext_dict
                self.mo_dict[F'{nw_fdn},ExternalGNodeBFunction={xid},ExternalGUtranCell={row.xcellid}'] = copy.deepcopy(mos_dict)

        # --- UtraNetwork, UtranFrequency, ExternalUtranCellFDD ---
        # --- UtraNetwork ---
        nw_fdn = F'ENodeBFunction=1,UtraNetwork={self.enbdata.get("UtraNetwork")}'
        tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('UtraNetwork', self.node, nw_fdn, self.enbdata.get("UtraNetwork"))
        self.mo_dict[F'{nw_fdn}'] = {'managedElementId': self.node, 'ENodeBFunction': {
            'eNodeBFunctionId': '1', 'UtraNetwork': copy.deepcopy(tmp_dict)}}
        nw_dict = {'managedElementId': self.node, 'ENodeBFunction': {'eNodeBFunctionId': '1', 'UtraNetwork': {
            'utraNetworkId': self.enbdata.get("UtraNetwork")}}}

        df_ufrq = self.usid.df_enb_uf.loc[(self.usid.df_enb_uf.postsite == self.node) & (self.usid.df_enb_uf.flag != self.dcgk_exist)]
        df_ufdd = self.usid.df_enb_uc.loc[(self.usid.df_enb_uc.postsite == self.node) & (self.usid.df_enb_uc.flag != self.dcgk_exist)]
        # --- UtraNetwork ---> UtranFrequency & ExternalUtranCellFDD ---
        for freqid in set(list(df_ufrq.freqid.unique()) + list(df_ufdd.freqid.unique())):
            if len(df_ufrq.loc[df_ufrq.freqid == freqid].index) > 0:
                row_frq = df_ufrq.loc[df_ufrq.freqid == freqid].iloc[0]
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('UtranFrequency', row_frq.postsite, row_frq.fdn, freqid)
                tmp_dict |= {'arfcnValueUtranDl': row_frq.uarfcn}
                mos_dict = copy.deepcopy(nw_dict)
                mos_dict['ENodeBFunction']['UtraNetwork']['UtranFrequency'] = tmp_dict
                self.mo_dict[F'{nw_fdn},UtranFrequency={freqid}'] = copy.deepcopy(mos_dict)
            for row in (df_ufdd.loc[df_ufdd.freqid == freqid]).itertuples():
                tmp_dict = self.get_mo_dict_from_moc_node_fdn_moid('ExternalUtranCellFDD', row.postsite, row.fdn, row.xcellid)
                tmp_dict |= {'cellIdentity': row.cellid, 'plmnIdentity': row.plmn, 'lac': row.lac, 'rac': row.rac, 'physicalCellIdentity': row.pci}
                ext_dict = {'utranFrequencyId': freqid, 'ExternalUtranCellFDD': tmp_dict}
                mos_dict = copy.deepcopy(nw_dict)
                mos_dict['ENodeBFunction']['UtraNetwork']['UtranFrequency'] = ext_dict
                self.mo_dict[F'{nw_fdn},UtranFrequency={freqid},ExternalUtranCellFDD={row.xcellid}'] = copy.deepcopy(mos_dict)
