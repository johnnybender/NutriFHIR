import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";

import GetProcedures from "actions/GetProcedures.jsx";

class Procedures extends Component {

    constructor(props) {
        super(props);
        this.props.loadState();

        this.state = {
            procedureTable: [['Chemo', '28 Jan 2013', 'D. Bronsig', 'Diagnostic Report', 'Sphenoid bone', 'complete']],
        }
        this.setProcedures = this.setProcedures.bind(this);
    }

    setProcedures = (data) => {
        let entryList = data.data.entry;
        let procedureTable = [];
        entryList.forEach((entry) => {
            let { status, code, _performedDateTime } = entry.resource;
            code = code.text;
            _performedDateTime = _performedDateTime && _performedDateTime.extension && _performedDateTime.extension[0].valueCode;
            let site = 'unknown', performers = 'unknown', reason = 'unknown';
            procedureTable.push([code, _performedDateTime, performers, reason, site, status]);
        })
        this.setState({ procedureTable });
    }

    componentDidMount() {
        var procedures = GetProcedures(this.props.appState);
        procedures.then((data) => {
            this.setProcedures(data);
        }).catch(async (err) => {
            await this.props.refreshToken();
            const data = await GetProcedures(this.props.appState)
            .then((d) => {
                this.setProcedures(data);    
            }).catch((err) => {})
        });
    }

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title={'also procedures'}
                                category="Procedures"
                                ctTableFullWidth
                                ctTableResponsive
                                content={
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                {["code", "date performed", "performers", "reason", "body site", "status"].map((prop, key) => {
                                                    return <th key={key}>{prop}</th>;
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.procedureTable.map((prop, key) => {
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

export default Procedures;