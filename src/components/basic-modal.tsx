import React from "react";

import Modal from 'react-bootstrap/Modal';

class BasicModalProps {
    message: string;
}

const BasicModal = (props: BasicModalProps) => {
    return (<Modal show={true} animation={false}>
        <Modal.Body>
            {props.message}
        </Modal.Body>
    </Modal>);
};

export default BasicModal;