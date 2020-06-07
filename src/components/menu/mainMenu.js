import { MENU_CLICK } from '../Events';
import {
  SET_PROJECT_MENU,
  VISUAL_GROUPS_MENU,
  NEW_DATA_MENU,
} from './menuStates';

export const mainMenu = [
  {
    event: MENU_CLICK,
    evtDetail: SET_PROJECT_MENU.id,
    text: 'Set Project',
    color: '#F85333',
  },
  {
    event: MENU_CLICK,
    evtDetail: NEW_DATA_MENU.id,
    text: 'New Data',
    color: '#e0cb49',
  },
];
export const VGMainMenu = [
  ...mainMenu,
  {
    event: MENU_CLICK,
    evtDetail: VISUAL_GROUPS_MENU.id,
    text: 'Show Potassium Distribution',
    color: '#48BAEA',
  },
];
