import { pool } from "../config/database";
import { Pet, CreatePet, UpdatePet } from "../models/pet.model";

//GET 
const getAllPets = async (): Promise<Pet[]> => {
  const [rows] = await pool.query(
    "SELECT * FROM Pet WHERE is_deleted = FALSE"
  );

  return rows as Pet[];
};


//GET BY ID
const getPetById = async (id: number): Promise<Pet | null> => {
  const [rows] = await pool.query(
    "SELECT * FROM Pet WHERE pet_id = ? AND is_deleted = FALSE",
    [id]
  );

  const result = rows as Pet[];
  return result[0] || null;
};


// CREATE
const createPet = async (data: CreatePet): Promise<Pet> => {
  const {
    owner_id,
    name,
    species = null,
    breed = null,
    birth_date = null,
    weight = null,
    notes = null,
    avatar = null,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO Pet 
    (owner_id, name, species, breed, birth_date, weight, notes, avatar) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [owner_id, name, species, breed, birth_date, weight, notes, avatar]
  );

  const insertId = (result as any).insertId;

  // lấy lại record vừa tạo
  const newPet = await getPetById(insertId);
  return newPet as Pet;
};


// UPDATE
const updatePet = async (
  id: number,
  data: UpdatePet
): Promise<Pet | null> => {

  const fields: string[] = [];
  const values: any[] = [];

  Object.entries(data).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  if (fields.length === 0) {
    return getPetById(id);
  }

  values.push(id);

  await pool.query(
    `UPDATE Pet SET ${fields.join(", ")} WHERE pet_id = ? AND is_deleted = FALSE`,
    values
  );

  return getPetById(id);
};


// DELETE (soft delete)
const deletePet = async (id: number): Promise<boolean> => {
  const [result] = await pool.query(
    "UPDATE Pet SET is_deleted = TRUE WHERE pet_id = ? AND is_deleted = FALSE",
    [id]
  );

  const affectedRows = (result as any).affectedRows;
  return affectedRows > 0;
};


const searchPet = async(keyword : string) : Promise<Pet[]> =>{
    const [rows]= await pool.query(`SELECT * FROM Pet Where name LIKE ? AND is_deleted = FALSE`,[`%${keyword}%`]);
    return rows as Pet[];
}

export {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  searchPet,
};