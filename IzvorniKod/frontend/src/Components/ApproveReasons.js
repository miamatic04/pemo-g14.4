import React from 'react';
import PropTypes from 'prop-types';
import '../stilovi/ApproveReasons.css';

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop1">
            <div className="modal-content1">
                <button className="modal-close1" onClick={onClose}>
                    ×
                </button>
                {children}
            </div>
        </div>
    );
}

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default Modal;
