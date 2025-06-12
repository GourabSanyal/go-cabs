import { atom } from 'recoil';
import { persistAtom } from '../../persist/persist';
import {User} from '../../../types/user/userTypes'

export const userAtom = atom<User | null>({
  key: 'userAtom',
  default: null,
  effects_UNSTABLE : [persistAtom()]
});
