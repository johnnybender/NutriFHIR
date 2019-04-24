import React, { Component } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import * as Survey from "survey-react";
import "survey-react/survey.css";
const defaultThemeColors = Survey.StylesManager.ThemeColors["default"];
defaultThemeColors["$main-color"] = "#054295";
Survey.StylesManager.applyTheme("default");

const surveyJson = {
  questions: [
    {
      type: "matrix",
      name: "Map Survey",
      title: "Please answer the following questions",
      columns: [
        {
          value: 1,
          text: "Yes"
        }, {
          value: 2,
          text: "No"
        },
      ],
      rows: [
        {
          value: "drinks water",
          text: "Have you drank 2 glasses of water (~16 fluid ounces) within the last 24 hours?"
        }, {
          value: "drinks alcohol",
          text: "Have you had an alcoholic beverage within the last week?"
        }, {
          value: "collects data",
          text: "Do you collect metrics on your sleep activity through a wearable like an Apple Watch or FitBit?"
        }, {
          value: "goes to farmers markets",
          text: "Within the last 2 weeks, have you visited a farmers market?"
        },
      ]
    }
  ]
};

const CustomMap = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      defaultZoom={13}
      defaultCenter={{ lat: 40.748817, lng: -73.985428 }}
      defaultOptions={{
        scrollwheel: false,
        zoomControl: true
      }}
    >
      <Marker position={{ lat: 40.748817, lng: -73.985428 }} />
    </GoogleMap>
  ))
);

class Maps extends Component {
  constructor(props) {
    super(props);
    var model = new Survey.Model(surveyJson);
    this.state = {
      surveyModel: model,
    }
    model.onComplete.add(this.onComplete);
    model.onValueChanged.add(this.onValueChanged);
  }

  componentDidUpdate() {
    console.log(this.props.coords);
  }
  onValueChanged = (result) => {
    this.setState({ surveyResult: JSON.stringify(result.data) });
  }

  onComplete(result) {
    //post the results to the DB. Do not call this.setState() here.
  }

  render() {
    let props = this.props;
    this.getMap = () => {
      return <CustomMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?libraries=places,geometry&key=AIzaSyAYKM4gU4N8MeSlT0lg2yKLIJiX7HkkIR8"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100vh` }} />}
        mapElement={<div style={{ height: `100%` }}
          coords={props.coords} />}
      />
    }
    this.getGrid = () => {
      return <Grid fluid>
        <Row>
          <Col md={6}>
            <div>
              <Card
                title={'Survey'}
                category=""
                ctTableFullWidth
                ctTableResponsive
                content={<Survey.Survey model={this.state.surveyModel} />
                } />
              <span>{this.state.surveyResult}</span>
            </div>
          </Col>
          <Col md={6}>
            <Card
              title={'Map'}
              category=""
              ctTableFullWidth
              ctTableResponsive
              content={this.getMap()} />
          </Col>
        </Row>
      </Grid>
    }
    return (
      <div>{this.getGrid()}</div>
    );
  }
}

export default Maps;
