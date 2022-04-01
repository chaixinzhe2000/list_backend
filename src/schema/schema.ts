import { gql } from 'apollo-server-express';
import { GraphQLScalarType, Kind } from 'graphql'

export const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
	scalar Date

  type Task {
		taskName: String
		priority: Int
		deadline: Date
		completed: Boolean
		authorToken: String
		updateTime: Date
	}

	type User {
		name: String
		accessToken: String
		color: String
		tasks: [String]
	}

	input UserInput {
		name: String
		accessToken: String
	}

	input TaskInput {
		taskName: String
		priority: Int
		deadline: Date
		authorToken: String
	}

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getAllTasks(id: String): [Task]
		getCompletedTasks(id: String): [Task]
  }

	type Mutation {
		createUser(info: UserInput): User
		createTask(task: TaskInput): Task
		deleteTask(id: String): Boolean
	}
`

export const dateScalar = new GraphQLScalarType({
	name: 'Date',
	description: 'Date custom scalar type',
	serialize(value: any) {
		return value.getTime(); // Convert outgoing Date to integer for JSON
	},
	parseValue(value: any) {
		return new Date(value); // Convert incoming integer to Date
	},
	parseLiteral(ast) {
		if (ast.kind === Kind.INT) {
			return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
		}
		return null; // Invalid hard-coded value (not an integer)
	},
});