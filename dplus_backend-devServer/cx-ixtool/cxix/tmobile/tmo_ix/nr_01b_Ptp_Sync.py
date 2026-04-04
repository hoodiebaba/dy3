from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class nr_01b_Ptp_Sync(tmo_xml_base):
    def initialize_var(self):
        self.relative_path = [F'REMOTE_{self.node}', F'{self.__class__.__name__}_{self.node}.mos']
        if (not self.gnbdata.get('mmbb', '')) and ('10G_FULL' in self.gnbdata.get('admOperatingMode', '')):
            self.script_elements.extend(self.ptp_boundaryclock_create())

    def ptp_boundaryclock_create(self):
        return [F"""
####:----------------> Ptp, BoundaryOrdinaryClock, PtpBcOcPort & RadioEquipmentClockReference=4 <----------------:####
lpr Transport=1,Ptp=1
hget RadioEquipmentClockReference priority|encapsulation

cr Transport=1,Ptp=1

crn Transport=1,Ptp=1,BoundaryOrdinaryClock=1
clockType 2
domainNumber 24
priority1 255
priority2 255
ptpProfile 2
end

crn Transport=1,Ptp=1,BoundaryOrdinaryClock=1,PtpBcOcPort=0
administrativeState 1
announceMessageInterval 1
associatedGrandmaster 
asymmetryCompensation 0
dscp 56
durationField 300
localPriority 128
masterOnly false
pBit 7
ptpMulticastAddress 0
ptpPathTimeError 1000
syncMessageInterval -4
transportInterface EthernetPort={self.gnbdata["TnPort"]}
transportVlan
end

crn Transport=1,Synchronization=1,RadioEquipmentClock=1,RadioEquipmentClockReference=4
adminQualityLevel qualityLevelValueOptionI=2,qualityLevelValueOptionII=2,qualityLevelValueOptionIII=1
administrativeState 1
encapsulation Ptp=1,BoundaryOrdinaryClock=1
holdOffTime 1000
priority 8
useQLFrom 1
waitToRestoreTime 60
end

pr Transport=1,Synchronization=1,RadioEquipmentClock=1,RadioEquipmentClockReference=1_2$
if $nr_of_mos != 0
    set Transport=1,Synchronization=1,RadioEquipmentClock=1,RadioEquipmentClockReference=1_2$ priority 4
fi
pr Transport=1,Synchronization=1,RadioEquipmentClock=1,RadioEquipmentClockReference=1_1$
if $nr_of_mos != 0
    set Transport=1,Synchronization=1,RadioEquipmentClock=1,RadioEquipmentClockReference=1_1$ priority 3
fi
pr Transport=1,Synchronization=1,RadioEquipmentClock=1,RadioEquipmentClockReference=1$
if $nr_of_mos != 0
    set Transport=1,Synchronization=1,RadioEquipmentClock=1,RadioEquipmentClockReference=1$ priority 2
fi
pr Transport=1,Synchronization=1,RadioEquipmentClock=1,RadioEquipmentClockReference=4$
if $nr_of_mos != 0
    set Transport=1,Synchronization=1,RadioEquipmentClock=1,RadioEquipmentClockReference=4$ priority 1
fi
set SystemFunctions=1,Lm=1,FeatureState=CXC4040008$ featureState 1

hget RadioEquipmentClockReference priority|encapsulation
lpr Transport=1,Ptp=1
sts
        """]
