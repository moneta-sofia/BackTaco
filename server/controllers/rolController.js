import { Role } from '../db/models/role.js';

export async function createRol(req, res) {
	const { name } = req.body;
	try {
		const newRole = new Role({ name });
		await newRole.save();
		res.status(201).send(newRole);
	} catch (error) {
		console.log(error);
		res.status(500).send('Error creating role');
	}
}

export async function deleteRol(req, res) {
	const { name } = req.body;
	try {
		const rolFound = Role.findOneAndDelete({ name: name });
		res.status(200).send(rolFound);
	} catch (error) {
		console.log(error);
		res.status(500).send('Error deleting role');
	}
}
