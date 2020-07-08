import React, { Component } from 'react'
import '../Css/MouseMove.css'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class MouseMover extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moveMouse: "",
            seconds: 15,
            showDialogBool: false
        }

    }
    ShowDialog = () => {
        return <div>
            <Dialog
                open={true}
                onClose={false}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Choose " + this.state.moveMouse}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        by clicking in {this.state.moveMouse} you can add your Knowledge
          </DialogContentText>
                </DialogContent>

            </Dialog>
        </div>

    }

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }
    componentDidMount() {
        this.myInterval = setInterval(() => {
            const { seconds } = this.state;
            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }))
            }
            switch (seconds) {
                case 13:
                    this.setState({
                        moveMouse: 'Languages',
                    })
                    break;
                case 12:
                    this.setState({
                        showDialogBool: true
                    })
                    break;
                case 10:
                    this.setState({
                        showDialogBool: false
                    })
                    break;
                    case 9:
                        this.setState({
                            moveMouse: 'Expertises',
                        })
                        break;
                    case 8:
                        this.setState({
                            showDialogBool: true
                        })
                        break;
                    case 6:
                        this.setState({
                            showDialogBool: false
                        })
                        break;
                        case 5:
                            this.setState({
                                moveMouse: 'Hobbies',
                            })
                            break;
                        case 4:
                            this.setState({
                                showDialogBool: true
                            })
                            break;
                        case 2:
                            this.setState({
                                showDialogBool: false,
                                moveMouse:'end'
                            })
                            break;
                default:
                    break;
            }

            // if (seconds === 12) {
            //     this.setState({
            //         moveMouse:'Languages',
            //         showLanguagesBool:true
            //     })
            // }
            // if (seconds === 11) {
            //     this.setState({
            //         showLanguagesBool:false
            //     })
            // }
            // if (seconds === 10) {

            // }

        }, 1000)
        this.setState({
            moveMouse: 'start'
        })


    }



    render() {
        return (
            <div className={this.state.moveMouse}>
                {this.state.showDialogBool ? this.ShowDialog() : null}
                <i class="fas fa-mouse-pointer"></i>
            </div>

        )
    }
}
