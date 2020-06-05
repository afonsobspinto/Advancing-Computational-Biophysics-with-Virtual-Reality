import { MENU_CLICK } from '../Events';
import { SET_PROJECT_MENU } from './menuStates';

const mainMenu = [
  {
    event: MENU_CLICK,
    evtDetail: SET_PROJECT_MENU.id,
    text: 'Set Project',
    color: '#F85333',
  },
  {
    event: MENU_CLICK,
    evtDetail: 'activate_visual_group',
    text: 'Activate Visual Groups',
    color: '#48BAEA',
  },
  {
    event: MENU_CLICK,
    evtDetail: 'add_new_data',
    text: 'New Data',
    color: '#e0cb49',
  },
];
export default mainMenu;
