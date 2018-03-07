/* eslint-disable indent,no-undef,semi,semi,no-unused-vars,no-unused-vars */
let parseString = require('xml2js').parseString;
const fs = require('fs');
let md5 = require('md5');
let xml;
let db = require('../modules/database');


let Database = require('arangojs').Database;
let aqlQuery = require('arangojs').aqlQuery;
// let db = new Database();
// db.useDatabase('ot-node');
// db.useBasicAuth('root', 'root');

let collection = db.collection('firstCollection');

db.query(aqlQuery`
  FOR doc IN ${collection}
  LET value = 100 + doc.value
  INSERT {
    _key: CONCAT("new", doc.value),
    value
  } INTO ${collection}
  RETURN NEW
`).then(
    cursor => cursor.map(doc => doc._key)
).then(
    keys => console.log('Inserted documents:', keys.join(', ')),
    err => console.error('Failed to insert:', err)
);


//language=HTML format=true
xml = `<OriginTrailExport version="1.4">
    <DataProvider> <!-- Unique ID for supply chain entity that provides the file -->
        <ParticipantId>WALLET_ID</ParticipantId>
    </DataProvider>
    <MasterData>
        <!-- 
        Master data is the core data that is essential to operations in a specific business or business unit. It represents the business objects which are agreed on and shared across the enterprise. It can cover relatively static reference data, unstructured, analytical, hierarchical and metadata. In our current XML structure, the Master Data entities are:

            - ParticipantsList and Participant – Description of all entities (participants) in the supply chain
            - BusinessLocationsList and BusinessLocation - describe all physical or system locations where business processes are executed
            - ObjectsList and Object – entities that are subjects of business processes (items or goods being described) 
        -->
        <ParticipantsList>	<!-- Description of all entities (participants) in supply chain -->
            <Participant>
                <ParticipantIdentifiers> <!-- Required -->
                    <ParticipantId>PROVIDER_ID</ParticipantId> <!-- Required - During the test phase, you can obtain your Unique ID here https://origintrail.io/node-registration -->
                    <AnotherIdentifier>SomeValue</AnotherIdentifier> <!-- Optional: you may define and add more identifiers if needed -->
                </ParticipantIdentifiers>
                <ParticipantData>
                    <!--  ParticipantData tag is required, but all the contents inside are optional -->
                    <Name> <!-- Required -->
                        <en>Green Warehouse Ltd</en>
                        <de>Gruene Warehouse Ltd</de>
                        <!-- languages are defined by ISO 639-1 (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)-->
                    </Name>
                    <Location> <!-- Optional -->
                        <Address>Data Boulevard 01</Address>
                        <City>Traceshire</City>
                        <Country>Cryptonia</Country>
                        <Zip>10000</Zip>
                        <GeoLocation>
                            <Latitude>00.0000</Latitude>
                            <Longitude>00.0000</Longitude>
                        </GeoLocation>
                    </Location>
                    <AdditionalInformation> Lorem Ipsum </AdditionalInformation> <!-- Optional: you may add additional tags if needed -->
                </ParticipantData>
            </Participant>
            <Participant>
                <ParticipantIdentifiers>
                    <ParticipantId>PARTNER_ID</ParticipantId>
                </ParticipantIdentifiers>
                <ParticipantData>
                    <Name>
                        <EN>Partner</EN>
                    </Name>
                    <Location>
                        <Address>Farmer's Street 01B</Address>
                        <City>Bytesfield</City>
                        <Country>Cryptonia</Country>
                        <Zip>20000</Zip>
                        <GeoLocation>
                            <Latitude>00.0000</Latitude>
                            <Longitude>00.0000</Longitude>
                        </GeoLocation>
                    </Location>
                </ParticipantData>
            </Participant>
        </ParticipantsList>
        <BusinessLocationsList> <!-- This tag describes all physical locations where business processes are executed -->
            <BusinessLocation>
                <BusinessLocationOwnerId>PROVIDER_ID</BusinessLocationOwnerId> <!-- Required. Corresponds to ParticipantId in ParticipantsList above -->
                <BusinessLocationIdentifiers> <!-- Required -->
                    <BusinessLocationId>WAREHOUSE_1</BusinessLocationId> <!-- Required -->
                    <AnotherIdentifier>SomeValue</AnotherIdentifier> <!-- Optional: you may define and add more identifiers if needed -->
                </BusinessLocationIdentifiers>
                <BusinessLocationData> <!-- Required -->
                    <Name> <!-- Required -->
                        <en>Provider's Warehouse</en>
                        <de>Das Warehouse des Anbieters</de>
                        <!-- languages are defined by ISO 639-1 (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)-->
                    </Name>
                    <BusinessLocationType>Warehouse</BusinessLocationType> <!-- Required -->
                    <Location> <!-- Optional -->
                        <Address>Data Boulevard 02</Address>
                        <City>Traceshire</City>
                        <Country>Cryptonia</Country>
                        <Zip>10000</Zip>
                        <GeoLocation>
                            <Latitude>00.0000</Latitude>
                            <Longitude>00.0000</Longitude>
                        </GeoLocation>
                    </Location>
                    <AdditionalInformation> Lorem Ipsum </AdditionalInformation> <!-- Optional: you may add additional tags if needed -->
                </BusinessLocationData>
            </BusinessLocation>
            <BusinessLocation>
                <BusinessLocationOwnerId>PARTNER_ID</BusinessLocationOwnerId>
                <BusinessLocationIdentifiers>
                    <BusinessLocationId>FARM_1</BusinessLocationId>
                </BusinessLocationIdentifiers>
                <BusinessLocationData>
                    <BusinessLocationName>
                        <EN>Partner's Farm</EN>
                    </BusinessLocationName>
                    <BusinessLocationType>Farm</BusinessLocationType>
                    <Location>
                        <Address>Farmer's Street 01B</Address>
                        <City>Bytesfield</City>
                        <Country>Cryptonia</Country>
                        <Zip>20000</Zip>
                        <GeoLocation>
                            <Latitude>00.0000</Latitude>
                            <Longitude>00.0000</Longitude>
                        </GeoLocation>
                    </Location>
                </BusinessLocationData>
            </BusinessLocation>
        </BusinessLocationsList>
        <ObjectsList> <!-- Object descriptions - i.e. product (object) master data, involved in the supply chain -->
            <Object>
                <ObjectIdentifiers> <!-- Required: these identifiers usually correspond to the codes available on the packaging of the object. All codes are supported -->
                    <ObjectId>OBJECT_1</ObjectId> <!-- Required: this should be the preferred product code in the supply chain. At least one code is required and this should be in ObjectId. Example here is ean13 -->
                    <ean13>1234567890123</ean13> <!-- Optional, but very useful: Repeat the above code also in it's human readable tag -->
                    <ean8>12345678</ean8> <!-- Optional: add more codes if useful -->
                    <qrCode>5u34bgouenf089dsavbna97ybf84rwens0vub9sudv</qrCode> <!-- Optional -->
                    <rfid>5u34bgouenf089dsavbna97ybf84rwens0vub9sud0</rfid> <!-- Optional -->
                    <rfid>5u34bgouenf089dsavbna97ybf84rwens0vub9sud1</rfid> <!-- Optional, can handle more than one of the same code -->
                    <dataMatrix>codeValue-dataMatrix</dataMatrix> <!-- Optional -->
                    <upcA>codeValue-upcA</upcA> <!-- Optional -->
                    <someOtherCode>codeValue-someOtherCode</someOtherCode> <!-- Optional -->
                </ObjectIdentifiers>
                <ObjectData> <!-- Required: contains information about the object, other than the Identifiers -->
                    <Name> <!-- Required -->
                        <en>Raw crypto Carrots 50 Kg</en>
                        <de>Rohe Krypto Karotten 50 Kg</de> <!-- languages are defined by ISO 639-1 (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)-->
                    </Name>
                    <ObjectType>Vegetable</ObjectType>
                    <ObjectCategory>Carrot</ObjectCategory>
                    <ObjectDescription> <!-- Optional -->
                        <en>The cryptiest carrots in the entire Cryptonia, packed in 50 Kg package.</en>
                    </ObjectDescription>
                    <AdditionalInformation> Lorem Ipsum </AdditionalInformation> <!-- Optional: you may add additional tags if needed -->
                </ObjectData>
            </Object>
            <Object>
                <ObjectIdentifiers>
                    <ObjectId>OBJECT_2</ObjectId>
                    <ean13>1234567890124</ean13>
                </ObjectIdentifiers>
                <ObjectData>
                    <Name>
                        <EN>Packed crypto Carrots 1 Kg</EN>
                    </Name>
                    <ObjectType>Vegetable</ObjectType>
                    <ObjectCategory>Carrot</ObjectCategory>
                    <ObjectDescription>
                        <en>The cryptiest carrots in the entire Cryptonia, packed for retail in 1 Kg package.</en>
                    </ObjectDescription>
                </ObjectData>
            </Object>
        </ObjectsList>
    </MasterData>
    <TransactionData>
        <InternalTransactionsList>
            <InternalTransaction>
                <InternalTransactionIdentifiers> <!-- Required -->
                    <InternalTransactionId>TRANSACTION_1</InternalTransactionId> <!-- Required -->
                    <InternalTransactionDocumentId>TRANSACTION_DOCUMENT_1</InternalTransactionDocumentId> <!-- Optional -->
                    <!-- <AdditionalInformation> Lorem Ipsum </AdditionalInformation> Optional -->
                </InternalTransactionIdentifiers>
                <BatchesInformation> <!-- Required -->
                    <InputBatchesList> <!-- Optional -->
                        <Batch>
                            <BatchIdentifiers> <!-- Required -->
                                <BatchId>INPUT_UNIT_1</BatchId> <!-- Required -->
                                <ObjectId>OBJECT_1</ObjectId> <!-- Required -->
                                <ExpirationDate>2020-01-01</ExpirationDate> <!-- Optional -->
                                <Lot>012</Lot> <!-- Optional -->
                                <!-- <abc>Lorem Ipsum</abc> Optional -->
                            </BatchIdentifiers>
                            <BatchData> <!-- Required, 1:N is requirement -->
                                <QuantitiesDataList>
                                    <QuantityData>
                                        <Quantity>50.0</Quantity>
                                        <Measure>Kg</Measure>
                                    </QuantityData>
                                    <QuantityData>
                                        <Quantity>1</Quantity>
                                        <Measure>Batch</Measure>
                                    </QuantityData>
                                </QuantitiesDataList>
                            </BatchData>
                        </Batch>
                    </InputBatchesList>
                    <OutputBatchesList> <!-- Required -->
                        <Batch>
                            <BatchIdentifiers>
                                <BatchId>OUTPUT_UNIT_1</BatchId>
                                <ObjectId>OBJECT_2</ObjectId>
                                <Lot>123L</Lot>
                                <ExpirationDate>2020-01-01</ExpirationDate>
                            </BatchIdentifiers>
                            <BatchData>
                                <QuantitiesDataList>
                                    <QuantityData>
                                        <Quantity>50.0</Quantity>
                                        <Measure>Kg</Measure>
                                    </QuantityData>
                                    <QuantityData>
                                        <Quantity>50</Quantity>
                                        <Measure>Batch</Measure>
                                    </QuantityData>
                                </QuantitiesDataList>
                            </BatchData>
                        </Batch>
                    </OutputBatchesList>
                </BatchesInformation>
                <InternalTransactionData> <!-- Required -->
                    <TransactionTime>21.01.2018T00:00:00</TransactionTime>
                    <BusinessProcess>Packaging</BusinessProcess>
                    <BusinessLocationId>WAREHOUSE_1</BusinessLocationId> <!-- Required -->
                    <BusinessProcessDescription>Packaging carrots for retail</BusinessProcessDescription>
                    <AdditionalInformation> <!-- Optional -->
                        <Note>Machine 1 jammed for 5 minutes</Note>
                    </AdditionalInformation>
                </InternalTransactionData>
            </InternalTransaction>
        </InternalTransactionsList>
        <ExternalTransactionsList>
            <ExternalTransaction>
                <ExternalTransactionIdentifiers>
                    <ExternalTransactionId>TRANSACTION_2</ExternalTransactionId>
                    <ExternalTransactionDocumentId>TRANSACTION_DOCUMENT_2</ExternalTransactionDocumentId>
                </ExternalTransactionIdentifiers>
                <BatchesInformation>
                    <BatchesList>
                        <Batch>
                            <BatchIdentifiers>
                                <BatchId>INPUT_UNIT_1</BatchId>
                                <ObjectId>OBJECT_1</ObjectId>
                                <Lot>123</Lot>
                                <ExpirationDate>2020-01-01</ExpirationDate>
                            </BatchIdentifiers>
                            <BatchData>
                                <QuantitiesDataList>
                                    <QuantityData>
                                        <Quantity>50.0</Quantity>
                                        <Measure>Kg</Measure>
                                    </QuantityData>
                                    <QuantityData>
                                        <Quantity>1</Quantity>
                                        <Measure>Batch</Measure>
                                    </QuantityData>
                                </QuantitiesDataList>
                            </BatchData>
                        </Batch>
                    </BatchesList>
                </BatchesInformation>
                <ExternalTransactionData>
                    <TransactionTime>21.12.2012T00:00:00</TransactionTime>
                    <BusinessProcess>Purchase</BusinessProcess>
                    <BusinessLocationId>WAREHOUSE_1</BusinessLocationId>
                    <TransactionFlow>Input</TransactionFlow> <!-- Required -->
                    <SourceBusinessLocationId>FARM_1</SourceBusinessLocationId>
                    <DestinationBusinessLocationId>WAREHOUSE_1</DestinationBusinessLocationId>
                    <BusinessProcessDescription>Regular Purchase</BusinessProcessDescription>
                    <AdditionalInformation> <!-- Optional -->
                        <Price>
                            <Value>100</Value>
                            <VAT>1%</VAT>
                            <Total>101</Total>
                            <Currency>USD</Currency>
                            <Discount>0%</Discount>
                        </Price>
                        <PaymentType>Bill</PaymentType>
                    </AdditionalInformation>
                </ExternalTransactionData>
            </ExternalTransaction>
        </ExternalTransactionsList>
    </TransactionData>

    <VisibilityEventData>
        <!-- Visibility event data covers details about physical or digital activity in the supply chain of an object batch (explained by the master and transaction data above). It references information collected by either sensors or other external entities (i.e. lab test results) which provide more details about a specific object batch in a specific point in time or time span.  -->
        <VisibilityEventsList>
            <Event>
                <EventIdentifiers> <!-- Required -->
                    <EventId>EVENT_1</EventId> <!-- Required -->
                    <BatchId>OUTPUT_UNIT_1</BatchId> <!-- Required -->
                    <ObjectId>OBJECT_2</ObjectId> <!-- Required -->
                </EventIdentifiers>
                <EventData> <!-- Required -->
                    <TemperatureData>
                        <MeasurementStartTimestamp>2018-01-01T00:00:00</MeasurementStartTimestamp>
                        <MeasurementEndTimestamp>2018-01-02T00:00:00</MeasurementEndTimestamp>
                        <AverageTemperature>27</AverageTemperature>
                        <MinimumTemperature>18</MinimumTemperature>
                        <MaximumTemperature>31</MaximumTemperature>
                        <Measure>C</Measure> <!-- Measurment unit -->
                        <MeasurementSequence>
                            <!-- Optional: MeasurementSequence contains sample level measurement data in the form of timestamp/value pairs -->
                            <Measurement>
                                <MeasurementTimestamp>2018-01-01T00:00:00</MeasurementTimestamp>
                                <MeasurementValue>24</MeasurementValue>
                                <Measure>C</Measure>
                            </Measurement>
                            <Measurement>
                                <MeasurementTimestamp>2018-01-01T00:00:01</MeasurementTimestamp>
                                <MeasurementValue>27</MeasurementValue>
                                <Measure>C</Measure>
                            </Measurement>
                            <Measurement>
                                <MeasurementTimestamp>2018-01-01T00:00:02</MeasurementTimestamp>
                                <MeasurementValue>25</MeasurementValue>
                                <Measure>C</Measure>
                            </Measurement>
                            <Measurement>
                                <MeasurementTimestamp>2018-01-01T00:00:03</MeasurementTimestamp>
                                <MeasurementValue>26</MeasurementValue>
                                <Measure>C</Measure>
                            </Measurement>
                        </MeasurementSequence>
                        <AdditionalInformation> <!-- Optional -->
                            <DeviceId>TMP123</DeviceId>
                        </AdditionalInformation>
                    </TemperatureData>
                    <HumidityData>
                        <MeasurementStartTimestamp>2018-01-01T00:00:00</MeasurementStartTimestamp>
                        <MeasurementEndTimestamp>2018-01-02T00:00:00</MeasurementEndTimestamp>
                        <AverageHumidity>50</AverageHumidity>
                        <MinimumHumidity>35</MinimumHumidity>
                        <MaximumHumidity>75</MaximumHumidity>
                        <Measure>%</Measure>
                        <MeasurementSequence>
                            <!-- Optional: MeasurementSequence contains sample level measurement data in the form of timestamp/value pairs -->
                            <Measurement>
                                <MeasurementTimestamp>2018-01-01T01:00:00</MeasurementTimestamp>
                                <MeasurementValue>55</MeasurementValue>
                                <Measure>%</Measure>
                            </Measurement>
                            <Measurement>
                                <MeasurementTimestamp>2018-01-01T03:00:00</MeasurementTimestamp>
                                <MeasurementValue>27</MeasurementValue>
                                <Measure>%</Measure>
                            </Measurement>
                            <Measurement>
                                <MeasurementTimestamp>2018-01-01T05:00:00</MeasurementTimestamp>
                                <MeasurementValue>67</MeasurementValue>
                                <Measure>%</Measure>
                            </Measurement>
                            <Measurement>
                                <MeasurementTimestamp>2018-01-01T07:00:00</MeasurementTimestamp>
                                <MeasurementValue>75</MeasurementValue>
                                <Measure>%</Measure>
                            </Measurement>
                        </MeasurementSequence>
                        <AdditionalInformation> <!-- Optional -->
                            <DeviceId>HUM123</DeviceId>
                        </AdditionalInformation>
                    </HumidityData>
                </EventData>
            </Event>
        </VisibilityEventsList>
    </VisibilityEventData>
</OriginTrailExport>`

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


parseString(xml, {explicitArray: false} , function (err, result) {

    let participants = {};
    let locations = {};
    let objects = {};
    let baches = {};
    let transactions = {};
    let events = {};


    let owned_by = [];
    let at = [];
    let input_batch = [];
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
            '_from': locations[business_location_id]['_key'],
            '_to': business_location_owner_key,
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
        Error('Missing InternalTransaction element for InternalTransactionsList!');
    } else {
        InternalTransaction_elements = TransactionsData_element.InternalTransaction;
    }







    // let ima = findValuesHelper(objects, 'ean14', []);
    // if (ima.length > 0) {
    //     console.log('ima')
    // } else {
    //     console.log('nema')
    // }

    // console.log(JSON.stringify(objects, null, 4));
    var json = JSON.stringify(objects, null, 4);
    fs.writeFile('result-2.json', json, 'utf8', function (err) {
        if (err) console.log(err);
    });


});

