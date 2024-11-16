export interface Challenge {
  id: number;
  startAmount: number;
  targetAmount: number;
  currentValue: number;
  completion: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface ModalContentProps {
  children: React.ReactNode;
  overlayClassName?: string;
  modalClassName?: string;
  handleShow: (show: boolean) => void;
}