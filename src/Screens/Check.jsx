import ReactLoading from 'react-loading';
import { Redirect, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
export default class Timer extends Component {
    constructor(props){
        super(props)
        this.state = {
            seconds: 1,
        }
    
    }
    
    componentDidMount() {
        this.myInterval = setInterval(() => {
            const { seconds } = this.state

            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }))
            }
            if (seconds === 0) {
            } 
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }

    render() {
        const { seconds } = this.state
        return (
            <div>
                {seconds === 0
                    ? <Redirect to="/signIn" />
                    : <ReactLoading type={this.props.type} color={this.props.color} height={'20%'} width={'20%'} /> 
                }
            </div>
        )
    }
}