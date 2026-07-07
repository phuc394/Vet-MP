import { pool } from "../config/database";
import { Pet, CreatePet, UpdatePet } from "../models/pet.model";
import { validateCreatePet, validateUpdatePet, validatePetId, validateSearchKey } from "../utils/Pet.validate";
import { throwIfvalidateError } from "../utils/throwValidateError";
//GET 
const getAllPets = async (): Promise<Pet[]> => {
  const [rows] = await pool.query(
    "SELECT * FROM Pet WHERE is_deleted = FALSE"
  );

  return rows as Pet[];
};

const getPetsByOwnerId = async (ownerId: number): Promise<Pet[]> => {
  throwIfvalidateError(validatePetId(ownerId));
  const [rows] = await pool.query(
    "SELECT * FROM Pet WHERE owner_id = ? AND is_deleted = FALSE",
    [ownerId]
  );

  return rows as Pet[];
};


//GET BY ID
const getPetById = async (id: number): Promise<Pet | null> => {
  throwIfvalidateError(validatePetId(id));
  const [rows] = await pool.query(
    "SELECT * FROM Pet WHERE pet_id = ? AND is_deleted = FALSE",
    [id]
  );

  const result = rows as Pet[];
  return result[0] || null;
};


// CREATE
const createPet = async (data: CreatePet): Promise<Pet> => {

  throwIfvalidateError(validateCreatePet(data));
  const {
    owner_id,
    name,
    species = null,
    breed = null,
    birth_date = null,
    weight = null,
    sex,
    notes = null,
    avatar = null,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO Pet 
    (owner_id, name, sex, species, breed, birth_date, weight, notes, avatar) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [owner_id, name, sex, species, breed, birth_date, weight, notes, avatar]
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

  throwIfvalidateError(validatePetId(id));
  throwIfvalidateError(validateUpdatePet(data));
  
  const pet = await getPetById(id);
  if (!pet) {
    throw new Error(`Pet with id ${id} not found`);
  }

  

  const fields: string[] = [];
  const values: any[] = [];
  const allowedFields = [
    "name",
    "sex",
    "species",
    "breed",
    "birth_date",
    "weight",
    "notes",
    "avatar",
  ];

  Object.entries(data).forEach(([key, value]) => {
    
    if (!allowedFields.includes(key)) {
      return;
    }
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
  // trả về pet vừa mới upd
  return getPetById(id);
};


// DELETE (soft delete)
const deletePet = async (id: number): Promise<boolean> => {

  throwIfvalidateError(validatePetId(id));
  const pet = await getPetById(id);
  if (!pet) {
    throw new Error(`Pet with id ${id} not found`);
  }
  
  const [result] = await pool.query(
    "UPDATE Pet SET is_deleted = TRUE WHERE pet_id = ? AND is_deleted = FALSE",
    [id]
  );

  const affectedRows = (result as any).affectedRows;
  return affectedRows > 0;
};


const searchPet = async(keyword : string, ownerId?: number) : Promise<Pet[]> =>{
  throwIfvalidateError(validateSearchKey(keyword));
  if(ownerId !== undefined){
    throwIfvalidateError(validatePetId(ownerId));
  }
    const params: Array<string | number> = [`%${keyword}%`];
    let sql = "SELECT * FROM Pet WHERE name LIKE ? AND is_deleted = FALSE";

    if (ownerId !== undefined) {
      sql += " AND owner_id = ?";
      params.push(ownerId);
    }

    const [rows]= await pool.query(sql, params);
    return rows as Pet[];
}

export {
  getAllPets,
  getPetsByOwnerId,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  searchPet,
};
