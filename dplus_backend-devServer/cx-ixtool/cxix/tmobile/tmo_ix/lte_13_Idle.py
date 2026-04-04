from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class lte_13_Idle(tmo_xml_base):
    def initialize_var(self):
        self.relative_path = [F'REMOTE_{self.node}', F'{self.__class__.__name__}_{self.node}.mos']
        self.script_elements.extend(self.idle_activation())

    def idle_activation(self):
        lines = []
        if self.enbdata.get('idle'):
            lines.extend([F"""
####:----------------> Pre Check <----------------:####
pr Transport=1,TnPort=
get Transport=1,TnPort={self.enbdata.get("idleport")}
get Transport=1,VlanPort=ERAN
get Transport=1,EthernetPort=ERAN
get SystemFunctions=1,Lm=1,FeatureState=CXC4012034$ FeatureState
get ENodeBFunction=1$ eranVlanPortRef
st bblink


####:----------------> IDLE for IDL Port {self.enbdata.get("idleport")} <----------------:####
pr Equipment=1,FieldReplaceableUnit={self.enbdata.get("bbuid")},TnPort={self.enbdata.get("idleport")}$
if $nr_of_mos = 0
    crn Equipment=1,FieldReplaceableUnit={self.enbdata.get("bbuid")},TnPort={self.enbdata.get("idleport")}
    end
fi

pr Transport=1,EthernetPort=ERAN$
if $nr_of_mos = 0
    crn Transport=1,EthernetPort=ERAN
    administrativeState 1
    autoNegEnable false
    admOperatingMode 9
    encapsulation Equipment=1,FieldReplaceableUnit={self.enbdata.get("bbuid")},TnPort={self.enbdata.get("idleport")}
    userLabel {self.enbdata.get("idleport")}
    end
else
    deb Transport=1,EthernetPort=ERAN$
fi

pr Transport=1,VlanPort=ERAN$
if $nr_of_mos = 0
    crn Transport=1,VlanPort=ERAN
    vlanId 4050
    userLabel ERAN
    encapsulation Transport=1,EthernetPort=ERAN
    end
else
    set Transport=1,VlanPort=ERAN$ vlanId 4050
fi

pr ^ENodeBFunction=1$
if $nr_of_mos > 0
    set ENodeBFunction=1$ eranVlanPortRef Transport=1,VlanPort=ERAN
    ## Elastic RAN feature
    set SystemFunctions=1,Lm=1,FeatureState=CXC4012034$ featureState 1
fi

####:----------------> Post Check <----------------:####
pr Transport=1,TnPort=
get Transport=1,TnPort={self.enbdata.get("idleport")}
get Transport=1,VlanPort=ERAN
get Transport=1,EthernetPort=ERAN
get SystemFunctions=1,Lm=1,FeatureState=CXC4012034$ FeatureState
get ENodeBFunction=1$ eranVlanPortRef
st bblink
            
            """])

        return lines
