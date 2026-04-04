import copy
from .att_xml_base import att_xml_base


class nr_73_gnb_mo(att_xml_base):
    def create_rpc_msg(self):
        return
        if self.no_eq_change_with_dcgk_flag and self.gnbdata.get('GNBDU'): return
        # Start of GNBCUCPFunction
        self.motype = 'GNBCUCP'
        parent_str = self.gnbdata.get("GNBCUCP")
        self.mo_dict['GNBCUCP_mos'] = {'managedElementId': self.node, 'GNBCUCPFunction': {
            'gNBCUCPFunctionId': '1',
            'NRNetwork': {'attributes': {'xc:operation': 'create'}, 'nRNetworkId': self.gnbdata['NRNetwork']},
            'EUtraNetwork': {'attributes': {'xc:operation': 'create'}, 'eUtraNetworkId': self.gnbdata['EUtraNetwork']},
        }}
        self.mo_dict['GNBCUCP_mos']['GNBCUCPFunction'] |= \
            self.get_nr_mos_dict_with_site_parets({'AnrFunction': {'AnrFunctionNR': {}}}, self.node, parent_str)

        # # Start of GNBCUUPFunction
        # self.motype = 'GNBCUUP'
        # parent_str = self.gnbdata.get("GNBCUUP") if self.gnbdata.get("GNBCUUP") else ''
        # tmp_dict = {'CUUP5qiTable': {'CUUP5qi': {}}}
        # self.mo_dict['GNBCUUP_mos'] = {'managedElementId': self.node, 'GNBCUUPFunction': {'gNBCUUPFunctionId': '1'}}
        # self.mo_dict['GNBCUUP_mos']['GNBCUUPFunction'] |= self.get_nr_mos_dict_with_site_parets(tmp_dict, self.node, parent_str)

        # Start of GNBDUFunction
        self.motype = 'GNBDU'
        self.mo_dict['GNBDU_mos'] = {'managedElementId': self.node, 'GNBDUFunction': {'gNBDUFunctionId': '1', 'UeCC': {'ueCCId': '1'}}}
        self.mo_dict['GNBDU_mos']['GNBDUFunction']['UeCC'] |= \
            self.get_nr_mos_dict_with_site_parets({'SchedulingProfile': {}}, F'{self.gnbdata.get("GNBDU")},UeCC=1')
        self.mo_dict['GNBDU_mos']['GNBDUFunction']['UeCC']['RadioLinkControl'] = {'radioLinkControlId': '1'}
        self.mo_dict['GNBDU_mos']['GNBDUFunction']['UeCC']['RadioLinkControl']|= \
            self.get_nr_mos_dict_with_site_parets({'DrbRlc': {}}, F'{self.gnbdata.get("GNBDU")},UeCC=1,RadioLinkControl=1')

    def get_nr_mos_dict_with_site_parets(self, c_dict=None, p_mo=None, node=None):
        """ :rtype: dict """
        if node is None: node = self.node
        mo_ids = []
        create_mo_ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '199', 'Default', 'Base', '5qi6', '5qi7', '5qi8', '5qi9', '5qi199']
        create_mo = ['AnrFunction', 'AnrFunctionNR', 'UeCC']
        moc_dict = {}
        for moc in c_dict.keys():
            ret_list = []
            mos = self.MoName.objects.filter(moc=moc, software=self.usid.client.software, motype=self.motype)
            if mos.exists():
                for mo in mos:
                    if mo.moid in mo_ids + create_mo_ids:
                        ret_dict = self.get_db_mo_related_parameter(mo)
                        site = self.usid.sites.get(F'site_{node}') if ((node is not None) and (p_mo is not None)) else None
                        site_mo = site.find_mo_ending_with_parent_str_with_id(parent=p_mo, moc=moc, moid=mo.moid) if site else []
                        site_mo = site_mo[0] if len(site_mo) > 0 else None
                        if site_mo: ret_dict |= {_: site.site_extract_data(site_mo).get(_, ret_dict.get(_)) for _ in ret_dict.keys()}
                        if site_mo and (not self.eq_flag): ret_dict = {self.get_moc_id(moc): mo.moid}
                        if mo.moid in create_mo_ids or moc in create_mo: ret_dict['attributes'] = {'xc:operation': 'create'}
                        else: ret_dict['attributes'] = {'xc:operation': 'update'}
                        for _ in c_dict[moc].keys():
                            child_dict = self.get_nr_mos_dict_with_site_parets(c_dict[moc], node, site_mo)
                            if len(child_dict) > 0: ret_dict |= child_dict
                        if len(ret_dict) > 0: ret_list.append(ret_dict.copy())
            if len(ret_list) > 0: moc_dict[moc] = ret_list
        return moc_dict
