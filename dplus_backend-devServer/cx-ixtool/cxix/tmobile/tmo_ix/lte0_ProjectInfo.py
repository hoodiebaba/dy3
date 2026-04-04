from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class lte0_ProjectInfo(tmo_xml_base):
    def initialize_var(self):
        if self.enbdata.get('equ_change'):
            self.relative_path = ['ProjectInfo.xml']
            tmp_dict = {'name': self.node, 'description': 'Standard Project', 'creator': self.client.creator}
            project_info_mo = self.mo_add_form_dict_xml(tmp_dict, 'projectInfo')
            self.doc.appendChild(project_info_mo)

    def writexml(self):
        if self.doc.firstChild is not None:
            self.doc.firstChild.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
            self.doc.firstChild.setAttribute('xsi:noNamespaceSchemaLocation', F'{self.__class__.__name__.split("_")[-1]}.xsd')
            self.doc.writexml(open(self.script_file, 'w'), addindent='  ', newl='\n', encoding='UTF-8')
