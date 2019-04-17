import Vue from 'vue'
export default {
    /**
   *
   * @param {*} state
   * @param { value : value of x  and y } raw
   */
  async changeTablePotition(state, raw) {
    // eslint-disable-next-line
    console.log('table key '+JSON.stringify(raw))
    var val = raw.value;
    var tableKey = raw.tableKey;
    state.dataDiagramNew[tableKey].point.x = val.currentTarget.attrs.x;
    state.dataDiagramNew[tableKey].point.y = val.currentTarget.attrs.y;
    await Object.keys(state.dataDiagramNew[tableKey].association).forEach(key=>{
      let conn=state.connectorNewKey [
        state.dataDiagramNew[tableKey].association[key].connector_id
      ]
      var tmp=[]
      if(state.dataDiagramNew[tableKey].association[key].type==="belong"){
        tmp = [
          state.dataDiagramNew[tableKey].point.x+ state.dataDiagramNew[tableKey].association[key].point.x,
          state.dataDiagramNew[tableKey].point.y+ state.dataDiagramNew[tableKey].association[key].point.y,
          conn.points[0] - 30,
          conn.points[1] - 30,
          conn.points[4],
          conn.points[5]
        ];
      }else if(state.dataDiagramNew[tableKey].association[key].type==="has"){
        tmp = [
          conn.points[0],
          conn.points[1],
          conn.points[0] - 30,
          conn.points[1] - 30,
          state.dataDiagramNew[tableKey].point.x + state.dataDiagramNew[tableKey].association[key].point.x,
          state.dataDiagramNew[tableKey].point.y+ state.dataDiagramNew[tableKey].association[key].point.y,
        ];       
      }
      conn.points=tmp
    })
  },
    /**
   *
   * @param {*} state
   * @param {status: boolean, tableName: string} raw
   */
  async highlightRelation(state, raw) {
    var status = raw.status;
    var tableKey = raw.tableKey;
    // eslint-disable-next-line
    console.log('status true '+tableKey)   
    // eslint-disable-next-line    
    console.log('data table assoc') 
    // eslint-disable-next-line    
    console.log(JSON.stringify(state.dataDiagramNew[tableKey].association))
    await Object.keys(state.dataDiagramNew[tableKey].association).forEach(key=>{
      if(state.dataDiagramNew[tableKey].association[key].type==="belong"){
        let foreignKeyId = state.dataDiagramNew[tableKey].association[key].foreignKey_id
        let targetKeyId = state.dataDiagramNew[tableKey].association[key].targetKey_id
        let targetTableId= state.dataDiagramNew[tableKey].association[key].table_id
        let connectorId=state.dataDiagramNew[tableKey].association[key].connector_id
        if(status===true){
          state.dataDiagramNew[tableKey].coloumns[foreignKeyId].style.shadowBlur = 5;
          state.dataDiagramNew[tableKey].coloumns[foreignKeyId].style.shadowColor = "green";

          state.dataDiagramNew[targetTableId].coloumns[targetKeyId].style.shadowBlur = 5;
          state.dataDiagramNew[targetTableId].coloumns[targetKeyId].style.shadowColor = "green";          

          state.connectorNewKey[connectorId].lineStyle.shadowBlur = 5;
          state.connectorNewKey[connectorId].lineStyle.shadowColor = "green"; 
          state.connectorNewKey[connectorId].points[0]++
          // eslint-disable-next-line    
          console.log('state.connectorNewKey[connectorId] '+JSON.stringify(state.connectorNewKey[connectorId]))
        }else if(status===false){
          state.dataDiagramNew[tableKey].coloumns[foreignKeyId].style.shadowBlur = 0;
          state.dataDiagramNew[targetTableId].coloumns[targetKeyId].style.shadowBlur = 0;
          state.connectorNewKey[connectorId].lineStyle.shadowBlur = 0;
          state.connectorNewKey[connectorId].points[0]++
        }
      }else if(state.dataDiagramNew[tableKey].association[key].type==="has"){
        let foreignKeyId = state.dataDiagramNew[tableKey].association[key].foreignKey_id
        let sourceKeyId = state.dataDiagramNew[tableKey].association[key].sourceKey_id
        let targetTableId= state.dataDiagramNew[tableKey].association[key].table_id
        let connectorId=state.dataDiagramNew[tableKey].association[key].connector_id
        if(status===true){
          // eslint-disable-next-line
          console.log('hidupkan biru '+connectorId)          
          state.dataDiagramNew[tableKey].coloumns[sourceKeyId].style.shadowBlur = 5;
          state.dataDiagramNew[tableKey].coloumns[sourceKeyId].style.shadowColor = "#00D2FF";

          state.dataDiagramNew[targetTableId].coloumns[foreignKeyId].style.shadowBlur = 5;
          state.dataDiagramNew[targetTableId].coloumns[foreignKeyId].style.shadowColor = "#00D2FF";

          let tmpLineStye={
            shadowBlur: 5,
            shadowColor: "#00D2FF"
          }
          state.connectorNewKey[connectorId].lineStyle=tmpLineStye
          // state.connectorNewKey[connectorId].lineStyle.shadowColor = "#00D2FF";
          // state.connectorNewKey[connectorId].points[0]++
        }else if(status===false){
          // eslint-disable-next-line
          console.log('matikan biru')
          var tmpLineStye={
            shadowBlur: 0,
            shadowColor: "#00D2FF"
          }
          state.dataDiagramNew[tableKey].coloumns[sourceKeyId].style.shadowBlur = 0;
          state.dataDiagramNew[targetTableId].coloumns[foreignKeyId].style.shadowBlur = 0;
          state.connectorNewKey[connectorId].lineStyle=tmpLineStye;
        }
      }
    })
  },
  setTableKeyConfig(state,tableKeyConfig ){
    state.visibleConfigTable = true;
    state.tableKeyConfig=tableKeyConfig
  },
  setConfigTable(state, tableName) {
    state.configTable.tableName = tableName;
    state.configTable.properties = state.dataDiagram[tableName];
    state.visibleConfigTable = true;
  },
  setVisibleConfigTable(state, val) {
    state.visibleConfigTable = val;
  },
  /**
   *
   * @param {*} state
   * @param {*} raw
   * {
   *  oldColoumn: string
   *  tableName:string
   *  newColoumn : string
   * }
   */
  async updateColoumnTable(state, raw) {
    // async function loop(items, callback) {
    //   for (var a = 0; a < items.length; a++) {
    //     // eslint-disable-next-line
    //     await callback(items[a]);
    //   }
    // }

    var oldColoumn = raw.oldColoumn;
    var newColoumn = raw.newColoumn;
    var tableName = raw.tableName;

    for (var a = 0; a < state.dataDiagram[tableName].association.length; a++) {
      // eslint-disable-next-line
      if(state.dataDiagram[tableName].association[a].type==='belong'){
        if(state.dataDiagram[tableName].association[a].foreignKey===oldColoumn){
          state.dataDiagram[tableName].association[a].foreignKey=newColoumn
          // in this must change in asscociation table source
            for (var b=0; b<state.dataDiagram[state.dataDiagram[tableName].association[a].table].association.length;b++){
            if(state.dataDiagram[state.dataDiagram[tableName].association[a].table].association[b].type==='has'){
              if(state.dataDiagram[state.dataDiagram[tableName].association[a].table].association[b].table===tableName&&state.dataDiagram[state.dataDiagram[tableName].association[a].table].association[b].foreignKey===oldColoumn){
                state.dataDiagram[state.dataDiagram[tableName].association[a].table].association[b].foreignKey=newColoumn

                // for(var c=0;c<state.connectorNew.length;c++){
                //   if(
                //     state.connectorNew[c].tail.table===tableName&&
                //     state.connectorNew[c].tail.coloumn===oldColoumn &&

                //     state.connectorNew[c].head.table===state.dataDiagram[tableName].association[a].table&&
                //     state.connectorNew[c].head.coloumn===oldColoumn &&
                //     ){

                //     }
                // }
              }
            }
        }
      }
      
    }
  }
    // await loop(state.dataDiagram[tableName].association, async assoc=>{
    // // .forEach(
    //     if(assoc.type==='belong'){
    //       if(assoc.foreignKey===oldColoumn){
    //         assoc.foreignKey=newColoumn
    //         // in this must change in asscociation table source
    //         // await .forEach(
    //           await loop(state.dataDiagram[assoc.table].association, async assocSource=>{
    //           if(assocSource.type==='has'){
    //             if(assocSource.table===tableName&&assocSource.foreignKey===oldColoumn){
    //               assocSource.foreignKey=newColoumn
    //             }
    //           }

    //         })
    //       }
    //     }
    // })
    // eslint-disable-next-line
    console.log('before coloumn' + JSON.stringify(state.dataDiagram[tableName]))
    var tmpColoumn =JSON.parse(JSON.stringify(state.dataDiagram[tableName].coloumns[oldColoumn]))
    delete state.dataDiagram[tableName].coloumns[oldColoumn];
    state.dataDiagram[tableName].coloumns[newColoumn] = tmpColoumn;
    state.dataDiagram[tableName].potition.x++
    // eslint-disable-next-line
    // console.log('new coloumn' + JSON.stringify(state.dataDiagram[tableName]))
  },

  async updateColoumnName(state, raw){
    var tableKey_id=raw.tableKey_id
    var coloumn_id=raw.coloumn_id
    var newName= raw.newName
    state.dataDiagramNew[tableKey_id].coloumns[coloumn_id].coloumn_name=newName
  },
  async updatePrimaryKey(state,raw){
    var tableKey_id=raw.tableKey_id
    var coloumn_id=raw.coloumn_id
    var primaryKey= raw.primaryKey
    state.dataDiagramNew[tableKey_id].coloumns[coloumn_id].primaryKey=primaryKey
  },
  async updateAllowNull(state,raw){
    var tableKey_id=raw.tableKey_id
    var coloumn_id=raw.coloumn_id
    var notNull= raw.notNull
    state.dataDiagramNew[tableKey_id].coloumns[coloumn_id].notNull=notNull
  },
  async updateForeignKeyStatus(state, raw){
    var tableKey_id=raw.tableKey_id
    var coloumn_id=raw.coloumn_id
    var foreignKey= raw.foreignKey
    state.dataDiagramNew[tableKey_id].coloumns[coloumn_id].foreignKey=foreignKey
  },
  async updateUnique(state, raw){
    var tableKey_id=raw.tableKey_id
    var coloumn_id=raw.coloumn_id
    var unique= raw.unique
    state.dataDiagramNew[tableKey_id].coloumns[coloumn_id].unique=unique
  },
  async updateUnsigned(state, raw){
    var tableKey_id=raw.tableKey_id
    var coloumn_id=raw.coloumn_id
    var unsigned= raw.unsigned
    state.dataDiagramNew[tableKey_id].coloumns[coloumn_id].unsigned=unsigned
  },
  async updateAutoIncrement(state, raw){
    var tableKey_id=raw.tableKey_id
    var coloumn_id=raw.coloumn_id
    var autoIncrement= raw.autoIncrement
    state.dataDiagramNew[tableKey_id].coloumns[coloumn_id].autoIncrement=autoIncrement
  },
  async updateAssociationBelongColoumnName(state,raw){
    var association_id= raw.association_id
    var selectedNewColoumn_id= raw.selectedNewColoumn_id
    var table_id= raw.table_id

    //change in this asscotiation table below always
    var assocObject=state.dataDiagramNew[table_id].association[association_id]
    assocObject.targetKey_id=selectedNewColoumn_id
    //change in connector
    var connObject= state.connectorNewKey[assocObject.connector_id]
    state.connectorNewKey[assocObject.connector_id].head.coloumn_id=selectedNewColoumn_id

    //change in target key has owner ship
    state.dataDiagramNew[connObject.head.table_id].association[connObject.head.association_id].sourceKey_id=selectedNewColoumn_id

  },
  async updateAssociationBelongTableName(state,raw) {
      var association_id_foreignKey= raw.association_id
      var table_id_source= raw.selectedNewTable
      var table_id_foreignKey= raw.table_id
      var coloumn_id_foreignKey=raw.thisForeignKey_id
      window.alert(JSON.stringify(raw))
      if(association_id_foreignKey===undefined){
        let coloumn_id_default_sourceKey=Object.keys(state.dataDiagramNew[table_id_source].coloumns)[0]
        let association_id_foreignKeyNew='assoc_'+new Date().getMilliseconds()
        let association_id_source='assoc_'+new Date().getMilliseconds()
        let connector_id='conn_car_number_driver_id'+new Date().getMilliseconds()
        // create association in this table
        state.dataDiagramNew[table_id_foreignKey].association[association_id_foreignKeyNew]= {
          connector_id: connector_id,
          type: "belong",
          table: table_id_source,
          table_id: table_id_source,
          foreignKey: coloumn_id_foreignKey,
          foreignKey_id: coloumn_id_foreignKey,
          targetKey: coloumn_id_default_sourceKey,
          targetKey_id: coloumn_id_default_sourceKey,
          point: {
            x: 50,
            y: 300
          }
        }
        // create belong assoc in this table
        state.dataDiagramNew[table_id_foreignKey].coloumns[coloumn_id_foreignKey].association_belong_id=association_id_foreignKeyNew
        // create association in target table
        state.dataDiagramNew[table_id_source].association[association_id_source]={
          connector_id: connector_id,
          type: "has",
          table: table_id_foreignKey,
          table_id: table_id_foreignKey,
          foreignKey: coloumn_id_foreignKey,
          foreignKey_id: coloumn_id_foreignKey,
          sourceKey: "id",
          sourceKey_id: coloumn_id_default_sourceKey,
          point: {
            x: 50,
            y: 300
          }
        }
        // state.dataDiagramNew[selectedNewTable_id].association[association_id]=association_id_target
        var tmpConnector= {
          // head is has
          head: {
            table: table_id_source,
            table_id: table_id_source,
            coloumn: "id",
            coloumn_id: coloumn_id_default_sourceKey,
            association_id:association_id_source
          },
          // tail is belong
          tail: {
            table: "Driver",
            table_id: table_id_foreignKey,
            coloumn: "car_id",
            coloumn_id: coloumn_id_foreignKey,
            association_id: association_id_foreignKeyNew
          },
          points: [0, 0, 300,300],
          lineStyle: {
            shadowBlur: 5,
            shadowColor: "green"
          }
        }
        Vue.set(state.connectorNewKey, connector_id, tmpConnector)      
      }else{
        

      var assocOBJ=state.dataDiagramNew[table_id_foreignKey].association[association_id_foreignKey]
      // delete source table assoc
      var targetOldAssoc=state.connectorNewKey[assocOBJ.connector_id].head.association_id
      var targetOldTable=state.connectorNewKey[assocOBJ.connector_id].head.table_id
      delete state.dataDiagramNew[targetOldTable].association[targetOldAssoc]

      // change association data target table_id      
      assocOBJ.table_id=table_id_source

      //change coloumn target to index 0
      var selectedColoumnDefault_id=Object.keys(state.dataDiagramNew[table_id_source].coloumns)[0]
      assocOBJ.targetKey_id=selectedColoumnDefault_id      

      // change coloumn connector
      state.connectorNewKey[assocOBJ.connector_id].head.coloumn_id=selectedColoumnDefault_id
      // change table connector
      state.connectorNewKey[assocOBJ.connector_id].head.table_id=table_id_source
      // renew asscotiation id  
      var newAssoctioation_id=new Date().toString()
      state.connectorNewKey[assocOBJ.connector_id].head.association_id=newAssoctioation_id
      // chreate new
      state.dataDiagramNew[table_id_source].association[newAssoctioation_id]= {
        connector_id: assocOBJ.connector_id,
        type: "has",
        table: "Driver",
        table_id: table_id_foreignKey,
        foreignKey: "Car_id",
        foreignKey_id: assocOBJ.foreignKey_id,
        sourceKey: "id",
        sourceKey_id: assocOBJ.targetKey_id,
        point: {
          x: 100,
          y: 50
        }
      }





      
      let conn=state.connectorNewKey [
        state.dataDiagramNew[table_id_foreignKey].association[association_id_foreignKey].connector_id
      ]

      var tmp = [
        conn.points[0],
        conn.points[1],
        conn.points[0] - 30,
        conn.points[1] - 30,
        state.dataDiagramNew[table_id_source].point.x,
        state.dataDiagramNew[table_id_source].point.y,
      ];

      // state.dataDiagramNew[selectedNewTable_id].association[association_id].table_id=selectedNewTable_id
      conn.points=tmp
      conn.tail.table_id=table_id_foreignKey
    }
    },
    setLineStyleConnector(state,raw){
      state.connectorNewKey[raw.key]=raw.style
    }
};

