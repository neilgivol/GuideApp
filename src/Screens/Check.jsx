import ReactLoading from 'react-loading';
import { Redirect, withRouter,Link } from 'react-router-dom';
import React, { Component } from 'react';
import logo from '../Img/logo.png';
import '../Css/Loading.css';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                IsraVisor
        </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default class Timer extends Component {
    constructor(props){
        super(props)
        this.state = {
            seconds: 4,
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
                    : <div className="container LoadingDiv">
                    <div className="row logoDiv">
                    <img src={logo} />
                    </div>
                    <div className="row spinDiv">
                    <ReactLoading type={this.props.type} color={this.props.color} height={'20%'} width={'20%'} />
                    </div>
                    <Box mt={8}>
                    <Copyright />
                </Box>
                    </div> 
                }
            </div>
        )
    }
}