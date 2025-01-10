import * as fs from "fs";

type User = {
  name: string;
  age: number;
  [key: string]: any;
};

type FilterCriteria = {
  [key: string]: any; // Clé = nom de la propriété, valeur = valeur à filtrer
};

// Fonction pour construire la requête sous forme de log
const buildQueryLog = (criteria: FilterCriteria): string => {
  const conditions = Object.entries(criteria)
    .map(([key, value]) =>
      typeof value === "string"
        ? `"${key}" LIKE "%${value}%"`
        : `"${key}" = ${value}`
    )
    .join(" AND ");
  return `Filter : WHERE ${conditions}`;
};

const filterUsers = (users: User[], criteria: FilterCriteria): User[] => {
  console.log(buildQueryLog(criteria)); // Log de la requête
  return users.filter((user) =>
    Object.entries(criteria).every(
      ([key, value]) =>
        typeof value === "string"
          ? user[key]?.toLowerCase().includes(value.toLowerCase()) // Recherche partielle pour les chaînes
          : user[key] === value // Comparaison stricte pour les autres types
    )
  );
};

// Charger les données du fichier JSON
const loadUsersFromFile = (filePath: string): User[] => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erreur lors du chargement du fichier JSON :", error);
    return [];
  }
};

// Exemple d'utilisation
const filePath = "users.json";
const users = loadUsersFromFile(filePath);

const filters: FilterCriteria = {
  name: "John",
  age: 25,
};

const filteredUsers = filterUsers(users, filters);

console.log("Utilisateurs filtrés :", filteredUsers);
