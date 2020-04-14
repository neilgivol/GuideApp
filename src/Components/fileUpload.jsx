import React, { Component } from 'react';

class Fileupload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: ''
        };
        //const formData = new FormData();

    }

    setFile = (e)=> {
        this.setState({ file: e.target.files[0] });
    }
    render() {
        return (
            <div className="container-fluid">
                <form onSubmit={e => this.submit(e)}>
                    <div className="col-sm-12 btn btn-primary">
                        File Upload
          </div>
                    <h1>File Upload</h1>
                    <input type="file" onChange={e => this.setFile(e)} />
                    <button className="btn btn-primary" type="submit">Upload</button>
                </form>
            </div>
        )
    }
}
export default Fileupload;  