import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import ChartistGraph from "react-chartist";
import {Line} from 'react-chartjs-2';

import { Card } from "components/Card/Card.jsx";

import GetPatient from "actions/GetPatient.jsx";
import GetObservation from "actions/GetObservation.jsx";
import GetAllergies from "actions/GetAllergies.jsx";

import Maps from "views/Maps/Maps.jsx";

import axios from 'axios';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.props.loadState();
    this.state = {
      name: "Dummy, Dummy",
      dob: "2015-01-01",
      gender: "Male",
      age: "6",
      maritalStatus: "Single",
      allergies: [
        ['Drug allergy', 'CRITL', 'active', '2020-02-30']
      ],
      food_allergies: [
        ['Peanut - dietary', 'CRITL', 'active', '2020-02-30']
      ],
      observations: [
        []
      ],
      observation_tags: [

      ],
      observation_dict: {},
      tabstyle: { height: '100%', width: '100%'}
    }
  }
  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }

  createLegend2(json) {
    return <br />
  }

  //filters duplicate data;
  multiDimensionalUnique = (arr) => {
    var uniques = [];
    var itemsFound = {};
    for (var i = 0, l = arr.length; i < l; i++) {
      var stringified = JSON.stringify(arr[i]);
      if (itemsFound[stringified]) { continue; }
      uniques.push(arr[i]);
      itemsFound[stringified] = true;
    }
    return uniques;
  }

  setObservationState = (data) => {
    var bundleList = data.data.entry;
    var observations = this.state.observations;
    var observation_tags = this.state.observation_tags;
    var observation_dict = this.state.observation_dict;
    bundleList.forEach(element => {
      var arr = []
      var resource = element.resource;
      var name = resource.code.text;
      var time = resource.effectiveDateTime;
      var value = '';
      if (typeof resource.valueQuantity !== 'undefined') {
        if (typeof resource.valueQuantity.value !== 'undefined') {
          value = resource.valueQuantity.value;
        } else {
          return;
        }
      } else {
        return;
      }
      var result = '';
      var high = null;
      var low = null;
      var loinc_uri = null;
      var loinc = null;
      if (typeof resource.interpretation !== 'undefined') {
        if (typeof resource.interpretation.coding !== 'undefined') {
          if (resource.interpretation.coding.length > 0 && typeof resource.code.coding !== 'undefined') {
            result = resource.interpretation.coding[0].display;
            if (typeof resource.code.coding[0].code !== 'undefined') {
              loinc_uri = 'https://s.details.loinc.org/LOINC/' + resource.code.coding[0].code + '.html?sections=Simple';
              loinc = <a href={loinc_uri} rel="noopener noreferrer" target="_blank">LOINC</a>
            }
          }
        }
      }
      if (typeof resource.referenceRange !== 'undefined') {
        if (resource.referenceRange.length > 0 && typeof resource.referenceRange[0].high !== 'undefined') {
          high = resource.referenceRange[0].high.value;
          low = resource.referenceRange[0].low.value;
        }
      }
      var status = resource.status;
      observation_tags.push(name);
      if (observation_dict.hasOwnProperty(name)) {
        observation_dict[name].data.labels.unshift(new Date(time).toLocaleDateString("en-US"))
        // observation_dict[name].data.series[0].unshift(value)
        observation_dict[name].data.datasets[0].data.unshift(value)
        if (high !== null) {
          // observation_dict[name].data.series[1].unshift(high)
          // observation_dict[name].data.series[2].unshift(low)
          observation_dict[name].data.datasets[1].data.unshift(high)
          observation_dict[name].data.datasets[2].data.unshift(low)
        }
      } else {
        if (high != null) {
          observation_dict[name] = {
            data: {
              labels: [new Date(time).toLocaleDateString("en-US")],
              // series: [[value], [high], [low]]
              datasets: [{data:[value], label:'value', fill:false, pointBorderColor: 'rgba(75,192,192,1)', borderColor:'rgba(75,192,192,1)'}, 
                {data:[high], label:'high', fill:false, borderColor:'rgba(255,0,0,1)'}, 
                {data:[low], label:'low', fill:false, borderColor:'rgba(255,0,0,1)'}]
            },
            loinc: loinc
          }
        } else {
          observation_dict[name] = {
            data: {
              labels: [new Date(time).toLocaleDateString("en-US")],
              // series: [[value]]
              datasets: [{data:[value], label:'value', fill:false, borderColor:'rgba(75,192,192,1)'}]
            },
            loinc: loinc
          }
        }
      }
      arr.push(name);
      arr.push(time);
      arr.push(result);
      arr.push(status);
      observations.push(arr);
    })
    observation_tags = Array.from(new Set(observation_tags));
    // console.log(observation_tags);
    this.setState({ observations, observation_tags, observation_dict });
    data.data.link.forEach((val) => {
      if (val.relation === 'next') {
        // next = val.url;
        GetObservation(this.props.patientData, this.props.appState, val.url).then((nextRecord) => {
          this.setObservationState(nextRecord);
        });
      }
    });
  }

  componentDidMount() {
    var patient = GetPatient(this.props.patientData, this.props.appState);
    var observation = GetObservation(this.props.patientData, this.props.appState, null);
    var allergies = GetAllergies(this.props.patientData, this.props.appState);
    patient.then((data) => {
      var name = data.data.name[0].text;
      var dob = data.data.birthDate;
      var gender = data.data.gender;
      var ageDifMs = Date.now() - new Date(dob).getTime();
      var ageDate = new Date(ageDifMs);
      var age = Math.abs(ageDate.getUTCFullYear() - 1970);
      var maritalStatus = data.data.maritalStatus.text;
      this.setState({ name, dob, gender, age, maritalStatus });
    });

    observation.then((data) => {
      this.setObservationState(data);
      // var next = null;
      // data.data.link.forEach((val) => {
      //   if (val.relation === 'next') {
      //     next = val.url;
      //   }
      // })
      // if(this.next !== null) {
      //   console.log(next);
      //   var observation2 = GetObservation(this.props.patientData, this.props.appState, next).then((nextRecord) => {
      //     data = nextRecord;
      //     this.setObservationState(nextRecord);
      //     this.next = null;
      //     nextRecord.data.link.forEach((val) => {
      //       if (val.relation === 'next') {
      //         console.log('next url: ' + val.url);
      //         this.next = val.url;
      //       }
      //     })
      //   });
      //   console.log(next);
      // }
    });

    allergies.then((data) => {
      var bundleList = data.data.entry;
      var allergies = []
      var food_allergies = []
      bundleList.forEach(element => {
        var arr = []
        var resource = element.resource;
        var category = resource.category;
        var criticality = resource.criticality;
        var onset = resource.onset;
        var name = resource.substance.text;
        var status = resource.status;
        arr.push(name);
        arr.push(criticality);
        arr.push(status);
        arr.push(onset);
        if (category === "food") {
          food_allergies.push(arr)
        } else {
          allergies.push(arr);
        }
      });
      allergies = this.multiDimensionalUnique(allergies);
      food_allergies = this.multiDimensionalUnique(food_allergies);
      this.setState({ allergies, food_allergies });
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
            <Col md={6}>
              <Card
                title={"Food Allergies"}
                category="from food"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {["Allergy", "Criticality", "Verification Status", "Onset"].map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.food_allergies.map((prop, key) => {
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
                title={"Allergies"}
                category="from food and stuff"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {["Allergy", "Criticality", "Verification Status", "Onset"].map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.allergies.map((prop, key) => {
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
                title={"Observations"}
                category="You know, looking at stuff"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {["Name", "Time", "Result", "Status"].map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.observations.map((prop, key) => {
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
                title={"Observations Tabs"}
                category="You know, looking at stuff"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Tabs>
                    <TabList>
                      {this.state.observation_tags.map((tag_name, key) => {
                        return (<Tab key={key}>{tag_name}</Tab>);
                      })}
                    </TabList>
                    {this.state.observation_tags.map((tag_name, key) => {
                      return (<TabPanel key={key}>
                        <div className="ct-chart">
                          {/* <ChartistGraph
                            data={this.state.observation_dict[tag_name].data}
                            type="Line"
                            options={{
                              showGrid: false,
                              axisX: { showGrid: false }
                            }}
                            legend={this.state.observation_dict[tag_name].loinc}
                          /> */}
                          <Line data={this.state.observation_dict[tag_name].data} width={'100%'} options={{
		                        maintainAspectRatio: false
	                          }} />
                          <div className='legend'>{this.state.observation_dict[tag_name].loinc}</div>
                        </div>
                      </TabPanel>);
                    })}
                  </Tabs>
                }
                legend={
                  <div className="legend">{this.createLegend2({})}</div>
                }
              />
            </Col>
          </Row>

          {!this.props.isDoctor &&
            <Row>
              <Col md={12}>
                <Maps />
              </Col>
            </Row>
          }
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
