from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class lte3_SiteInstallation(tmo_xml_base):
    def initialize_var(self):
        if self.enbdata.get('equ_change'):
            self.enbdata["SI_File"] = F'lte_SiteInstallation_{self.node}.xml'
            self.relative_path = [self.node, self.enbdata["SI_File"]]
            self.create_xml_doc()
    
    def create_xml_doc(self):
        rbs_file_mo = self.create_and_add_mo_para_to_xml_doc({}, 'RbsSiteInstallationFile', '')
        format_mo = self.create_elm_with_attr({}, 'Format', '', attr={'revision': 'K'})
        rbs_file_mo.appendChild(format_mo)
        installation_mo = self.create_elm_with_attr({}, 'InstallationData', '',
                attr={'logicalName': self.node, 'tnPort': self.enbdata["TnPort"], 'vlanId': self.enbdata['oam_van']})
        rbs_file_mo.appendChild(installation_mo)
        oam_ip_conf_mo = self.create_elm_with_attr({}, 'OamIpConfigurationData', '',
                attr={'defaultRouter0': self.enbdata['oam_gway'], 'ipAddress': self.enbdata['oam_ip'], 'subnetMask': self.enbdata['oam_mask']})
        installation_mo.appendChild(oam_ip_conf_mo)
        smrs_mo = self.create_elm_with_attr({}, 'SmrsData', '', attr={'summaryFilePath': "", 'address': ""})
        installation_mo.appendChild(smrs_mo)
        self.doc.appendChild(rbs_file_mo)
    
    def writexml(self):
        if self.doc.firstChild is not None:
            self.doc.firstChild.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
            self.doc.firstChild.setAttribute('xsi:noNamespaceSchemaLocation', F'{self.__class__.__name__.split("_")[-1]}.xsd')
            self.doc.writexml(open(self.script_file, 'w'), addindent='  ', newl='\n', encoding='UTF-8')
