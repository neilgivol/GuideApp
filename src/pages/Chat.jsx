import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

class Chat extends Component {
    constructor(props){
        super(props);
     
    }
    componentDidMount(){
    }
    componentDidUpdate(prefProps,state){
        if (prefProps.location.state.GuideTemp !== this.props.location.state.GuideTemp) {
        }
    }
    render () {
        return (
            <div>Chat</div>
        )
    }
}

export default withRouter(Chat)