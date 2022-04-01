import { Tasks } from "./taskSchema";

const mongoose = require('mongoose');

export const userSchema = new mongoose.Schema({
	name: {
		type: String!
	},
	accessToken: {
		type: String!
	},
	color: {
		type: String
	},
	tasks: {
		type: [String]!
	}
});

export const Users = mongoose.model('Users', userSchema);
