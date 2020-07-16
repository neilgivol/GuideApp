import React, { Component } from 'react';
import logoLast from '../Img/logoadvisor.png';
import { Link, withRouter } from 'react-router-dom';
import { Col, Row, Container } from 'react-bootstrap';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import './Admin.css';
function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                IsrAdvisor
        </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
class Admin extends Component {
    render() {
        return (
            <Container fluid className="AdminContainer">
                <Row>
                    <Col className="BackAdmin">
                        <Link to="/"><i className="fa fa-undo" aria-hidden="true"></i></Link>
                    </Col>
                </Row>
                <Row>
                    <Col className="logoDivAdmin">
                        <img src={logoLast} />
                    </Col>
                </Row>
                <Row className="EditPages">
                    <Col><Link to="/Hobbies"> Edit Hobbies </Link></Col>
                    <Col><Link to="/Expertises"> Edit Expertises </Link></Col>
                    <Col><Link to="/Languages"> Edit Languages </Link></Col>
                </Row>
                <Row>
                    <Box id="" mt={8} className="copy2">
                        <Copyright />
                    </Box>
                </Row>
            </Container>
        );
    }
}

export default withRouter(Admin);