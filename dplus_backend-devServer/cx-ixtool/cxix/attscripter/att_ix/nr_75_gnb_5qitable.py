import copy
import json
from .att_xml_base import att_xml_base


class nr_75_gnb_5qitable(att_xml_base):
    def create_rpc_msg(self):
        if self.no_eq_change_with_dcgk_flag and self.gnbdata.get('GNBDU'): return
        self.mo_dict['5qi'] = {
            'managedElementId': self.node,
            'GNBCUCPFunction': {'gNBCUCPFunctionId': '1'},
            'GNBCUUPFunction': {'gNBCUUPFunctionId': '1'},
            'GNBDUFunction': {'gNBDUFunctionId': '1'},
        }
        tmp_dict = {
            'GNBCUCP': {'CUCP5qiTable': {'CUCP5qi': {}}},
            'GNBCUUP': {'CUUP5qiTable': {'CUUP5qi': {}}},
            'GNBDU': {'DU5qiTable': {'DU5qi': {}}},
        }
        for gnb in ['GNBCUCP', 'GNBCUUP', 'GNBDU']:
            self.motype = gnb
            self.mo_dict['5qi'][F'{gnb}Function'] |= self.get_nr_mos_dict_with_site_parets(tmp_dict.get(gnb), self.gnbdata.get(gnb))

    def get_nr_mos_dict_with_site_parets(self, c_dict=None, p_mo=None, node=None):
        """ :rtype: dict """
        if node is None: node = self.node
        mo_ids = []
        create_mo_ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '199', 'Default', 'Base', '5qi6', '5qi7', '5qi8', '5qi9', '5qi199']
        create_mo = ['CUCP5qiTable', 'CUCP5qi', 'CUUP5qiTable', 'CUUP5qi', 'DU5qiTable', 'DU5qi']
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
