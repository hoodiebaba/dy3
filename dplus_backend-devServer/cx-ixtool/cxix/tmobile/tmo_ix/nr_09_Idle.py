from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class nr_09_Idle(tmo_xml_base):
    def initialize_var(self):
        if self.gnbdata.get('idle') and len(self.usid.gnodeb.keys()) > 0:
            self.relative_path = [F'REMOTE_{self.node}', F'{self.__class__.__name__}_{self.node}.mos']
            self.script_elements.extend(self.activity_check(activity_type='PreCheck'))
            self.script_elements.extend(self.idle_activation())
            self.script_elements.extend(self.activity_check(activity_type='PostCheck'))

    def idle_activation(self):
        lines = [F"""
####:----------------> NSA NR CA Enablement, IDL Port {self.gnbdata.get("idleport")} <----------------:####
pr Equipment=1,FieldReplaceableUnit={self.gnbdata.get("bbuid")},TnPort={self.gnbdata["idleport"]}$
if $nr_of_mos = 0
    cr Equipment=1,FieldReplaceableUnit={self.gnbdata.get("bbuid")},TnPort={self.gnbdata["idleport"]}
fi

pr Transport=1,EthernetPort=ERAN$
if $nr_of_mos = 0
crn Transport=1,EthernetPort=ERAN
administrativeState 1
autoNegEnable false
admOperatingMode 9
encapsulation Equipment=1,FieldReplaceableUnit={self.gnbdata.get("bbuid")},TnPort={self.gnbdata.get("idleport")}
userLabel {self.gnbdata.get("idleport")}
end
else
deb Transport=1,EthernetPort=ERAN$
fi

pr Transport=1,VlanPort=ERAN_NR$
if $nr_of_mos = 0
    crn Transport=1,VlanPort=ERAN_NR
    vlanId 4060
    userLabel ERAN_NR
    encapsulation Transport=1,EthernetPort=ERAN
    end
else
    set Transport=1,VlanPort=ERAN_NR$ vlanId 4060
fi

pr ^GNBDUFunction=1$
if $nr_of_mos > 0
    set GNBDUFunction=1$ caVlanPortRef Transport=1,VlanPort=ERAN_NR
    set GNBDUFunction=1,NRCellDU= additionalPucchForCaEnabled true
    set SystemFunctions=1,Lm=1,FeatureState=CXC4012477$ featureState 1
    set SystemFunctions=1,Lm=1,FeatureState=CXC4012478$ featureState 1
fi
"""]
        for gnb in self.usid.gnodeb.keys():
            if gnb == self.node: continue
            if self.usid.gnodeb.get(gnb, {}).get('idle', False):
                lines.extend([F"""
pr GNBDUFunction=1,ExtGNBDUPartnerFunction=1$
if $nr_of_mos = 0
    crn GNBDUFunction=1,ExtGNBDUPartnerFunction=1
    caVlanPortRef Transport=1,VlanPort=ERAN_NR
    gNBDUId 1
    gNBId {self.usid.gnodeb.get(gnb, {}).get("nodeid", "")}
    gNBIdLength {self.usid.gnodeb.get(gnb, {}).get("gnbidlength", "24")}
    end
fi
"""])
        return lines

    @staticmethod
    def activity_check(activity_type=''):
        return [F"""
####:----------------> {activity_type} Check <----------------:####
pr TnPort=
hget Transport=1,VlanPort= encapsulation|vlanId|isTagged|lowLatencySwitching|reservedBy
hget Transport=1,EthernetPort= admOperatingMode|encapsulation|autoNegEnable|reservedBy
get (ENodeB|GNBDU)Function=1|ExtGNBDUPartnerFunction=.* ^eranVlanPortRef$|^eNBId$|^caVlanPortRef$|^gNBId$|^gNBIdLength$|^gNBDUName$
st InterMeLink|EthernetPort|BbLink
hget ^FeatureState=(CXC4012478|CXC4012477)$ ^FeatureState$|^description$|^serviceState$
get ^NRCellRelation= sCellCandidate 1
get ^NRCellRelation= coverageIndicator 3
get ^NRCellRelation= caStatusActive true
"""]
