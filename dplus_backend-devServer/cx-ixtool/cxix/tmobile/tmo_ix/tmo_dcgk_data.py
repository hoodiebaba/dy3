import re
import sys


class tmo_dcgk_data:
    def __init__(self, node, merged_dict={}):
        self.node = node
        self.dcg = merged_dict
        if self.dcg is None: sys.exit(1)
        self.sorted_mo = sorted([_ for _ in self.dcg.keys()])
        if len(self.sorted_mo) < 1: sys.exit(1)
        self.initialize()

    def initialize(self):
        self.set_equipment_name()
        self.set_site_xmu_dict()

    def set_enodeb_id(self):
        mo = self.find_mo_ending_with_parent_str('ENodeBFunction', '')[0]
        self.enodeb_id = self.dcg.get(mo).get('eNBId')

    def get_related_mo(self, mo, attribute):
        reference = self.dcg.get(mo).get(attribute)
        mo = None
        if (reference is not None) & (len([_ for _ in self.sorted_mo if reference in _]) > 0):
            mo = [_ for _ in self.sorted_mo if reference in _][0]
        return mo if mo else None
    
    @staticmethod
    def normalize_ip6(ip):
        return ':'.join([_.lstrip('0') for _ in ip.split(':')]) if ip else None

    def set_equipment_name(self):
        equipment_moc = 'FieldReplaceableUnit' if len([_ for _ in self.sorted_mo if ('FieldReplaceableUnit=' in _)]) > 0 else 'Slot'
        self.equipment_type = 'BB' if equipment_moc == 'FieldReplaceableUnit' else 'DUS'
        mos = self.find_mo_ending_with_parent_str(equipment_moc)
        if len(mos) == 0: return None, None
        for mo in mos:
            equipment_name = self.dcg.get(mo).get('productData', {}).get('productName')
            if equipment_name is not None:
                if '6630' in equipment_name:
                    self.equipment_name, self.pre_equipment_id = '6630', mo.split('=')[-1]
                    break
                elif '6648' in equipment_name:
                    self.equipment_name, self.pre_equipment_id = '6648', mo.split('=')[-1]
                    break
                elif '6651' in equipment_name:
                    self.equipment_name, self.pre_equipment_id = '6651', mo.split('=')[-1]
                    break
                elif '5216' in equipment_name:
                    self.equipment_name, self.pre_equipment_id = '5216', mo.split('=')[-1]
                    break
                elif 'DUS' in equipment_name:
                    self.equipment_name, self.pre_equipment_id = 'DUS', mo.split('=')[-1]
                    break
                elif 'DUL' in equipment_name:
                    self.equipment_name, self.pre_equipment_id = 'DUL', mo.split('=')[-1]
                    break
            if self.equipment_type == 'DUS': self.equipment_name = 'DUS'

    def set_oam_ip_vlan_du(self):
        oam_ip, vlan = None, None
        if len([_ for _ in self.sorted_mo if ('IpOam=' in _) and ('Ip=' in _)]) > 0:
            mo = [_ for _ in self.sorted_mo if ('IpOam=' in _) and ('Ip=' in _)][0]
            oam_ip = self.dcg.get(mo).get('nodeIpv6Address')
        oam_ip = self.normalize_ip6(oam_ip)
        if len([_ for _ in self.sorted_mo if ('IpHostLink' in _)]) > 0:
            mo = [_ for _ in self.sorted_mo if ('IpHostLink' in _)][0]
            mo = self.get_related_mo(mo, 'ipInterfaceMoRef')
            if mo: vlan = self.dcg.get(mo).get('vid')
        self.oam_ip = oam_ip
        self.oam_vlan = vlan

    def get_ip_vlan_bu(self, first_str, second_str):
        oam_ip, vlan, accesspoint = None, None, None
        if len([_ for _ in self.sorted_mo if (first_str + '=' in _)]) > 0:
            mo = [_ for _ in self.sorted_mo if (first_str + '=' in _)][0]
        else: return None
        accesspoint = self.dcg.get(mo, {}).get(second_str)
        mo = self.get_related_mo(mo, second_str)
        if mo is None:
            return None, None
        oam_ip = self.dcg.get(mo).get('address', '')
        oam_ip = self.normalize_ip6(oam_ip)
        parent = self.get_parent_elem(mo)
        mo = self.get_related_mo(parent, 'encapsulation')
        if mo is None:
            return oam_ip, None
        vlan = self.dcg.get(mo).get('vlanId', '')
        return oam_ip, vlan, accesspoint

    def set_oam_ip_vlan_bu(self):
        self.oam_ip, self.oam_vlan, self.oam_access_point = self.get_ip_vlan_bu('OamAccessPoint', 'accessPoint')

    def set_bearer_ip_vlan_bu(self):
        self.bearer_ip, self.bearer_vlan, self.oam_access_point = self.get_ip_vlan_bu('ENodeBFunction', 'upIpAddressRef')

    def set_bearer_ip_vlan_du(self):
        bearer_ip, vlan = None, None
        mo = [_ for _ in self.sorted_mo if ('ENodeBFunction=' in _)]
        if len(mo) > 0:
            mo = self.get_related_mo(mo[0], 'upIpAddressRef')
            if mo:
                bearer_ip = self.dcg.get(mo).get('ipAddress')
                mo = self.get_related_mo(mo, 'ipInterfaceMoRef')
                if mo: vlan = self.dcg.get(mo).get('vid')
        self.bearer_ip = self.normalize_ip6(bearer_ip)
        self.bearer_vlan = vlan

    def set_default_router_du(self):
        router_ip = None
        if len([_ for _ in self.sorted_mo if ('IpRoutingTable=' in _ )]) > 0:
            mo = [_ for _ in self.sorted_mo if ('IpRoutingTable=' in _ )][0]
            static_routes = self.dcg.get(mo).get('staticRoutes', [])
            for route in static_routes:
                route_ip = self.normalize_ip6(route.get('nextHopIpAddr'))
                if ':'.join(self.bearer_ip.split(':')[:-1]) in route_ip: router_ip = route_ip
        self.oam_default_router = router_ip

    def set_default_router_bu(self):
        router_add = None
        if len([_ for _ in self.sorted_mo if ('OamAccessPoint=' in _)]) > 0:
            mo = [_ for _ in self.sorted_mo if ('OamAccessPoint=' in _)][0]
        else: return None
        accesspoint = self.dcg.get(mo).get('accessPoint', '')
        router_info_list = [_ for _ in accesspoint.split(',') if 'Router' in _]
        if len(router_info_list) != 1:
            return None
        router_info = router_info_list[0]
        if len([_ for _ in self.sorted_mo if ('NextHop=' in _) & (router_info in _)]) > 0:
            mo = [_ for _ in self.sorted_mo if ('NextHop=' in _) & (router_info in _)][0]
            router_add = self.dcg.get(mo).get('address')
        self.oam_default_router = router_add

    def set_ntp_server_address(self):
        ntp_address = []
        for ntp_mo in [_ for _ in self.sorted_mo if ('NtpServer' in _)]: ntp_address.append(self.dcg.get(ntp_mo).get('serverAddress'))
        self.ntp_server = list(set([self.normalize_ip6(_) for _ in ntp_address if _]))

    @staticmethod
    def get_parent_elem(mo): return ','.join(mo.split(',')[:-1])
    
    def set_bearer_default_router(self): self.bearer_default_router = ''

    def find_mo_ending_with_parent_str(self, moc, parent=''):
        if parent == '': return [_ for _ in self.sorted_mo if re.match(F'.*,{moc}=[^,=]*$', _)]
        else: return [_ for _ in self.sorted_mo if re.match(F'{parent},{moc}=[^,=]*$', _)]

    def find_mo_ending_with_parent_str_with_id(self, moc, moid='', parent=''):
        if parent == '': return self.find_mo_ending_with_id(moc, moid)
        else: return [_ for _ in self.find_mo_ending_with_parent_str(moc, parent) if _.endswith('=' + str(moid))]

    # def convert_dict_to_str(self, in_dict):
    #     if (type(in_dict) == str): return in_dict
    #     elif (type(in_dict) == int): return str(in_dict)
    #     elif (type(in_dict) == dict): return '##'.join([str(key) + '=' + str(val) for key, val in in_dict.items()])

    def site_extract_data(self, mo):
        data = self.dcg.get(mo)
        if data is None: data = self.dcg.get(self.get_mo_name_ending_str(mo))
        return {self.lower_first_character(key): data[key] for key in data}

    def set_site_xmu_dict(self):
        self.site_xmu_dict = {}
        self.site_xmu_dict[self.node] = []
        for mo in self.find_mo_ending_with_parent_str(self.get_fru_string()):
            data = self.site_extract_data(mo)
            product_name = data.get('productData').get('productName')
            if product_name is not None:
                if 'R503' in product_name: self.site_xmu_dict[self.node].append(data.get(self.get_bbuid_string()))

    def get_sau_id(self):
        search_tag = 'HwUnit' if self.equipment_type != 'BB' else 'FieldReplaceableUnit'
        mo = self.find_mo_ending_with_parent_str(search_tag)
        mo = [_ for _ in mo if 'SAU' in _]
        return self.site_extract_data(mo[0]).get(self.lower_first_character(search_tag) + 'Id', 'SAU-1') if len(mo)> 0 else 'SAU-1'

    def get_parent_mo(self, mo): return ','.join(mo.split(',')[:-1])
    def lower_first_character(self, in_str): return in_str[0].lower() + in_str[1:]
    def get_fru_string(self): return 'AuxPlugInUnit' if self.equipment_type != 'BB' else 'FieldReplaceableUnit'
    def get_bbuid_string(self): return 'AuxPlugInUnitId' if self.equipment_type != 'BB' else 'fieldReplaceableUnitId'
    def get_mo_attr_str(self, mo): return {self.lower_first_character(key): self.dcg.get(mo).get(key) for key in self.dcg.get(mo)}
    def find_mo_ending_with_id(self, mo, moid): return [_ for _ in self.sorted_mo if re.match(F'.*,{mo}={moid}$', _)]
    def get_mo_name_ending_str(self, search): return [_ for _ in self.sorted_mo if _.endswith(search)][0]
