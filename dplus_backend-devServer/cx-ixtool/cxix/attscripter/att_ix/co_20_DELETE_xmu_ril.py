import copy
from .att_xml_base import att_xml_base


class co_20_DELETE_xmu_ril(att_xml_base):
    def create_rpc_msg(self):
        #   RiLink Delete
        if self.no_eq_change_with_dcgk_flag and len(self.usid.df_ril.copy().loc[self.usid.df_ril.postsite == self.node].index) > 0:
            iqdata = []
            ril_ids = []
            for mo in self.site.find_mos_with_moc('RiLink'):
                ril_ids.append(mo.split('=')[-1])
                for iq in self.site.site_extract_data(mo).get('reservedBy', []):
                    if ',CpriLinkIqData=' in iq: iqdata.append(iq)
            for mo in list(set(iqdata)):
                mo_id = mo.split('=')[-1]
                self.mo_dict[F'update-NodeSupport=1,CpriLinkIqData={mo_id}'] = {
                    'managedElementId': self.node, 'NodeSupport': {
                        'nodeSupportId': '1', 'CpriLinkIqData': {
                            'attributes': {'xc:operation': 'update'}, 'cpriLinkIqDataId': mo.split('=')[-1],
                            'riLinkRef': {'attributes': {'xc:operation': 'delete'}}}}}
            for mo_id in ril_ids:
                self.mo_dict[F'delete-Equipment=1,RiLink={mo_id}'] = {
                    'managedElementId': self.node,
                    'Equipment': {'equipmentId': '1', 'RiLink': {'attributes': {'xc:operation': 'delete'}, 'riLinkId': mo_id}}}

        #   XMU Delete
        if self.no_eq_change_with_dcgk_flag and len(self.site.site_xmu) != 0:
            row = self.usid.df_xmu.copy().loc[self.usid.df_xmu.postsite == self.node].iloc[0]
            if row.xmu1 is not None and row.flag1 is None:
                self.mo_dict[F'lock-Equipment=1,FieldReplaceableUnit={row.xmu1}'] = {
                    'managedElementId': self.node, 'Equipment': {'equipmentId': '1', 'FieldReplaceableUnit': {
                        'attributes': {'xc:operation': 'update'}, 'fieldReplaceableUnitId': row.xmu1, 'administrativeState': '0 (LOCKED)'}}}
                self.mo_dict[F'delete-Equipment=1,FieldReplaceableUnit={row.xmu1}'] = {'managedElementId': self.node, 'Equipment': {
                    'equipmentId': '1', 'FieldReplaceableUnit': {'attributes': {'xc:operation': 'delete'}, 'fieldReplaceableUnitId': row.xmu1}}}

            if row.xmu2 is not None and row.flag2 is None:
                self.mo_dict[F'lock-Equipment=1,FieldReplaceableUnit={row.xmu2}'] = {
                    'managedElementId': self.node, 'Equipment': {'equipmentId': '1', 'FieldReplaceableUnit': {
                        'attributes': {'xc:operation': 'update'}, 'fieldReplaceableUnitId': row.xmu2, 'administrativeState': '0 (LOCKED)'}}}
                self.mo_dict[F'delete-xmu-FieldReplaceableUnit={row.xmu2}'] = {'managedElementId': self.node, 'Equipment': {
                    'equipmentId': '1', 'FieldReplaceableUnit': {'attributes': {'xc:operation': 'delete'}, 'fieldReplaceableUnitId': row.xmu2}}}
