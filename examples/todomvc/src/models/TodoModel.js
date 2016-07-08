import {observable} from 'mobx';

class TodoModel {
	store;
	id;
	@observable title;
	@observable completed;

	constructor(store, id, title, completed) {
		this.store = store;
		this.importState({ id, title, completed });
	}

	importState(state) {
		this.id = state.id;
		this.title = state.title;
		this.completed = state.completed;
	}

	toggle() {
		this.completed = !this.completed;
	}

	destroy() {
		this.store.todos.remove(this);
	}

	setTitle(title) {
		this.title = title;
	}

	toJS() {
		return {
			id: this.id,
			title: this.title,
			completed: this.completed
		};
	}

	static fromJS(store, object) {
		return new this(store, object.id, object.title, object.completed);
	}
}

export default TodoModel;
