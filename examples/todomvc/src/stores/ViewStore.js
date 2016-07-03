import {observable} from 'mobx';
import { ALL_TODOS } from '../constants';

class ViewStore {
	@observable todoBeingEdited = null;
	@observable todoFilter= ALL_TODOS;
}

export default ViewStore;
