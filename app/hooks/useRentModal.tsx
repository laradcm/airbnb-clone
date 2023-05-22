'use client';
//this is a custom hook that controls the use login modal
//zustand is a npm package that assists on creating hooks
import { create } from 'zustand';

interface RentModalStore{
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;

}

const useRentModal = create<RentModalStore>( (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true}),
    onClose: () => set({ isOpen: false}),
}));
 
export default useRentModal;
