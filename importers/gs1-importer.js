/* eslint-disable no-unused-vars,no-mixed-spaces-and-tabs */
let parseString = require('xml2js').parseString;
const fs = require('fs');
let md5 = require('md5');
let xml;
const db = require('../modules/database')();
const async = require('async');
var path = require('path');

var gs1_xml;
gs1_xml = `<?xml version="1.0" encoding="UTF-8"?>
<!--Sample XML file for GS1 OriginTrail importer with Header with master data and ObjectEvent-->
<epcis:EPCISDocument xmlns:epcis="urn:epcglobal:epcis:xsd:1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:n1="http://www.altova.com/samplexml/other-namespace" xmlns:sbdh="http://www.unece.org/cefact/namespaces/StandardBusinessDocumentHeader" schemaVersion="0" creationDate="2001-12-17T09:30:47Z" xsi:schemaLocation="urn:epcglobal:epcis-masterdata:xsd:1 EPCglobal-epcis-masterdata-1_2.xsd">
	<EPCISHeader>
		<sbdh:StandardBusinessDocumentHeader>
			<sbdh:HeaderVersion>1.0</sbdh:HeaderVersion>
			<sbdh:Sender><!-- Mandatory -->
				<!--  <sbdh:Identifier Authority="EAN.UCC">2203148000007</sbdh:Identifier> -->
				<sbdh:Identifier Authority="OriginTrail">SENDER_PROVIDER_ID</sbdh:Identifier> <!-- Mandatory --> <!-- Creator PROVIDER_ID-->
				<sbdh:ContactInformation> <!-- Mandatory-->
					<sbdh:Contact>Mary Smith</sbdh:Contact> <!-- Mandatory -->
					<sbdh:EmailAddress>Mary_Smith@wines.com</sbdh:EmailAddress>	<!-- Optional -->				
				</sbdh:ContactInformation>
			</sbdh:Sender>
			<sbdh:Receiver> <!-- Mandatory -->
				<sbdh:Identifier Authority="OriginTrail">RECEIVER_PROVIDER_ID</sbdh:Identifier>  <!-- Mandatory-->
				<sbdh:ContactInformation> <!-- Mandatory-->
					<sbdh:Contact>John Doe</sbdh:Contact> <!-- Mandatory -->
					<sbdh:EmailAddress>John_Doe@purchasing.XYZretailer.com</sbdh:EmailAddress> <!-- Optional -->
				</sbdh:ContactInformation>
			</sbdh:Receiver>
			<sbdh:DocumentIdentification> <!-- Mandatory-->
				<sbdh:Standard>GS1</sbdh:Standard> <!-- WE CAN PUT OUR IMPORTER VERSION -->
				<sbdh:TypeVersion>V1.3</sbdh:TypeVersion> <!-- Document version-->
				<sbdh:InstanceIdentifier>100003</sbdh:InstanceIdentifier> <!-- UNIQUE IDENTIFIER OF DOCUMENT - PRIMARY KEY IN ERP -->
				<sbdh:Type>Ordering</sbdh:Type> <!-- DEFINED IN SCHEMA Example; order, invoice, debitCreditAdvice -->
				<sbdh:CreationDateAndTime>2003-05-09T00:31:52Z</sbdh:CreationDateAndTime> <!-- Optional -->		
			</sbdh:DocumentIdentification>
			<sbdh:BusinessScope> <!-- Optional -->
				<sbdh:Scope>
					<sbdh:Type>BusinessProcess</sbdh:Type>
					<sbdh:InstanceIdentifier>Order-Sell/version2-251</sbdh:InstanceIdentifier>
					<sbdh:Identifier>EDI-Order-Sell</sbdh:Identifier>
				</sbdh:Scope>
			</sbdh:BusinessScope>			
		</sbdh:StandardBusinessDocumentHeader>
		<extension>
			<EPCISMasterData>
				<VocabularyList>
					<!-- GS1 standard -->	
					<Vocabulary type="urn:epcglobal:epcis:vtype:BusinessLocation">				
						<VocabularyElementList>										
							<VocabularyElement id="urn:epc:id:sgln:6104898.16234.0">																
								<attribute id="urn:ts:location:name">XYZ Retail</attribute>				
								<attribute id="urn:ts:location:street1">Via Ignatia 768</attribute>				
								<attribute id="urn:ts:location:city">Bari</attribute>				
								<attribute id="urn:ts:location:stateOrRegion">Puglia</attribute>				
								<attribute id="urn:ts:location:postalCode">98852</attribute>
								<attribute id="urn:ts:location:country">IT</attribute>
								<children>
									<id>6104898.16234.1</id>
									<id>6104898.16234.2</id>
									<id>6104898.16234.3</id>
								</children>
								<extension>
									<attribute id="urn:ot:location:participantId">SC12345.F0003</attribute>
								</extension>
						    </VocabularyElement>		
						    <VocabularyElement id="urn:epc:id:sgln:8635411.16763.2">				
								<attribute id="urn:ts:location:partnerId">8635411167632</attribute>				
								<attribute id="urn:ts:location:name">Mary Salads</attribute>				
								<attribute id="urn:ts:location:street1">Oak Street 21</attribute>				
								<attribute id="urn:ts:location:city">Liverpool</attribute>				
								<attribute id="urn:ts:location:stateOrRegion">England</attribute>				
								<attribute id="urn:ts:location:postalCode">453674</attribute>
								<attribute id="urn:ts:location:country">GB</attribute>
								<children>
									<id>8635411.16763.22</id>
									<id>8635411.16763.23</id>
								</children>
								<extension>
									<attribute id="urn:ot:location:participantId">SC12345.F0002</attribute>
								</extension>
							</VocabularyElement>			
						</VocabularyElementList>				
					</Vocabulary>				
					<!-- OT custom standard -->
					<Vocabulary type="urn:ot:mda:participant">
						<extension>						
							<OTVocabularyElement id="urn:ot:mda:participant:SC34254.F0003">
								<attribute id="urn:ot:mda:participant:name">XYZ Retail</attribute>								
								<attribute id="urn:ot:mda:participant:location">urn:epc:id:sgln:6104898.16234.0</attribute>														
							</OTVocabularyElement>
						</extension>						
					</Vocabulary>					
					<!-- OT custom standard -->
					<Vocabulary type="urn:ot:mda:object">
						<extension>
							<OTVocabularyElement id="urn:epc:id:sgtin:8635411.000333">								
								<attribute id="urn:ot:mda:object:name">Winter sallad mix</attribute>
							    <attribute id="urn:ot:mda:object:type">Sallad</attribute>
								<attribute id="urn:ot:mda:object:category">Fresh salad</attribute>
								<attribute id="urn:ot:mda:object:ean13">8438454123998</attribute>																	
							</OTVocabularyElement>
						</extension>
					</Vocabulary>					
					<!-- OT custom standard -->
					<Vocabulary type="urn:ot:mda:batch">
						<extension>	
							<OTVocabularyElement id="urn:epc:id:sgtin:8635411.000333.00001">
								<attribute id="urn:ot:mda:batch:objectid">urn:epc:id:sgtin:8635411.000333</attribute>
							    <attribute id="urn:ot:mda:batch:productiondate">2018-03-03T00:01:54Z</attribute>
								<attribute id="urn:ot:mda:batch:expirationdate">2018-04-03T00:01:54Z</attribute>
							</OTVocabularyElement>
							<OTVocabularyElement id="urn:epc:id:sgtin:8635411.000333.00002">
								<attribute id="urn:ot:mda:batch:objectid">urn:epc:id:sgtin:8635411.000333</attribute>
							    <attribute id="urn:ot:mda:batch:productiondate">2018-03-03T00:02:54Z</attribute>
								<attribute id="urn:ot:mda:batch:expirationdate">2018-04-03T00:02:54Z</attribute>
							</OTVocabularyElement>						
							<OTVocabularyElement id="urn:epc:id:sgtin:8635411.000333.00003">
								<attribute id="urn:ot:mda:batch:objectid">urn:epc:id:sgtin:8635411.000333</attribute>
							    <attribute id="urn:ot:mda:batch:productiondate">2018-03-03T00:03:54Z</attribute>
								<attribute id="urn:ot:mda:batch:expirationdate">2018-04-03T00:03:54Z</attribute>
							</OTVocabularyElement>																
						</extension>
					</Vocabulary>
				</VocabularyList>
			</EPCISMasterData>
		</extension>
	</EPCISHeader>
	<EPCISBody>
		 <EventList>
			 <ObjectEvent>
				 <eventTime>2017-07-15T10:00:00.000-04:00</eventTime> <!-- Mandatory-->
				 <eventTimeZoneOffset>-04:00</eventTimeZoneOffset> <!-- Mandatory-->
				 <baseExtension> <!-- Optional -->
					 <eventID>ID12345670001</eventID>
				 </baseExtension>
    			 <epcList> <!-- Mandatory-->
					 <epc>urn:epc:id:sgln:8635411.00333.00001</epc>
					 <epc>urn:epc:id:sgln:8635411.00333.00002</epc>
					 <epc>urn:epc:id:sgln:8635411.00333.00003</epc>
				 </epcList>				 
				 <action>OBSERVE</action> <!-- Mandatory-->
				 <bizStep>urn:epcglobal:cbv:bizstep:shipping</bizStep> <!-- Optional -->
				 <disposition>urn:epcglobal:cbv:disp:active</disposition> <!-- Optional -->
				 <readPoint> <!-- Optional -->
					 <id>urn:epc:id:sgln:8635411.16763.22</id>
				 </readPoint>
				 <bizLocation> <!-- Optional -->
					 <id>urn:epc:id:sgln:8635411.16763.2</id>
				 </bizLocation>
				 <extension>
					 <quantityList> <!-- Optional -->
						 <quantityElement>
							 <epcClass>urn:epc:id:sgln:8635411.00333.00001</epcClass>
							 <quantity>10</quantity>
							 <uom>KG</uom>
						 </quantityElement>
						 <quantityElement>
							 <epcClass>urn:epc:id:sgln:8635411.00333.00002</epcClass>
							 <quantity>20</quantity>
							 <uom>KG</uom>
						 </quantityElement>
						 <quantityElement>
							 <epcClass>urn:epc:id:sgln:8635411.00333.00003</epcClass>
							 <quantity>30</quantity>
							 <uom>KG</uom>
						 </quantityElement>
					 </quantityList>
					 <sourceList> <!-- Optional -->
						 <source type="urn:epcglobal:cbv:sdt:location">urn:epc:id:sgln:8635411.16763.2</source>
					 </sourceList>
					 <destinationList> <!-- Optional -->
						 <destination type="urn:epcglobal:cbv:sdt:location">urn:epc:id:sgln:6104898.16234.0</destination>
					 </destinationList>
					 <extension>  <!-- Optional -->
						 <TemperatureC>15</TemperatureC>  <!-- Optional -->
						 <RelativeHumidity>80</RelativeHumidity>  <!-- Optional -->
					 </extension>					 
				</extension>
			 </ObjectEvent>
			 <ObjectEvent>
				 <eventTime>2017-07-16T10:00:00.000-04:00</eventTime> <!-- Mandatory-->
				 <eventTimeZoneOffset>-05:12</eventTimeZoneOffset> <!-- Mandatory-->
				 <baseExtension> <!-- Optional -->
					 <eventID>ID12345670002</eventID>
				 </baseExtension>
    			 <epcList> <!-- Mandatory-->
					 <epc>urn:epc:id:sgln:8635411.00333.00001</epc>
					 <epc>urn:epc:id:sgln:8635411.00333.00002</epc>
					 <epc>urn:epc:id:sgln:8635411.00333.00003</epc>
				 </epcList>				 
				 <action>OBSERVE</action> <!-- Mandatory-->
				 <bizStep>urn:epcglobal:cbv:bizstep:shipping</bizStep> <!-- Optional -->
				 <readPoint> <!-- Optional -->
					 <id>urn:epc:id:sgln:6104898.16234.1</id>
				 </readPoint>
				 <extension>
					 <quantityList> <!-- Optional -->
						 <quantityElement>
							 <epcClass>urn:epc:id:sgln:8635411.00333.00001</epcClass>
							 <quantity>10</quantity>
							 <uom>KG</uom>
						 </quantityElement>
						 <quantityElement>
							 <epcClass>urn:epc:id:sgln:8635411.00333.00002</epcClass>
							 <quantity>20</quantity>
							 <uom>KG</uom>
						 </quantityElement>
						 <quantityElement>
							 <epcClass>urn:epc:id:sgln:8635411.00333.00003</epcClass>
							 <quantity>30</quantity>
							 <uom>KG</uom>
						 </quantityElement>
					 </quantityList>
					 <sourceList> <!-- Optional -->
						 <source type="urn:epcglobal:cbv:sdt:location">urn:epc:id:sgln:8635411.16763.2</source>
					 </sourceList>
					 <destinationList> <!-- Optional -->
						 <destination type="urn:epcglobal:cbv:sdt:location">urn:epc:id:sgln:6104898.16234.0</destination>
					 </destinationList>
					 <extension>  <!-- Optional -->
						 <TemperatureC>22</TemperatureC>  <!-- Optional -->
						 <RelativeHumidity>17</RelativeHumidity>  <!-- Optional -->
					 </extension>					 
				</extension>
			 </ObjectEvent>
			 <ObjectEvent>
				 <eventTime>2017-07-18T10:00:00.000-04:00</eventTime> <!-- Mandatory-->
				 <eventTimeZoneOffset>-11:12</eventTimeZoneOffset> <!-- Mandatory-->
				 <baseExtension> <!-- Optional -->
					 <eventID>ID12345670003</eventID>
				 </baseExtension>
    			 <epcList> <!-- Mandatory-->
					 <epc>urn:epc:id:sgln:8635411.00333.00001</epc>
					 <epc>urn:epc:id:sgln:8635411.00333.00002</epc>
					 <epc>urn:epc:id:sgln:8635411.00333.00003</epc>
				 </epcList>				 
				 <action>OBSERVE</action> <!-- Mandatory-->
				 <bizStep>urn:epcglobal:cbv:bizstep:receving</bizStep> <!-- Optional -->
				 <readPoint> <!-- Optional -->
					 <id>urn:epc:id:sgln:6104898.16234.22</id>
				 </readPoint>
				 <bizLocation> <!-- Optional -->
					 <id>urn:epc:id:sgln:6104898.16234.2</id>
				 </bizLocation>
				 <extension>
					 <quantityList> <!-- Optional -->
						 <quantityElement>
							 <epcClass>urn:epc:id:sgln:8635411.00333.00001</epcClass>
							 <quantity>10</quantity>
							 <uom>KG</uom>
						 </quantityElement>
						 <quantityElement>
							 <epcClass>urn:epc:id:sgln:8635411.00333.00002</epcClass>
							 <quantity>20</quantity>
							 <uom>KG</uom>
						 </quantityElement>
						 <quantityElement>
							 <epcClass>urn:epc:id:sgln:8635411.00333.00003</epcClass>
							 <quantity>30</quantity>
							 <uom>KG</uom>
						 </quantityElement>
					 </quantityList>
					 <sourceList> <!-- Optional -->
						 <source type="urn:epcglobal:cbv:sdt:location">urn:epc:id:sgln:8635411.16763.2</source>
					 </sourceList>
					 <destinationList> <!-- Optional -->
						 <destination type="urn:epcglobal:cbv:sdt:location">urn:epc:id:sgln:6104898.16234.0</destination>
					 </destinationList>
					 <extension>  <!-- Optional -->
						 <TemperatureC>11</TemperatureC>  <!-- Optional -->
						 <RelativeHumidity>76</RelativeHumidity>  <!-- Optional -->
					 </extension>					 
				</extension>
			 </ObjectEvent>
			 <AggregationEvent>
				<eventTime>2013-06-08T14:58:56.591Z</eventTime>
				<eventTimeZoneOffset>+02:00</eventTimeZoneOffset>
				<parentID>urn:epc:id:sscc:0614141.1234567890</parentID>
				<childEPCs>
					<epc>urn:epc:id:sgtin:8635411.000333.00001</epc>
					<epc>urn:epc:id:sgtin:8635411.000333.00002</epc>
					<epc>urn:epc:id:sgtin:8635411.000333.00003</epc>
				</childEPCs>
				<action>OBSERVE</action>
				<bizStep>urn:epcglobal:cbv:bizstep:receiving</bizStep>
				<disposition>urn:epcglobal:cbv:disp:in_progress</disposition>
				<readPoint>
					<id>urn:epc:id:sgln:6104898.16234.0</id>
				</readPoint>
				<bizLocation>
					<id>urn:epc:id:sgln:6104898.16234.0</id>
				</bizLocation>
				<extension>
					<childQuantityList>
						<quantityElement>
							<epcClass>urn:epc:id:sgtin:8635411.000333.00001</epcClass>
							<quantity>10</quantity>
							<uom>KGM</uom>
						</quantityElement>
						<quantityElement>
							<epcClass>urn:epc:id:sgtin:8635411.000333.00002</epcClass>
							<quantity>20</quantity>
							<uom>KGM</uom>
						</quantityElement>
						<quantityElement>
							<epcClass>urn:epc:id:sgtin:8635411.000333.00003</epcClass>
							<quantity>30</quantity>
							<uom>KGM</uom>
						</quantityElement>
					</childQuantityList>
				</extension>
			</AggregationEvent>
			<extension>
				  <TransformationEvent>
					 <eventTime>2015-03-15T00:00:00.000-04:00</eventTime> <!-- Mandatory-->
					 <eventTimeZoneOffset>-04:00</eventTimeZoneOffset> <!-- Mandatory-->				 
					 <inputEPCList>
						 <epc>urn:epc:id:sgtin:0104531.000111.00001</epc>
						 <epc>urn:epc:id:sgtin:0203212.000222.00002</epc>
					 </inputEPCList>
					 <inputQuantityList>
						 <quantityElement>
							 <epcClass>urn:epc:id:sgtin:0104531.000111.00001</epcClass>
							 <quantity>10.0</quantity>
							 <uom>KG</uom>
						 </quantityElement>
						 <quantityElement>
							 <epcClass>urn:epc:idpat:sgtin:0203212.000222.00002</epcClass>
							 <quantity>20.0</quantity>
							 <uom>KG</uom>
						 </quantityElement>
					 </inputQuantityList>
					 <outputEPCList>
						<epc>urn:epc:id:sgtin:8635411.000333.00003</epc>
					 </outputEPCList>
					 <outputQuantityList>
						 <quantityElement>
							 <epcClass>urn:epc:id:sgtin:8635411.000333.00003</epcClass>
							 <quantity>30.0</quantity>
							 <uom>KG</uom>
						 </quantityElement>
					 </outputQuantityList>					 
					 <transformationID>BOM12345PO987</transformationID> <!-- Mandatory-->
					 <bizStep>urn:epcglobal:cbv:bizstep:creating_class_instance</bizStep> <!-- Optional -->						 				 
				 </TransformationEvent>
			</extension>
		</EventList>
	 </EPCISBody>
</epcis:EPCISDocument>`;


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

//sanitize

function sanitize(old_obj, new_obj, patterns)
{
	if(typeof old_obj != 'object')
		return old_obj;

	for(let key in old_obj) {
		var new_key = key;

		for(let i in patterns) {
			new_key = new_key.replace(patterns[i],'');
		}

		new_obj[new_key] = sanitize(old_obj[key], {}, patterns);
	}

	return new_obj;
}

//parsing

function Error(message) {
	console.log('Error: ' + message);
	return false;
}


parseString(gs1_xml, {explicitArray: false, mergeAttrs: true} , async function (err, result) {

	//Variables
	let EPCISDocument_element = [];
	var sanitized_EPCIS_document;
	let EPCISHeader_element;
	let StandardBusinessDocumentHeader_element;
	let Sender_element;
	let sender_id_element;
	let ContactInformation_element;
	let Receiver_element;
	let receiver_id_element;
	let ContactInformation_element_receiver;
	let DocumentIdentification_element;
	let BusinessScope_element;
	let sender_id;
	let receiver_id;

	let extension_element;
	let EPCISMasterData_element;
	let VocabularyList_element;
	let Vocabulary_elements;
	let vocabulary_element;
	let inside;
	let type_element;
	var Bussines_location_elements;
	let test;
	let BusinessLocation_element;
	let sanitized_BusinessLocation_element;
	let VocabularyElementList_element;
	let VocabularyElement_element;
	let business_location_id;
	let sanitized_VocabularyElement_element;
	let attribute_id;
	let data_object = {};

	///attributes - BusinessLocation
	let partner_id;
	let name;
	let street1;
	let city;
	let stateOrRegion;
	let postalCode;
	let country;





	let sender = {};
	let receiver = {};
	let document_meta = {};
	let locations = {};

	let object_events = {};
	let aggregation_events = {};
	let transformation_events = {};


	var at_edges = [];
	var read_point_edges = [];
	var event_batch_edges = [];
	var parent_batches_edges = [];
	var child_batches_edges = [];

	//READING EPCIS Document
	let doc = findValuesHelper(result, 'epcis:EPCISDocument', []);
	if (doc.length <= 0) {
		return Error('Missing EPCISDocument element!');
	} else {

		EPCISDocument_element = result['epcis:EPCISDocument'];

		let new_obj = {};
		sanitized_EPCIS_document = sanitize(EPCISDocument_element, new_obj, ['sbdh:', 'xmlns:']);

	}

	let head = findValuesHelper(sanitized_EPCIS_document, 'EPCISHeader', []);
	if (head.length <= 0) {
		return Error('Missing EPCISHeader element for EPCISDocument element!');
	} else {
		EPCISHeader_element = sanitized_EPCIS_document.EPCISHeader;
	}

	let standard_doc_header = findValuesHelper(EPCISHeader_element, 'StandardBusinessDocumentHeader', []);
	if (standard_doc_header.length <= 0) {
		return Error('Missing StandardBusinessDocumentHeader element for EPCISHeader element!');
	} else {
		StandardBusinessDocumentHeader_element = EPCISHeader_element.StandardBusinessDocumentHeader;

	}


	////SENDER
	let send = findValuesHelper(StandardBusinessDocumentHeader_element, 'Sender', []);
	if (send.length <= 0) {
		return Error('Missing Sender element for StandardBusinessDocumentHeader element!');
	} else {
		Sender_element = StandardBusinessDocumentHeader_element.Sender;

	}

	let send_id = findValuesHelper(Sender_element, 'Identifier', []);
	if (send_id.length <= 0) {
		return Error('Missing Identifier element for Sender element!');
	} else {
		sender_id_element = Sender_element.Identifier;

	}

	let sendid = findValuesHelper(sender_id_element, '_', []);
	if (sendid.length <= 0) {
		return Error('Missing _ element for sender_id element!');
	} else {
		sender_id = sender_id_element['_'];
	}




	let contact_info = findValuesHelper(Sender_element, 'ContactInformation', []);
	if (contact_info.length <= 0) {
		return Error('Missing ContactInformation element for Sender element!');
	} else {
		ContactInformation_element = Sender_element.ContactInformation;

	}



	/////RECEIVER
	let receive = findValuesHelper(StandardBusinessDocumentHeader_element, 'Receiver', []);
	if (receive.length <= 0) {
		return Error('Missing Receiver element for StandardBusinessDocumentHeader element!');
	} else {
		Receiver_element = StandardBusinessDocumentHeader_element.Receiver;

	}



	let receive_id = findValuesHelper(Receiver_element, 'Identifier', []);
	if (receive_id.length <= 0) {
		return Error('Missing Identifier element for Receiver element!');
	} else {
		receiver_id_element = Receiver_element.Identifier;

	}



	let receiveid = findValuesHelper(receiver_id_element, '_', []);
	if (receiveid.length <= 0) {
		return Error('Missing Identifier element for Receiver element!');
	} else {
		receiver_id = receiver_id_element['_'];

	}



	let contact_info_rec = findValuesHelper(Receiver_element, 'ContactInformation', []);
	if (contact_info_rec.length <= 0) {
		return Error('Missing ContactInformation element for Receiver element!');
	} else {
		ContactInformation_element_receiver = Receiver_element.ContactInformation;

	}

	let doc_identification = findValuesHelper(StandardBusinessDocumentHeader_element, 'DocumentIdentification', []);
	if (doc_identification.length <= 0) {
		return Error('Missing DocumentIdentification element for StandardBusinessDocumentHeader element!');
	} else {
		DocumentIdentification_element = StandardBusinessDocumentHeader_element.DocumentIdentification;

	}

	let bus_scope = findValuesHelper(StandardBusinessDocumentHeader_element, 'BusinessScope', []);
	if (bus_scope.length <= 0) {
		return Error('Missing BusinessScope element for StandardBusinessDocumentHeader element!');
	} else {
		BusinessScope_element = StandardBusinessDocumentHeader_element.BusinessScope;

	}


	sender['sender_id'] = {};
	sender['sender_id']['identifiers'] = {};
	sender['sender_id']['identifiers']['sender_id'] = sender_id;
	sender['sender_id']['data'] = ContactInformation_element;
	sender['sender_id']['vertex_type'] = 'SENDER';



	receiver['receiver_id'] = {};
	receiver['receiver_id']['identifiers'] = {};
	receiver['receiver_id']['identifiers']['receiver_id'] = receiver_id;
	receiver['receiver_id']['data'] = ContactInformation_element_receiver;
	receiver['receiver_id']['vertex_type'] = 'RECEIVER';

	document_meta = Object.assign({}, document_meta, {BusinessScope_element, DocumentIdentification_element});





	//READING Master Data

	let ext = findValuesHelper(EPCISHeader_element, 'extension', []);
	if (ext.length <= 0) {
		return Error('Missing extension element for EPCISHeader element!');
	} else {
		extension_element = EPCISHeader_element.extension;
	}

	let epcis_master = findValuesHelper(extension_element, 'EPCISMasterData', []);
	if (epcis_master.length <= 0) {
		return Error('Missing EPCISMasterData element for extension element!');
	} else {
		EPCISMasterData_element = extension_element.EPCISMasterData;
	}

	let vocabulary_li = findValuesHelper(EPCISMasterData_element, 'VocabularyList', []);
	if (vocabulary_li.length <= 0) {
		return Error('Missing VocabularyList element for EPCISMasterData element!');
	} else {
		VocabularyList_element = EPCISMasterData_element.VocabularyList;
	}

	let vocabulary = findValuesHelper(VocabularyList_element, 'Vocabulary', []);
	if (vocabulary.length <= 0) {
		return Error('Missing Vocabulary element for VocabularyList element!');
	} else {
		Vocabulary_elements = VocabularyList_element.Vocabulary;
	}

	if (!(Vocabulary_elements instanceof Array)) {
		let temp_vocabulary_elements = Vocabulary_elements;
		Vocabulary_elements = [];
		Vocabulary_elements.push(temp_vocabulary_elements);
	}


	for (let i in Vocabulary_elements) {
		vocabulary_element = Vocabulary_elements[i];

		if (!(vocabulary_element instanceof Array)) {
			let temp_vocabularyel_elements = vocabulary_element;
			vocabulary_element = [];
			vocabulary_element.push(temp_vocabularyel_elements);
		}

		for (let j in vocabulary_element){
			inside = vocabulary_element[j];
			let pro;


			for (j in inside) {
				pro = inside[j];

				let typ = findValuesHelper(pro, 'type', []);
				if (typ.length <= 0) {
					return Error('Missing type element for element!');
				} else {
					let v_type;
					v_type = pro.type;

					//////////BUSINESS_LOCATION/////////////
					if(v_type == 'urn:epcglobal:epcis:vtype:BusinessLocation') {
						Bussines_location_elements = pro;

						let voc_el_list = findValuesHelper(Bussines_location_elements, 'VocabularyElementList', []);
						if (voc_el_list.length == 0) {
							return Error('Missing VocabularyElementList element for element!');
						} else {
							VocabularyElementList_element = Bussines_location_elements.VocabularyElementList;
						}


						for (let k in VocabularyElementList_element)
						{

							let VocabularyElement_element;
							VocabularyElement_element = VocabularyElementList_element[k];
							/*
                            let voc_el_list = findValuesHelper(one_location, 'VocabularyElement', []);
                            if (voc_el_list.length <= 0) {
                                return Error('Missing VocabularyElement element for VocabularyList element!');
                            } else {
                                VocabularyElement_element = one_location.VocabularyElement;

                            }
*/
							for (let x in VocabularyElement_element) {
								let v;
								v  = VocabularyElement_element[x];

								let loc_id = findValuesHelper(v, 'id', []);
								if (loc_id.length <= 0) {
									return Error('Missing id element for VocabularyElement element!');
								} else {
									let str = v.id;


									business_location_id = str.replace('urn:epc:id:sgln:', '');

								}

								let attr = findValuesHelper(v, 'attribute', []);
								if (attr.length <= 0) {
									return Error('Missing attribute element for VocabularyElement element!');
								} else {
									let attribute;
									attribute = v.attribute;



									for (let y in attribute) {
										let kk;
										kk = attribute[y];


										let att_id =  findValuesHelper(kk, 'id', []);
										if (att_id.length <= 0) {
											return Error('Missing id attribute for element!');
										} else {
											let str = kk.id;
											attribute_id = str.replace('urn:ts:location:', '');
										}

										data_object[attribute_id] = kk['_'];

									}
								}



								locations[business_location_id] = {};
								locations[business_location_id]['identifiers'] = {};
								locations[business_location_id]['identifiers']['bussines_location_id'] = business_location_id;
								locations[business_location_id]['data'] = data_object;
								//						console.log(locations);
							}

						}
					}
				}
			}






		}


	}

	//READING EPCIS Document Body

	if (findValuesHelper(EPCISDocument_element, 'EPCISBody', []).length != 0) {

		let body_element = EPCISDocument_element.EPCISBody;

		if(findValuesHelper(result, 'EventList', []).length == 0) {
			return Error('Missing EventList element');
		}

		var event_list_element = body_element.EventList;


		for(var event_type in event_list_element)
		{

			let events = [];

			if(event_list_element[event_type].length == undefined) {
				events = [event_list_element[event_type]];
			}
			else {
				events = event_list_element[event_type];
			}


			for(let i in events) {

				let event_batches = [];

				let event = events[i];

				if(event_type == 'ObjectEvent') {

					// eventTime
					if(findValuesHelper(event, 'eventTime', []).length == 0) {
						return Error('Missing eventTime element for event!');
					}

					let event_time = event.eventTime;

					if(typeof event_time != 'string') {
						return Error('Multiple eventTime elements found!');
					}

					// eventTimeZoneOffset
					if(findValuesHelper(event, 'eventTimeZoneOffset', []).length == 0) {
						return Error('Missing event_time_zone_offset element for event!');
					}

					let event_time_zone_offset = event.eventTimeZoneOffset;

					if(typeof event_time_zone_offset != 'string') {
						return Error('Multiple event_time_zone_offset elements found!');
					}

					let event_id = sender_id+':' + event_time + 'Z' + event_time_zone_offset;

					// baseExtension + eventID
					if(findValuesHelper(event, 'baseExtension', []).length > 0) {
						let baseExtension_element = event.baseExtension;


						if(findValuesHelper(baseExtension_element , 'eventID', []).length == 0) {
							return Error('Missing eventID in baseExtension!');
						}

						event_id = baseExtension_element.eventID;
					}

					// epcList
					if(findValuesHelper(event, 'epcList', []).length == 0) {
						return Error('Missing epcList element for event!');
					}

					let epcList = event.epcList;

					if(findValuesHelper(epcList , 'epc', []).length == 0) {
						return Error('Missing epc element in epcList for event!');
					}

					let epc = epcList.epc;

					if(typeof epc == 'string') {
						event_batches = [epc];
					}
					else {
						event_batches = epc;
					}

					// readPoint
					let read_point = undefined;
					if(findValuesHelper(event , 'readPoint', []).length != 0) {
						let read_point_element = event.readPoint;

						if(findValuesHelper(read_point_element , 'id', []).length == 0) {
							return Error('Missing id for readPoint!');
						}

						read_point = read_point_element.id;
					}

					// bizLocation
					let biz_location = undefined;
					if(findValuesHelper(event, 'bizLocation', []).length != 0) {
						let biz_location_element = event.bizLocation;

						if(findValuesHelper(biz_location_element, 'id', []).length == 0) {
							return Error('Missing id for bizLocation!');
						}

						biz_location = biz_location_element.id;
					}

					let object_event = {
						identifiers: {
							eventId: event_id
						},
						data: event,
						vertex_type: 'EVENT',
						_key: md5('event_' + sender_id + '_' + event_id)
					};

					object_events[event_id] = object_event;

					for(let bi in event_batches) {
						event_batch_edges.push({
							'_key': md5('event_batch_' + sender_id + '_' + event_id + '_' + event_batches[bi]),
							'_from': 'ot_vertices/' + md5('event_' + sender + '_' + event_id),
							'_to': 'ot_vertices/' + md5('batch_' + sender_id + '_' + event_batches[bi]),
							'edge_type': 'EVENT_BATCHES'
						});
					}

					if(read_point != undefined) {
						read_point_edges.push({
							'_key': md5('read_point_' + sender_id + '_' + event_id + '_' + read_point),
							'_from': 'ot_vertices/' + md5('event_' + sender + '_' + event_id),
							'_to': 'ot_vertices/' + md5('business_location_' + sender_id + '_' + read_point),
							'edge_type': 'READ_POINT'
						});
					}

					if(biz_location != undefined) {
						at_edges.push({
							'_key': md5('at_' + sender_id + '_' + event_id + '_' + biz_location),
							'_from': 'ot_vertices/' + md5('event_' + sender + '_' + event_id),
							'_to': 'ot_vertices/' + md5('business_location_' + sender_id + '_' + biz_location),
							'edge_type': 'AT'
						});
					}


				}
				else if(event_type == 'AggregationEvent') {

					// eventTime
					if(findValuesHelper(event, 'eventTime', []).length == 0) {
						return Error('Missing eventTime element for event!');
					}

					let event_time = event.eventTime;

					if(typeof event_time != 'string') {
						return Error('Multiple eventTime elements found!');
					}

					// eventTimeZoneOffset
					if(findValuesHelper(event, 'eventTimeZoneOffset', []).length == 0) {
						return Error('Missing event_time_zone_offset element for event!');
					}

					let event_time_zone_offset = event.eventTimeZoneOffset;

					if(typeof event_time_zone_offset != 'string') {
						return Error('Multiple event_time_zone_offset elements found!');
					}

					let event_id = sender_id+':' + event_time + 'Z' + event_time_zone_offset;

					// baseExtension + eventID
					if(findValuesHelper(event, 'baseExtension', []).length > 0) {
						let baseExtension_element = event.baseExtension;


						if(findValuesHelper(baseExtension_element , 'eventID', []).length == 0) {
							return Error('Missing eventID in baseExtension!');
						}

						event_id = baseExtension_element.eventID;
					}

					// parentID
					if(findValuesHelper(event, 'parentID', []).length == 0) {
						return Error('Missing parentID element for Aggregation event!');
					}

					let parent_id = event.parentID;

					// childEPCs
					let child_epcs = [];

					if(findValuesHelper(event, 'childEPCs', []).length == 0) {
						return Error('Missing childEPCs element for event!');
					}

					let epcList = event.childEPCs;

					if(findValuesHelper(epcList , 'epc', []).length == 0) {
						return Error('Missing epc element in epcList for event!');
					}

					let epc = epcList.epc;

					if(typeof epc == 'string') {
						child_epcs = [epc];
					}
					else {
						child_epcs = epc;
					}

					// readPoint
					let read_point = undefined;
					if(findValuesHelper(event , 'readPoint', []).length != 0) {
						let read_point_element = event.readPoint;

						if(findValuesHelper(read_point_element , 'id', []).length == 0) {
							return Error('Missing id for readPoint!');
						}

						read_point = read_point_element.id;
					}

					// bizLocation
					let biz_location = undefined;
					if(findValuesHelper(event, 'bizLocation', []).length != 0) {
						let biz_location_element = event.bizLocation;

						if(findValuesHelper(biz_location_element, 'id', []).length == 0) {
							return Error('Missing id for bizLocation!');
						}

						biz_location = biz_location_element.id;
					}

					let aggregation_event = {
						identifiers: {
							eventId: event_id
						},
						data: event,
	                        vertex_type: 'EVENT',
						_key: md5('event_' + sender_id + '_' + event_id)
					};

					aggregation_events[event_id] = aggregation_event;

					for(let bi in child_epcs) {
						child_batches_edges.push({
							'_key': md5('vhild_batch_' + sender_id + '_' + event_id + '_' + child_epcs[bi]),
							'_from': 'ot_vertices/' + md5('event_' + sender + '_' + event_id),
							'_to': 'ot_vertices/' + md5('batch_' + sender_id + '_' + child_epcs[bi]),
							'edge_type': 'CHILD_BATCH'
						});
					}

					if(read_point != undefined) {
						read_point_edges.push({
							'_key': md5('read_point_' + sender_id + '_' + event_id + '_' + read_point),
							'_from': 'ot_vertices/' + md5('event_' + sender + '_' + event_id),
							'_to': 'ot_vertices/' + md5('business_location_' + sender_id + '_' + read_point),
							'edge_type': 'READ_POINT'

						});
					}

					if(biz_location != undefined) {
						at_edges.push({
							'_key': md5('at_' + sender_id + '_' + event_id + '_' + biz_location),
							'_from': 'ot_vertices/' + md5('event_' + sender + '_' + event_id),
							'_to': 'ot_vertices/' + md5('business_location_' + sender_id + '_' + biz_location),
							'edge_type': 'AT'
						});
					}

					parent_batches_edges.push({
						'_key': md5('at_' + sender_id + '_' + event_id + '_' + biz_location),
						'_from': 'ot_vertices/' + md5('event_' + sender + '_' + event_id),
						'_to': 'ot_vertices/' + md5('batch_' + sender_id + '_' + parent_id),
						'edge_type': 'PARENT_BATCH'
					});

				}
				else if(event_type == 'extension') {
					let extension_events = event;

					for(var ext_event_type in extension_events)
					{

						let ext_events = [];

						if(extension_events[ext_event_type].length == undefined) {
							ext_events = [extension_events[ext_event_type]];
						}
						else {
							ext_events = event_list_element[ext_event_type];
						}


						for(let i in ext_events) {

							let ext_event = ext_events[i];

							if(ext_event_type == 'TransformationEvent') {

								// eventTime
								if(findValuesHelper(ext_event, 'transformationID', []).length == 0) {
									return Error('Missing transformationID element for event!');
								}

								let event_id = ext_event.transformationID;

								console.log(event_id);

								// inputEPCList
								let input_epcs = [];

								if(findValuesHelper(ext_event, 'inputEPCList', []).length == 0) {
									return Error('Missing inputEPCList element for event!');
								}

								let epcList = event.childEPCs;


							} else {
								return Error('Unsupported event type: ' + event_type);
							}
						}

					}


				}
				else {
					return Error('Unsupported event type: ' + event_type);
				}

			}

		}


		// console.log(object_events);
		// console.log(event_batch_edges);
		// console.log(at_edges);
		// console.log(read_point_edges);


	}

});

