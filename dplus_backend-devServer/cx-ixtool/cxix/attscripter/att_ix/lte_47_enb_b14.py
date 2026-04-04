import copy
from .att_xml_base import att_xml_base


class lte_47_enb_b14(att_xml_base):
    def create_rpc_msg(self):
        if len(self.usid.df_enb_cell.loc[(self.usid.df_enb_cell.freqband == '14')].index) == 0: return
        if (len(self.usid.df_enb_cell.loc[((self.usid.df_enb_cell.addcell) & (self.usid.df_enb_cell.freqband == '14'))].index) == 0) and \
                (len(self.df_enb_cell.loc[(self.df_enb_cell.addcell)].index) == 0): return
        self.motype = 'Lrat'
        self.mo_dict['ENodeBFunction=1,AdmissionControl=1'] = {'managedElementId': self.node, 'ENodeBFunction': {
            'eNodeBFunctionId': '1', 'AdmissionControl': {
                'attributes': {'xc:operation': 'update'}, 'admissionControlId': '1', 'dlAdmDifferentiationThr': '949',
                'lbAtoThresholdLevel1': '55', 'lbAtoThresholdLevel2': '55', 'ulAdmDifferentiationThr': '949', 'diffAdmCtrlFilteringEnabled': 'true',
                'DiffAdmCtrlFilteringProfile': {'attributes': {'xc:operation': 'update'}, 'diffAdmCtrlFilteringProfileId': '1',
                                                'firstPreEmptionSpidSet': ['-1', '3', '4']}}}}

        self.mo_dict['ENodeBFunction=1,MeasCellGroup=1'] = {'managedElementId': self.node, 'ENodeBFunction': {
            'eNodeBFunctionId': '1', 'MeasCellGroup': {'attributes': {'xc:operation': 'update'}, 'measCellGroupId': '1', 'groupPrbUnit': '5'}}}

        if len(self.df_enb_cell.loc[(self.df_enb_cell.freqband == '14')].index) > 0:
            self.mo_dict['ENodeBFunction=1,MeasCellGroup=1']['ENodeBFunction']['MeasCellGroup']['groupId'] = '1'
            self.mo_dict['ENodeBFunction=1,MeasCellGroup=1']['ENodeBFunction']['MeasCellGroup']['plmnList'] = {
                'mcc': '313', 'mnc': '100', 'mncLength': '3'}
        # else: enb_dict['MeasCellGroup'] = {'groupId': '0', 'plmnList': {'attributes': {'xc:operation': 'delete'}}}

        self.mo_dict['ENodeBFunction=1,PtmFunction=1'] = {'managedElementId': self.node, 'ENodeBFunction': {
            'eNodeBFunctionId': '1', 'PtmFunction': {
                'attributes': {'xc:operation': 'update'}, 'ptmFunctionId': '1', 'ptmEnabled': 'true',
                'PtmCellProfile': [
                    {
                        'attributes': {'xc:operation': 'update'}, 'ptmCellProfileId': '1', 'cellType': '0 (PRIORITY)',
                        'PtmAtoConfig': {'attributes': {'xc:operation': 'update'}, 'ptmAtoConfigId': '1', 'minSuccRateThreshold': '50',
                                         'ptmSubscriberGroupRef': ['ENodeBFunction=1,PtmFunction=1,PtmSubscriberGroup=1',
                                                                   'ENodeBFunction=1,PtmFunction=1,PtmSubscriberGroup=2',
                                                                   'ENodeBFunction=1,PtmFunction=1,PtmSubscriberGroup=3']},
                        'PtmIflbConfig': {'attributes': {'xc:operation': 'update'}, 'ptmIflbConfigId': '1', 'stopIncomingIflbThreshold': '65',
                                          'stopOutgoingIflbEnabled': 'false'},
                        'PtmIfoConfig': {'attributes': {'xc:operation': 'update'}, 'ptmIfoConfigId': '1',
                                         'ptmSubscriberGroupRef': ['ENodeBFunction=1,PtmFunction=1,PtmSubscriberGroup=1',
                                                                   'ENodeBFunction=1,PtmFunction=1,PtmSubscriberGroup=2',
                                                                   'ENodeBFunction=1,PtmFunction=1,PtmSubscriberGroup=3']},
                        'PtmResOpUseConfig': {'attributes': {'xc:operation': 'update'}, 'ptmResOpUseConfigId': '1', 'resMsrUsageThreshold': '40',
                                              'resSRatioThreshold': '110', 'unresMsrUsageThreshold': '25', 'unresSRatioThreshold': '90',
                                              'ptmSubscriberGroupRef': 'ENodeBFunction=1,PtmFunction=1,PtmSubscriberGroup=1'},
                        'PtmStmConfig': {'attributes': {'xc:operation': 'update'}, 'ptmStmConfigId': '1', 'inhibitImpInterval': '600',
                                         'ptmSubscriberGroupRef': ''}
                    },
                    {
                        'attributes': {'xc:operation': 'update'}, 'ptmCellProfileId': '2', 'cellType': '1 (NON_PRIORITY)',
                        'PtmAtoConfig': {'attributes': {'xc:operation': 'update'}, 'ptmAtoConfigId': '1', 'minSuccRateThreshold': '50',
                                         'ptmSubscriberGroupRef': ''},
                        'PtmIflbConfig': {'attributes': {'xc:operation': 'update'}, 'ptmIflbConfigId': '1', 'stopIncomingIflbThreshold': '60',
                                          'stopOutgoingIflbEnabled': 'true'},
                        # 'PtmIfoConfig': {'attributes': {'xc:operation': 'update'}, 'ptmIfoConfigId': '1', 'ptmSubscriberGroupRef': ''},
                        'PtmResOpUseConfig': {'attributes': {'xc:operation': 'update'}, 'ptmResOpUseConfigId': '1',
                                              'ptmSubscriberGroupRef': 'ENodeBFunction=1,PtmFunction=1,PtmSubscriberGroup=1',
                                              'resMsrUsageThreshold': '70', 'resSRatioThreshold': '1600', 'unresMsrUsageThreshold': '40',
                                              'unresSRatioThreshold': '0'},
                        'PtmStmConfig': {'attributes': {'xc:operation': 'update'}, 'ptmStmConfigId': '1', 'inhibitImpInterval': '600',
                                         'ptmSubscriberGroupRef': []}
                    }
                ]
            }
        }}
