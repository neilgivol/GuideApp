import React from 'react';
import { FilePond,registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageResize from 'filepond-plugin-image-resize';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview,FilePondPluginImageResize);

export default class FileUpload extends React.Component{
  constructor(props){
      super(props);
this.state={
    local:this.props.local,
    newURL:""
}
      let local = this.state.local;
      this.apiUrl = 'http://localhost:49948/api';
      if (!local) {
          this.apiUrl = 'http://proj.ruppin.ac.il/bgroup10/PROD/api';
      }
  }
//   38d03ea95849bc780865c7c3cb107cdb
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
        fetch(this.apiUrl + '/Guide/PostPic', {
            method: 'post',
            contentType: false,
            processData: false,
            mode:'no-cors',
            body: data
        }).then((result) => {
            console.log(result);
        }).catch((error)=>{
            console.log(error);
        });
        this.props.changeURL(file.file.name);
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
                <FilePond allowMultiple={false} onaddfile={this.AddPDF} imageResizeTargetWidth={280} imageResizeTargetHeight={280} allowImageResize={true} />
        )
    }
}

