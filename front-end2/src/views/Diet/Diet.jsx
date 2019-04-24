import React, { Component } from "react";

import { Grid, Row, Col, Table } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import * as Survey from "survey-react";
import "survey-react/survey.css";
import { Card } from "components/Card/Card.jsx";
import GetShoppingList from "actions/GetShoppingList.jsx";


const defaultThemeColors = Survey.StylesManager.ThemeColors["default"];
defaultThemeColors["$main-color"] = "#054295";
Survey.StylesManager.applyTheme("default");

const surveyJson = {
    questions: [
        {
            type: "matrix",
            name: "Food Insecurity",
            title: "Please rate the accuracy of these statements",
            columns: [
                {
                    value: 1,
                    text: "Often True"
                }, {
                    value: 2,
                    text: "Sometimes True"
                }, {
                    value: 3,
                    text: "Never True"
                }, {
                    value: 4,
                    text: "Refused to Answer"
                }
            ],
            rows: [
                {
                    value: "money would run out",
                    text: "Within the past 12 months we worried whether our food would run out before we got money to buy more"
                }, {
                    value: "money did run out",
                    text: "Within the past 12 months the food we bought just didn't last and we didn't have the money to get more"
                }
            ]
        }
    ]
};

class Diet extends Component {

    constructor(props) {
        super(props);
        this.props.loadState();
        var model = new Survey.Model(surveyJson);
        this.state = {
            tabs: ['HEI Avg/Mo', 'Myfitnesspal', 'Food Insecurity', 'Shopping List'],
            heiTableData: [['Total Fruits', '5', '2.8', '3.6', '2.4', '3.7'],
            ['Whole Fruits', '5', '4.0', '4.6', '3.5', '5.0'],
            ['Total Vegetables', '5', '3.2', '2.3', '3.3', '3.9']],
            heiTableHeaders: ['HEI Category', 'Max Pnts', 'Jan', 'Feb', 'Mar', 'Apr'],
            myFitnessPalData: [['Calories kcal', '600', '550', '550', '580'],
            ['Carbs g', '30', '27', '22', '30'],
            ['Fat g', '3', '2', '3', '4'],
            ['Protein g', '3', '2', '3', '3']],
            myFitnessPalHeaders: ['Category', 'Jan', 'Feb', 'Mar', 'Apr'],
            surveyResult: "",
            surveyModel: model,
            patientShoppingList: [],
            shoppingListHeaders: ['UPC', 'Name', 'Calories', 'Fat']
        }
        model.onComplete.add(this.onComplete);
        model.onValueChanged.add(this.onValueChanged);
    }

    onValueChanged = (result) => {
        this.setState({ surveyResult: JSON.stringify(result.data) });
    }

    onComplete(result) {
        //post the results to the DB. Do not call this.setState() here.
    }

    componentDidMount() {
        var shoppingList = GetShoppingList();
        shoppingList.then((data) => {
            // console.log(data.data.ShoppingList);
            this.setState({ patientShoppingList: data.data.ShoppingList })
        }).catch((err) => {
            console.log(err);
        });
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

        function shoppingListTable(headers, data) {
            let dataArr = [];
            data.forEach((e) => {
                dataArr.push([e.UPC, e.Name, e.Calories, e.Fat]);
            });
            return <Table striped hover>
                <thead>
                    <tr>
                        {headers.map((prop, key) => {
                            return <th key={key}>{prop}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {dataArr.map((prop, key) => {
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
            <div className="content" >
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title={'Diet'}
                                category=""
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
                                                    {tag_name === this.state.tabs[2] &&
                                                        <div>
                                                            <Survey.Survey model={this.state.surveyModel} />
                                                            <span>{this.state.surveyResult}</span>
                                                        </div>
                                                    }
                                                    {tag_name === this.state.tabs[3] &&
                                                        shoppingListTable(this.state.shoppingListHeaders, this.state.patientShoppingList)}
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