import copy
from .att_xml_base import att_xml_base


class lte_45_enb_para(att_xml_base):
    def create_rpc_msg(self):
        if self.no_eq_change_with_dcgk_flag and self.enbdata.get('Lrat') is not None: return
        self.systemCreated_list = self.get_systemCreated_list()
        self.motype = 'Lrat'
        enb_dict = {'eNodeBFunctionId': '1'}
        parent_mo = self.enbdata.get("Lrat")
        # parent_mo = '' if self.enbdata.get("Lrat") is None else self.enbdata.get("Lrat")
        childs = self.MoRelation.objects.filter(parent='ENodeBFunction', tag='eNBMO', software=self.usid.client.software)
        for child in childs:
            mos = self.log_append_child_tags(child.child, rel_tag='eNBMO', parent_mo=parent_mo, node=self.node)
            for key in mos: enb_dict[key] = mos[key]
        self.mo_dict['lte_nodeb_para_update'] = {'managedElementId': self.node, 'ENodeBFunction': enb_dict}

    def get_systemCreated_list(self):
        systemCreated = [
            'AdmissionControl', 'AmoFunction', 'AnrFunction', 'AnrFunctionEUtran', 'AnrFunctionGeran', 'AnrFunctionNR', 'AnrFunctionUtran',
            'AnrPciConflictDrxProfile', 'AutoCellCapEstFunction', 'CarrierAggregationFunction', 'AutoSCellMgmFunction', 'BandCombCompression',
            'CellSleepNodeFunction', 'DlComp', 'DrxProfile', 'DynamicBlerTarget', 'EndcProfilePredefined',
            'EricssonLeanCarrierFunction', 'FastCoordinationGroup', 'FlexibleQoSFunction', 'ImeisvTable',
            'IuaProfile', 'LoadBalancingFunction', 'MdtConfiguration', 'LoggedMdt',
            'NodePerformance', 'NonPlannedPciDrxProfile', 'Paging', 'ParameterChangeRequests', 'PmEventService',
            'PreschedProfile', 'PreschedulingProfile', 'PtmFunction', 'PwsCmas',
            'QciTable', 'LogicalChannelGroup', 'QciProfilePredefined', 'SciProfile',
            'RadioBearerTable', 'DataRadioBearer', 'MACConfiguration', 'RlcConfiguration', 'SignalingRadioBearer',
            'Rcs', 'ResourcePartitions', 'RlfProfile', 'Rrc', 'SecurityHandling',
            'PpControlTermination', 'PpControlLink', 'RpUserPlaneTermination', 'RpUserPlaneLink',
            'EUtraNetwork',
        ]
        create_form_enb_mo = [
            'DiffAdmCtrlFilteringProfile', 'AirIfLoadProfile',
            'PtmSubscriberGroup', 'PtmCellProfile', 'PtmAtoConfig', 'PtmIflbConfig', 'PtmIfoConfig', 'PtmResOpUseConfig', 'PtmStmConfig',
            'MeasCellGroup', 'PlmnAbConfProfile',
            'SubscriberGroupProfile', 'SubscriberProfileID', 'HoWhiteList', 'RATFreqPrio',
        ]

        return systemCreated + create_form_enb_mo
