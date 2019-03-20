import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";

import GetPatient from "actions/GetPatient.jsx";

class Patient extends Component {

    constructor(props) {
        super(props);
        this.props.loadState();
        this.state = {
            name: "Dummy, Dummy",
            dob: "2015-01-01",
            gender: "Male",
            age: "6",
            maritalStatus: "Single",
            address: '123 Main St. Ann Arbor, MI 48105 USA',
            phone: '(913) 456-5555',
            email: 'owner@nutrifhir.com'
        }
    }

    formatPhone = (phone) => {
        phone = phone.replace(/[^\d]/g, "");
        if (phone.length == 10) {
            return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        }
        return phone;
    }
    
    componentDidMount() {
        var patient = GetPatient(this.props.patientData, this.props.appState);
        var self = this;
        patient.then((data) => {
            console.log(data.data);
            var name = data.data.name[0].text;
            var dob = data.data.birthDate;
            var gender = data.data.gender;
            var ageDifMs = Date.now() - new Date(dob).getTime();
            var ageDate = new Date(ageDifMs);
            var age = Math.abs(ageDate.getUTCFullYear() - 1970);
            var maritalStatus = data.data.maritalStatus.text;
            var address = data.data.address[0].text;
            var telecom = data.data.telecom;
            var phone = '';
            var email = '';
            telecom.forEach(function (arg, index, array) {
                if (arg.system === "phone") {
                    phone = self.formatPhone(arg.value);
                } else if (arg.system === "email") {
                    email = arg.value;
                }
            });
            this.setState({ name, dob, gender, age, maritalStatus, address, phone, email });
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
                                category="Demographics"
                                ctTableFullWidth
                                ctTableResponsive
                                content={
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                {["DOB", "Age", "Gender", "Race", "Marital Status", "Insurance"].map((prop, key) => {
                                                    return <th key={key}>{prop}</th>;
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[[this.state.dob, this.state.age, this.state.gender, '', this.state.maritalStatus, '']].map((prop, key) => {
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
                    <Row>
                        <Col md={12}>
                        <Card
                                title="Contact"
                                category=""
                                ctTableFullWidth
                                ctTableResponsive
                                content={
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                {["Address", "E-Mail", "Phone"].map((prop, key) => {
                                                    return <th key={key}>{prop}</th>;
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[[this.state.address, this.state.email, this.state.phone]].map((prop, key) => {
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

export default Patient;