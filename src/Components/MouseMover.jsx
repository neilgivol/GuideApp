import React, { Component } from 'react'
import '../Css/MouseMove.css'
export default class MouseMover extends Component {
    constructor(props) {
        super(props);
        this.state = {
          moveMouse:""
        }
    }
    componentDidMount(){
        this.setState({
            moveMouse:'start'
        })
    }


    render() {
        return (
            <div className={this.state.moveMouse}>
                <i class="fas fa-mouse-pointer"></i>
            </div>
         
        )
    }
}
