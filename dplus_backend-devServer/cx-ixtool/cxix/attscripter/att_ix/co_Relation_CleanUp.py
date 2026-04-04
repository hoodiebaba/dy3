import copy
import os
from .att_xml_base import att_xml_base


class co_Relation_CleanUp(att_xml_base):
    def create_rpc_msg(self):
        if self.usid.script.get(self.__class__.__name__, False): return
        else: self.usid.script[self.__class__.__name__] = True
        # co_Relation_CleanUp module return
        df_temp = self.usid.df_enb_cell.copy()[["celltype", "presite", "precell", "preenbid", "precellid", "postsite", "postcell",
                                                "enbid", "cellid", "movement"]]
        df_temp = df_temp.loc[((df_temp.celltype.isin(['FDD', 'TDD'])) & (df_temp.movement == 'yes'))].reset_index(inplace=False, drop=True)
        if len(df_temp.index) == 0: return

        for node in df_temp.presite.unique():
            enbid = df_temp.loc[(df_temp.presite == node), 'preenbid'].values[0]
            self.s_dict['cli'] = [
                F'###########################################################################################################',
                F'#### CLI Commands for Relation Cleanup for Node {node} enbid- {enbid}',
                F'#### Get Site List from ENM',
                F'#### Make <nodelist> as eNoneB1;eNoneB2;eNoneB3 in the formate',
                F'#### set command formate "cmedit set FDN administrativeState:LOCKED --force"',
                F'#### delete command formate "cmedit delete FDN --ALL --force"',
                F'###########################################################################################################',
                # F'cmedit get {node[0]}* ExternalENodeBFunction.eNBId=={enbid} -t',
                F'cmedit get --node * ENodeBFunction.eNodeBFunctionId==*,ExternalENodeBFunction.eNBId=={enbid} ExternalENodeBFunction.eNBId -t',
                F'cmedit get --node {node[0]}* ENodeBFunction.eNodeBFunctionId==*,ExternalENodeBFunction.eNBId=={enbid} ExternalENodeBFunction.eNBId -t',
                F'cmedit get --node {node[0]}* ExternalENodeBFunction.eNBId=={enbid} ExternalENodeBFunction.eNBId -t',
                F'',
            ]
            self.s_dict['cmedit'] = ['unset all', 'lt all', 'confbd+', '']

            for row in df_temp.loc[(df_temp.presite == node) & (df_temp.movement == 'yes')].itertuples():
                self.s_dict['cli'] += [
                    F'#### EUtranCellRelation to be deleted first and followed by ExternalEUtranCellFDD for Cell-{row.precell}, enbid={row.preenbid}'
                    F',cellid={row.precellid}',
                    F'cmedit get --node <nodelist> ENodeBFunction.eNodeBFunctionId==*,ExternalENodeBFunction.eNBId=={enbid},'
                    F'ExternalEUtranCellFDD.localCellId=={row.precellid} ExternalEUtranCellFDD.reservedBy',
                    F'',
                    F'',
                ]
                self.s_dict['cmedit'].extend([
                    F'####:----------------> Relation Cleanup for Cell {row.precell}<----------------:####',
                    F'pr EUtranCellRelation=310410-{row.preenbid}-{row.precellid}$',
                    F'if $nr_of_mos > 0',
                    F'  lrdel EUtranCellRelation=310410-{row.preenbid}-{row.precellid}$',
                    F'fi',
                    F'pr EUtranCellRelation={row.precell}$',
                    F'if $nr_of_mos > 0',
                    F'  lrdel EUtranCellRelation={row.precell}$',
                    F'fi',
                    F'wait 5',
                    F'',
                    F'pr ExternalEUtranCellFDD=310410-{row.preenbid}-{row.precellid}$',
                    F'if $nr_of_mos > 0',
                    F'  lrdel ExternalEUtranCellFDD=310410-{row.preenbid}-{row.precellid}$',
                    F'fi',
                    F'pr ExternalEUtranCellFDD={row.precell}$',
                    F'if $nr_of_mos > 0',
                    F'  lrdel ExternalEUtranCellFDD={row.precell}$',
                    F'fi',
                    F'',
                ])

            if len(df_temp.loc[df_temp.postsite == node].index) == 0:
                self.s_dict['cli'] += [
                    F'#### Lock MO TermPointToENB, Delete TermPointToENB & ExternalENodeBFunction',
                    F'cmedit get --node <nodelist> ENodeBFunction.eNodeBFunctionId==*,ExternalENodeBFunction.eNBId=={enbid},TermPointToENB TermPointToENB',
                    F'cmedit get --node <nodelist> ENodeBFunction.eNodeBFunctionId==*,ExternalENodeBFunction.eNBId=={enbid} ExternalENodeBFunction',
                    F'',
                    F'',
                ]
                self.s_dict['cmedit'].extend([
                    F'####:----------------> External MOs Cleanup for Node {node} with eNBId {enbid}, Node getting deleted<----------------:####',
                    F'lpr ExternalENodeBFunction=310410-{enbid}$',
                    F'if $nr_of_mos > 0',
                    F'  lbl ExternalENodeBFunction=310410-{enbid},',
                    F'  wait 5',
                    F'  lrdel ExternalENodeBFunction=310410-{enbid}',
                    F'  wait 5',
                    F'  lrdel ExternalENodeBFunction=310410-{enbid}',
                    F'fi',
                    F'lpr ExternalENodeBFunction={node}$',
                    F'if $nr_of_mos > 0',
                    F'  lbl ExternalENodeBFunction={node},',
                    F'  wait 5',
                    F'  lrdel ExternalENodeBFunction={node}',
                    F'  wait 5',
                    F'  lrdel ExternalENodeBFunction={node}',
                    F'fi',
                    F'',
                ])
        # Write Script to File in Main_Folder/Relation_CleanUp
        for sc in ['ap', 'cli', 'cmedit']:
            self.relative_path[sc][0] = 'Relation_CleanUp'
            del self.relative_path[sc][1]

