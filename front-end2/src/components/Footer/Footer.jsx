import React, { Component } from "react";
import { Grid } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <Grid fluid>
          <nav className="pull-left">
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/">Company</a>
              </li>
              <li>
                <a href="/">Portfolio</a>
              </li>
              <li>
                <a href="https://twitter.com/NutriFHIR">Twitter</a>
              </li>
            </ul>
          </nav>
          {/* <p className="copyright pull-right">
            &copy; {new Date().getFullYear()}{" "}
            <a href="http://www.creative-tim.com">Creative Tim</a>, made with
            love for a better web
          </p> */}
        </Grid>
      </footer>
    );
  }
}

export default Footer;
