import { Request, Response } from "express";
import * as petService from "../services/pet.service";
import { CreatePet, UpdatePet } from "../models/pet.model";
import { handleControllerError } from "../utils/errorHandler";


//  GET ALL 
const getPets = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const pets = user.role === "admin"
      ? await petService.getAllPets()
      : await petService.getPetsByOwnerId(user.user_id);

    res.status(200).json({
      message: "Get pets successfully",
      data: pets,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};


// GET BY ID 
const getPetById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if(!Number.isFinite(id) || id <= 0) {
      res.status(400).json({ message: "Invalid pet id" });
      return;
    }

    const pet = await petService.getPetById(id);

    if (!pet) {
      res.status(404).json({ message: "Pet not found" });
      return;
    }

    const user = (req as any).user;
    if (user.role !== "admin" && pet.owner_id !== user.user_id) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    res.status(200).json({
      message: "Get pet successfully",
      data: pet,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};


//  CREATE 
const createPet = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const user = (req as any).user;
    const data: CreatePet = {
      owner_id: user.user_id,
      name: body.name,
      species: body.species,
      breed: body.breed,
      birth_date: body.birth_date,
      weight: body.weight,
      sex: body.sex,
      notes: body.notes,
      avatar: body.avatar,
    };

    const newPet = await petService.createPet(data);

    res.status(201).json({
      message: "Pet created successfully",
      data: newPet,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};


//  UPDATE 
const updatePet = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

   if(!Number.isFinite(id) || id <= 0) {
      res.status(400).json({ message: "Invalid pet id" });
      return;
    }

    const body = req.body;

    const data: UpdatePet = {};

    if (body.name !== undefined) data.name = body.name;
    if (body.species !== undefined) data.species = body.species;
    if (body.breed !== undefined) data.breed = body.breed;
    if (body.birth_date !== undefined) data.birth_date = body.birth_date;
    if (body.weight !== undefined) data.weight = body.weight;
    if (body.sex !== undefined) data.sex = body.sex;
    if (body.notes !== undefined) data.notes = body.notes;
    if (body.avatar !== undefined) data.avatar = body.avatar;

    const updatedPet = await petService.updatePet(id, data);

    res.status(200).json({
      message: "Pet updated successfully",
      data: updatedPet,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};


// DELETE 
const deletePet = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if(!Number.isFinite(id) || id <= 0) {
      res.status(400).json({ message: "Invalid pet id" });
      return;
    }

    const deleted = await petService.deletePet(id);


    res.status(200).json({
      message: "Pet deleted successfully",
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

const searchPet= async(
  req: Request,
  res: Response
) : Promise <void>=>{

 
  try{
      const keyword= req.query.name as string;
      const user = (req as any).user;
      const pets = await petService.searchPet(
        keyword,
        user.role === "admin" ? undefined : user.user_id,
      );
      res.status(200).json({
      message: "Search pets successfully",
      total: pets.length,
      data: pets,
    });
  } catch (error){
    handleControllerError(res, error);
  }

  

}


export {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  searchPet
};
