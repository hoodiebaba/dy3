from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class nr_08_BaseLine(tmo_xml_base):
    def initialize_var(self):
        self.relative_path = [F'REMOTE_{self.node}', F'{self.__class__.__name__}_{self.node}.mos']
        if self.df_gnb_cell.loc[self.df_gnb_cell.addcell].shape[0] > 0:
            self.script_elements.extend(self.activity_check('Pre'))
            self.script_elements.extend(self.bl_start())
            self.script_elements.extend(self.get_lock_cells())
            self.script_elements.extend(self.featurestate_systemconstant())
            self.script_elements.extend(self.parameter_settings())
            self.script_elements.extend(self.get_unlock_cells())
            self.script_elements.extend(self.activity_check('Post'))

    def bl_start(self):
        return [
            F"""
####:----------------> BL Supports for Carrier N71 (N600), N41 (N2500) <----------------:####
####:----------------> BL Revised on 01-27-2022 <----------------:####
####:----------------> Pre Check <----------------:####
pr GNBDUFunction=1,NRCellDU=
if $nr_of_mos = 0
    print  ERROR: No NR cell defined !!!
    l-
    return
fi
lst GNBDUFunction=1,NRCellDU=(M|N)
if $nr_of_mos > 0
    print ERROR: mmWave Node does not supporting SA !!!
    l-
    return
fi

####:----------------> Logic <----------------:####
pv $mibprefix
$BBType = None
get ^FieldReplaceableUnit= ^productData$ Baseband.*6630
if $nr_of_mos > 0
    $BBType = BB6630
fi
get ^FieldReplaceableUnit= ^productData$ Baseband.*6648
if $nr_of_mos > 0
    $BBType = BB6648
fi
get ^FieldReplaceableUnit= ^productData$ Processor.*6651
if $nr_of_mos > 0
    $BBType = BB6651
fi
            
get ^FieldReplaceableUnit= ^productData$ Baseband.*5216
if $nr_of_mos > 0
    $BBType = BB5216
fi

$n41_flag = 0
$n71_flag = 0
$n2_flag = 0
$fdd_flag = 0
$tdd_flag = 0
pr GNBDUFunction=1,NRCellDU=A
if $nr_of_mos > 0
    $n41_flag = 1
fi
pr GNBDUFunction=1,NRCellDU=K
if $nr_of_mos > 0
    $n71_flag = 1
fi
pr GNBDUFunction=1,NRCellDU=J
if $nr_of_mos > 0
    $n2_flag = 1
fi
pr ENodeBFunction=1,EUtranCellFDD=
if $nr_of_mos > 0
    $fdd_flag = 1
fi
pr ENodeBFunction=1,EUtranCellTDD=
if $nr_of_mos > 0
    $tdd_flag = 1
fi

$excalibur = 0
if {" || ".join(["$mibprefix ~ " + _ for _ in self.market_dict.get("excalibur")])}
   $excalibur = 1
fi
',
func getsectorval
    $var6 = $6
endfunc
        """]
    
    def featurestate_systemconstant(self):
        lines = []
        # System Constant & Feature
        lines.extend([F'####:----------------> System Constant & Feature <----------------:####'])
        lines.extend(self.get_sc_features_dict(sw=self.usid.client.software.swname[:9], script_type='feature_nr_all'))
        if self.df_gnb_cell.loc[(self.df_gnb_cell.addcell & self.df_gnb_cell.postcell.str.contains('^K'))].shape[0] > 0:
            lines.extend(self.get_sc_features_dict(sw=self.usid.client.software.swname[:9], script_type='n071'))
        if self.df_gnb_cell.loc[(self.df_gnb_cell.addcell & self.df_gnb_cell.postcell.str.contains('^A'))].shape[0] > 0:
            lines.extend(self.get_sc_features_dict(sw=self.usid.client.software.swname[:9], script_type='n041'))
        if self.df_gnb_cell.loc[(self.df_gnb_cell.addcell & self.df_gnb_cell.postcell.str.contains('^J'))].shape[0] > 0:
            lines.extend(self.get_sc_features_dict(sw=self.usid.client.software.swname[:9], script_type='n002'))
        return lines

    def parameter_settings(self):
        lines = ['']
        lines.extend(self.get_vswr_script())
        lines.extend(self.get_node_certificate())
        lines.extend([F"""
####:----------------> Parameter Setting <----------------:####

####:----------------> nrTAC Update <----------------:####
get GNBDUFunction=1,NRCellDU= nRTAC > $nrtac
if $nrtac < 65535
    d2h $nrtac > $nrtac
    $nrtac = $nrtac00 -s 0x
    h2d $nrtac > $nrtac
    set GNBDUFunction=1,NRCellDU= nrTAC $nrtac
    set GNBDUFunction=1,NRCellDU=.*,AdditionalPLMNInfo=1$ nRTAC $nrtac
fi
unset $nrtac

####:----------------> Default Parameter Setting <----------------:####
set BrM=1,BrmBackupManager=1,BrmBackupHousekeeping=1$ maxStoredManualBackups 20
set Fm=1$ heartbeatInterval 100
set SysM=1,OamTrafficClass=1$ dscp 8
set Transport=1,SctpProfile=Node_Internal_F1$ dscp 24

set GNBDUFunction=1,TermPointToGNBCUCP=1$ administrativeState 1
set GNBDUFunction=1,Rrc=1$ t310 2000
set GNBDUFunction=1,Rrc=1$ t319 400
set GNBCUCPFunction=1,QciProfileEndcConfigExt=1$ ulDataSplitThreshold 51200
set GNBCUCPFunction=1,SecurityHandling=1$ cipheringAlgoPrio 2,1
set GNBCUUPFunction=1,CUUP5qiTable=[12],CUUP5qi= dcDlPdcpAggrPrioCg 2
set GNBDUFunction=1,UeCC=1,DrxProfile=.*,DrxProfileUeCfg=.* drxEnabled true
set GNBDUFunction=1,NRCellDU= caPerCcFairnessWeightEnabled true
set GNBDUFunction=1,NRCellDU= improvedUlInSparseBwp true


####:----> 20.Q4 EPS Fallback <----:####
pr  GNBCUCPFunction=1,Mcfb=1
if $nr_of_mos = 0
    cr GNBCUCPFunction=1,Mcfb=1
    cr GNBCUCPFunction=1,Mcfb=1,McfbCellProfile=Default
fi
mr nrcellcus
ma nrcellcus GNBCUCPFunction=1,NRCellCU=
for $mo in nrcellcus
    set $mo mcpcPSCellEnabled true
    get $mo ^nRCellCUId$ > $nrcellcuid
    pr GNBCUCPFunction=1,Mcfb=1,McfbCellProfile=$nrcellcuid$
    if $nr_of_mos = 0
        cr GNBCUCPFunction=1,Mcfb=1,McfbCellProfile=$nrcellcuid
        set $mo mcfbCellProfileRef GNBCUCPFunction=1,Mcfb=1,McfbCellProfile=$nrcellcuid
    fi
done
mr nrcellcus
unset $mo
unset $nrcellcuid

ld McfbCellProfileUeCfg=Base
set GNBCUCPFunction=1,Mcfb=1$ voiceEpsFbPossible true
set GNBCUCPFunction=1,Mcfb=1,McfbCellProfile=.*,McfbCellProfileUeCfg=Base$ epsFbAtSessionSetup 1
set GNBCUCPFunction=1,Mcfb=1,McfbCellProfile=.*,McfbCellProfileUeCfg=Base$ epsFallbackOperation 2
set GNBCUCPFunction=1,Mcfb=1,McfbCellProfile=.*,McfbCellProfileUeCfg=Base$ epsFallbackOperationEm 1


####:----------------> Band Parameter Setting <----------------:####
####:----------------> N71 (N600) <----------------:####
if $n71_flag = 1
    set GNBDUFunction=1,NRCellDU=K pZeroUePuschOffset256Qam 4
    set GNBDUFunction=1,NRCellDU=K pdcchSymbConfig 1
    set GNBDUFunction=1,NRCellDU=K qRxLevMin -116
    set GNBDUFunction=1,Rrc=1$ n310 20
    set GNBCUCPFunction=1,QciProfileEndcConfigExt=1$ initialUplinkConf 0
    set GNBCUCPFunction=1$ nasInactivityTime 5
    set GNBCUUPFunction=1$ dcDlAggActTime 10
    set GNBCUCPFunction=1,AnrFunction=1,AnrFunctionNR=1,AnrFunctionNRUeCfg=Base anrRsrpThreshold -114
    set GNBDUFunction=1,UeCC=1,Prescheduling=1,PreschedulingUeCfg=Base preschedulingUeMode 0
fi

####:----------------> N2 (N1900) <----------------:####
if $n2_flag = 1
    set GNBDUFunction=1,NRCellDU=J pZeroUePuschOffset256Qam 4
    set GNBDUFunction=1,NRCellDU=J pdcchSymbConfig 1
    set GNBDUFunction=1,NRCellDU=J qRxLevMin -120
    set GNBDUFunction=1,NRCellDU=J pdcchLaBfGainFraction 0
    set GNBDUFunction=1,Rrc=1$ n310 20
    set GNBCUCPFunction=1,QciProfileEndcConfigExt=1$ initialUplinkConf 0
    set GNBCUCPFunction=1$ nasInactivityTime 10
    set GNBCUUPFunction=1$ dcDlAggActTime 1
    set GNBDUFunction=1,UeCC=1,Prescheduling=1,PreschedulingUeCfg=Base preschedulingUeMode 0
fi

####:----------------> N41 (N2500) <----------------:####
func n41_settings
    mr nrcelldus
    ma nrcelldus GNBDUFunction=1,NRCellDU=A
    for $mo in nrcelldus
        get $mo nRSectorCarrierRef > $nrseccarrier
        getsectorval $nrseccarrier
        $nrseccarrier = $var6
        pr $nrseccarrier,CommonBeamforming=1$
        if $nr_of_mos > 0
            set $nrseccarrier,CommonBeamforming=1$ coverageShape 1
            set $nrseccarrier,CommonBeamforming=1$ digitalTilt 0
        fi
    done
    mr nrcelldus
    unset $mo
    unset $nrseccarrier
    unset $var6
endfunc
if $n41_flag = 1
    n41_settings
    set GNBCUUPFunction=1$ dcDlPdcpInitialScgRate 100
    set GNBCUCPFunction=1$ nasInactivityTime 10
    set GNBCUUPFunction=1$ dcDlAggActTime 1
    set GNBDUFunction=1,Rrc=1$ n310 10
    set GNBCUCPFunction=1,QciProfileEndcConfigExt=1$ initialUplinkConf 1
    set GNBCUUPFunction=1,CUUP5qiTable=1,CUUP5qi=[6789]$ estimatedE2ERTT 100
    set GNBCUUPFunction=1,CUUP5qiTable=1,CUUP5qi=128$ estimatedE2ERTT 100
    set GNBDUFunction=1,UeCC=1,Prescheduling=1,PreschedulingUeCfg=Base preschedulingUeMode 1
    
    set GNBDUFunction=1,NRCellDU=A qRxLevMin -118
    set GNBDUFunction=1,NRCellDU=A pZeroUePuschOffset256Qam 2
    set GNBDUFunction=1,NRCellDU=A tddSpecialSlotPattern 1
    set GNBDUFunction=1,NRCellDU=A tddUlDlPattern 1
    set GNBDUFunction=1,NRCellDU=A nrLteCoexistence true
    set GNBDUFunction=1,NRCellDU=A tddLteCoexistence true
    set GNBDUFunction=1,NRCellDU=A pdcchLaBfGainFraction 75
    set GNBDUFunction=1,NRCellDU=A advancedDlSuMimoEnabled true
    set GNBDUFunction=1,NRCellDU=A maxNoOfAdvancedDlMuMimoLayers 16
    
    set1x GNBDUFunction=1,NRCellDU=A csiRsConfig16P csiRsControl16Ports=0,i11Restriction=,i12Restriction=
    set1x GNBDUFunction=1,NRCellDU=A csiRsConfig2P csiRsControl2Ports=0,aRestriction=
    set1x GNBDUFunction=1,NRCellDU=A csiRsConfig32P csiRsControl32Ports=1,i11Restriction=FFFFFFFF,i12Restriction=FF
    set1x GNBDUFunction=1,NRCellDU=A csiRsConfig4P csiRsControl4Ports=0,i11Restriction=
    set1x GNBDUFunction=1,NRCellDU=A csiRsConfig8P csiRsControl8Ports=1,i11Restriction=FFFF,i12Restriction=
    set1x GNBDUFunction=1,NRCellDU=A dlMaxMuMimoLayers 8
    set1x GNBDUFunction=1,NRCellDU=A subCarrierSpacing 30
    set1x GNBDUFunction=1,NRCellDU=A ssbSubCarrierSpacing 30
    commit
fi


####:----------------> 22Q3 & 22Q4 Update <----------------:####
#### Create UeBBProfile for UEs with voice data bearer
pr GNBDUFunction=1,UeCC=1,LinkAdaptation=1,LinkAdaptationUeCfg=VoNR$
if $nr_of_mos = 0
    crn GNBDUFunction=1,UeCC=1,LinkAdaptation=1,LinkAdaptationUeCfg=VoNR
    dlMaxBitrate -1
    dlMcsTable 1
    linkAdaptationUeMode 3
    ulMcsTable 1
    end
else
    set GNBDUFunction=1,UeCC=1,LinkAdaptation=1,LinkAdaptationUeCfg=VoNR$ dlMaxBitrate -1
    set GNBDUFunction=1,UeCC=1,LinkAdaptation=1,LinkAdaptationUeCfg=VoNR$ dlMcsTable 1
    set GNBDUFunction=1,UeCC=1,LinkAdaptation=1,LinkAdaptationUeCfg=VoNR$ linkAdaptationUeMode 3
    set GNBDUFunction=1,UeCC=1,LinkAdaptation=1,LinkAdaptationUeCfg=VoNR$ ulMcsTable 1
fi

set GNBDUFunction=1,UeCC=1,Harq=1,HarqUeCfg=Base$ dlHarqMode 2
pr GNBDUFunction=1,UeCC=1,Harq=1,HarqUeCfg=VoNR$
if $nr_of_mos = 0
    crn GNBDUFunction=1,UeCC=1,Harq=1,HarqUeCfg=VoNR
    dlHarqMode 1
    ulHarqMode 1
    end
else
    set GNBDUFunction=1,UeCC=1,Harq=1,HarqUeCfg=VoNR$ dlHarqMode 1
    set GNBDUFunction=1,UeCC=1,Harq=1,HarqUeCfg=VoNR$ ulHarqMode 1
fi

pr GNBDUFunction=1,UeCC=1,Bsr=1,BsrUeCfg=VoNR$
if $nr_of_mos = 0
    crn GNBDUFunction=1,UeCC=1,Bsr=1,BsrUeCfg=VoNR
    reTxBsrTimer 1280
    srGrantSize 32
    end
else
    set GNBDUFunction=1,UeCC=1,Bsr=1,BsrUeCfg=VoNR$ reTxBsrTimer 1280
    set GNBDUFunction=1,UeCC=1,Bsr=1,BsrUeCfg=VoNR$ srGrantSize 32
fi

pr GNBDUFunction=1,UeCC=1,UeBb=1,UeBbProfile=Default$
if $nr_of_mos = 0
    crn GNBDUFunction=1,UeCC=1,UeBb=1,UeBbProfile=Default
    ueConfGroupType 1
    end
else
    set GNBDUFunction=1,UeCC=1,UeBb=1,UeBbProfile=Default$ ueConfGroupType 1
fi

pr GNBDUFunction=1,UeCC=1,UeBb=1,UeBbProfile=Default,UeBbProfileUeCfg=VoNR$
if $nr_of_mos = 0
    crn GNBDUFunction=1,UeCC=1,UeBb=1,UeBbProfile=Default,UeBbProfileUeCfg=VoNR
    bsrUeCfgRef GNBDUFunction=1,UeCC=1,Bsr=1,BsrUeCfg=VoNR
    harqUeCfgRef GNBDUFunction=1,UeCC=1,Harq=1,HarqUeCfg=VoNR
    linkAdaptationUeCfgRef GNBDUFunction=1,UeCC=1,LinkAdaptation=1,LinkAdaptationUeCfg=VoNR
    ueGroupList 1
    end
else
    set GNBDUFunction=1,UeCC=1,UeBb=1,UeBbProfile=Default,UeBbProfileUeCfg=VoNR$ bsrUeCfgRef GNBDUFunction=1,UeCC=1,Bsr=1,BsrUeCfg=VoNR
    set GNBDUFunction=1,UeCC=1,UeBb=1,UeBbProfile=Default,UeBbProfileUeCfg=VoNR$ harqUeCfgRef GNBDUFunction=1,UeCC=1,Harq=1,HarqUeCfg=VoNR
    set GNBDUFunction=1,UeCC=1,UeBb=1,UeBbProfile=Default,UeBbProfileUeCfg=VoNR$ linkAdaptationUeCfgRef GNBDUFunction=1,UeCC=1,LinkAdaptation=1,LinkAdaptationUeCfg=VoNR
    set GNBDUFunction=1,UeCC=1,UeBb=1,UeBbProfile=Default,UeBbProfileUeCfg=VoNR$ ueGroupList 1
fi

lt all
set GNBDUFunction=1,UeCC=1,LinkAdaptation=1,LinkAdaptationUeCfg=VoNR,UlLinkAdaptation=1$ ulMaxMcsIndex 16
set GNBDUFunction=1,UeCC=1,LinkAdaptation=1,LinkAdaptationUeCfg=VoNR$ ulMcsTable 0
set GNBDUFunction=1,UeCC=1,LinkAdaptation=1,LinkAdaptationUeCfg=Base$ linkAdaptationUeMode 3

set GNBDUFunction=1,UeCC=1,Prescheduling=1,PreschedulingUeCfg=Base preschedulingDataSize 108

####:----------------> 22Q3 addition - NRCA Data Aware Carrier Management <----------------:####
func n41_n2_22Q4_settings
    pr GNBCUCPFunction=1,UeGroupSelection=1$
    if $nr_of_mos = 0
        cr GNBCUCPFunction=1,UeGroupSelection=1
    fi
    pr GNBCUCPFunction=1,UeGroupSelection=1,UeGroupSelectionProfile=2$
    if $nr_of_mos = 0
        crn GNBCUCPFunction=1,UeGroupSelection=1,UeGroupSelectionProfile=2
        ueGroupId 2
        ueGroupPriority 15
        selectionCriteria 5qi>=6
        end
    else
        set GNBCUCPFunction=1,UeGroupSelection=1,UeGroupSelectionProfile=2$ ueGroupId 2
        set GNBCUCPFunction=1,UeGroupSelection=1,UeGroupSelectionProfile=2$ ueGroupPriority 15
        set GNBCUCPFunction=1,UeGroupSelection=1,UeGroupSelectionProfile=2$ selectionCriteria 5qi>=6
    fi

    pr GNBDUFunction=1,UeCA=1$
    if $nr_of_mos = 0
        cr GNBDUFunction=1,UeCA=1
    fi
    pr GNBDUFunction=1,UeCA=1,CaSCellHandling=1$
    if $nr_of_mos = 0
        cr GNBDUFunction=1,UeCA=1,CaSCellHandling=1
    fi
    pr GNBDUFunction=1,UeCA=1,CaSCellHandling=1,CaSCellHandlingUeCfg=SA
    if $nr_of_mos = 0
        crn GNBDUFunction=1,UeCA=1,CaSCellHandling=1,CaSCellHandlingUeCfg=SA
        sCellActDeactDataThres 100
        sCellActDeactDataThresHyst 20
        sCellDeactDelayTimer 80
        sCellActProhibitTimer 10
        sCellDeactProhibitTimer 250
        ueGroupList 2 1
        end
    else
        set GNBDUFunction=1,UeCA=1,CaSCellHandling=1,CaSCellHandlingUeCfg=SA$ sCellActDeactDataThresHyst 20
        set GNBDUFunction=1,UeCA=1,CaSCellHandling=1,CaSCellHandlingUeCfg=SA$ sCellDeactDelayTimer 80
        set GNBDUFunction=1,UeCA=1,CaSCellHandling=1,CaSCellHandlingUeCfg=SA$ sCellDeactProhibitTimer 250
    fi
    pr GNBDUFunction=1,UeCA=1,CaSCellHandling=1,CaSCellHandlingUeCfg=NSA
    if $nr_of_mos = 0
        crn GNBDUFunction=1,UeCA=1,CaSCellHandling=1,CaSCellHandlingUeCfg=NSA
        sCellActDeactDataThres 100
        sCellActDeactDataThresHyst 20
        sCellDeactDelayTimer 80
        sCellActProhibitTimer 10
        sCellDeactProhibitTimer 250
        ueGroupList 14
        end
    else
        set GNBDUFunction=1,UeCA=1,CaSCellHandling=1,CaSCellHandlingUeCfg=NSA$ sCellActDeactDataThresHyst 20
        set GNBDUFunction=1,UeCA=1,CaSCellHandling=1,CaSCellHandlingUeCfg=NSA$ sCellDeactDelayTimer 80
        set GNBDUFunction=1,UeCA=1,CaSCellHandling=1,CaSCellHandlingUeCfg=NSA$ sCellDeactProhibitTimer 250
    fi
    set GNBDUFunction=1,NRCellDU= caSCellHandlingRef GNBDUFunction=1,UeCA=1,CaSCellHandling=1
endfunc
if $n2_flag = 1 || $n41_flag = 1 
    n41_n2_22Q4_settings
fi

####:----------------> 23.Q2 v9 QoS_SR_handling_correction <----------------:####
pr GNBDUFunction=1,UeCC=1,SrHandling=5QI_5$
if $nr_of_mos == 0
  crn GNBDUFunction=1,UeCC=1,SrHandling=5QI_5
  ueConfGroupType 1
  end
fi
lt SrHandling
lt SrHandlingUeCfg
set GNBDUFunction=1,UeCC=1,SrHandling=5QI_5,SrHandlingUeCfg=Base$ srHandlingMode 1
set GNBDUFunction=1,UeCC=1,SrHandling=default,SrHandlingUeCfg=Base$ srHandlingMode 1
set GNBDUFunction=1,UeCC=1,SrHandling=5QI_5,SrHandlingUeCfg=Base$ conditional5qi 1
set GNBDUFunction=1,DU5qiTable=1,DU5qi=5$ srHandlingRef GNBDUFunction=1,UeCC=1,SrHandling=5QI_5
set GNBDUFunction=1,DU5qiTable=2,DU5qi=5$ srHandlingRef GNBDUFunction=1,UeCC=1,SrHandling=5QI_5

####:----------------> 23.Q3 & 23.Q4 Update <----------------:####
set GNBDUFunction=1,UeCC=1,DrxProfile=Default,DrxProfileUeCfg=VoNR drxRetransmissionTimerUl 16
set GNBCUCPFunction=1,AnrFunction=1 promoteCellRelMobAttThresh 100
set GNBCUCPFunction=1,AnrFunction=1 demoteCellRelMobAttThresh 50

####:----------------> Market Settings <----------------:####


"""])
        return lines

    @staticmethod
    def activity_check(activity):
        return [F"""
####:----------------> {activity} Check <----------------:####
alt
scg
hget SystemFunctions=1,Lm=1,FeatureState= ^description$|^licenseState$|^featureState$
st EUtranCellTDD|EUtranCellFDD|NRCellDU|SctpEndpoint|TermPointToMme|TermPointToAmf
hget GNBDUFunction=1,NRCellDU=.* nrTAC|secondaryCellOnly|cellBarred|cellReservedForOperator|cellReservedForOperator|state
hget ^NRCellDU= ssbFrequencyAutoSelected|ssbFrequency|subCarrierSpacing|ssbsubcarrierspacing|ssbFrequency|'
ssbPeriodicity|ssbDurationAutoSelected|ssbDuration
hget GNBCUCPFunction=1,NRCellCU= transmitSib|mcfbCellProfileRef|nRFrequencyRef
        """]
