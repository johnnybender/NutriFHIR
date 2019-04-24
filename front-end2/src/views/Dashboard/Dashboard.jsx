import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import {Line} from 'react-chartjs-2';
import fakeObservationData from './fakeObservationData';

import { Card } from "components/Card/Card.jsx";

import GetPatient from "actions/GetPatient.jsx";
import GetObservation from "actions/GetObservation.jsx";
import GetAllergies from "actions/GetAllergies.jsx";

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.props.loadState();
    this.state = {
      name: "Dummy, Dummy",
      birthDate: "2015-01-01",
      gender: "Male",
      age: "6",
      maritalStatus: "Single",
      allergies: [
        ['Drug allergy', 'CRITL', 'active', '2020-02-30']
      ],
      food_allergies: [
        ['Peanut - dietary', 'CRITL', 'active', '2020-02-30'],
        ['Tree Nuts', 'CRITL', 'active', '2021-04-31']
      ],
      observations: [
        []
      ],
      observation_tags: [

      ],
      observation_dict: {},
      tabstyle: { height: '100%', width: '100%'}
    }

    this.setLocalPatientData = this.setLocalPatientData.bind(this);
    this.setAllergiesData = this.setAllergiesData.bind(this);
    this.setObservationState = this.setObservationState.bind(this);
  }

  createLegend(json) {
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
    let {observations, observation_tags, observation_dict} = this.state;
    bundleList.forEach(element => {
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
      let high = null, low = null, loinc_uri = null, loinc = null;
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
        observation_dict[name].data.datasets[0].data.unshift(value)
        if (high !== null) {
          if (observation_dict[name].data.datasets.length > 1) {
            observation_dict[name].data.datasets[1].data.unshift(high) //breaks
            observation_dict[name].data.datasets[2].data.unshift(low)
          }
        }
      } else {
        if (high != null) {
          observation_dict[name] = {
            data: {
              labels: [new Date(time).toLocaleDateString("en-US")],
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
              datasets: [{data:[value], label:'value', fill:false, borderColor:'rgba(75,192,192,1)'}]
            },
            loinc: loinc
          }
        }
      }
      observations.push([name, time, result, status]);
    })
    observation_tags = Array.from(new Set(observation_tags));
    this.setState({ observations, observation_tags, observation_dict });
    data.data.link.forEach((val) => {
      if (val.relation === 'next') {
        GetObservation(this.props.appState, val.url).then((nextRecord) => {
          this.setObservationState(nextRecord);
        });
      } else {
        console.log("Done loading records");
      }
    });
  }

  setLocalPatientData = (data) => {
      let {gender, name, maritalStatus, birthDate} = data.data;
      name = name[0].text;
      name && this.props.setAppState('patient_name', name);
      maritalStatus = maritalStatus.text;
      var ageDifMs = Date.now() - new Date(birthDate).getTime();
      var ageDate = new Date(ageDifMs);
      var age = Math.abs(ageDate.getUTCFullYear() - 1970);
      this.setState({ name, birthDate, gender, age, maritalStatus });
  }

  setAllergiesData = (data) => {
    var bundleList = data.data.entry;
      var allergies = []
      var food_allergies = []
      bundleList.forEach(element => {
        let {category, criticality, onset, status, substance} = element.resource;
        let name = substance.text;
        if (category === "food") {
          food_allergies.push([name, criticality, status, onset])
        } else {
          allergies.push([name, criticality, status, onset]);
        }
      });
      allergies = this.multiDimensionalUnique(allergies);
      food_allergies = this.multiDimensionalUnique(food_allergies);
      this.setState({ allergies, food_allergies });
  }

  componentDidMount() {
    var patient = GetPatient(this.props.appState);
    var observation = GetObservation(this.props.appState);
    var allergies = GetAllergies(this.props.appState);

    patient.then((data) => {
      this.setLocalPatientData(data);
    }).catch(async (err) => {
      await this.props.refreshToken();
      const data = await GetPatient(this.props.appState).then(() => {
        this.setLocalPatientData(data);
      }).catch((err) => {
      })
    });

    observation.then((data) => {
      this.setObservationState(data);
    })
    .catch( async (error)=> {
      console.log("error setting observation state")
      console.log(error);
      await this.props.refreshToken();
      const data = await GetObservation(this.props.appState).then((data2) => {
        this.setObservationState(data);
      }).catch((err) => {
        if (this.state.observations[0].length === 0) {
          this.setState({observations: fakeObservationData.observations, 
            observation_dict: fakeObservationData.observation_dict, observation_tags: 
            fakeObservationData.observation_tags});
        }
        return;
      });
    });

    allergies.then((data) => {
      this.setAllergiesData(data)
    }).catch( async (error) => {
      await this.props.refreshToken();
      const data = await GetAllergies(this.props.appState).then(() => {
        this.setAllergiesData(data);
      }).catch((err) => {
        return;
      })
    })
  }
  render() {
    return (
      <div className="content">
        <Grid fluid>

          <Row>
            <Col md={12}>
              <Card
                title={'Demographics'}
                category=""
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
                      {[[this.state.birthDate, this.state.age, this.state.gender, '', this.state.maritalStatus, '']].map((prop, key) => {
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
                category=""
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
                title={"Drug Allergies"}
                category=""
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
          {!this.props.isDoctor &&
          <Row>
            <Col md={12}>
              <Card
                title={"Observations"}
                category=""
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
          }

          <Row>
            <Col md={12}>
              <Card
                title={"Observations Tabs"}
                category=""
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
                          <Line data={this.state.observation_dict[tag_name].data} options={{
		                        maintainAspectRatio: false
	                          }} />
                          <div className='legend'>{this.state.observation_dict[tag_name].loinc}</div>
                        </div>
                      </TabPanel>);
                    })}
                  </Tabs>
                }
                legend={
                  <div className="legend">{this.createLegend({})}</div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
