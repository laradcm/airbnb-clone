'use client';
//this is a custom hook that controls the use register modal
//zustand is a npm package that assists on creating hooks
import { create } from 'zustand';

interface RegisterModalStore{
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;

}

const useRegisterModal = create<RegisterModalStore>( (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true}),
    onClose: () => set({ isOpen: false}),
}));
 
export default useRegisterModal;
