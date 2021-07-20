import { SqlQuerySpec } from '@azure/cosmos';
import { Request, Response } from 'express';
import { usersCollection } from '../database';

class UserController {
  async index(req: Request, res: Response): Promise<Response> {
    const qr = 'SELECT u.id, u.name, u.email FROM users u';

    const { resources } = await usersCollection.items.query(qr).fetchAll();

    return res.status(200).json(resources);
  }

  async indexById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const { resource } = await usersCollection.item(id).read();

    if (!resource) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(resource);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const userData = req.body;

    if (!userData || !userData.name || !userData.email) {
      return res.status(400).json({ error: 'Provide name and email' });
    }

    const qr: SqlQuerySpec = {
      query: 'SELECT u.id FROM users u WHERE u.email = @email',
      parameters: [{ name: '@email', value: userData.email }],
    };
    const { resources } = await usersCollection.items.query(qr).fetchAll();

    if (resources.length !== 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const { resource } = await usersCollection.items.create(userData);
    return res.status(201).json(resource);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const { resource } = await usersCollection.item(id).read();

    if (!resource) {
      return res.status(404).json({ error: 'User not found' });
    }

    await usersCollection.item(id).delete();

    return res.status(200).json({ message: `User with id ${id} deleted` });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const { resource } = await usersCollection.item(id).read();

    if (!resource) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = req.body;

    const { resource: user } = await usersCollection.item(id)
      .replace({
        name: userData.name || resource.name,
        email: userData.email || resource.email,
        id,
      });

    return res.status(200).json({ message: `User with id ${id} updated`, user });
  }
}

export { UserController };
