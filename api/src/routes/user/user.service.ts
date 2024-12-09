import { Request, Response } from "express";
import client from "../../config/database.config";
import { IUser, IUserDTO } from "./user.types";

const getAll = async (req: Request, res: Response) => {
  try {
    const result = await client.query('SELECT * FROM public.user');

    res.status(200).send(result.rows);
  } catch (e) {
    console.error('Database error:', e);
    res.status(500).send({ error: 'Error while fetching data' });
  }
};

const getOneByUsername = async (username: string): Promise<IUser | null> => {
  const query = "SELECT * FROM public.user WHERE username = $1";
  const values = [username];

  const result = await client.query(query, values);
  const user = result.rows[0];

  if (!user) {
    return null;
  }

  return user;
};

const getOneById = async (id: number): Promise<IUser | null> => {
  const query = "SELECT * FROM public.user WHERE id = $1";
  const values = [id];

  try {
    const result = await client.query(query, values);
    const user = result.rows[0];

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

const create = async (userDTO: IUserDTO) => {
  const query = "INSERT INTO public.user (username, password) VALUES ($1, $2)";
  const values = [userDTO.username, userDTO.password];

  try {
    await client.query(query, values);

    return true;
  } catch (error) {
    console.error("Error creating user:", error);
    return false;
  }
};

const update = async(req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = (await client.query('SELECT * FROM public.user WHERE id = $1', [id])).rows;

    if (Array.isArray(result) && result.length === 0) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    if (Array.isArray(result) && result.length === 1) {
      const currentUser = result[0];
      const newUser = {
        ...currentUser,
        ...req.body,
      };

      const sqlUpdate = 'UPDATE public.user SET username=$1, password=$2, email=$3 WHERE id = $4';
      const values = [
        newUser.username, 
        newUser.password,
        newUser.email,
        id
      ]
      try {
        await client.query(sqlUpdate, values);
        res.status(200).send({ message: "User updated successfully" });
      } catch (e) {
        console.error('Update error:', e);
        res.status(500).send({ error: 'Error while modifying data' });
      }
    }
  } catch (e) {
    console.error('Database error:', e);
    res.status(500).send({ error: 'Error while fetching data' });
  }
};

const remove = async(req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = (await client.query('SELECT * FROM public.user WHERE id = $1', [id])).rows;
    if (Array.isArray(result) && result.length === 0) {
      res.status(404).send({ error: "User not found" });
      return;
    };
    
    try {
      await client.query('DELETE FROM public.user WHERE id = $1', [id]);
      res.status(204).send();
    } catch (e) {
      console.error('Database error:', e);
      res.status(500).send({ error: 'Error while fetching data' });
    }
  } catch (e) {
    console.error('Database error:', e);
    res.status(500).send({ error: 'Error while fetching data' });
  }
};

export default {
  getAll,
  getOneById,
  create,
  update,
  remove,
  getOneByUsername,
};