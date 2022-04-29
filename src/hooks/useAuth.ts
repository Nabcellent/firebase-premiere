import { RootState } from '../app/store';
import { useAppSelector } from '../app/hooks';

export const useAuth = () => {
    return useAppSelector((state: RootState) => state.auth);
};