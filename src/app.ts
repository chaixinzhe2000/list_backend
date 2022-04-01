import express from 'express'
import dotenv from 'dotenv'
import { Request, Response } from 'express'
import { NodeRouter } from './nodes/NodeRouter'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import http from 'http';
import { typeDefs } from './schema'
import { resolvers } from './resolver'
import mongoose from 'mongoose'

dotenv.config()

async function startApolloServer(typeDefs, resolvers) {
	const app = express();
	app.use(cors())
	app.use(express.static('dist'))
	app.use(express.json())
	const httpServer = http.createServer(app);
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});
	const uri = process.env.DB_URI
	const mongoClient = mongoose.connect(uri)
	const db = mongoose.connection

	db.on('error', () => {
		console.error("Error while connecting to DB");
	});


	await server.start();
	server.applyMiddleware({ app });
	await new Promise<void>(resolve => httpServer.listen({ port: process.env.PORT }, resolve));
	console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers)