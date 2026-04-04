import copy
from .att_xml_base import att_xml_base


class nr_74_gnb_para(att_xml_base):
    def create_rpc_msg(self):
        if self.no_eq_change_with_dcgk_flag and self.gnbdata.get('GNBCUUP'): return
        self.mo_dict['GNBCUCP_mos'] = {'managedElementId': self.node, 'GNBCUCPFunction': {
            'gNBCUCPFunctionId': '1',
            'NRNetwork': {'attributes': {'xc:operation': 'create'}, 'nRNetworkId': self.gnbdata['NRNetwork']},
            'EUtraNetwork': {'attributes': {'xc:operation': 'create'}, 'eUtraNetworkId': self.gnbdata['EUtraNetwork']},
        }}
        self.mo_dict['gnb_mos'] = {
            'managedElementId': self.node,
            'GNBCUCPFunction': {'gNBCUCPFunctionId': '1'},
            'GNBCUUPFunction': {'gNBCUUPFunctionId': '1'},
            'GNBDUFunction': {'gNBDUFunctionId': '1'},
        }
        tmp_dict = {
            'GNBCUCP': {
                'AnrFunction': {'AnrFunctionNR': {}}, # create_mo
                'AdmissionControl': {'AdmissionLimit': {}, 'AdmissionPriority': {'AdmissionPriorityUeCfg': {}}},
                'CarrierAggregation': {'CaCellProfile': {'CaCellProfileUeCfg': {}}},
                # 'EUtraNetwork': {},
                'IntraFreqMC': {
                    'IntraFreqMCCellProfile': {'IntraFreqMCCellProfileUeCfg': {}},
                    'IntraFreqMCFreqRelProfile': {'IntraFreqMCFreqRelProfileUeCfg': {}},
                },
                'Mcfb': {'McfbCellProfile': {'McfbCellProfileUeCfg': {}}},
                'Mcpc': {
                    'McpcPCellEUtranFreqRelProfile': {'McpcPCellEUtranFreqRelProfileUeCfg': {}},
                    'McpcPCellNrFreqRelProfile': {'McpcPCellNrFreqRelProfileUeCfg': {}},
                    'McpcPCellProfile': {'McpcPCellProfileUeCfg': {}},
                    'McpcPSCellNrFreqRelProfile': {'McpcPSCellNrFreqRelProfileUeCfg': {}},
                    'McpcPSCellProfile': {'McpcPSCellProfileUeCfg': {}},
                },
                'Mdt': {'MdtCellProfile': {'MdtCellProfileUeCfg': {}}},
                # 'NRNetwork': {},
                'NrdcControl': {'NrdcMnCellProfile': {'NrdcMnCellProfileUeCfg': {}}},
                'NrdcSnTermination': {'NrdcSnTerminationUeCfg': {}},
                'QciProfileEndcConfigExt': {},
                'SecurityHandling': {},
                'TrafficOffload': {
                    # 'OffloadCellProfile': {'OffloadCellProfileUeCfg': {}},
                    'OffloadEUtranFreqRelProfile': {'OffloadEUtranFreqRelProfileUeCfg': {}},
                    'OffloadNrFreqRelProfile': {'OffloadNrFreqRelProfileUeCfg': {}},
                },
                'TrafficSteering': {
                    'TrStPSCellProfile': {'TrStPSCellProfileUeCfg': {}},
                    'TrStSaCellProfile': {'TrStSaCellProfileUeCfg': {}},
                    'TrStSaEUtranFreqRelProfile': {'TrStSaEUtranFreqRelProfileUeCfg': {}},
                    'TrStSaNrFreqRelProfile': {'TrStSaNrFreqRelProfileUeCfg': {}}
                },
                'UeCC': {
                    'CapabilityHandling': {'CapabilityHandlingUeCfg': {}},
                    'InactivityProfile': {'InactivityProfileUeCfg': {}},
                    'Rohc': {'RohcUeCfg': {}},
                    'Rrc': {'RrcUeCfg': {}},
                    'RrcInactiveProfile': {'RrcInactiveProfileUeCfg': {}},
                    'UaiProfile': {'UaiProfileUeCfg': {}},
                },
                'UeMC': {
                    'UeMCCellProfile': {},
                    'UeMCEUtranFreqRelProfile': {'UeMCEUtranFreqRelProfileUeCfg': {}},
                    'UeMCNrFreqRelProfile': {'UeMCNrFreqRelProfileUeCfg': {}},
                },
                'UeGroupSelection': {
                    'PrefUeGroupSelectionProfile': {}, 'UeAdmissionGroupDefinition': {}, 'UeGroupSelectionProfile': {},
                    'UeMobilityGroupDefinition': {}, 'UeServiceGroupDefinition': {},
                },
                # 'CUCP5qiTable': {'CUCP5qi': {}},
            },

            'GNBCUUP': {
                'GtpuSupervision': {'GtpuSupervisionProfile': {}},
                'X2UTermination': {},
                # 'CUUP5qiTable': {'CUUP5qi': {}}
            },
            'GNBDU': {
                'AdmissionControl': {},
                'DUQos': {'ExtCaPriority': {}},
                'DUQosModifier': {'DUModified5qi': {'DUModified5qiUeCfg': {}}},
                'NRSynchronization': {},
                'Paging': {},
                'Rrc': {},
                'RadioBearerTable': {'DataRadioBearer': {}, 'SignalingRadioBearer': {}},
                'BWPSet': {'BWPSetUeCfg': {'BWPSetCfg': {}}, 'DynPowerOpt': {}},
                'BWP': {},
                'UeCC': {
                    'Bsr': {'BsrUeCfg': {}},
                    'ConfiguredGrant': {'ConfiguredGrantUeCfg': {}},
                    'DrxProfile': {'DrxProfileUeCfg': {'PuschRepRel16Drx': {}}},
                    'Harq': {'HarqUeCfg': {}},
                    'LinkAdaptation': {'LinkAdaptationUeCfg': {'DlLinkAdaptation': {}, 'PdcchLinkAdaptation': {}, 'UlLinkAdaptation': {}}},
                    'PowerControl': {'PowerControlUeCfg': {}},
                    'Prescheduling': {'PreschedulingUeCfg': {}},
                    'PuschRep': {'PuschRepUeCfg': {}},
                    'RadioLinkControl': {'DrbRlc': {'DrbRlcUeCfg': {}}},
                    'RimOffload': {'RimOffloadUeCfg': {}},
                    'SchedulingProfile': {
                        'DlDelayBasedPriority': {}, 'DlRateBasedPriority': {}, 'UlDelayBasedPriority': {}, 'UlRateBasedPriority': {}
                    },
                    'SoftAcAssist': {'SoftAcAssistUeCfg': {}},
                    'SrHandling': {'SrHandlingUeCfg': {}},
                    'UeBb': {'UeBbProfile': {'UeBbProfileUeCfg': {}}},
                    'UlWfPortSwitch': {'UlWfPortSwitchUeCfg': {}},
                },
                'UeCA': {'CaSCellHandling': {'CaSCellHandlingUeCfg': {}}},
                # 'DU5qiTable': {'DU5qi': {}},
            },
        }
        for gnb in ['GNBCUCP', 'GNBCUUP', 'GNBDU']:
            self.motype = gnb
            self.mo_dict['gnb_mos'][f'{gnb}Function'] |= self.get_nr_mos_dict_with_site_parets(tmp_dict.get(gnb), self.gnbdata.get(gnb))

    def get_nr_mos_dict_with_site_parets(self, c_dict=None, p_mo=None, node=None):
        """ :rtype: dict """
        if node is None: node = self.node
        mo_ids = ['1', '2', '3', 'Default', 'Base', 'S1', 'X2', '5qi6', '5qi7', '5qi8', '5qi9', '5qi199']
        create_mo_ids = []
        create_mo = ['AnrFunction', 'AnrFunctionNR', 'SchedulingProfile', 'DrbRlc', 'DrbRlcUeCfg']
        moc_dict = {}
        for moc in c_dict.keys():
            ret_list = []
            mos = self.MoName.objects.filter(moc=moc, software=self.usid.client.software, motype=self.motype)
            if mos.exists():
                for mo in mos:
                    if mo.moid in mo_ids + create_mo_ids:
                        ret_dict = self.get_db_mo_related_parameter(mo)
                        site = self.usid.sites.get(F'site_{node}') if ((node is not None) and (p_mo is not None)) else None
                        site_mo = site.find_mo_ending_with_parent_str_with_id(parent=p_mo, moc=moc, moid=mo.moid) if site else []
                        site_mo = site_mo[0] if len(site_mo) > 0 else None
                        if site_mo: ret_dict |= {_: site.site_extract_data(site_mo).get(_, ret_dict.get(_)) for _ in ret_dict.keys()}
                        if site_mo and (not self.eq_flag): ret_dict = {self.get_moc_id(moc): mo.moid}
                        if mo.moid in create_mo_ids or moc in create_mo: ret_dict['attributes'] = {'xc:operation': 'create'}
                        else: ret_dict['attributes'] = {'xc:operation': 'update'}
                        for _ in c_dict[moc].keys():
                            child_dict = self.get_nr_mos_dict_with_site_parets(c_dict[moc], node, site_mo)
                            if len(child_dict) > 0: ret_dict |= child_dict
                        if len(ret_dict) > 0: ret_list.append(ret_dict.copy())
            if len(ret_list) > 0: moc_dict[moc] = ret_list
        return moc_dict
