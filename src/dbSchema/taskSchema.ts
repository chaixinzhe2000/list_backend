const mongoose = require('mongoose');

export const taskSchema = new mongoose.Schema({
	taskName: {
		type: String!
	},
	priority: {
		type: Number!,
		default: 0
	},
	deadline: {
		type: Date
	},
	completed: {
		type: Boolean!,
		default: false
	},
	authorToken: {
		type: String!
	},
	updateTime: {
		type: Date!,
		default: Date.now()
	}
});

export const Tasks = mongoose.model('Tasks', taskSchema);
