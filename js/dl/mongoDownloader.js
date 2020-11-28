const MongoClient = require('mongodb').MongoClient;
var mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true }
var _client

let connectToMongo = async () => {
	console.log('Mongo client connecting.')
	_client = await MongoClient.connect(process.env.mongo_uri, mongoOptions)
	console.log('Mongo client connected.')
	// return client
}


let getMongoData = async (database, collection, filter) => {
	var db = await _client.db(database)
	var cl = await db.collection(collection)
	var data = await cl.find(filter).toArray()
	// client.close()
	return data
}

// let updateMongoData = async (database, collection, data) => {
// 	var client = await MongoClient.connect(process.env.mongo_uri)
// 	var db = client.db(database)
// 	var cl = db.collection(collection)
// 	var results = await Promise.all(data.map(async d => 
// 		{
// 			var result = await cl.updateOne(
// 				{ '_id': d['_id'] }, 
// 				{ '$set': d }, 
// 				{ 'upsert': true })
// 			return result
// 		}))
// 	client.close()
		
// 	return results.reduce((acc, curr) => acc.concat(curr.result), [])
// }

// let addMongoData = async (database, collection, data) => {
// 	var client = await MongoClient.connect(process.env.mongo_uri)
// 	var db = client.db(database)
// 	var cl = db.collection(collection)
// 	try {
// 		var res = await cl.insertMany(data)
// 		console.log(res.insertedCount)
// 	}
// 	catch (err) { console.log(err) }
// 	finally { client.close() }
// }


let getMLModel = async () => {
	// var db = await MongoClient.connect(process.env.mongo_uri, mongoOptions)
	var db = _client.db('cl_cars')
	var cl = db.collection('porsche_linear_model')
	var model = await cl.find().toArray()


	return model[0]
}

let applyMLModel = (model, data) => {
	var model = model.LinearRegression
	console.log(model)

	var categoricalInputs = model.input_types
		.filter(i => i.dtype == 'category')
		.map(i => i.column)
	var numericInputs = model.input_types
		.filter(i => ['int', 'float64'].includes(i.dtype))
		.map(i => i.column)
	var inputs = ['intercept'].concat( 
		(categoricalInputs.concat(numericInputs)).sort() 
	)
	var outputs = model.outputs
	

	data = data.map(datum => {
		// console.log(datum)
		var weightedInputs = inputs.map(i => {
			if (i == 'intercept')
				return model.weights[i].weight;
			if (categoricalInputs.includes(i)) {
				var encodedName = i + '_' + datum[i].toString()
				if (model.weights[encodedName] != undefined)
					return parseFloat(model.weights[encodedName].weight)
				else
					return 0
			}
			if (numericInputs.includes(i)) {
				var scaledInput  = (datum[i] - model.weights[i].mean) / model.weights[i].stdev
				return parseFloat(model.weights[i].weight) * parseFloat(scaledInput)
			}
		})
		// console.log(weightedInputs)
		var predictedOutput = parseInt(weightedInputs.reduce((a, b) => a + b, 0))
		datum['^'+outputs[0]] = predictedOutput
		return datum
	})

	return data
}

// let getOverwatchData = async () => {
// 	var client = await MongoClient.connect(process.env.mongo_uri, mongoOptions)//.then(db => {
// 	var db = await client.db('overwatch')
// 	var cl = db.collection('overwatchleague_2019')
// 	var data = await cl.find({'team': 'Los Angeles Valiant'}).toArray()
// 	console.log(data)
// 	client.close()
// 	return data
// }


module.exports = {
	getMongoData: getMongoData,
	connectToMongo: connectToMongo,
	// addMongoData: addMongoData,
	// updateMongoData: updateMongoData,

	// getPorscheData: getPorscheData,
	// getPorscheNormalizedData: getPorscheNormalizedData,
	// getPorschePredictedData: getPorschePredictedData,
	// addPorscheData: addPorscheData,
	// updatePorscheData: updatePorscheData,
	// updatePorscheNormalizedData: updatePorscheNormalizedData,
	getMLModel: getMLModel,
	applyMLModel: applyMLModel,
	// getOverwatchData: getOverwatchData,
}