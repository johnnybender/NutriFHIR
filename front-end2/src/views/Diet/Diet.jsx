import React, { Component } from "react";

class Diet extends Component {

    constructor(props) {
        super(props);
        this.props.loadState();
        this.state = {
        }
    }
    
    componentDidMount() {
    }

    render() {
        return (
            <div className="content">
                todo...
            </div>
        );
    }
}

export default Diet;