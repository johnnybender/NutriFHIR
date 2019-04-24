import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";

import GetClinicalNotes from "actions/GetClinicalNotes.jsx";

class ClinicalNotes extends Component {

    constructor(props) {
        super(props);
        this.props.loadState();
        this.state = {
            clinicalNotesTable: [[
                'Outpatient Note', '28 Jan 2013', 'G. Smitty', 'Physical', 'V', 'History and Physical', 'Attachment'
            ]]
        }
        this.setClinicalNotes = this.setClinicalNotes.bind(this);
    }

    setClinicalNotes = (data) => {

        //Todo: Template looks nothing like the data received. Will need to update. 
        let entryList = data.data.entry;
            let clinicalNotesTable = [];
            entryList.forEach((entry) => {
                var {id, type, status, docStatus, description, created} = entry.resource;
                let text = type.text;
                docStatus = docStatus.text;
                clinicalNotesTable.push([id, created, null, null, docStatus, text, description]);
            })
            this.setState({ clinicalNotesTable });
    }
    
    componentDidMount() {
        var procedures = GetClinicalNotes(this.props.appState);
        procedures.then((data) => {
            this.setClinicalNotes(data);
        }).catch(async (err) => {
            await this.props.refreshToken();
            const data = await GetClinicalNotes(this.props.appState)
            .then((d) => this.setClinicalNotes(data))
            .catch((err) => {})
        });
    }

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title={'Clinical Notes'}
                                category=""
                                ctTableFullWidth
                                ctTableResponsive
                                content={
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                {["type", "date", "author", "relates to", "security", "category", "context"].map((prop, key) => {
                                                    return <th key={key}>{prop}</th>;
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.clinicalNotesTable.map((prop, key) => {
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

export default ClinicalNotes;