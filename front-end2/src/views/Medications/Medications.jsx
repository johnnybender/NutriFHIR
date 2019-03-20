import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";

import GetMedications from "actions/GetMedications.jsx";

class Medications extends Component {

    constructor(props) {
        super(props);
        this.props.loadState();
        this.state = {
            medicationTable: [
                ['Dextrose 2.5% with 0.45% NaCl 1000 mL', '30 mL/hr, IV	', 'active', 
                '2020-02-30T10:33:04.000-05:00',
                <a href='https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=244095' 
                rel="noopener noreferrer" target="_blank">RxNav</a>
                 ]
            ]
        }
    }

    componentDidMount() {
        var patient = GetMedications(this.props.patientData, this.props.appState, null);
        patient.then((data) => {
            console.log(data.data);
            let entryList = data.data.entry;
            let medicationTable = [];
            entryList.forEach((entry) => {
                let arr = []
                let resource = entry.resource;
                var dateAsserted = resource.dateAsserted;
                var dosage = resource.dosage[0].text;
                var status = resource.status;
                var name = resource.medicationCodeableConcept.text;
                var link = '';
                if (typeof resource.medicationCodeableConcept.coding !== 'undefined') {
                    if (resource.medicationCodeableConcept.coding[0].system.indexOf('rxnorm') !== -1) {
                        let code = resource.medicationCodeableConcept.coding[0].code;
                        let uri = 'https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=' + code;
                        link = <a href={uri} rel="noopener noreferrer" target="_blank">RxNav</a>
                    }
                }
                arr.push(name);
                arr.push(dosage);
                arr.push(status);
                arr.push(dateAsserted);
                arr.push(link);
                medicationTable.push(arr);
            })
            this.setState({ medicationTable });
        });

    }

    render() {
        return (
            <div className="content">
                <Grid fluid>

                    <Row>
                        <Col md={12}>
                            <Card
                                title={this.state.name}
                                category="Medication"
                                ctTableFullWidth
                                ctTableResponsive
                                content={
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                {["Name", "Dosage", "Status", "Date Asserted", "Link"].map((prop, key) => {
                                                    return <th key={key}>{prop}</th>;
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.medicationTable.map((prop, key) => {
                                                return (
                                                    <tr key={key}>
                                                        {prop.map((prop, key) => {
                                                            return <td key={key}>{prop}</td>;
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Medications;