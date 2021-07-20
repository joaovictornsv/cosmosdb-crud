import { Container, SqlQuerySpec } from '@azure/cosmos';
import { Request, Response } from 'express';

class UserController {
  usersCollection: Container;

  constructor(container: Container) {
    this.usersCollection = container;
  }

  index = async (req: Request, res: Response): Promise<Response> => {
    const qr = 'SELECT u.id, u.name, u.email FROM users u';

    const { resources } = await this.usersCollection.items.query(qr).fetchAll();

    return res.status(200).json(resources);
  }

  indexById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const { resource } = await this.usersCollection.item(id).read();

    if (!resource) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(resource);
  }

  create = async (req: Request, res: Response): Promise<Response> => {
    const userData = req.body;

    if (!userData || !userData.name || !userData.email) {
      return res.status(400).json({ error: 'Provide name and email' });
    }

    const qr: SqlQuerySpec = {
      query: 'SELECT u.id FROM users u WHERE u.email = @email',
      parameters: [{ name: '@email', value: userData.email }],
    };
    const { resources } = await this.usersCollection.items.query(qr).fetchAll();

    if (resources.length !== 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const { resource } = await this.usersCollection.items.create(userData);
    return res.status(201).json(resource);
  }

  delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const { resource } = await this.usersCollection.item(id).read();

    if (!resource) {
      return res.status(404).json({ error: 'User not found' });
    }

    await this.usersCollection.item(id).delete();

    return res.status(200).json({ message: `User with id ${id} deleted` });
  }

  update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const { resource } = await this.usersCollection.item(id).read();

    if (!resource) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = req.body;

    if (!userData) {
      return res.status(200).json({ message: `No data provided to update. User with id ${id} remains unchanged`, user: resource });
    }

    const { resource: user } = await this.usersCollection.item(id)
      .replace({
        name: userData.name || resource.name,
        email: userData.email || resource.email,
        id,
      });

    return res.status(200).json({ message: `User with id ${id} updated`, user });
  }
}

export { UserController };
