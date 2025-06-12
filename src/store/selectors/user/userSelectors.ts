import { selector } from 'recoil';
import { userAtom } from '../../atoms/user/userAtom';

export const userDisplayNameSelector = selector({
    key: 'userDisplayNameSelector',
    get: ({ get }) => {
        const user = get(userAtom);
        return user?.displayName || '';
    },
});

export const userEmailSelector = selector({
    key: 'userEmailSelector',
    get: ({ get }) => {
        const user = get(userAtom);
        return user?.email || '';
    },
});

export const userPhotoURLSelector = selector({
    key: 'userPhotoURLSelector',
    get: ({ get }) => {
        const user = get(userAtom);
        return user?.photoURL || '';
    },
});

export const userUIDSelector = selector({
    key: 'userUIDSelector',
    get: ({ get }) => {
        const user = get(userAtom);
        return user?.uid || '';
    },
});
