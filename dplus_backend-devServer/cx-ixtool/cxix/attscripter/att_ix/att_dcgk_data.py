import copy
import re
import sys


class att_dcgk_data:
    def __init__(self, node, merged_dict={}):
        self.node = node
        self.dcg = merged_dict
        if self.dcg is None: sys.exit(1)
        self.sorted_mo = sorted([_ for _ in self.dcg.keys()])
        if len(self.sorted_mo) < 1: sys.exit(1)
        self.equipment_name, self.pre_equipment_id = 'BB', '1'
        self.site_xmu = []
        self.set_equipment_name()
        self.set_site_xmu_dict()
        # for mo in [_ for _ in self.sorted_mo if re.match(F'.*,UpgradePackage=[^,=]*$', _)]:
        #     print(mo)
        #     print(mo + '--->' + self.get_mo_para_dict_w_mo(mo).get('state'))
            
    def get_related_ref_mo(self, mo, para):
        ref = self.dcg.get(mo).get(para)
        return None if ref is None else [_ for _ in self.sorted_mo if _.endswith(ref)][0]
    def get_para_w_mo(self, mo, para): return self.dcg.get(mo, {}).get(para)
    def get_mo_para_dict_w_mo(self, mo): return {self.lower_first_character(key): self.dcg.get(mo).get(key) for key in self.dcg.get(mo)}
    def get_fru_string(self): return 'AuxPlugInUnit' if self.equipment_type != 'BB' else 'FieldReplaceableUnit'
    def get_bbuid_string(self): return 'AuxPlugInUnitId' if self.equipment_type != 'BB' else 'fieldReplaceableUnitId'
    def find_mo_ending_with_id(self, mo, mo_id): return [_ for _ in self.sorted_mo if re.match(F'.*,{mo}={mo_id}$', _)]
    def get_mos_w_end_str(self, search): return [_ for _ in self.sorted_mo if re.match(rf'.*{search}$', _)]
    def get_mo_w_end_str(self, search): return self.get_mos_w_end_str(search)[0]
    def find_mos_with_moc(self, moc): return [_ for _ in self.sorted_mo if re.match(F'.*,{moc}=[^,=]*$', _)]
    def lower_first_character(self, in_str): return in_str[0].lower() + in_str[1:]
    def get_parent_elem(self, mo): return ','.join(mo.split(',')[:-1])
    def get_get_mo_id(self, mo, split_group=1): return mo.split(',')[-split_group].split('=')[-1]
    def get_parent_mo(self, mo): return ','.join(mo.split(',')[:-1])
    def get_mOCId(self, moc): return moc[0].lower() + moc[1:] + 'Id'
    def get_moc_moid_from_mo(self, mo, s_g=1): return mo.split(',')[-s_g].split('=')[0], mo.split(',')[-s_g].split('=')[-1]
    def find_child_mos_of_managedelement(self, moc): return [_ for _ in self.sorted_mo if re.match(F'.*,ManagedElement=[^,=]*,{moc}=[^,=]*$', _)]

    def get_delete_dict_form_mo(self, mo, noofmoc=1):
        """ :rtype: dict """
        tmp_dict, moc_name = {}, ''
        for i, mo_id in enumerate(reversed(mo.split(',')[-noofmoc:])):
            moc_n_id_list = mo_id.split('=')
            if i == 0: tmp_dict = {self.get_mOCId(moc_n_id_list[0]): moc_n_id_list[-1], 'attributes': {'xc:operation': 'delete'}}
            elif i == len(mo.split(',')[-noofmoc:]) - 1:
                tmp_dict = {'managedElementId': self.node,
                            moc_n_id_list[0]: {self.get_mOCId(moc_n_id_list[0]): moc_n_id_list[-1], moc_name: copy.deepcopy(tmp_dict)}}
            else: tmp_dict = {self.get_mOCId(moc_n_id_list[0]): moc_n_id_list[-1], moc_name: copy.deepcopy(tmp_dict)}
            moc_name = moc_n_id_list[0]
        return tmp_dict

    def get_lock_dict_form_mo(self, mo, noofmoc=1):
        """ :rtype: dict """
        tmp_dict, moc_name = {}, ''
        for i, mo_id in enumerate(reversed(mo.split(',')[-noofmoc:])):
            moc_n_id_list = mo_id.split('=')
            # {'attributes': {'xc:operation': 'update'}, 'administrativeState': '0 (LOCKED)'}
            if i == 0: tmp_dict = {self.get_mOCId(moc_n_id_list[0]): moc_n_id_list[-1], 'attributes': {'xc:operation': 'update'},
                                   'administrativeState': '0 (LOCKED)'}
            elif i == len(mo.split(',')[-noofmoc:]) - 1:
                tmp_dict = {'managedElementId': self.node,
                            moc_n_id_list[0]: {self.get_mOCId(moc_n_id_list[0]): moc_n_id_list[-1], moc_name: copy.deepcopy(tmp_dict)}}
                # tmp_dict[moc_n_id_list[0]] = {self.get_mOCId(moc_n_id_list[0]): moc_n_id_list[-1], moc_name: copy.deepcopy(tmp_dict)}
            else: tmp_dict = {self.get_mOCId(moc_n_id_list[0]): moc_n_id_list[-1], moc_name: copy.deepcopy(tmp_dict)}
            moc_name = moc_n_id_list[0]
        return tmp_dict

    @staticmethod
    def get_first_element(mo):
        if mo in [None, 'None', '', [], {}]: return ''
        elif type(mo) == str: return mo
        elif (type(mo) == list) and (len(mo) > 0): return mo[0]
        
    def find_mo_ending_with_parent_str(self, moc='', parent=''):
        return [_ for _ in self.sorted_mo if re.match(F'{parent},{moc}=[^,=]*$', _)] if 'ManagedElement' in parent else \
            [_ for _ in self.sorted_mo if re.match(F'.*{parent},{moc}=[^,=]*$', _)]

    def find_mo_ending_with_parent_str_with_id(self, parent, moc, moid):
        return self.find_mo_ending_with_id(moc, moid) if parent == '' else \
            [_ for _ in self.find_mo_ending_with_parent_str(moc=moc, parent=parent) if _.endswith('=' + str(moid))]

    # @staticmethod
    # def convert_dict_to_str(self, in_dict):
    #     if type(in_dict) == str: return in_dict
    #     elif type(in_dict) == int: return str(in_dict)
    #     elif type(in_dict) == dict: return '##'.join([str(key) + '=' + str(val) for key, val in in_dict.items()])

    def site_extract_data(self, mo):
        data = self.dcg.get(mo)
        if data is None: data = self.dcg.get(self.get_mo_w_end_str(mo))
        return {self.lower_first_character(key): data[key] for key in data}

    def set_equipment_name(self):
        self.equipment_name, self.pre_equipment_id = None, None
        equipment_moc = 'FieldReplaceableUnit' if len([_ for _ in self.sorted_mo if ('FieldReplaceableUnit=' in _)]) > 0 else 'Slot'
        self.equipment_type = 'BB' if equipment_moc == 'FieldReplaceableUnit' else 'DUS'
        mos = self.find_mo_ending_with_parent_str(moc=equipment_moc)
        if len(mos) == 0: return None, None
        for mo in mos:
            equipment_name = self.dcg.get(mo).get('productData', {}).get('productName')
            if equipment_name is not None:
                if '6630' in equipment_name: self.equipment_name, self.pre_equipment_id = '6630', mo.split('=')[-1]
                elif '6648' in equipment_name: self.equipment_name, self.pre_equipment_id = '6648', mo.split('=')[-1]
                elif '6651' in equipment_name: self.equipment_name, self.pre_equipment_id = '6651', mo.split('=')[-1]
                elif '5216' in equipment_name:  self.equipment_name, self.pre_equipment_id = '5216', mo.split('=')[-1]
                elif 'DUS' in equipment_name: self.equipment_name, self.pre_equipment_id = 'DUS', mo.split('=')[-1]
                elif 'DUL' in equipment_name: self.equipment_name, self.pre_equipment_id = 'DUL', mo.split('=')[-1]
                if self.equipment_name is not None: break
            if self.equipment_type == 'DUS': self.equipment_name = 'DUS'

    def set_site_xmu_dict(self):
        for mo in self.find_mo_ending_with_parent_str(moc=self.get_fru_string()):
            data = self.site_extract_data(mo)
            product_name = data.get('productData', {}).get('productName')
            mo_id = mo.split('=')[-1]
            if (product_name is not None and 'R503' in product_name) or (product_name is None and 'XMU' in mo_id.upper()):
                self.site_xmu.append(mo_id)
        self.site_xmu = sorted(self.site_xmu, key=str.upper)

    def get_sau_id(self):
        search_tag = 'HwUnit' if self.equipment_type != 'BB' else 'FieldReplaceableUnit'
        mo = self.find_mo_ending_with_parent_str(moc=search_tag)
        mo = [_ for _ in mo if 'SAU' in _.split('=')[-1]]
        return self.site_extract_data(mo[0]).get(search_tag[0].lower() + search_tag[1:] + 'Id', search_tag + 'Id') if len(mo) > 0 else 'SAU-1'

    def get_ptp_ip_informations(self):
        ipv4_ips_list = []
        for mo in self.find_mo_ending_with_parent_str(moc='AddressIPv4'):
            ipv4_ips_list.append(self.site_extract_data(mo).get('address', 'not_Found'))
        return ipv4_ips_list

    def get_transport_mos_id(self):
        moids = {}
        for mo in self.find_mo_ending_with_parent_str(moc='LocalSctpEndpoint'):
            data = self.site_extract_data(mo)
            if 'GNBCUCPFunction' in mo and 'X2' in data.get('interfaceUsed', ''):
                sctp = self.get_first_element(data.get('sctpEndpointRef', ''))
                if len(sctp):
                    moids.update({'sctpendpoint': self.get_get_mo_id(mo=sctp)})
                    temp_str = self.get_first_element(self.site_extract_data(self.get_mo_w_end_str(search=sctp)).get('sctpProfile', ''))
                    if len(temp_str):
                        moids.update({'sctpprofile': self.get_get_mo_id(mo=temp_str)})

        for mo in self.find_mo_ending_with_parent_str(moc='LocalIpEndpoint'):
            data = self.site_extract_data(mo)
            if ('GNBCUUPFunction' in mo) and (all(i in data.get('interfaceList', []) for i in ['NG', 'S1', 'X2', 'XN'])):
                address = self.get_first_element(data.get('addressRef', ''))
                if len(address):
                    moids.update({'lte': self.get_get_mo_id(address, 3), 'lte_interface': self.get_get_mo_id(address, 2),
                                  'lte_add': self.get_get_mo_id(address, 1)})
                    vlan_mo = self.get_first_element(self.site_extract_data(
                        self.get_mo_w_end_str(search=','.join(address.split(',')[:-1]))).get('encapsulation', ''))
                    if len(vlan_mo): moids.update({'lte_vlanid': self.get_get_mo_id(vlan_mo, 1)})

                    router = ','.join(address.split(',')[:-2])
                    adm_dist = ['1']
                    for hop in self.find_mo_ending_with_parent_str('NextHop'):
                        if router in hop: adm_dist.append(self.get_first_element(self.site_extract_data(hop).get('adminDistance', '1')))
                    moids.update({'lte_dist': max(adm_dist)})

        for mo in self.find_mo_ending_with_parent_str(moc='ENodeBFunction'):
            data = self.site_extract_data(mo)
            address = self.get_first_element(data.get('upIpAddressRef', ''))
            sctp = self.get_first_element(data.get('sctpRef', ''))
            if len(sctp):
                moids.update({'4g_sctpendpoint': self.get_get_mo_id(mo=sctp)})
                temp_str = self.get_first_element(self.site_extract_data(self.get_mo_w_end_str(search=sctp)).get('sctpProfile', ''))
                if len(temp_str): moids.update({'4g_sctpprofile': self.get_get_mo_id(mo=temp_str)})
            if len(address):
                moids.update({'4g_lte': self.get_get_mo_id(address, 3), '4g_lte_interface': self.get_get_mo_id(address, 2),
                              '4g_lte_add': self.get_get_mo_id(address, 1)})
                vlan_mo = self.get_first_element(self.site_extract_data(
                    self.get_mo_w_end_str(search=','.join(address.split(',')[:-1]))).get('encapsulation', ''))
                if len(vlan_mo): moids.update({'4g_lte_vlanid': self.get_get_mo_id(vlan_mo, 1)})
                router = ','.join(address.split(',')[:-2])
                adm_dist = ['1']
                for hop in self.find_mo_ending_with_parent_str('NextHop'):
                    if router in hop: adm_dist.append(self.get_first_element(self.site_extract_data(hop).get('adminDistance', '1')))
                moids.update({'4g_lte_dist': max(adm_dist)})
        
        for mo in self.find_mo_ending_with_parent_str(moc='OamAccessPoint'):
            address = self.get_first_element(self.site_extract_data(mo).get('accessPoint', ''))
            if len(address):
                moids.update({'oam': self.get_get_mo_id(address, 3), 'oam_interface': self.get_get_mo_id(address, 2),
                              'oam_add': self.get_get_mo_id(address, 1)})
                vlan_mo = self.get_first_element(
                    self.site_extract_data(self.get_mo_w_end_str(search=','.join(address.split(',')[:-1]))).get('encapsulation', ''))
                if len(vlan_mo):
                    moids.update({'oam_vlanid': self.get_get_mo_id(vlan_mo, 1)})
                    ether_mo = self.get_first_element(self.site_extract_data(self.get_mo_w_end_str(search=vlan_mo)).get('encapsulation', ''))
                    if len(ether_mo): moids.update({'TnPort': self.get_get_mo_id(ether_mo, 1)})
        return moids
