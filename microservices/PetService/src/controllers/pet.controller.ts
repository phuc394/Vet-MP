import { Request, Response } from "express";
import * as petService from "../services/pet.service.js";
import { CreatePet, UpdatePet } from "../models/pet.model.js";
import { validateCreatePet } from "../utils/createPet.validate";
import { validateUpdatePet } from "../utils/updatePet.validate";


//  GET ALL 
const getPets = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pets = await petService.getAllPets();

    res.status(200).json({
      message: "Get pets successfully",
      data: pets,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};


// GET BY ID 
const getPetById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid pet id" });
      return;
    }

    const pet = await petService.getPetById(id);

    if (!pet) {
      res.status(404).json({ message: "Pet not found" });
      return;
    }

    res.status(200).json({
      message: "Get pet successfully",
      data: pet,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};


//  CREATE 
const createPet = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;

    
    const error = validateCreatePet(body);
    if (error) {
      res.status(400).json({ message: error });
      return;
    }

    
    const data: CreatePet = {
      owner_id: body.owner_id,
      name: body.name,
      species: body.species,
      breed: body.breed,
      birth_date: body.birth_date,
      weight: body.weight,
      notes: body.notes,
      avatar: body.avatar,
    };

    const newPet = await petService.createPet(data);

    res.status(201).json({
      message: "Pet created successfully",
      data: newPet,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};


//  UPDATE 
const updatePet = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid pet id" });
      return;
    }

    const body = req.body;

    
    const error = validateUpdatePet(body);
    if (error) {
      res.status(400).json({ message: error });
      return;
    }

   
    const data: UpdatePet = {};

    if (body.name !== undefined) data.name = body.name;
    if (body.species !== undefined) data.species = body.species;
    if (body.breed !== undefined) data.breed = body.breed;
    if (body.birth_date !== undefined) data.birth_date = body.birth_date;
    if (body.weight !== undefined) data.weight = body.weight;
    if (body.notes !== undefined) data.notes = body.notes;
    if (body.avatar !== undefined) data.avatar = body.avatar;

    if (Object.keys(data).length === 0) {
      res.status(400).json({
        message: "No valid fields to update",
      });
      return;
    }

    const updatedPet = await petService.updatePet(id, data);

    if (!updatedPet) {
      res.status(404).json({ message: "Pet not found" });
      return;
    }

    res.status(200).json({
      message: "Pet updated successfully",
      data: updatedPet,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};


// DELETE 
const deletePet = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid pet id" });
      return;
    }

    const deleted = await petService.deletePet(id);

    if (!deleted) {
      res.status(404).json({ message: "Pet not found or already deleted" });
      return;
    }

    res.status(200).json({
      message: "Pet deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};


export {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
};