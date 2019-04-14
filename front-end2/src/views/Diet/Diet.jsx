import React, { Component } from "react";

import { Grid, Row, Col, Table } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";

import { Card } from "components/Card/Card.jsx";

class Diet extends Component {

    constructor(props) {
        super(props);
        this.props.loadState();
        this.state = {
            tabs: ['HEI Avg/Mo', 'Myfitnesspal', 'Notes'],
            heiTableData: [['Total Fruits', '5', '2.8', '3.6', '2.4', '3.7'],
            ['Whole Fruits', '5', '4.0', '4.6', '3.5', '5.0'],
            ['Total Vegetables', '5', '3.2', '2.3', '3.3', '3.9']],
            heiTableHeaders: ['HEI Category', 'Max Pnts', 'Jan', 'Feb', 'Mar', 'Apr'],
            myFitnessPalData: [['Calories kcal', '600', '550', '550', '580'],
            ['Carbs g', '30', '27', '22', '30'],
            ['Fat g', '3', '2', '3', '4'],
            ['Protein g', '3', '2', '3', '3']],
            myFitnessPalHeaders: ['Category', 'Jan', 'Feb', 'Mar', 'Apr'],
        }
    }

    componentDidMount() {

    }

    render() {
        function getHEITable(headers, data) {
            return <Table striped hover>
                <thead>
                    <tr>
                        {headers.map((prop, key) => {
                            return <th key={key}>{prop}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {data.map((prop, key) => {
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
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title={'also diet'}
                                category="Diet"
                                ctTableFullWidth
                                ctTableResponsive
                                content={
                                    <Tabs>
                                        <TabList>
                                            {this.state.tabs.map((tag_name, key) => {
                                                return (<Tab key={key}>{tag_name}</Tab>);
                                            })}
                                        </TabList>
                                        {this.state.tabs.map((tag_name, key) => {
                                            return (<TabPanel key={key}>
                                                <div >
                                                    {tag_name === this.state.tabs[0] &&
                                                        getHEITable(this.state.heiTableHeaders, this.state.heiTableData)}
                                                    {tag_name === this.state.tabs[1] &&
                                                        getHEITable(this.state.myFitnessPalHeaders, this.state.myFitnessPalData)}    
                                                </div>
                                            </TabPanel>);
                                        })}
                                    </Tabs>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Diet;