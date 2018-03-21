/* eslint-disable indent,no-undef,semi,semi,no-unused-vars,no-unused-vars */
let parseString = require('xml2js').parseString;
const fs = require('fs');
let md5 = require('md5');
let xml;
const db = require('../modules/database')();
const async = require('async');
var path = require('path');

// let Database = require('arangojs').Database;
// let aqlQuery = require('arangojs').aqlQuery;
// let db = new Database();
// db.useDatabase('ot-node');
// db.useBasicAuth('root', 'root');
//
// let collection = db.collection('firstCollection');





//import XML from NODE argument
if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}

let file = process.argv[2];

let file_data = fs.readFileSync(__dirname + '/' + file, 'utf8');



////find function
function findValuesHelper(obj, key, list) {
    if (!obj) return list;
    if (obj instanceof Array) {
        for (var i in obj) {
            list = list.concat(findValuesHelper(obj[i], key, []));
        }
        return list;
    }
    if (obj[key]) list.push(obj[key]);

    if ((typeof obj == 'object') && (obj !== null) ){
        var children = Object.keys(obj);
        if (children.length > 0){
            for (i = 0; i < children.length; i++ ){
                list = list.concat(findValuesHelper(obj[children[i]], key, []));
            }
        }
    }
    return list;
}

////PARSING

parseString(file_data, {explicitArray: false} , async function (err, result) {

    let participants = [];
    let locations = {};
    let objects = {};
    let batches = {};
    let transactions = {};
    let events = {};
    let transfered_batches = {};


    let owned_by = [];
    let at = [];
    let input_batch = [];
    let input_batches = [];
    let output_batches = [];
    let output_batch = [];
    let instance_of = [];
    let of_batch = [];
    let traced_by = [];
    let from = [];
    let to = [];




    let OriginTrailExport_element;
    let export_version;
    let DataProvider_element;
    let data_provider_id;



    let MasterData_element;

    let ParticipantsList_element;
    let Participant_elements;
    var ParticipantIdentifiers_element;
    var participant_id;
    var ParticipantData_element;

    let BusinessLocationsList_element;
    let BusinessLocation_elements;
    let business_location_owner_id;
    let BusinessLocationIdentifiers_element;
    let BusinessLocationData_element;

    let ObjectsList_element;
    let Object_elements;
    var ObjectIdentifiers_element;
    var ObjectData_element;
    var object_id;



    let TransactionsData_element;
    let InternalTransactionsList_element;
    let InternalTransaction_elements;
    let InternalTransactionIdentifiers_element;
    let internal_transaction_id;
    let internal_transaction_uid;
    let BatchesInformation_element;
    let InputBatchesList_element;
    let Batch_elements;
    let BatchIdentifiers_element;
    let batch_id;
    let object_key;
    let batch_uid;
    let BatchData_element;
    let OutputBatchesList_element;
    let InternalTransactionData_element;
    let business_location_id;
    let business_location_key;
    let ExternalTransactionsList_element;
    let ExternalTransaction_elements;
    let externaltransac;
    let ExternalTransactionIdentifiers_element;
    let external_transaction_id;
    let external_transaction_uid;
    let BatchesList_element;
    let ExternalTransactionData_element;
    let source_business_location_id;
    let source_business_location_key;
    let dest_business_location_id;
    let dest_business_location_key;
    let transaction_flow;

    let VisibilityEventData_element;
    let VisibilityEventsList_element;
    let Event_elements;
    let e_event;
    let EventIdentifiers_element;
    let event_id;
    let event_uid;
    let batch_key;
    let EventData_element;





    //READING FILE-HEADER
    let header = findValuesHelper(result, 'OriginTrailExport', []);
    if (header.length <= 0) {
        Error('Missing OriginTrailExport element!');
    } else {

        OriginTrailExport_element = result.OriginTrailExport;
    }

    //version
    let version = findValuesHelper(OriginTrailExport_element, 'version', []);
    if (version.length <= 0) {
        Error('Missing version number attribute for OriginTrailExport element!');
    } else {
        export_version = result.OriginTrailExport['version'];
        console.log(export_version);
    }

    //data-provider
    let data_provider = findValuesHelper(OriginTrailExport_element, 'DataProvider', []);
    if (data_provider.length <= 0) {
        Error('Missing DataProvider element!');
    } else {
        DataProvider_element = result.OriginTrailExport.DataProvider;
    }

    //participant-id
    let participant = findValuesHelper(DataProvider_element, 'ParticipantId', []);
    if (participant.length <= 0) {
        Error('Missing ParticipantId element for DataProvider!');
    } else {
        data_provider_id = result.OriginTrailExport.DataProvider.ParticipantId;
    }




    ///////READING MASTER-DATA///////
    let master = findValuesHelper(OriginTrailExport_element, 'MasterData', []);
    if (master.length <= 0) {
        Error('Missing MasterData element for DataProvider!');
    } else {
        MasterData_element = result.OriginTrailExport.MasterData;
    }

    //PARTICIPANTS
    let participant_list = findValuesHelper(MasterData_element, 'ParticipantsList', []);
    if (participant_list.length <= 0) {
        Error('Missing ParticipantList element for MasterData');
    } else {
        ParticipantsList_element = result.OriginTrailExport.MasterData.ParticipantsList;
    }

    let participant_tag = findValuesHelper(ParticipantsList_element, 'Participant', []);
    if (participant_tag.length <= 0) {
        Error('Missing Participant element for ParticipantsList');
    } else {
        Participant_elements = result.OriginTrailExport.MasterData.ParticipantsList.Participant;


    }

    if (!(Participant_elements instanceof Array)) {
        let temp_participant_elements = Participant_elements;
        Participant_elements = [];
        Participant_elements.push(temp_participant_elements);
    }


    for(i in Participant_elements)
    {
        participant = Participant_elements[i];


        let participant_identifiers = findValuesHelper(participant, 'ParticipantIdentifiers', []);
        if (participant_identifiers.length <= 0) {
            Error('Missing ParticipantIdentifiers element for Participant!');
        } else {
            ParticipantIdentifiers_element = participant.ParticipantIdentifiers;
        }

        let participant_data = findValuesHelper(participant, 'ParticipantData', []);
        if (participant_data.length <= 0) {
            Error('Missing ParticipantData element for Participant!');
        } else {
            ParticipantData_element = participant.ParticipantData;
        }


        let participantid = findValuesHelper(ParticipantIdentifiers_element, 'ParticipantId', []);
        if (participantid.length <= 0) {
            Error('Missing ParticipantId for Participant!');
        } else {
            participant_id = ParticipantIdentifiers_element.ParticipantId;

        }






        participant_uid = 'ot:' + data_provider_id + ':otpartid:' + participant_id;


        participants[participant_id] = {};
        participants[participant_id]['identifiers'] = participant.ParticipantIdentifiers;
        participants[participant_id]['identifiers']['uid'] = participant_uid;
        participants[participant_id]['data'] = participant.ParticipantData;
        participants[participant_id]['_key'] = md5('participant_' + participant_uid);
        participants[participant_id]['vertex_key'] = md5('participant_' + participant_uid);
    }





    //BUSINESS-LOCATIONS
    let business_locations_list = findValuesHelper(MasterData_element, 'BusinessLocationsList', []);
    if (business_locations_list.length <= 0) {
        Error('Missing BusinessLocationList element for MasterData!');
    } else {
        BusinessLocationsList_element = result.OriginTrailExport.MasterData.BusinessLocationsList;
    }

    let business_location = findValuesHelper(BusinessLocationsList_element, 'BusinessLocation', []);
    if (business_location.length <= 0) {
        Error('Missing BusinessLocation element for BusinessLocationsList!');
    } else {
        BusinessLocation_elements = result.OriginTrailExport.MasterData.BusinessLocationsList.BusinessLocation;
    }

    if (!(BusinessLocation_elements instanceof Array)) {
        let temp_businesslocation_elements = BusinessLocation_elements;
        BusinessLocation_elements = [];
        BusinessLocation_elements.push(temp_businesslocation_elements);
    }

    for(i in BusinessLocation_elements)
    {
        business_location = BusinessLocation_elements[i];


        let business_location_ownerid = findValuesHelper(business_location, 'BusinessLocationOwnerId', []);
        if (business_location_ownerid.length <= 0) {
            Error('Missing BusinessLocationOwnerId for BusinessLocation!');
        } else {
            business_location_owner_id = business_location.BusinessLocationOwnerId;
        }

        let business_location_identifiers = findValuesHelper(business_location, 'BusinessLocationIdentifiers', []);
        if (business_location_identifiers.length <= 0) {
            Error('Missing BusinessLocationIdentifiers element for BusinessLocation!');
        } else {
            BusinessLocationIdentifiers_element = business_location.BusinessLocationIdentifiers;
        }

        let business_location_data = findValuesHelper(business_location, 'BusinessLocationData', []);
        if (business_location_data.length <= 0) {
            Error('Missing BusinessLocationData element for BusinessLocation!');
        } else {
            BusinessLocationData_element = business_location.BusinessLocationData;
        }

        if(participants[business_location_owner_id] == undefined) {
            Error('Key is not defined');
        } else {
            business_location_owner_key = participants[business_location_owner_id]['_key'];
        }


// if(locations[business_location_id] == undefined) = > ne postoji



        business_location_id = business_location.BusinessLocationIdentifiers.BusinessLocationId;

        business_location_uid = 'ot:' + data_provider_id + ':otblid:' + business_location_id;

        locations[business_location_id] = {};
        locations[business_location_id]['identifiers'] = business_location.BusinessLocationIdentifiers;
        locations[business_location_id]['identifiers']['uid'] = business_location_uid;
        locations[business_location_id]['data'] = business_location.BusinessLocationData;
        locations[business_location_id]['_key'] = md5('business_location_' + business_location_uid);
        locations[business_location_id]['vertex_key'] = md5('business_location_' + business_location_uid);

        owned_by.push({
            '_from': 'ot_vertices/' + locations[business_location_id]['_key'],
            '_to': 'ot_vertices/' + business_location_owner_key,
            '_key': md5(business_location_owner_key + '_' + locations[business_location_id]['_key'])
        })
    }




    //OBJECTS
    let object_list = findValuesHelper(MasterData_element, 'ObjectsList', []);
    if (object_list.length <= 0) {
        Error('Missing ObjectsList element for MasterData!');
    } else {
        ObjectsList_element = result.OriginTrailExport.MasterData.ObjectsList;
    }

    let object = findValuesHelper(ObjectsList_element, 'Object', []);
    if(object.length <= 0) {
        Error('Missing Object element for ObjectsList');
    } else {
        Object_elements = ObjectsList_element.Object;
    }

    if (!(Object_elements instanceof Array)) {
        let temp_object_elements = Object_elements;
        Object_elements = [];
        Object_elements.push(temp_object_elements);
    }


    for (i in Object_elements) {

        objectel = Object_elements[i];

        let object_identifier = findValuesHelper(objectel, 'ObjectIdentifiers', []);
        if (object_identifier.length <= 0) {
            Error('Missing ObjectIdentifiers element for Object!');
        } else {
            ObjectIdentifiers_element = objectel.ObjectIdentifiers;
        }

        let object_data = findValuesHelper(objectel, 'ObjectData', []);
        if (object_data.length <= 0) {
            Error('Missing ObjectIdentifiers element for Object!');
        } else {
            ObjectData_element = objectel.ObjectData;
        }

        let objectid = findValuesHelper(ObjectIdentifiers_element, 'ObjectId', []);
        if (objectid.length <= 0) {
            Error('Missing ObjectId for Object');
        } else {
            object_id = ObjectIdentifiers_element.ObjectId;
        }


        object_uid = 'ot:' + data_provider_id + ':otoid:' + object_id;


        objects[object_id] = {};
        objects[object_id]['identifiers'] = ObjectIdentifiers_element;
        objects[object_id]['identifiers']['uid'] = object_uid;
        objects[object_id]['data'] = ObjectData_element;
        objects[object_id]['_key'] = md5('object_' + object_uid);
        objects[object_id]['vertex_key'] = md5('object_' + object_uid);
    }






    ///////READING TRANSACTION-DATA///////
    let transaction = findValuesHelper(OriginTrailExport_element, 'TransactionData', []);
    if (transaction.length <= 0) {
        Error('Missing TransactionData element for OriginTrailExport element!');
    } else {
        TransactionsData_element = result.OriginTrailExport.TransactionData;
    }


    ////Reading internal transactions data
    let transaction_list = findValuesHelper(TransactionsData_element, 'InternalTransactionsList', [])
    if (transaction_list.length <= 0) {
        Error('Missing InternalTransactionList element for TransactionData');
    } else {
        InternalTransactionsList_element = TransactionsData_element.InternalTransactionsList;
    }

    let internal_transaction = findValuesHelper(InternalTransactionsList_element, 'InternalTransaction', [])
    if (internal_transaction.length <= 0) {
        Error('Missing InternalTransaction element for InternalTransactionsList!');
    } else {
        InternalTransaction_elements = InternalTransactionsList_element.InternalTransaction;
    }

    if (!(InternalTransaction_elements instanceof Array)) {
        let temp_internaltrans_elements = InternalTransaction_elements;
        InternalTransaction_elements = [];
        InternalTransaction_elements.push(temp_internaltrans_elements);
    }

    for (i in InternalTransaction_elements)
    {
        transaction = InternalTransaction_elements[i];

        let internal_transaction_identifiers = findValuesHelper(transaction, 'InternalTransactionIdentifiers', [])
        if (internal_transaction_identifiers.length <= 0) {
            Error('Missing InternalTransactionIdentifiers element for InternalTransaction!');
        } else {
            InternalTransactionIdentifiers_element = transaction.InternalTransactionIdentifiers;
        }

        let internaltransactionid = findValuesHelper(transaction, 'InternalTransactionId', [])
        if (internaltransactionid.length <= 0) {
            Error('Missing InternalTransactionId for InternalTransaction!');
        } else {
            internal_transaction_id = InternalTransactionIdentifiers_element.InternalTransactionId;
        }

        internal_transaction_uid = 'ot:' + data_provider_id + ':ottid:' + internal_transaction_id;

        let batches_info = findValuesHelper(transaction, 'BatchesInformation', [])
        if (batches_info <= 0) {
            Error('Missing BatchesInformation element for InternalTransaction!');
        } else {
            BatchesInformation_element = transaction.BatchesInformation;
        }
    }

    let inputbatches_list = findValuesHelper(BatchesInformation_element, 'InputBatchesList', [])
    if (inputbatches_list.length <= 0) {
        Error('Missing InputBatchesList for BatchesInformation!');
    } else {
        InputBatchesList_element = BatchesInformation_element.InputBatchesList;
    }

    let batch = findValuesHelper(InputBatchesList_element, 'Batch', [])
    if (batch.length <= 0) {
        Error('Missing Batch for InputBatchesList_element!');
    } else {
        Batch_elements = InputBatchesList_element.Batch;
    }

    if (!(Batch_elements instanceof Array)) {
        let temp_batch_elements = Batch_elements;
        Batch_elements = [];
        Batch_elements.push(temp_batch_elements);
    }

    for (i in Batch_elements)
    {
        batch = Batch_elements[i];
        let batch_ident = findValuesHelper(batch, 'BatchIdentifiers', [])
        if (batch_ident <= 0) {
            Error('Missing BatchIdentifiers element for Batch!');
        } else {
            BatchIdentifiers_element = batch.BatchIdentifiers;
        }

        let batchid = findValuesHelper(BatchIdentifiers_element, 'BatchId', [])
        if (batchid.length <= 0) {
            Error('Missing BatchId for Batch!');
        } else {
            batch_id = BatchIdentifiers_element.BatchId;
        }

        let objectid = findValuesHelper(BatchIdentifiers_element, 'ObjectId', [])
        if (objectid <= 0) {
            Error('Missing ObjectId for Batch!');
        } else {
            object_id = BatchIdentifiers_element.ObjectId;
        }

        if(objects[object_id] == undefined) {
            Error('Key is not defined');
        } else {
            object_key = objects[object_id]['_key'];
        }



        batch_uid = 'ot:' + data_provider_id + ':otoid:' + object_id + ':otbid:' + batch_id;



        let batchdata = findValuesHelper(batch, 'BatchData', [])
        if (batchdata <= 0) {
            Error('Missing BatchData element for Batch!');
        } else {
            BatchData_element = batch.BatchData;
        }

        batches[batch_uid] = {};
        batches[batch_uid]['identifiers'] = BatchIdentifiers_element;
        batches[batch_uid]['identifiers']['uid'] = batch_uid;
        batches[batch_uid]['data'] = BatchData_element;
        batches[batch_uid]['_key'] = md5('batch_' + batch_uid);
        batches[batch_uid]['vertex_key'] = md5('batch_' + batch_uid);

        input_batches.push(md5('batch_' + batch_uid));

        instance_of.push({
                '_from': 'ot_vertices/' + batches[batch_uid]['vertex_key'],
                '_to': 'ot_vertices/' + object_key,
                '_key': md5(batches[batch_uid]['vertex_key'] + '_' + object_key)
            })

    }


    // # Reading output units for internal transaction
    let outputbatcheslist = findValuesHelper(BatchesInformation_element, 'OutputBatchesList', [])
    if (outputbatcheslist.length <= 0) {
        Error('Missing OutputBatchesList element for BatchesInformation');
    } else {
        OutputBatchesList_element = BatchesInformation_element.OutputBatchesList;
    }

    let outbatch = findValuesHelper(OutputBatchesList_element, 'Batch', [])
    if (outbatch.length <= 0) {
        Error('Missing Batch element for OutputBatchesList');
    } else {
        Batch_elements = OutputBatchesList_element.Batch;
    }

    if (!(Batch_elements instanceof Array)) {
        let temp_batch_elements = Batch_elements;
        Batch_elements = [];
        Batch_elements.push(temp_batch_elements);
    }

    for (i in Batch_elements) {
        batch = Batch_elements[i];


        let outbatch = findValuesHelper(batch, 'BatchIdentifiers', [])
        if (outbatch.length <= 0) {
            Error('Missing BatchIdentifiers element for Batch');
        } else {
            BatchIdentifiers_element = batch.BatchIdentifiers;
        }


        let batchidd = findValuesHelper(BatchIdentifiers_element, 'BatchId', [])
        if (batchidd.length <= 0) {
            Error('Missing BatchId element for BatchIdentifiers');
        } else {
            batch_id = BatchIdentifiers_element.BatchId;
        }

        let objecttid = findValuesHelper(BatchIdentifiers_element, 'ObjectId', [])
        if (objecttid.length <= 0) {
            Error('Missing ObjectId element for BatchIdentifiers');
        } else {
            object_id = BatchIdentifiers_element.ObjectId;
        }

        if(objects[object_id] == undefined) {
            Error('Key is not defined');
        } else {
            object_key = objects[object_id]['_key'];
        }

        batch_uid = 'ot:' + data_provider_id + ':otoid:' + object_id + ':otbid:' + batch_id;

        let objdata = findValuesHelper(batch, 'BatchData', [])
        if (objdata.length <= 0) {
            Error('Missing BatchData element for Batch');
        } else {
            BatchData_element = batch.BatchData;
        }

        batches[batch_uid] = {};
        batches[batch_uid]['identifiers'] = BatchIdentifiers_element;
        batches[batch_uid]['identifiers']['uid'] = batch_uid;
        batches[batch_uid]['data'] = BatchData_element;
        batches[batch_uid]['_key'] = md5('batch_' + batch_uid);
        batches[batch_uid]['vertex_key'] = md5('batch_' + batch_uid);

        output_batches.push(md5('batch_' + batch_uid));

        instance_of.push({
            '_from': 'ot_vertices/' + batches[batch_uid]['vertex_key'],
            '_to': 'ot_vertices/' + object_key,
            '_key': md5(batches[batch_uid]['vertex_key'] + '_' + object_key)
        })
    }


    let internaltransactiondata = findValuesHelper(InternalTransaction_elements, 'InternalTransactionData', [])
    if (internaltransactiondata.length <= 0) {
        Error('Missing InternalTransactionData element for InternalTransaction element');
    } else {
        InternalTransactionData_element = InternalTransaction_elements.InternalTransactionData;
    }

    let bussinesloc = findValuesHelper(InternalTransactionData_element, 'BusinessLocationId', [])
    if (bussinesloc.length <= 0) {
        Error('Missing BusinessLocationId element for InternalTransactionData element');
    } else {
        business_location_id = InternalTransactionData_element.BusinessLocationId;
    }

    if(locations[business_location_id] == undefined) {
        Error('Key is not defined');
    } else {
        business_location_key = locations[business_location_id]['_key'];
    }

    transactions[internal_transaction_id] = {};
    transactions[internal_transaction_id]['identifiers'] = InternalTransactionIdentifiers_element;
    transactions[internal_transaction_id]['identifiers']['uid'] = internal_transaction_uid;
    transactions[internal_transaction_id]['identifiers']['TransactionId'] = internal_transaction_id;
    transactions[internal_transaction_id]['data'] = InternalTransactionData_element;
    transactions[internal_transaction_id]['TransactionType'] = 'InternalTransaction';
    transactions[internal_transaction_id]['_key'] = md5('transaction_' + internal_transaction_uid);
    transactions[internal_transaction_id]['vertex_key'] = md5('transaction_' + internal_transaction_uid);

    at.push({
        '_from': 'ot_vertices/' + transactions[internal_transaction_id]['_key'],
        '_to': 'ot_vertices/' + business_location_key,
        '_key': md5(transactions[internal_transaction_id]['_key'] + '_' + business_location_key)
    })

    for(i in input_batches) {
        input_batch.push({
            '_from': 'ot_vertices/' + transactions[internal_transaction_id]['_key'],
            '_to': 'ot_vertices/' + input_batches[i],
            '_key': md5(transactions[internal_transaction_id]['_key'] + '_' + input_batches[i])
        })
    }

    for(i in output_batches) {
            output_batch.push({
                '_from': 'ot_vertices/' + output_batches[i],
                '_to': 'ot_vertices/' + transactions[internal_transaction_id]['_key'],
                '_key': md5(transactions[internal_transaction_id]['_key'] + '_' + output_batches[i])
            })
    }


    //Reading external transactions data

    let externaltransactionslis = findValuesHelper(TransactionsData_element, 'ExternalTransactionsList', [])
    if (externaltransactionslis.length <= 0) {
        Error('Missing ExternalTransactionsList element for TransactionData element');
    } else {
        ExternalTransactionsList_element = TransactionsData_element.ExternalTransactionsList;
    }

    let external = findValuesHelper(ExternalTransactionsList_element, 'ExternalTransaction', [])
    if (external.length <= 0) {
        Error('Missing ExternalTransaction element for ExternalTransactionsList element');
    } else {
        ExternalTransaction_elements = TransactionsData_element.ExternalTransactionsList;
    }

    if (!(ExternalTransaction_elements instanceof Array)) {
        let temp_external_elements = ExternalTransaction_elements;
        ExternalTransaction_elements = [];
        ExternalTransaction_elements.push(temp_external_elements);
    }

    for(i in ExternalTransaction_elements) {
        externaltransac = ExternalTransaction_elements[i];

        let externalident = findValuesHelper(externaltransac, 'ExternalTransactionIdentifiers', [])
        if (externalident.length <= 0) {
            Error('Missing ExternalTransactionIdentifiers element for ExternalTransaction element');
        } else {
            ExternalTransactionIdentifiers_element = externaltransac.ExternalTransactionIdentifiers;
        }

        let externalid = findValuesHelper(ExternalTransactionIdentifiers_element, 'ExternalTransactionId', [])
        if (externalid.length <= 0) {
            Error('Missing ExternalTransactionId element for ExternalTransactionIdentifiers element');
        } else {
            external_transaction_id = ExternalTransactionIdentifiers_element.ExternalTransactionId;
        }

        external_transaction_uid = 'ot:' + data_provider_id + ':ottid:' + external_transaction_id;

        let batchesinfo = findValuesHelper(externaltransac, 'BatchesInformation', [])
        if (batchesinfo.length <= 0) {
            Error('Missing BatchesInformation element for ExternalTransaction element');
        } else {
            BatchesInformation_element = externaltransac.BatchesInformation;
        }

        //Reading batches for external transaction

        let batchlist = findValuesHelper(BatchesInformation_element, 'BatchesList', [])
        if (batchlist.length <= 0) {
            Error('Missing BatchesList element for BatchesInformation element');
        } else {
            BatchesList_element = BatchesInformation_element.BatchesList;
        }

        let bat = findValuesHelper(BatchesList_element, 'Batch', [])
        if (bat.length <= 0) {
            Error('Missing Batch element for BatchesIList element');
        } else {
            Batch_elements = BatchesList_element.Batch;
        }

        if (!(Batch_elements instanceof Array)) {
            let temp_bat_elements = Batch_elements;
            Batch_elements = [];
            Batch_elements.push(temp_bat_elements);
        }

        transfered_batches = [];

        for (i in Batch_elements) {
            bat = Batch_elements[i];

            let batiden = findValuesHelper(bat, 'BatchIdentifiers', [])
            if (batiden.length <= 0) {
                Error('Missing BatchIdentifiers element for Batch');
            } else {
                BatchIdentifiers_element = bat.BatchIdentifiers;
            }

            let batid = findValuesHelper(BatchIdentifiers_element, 'BatchId', [])
            if (batid.length <= 0) {
                Error('Missing BatchId element for BatchIdentifiers element');
            } else {
                batch_id = BatchIdentifiers_element.BatchId;
            }

            let objecid = findValuesHelper(BatchIdentifiers_element, 'ObjectId', [])
            if (objecid.length <= 0) {
                Error('Missing ObjectId element for BatchIdentifiers element');
            } else {
                object_id = BatchIdentifiers_element.ObjectId;
            }

            if(objects[object_id] == undefined) {
                Error('Key is not defined');
            } else {
                object_key = objects[object_id]['_key'];
            }

            batch_uid = 'ot:' + data_provider_id + ':otoid:' + object_id + ':otbid:' + batch_id;

            let batdata = findValuesHelper(bat, 'BatchData', [])
            if (batdata.length <= 0) {
                Error('Missing BatchData element for Batch');
            } else {
                BatchData_element = bat.BatchData;
            }

            batches[batch_uid] = {};
            batches[batch_uid]['identifiers'] = BatchIdentifiers_element;
            batches[batch_uid]['identifiers']['uid'] = batch_uid;
            batches[batch_uid]['data'] = BatchData_element;
            batches[batch_uid]['_key'] = md5('batch_' + batch_uid);
            batches[batch_uid]['vertex_key'] = md5('batch_' + batch_uid);

            transfered_batches.push(md5('batch_' + batch_uid));

            instance_of.push({
                '_from': 'ot_vertices/' + batches[batch_uid]['vertex_key'],
                '_to': 'ot_vertices/' + object_key,
                '_key': md5(batches[batch_uid]['vertex_key'] + '_' + object_key)
            })


        }

        let exttrandat = findValuesHelper(externaltransac, 'ExternalTransactionData', [])
        if (exttrandat.length <= 0) {
            Error('Missing ExternalTransactionData element for ExternalTransaction element');
        } else {
            ExternalTransactionData_element = externaltransac.ExternalTransactionData;
        }

        let bussloc_id = findValuesHelper(ExternalTransactionData_element, 'BusinessLocationId', [])
        if (bussloc_id.length <= 0) {
            Error('Missing BusinessLocationId element for ExternalTransactionData element');
        } else {
            business_location_id = ExternalTransactionData_element.BusinessLocationId;
        }

        if(locations[business_location_id] == undefined) {
            Error('Key is not defined');
        } else {
            business_location_key = locations[business_location_id]['_key'];
        }

        source_business_location_id = ExternalTransactionData_element['SourceBusinessLocationId'];

        if(locations[source_business_location_id] == undefined) {
            Error('Key is not defined');
        } else {
            source_business_location_key = locations[source_business_location_id]['_key'];
        }

        dest_business_location_id = ExternalTransactionData_element['DestinationBusinessLocationId'];

        if(locations[dest_business_location_id] == undefined) {
            Error('Key is not defined');
        } else {
            dest_business_location_key = locations[dest_business_location_id]['_key'];
        }

        let transflow = findValuesHelper(ExternalTransactionData_element, 'TransactionFlow', [])
        if (transflow.length <= 0) {
            Error('Missing TransactionFlow element for ExternalTransaction element');
        } else {
            transaction_flow = ExternalTransactionData_element.TransactionFlow;
        }

        if (!transaction_flow == 'Input' || transaction_flow == 'Output') {
            Error('Invalid value for TransactionFlow element!');
        }

        transactions[external_transaction_id] = {};
        transactions[external_transaction_id]['identifiers'] = ExternalTransactionIdentifiers_element;
        transactions[external_transaction_id]['identifiers']['uid'] = external_transaction_uid;
        transactions[external_transaction_id]['identifiers']['TransactionId'] = external_transaction_id;
        transactions[external_transaction_id]['transcation_flow'] = transaction_flow;
        transactions[external_transaction_id]['data'] = ExternalTransactionData_element;
        transactions[internal_transaction_id]['TransactionType'] = 'ExternalTransaction';
        transactions[external_transaction_id]['_key'] = md5('transaction_' + external_transaction_uid);
        transactions[internal_transaction_id]['vertex_key'] = md5('transaction_' + internal_transaction_uid);

        at.push({
            '_from': 'ot_vertices/' + transactions[external_transaction_id]['_key'],
            '_to': 'ot_vertices/' + business_location_key,
            '_key': md5(transactions[external_transaction_id]['_key'] + '_' + business_location_key)
        })

        from.push({
            '_from': 'ot_vertices/' + transactions[external_transaction_id]['_key'],
            '_to': 'ot_vertices/' + source_business_location_key,
            '_key': md5(transactions[external_transaction_id]['_key'] + '_' + source_business_location_key)
        })

        to.push({
            '_from': 'ot_vertices/' + transactions[external_transaction_id]['_key'],
            '_to': 'ot_vertices/' + dest_business_location_key,
            '_key': md5(transactions[external_transaction_id]['_key'] + '_' + dest_business_location_key)
        })

        for (i in transfered_batches) {
            of_batch.push({
                '_from': 'ot_vertices/' + transfered_batches[i],
                '_to': 'ot_vertices/' + transactions[external_transaction_id]['_key'],
                '_key': md5(transactions[external_transaction_id]['_key'] + '_' + transfered_batches[i])
            })
        }


    }

    ///Reading visibility data

    let visibility_eventdata = findValuesHelper(OriginTrailExport_element, 'VisibilityEventData', [])
    if (visibility_eventdata.length <= 0) {
        Error('Missing VisibilityEventData element for OriginTrailExport element');
    } else {
        VisibilityEventData_element = OriginTrailExport_element.VisibilityEventData;
    }

    let visibility_event_li = findValuesHelper(VisibilityEventData_element, 'VisibilityEventsList', [])
    if (visibility_event_li.length <= 0) {
        Error('Missing VisibilityEventsList element for VisibilityEventData element');
    } else {
        VisibilityEventsList_element = VisibilityEventData_element.VisibilityEventData;
    }

    let event = findValuesHelper(VisibilityEventsList_element, 'Event', [])
    if (event.length <= 0) {
        Error('Missing Event element for VisibilityEventsList element');
    } else {
        Event_elements = VisibilityEventsList_element.Event;
    }

    if (!(Event_elements instanceof Array)) {
        let temp_event_elements = Event_elements;
        Event_elements = [];
        Event_elements.push(temp_event_elements);
    }

    for (i in Event_elements) {
        e_event = Event_elements[i];

        let event_ident = findValuesHelper(e_event, 'EventIdentifiers', [])
        if (event_ident.length <= 0) {
            Error('Missing EventIdentifiers element for Event');
        } else {
            EventIdentifiers_element = e_event.EventIdentifiers;
        }

        let eventid = findValuesHelper(EventIdentifiers_element, 'EventId', [])
        if (eventid.length <= 0) {
            Error('Missing EventId element for EventIdentifiers');
        } else {
            event_id = EventIdentifiers_element.EventId;
        }

        event_uid = 'ot:' + data_provider_id + ':oteid:' + event_id;

        let obid = findValuesHelper(EventIdentifiers_element, 'ObjectId', [])
        if (obid.length <= 0) {
            Error('Missing ObjectId element for EventIdentifiers');
        } else {
            object_id = EventIdentifiers_element.ObjectId;
        }

        if(objects[object_id] == undefined) {
            Error('Key is not defined');
        } else {
            object_key = objects[object_id]['_key'];
        }

        let bacid = findValuesHelper(EventIdentifiers_element, 'BatchId', [])
        if (bacid.length <= 0) {
            Error('Missing ObjectId element for EventIdentifiers');
        } else {
            batch_id = EventIdentifiers_element.BatchId;
        }

        batch_uid = 'ot:' + data_provider_id + ':otoid:'+ object_id + ':otbid:' + batch_id;

        if(batches[batch_uid] == undefined) {
            Error('Key is not defined');
        } else {
            batch_key = batches[batch_uid]['_key'];
        }

        let eventdat = findValuesHelper(e_event, 'EventData', [])
        if (eventdat.length <= 0) {
            Error('Missing EventData element for Event');
        } else {
            EventData_element = e_event.EventData;
        }

        events[event_id] = {};
        events[event_id]['identifiers'] = EventIdentifiers_element;
        events[event_id]['identifiers']['uid'] = event_uid;
        events[event_id]['data'] = EventData_element;
        events[event_id]['_key'] = md5('event_' + event_uid);
        events[event_id]['vertex_key'] = md5('event_' + event_uid);

        traced_by.push({
            '_from': 'ot_vertices/' + batch_key,
            '_to': 'ot_vertices/' + events[event_id]['vertex_key'],
            '_key': md5(batch_key + '_' + events[event_id]['vertex_key'])
        })


    }




    console.log(events);




    //***** PARTICIPANTS UPISIVANJE *******//
    // console.log(participants)
    var tmp = []

    for(i in participants) {
        tmp.push(participants[i]);
    }

    async.each(tmp, function(participant, next) {
        participant.vertex_type = 'PARTICIPANTS';
        db.addVertex('ot_vertices', participant, function () {
            console.log('upisano')
            next();
        });
    }, function() {
        console.log('Upisivanje participants gotovo')
    });



    //***** LOCATIONS UPISIVANJE *******//
    // console.log(locations);
    var locations_temp = [];

    for(i in locations) {
        locations_temp.push(locations[i]);
    }

    async.each(locations_temp, function (location, next) {
        location.vertex_type = 'LOCATIONS';
        db.addVertex('ot_vertices', location, function () {
            console.log('upisano');
            next();
        });
    }, function () {
        console.log('Upisivanje locations gotovo');
    });


    //***** OBJECTS UPISIVANJE *******//
    var temp_objects = [];

    for (i in objects) {
        temp_objects.push(objects[i]);
    }

    async.each(temp_objects, function (object, next) {
        object.vertex_type = 'OBJECTS';
        db.addVertex('ot_vertices', object, function () {
            console.log('object upisan');
            next();
        })
    }, function () {
        console.log('svi objekti upisani');
    });

    //***** BATCHES UPISIVANJE *******//
    var temp_batches = [];

    for (i in batches) {
        temp_batches.push(batches[i]);
    }

    async.each(temp_batches, function (batch, next) {
        batch.vertex_type = 'BATCHES';
        db.addVertex('ot_vertices', batch, function () {
            console.log('batch upisan');
            next();
        })
    }, function () {
        console.log('svi batches upisani');
    });


    // var edge = {};
    // edge._key = '123213123213'
    // edge._from = 'ot_vertices/' + tmp[0]._key;
    // edge._to = 'ot_vertices/' + tmp[1]._key;


    //******* UPISIVANJE CVOROVA *******//

    async.each(owned_by, function (own, next) {
        db.addEdge('ot_edges', own, function () {
            console.log('edge upisan');
            next();
        })
    }, function () {
        console.log('svi edges upisani');
    });

    async.each(input_batches, function (input, next) {
        db.addEdge('ot_edges', input, function () {
            console.log('input edge upisan');
            next();
        })
    }, function () {
        console.log('svi input edges upisani');
    });

    async.each(instance_of, function (input, next) {
        db.addEdge('ot_edges', input, function () {
            console.log('input edge upisan');
            next();
        })
    }, function () {
        console.log('svi input edges upisani');
    });





    // console.log(JSON.stringify(objects, null, 4));
    var json = JSON.stringify(objects, null, 4);
    fs.writeFile('result-2.json', json, 'utf8', function (err) {
        if (err) console.log(err);
    });


})


