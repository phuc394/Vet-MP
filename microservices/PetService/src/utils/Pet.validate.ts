const validateCreatePet = (data: any): string | null => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return "Invalid data format";
  }

  if (
    data.owner_id == null ||
    data.name == null ||
    data.sex == null
  ) {
    return "Missing required fields: owner_id, name, sex";
  }

  if(typeof data.owner_id !== "number" || !Number.isFinite(data.owner_id) || data.owner_id <= 0) {
    return "owner_id must be a positive number";
  }

  if(typeof data.name !== "string" || data.name.trim() === "") {
    return "name must be a non-empty string";
  }
  if(data.name.length > 50) {
    return "name must be less than 50 characters";
  }

  if(data.species !== undefined) {
    if(typeof data.species !== "string") {
      return "species must be a string";
    }
    if(data.species.length > 50) {
      return "species must be less than 50 characters";
    }
  }

  if(data.breed !== undefined) {
    if(typeof data.breed !== "string" ) {
      return "breed must be a string";
    }
    if(data.breed.length > 50) {
      return "breed must be less than 50 characters";
    }
  }

  if(data.notes !== undefined && typeof data.notes !== "string" ) {
    return "notes must be a string";
  }

  if(data.avatar !== undefined && typeof data.avatar !== "string") {
    return "avatar must be a string";
  }


  if (data.sex !== "male" && data.sex !== "female") {
    return "sex must be male or female";
  }

  if (data.weight !== undefined) {
    if (typeof data.weight !== "number" || !Number.isFinite(data.weight)) {
      return "weight must be a number";
    }
    if (data.weight <= 0) {
      return "weight must be > 0";
    }
  }
  if (data.birth_date !== undefined) {
    if (typeof data.birth_date !== "string" || data.birth_date.trim() === "") {
      return "birth_date must be a valid date";
    }
    const birthDate = new Date(data.birth_date);
    if (Number.isNaN(birthDate.getTime())) {
      return "birth_date must be a valid date";
    }
    if (birthDate.getTime() > Date.now()) {
      return "birth_date cannot be in the future";
    }
  }

  return null;
};

const validateUpdatePet = (data: any): string | null => {
// check data
if(!data || typeof data !== "object" || Array.isArray(data) || Object.keys(data).length === 0) {
  return "Invalid data format";
}

// check name
if(data.name !== undefined) {
  if(typeof data.name !== "string" || data.name.trim() === "") {
    return "name must be a non-empty string";
  }
  if(data.name.length > 50) {
    return "name must be less than 50 characters";
  }
}

// check sex
if(data.sex !== undefined) {
  if(data.sex !=="male" && data.sex !== "female") {
    return "sex must be male or female";
  }
}

// check species
if(data.species !== undefined) {
  if(typeof data.species !== "string") {
    return "species must be a string";
  }
  if(data.species.length > 50) {
    return "species must be less than 50 characters";
  }
}

// check breed
if(data.breed !== undefined) {
  if(typeof data.breed !== "string") {
    return "breed must be a string";
  }
  if(data.breed.length > 50) {
    return "breed must be less than 50 characters";
  }
}

// check weight
if(data.weight !== undefined) {
  if(typeof data.weight !== "number" || !Number.isFinite(data.weight)) { 
    return "weight must be a number";
  }
  if(data.weight <= 0) {
    return "weight must be > 0";
  }
}

// check birth_date
if(data.birth_date !== undefined) {
  if (typeof data.birth_date !== "string" || data.birth_date.trim() === "") {
    return "birth_date must be a valid date";
  }
  const birthDate = new Date(data.birth_date);
  if (Number.isNaN(birthDate.getTime())) {
    return "birth_date must be a valid date";
  }
  if (birthDate.getTime() > Date.now()) {
    return "birth_date cannot be in the future";
  }
}

// check notes
if(data.notes !== undefined) {
  if(typeof data.notes !== "string") {
    return "notes must be a string";
  }
}

if(data.avatar !== undefined) {
  if(typeof data.avatar !== "string") {
    return "avatar must be a string";
  } 
}
return null;
};

const validatePetId = (pet_id: number): string | null => {
  if (typeof pet_id !== "number" || !Number.isFinite(pet_id) || pet_id <= 0) {
    return "pet_id must be a positive number";
  }
  return null;
};

const validateSearchKey = (searchKey: string): string | null => {
  if (typeof searchKey !== "string" || searchKey.trim() === "") {
    return "searchKey must be a non-empty string";
  }
  if(searchKey.length > 50) {
    return "searchKey must be less than 50 characters";
  }
  return null;
};

export { validateCreatePet, validateUpdatePet, validatePetId, validateSearchKey };
