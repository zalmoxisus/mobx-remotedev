import { observable } from 'mobx';
import { ALL_TODOS } from '../constants';
import remotedev from 'mobx-remotedev/lib/dev';

class ViewStore {
  @observable todoBeingEdited = null;
  @observable todoFilter = ALL_TODOS;
}

export default remotedev(ViewStore, { name: 'ViewStore' });
