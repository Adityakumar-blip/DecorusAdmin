import { POST } from "./http";

const BASE_URL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/api/"
    : "http://67.205.148.222:3001/api/";
// const BASE_URL = ;

// ** auth apis
// export const SignInAPI = (data) => POST(`${BASE_URL}auth/getAllUsers`, data);
export const SignInAPI = (data) => POST(`${BASE_URL}auth/SignIn`, data);

// ** users apis
export const getAllAdminUsersApi = (data) => POST(`${BASE_URL}auth/getAllUsers`, data);
export const updateUserApi = (data) => POST(`${BASE_URL}auth/updateUser`, data);
export const deleteUserApi = (data) => POST(`${BASE_URL}auth/deleteUser`, data);
export const createUserApi = (data) => POST(`${BASE_URL}auth/createUser`, data);

// ** roles apis
export const getRoleByIdApi = (data) => POST(`${BASE_URL}admin/getRoleById`, data);
export const updateRoleApi = (data) => POST(`${BASE_URL}admin/updateRole`, data);
export const deleteRoleApi = (data) => POST(`${BASE_URL}admin/deleteRoles`, data);
export const addRolesApi = (data) => POST(`${BASE_URL}admin/createRoles`, data);
export const allRolesApi = (data) => POST(`${BASE_URL}admin/getAllRoles`, data);
export const masterRolesApi = (data) => POST(`${BASE_URL}admin/masterRoles`, data);

// ** location apis
export const getLocationByIdApi = (data) => POST(`${BASE_URL}admin/getLocationById`, data);
export const updateLocaitonApi = (data) => POST(`${BASE_URL}admin/updateLocation`, data);
export const deleteLocationApi = (data) => POST(`${BASE_URL}admin/deleteLocation`, data);
export const addLocationApi = (data) => POST(`${BASE_URL}admin/createLocation`, data);
export const allLocationsApi = (data) => POST(`${BASE_URL}admin/getAllLocations`, data);

// ** events apis
export const getEventByIdApi = (data) => POST(`${BASE_URL}admin/getEventById`, data);
export const updateEventApi = (data) => POST(`${BASE_URL}admin/updateEvent`, data);
export const deleteEventApi = (data) => POST(`${BASE_URL}admin/deleteEvent`, data);
export const addEventApi = (data) => POST(`${BASE_URL}admin/createEvent`, data);
export const allEventsApi = (data) => POST(`${BASE_URL}admin/getAllEvents`, data);

// ** message apis
export const createMessageApi = (data) => POST(`${BASE_URL}admin/createMessage`, data);
export const getAllMessageApi = (data) => POST(`${BASE_URL}admin/getAllMessages`, data);

// ** chats apis
export const getAllGroupsApi = (data) => POST(`${BASE_URL}admin/getAllGroups`, data);
export const deleteAllMessagesApi = (data) => POST(`${BASE_URL}admin/deleteAllMessages`, data);
export const deleteSingleMessageApi = (data) => POST(`${BASE_URL}admin/deleteSingleMessage`, data);
