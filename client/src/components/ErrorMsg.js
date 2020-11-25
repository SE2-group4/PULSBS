import React from 'react' ;
import Alert from 'react-bootstrap/Alert';

function ErrorMsg(props){
    return (
        <Alert variant="danger" onClose={()=>props.onClose(props.name)} dismissible>
            {props.msg}
        </Alert>
    )
}

export default ErrorMsg;