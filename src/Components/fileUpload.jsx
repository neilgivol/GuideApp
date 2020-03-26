import React from 'react';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';


export default class FileUpload extends React.Component{
    AddPDF = (error, file)=>{
        console.log(file)
        if(this.fileValidate(file)){
            //אם הקובץ שעלה עומד בתנאים עכשיו ניתן להעלות אותו לסרבר
            //save to DB
            this.saveToDB(file);
        }
    }
    fileValidate = (file)=>{
        console.log(file.fileExtension)
        let isValid = true;
        //file.fileExtension זה בעצם הסיומת של הקובץ אם אתם רוצים להגביל את המשתמש לסוג קובץ מסוים תוסיפו תנאי
        // if (file.fileExtension !=='pdf') {
        //     isValid = false;
        // }
        if(isValid){
            console.log(file.fileExtension);
            console.log(file.fileSize);
        }
        return isValid;
    }
    saveToDB=(file)=>{
        console.log(file.file);
        
        const data= new FormData();
        data.append("UploadedFile",file.file);
        //גישה לקונטרולר
        fetch('http://localhost:49948/api/uploadPic', {
            method: 'post',
            contentType: false,
            processData: false,
            mode:'no-cors',
            body: data
        }).then(function(data) {
            console.log(data);
        }).catch((error)=>{
            console.log(error);
        });
    }
    // saveToFirebaseStorage = (file)=>{
    //     const groupData = JSON.parse(localStorage.getItem('groupData'));
    //     const uploadPic = storage.ref('images/'+groupData.GroupName+'/ProjectDocument/'+file.name).put(file);
    //     uploadPic.on('state_changed',
    //     (snapshot)=>{
    //     },(error)=>{
    //         console.log(error);
    //     },
    //     ()=>{
    //         storage.ref('images/'+groupData.GroupName+'/ProjectDocument/'+file.name).getDownloadURL()
    //         .then((url)=>{
    //             this.props.savePDF(url);
    //         })
    //     })
    // }
    render(){
        return(
            <div style={divStyle}>
                <FilePond allowMultiple={false} onaddfile={this.AddPDF} labelIdlE='PDF UPLOAD'/>
            </div>
        )
    }
}

const divStyle = {
    padding:'150px'
} 