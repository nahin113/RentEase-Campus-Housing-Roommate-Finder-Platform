import { create } from 'zustand';

interface AuthStore {
  isAuthModalOpen: boolean;
  authModalView: 'signin' | 'signup';
  pendingAction: (() => void) | null;
  
  openAuthModal: (view: 'signin' | 'signup', callback?: () => void) => void;
  closeAuthModal: () => void;
  setPendingAction: (action: (() => void) | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({

  isAuthModalOpen: false,
  authModalView: 'signin',
  pendingAction: null,


  openAuthModal: (view, callback) => 
    set({ 
      isAuthModalOpen: true, 
      authModalView: view,
      pendingAction: callback ? () => callback : null 
    }),
    
  closeAuthModal: () => 
    set({ 
      isAuthModalOpen: false, 
      pendingAction: null 
    }),
    
  setPendingAction: (action) => 
    set({ pendingAction: action }),
}));