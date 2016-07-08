import {observable, computed, action, autorun} from 'mobx';
import remotedev from 'mobx-remotedev';
import TodoModel from '../models/TodoModel'
import * as Utils from '../utils';

class TodoStore {
	@observable todos = [];

	@computed get activeTodoCount() {
		return this.todos.reduce(
			(sum, todo) => sum + (todo.completed ? 0 : 1),
			0
		)
	}

	@computed get completedCount() {
		return this.todos.length - this.activeTodoCount;
	}

	subscribeServerToStore(model) {
		autorun(() => {
			if (this.__isRemotedevAction) return;
			const todos = this.toJS();
			if (this.subscribedServerToModel !== true) {
				this.subscribedServerToModel = true;
				return;
			}
			fetch('/api/todos', {
				method: 'post',
				body: JSON.stringify({ todos }),
				headers: new Headers({ 'Content-Type': 'application/json' })
			})
		});
	}

	@action addTodo (title) {
		this.todos.push(new TodoModel(this, Utils.uuid(), title, false));
	}

	toggleAll (checked) {
		this.todos.forEach(
			todo => todo.completed = checked
		);
	}

	clearCompleted () {
		this.todos = this.todos.filter(
			todo => !todo.completed
		);
	}

	toJS() {
		return this.todos.map(todo => todo.toJS());
	}
	
	importState(state) {
		this.todos = state.todos.map(item => TodoModel.fromJS(this, item));
	}

	static fromJS(todos) {
		const todoStore = new this();
		todoStore.importState({ todos });
		return todoStore;
	}
}

export default remotedev(TodoStore, { name: 'TodoStore' });
