def isonProcedure(data):
    isonProcedure=f"""exec [S-iSON Optimization].[iSON].[PoweriSON Neighbour Generation]     

/* Clear Old Plan of Specific User                                         */     '{data["Clear Old Plan of Specific User"]}',

/* Delete exiting Neighbours If Priority is Lower than Planned             */       '{data["Delete existing Neighbours If Priority is Lower than Planned"]}',

/* Ignore Neighbours where Source & Target BCCHs are Same                  */     '{data["Ignore Neighbours where Source & Target BCCHs are Same"]}',

/* Ignore Neighbours where Source & Target BCCHs,NCC,BCC are Same          */     '{data["Ignore Neighbours where Source & Target BCCHs, NCC, BCC are Same"]}',

/* Ignore Neighbours where Targets have same Frequency & Code              */       '{data["Ignore Neighbours where Targets have same Frequency & Code"]}',

/* Ignore Neighbours where Source & Target have same UARFCN & PSCs         */     '{data["Ignore Neighbours where Source & Target have same UARFCN & PSCs"]}',

/* Create 2G to 2G Neighhbours                                             */     '{data["Create 2G to 2G Neighhbours"]}',

/* Create 2G to 3G Neighhbours                                             */     '{data["Create 2G to 3G Neighhbours"]}',

/* Create 3G to 2G Neighhbours                                             */     '{data["Create 3G to 2G Neighhbours"]}',

/* Create 3G to 3G Intra Neighhbours                                       */     '{data["Create 3G to 3G Intra Neighhbours"]}',

/* Create 3G to 3G Inter Neighhbours                                       */     '{data["Create 3G to 3G Inter Neighhbours"]}',

/* Neighbour Tier Level                                                    */     {data["Neighbour Tier Level"]},

/* Sector Used for Find  Neighbour Distance                                */     '{data["Sector Used for Find Neighbour Distance"]}',

/* Pre Defined Table used for find Inter Neighbour Disatnce                */       '{data["Pre Defined Table used for find Inter Neighbour Disatnce"]}',

/* Minimum Distance For Neighbours                                         */     {data["Minimum Distance For Neighbours"]} ,

/* Maximum Distance For Neighbours                                         */     {data["Maximum Distance For Neighbours"]},

/* Distance Factor For Neighbours with repsect to max distnce              */       {data["Distance Factor For Neighbours with repsect to max distnce"]},

/* Maximum  Neighbours : 2G to 2G :-                                       */     {data["Maximum  Neighbours : 2G to 2G"]},

/* Maximum  Neighbours : 2G to 3G :-                                       */     {data["Maximum  Neighbours : 2G to 3G"]},

/* Maximum  Neighbours : 3G to 2G :-                                       */     {data["Maximum Neighbours: 3G to 2G"]},

/* Maximum  Neighbours : 3G to 3G Intra :-                                 */       {data["Maximum Neighbours: 3G to 3G Intra"]},

/* Maximum  Neighbours : 3G to 3G Inter:-                                  */     {data["Maximum Neighbours: 3G to 3G Inter"]}"""
    return isonProcedure