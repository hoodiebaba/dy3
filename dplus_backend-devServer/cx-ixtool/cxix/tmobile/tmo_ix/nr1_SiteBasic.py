from xml.dom.minidom import Document
from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class nr1_SiteBasic(tmo_xml_base):
    def initialize_var(self):
        if self.gnbdata.get('equ_change') and not self.gnbdata.get('mmbb'):
            self.gnbdata["SB_File"] = F'{self.__class__.__name__}_{self.node}.xml'
            self.relative_path = [self.node, self.gnbdata["SB_File"]]
            hello_elem = self.rcp_msg_capabilities()
            closing_elem = self.rcp_msg_close()
            msgs = [self.site_basic_msg1(self.gnbdata), self.site_basic_msg2(self.gnbdata), self.site_basic_msg3(), self.site_basic_msg4(self.gnbdata)]
            for msg in msgs: self.script_elements.extend([hello_elem, msg, closing_elem])

    def site_basic_msg3(self):
        tmp_dict = {'managedElementId': 1, 'SystemFunctions': {'systemFunctionsId': 1}, 'Equipment': {'equipmentId': 1}, 'Transport': {'transportId': 1}}
        sb_nr = self.get_sb_msg3_info(nodedata=self.gnbdata)
        sb_lte = self.get_sb_msg3_info(nodedata=self.enbdata)
        sb = sb_nr
        tmp_dict['SystemFunctions']['SecM'] = sb.get('secm')
        tmp_dict['SystemFunctions']['SysM'] = sb.get('sysm')
        tmp_dict['Equipment']['FieldReplaceableUnit'] = sb.get('fru')
        tmp_dict['Transport']['EthernetPort'] = sb.get('ethernetport')
        tmp_dict['Transport']['VlanPort'] = [sb.get('oam_vlan'), sb.get('barrer_vlan')]
        tmp_dict['Transport']['Router'] = [sb.get('oam_router'), sb.get('barrer_router')]
        # if (self.enbdata.get("mmbb", "") == True) and (self.enbdata.get('lte_plength', "") != '32'):
        #     tmp_dict['Transport']['VlanPort'] = [sb.get('oam_vlan'), sb.get('barrer_vlan'). sb_lte.get('barrer_vlan')]
        #     tmp_dict['Transport']['Router'] = [sb.get('oam_router'), sb.get('barrer_router')]
        #     tmp_dict['Transport']['Bridge'] = [sb_lte.get('bridge')]

        if self.enbdata.get("mmbb", False):
            if self.enbdata.get('lte_plength', "") != '32' and self.gnbdata.get('lte_plength', "") != '32':
                tmp_dict['Transport']['VlanPort'] = [sb.get('oam_vlan'), sb.get('barrer_vlan'), sb_lte.get('barrer_vlan')]
                tmp_dict['Transport']['Router'] = [sb.get('oam_router'), sb.get('barrer_router')]
                tmp_dict['Transport']['Bridge'] = [sb_lte.get('bridge')]
            elif self.enbdata.get('lte_plength', "") != '32' and self.gnbdata.get('lte_plength', "") == '32':
                tmp_dict['Transport']['VlanPort'] = [sb_lte.get('oam_vlan'), sb_lte.get('barrer_vlan')]
                tmp_dict['Transport']['Router'] = [sb_lte.get('oam_router'), sb_lte.get('barrer_router')]
            elif self.enbdata.get('lte_plength', "") == '32' and self.gnbdata.get('lte_plength', "") != '32':
                tmp_dict['Transport']['VlanPort'] = [sb.get('oam_vlan'), sb.get('barrer_vlan')]
                tmp_dict['Transport']['Router'] = [sb.get('oam_router'), sb.get('barrer_router')]

        doc, config = self.main_rcp_msg_start('3')
        config.appendChild(self.mo_add_form_dict_xml(tmp_dict, 'ManagedElement', change_me=False))
        for aa in doc.getElementsByTagName("cleartext"): aa.firstChild.nodeValue = ''
        for aa in doc.getElementsByTagName("loopback"): aa.firstChild.nodeValue = ''
        return doc
    
    def writexml(self):
        if len(self.script_elements) > 0:
            with open(self.script_file, 'w') as f:
                for index, elem in enumerate(self.script_elements):
                    outstr = elem.toprettyxml(encoding='UTF-8', indent='  ').decode('utf-8')
                    if index % 3 != 0: outstr = outstr.replace('<?xml version="1.0" encoding="UTF-8"?>', '')
                    f.write(outstr.strip())
                    f.write('\n]]>]]>\n')

    def rcp_msg_capabilities(self):
        doc = Document()
        mo1 = doc.createElement('hello')
        mo1.setAttribute('xmlns', 'urn:ietf:params:xml:ns:netconf:base:1.0')
        doc.appendChild(mo1)
        mo1.appendChild(self.mo_add_form_dict_xml({'capability': ['urn:ietf:params:netconf:base:1.0']}, 'capabilities', change_me=False))
        return doc
