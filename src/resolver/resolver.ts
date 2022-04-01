import { Tasks, Users } from '../dbSchema';
import { dateScalar } from '../schema'

// TODO: count down feature

export const resolvers = {
	Query: {
		getAllTasks: async (obj, args, context, info) => {
			const user = await Users.findOne({ accessToken: args.id }, { taskList: 1, _id: 0 }).exec()
			const taskIds = user.toObject().taskList
			return Tasks.find({ '_id': { $in: taskIds } })
		}
	},
	Mutation: {
		createUser: async (root, args, context) => {
			const { name, accessToken } = args.info;
			const newUser = {
				name: name,
				accessToken: accessToken,
				tasks: [],
				color: "#000000"
			}
			const resp = await Users.create(newUser)
			return resp
		},
		createTask: async (root, args, context) => {
			const { taskName, priority, deadline, authorToken } = args.task
			const newTask = {
				taskName: taskName,
				priority: priority ?? 0,
				deadline: deadline ?? null,
				completed: false,
				authorToken: authorToken,
				updateTime: Date.now()
			}
			const resp = await Tasks.create(newTask)
			return resp
		}
	},
};