from tmobile.tmo_ix.tmo_xml_base import tmo_xml_base


class nr_01c_MMBB_Internal_Routing(tmo_xml_base):
    def initialize_var(self):
        self.relative_path = [F'REMOTE_{self.node}', F'{self.__class__.__name__}_{self.node}.mos']
        if not self.gnbdata.get('mmbb'): return
        elif self.gnbdata.get('nodefunc', None) is not None and self.gnbdata.get('equ_change', True) is False and \
                self.enbdata.get('nodefunc', None) is not None and self.enbdata.get('equ_change', True) is False:
            return
        else:
            self.script_elements.extend([F"""
####:----------------> Pre Check <----------------:####
hget Transport=1,Router=
hget Dst=
hget NextHop=

####:----------------> LTE User Plane on NR VLAN Interface IP <----------------:####
pr Transport=1,Router={self.gnbdata.get("lte", "")},RouteTableIPv4Static=1,Dst=2$
if $nr_of_mos = 0
    crn Transport=1,Router={self.gnbdata.get("lte", "")},RouteTableIPv4Static=1,Dst=2
    dst {self.enbdata.get("lte_ip", "")}/32 
    end
    crn Transport=1,Router={self.gnbdata.get("lte", "")},RouteTableIPv4Static=1,Dst=2,NextHop=1
    address 
    adminDistance 1
    bfdMonitoring false
    discard false
    reference Transport=1,Router={self.enbdata.get("lte", "")}
    end
fi

####:----------------> NR User Plane on LTE VLAN Interface IP <----------------:####
pr Transport=1,Router={self.enbdata.get("lte", "")},RouteTableIPv4Static=1,Dst=2$
if $nr_of_mos = 0
    crn Transport=1,Router={self.enbdata.get("lte", "")},RouteTableIPv4Static=1,Dst=2
    dst {self.gnbdata.get("lte_ip", "")}/32 
    end
    crn Transport=1,Router={self.enbdata.get("lte", "")},RouteTableIPv4Static=1,Dst=2,NextHop=1
    address 
    adminDistance 1
    bfdMonitoring false
    discard false
    reference Transport=1,Router={self.gnbdata.get("lte", "")}
    end
fi

####:----------------> Post Check <----------------:####
hget Transport=1,Router=
hget Dst=
hget NextHop=
        
"""])
