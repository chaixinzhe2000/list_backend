import { Tasks, Users } from '../dbSchema';
import { dateScalar } from '../schema'

// TODO: count down feature

export const resolvers = {
	Query: {
		getAllTasks: async (obj, args, context, info) => {
			const user = await Users.findOne({ accessToken: args.id }, { tasks: 1, _id: 0 }).exec()
			// TODO: check validity
			if (typeof user !== "undefined" && user != null) {
				const taskIds = user.toObject().tasks
				return Tasks.find({ '_id': { $in: taskIds } })
			}
			return []
		}
	},
	Mutation: {
		createUser: async (root, args, context) => {
			const { name, accessToken } = args.user;
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
			// TODO: check validity
			// update user field
			const newTaskId = resp.toObject()._id
			const updateResp =
				await Users.updateOne({ accessToken: authorToken },
					{
						$push: {
							tasks: {
								$each: [newTaskId],
								$position: 0
							}
						}
					})
			return updateResp
		}
	},
};