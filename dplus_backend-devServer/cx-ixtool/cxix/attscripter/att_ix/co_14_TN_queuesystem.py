import copy
from .att_xml_base import att_xml_base


class co_14_TN_queuesystem(att_xml_base):
    def create_rpc_msg(self):
        # QueueSystem
        if len(self.enbdata) == 0: return
        if self.no_eq_change_with_dcgk_flag and \
                len(self.site.get_mos_w_end_str(F'Transport=1,EthernetPort={self.enbdata.get("TnPort")},QueueSystem=1')) > 0: return
        eth_port = F'Transport=1,EthernetPort={self.enbdata.get("TnPort")}'
        self.mo_dict['queuesystem_create'] = {
            'managedElementId': self.node,
            'Transport': {
                'transportId': '1',
                'EthernetPort': {
                    'ethernetPortId': self.enbdata.get('TnPort'),
                    'QueueSystem': {
                        'attributes': {'xc:operation': 'create'}, 'queueSystemId': '1',
                        'SchedulerSp': {
                            'attributes': {'xc:operation': 'create'}, 'schedulerSpId': '1', 'order': '0',
                            'QueueTailDrop': [{
                                'attributes': {'xc:operation': 'create'}, 'queueTailDropId': F'{_}',
                                'order': F'{_ - 1}', 'queueSize': {'bytes': '125000'}, 'userLabel': F'QueueTailDrop_{_}'} for _ in range(1, 4)],
                            'SchedulerSp': {
                                'attributes': {'xc:operation': 'create'}, 'schedulerSpId': '2', 'order': '3',
                                'QueueTailDrop': [{
                                    'attributes': {'xc:operation': 'create'}, 'queueTailDropId': F'{_}',
                                    'order': F'{_ - 4}', 'queueSize': {'bytes': '1000000'}, 'userLabel': F'QueueTailDrop_{_}'} for _ in range(4, 7)],
                            }
                        },
                        'QoSClassifier': {
                            'attributes': {'xc:operation': 'create'}, 'qoSClassifierId': '1',
                            'PcpToQueueMap': {
                                'attributes': {'xc:operation': 'create'}, 'pcpToQueueMapId': '1',
                                'defaultQueue': F'{eth_port},QueueSystem=1,SchedulerSp=1,SchedulerSp=2,QueueTailDrop=5',
                                'PcpSetToQueue': [
                                    {'attributes': {'xc:operation': 'create'}, 'pcpSetToQueueId': '1', 'pcpSet': '7, 6',
                                     'queue': F'{eth_port},QueueSystem=1,SchedulerSp=1,QueueTailDrop=1'},
                                    {'attributes': {'xc:operation': 'create'}, 'pcpSetToQueueId': '2', 'pcpSet': '5',
                                     'queue': F'{eth_port},QueueSystem=1,SchedulerSp=1,QueueTailDrop=2'},
                                    {'attributes': {'xc:operation': 'create'}, 'pcpSetToQueueId': '3', 'pcpSet': '4',
                                     'queue': F'{eth_port},QueueSystem=1,SchedulerSp=1,QueueTailDrop=3'},
                                    {'attributes': {'xc:operation': 'create'}, 'pcpSetToQueueId': '4', 'pcpSet': '2',
                                     'queue': F'{eth_port},QueueSystem=1,SchedulerSp=1,SchedulerSp=2,QueueTailDrop=4'},
                                    {'attributes': {'xc:operation': 'create'}, 'pcpSetToQueueId': '5', 'pcpSet': '1, 0',
                                     'queue': F'{eth_port},QueueSystem=1,SchedulerSp=1,SchedulerSp=2,QueueTailDrop=5'},
                                    {'attributes': {'xc:operation': 'create'}, 'pcpSetToQueueId': '6', 'pcpSet': '3',
                                     'queue': F'{eth_port},QueueSystem=1,SchedulerSp=1,SchedulerSp=2,QueueTailDrop=6'},
                                ]
                            },
                        }
                    }
                }
            }
        }

    def special_formate_scripts(self):
        import fileinput
        import sys
        import os
        def replace_mathod(file, searchExp, replaceExp):
            for line in fileinput.input(file, inplace=1):
                line = line.replace(searchExp, replaceExp)
                sys.stdout.write(line)
        for sc in ['ap', 'cli', 'cmedit']:
            file = os.path.join(self.usid.base_dir, *self.relative_path[sc])
            if os.path.exists(file) and os.path.isfile(file): replace_mathod(file, 'qoSClassifierId', 'qosClassifierId')
