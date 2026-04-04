from xml.dom.minidom import Document
import os
import sys
import re
import json
import logging
import numpy as np


class tmo_xml_base:
    def __init__(self, usid, node):
        self.usid = usid
        self.node = str(node)
        self.site = self.usid.sites.get(F'site_{self.node}')
        self.client = self.usid.client

        self.set_client_db()
        self.motype = 'default'
        self.doc = Document()
        self.script_file = ''
        self.script_elements = []
        self.relative_path = [F'REMOTE_{self.node}', F'{self.__class__.__name__}_{self.node}.xml']
        self.enbdata = usid.enodeb[self.node] if self.node in usid.enodeb.keys() else {}
        self.gnbdata = usid.gnodeb[self.node] if self.node in usid.gnodeb.keys() else {}
        self.df_enb_cell = self.usid.df_enb_cell.copy().loc[(self.usid.df_enb_cell.postsite == self.node)]
        self.df_gnb_cell = self.usid.df_gnb_cell.copy().loc[(self.usid.df_gnb_cell.postsite == self.node)]
        self.market_dict = {
            'tri_la': ['Escondido', 'Vegas', 'ElMonte', 'Torrance', 'SimiValley', 'Irvine', 'Riverside'],
            'ncal': ['SanFrancisco', 'SantaClara', 'Stockton', 'WestOakland', 'WestSacramento'],
            'long_island': ['Syosset_LI'],
            'new_york': ['Syosset'],
            'charlotte': ['Charlotte'],
            'hawaii': ['Hawaii'],
            'philadelphia': ['Philadelphia'],
            'washington_dc': ['Beltsville'],
            'excalibur': ['Atlanta', 'Jacksonville', 'Miami', 'Orlando', 'Tampa', 'Excalibur'],
        }
        
    def set_client_db(self):
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "angustel.settings")
        sys.path.append(os.path.dirname(os.path.dirname(__file__)))
        from tmobile.models import MoAttribute, MoDetail, MoName, MoRelation
        self.MoName = MoName
        self.MoDetail = MoDetail
        self.MoRelation = MoRelation
        self.mo_attr = {_.moc: _.attribute for _ in MoAttribute.objects.filter(software=self.client.software)}

    # def create_xml_doc(self): pass
    def create_out_file_path(self): pass
    def initialize_var(self): pass

    def create_elm_with_attr(self, tmp_dict, tag_name, tag_end, attr=None):
        mo = self.create_and_add_mo_para_to_xml_doc(tmp_dict, tag_name, tag_end)
        if attr:
            for key in attr: mo.setAttribute(key, attr[key])
        return mo

    def create_data_path(self):
        self.script_file = os.path.join(self.usid.base_dir, self.node, *self.relative_path)
        out_dir = os.path.dirname(self.script_file)
        if not os.path.exists(out_dir): os.makedirs(out_dir)

    def writexml(self):
        if len(self.script_elements) == 0: pass
        elif type(self.script_elements[0]) is str:
            with open(self.script_file, 'w') as f:
                f.write('\n'.join(self.mos_files_start(script_type=F'{self.__class__.__name__}')))
                f.write('\n'.join(self.script_elements))
                f.write('\n'.join(self.mos_files_end(script_type=F'{self.__class__.__name__}')))
        elif self.script_elements[0].firstChild is not None:
            with open(self.script_file, 'w') as f:
                for index, elem in enumerate(self.script_elements):
                    outstr = elem.toprettyxml(encoding='UTF-8', indent='  ').decode('utf-8')
                    if index > 0: outstr = outstr.replace('<?xml version="1.0" encoding="UTF-8"?>', '')
                    f.write(outstr.strip())
                    f.write('\n]]>]]>\n')

    def special_formate_scripts(self): pass

    def run(self):
        self.initialize_var()
        self.create_data_path()
        self.writexml()
        self.special_formate_scripts()

    def create_and_add_mo_para_to_xml_doc(self, moadddict, moname, moattribute):
        doc = Document()
        cmo = doc.createElement(moname)
        if moattribute != '': cmo.setAttribute('xmlns', 'urn:com:ericsson:ecim:'+moattribute)
        for key, value in moadddict.items():
            for spvalue in value.split("@@"): cmo.appendChild(self.add_str_type_para_to_xml_doc(doc, key, spvalue))
        return cmo

    def create_rec_element(self, doc, key, val):
        elem = doc.createElement(str(key))
        if type(val) == dict: elem.appendChild(self.create_rec_element(doc,))

    def add_str_type_para_to_xml_doc(self, doc, key, value):
        p1 = doc.createElement(str(key))
        if '##' in value:
            for spvalue in value.split("##"):
                key1, value1 = spvalue.split("=", 1)
                p3 = doc.createElement(str(key1))
                value3 = doc.createTextNode(self.check_text_element(str(value1)))
                p3.appendChild(value3)
                p1.appendChild(p3)
        else: p1.appendChild(doc.createTextNode(self.check_text_element(str(value))))
        return p1

    def add_space_seperated_type_para_to_xml_doc(self, doc, p1, key, value):
        for spvalue in value.split(" "):
            p3 = doc.createElement(str(key))
            value3 = doc.createTextNode(self.check_text_element(str(spvalue)))
            p3.appendChild(value3)
            p1.appendChild(p3)
        return p1

    def check_text_element(self, in_str, change_me=True):
        if in_str is not None: in_str = in_str.strip('"')
        if (in_str is None) or (in_str == 'None'): return ''
        elif (',' in in_str) and ('ManagedElement' not in in_str) and (not in_str.startswith('SubNetwork')):
            in_str = F'ManagedElement={self.node},{in_str}'
        elif ('ManagedElement' in in_str) and (F'ManagedElement={self.node}' not in in_str):
            if change_me:
                tmp_ref = {_.split('=')[0]: _.split('=')[-1] for _ in in_str.split(',')[in_str.split(',').index([_ for _ in in_str.split(',') if 'ManagedElement' in _][0]):]}
                if tmp_ref.get('ManagedElement'): tmp_ref['ManagedElement'] = self.node
                in_str = ','.join([key + '=' + tmp_ref[key] for key in tmp_ref])
        elif re.match('.*\s\((.*)\)$', in_str):
            in_str = re.match('.*\s\((.*)\)$', in_str).group(1)
        return in_str

    def mo_add_form_dict_xml(self, adddict, moname='ManagedElement', change_me=True):
        doc = Document()
        cmo = doc.createElement(moname)
        if self.mo_attr.get(moname): cmo.setAttribute('xmlns', F'urn:com:ericsson:ecim:{self.mo_attr.get(moname)}')
        for key in adddict:
            if 'xmlns' == key: cmo.setAttribute('xmlns', str(adddict[key]))
            elif (adddict[key] is None) or (type(adddict[key]) == int) or (type(adddict[key]) == str):
                if adddict[key] is None or self.check_text_element(str(adddict[key]), change_me) in [None, 'None', '']: continue
                elm = doc.createElement(str(key))
                text_node = doc.createTextNode(self.check_text_element(str(adddict[key]), change_me))
                elm.appendChild(text_node)
                cmo.appendChild(elm)
            elif type(adddict[key]) == dict:
                cmo.appendChild(self.mo_add_form_dict_xml(adddict[key], key, change_me))
            elif type(adddict[key]) == list:
                for item in adddict[key]:
                    if type(item) != dict:
                        if (self.check_text_element(str(item), change_me) is None) or (self.check_text_element(str(item), change_me) == ''): continue
                        elm = doc.createElement(str(key))
                        elm.appendChild(doc.createTextNode(self.check_text_element(str(item), change_me)))
                        cmo.appendChild(elm)
                    else: cmo.appendChild(self.mo_add_form_dict_xml(item, key, change_me))
        return cmo
    
    @staticmethod
    def get_end_mo_name(mo): return mo.split(',')[-1].split('=')[0]
    
    @staticmethod
    def lower_first_char(in_str): return in_str[0].lower() + in_str[1:]
    
    @staticmethod
    def get_moc_id(moc): return moc[0].lower() + moc[1:] + 'Id'
    
    @staticmethod
    def get_end_moc(mo): return mo.split(',')[-1].split('=')[0]
    
    def get_mo_related_attributes(self, mo):
        qs = getattr(mo, 'modetail_set').filter(flag=True).order_by('parameter').distinct().values('parameter', 'value')
        ret_dict = {self.get_moc_id(mo.moc): mo.moid}
        ret_dict.update({self.lower_first_char(_.get('parameter')): json.loads(_.get('value')) if _.get('value') else '' for _ in qs})
        return ret_dict
    
    def get_db_attributes(self, moc):
        qs = self.MoDetail.objects.filter(mo__software=self.client.software, mo__moc=moc,
                                          mo__motype=self.motype, flag=True).order_by('parameter').distinct().values('parameter', 'value')
        return {_.get('parameter'): json.loads(_.get('value')) if _.get('value') else '' for _ in qs}
    
    def get_mo_attributes(self, moc, moid=''):
        mos = self.MoName.objects.filter(moc=moc, software=self.client.software, motype=self.motype)
        for mo in mos:
            if mo.moid == moid: break
            # if mo.moid == json.dumps(moid) or mo.moid == moid: break
        ret_dict = self.get_mo_related_attributes(mo) if 'mo' in locals() else {}
        ret_dict.update({self.get_moc_id(moc): moid})
        return ret_dict

    def update_db_attr_with_mo_data(self, moc, site, mo):
        ret_dict = self.get_mo_attributes(moc)
        mo_data = site.site_extract_data(mo) if site else {}
        for key in ret_dict: ret_dict[key] = mo_data.get(key, ret_dict[key])
        return ret_dict

    def update_db_with_mo_for_siteid_and_fdn(self, moc, site, mo):
        ret_dict = self.get_mo_attributes(moc)
        site = None if (site in [None, '']) | (mo in [None, '']) else self.usid.sites.get(F'site_{site}')
        mo_data = site.site_extract_data(mo) if site else {}
        for key in ret_dict: ret_dict[key] = mo_data.get(key, ret_dict[key])
        return ret_dict

    def new_cell_eqiupment_elems(self, parent_mo, tag, mo_ids):
        db_dict = self.get_mo_attributes(tag)
        for moid in mo_ids:
            db_dict_c = db_dict.copy()
            db_dict_c.update({self.lower_first_char(tag) + 'Id': moid})
            parent_mo.appendChild(self.mo_add_form_dict_xml(db_dict_c, tag))

    def append_equipment_elems(self, site, parent_mo, parent_mo_tag, mo_tag):
        db_dict = self.get_mo_attributes(mo_tag)
        for c_mo in site.find_mo_ending_with_parent_str(mo_tag, parent_mo_tag):
            db_dict_c = db_dict.copy()
            tmp_dict = site.site_extract_data(c_mo)
            for key in db_dict_c: db_dict_c[key] = tmp_dict.get(key, db_dict[key])
            parent_mo.appendChild(self.mo_add_form_dict_xml(db_dict_c, mo_tag))

    def append_child_tags(self, tag, rel_tag):
        parent_mo = self.mo_add_form_dict_xml(self.get_mo_related_attributes(tag), tag.moc)
        for child_mos in self.MoRelation.objects.filter(parent=tag.moc, tag=rel_tag, software=self.client.software):
            for child in self.MoName.objects.filter(moc=child_mos.child, software=self.client.software, motype=self.motype):
                if child.moid in [None, 'None', '', 'XX', 'nan', np.nan, '""']: continue
                if child.modetail_set.filter(flag=True).exists():
                    child_mo = self.append_child_tags(child, rel_tag)
                    parent_mo.appendChild(child_mo)
        return parent_mo

    def get_log_db_attributes(self, parent, rel_tag, site=None):
        if site: return self.log_append_child_tags(parent, rel_tag=rel_tag)
        else:
            parent = self.MoName.objects.get(moc=parent, software=self.client.software, motype=self.motype)
            return [self.append_child_tags(parent, rel_tag=rel_tag)]
    
    def db_append_child_tags(self, tag, rel_tag):
        ret_mos = []
        mo_tag_ins = self.MoName.objects.filter(moc=tag, software=self.client.software, motype=self.motype)
        if mo_tag_ins.exists():
            for mo_tag_in in mo_tag_ins:
                if mo_tag_in.moid in [None, 'None', '', 'XX', 'nan', np.nan, '""']: continue
                else: ret_mos.append(self.append_child_tags(mo_tag_in, rel_tag=rel_tag))
        return ret_mos
    
    def log_append_child_tags(self, tag, rel_tag, parent_str='', prev_site=''):
        ret_mos = []
        site = self.usid.sites.get(F'site_{prev_site}', None)
        mos = site.find_mo_ending_with_parent_str(tag, parent_str) if site and parent_str != '' else []
        if len(mos) > 0:
            for mo in mos:
                mo_attrs_db = {self.get_moc_id(tag): '1'}
                mo_attrs_db.update(self.get_db_attributes(self.get_end_moc(mo)))
                mo_attrs_site = site.get_mo_attr_str(mo)
                for key in mo_attrs_db: mo_attrs_db[key] = mo_attrs_site.get(key, mo_attrs_db[key])
                moc_tag = self.get_end_moc(mo)
                ret_mo = self.mo_add_form_dict_xml(mo_attrs_db, moc_tag)
                for child in self.MoRelation.objects.filter(parent=tag, tag=rel_tag, software=self.client.software):
                    for child_mo in self.log_append_child_tags(child.child, rel_tag, mo, prev_site):
                        ret_mo.appendChild(child_mo)
                ret_mos.append(ret_mo)
        else:
            ret_mos.extend(self.db_append_child_tags(tag, rel_tag))
        return ret_mos

    def get_mo_dict_for_id_tag(self, moc, moid, prev_site=None, parent=''):
        mo = None
        if (prev_site is not None) & (self.usid.sites.get(F'site_{self.usid.site_name_dict.get(prev_site, prev_site)}') is not None):
            site = self.usid.sites.get(F'site_{self.usid.site_name_dict.get(prev_site, prev_site)}')
            mos = site.find_mo_ending_with_parent_str_with_id(moc, moid, parent)
            if len(mos) > 0:
                mo = mos[0]
                tmp_dict = self.update_db_attr_with_mo_data(moc, site, mo)
            else: tmp_dict = self.get_mo_attributes(moc, moid)
        else: tmp_dict = self.get_mo_attributes(moc, moid)
        tmp_dict.update({self.lower_first_char(moc) + 'Id': moid})
        return tmp_dict, mo
    
    def union_of_mo_cosite_create_xml_script(self, moname):
        db_dict = self.get_mo_attributes(moname)
        air_profile_id_dict = {}
        ret_mos = []
        for site_key in self.usid.sites:
            site = self.usid.sites.get(site_key)
            air_profile_mos = site.find_mo_ending_with_parent_str(moname)
            for air_profile_mo in air_profile_mos:
                moid = air_profile_mo.split(',')[-1]
                if moid in air_profile_id_dict: continue
                air_profile_id_dict[moid] = True
                data_dict = site.site_extract_data(air_profile_mo)
                data_dict = {key: data_dict.get(key) for key in db_dict}
                ret_mos.append(self.mo_add_form_dict_xml(data_dict, moname))
        return ret_mos

    def mo_para_db_dict(self, mo, site):
        mo_attrs_db = {self.lower_first_char(self.get_end_mo_name(mo)) + 'Id': '1'}
        mo_attrs_db.update(self.get_db_attributes(self.get_end_mo_name(mo)))
        mo_attrs_site = site.get_mo_attr_str(mo)
        for key in mo_attrs_db: mo_attrs_db[key] = mo_attrs_site.get(key, mo_attrs_db[key])
        return mo_attrs_db
    
    def rcp_msg_capabilities(self):
        doc = Document()
        mo1 = doc.createElement('hello')
        mo1.setAttribute('xmlns', 'urn:ietf:params:xml:ns:netconf:base:1.0')
        doc.appendChild(mo1)
        tmp = {'capability': ['urn:ietf:params:netconf:base:1.0', 'urn:com:ericsson:ebase:0.1.0', 'urn:com:ericsson:ebase:1.1.0']}
        mo1.appendChild(self.mo_add_form_dict_xml(tmp, 'capabilities', change_me=False))
        return doc

    def rcp_msg_close(self):
        doc = Document()
        mo1 = doc.createElement('rpc')
        mo1.setAttribute('message-id', 'Closing')
        mo1.setAttribute('xmlns', 'urn:ietf:params:xml:ns:netconf:base:1.0')
        doc.appendChild(mo1)
        mo1.appendChild(doc.createElement('close-session'))
        return doc

    def main_rcp_msg_start(self, messageid='1'):
        doc = Document()
        rpc = doc.createElement('rpc')
        rpc.setAttribute('message-id', str(messageid))
        rpc.setAttribute('xmlns', 'urn:ietf:params:xml:ns:netconf:base:1.0')
        doc.appendChild(rpc)
        edit = doc.createElement('edit-config')
        rpc.appendChild(edit)
        target = doc.createElement('target')
        running = doc.createElement('running')
        target.appendChild(running)
        edit.appendChild(target)
        config = doc.createElement('config')
        config.setAttribute('xmlns:xc', 'urn:ietf:params:xml:ns:netconf:base:1.0')
        edit.appendChild(config)
        return doc, config

    def site_basic_msg1(self, nodedata):
        tmp_dict = {
            'managedElementId': 1,
            'dnPrefix': F'{nodedata.get("dnPrefix")},MeContext={nodedata.get("postsite")}',
            'SystemFunctions': {'systemFunctionsId': 1, 'Lm': {'lmId': 1, 'fingerprint': nodedata.get("fingerprint")}}
        }
        doc, config = self.main_rcp_msg_start('1')
        config.appendChild(self.mo_add_form_dict_xml(tmp_dict, 'ManagedElement', change_me=False))
        return doc

    def site_basic_msg2(self, nodedata):
        tmp_dict = {'managedElementId': 1, 'SystemFunctions': {'systemFunctionsId': 1, 'Lm': {
            'lmId': 1, 'FeatureState': [{'featureStateId': 'CXC4011823', 'featureState': '1 (ACTIVATED)'}]}}}
        # if '6648' in nodedata['bbtype']:
        #     tmp_dict['SystemFunctions']['Lm']['FeatureState'].extend([{'featureStateId': 'CXC4011823', 'featureState': '1 (ACTIVATED)'}])
        # elif '6651' in nodedata['bbtype']:
        #     tmp_dict['SystemFunctions']['Lm']['FeatureState'].extend([{'featureStateId': 'CXC4011823', 'featureState': '1 (ACTIVATED)'}])
        # else:
        #     tmp_dict['SystemFunctions']['Lm']['FeatureState'].extend([
        #         {'featureStateId': 'CXC4011823', 'featureState': '1 (ACTIVATED)'},
        #         {'featureStateId': 'CXC4011838', 'featureState': '1 (ACTIVATED)'},
        #     ])
        if len([_ for _ in ['6648', '6651'] if _ in nodedata['bbtype']]) == 0:
            tmp_dict['SystemFunctions']['Lm']['FeatureState'].extend([{'featureStateId': 'CXC4011838', 'featureState': '1 (ACTIVATED)'}])
        if '6630' in nodedata.get('bbtype') and nodedata.get("admOperatingMode", "") in ['10G_FULL', '9', '9 (10G_FULL)']:
            tmp_dict['SystemFunctions']['Lm']['FeatureState'].extend([{'featureStateId': 'CXC4011838', 'featureState': '1 (ACTIVATED)'}])
            
        doc, config = self.main_rcp_msg_start('2')
        config.appendChild(self.mo_add_form_dict_xml(tmp_dict, 'ManagedElement', change_me=False))
        return doc

    def get_sb_msg3_info(self, nodedata):
        secm = {
            'secMId': 1,
            'UserManagement': {
                'userManagementId': 1,
                'UserIdentity': {
                    'userIdentityId': 1,
                    'MaintenanceUser': {
                        'maintenanceUserId': 1,
                        'userName': nodedata.get("username", ""),
                        'password': {'cleartext': 'true', 'password': nodedata.get("password", "")}
                    }
                }
            }
        }

        sysm = {
            'sysMId': 1,
            'CliTls': {'cliTlsId': 1, 'administrativeState': '1 (UNLOCKED)',
                       'trustCategory': 'ManagedElement=1,SystemFunctions=1,SecM=1,CertM=1,TrustCategory=oamTrustCategory',
                       'nodeCredential': 'ManagedElement=1,SystemFunctions=1,SecM=1,CertM=1,NodeCredential=oamNodeCredential'},
            'HttpM': {'httpMId': 1, 'Https': {'httpsId': 1,
                                              'nodeCredential': 'ManagedElement=1,SystemFunctions=1,SecM=1,CertM=1,NodeCredential=oamNodeCredential',
                                              'trustCategory': 'ManagedElement=1,SystemFunctions=1,SecM=1,CertM=1,TrustCategory=oamTrustCategory'}},
            'OamAccessPoint': {'oamAccessPointId': 1,
                               'accessPoint': F'ManagedElement=1,Transport=1,Router={nodedata.get("oam", "")},InterfaceIPv4=1,AddressIPv4=1'},
            'OamTrafficClass': {'oamTrafficClassId': 1, 'dscp': 8},
            'TimeM': {'timeMId': 1, 'DateAndTime': {'dateAndTimeId': 1, 'timeZone': nodedata.get("timeZone", "")},
                      'Ntp': {'ntpId': 1, 'NtpServer': []}},
        }
        
        if nodedata.get(F'transaction', '').upper() == 'TOSB':
            for i in [1, 2]:
                if nodedata.get(F'freqsync{i}', '') == '': continue
                sysm['TimeM']['Ntp']['NtpServer'].append(
                    {'userLabel': F"NTP{i}", 'ntpServerId': F"{i}",
                     'serverAddress': nodedata.get(F"freqsync{i}", ""), 'administrativeState': '1 (UNLOCKED)'})
        else:
            for i in [1, 2, 3, 4]:
                if nodedata.get(F'ntpip{i}', '') == '': continue
                sysm['TimeM']['Ntp']['NtpServer'].append(
                    {'userLabel': F"NTP{i}", 'ntpServerId': F"{i}",
                     'serverAddress': nodedata.get(F"ntpip{i}", ""), 'administrativeState': '1 (UNLOCKED)'})

        fru = {'fieldReplaceableUnitId': nodedata.get("bbuid", ""), 'TnPort': {'tnPortId': nodedata.get("TnPort", "")}}

        ethernetport = {
            'ethernetPortId': nodedata.get("TnPort", ""),
            'administrativeState': '1 (UNLOCKED)',
            'admOperatingMode': nodedata.get("admOperatingMode", ""),
            'autoNegEnable': 'false',
            'encapsulation': F'ManagedElement=1,Equipment=1,FieldReplaceableUnit={nodedata.get("bbuid", "")},TnPort={nodedata.get("TnPort", "")}',
            'userLabel': nodedata.get("TnPort", "")
        }

        oam_vlan = {'vlanPortId': nodedata.get('oam_van', ""), 'vlanId': nodedata.get('oam_van', ""),
                    'encapsulation': F'ManagedElement=1,Transport=1,EthernetPort={nodedata.get("TnPort", "")}'}

        oam_router = {
            'routerId': nodedata.get("oam", ""),
            'InterfaceIPv4': {
                'interfaceIPv4Id': 1, 'routesHoldDownTimer': 180,
                'encapsulation': F'ManagedElement=1,Transport=1,VlanPort={nodedata.get("oam_van", "")}',
                'AddressIPv4': {'addressIPv4Id': 1, 'address': F'{nodedata.get("oam_ip", "")}/{nodedata.get("oam_plength", "")}'}},
            'RouteTableIPv4Static': {
                'routeTableIPv4StaticId': 1,
                'Dst': {'dstId': 1, 'dst': '0.0.0.0/0',
                        'NextHop': {'nextHopId': 1, 'adminDistance': 10, 'address': F'{nodedata.get("oam_gway", "")}'}}
            }
        }

        barrer_vlan = {'vlanPortId': nodedata.get("lte_vlan", ''), 'vlanId': nodedata.get("lte_vlan", ''),
                       'encapsulation': F'ManagedElement=1,Transport=1,EthernetPort={nodedata.get("TnPort", "")}'}

        barrer_router = {
            'routerId': nodedata.get("lte", ""),
            'InterfaceIPv4': {
                'interfaceIPv4Id': nodedata.get("lte_interface", ""), 'routesHoldDownTimer': 180,
                'encapsulation': F'ManagedElement=1,Transport=1,VlanPort={nodedata.get("lte_vlan", "")}',
                'AddressIPv4': {'addressIPv4Id': 1, 'address': F'{nodedata.get("lte_ip", "")}/{nodedata.get("lte_plength", "")}'}},
            'RouteTableIPv4Static': {
                'routeTableIPv4StaticId': 1,
                'Dst': {'dstId': 1, 'dst': '0.0.0.0/0',
                        'NextHop': {'nextHopId': 1, 'adminDistance': 10, 'address': nodedata.get("lte_gway", "")}}
            }
        }

        bridge = {'bridgeId': '1', 'port': F'ManagedElement=1,Transport=1,VlanPort={nodedata.get("lte_vlan", "")}'}

        sb_3massage = {
            'secm': secm,
            'sysm': sysm,
            'fru': fru,
            'ethernetport': ethernetport,
            'oam_vlan': oam_vlan,
            'oam_router': oam_router,
            'barrer_vlan': barrer_vlan,
            'barrer_router': barrer_router,
            'bridge': bridge,
        }
        return sb_3massage

    def site_basic_msg4(self, nodedata):
        doc, config = self.main_rcp_msg_start('4')
        config.appendChild(self.mo_add_form_dict_xml({'managedElementId': 1, 'networkManagedElementId': nodedata.get("postsite")}, 'ManagedElement', change_me=False))
        return doc

    def paging_max_records(self):
        paging_max_records_dict = {3000: '4', 5000: '7', 10000: '16', 20000: '16', 15000: '16'}
        return paging_max_records_dict.get(self.usid.df_enb_cell.loc[(self.usid.df_enb_cell.postsite == self.node) &
                                self.usid.df_enb_cell.celltype.isin(['FDD', 'TDD'])].dlchannelbandwidth.astype(int).min(), '16')

    def append_mos_equipment_elems(self, site, parent_fdn, mo_tag, parent_ldn):
        lines = []
        db_dict = self.get_mo_attributes(mo_tag)
        for c_mo in site.find_mo_ending_with_parent_str(mo_tag, parent_fdn):
            db_dict_c = db_dict.copy()
            tmp_dict = site.site_extract_data(c_mo)
            for key in db_dict_c: db_dict_c[key] = tmp_dict.get(key, db_dict[key])
            lines.extend(self.create_mos_script_from_dict(db_dict_c, mo_tag, F'{parent_ldn},{mo_tag}={db_dict_c.get(F"{mo_tag[:1].lower() + mo_tag[1:]}Id")}'))
        return lines

    def union_of_mo_cosite_create_mos_script(self, moname, parentmo):
        db_dict = self.get_mo_attributes(moname)
        db_mo_dict = {}
        ret_mos = []
        for site_key in self.usid.sites:
            site = self.usid.sites.get(site_key)
            union_mo = site.find_mo_ending_with_parent_str(moname)
            for mo in union_mo:
                moid = mo.split(',')[-1]
                if moid in db_mo_dict.keys(): continue
                db_mo_dict[moid] = True
                data_dict = site.site_extract_data(mo)
                data_dict = {key: data_dict.get(key) for key in db_dict}
                if len(parentmo) > 0: mo_name = F'{parentmo},{moid}'
                else: mo_name = moid
                ret_mos.extend(self.create_mos_script_from_dict(adddict=data_dict, moname=moname, moc=mo_name))
        return ret_mos

    def create_mos_script_from_dict(self, adddict, moname, moc='', change_me=True):
        cmo = []
        if len(moc) > 0:
            cmo.append(F'crn {moc}')
            for key in adddict:
                if (str(key).lower() == F'{moname}Id'.lower()) or (adddict[key] is None) or (adddict[key] == ''): continue
                elif (type(adddict[key]) == int) or (type(adddict[key]) == str):
                    if (self.mos_check_text_element(str(adddict[key]), change_me) is None) or \
                            (self.mos_check_text_element(str(adddict[key]), change_me) == ''): continue
                    val = self.mos_check_text_element(str(adddict[key]), change_me)
                    cmo.append(F'{str(key)} {val}')
                elif type(adddict[key]) == dict:
                    val = self.parameter_dict_values(para_dict=adddict[key], change_me=True, delime=',')
                    if len(val) > 1: cmo.append(F'{str(key)} {val[:-1]}')
                elif type(adddict[key]) == list:
                    val = self.parameter_list_values(adddict[key])
                    if len(val) > 1: cmo.append(F'{str(key)} {val[:-1]}')
            cmo.extend(['end', ''])
        return cmo

    def parameter_dict_values(self, para_dict, change_me=True, delime=','):
        val = ''
        if len(para_dict) != 0:
            for keys in para_dict:
                if type(para_dict[keys]) == dict: val += self.parameter_dict_values(para_dict[keys], delime=';')
                elif type(para_dict[keys]) == list: val += F'{keys}={self.parameter_list_values(para_list=para_dict[keys], change_me=True, delime=" ")},'
                elif (self.mos_check_text_element(str(para_dict[keys]), change_me) is None) or \
                        (self.mos_check_text_element(str(para_dict[keys]), change_me) == ''): val += F'{str(keys)}=,'
                else: val += F'{keys}={self.mos_check_text_element(str(para_dict[keys]), change_me)}{delime}'
        return val.replace(',;', ';').replace(' ,', ',')

    def parameter_list_values(self, para_list, change_me=True, delime=','):
        val = ''
        for item in para_list:
            if type(item) == dict: val += self.parameter_dict_values(para_dict=item, change_me=True, delime=',') + ';'
            elif type(item) == list: val += self.parameter_list_values(para_list=item, change_me=True, delime=delime)
            elif (self.mos_check_text_element(str(item), change_me) == 'None') or \
                    (self.mos_check_text_element(str(item), change_me) == ''): continue
            else: val += self.mos_check_text_element(str(item), change_me) + delime
        return val.replace(',;', ';').replace(' ,', ',')

    def mos_check_text_element(self, in_str, change_me=True):
        if in_str is not None: in_str = in_str.strip('"')
        if (in_str is None) or (in_str == 'None'): return ''
        elif 'ManagedElement' in in_str:   # and (F'ManagedElement={self.node}' not in in_str)
            if change_me:
                tmp_ref = {_.split('=')[0]: _.split('=')[-1] for _ in in_str.split(',')[in_str.split(',').index([_ for _ in in_str.split(',') if 'ManagedElement' in _][0])+1:]}
                in_str = ','.join([key + '=' + tmp_ref[key] for key in tmp_ref])
        elif re.match('(.*)\s\((.*)\)$', in_str): in_str = re.match('(.*)\s\((.*)\)$', in_str).group(1)
        return in_str

    def mos_files_start(self, script_type=None, cv_flag=False):
        return [F"""
$DATE = `date +%Y%m%d_%H%M%S`
l+ logfile_{self.__class__.__name__}_{self.node}_$DATE.log
lt all
unset all
pv $nodename
if $nodename != {self.node}
    print ERROR: Node Name Mismatch. Wrong Node. ABORT !!!
    l-
    return
fi
confbd+
gs+
"""]

    def mos_files_end(self, script_type=None, cv_flag=False):
        return [
            '$DATE = `date +%Y%m%d_%H%M%S`',
            '' if (script_type is None) and (not cv_flag) else F'cvms Post_{script_type.split("_", maxsplit=2)[2]}_$DATE',
            'confbd-',
            'gs',
            'unset all',
            'l-',
            '', ''
        ]

    def get_market_sbnw_dict(self, market=''):
        market_sbnw_dict = {
            'excalibur': ['Atlanta', 'Jacksonville', 'Miami', 'Orlando', 'Tampa', 'Excalibur'],
            'tri_la': ['Escondido', 'Vegas', 'ElMonte', 'Torrance', 'SimiValley', 'Irvine', 'Riverside'],

        }
        return market_sbnw_dict.get(market, ['!!! Error Cahek market_sbnw_dict on tool!!!'])

    def get_lock_cells(self):
        return [F"""
####:----------------> Lock EUtranCell & NbIotCell, NRCellDU, NRSectorCarrier, MME & AMF <----------------:####
####:----------------> Soft Power Reduction (Start)
hget NRSectorCarrier txPowerRatio|txPowerChangeRate
mr NRSC
ma NRSC NRSectorCarrier=
for $mo in NRSC
    get $mo nRSectorCarrierId > $scID
    get $mo txPowerRatio > $pwr[$scID]
    set $mo txPowerChangeRate 5
    set $mo txPowerRatio 10
done
wait 50s
hget NRSectorCarrier txPowerRatio|txPowerChangeRate

mr unlock_cell
ma unlock_cell ^EUtranCell[FT]DD|NbIotCell= ^administrativestate$ 1
ma unlock_cell ^NRCellDU= ^administrativestate$ 1
ma unlock_cell ^NRSectorCarrier= ^administrativestate$ 1
pr unlock_cell
if $nr_of_mos > 0
    bls unlock_cell
    wait 30
fi
get unlock_cell ^operationalState$ 1
if $nr_of_mos > 0
    wait 100
fi
get unlock_cell ^operationalState$ 1
if $nr_of_mos > 0
    bl unlock_cell
fi
st unlock_cell

st ^(TermPointToMme|TermPointToAmf)=
bl ^(TermPointToMme|TermPointToAmf)=
wait 5
st ^(TermPointToMme|TermPointToAmf)=
        """]

    def get_unlock_cells(self):
        return ["""
####:----------------> UnLock EUtranCell & NbIotCell, NRCellDU, NRSectorCarrier, MME & AMF <----------------:####
pr unlock_cell
if $nr_of_mos > 0
    deb unlock_cell
    wait 30
    lst unlock_cell
fi
mr unlock_cell

st ^(TermPointToMme|TermPointToAmf)=
deb ^(TermPointToMme|TermPointToAmf)=
wait 5
st ^(TermPointToMme|TermPointToAmf)=

####:----------------> Soft Power Reduction (End)
for $mo in NRSC
  get $mo nRSectorCarrierId > $scID
  set $mo txPowerChangeRate 1
  set $mo txPowerRatio $pwr[$scID]
done
"""]

    def get_node_certificate(self):
        return ["""
####:----------------> NodeCredential & TrustCategory for  Https & CliTls <----------------:####
get ,NodeCredential= nodeCredentialId > $nn
get ,TrustCategory= TrustCategoryId > $tt
get SystemFunctions=1,SysM=1,HttpM=1,Https=1$ nodeCredential > $no
get SystemFunctions=1,SysM=1,HttpM=1,Https=1$ trustCategory > $tr
if $no !~ NodeCredential
    set SystemFunctions=1,SysM=1,HttpM=1,Https=1$ nodeCredential SecM=1,CertM=1,NodeCredential=$nn
fi
if $tr !~ TrustCategory
    set SystemFunctions=1,SysM=1,HttpM=1,Https=1$ trustCategory SecM=1,CertM=1,TrustCategory=$tt
fi
get SystemFunctions=1,SysM=1,CliTls=1$ nodeCredential > $no
get SystemFunctions=1,SysM=1,CliTls=1$ trustCategory > $tr
if $no !~ NodeCredential
    set SystemFunctions=1,SysM=1,CliTls=1$ nodeCredential SecM=1,CertM=1,NodeCredential=$nn
fi
if $tr !~ TrustCategory
    set SystemFunctions=1,SysM=1,CliTls=1$ trustCategory SecM=1,CertM=1,TrustCategory=$tt
fi
set SystemFunctions=1,SysM=1,CliTls=1$ administrativeState 1
unset $nn
unset $tt
unset $no
unset $tr

        """]

    def get_vswr_script(self):
        return ["""
####:----------------> FieldReplaceableUnit ---> vswrSupervisionSensitivity & vswrSupervisionActive <----------------:####
mr auxdevice
ma auxdevice ^FieldReplaceableUnit=
for $mo in auxdevice
    get $mo ^fieldReplaceableUnitId$ > $zz
    get $mo productData > $productData
    $prodname = $productData[productName] -s \\x020 -g
    $prodnumber = $productData[productNumber] -s \\x020 -g
    if $prodname ~ ^RUS.1B.*
        set FieldReplaceableUnit=$zz,RfPort=[AR]$ administrativeState 1
        set FieldReplaceableUnit=$zz,RfPort=B$ administrativeState 0
        set FieldReplaceableUnit=$zz,RfPort=[ABR]$ vswrSupervisionSensitivity 100
        set FieldReplaceableUnit=$zz,RfPort=A$ vswrSupervisionActive true
        set FieldReplaceableUnit=$zz,RfPort=B$ vswrSupervisionActive false
    else if $prodname ~ ^RU-.*
        set FieldReplaceableUnit=$zz,RfPort=A$ administrativeState 1
        set FieldReplaceableUnit=$zz,RfPort=B$ administrativeState 0
        set FieldReplaceableUnit=$zz,RfPort=[AB]$ vswrSupervisionSensitivity 100
        set FieldReplaceableUnit=$zz,RfPort=A vswrSupervisionActive true
        set FieldReplaceableUnit=$zz,RfPort=B vswrSupervisionActive false
    else if $prodname ~ ^RRUS32B.*
        set FieldReplaceableUnit=$zz,RfPort=[ABCDR]$ administrativeState 1
        set FieldReplaceableUnit=$zz,RfPort=[ABCDR]$ vswrSupervisionSensitivity 100
        set FieldReplaceableUnit=$zz,RfPort=[ABCD]$ vswrSupervisionActive true
    else if $prodname ~ ^RRUS.1.*
        set FieldReplaceableUnit=$zz,RfPort=[ABR]$ administrativeState 1
        set FieldReplaceableUnit=$zz,RfPort=[ABR]$ vswrSupervisionSensitivity 100
        set FieldReplaceableUnit=$zz,RfPort=[AB]$ vswrSupervisionActive true
    else if $prodname ~ ^RRUS.*
        set FieldReplaceableUnit=$zz,RfPort=[ABCDR]$ administrativeState 1
        set FieldReplaceableUnit=$zz,RfPort=[ABCDR]$ vswrSupervisionSensitivity 100
        set FieldReplaceableUnit=$zz,RfPort=[ABCD]$ vswrSupervisionActive true
    else if $prodname ~ ^Radio4449.* || $prodname ~ ^Radio4480.* || $prodname ~ ^Radio2260.* || $prodname ~ ^Radio4415.* || $prodname ~ ^Radio4478.* || $prodname ~ ^Radio2203*
        set FieldReplaceableUnit=$zz,RfPort=[ABCDR]$ administrativeState 1
        set FieldReplaceableUnit=$zz,RfPort=[ABCDR]$ vswrSupervisionSensitivity 100
        set FieldReplaceableUnit=$zz,RfPort=[ABCD]$ vswrSupervisionActive true
        set FieldReplaceableUnit=$zz,RfPort=[ABCD],FreqBandData= vswrSupervisionActive true
        set FieldReplaceableUnit=$zz,RfPort=[ABCD],FreqBandData= vswrSupervisionSensitivity 100
    fi
    if $prodnumber ~ ^KRC118050/1 || $prodnumber ~ ^KRC118034/1 || $prodnumber ~ ^KRC161254/1 || $prodnumber ~ ^KRC161601/1
        set FieldReplaceableUnit=$zz,RfPort=[ABCDR]$ vswrSupervisionSensitivity -1
        set FieldReplaceableUnit=$zz,RfPort=[ABCDR]$ vswrSupervisionActive false
    fi
done
mr auxdevice
unset $productData
unset $prodnumber
unset $prodname

        """]

    def get_nr_freq_rel_cellrel_functions(self):
        return [
            F'####:----------------> Functions for NRNetwork, NRFrequency, NRFreqRelation & NRCellRelation <----------------:####',
            F'pr GNBCUCPFunction=1,NRNetwork=1$',
            F'if $nr_of_mos = 0',
            F'    cr GNBCUCPFunction=1,NRNetwork=1',
            F'fi',
            F'',
            F'func createnrfrequency',
            F'    pr $frqldn$',
            F'    if $nr_of_mos = 0',
            F'        crn $frqldn',
            F'        arfcnValueNRDl $arfcnval',
            F'        smtcScs $smtcscs',
            F'        smtcPeriodicity $smtcperiodicity',
            F'        smtcOffset $smtcoffset',
            F'        smtcDuration $smtcduration',
            F'        end',
            F'    fi',
            F'endfunc',
            F'',
            F'func createnrfreqprofile',
            F'    $uemcnrfreqrel_flag = 0',
            F'    pr GNBCUCPFunction=1,UeMC=1,UeMCNrFreqRelProfile=$arfcnval$',
            F'    if $nr_of_mos = 0',
            F'        $uemcnrfreqrel_flag = 1',
            F'        crn GNBCUCPFunction=1,UeMC=1,UeMCNrFreqRelProfile=$arfcnval',
            F'        ueConfGroupType 0',
            F'        end',
            F'    fi',
            F'    if $uemcnrfreqrel_flag = 1 && $arfcnval ~ ^12.*',
            F'        ld GNBCUCPFunction=1,UeMC=1,UeMCNrFreqRelProfile=$arfcnval,UeMCNrFreqRelProfileUeCfg=',
            F'        set GNBCUCPFunction=1,UeMC=1,UeMCNrFreqRelProfile=$arfcnval,UeMCNrFreqRelProfileUeCfg= connModeAllowedPCell true',
            F'    else if $uemcnrfreqrel_flag = 1 && $arfcnval ~ ^3.*',
            F'        ld GNBCUCPFunction=1,UeMC=1,UeMCNrFreqRelProfile=$arfcnval,UeMCNrFreqRelProfileUeCfg=',
            F'        set GNBCUCPFunction=1,UeMC=1,UeMCNrFreqRelProfile=$arfcnval,UeMCNrFreqRelProfileUeCfg= connModeAllowedPCell true',
            F'    else if $uemcnrfreqrel_flag = 1 && $arfcnval ~ ^5.*',
            F'        ld GNBCUCPFunction=1,UeMC=1,UeMCNrFreqRelProfile=$arfcnval,UeMCNrFreqRelProfileUeCfg=',
            F'        set GNBCUCPFunction=1,UeMC=1,UeMCNrFreqRelProfile=$arfcnval,UeMCNrFreqRelProfileUeCfg= connModeAllowedPCell false',
            F'    fi',
            F'    pr GNBCUCPFunction=1,Mcpc=1,McpcPSCellNrFreqRelProfile=$arfcnval$',
            F'    if $nr_of_mos = 0',
            F'        crn GNBCUCPFunction=1,Mcpc=1,McpcPSCellNrFreqRelProfile=$arfcnval',
            F'        end',
            F'    fi',
            F'endfunc',
            F'',
            F'',
            F'#######################else if $arfcnval >= 499200 && $arfcnval <= 537999',
            F'#######################    $creselpro = 7',
            F'#######################else if $arfcnval >= 2054166 && $arfcnval <= 2084999',
            F'#######################    $creselpro = 7',
            F'',
            F'func createnrfreqrelation',
            F'    ## NRFreqRelation ---> cellReselectionPriority is N71=4, N41=7 & mmWave=7',
            F'    if $arfcnval >= 123400 && $arfcnval <= 130400',
            F'        $creselpro = 4',
            F'    else if $arfcnval >= 386000 && $arfcnval <= 398000',
            F'        $creselpro = 7',
            F'    else',
            F'      $creselpro = 7',
            F'    fi',
            F'    pr $nrfreqrelldn$',
            F'    if $nr_of_mos = 0',
            F'        crn $nrfreqrelldn',
            F'        cellReselectionPriority 7',
            F'        nRFrequencyRef $frqldn',
            F'        pMax 23',
            F'        qOffsetFreq 0',
            F'        qRxLevMin -140',
            F'        sIntraSearchP 62',
            F'        tReselectionNR 2',
            F'        threshXHighP 4',
            F'        threshXLowP 0',
            F'        mcpcPSCellNrFreqRelProfileRef GNBCUCPFunction=1,Mcpc=1,McpcPSCellNrFreqRelProfile=$arfcnval',
            F'        ueMCNrFreqRelProfileRef GNBCUCPFunction=1,UeMC=1,UeMCNrFreqRelProfile=$arfcnval',
            F'        end',
            F'        set $nrfreqrelldn$ cellReselectionPriority $creselpro',
            F'    fi',
            F'endfunc',
            F'',
            F'func createnrcellrelation',
            F'    pr $nrcellrelldn$',
            F'    if $nr_of_mos = 0',
            F'        crn $nrcellrelldn',
            F'        isRemoveAllowed false',
            F'        nRCellRef $targetcucell',
            F'        nRFreqRelationRef $nrfreqrelldn',
            F'        end',
            F'    fi',
            F'endfunc',
            F'',
            F'',
        ]

    def get_sc_features_dict(self, sw='', script_type=''):
        sc_feature_dict = {
            'TMO_23_Q4': {
                'feature_nr_all': ["""
####:---> NR Features <---:####
set SystemFunctions=1,Lm=1,FeatureState=CXC4012379$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012375$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012273$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4040008$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012325$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012492$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012475$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012479$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012477$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012478$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012558$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012592$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012591$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012637$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012531$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012534$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012538$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012373$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012549$ featureState 1
#### 10GE Port Capability
pr SystemFunctions=1,Lm=1,FeatureState=CXC4011838$
if $nr_of_mos > 0
    set SystemFunctions=1,Lm=1,FeatureState=CXC4011838$ featureState 1
fi
#### CPRI Compression
pr SystemFunctions=1,Lm=1,FeatureState=CXC4012051$
if $nr_of_mos > 0
    set SystemFunctions=1,Lm=1,FeatureState=CXC4012051$ featureState 1
fi
                """],
                'n071': ["""
####:---> N71 (N600) <---:####
set SystemFunctions=1,Lm=1,FeatureState=CXC4012424$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012324$ featureState 1

scg
scw RP1954:2,RP1993:1,RP1994:28,RC554:200,RC555:480,RP2355:1,RC842:1
//## v7 SC for UE Assisted Precoding Activation N1900 
get GNBDUFunction=1,NRCellDU= ^bandList$ 25
if $nr_of_mos != 0
    scw RP1700:69141,RP1900:51152,RP1909:100,RP1957:6,RP1958:2,RP1963:5,RP1964:1,RP1955:12,RP1956:3,RP1962:2,RP2065:40,RP2066:60
fi
scg
                """],
                'n002': ["""
####:---> N2 (N1900) <---:####
set SystemFunctions=1,Lm=1,FeatureState=CXC4012424$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012324$ featureState 1

scg
scw RP1954:2,RP1993:1,RP1994:28,RC554:200,RC555:480,RP2355:1,RC842:1
//## v7 SC for UE Assisted Precoding Activation N1900 
get GNBDUFunction=1,NRCellDU= ^bandList$ 25
if $nr_of_mos != 0
    scw RP1700:69141,RP1900:51152,RP1909:100,RP1957:6,RP1958:2,RP1963:5,RP1964:1,RP1955:12,RP1956:3,RP1962:2,RP2065:40,RP2066:60
fi
scg
                """],
                'n041': ["""
####:---> N41 (N2500) <---:####
set SystemFunctions=1,Lm=1,FeatureState=CXC4012272$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012330$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012347$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012354$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012406$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012570$ featureState 1

set SystemFunctions=1,Lm=1,FeatureState=CXC4012589$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012590$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012510$ featureState 1

scg
scw RP1988:7,RP1810:2,RP146:4,RP1459:4,RP1545:4,RC554:200,RC555:480,RP2355:1,RC842:1
#### 22.Q2 Rev4 - TMO Adv DL SU MIMO feature SC addition
get Lm=1,FeatureState=CXC4012510$ ^featureState$ ^1
if $nr_of_mos > 0
    scw RP970:30,RP1022:0
fi
#### Added - Pre-req to check if the Q1 BWP feature enhancement is set or not for SC RP1869:0.
get BWPSetUeCfg=2$ bwpSwitchingFilterRelaxation$ false
if $nr_of_mos > 0
    scw RP1869:0
fi
scg
                """],
                'lte': [""""""],
                'l41': [""""""],
                'feature_lte_all': ["""
set SystemFunctions=1,Lm=1,FeatureState=CXC4010319$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010320$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010609$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010613$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010616$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010618$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010620$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010717$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010723$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010770$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010856$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010912$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010949$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010956$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010959$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010960$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010961$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010962$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010963$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010964$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010967$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010974$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010990$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011011$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011033$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011034$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011050$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011055$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011056$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011059$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011060$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011061$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011062$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011064$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011067$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011069$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011074$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011075$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011157$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011163$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011183$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011245$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011251$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011252$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011255$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011317$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011319$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011327$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011345$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011356$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011366$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011370$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011373$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011376$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011378$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011427$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011443$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011444$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011476$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011477$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011479$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011482$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011485$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011515$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011554$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011559$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011666$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011667$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011711$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011714$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011807$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011811$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011813$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011815$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011820$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011823$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011838$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011918$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011937$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011938$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011939$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011946$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011969$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011980$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011999$ featureState 0
set SystemFunctions=1,Lm=1,FeatureState=CXC4012003$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012018$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012036$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012070$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012079$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012097$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012259$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012260$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012271$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012324$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012371$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012381$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012385$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012485$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012504$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012563$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4040008$ featureState 1

set SystemFunctions=1,Lm=1,FeatureState=CXC4012578$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012637$ featureState 1

                """],
                'feature_lte_fdd': ["""
####:---> LTE FDD Features <---:####
set SystemFunctions=1,Lm=1,FeatureState=CXC4012344 featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011929 featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012081$ featureState 1
//set SystemFunctions=1,Lm=1,FeatureState=CXC4011996$ featureState 0
//set SystemFunctions=1,Lm=1,FeatureState=CXC4012157$ featureState 0
set SystemFunctions=1,Lm=1,FeatureState=CXC4010841$ featureState 0
set SystemFunctions=1,Lm=1,FeatureState=CXC4010973$ featureState 0
//set SystemFunctions=1,Lm=1,FeatureState=CXC4012257$ featureState 0
set SystemFunctions=1,Lm=1,FeatureState=CXC4012218$ featureState 1
//set SystemFunctions=1,Lm=1,FeatureState=CXC4011973$ featureState 0
set SystemFunctions=1,Lm=1,FeatureState=CXC4011253$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011914$ featureState 1
//set SystemFunctions=1,Lm=1,FeatureState=CXC4040009$ featureState 0

//set SystemFunctions=1,Lm=1,FeatureState=CXC4012034$ featureState 1
//set SystemFunctions=1,Lm=1,FeatureState=CXC4012015$ featureState 1
//set SystemFunctions=1,Lm=1,FeatureState=CXC4011710$ featureState 1
//set SystemFunctions=1,Lm=1,FeatureState=CXC4010955$ featureState 0
//set SystemFunctions=1,Lm=1,FeatureState=CXC4010980$ featureState 0
set SystemFunctions=1,Lm=1,FeatureState=CXC4011667$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011967$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011422$ featureState 1

scg
scw 83:0,869:0,2095:0,2123:0,145:1,2959:0,4467:0,L5319:1
#### CATM HY58469
get SystemFunctions=1,Lm=1,FeatureState=CXC4012359$ featureState$ ^1
if $nr_of_mos > 0
   scw L4911:1
fi
if $mibprefix ~ Syosset
   scw 1449:7
else
   scw 1449:4
fi
if $excalibur != 1
   scw 1757:112
fi
scg

                """],
                'feature_lte_tdd': ["""
####:---> Features for L41 (L2500 - TDD, AAS)  <---:####
//set SystemFunctions=1,Lm=1,FeatureState=CXC4012344$ featureState 0
set SystemFunctions=1,Lm=1,FeatureState=CXC4011929$ featureState 0
//set SystemFunctions=1,Lm=1,FeatureState=CXC4012081$ featureState 0
set SystemFunctions=1,Lm=1,FeatureState=CXC4011996$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012157$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010841$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4010973$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012257$ featureState 1
//set SystemFunctions=1,Lm=1,FeatureState=CXC4012218$ featureState 0
set SystemFunctions=1,Lm=1,FeatureState=CXC4011973$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4011253$ featureState 0
set SystemFunctions=1,Lm=1,FeatureState=CXC4011914$ featureState 0
set SystemFunctions=1,Lm=1,FeatureState=CXC4040009$ featureState 1

set SystemFunctions=1,Lm=1,FeatureState=CXC4040018$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012356$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012199$ featureState 1

scg
####:---> NO SC defined on 23Q2 on L41 TDD Cells <---:####
####:---> NO SC defined on 23Q3 on L41 TDD Cells <---:####
####:---> NO SC defined on 23Q4 on L41 TDD Cells <---:####
                """],
            },
            'TMO_23_Q2': {
                'feature_nr_all': ["""
####:---> NR Features <---:####',
set SystemFunctions=1,Lm=1,FeatureState=CXC4012379$ featureState 0
set SystemFunctions=1,Lm=1,FeatureState=CXC4012375$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012273$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4040008$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012325$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012492$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012475$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012479$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012477$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012478$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012558$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012592$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012591$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012637$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012531$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012534$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012538$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012373$ featureState 1
set SystemFunctions=1,Lm=1,FeatureState=CXC4012549$ featureState 1
#### 10GE Port Capability
pr SystemFunctions=1,Lm=1,FeatureState=CXC4011838$
if $nr_of_mos > 0
    set SystemFunctions=1,Lm=1,FeatureState=CXC4011838$ featureState 1
fi
#### CPRI Compression
pr SystemFunctions=1,Lm=1,FeatureState=CXC4012051$
if $nr_of_mos > 0
    set SystemFunctions=1,Lm=1,FeatureState=CXC4012051$ featureState 1
fi
                """],
                'n071': [
                    F'####:---> N71 (N600) <---:####',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012424$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012324$ featureState 1',
                    F'',
                    F'scg',
                    F'#### ## v7 RP1992:1 UL BLER ',
                    F'scw RP1992:1',
                    F'',
                    F'#### ## additions: MTR21.39 additions for CD ',
                    F'scw RP136:20,RP137:20,RP138:20,RP139:20',
                    F'',
                    F'#### ### - 02/23/2023 #v4 - TMO 22.Q4 Feature Bundle updates ',
                    F'#### ### - CLPC activation (FDD and TDD NR) ',
                    F'scw RP1469:1,RP1533:11,RP1600:6,RP1602:1,RP1765:1,RP1766:150,RP86:50,RP87:10,RP88:1',
                    F'',
                    F'#### ### MCS Reduction activation ',
                    F'scw RP1761:1',
                    F'',
                    F'scg', F'', F'',
                ],
                'n002': [
                    F'####:---> N2 (N1900) <---:####',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012424$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012324$ featureState 1',
                    F'',
                    F'scg',
                    F'#### ## v7 RP1992:1 UL BLER',
                    F'scw RP1992:1',
                    F'',
                    F'#### ## additions: MTR21.39 additions for CD',
                    F'scw RP136:20,RP137:20,RP138:20,RP139:20',
                    F'',
                    F'#### ### - 02/23/2023 #v4 - TMO 22.Q4 Feature Bundle updates',
                    F'#### ### - CLPC activation (FDD and TDD NR) ',
                    F'scw RP1469:1,RP1533:11,RP1600:6,RP1602:1,RP1765:1,RP1766:150,RP86:50,RP87:10,RP88:1',
                    F'',
                    F'#### ### MCS Reduction activation ',
                    F'scw RP1761:1',
                    F'',
                    F'scg',
                    F'',
                    F'',
                ],
                'n041': [
                    F'####:---> N41 (N2500) <---:####',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012272$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012330$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012347$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012354$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012406$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012570$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012589$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012590$ featureState 1',


                    F'scg',
                    F'#### MTR21.39 additions for CD',
                    F'scw RP136:20,RP137:20,RP138:20,RP139:20',
                    F'',
                    F'#### 22.Q2 Rev4 - TMO Adv DL SU MIMO feature SC addition',
                    F'get Lm=1,FeatureState=CXC4012510$ ^featureState$ ^1',
                    F'if $nr_of_mos > 0',
                    F'	scw RP970:30,RP1022:0,RP983:53',
                    F'fi',
                    F'',
                    F'#### 22Q4 v9 RP1992:1 UL BLER',
                    F'scw RP1992:1',
                    F'',
                    F'#### 02/27/2023 #v8 - TMO 22.Q4 Feature Bundle updates - CLPC activation  upated (TDD NR) ',
                    F'scw RP1469:1,RP1602:1,RP86:50,RP87:10,RP88:1',
                    F'',
                    F'#### MCS Reduction activation',
                    F'scw RP1761:1',
                    F'',
                    F'#### Added - Pre-req to check if the Q1 BWP feature enhancement is set or not for SC RP1869:0.',
                    F'get BWPSetUeCfg=2$ bwpSwitchingFilterRelaxation$ false',
                    F'if $nr_of_mos > 0',
                    F'	scw RP1869:0',
                    F'fi',
                    F'',
                    F'#### 05/31/2023 v8  # 23.Q2 PMI Based PDCCH BF - Only for N41',
                    F'scw RP1988:7,RP1810:2,RP1377:45',
                    F'',
                    F'#### 23.Q2 MU-MIMO 16 layers - Only for N41',
                    F'scw RP146:4,RP1459:4,RP1545:4',
                    F'',
                    F'#### 23.Q2 remove the 3.2Gbps Limitation for N41 BB',
                    F'scw RP1911:1',
                    F'',
                    F'scg',
                    F'',
                    F'',
                ],
                'lte': [
                    F'scg',
                    F'scw 83:0,869:0,2095:0,2123:0,145:1,2959:0,4467:0,L5319:1', F'',

                    F'#### CATM HY58469',
                    F'get SystemFunctions=1,Lm=1,FeatureState=CXC4012359$ featureState$ ^1',
                    F'if $nr_of_mos > 0',
                    F'   scw L4911:1',
                    F'fi', F'',

                    F'if $mibprefix ~ Syosset',
                    F'   scw 1449:7',
                    F'else',
                    F'   scw 1449:4',
                    F'fi', F'',

                    F'if $excalibur != 1',
                    F'   scw 1757:112',
                    F'fi', F'',
                ],
                'l41': [
                    F'scg',
                    F'#### additions: 22Q2 SW Relese',
                    F'## NO SC defined on 23Q2 on L41 TDD Cells',
                    F'',
                ],
                'feature_lte_all': [
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010319$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010320$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010609$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010613$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010616$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010618$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010620$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010717$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010723$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010770$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010856$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010912$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010949$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010956$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010959$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010960$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010961$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010962$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010963$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010964$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010967$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010974$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010990$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011011$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011033$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011034$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011050$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011055$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011056$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011059$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011060$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011061$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011062$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011064$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011067$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011069$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011074$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011075$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011157$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011163$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011183$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011245$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011251$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011252$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011255$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011317$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011319$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011327$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011345$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011356$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011366$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011370$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011373$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011376$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011378$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011427$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011443$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011444$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011476$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011477$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011479$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011482$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011485$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011515$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011554$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011559$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011666$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011667$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011711$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011714$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011807$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011811$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011813$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011815$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011820$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011823$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011838$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011918$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011937$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011938$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011939$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011946$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011969$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011980$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011999$ featureState 0',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012003$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012018$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012036$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012070$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012079$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012097$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012259$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012260$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012271$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012324$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012371$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012381$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012385$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012485$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012504$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012563$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4040008$ featureState 1',
                    F'',
                    F'### FDD/TDD 22Q4 Addition',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012578$ featureState 1',
                    F'### 22Q4 addition - Enable NR Service-Adaptive Link Adaptation Feature ',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012637$ featureState 1',
                    F'',
                    F'',
                    F'',
                ],
                'feature_lte_fdd': [
                    F'####:---> LTE FDD Features  <---:####',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012344 featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011929 featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012081$ featureState 1',
                    F'//set SystemFunctions=1,Lm=1,FeatureState=CXC4011996$ featureState 0',
                    F'//set SystemFunctions=1,Lm=1,FeatureState=CXC4012157$ featureState 0',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010841$ featureState 0',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010973$ featureState 0',
                    F'//set SystemFunctions=1,Lm=1,FeatureState=CXC4012257$ featureState 0',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012218$ featureState 1',
                    F'//set SystemFunctions=1,Lm=1,FeatureState=CXC4011973$ featureState 0',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011253$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011914$ featureState 1',
                    F'//set SystemFunctions=1,Lm=1,FeatureState=CXC4040009$ featureState 0',
                    F'',
                    F'',
                    F'//Elastic RAN',
                    F'//set SystemFunctions=1,Lm=1,FeatureState=CXC4012034$ featureState 1',
                    F'//Mixed Mode Baseband LTE',
                    F'//set SystemFunctions=1,Lm=1,FeatureState=CXC4012015$ featureState 1',
                    F'//RAN Grand Master',
                    F'//set SystemFunctions=1,Lm=1,FeatureState=CXC4011710$ featureState 1',
                    F'//Air Interface Load Generator',
                    F'//set SystemFunctions=1,Lm=1,FeatureState=CXC4010955$ featureState 0',
                    F'//Pucch OverDimensioning',
                    F'//set SystemFunctions=1,Lm=1,FeatureState=CXC4010980$ featureState 0',
                    F'',
                    F'//4x4 Quad Antenna Downlink',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011667$ featureState 1',
                    F'//Advanced Differentiation For Resource Fair Scheduling',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011967$ featureState 1',
                    F'//Antenna System Monitoring',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011422$ featureState 1',
                    F'',
                    F'',
                ],
                'feature_lte_tdd': [
                    F'####:---> Features for L41 (L2500 - TDD, AAS)  <---:####',
                    F'//set SystemFunctions=1,Lm=1,FeatureState=CXC4012344$ featureState 0',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011929$ featureState 0',
                    F'//set SystemFunctions=1,Lm=1,FeatureState=CXC4012081$ featureState 0',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011996$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012157$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010841$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4010973$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012257$ featureState 1',
                    F'//set SystemFunctions=1,Lm=1,FeatureState=CXC4012218$ featureState 0',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011973$ featureState 1',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011253$ featureState 0',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4011914$ featureState 0',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4040009$ featureState 1',
                    F'',
                    F'',
                    F'//IEEE 1588 Boundary Clock',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4040018$ featureState 1',
                    F'//ASGH-Based A/B Testing Framework',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012356$ featureState 1',
                    F'//ASGH Performance Package',
                    F'set SystemFunctions=1,Lm=1,FeatureState=CXC4012199$ featureState 1',
                    F'',
                ],
            },
        }

        return sc_feature_dict.get(sw, {}).get(script_type, ['!!!! ERROR: Need to Check SW and SC_Feature Dict on Tool!!!'])
