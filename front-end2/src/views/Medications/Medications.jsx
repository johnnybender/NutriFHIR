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
        this.setMedication = this.setMedication.bind(this);
    }

    setMedication = (data) => {
        let entryList = data.data.entry;
        let medicationTable = [];
        entryList.forEach((entry) => {
            let { dateAsserted, dosage, status, medicationCodeableConcept } = entry.resource;
            let name = medicationCodeableConcept && medicationCodeableConcept.text;
            dosage = dosage[0].text;
            let code = medicationCodeableConcept && medicationCodeableConcept.coding &&
                medicationCodeableConcept.coding[0].system &&
                medicationCodeableConcept.coding[0].system.indexOf('rxnorm') !== 1 &&
                medicationCodeableConcept.coding[0].code;
            var link = '';
            if (code) {
                let uri = 'https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=' + code;
                link = <a href={uri} rel="noopener noreferrer" target="_blank">RxNav</a>
            }

            medicationTable.push([name, dosage, status, dateAsserted, link]);
        })
        this.setState({ medicationTable });
    }

    componentDidMount() {
        var medication = GetMedications(this.props.appState);
        medication.then((data) => {
            this.setMedication(data);
        })
            .catch(async (error) => {
                console.log(error);
                await this.props.refreshToken();
                const data = await GetMedications(this.props.appState)
                .then((d) => {
                    this.setMedication(data);    
                }).catch((err)=> {})
            })

    }

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title={"Medication"}
                                category=""
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