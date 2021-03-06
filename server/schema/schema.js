const graphql = require("graphql");
const Movie = require("../models/movie");
const Director = require("../models/director");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    director: {
      type: DirectorType,
      resolve(parent, args) {
        return Director.findById(parent.directorId);
      },
    },
  }),
});

const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    movies: {
      type: GraphQLList(MovieType),
      resolve(parent, args) {
        return Movie.find({ directorId: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return Movie.findById(args.id);
      },
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return Director.findById(args.id);
      },
    },
    movies: {
      type: GraphQLList(MovieType),
      resolve(parent, args) {
        return Movie.find({});
      },
    },
    directors: {
      type: GraphQLList(DirectorType),
      resolve(parent, args) {
        return Director.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addMovie: {
      type: MovieType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        directorId: { type: GraphQLID },
      },
      resolve(parent, args) {
        const movie = new Movie({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId,
        });
        return movie.save();
      },
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        directorId: { type: GraphQLString },
      },
      resolve(parent, args) {
        const params = {};
        args.name && (params.name = args.name);
        args.genre && (params.age = args.genre);
        args.directorId && (params.directorId = args.directorId);
        return Movie.findByIdAndUpdate(args.id, params, { new: true });
      },
    },
    deleteMovie: {
      type: MovieType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Movie.findByIdAndRemove(args.id);
      },
    },
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        const director = new Director({
          name: args.name,
          age: args.age,
        });
        return director.save();
      },
    },
    updateDirctor: {
      type: DirectorType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        const params = {};
        args.name && (params.name = args.name);
        args.age && (params.age = args.age);
        return Director.findByIdAndUpdate(args.id, params, { new: true });
      },
    },
    deleteDirector: {
      type: DirectorType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Director.findByIdAndRemove(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
