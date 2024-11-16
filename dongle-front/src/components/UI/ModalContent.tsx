import React from 'react';
import ModalContentBox from '@/components/UI/ModalContentBox';
import { ModalContentProps } from '@/modules/_types';

const ModalContent: React.FC<ModalContentProps> = ({
  children,
  overlayClassName = 'bg-black bg-opacity-50',
  modalClassName = 'p-0 pt-2',
  handleShow
}) => {
  
  // console.log('ModalContent', { handleShow })
  
  return (
    <ModalContentBox overlayClassName={overlayClassName} modalClassName={modalClassName} handleShow={handleShow}>
      {children}
    </ModalContentBox>
  );
};

export default ModalContent;