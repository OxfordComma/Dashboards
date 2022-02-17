import clientPromise from "../../../lib/mongodb.js"

export default async function handler(req, res) {
	if (req.method == 'GET') {
		let mongoClient = await clientPromise
		var db = await mongoClient.db('fbmarketplace')
		var cl = await db.collection('cars_normalized')
		var data = await cl.find().toArray()
		console.log(data)
		res.status(200).json(data)
	}
}