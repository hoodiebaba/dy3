from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class lte_05_Parameter(tmo_xml_base):
    def initialize_var(self):
        self.relative_path = [F'REMOTE_{self.node}', F'{self.__class__.__name__}_{self.node}.mos']
        self.script_elements.extend(self.default_parameter_basedon_tmo_input())

    def default_parameter_basedon_tmo_input(self):
        lines = [
            '####:----------------> Default Parameter to be Set Accordance with TMO Input for cellReselectionPriority <----------------:####',
            'set ENodeBFunction=1,EUtranCell[FT]DD=.*,UtranFreqRelation= cellReselectionPriority 0',
            'set ENodeBFunction=1,EUtranCell[FT]DD=.*,UtranFreqRelation= cellReselectionPriority 0',
            '',
            '',
            ''
        ]
        return lines
