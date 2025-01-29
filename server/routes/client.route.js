import express from "express";
import {
  editProfile,
  getProfile,
  login,
  logout,
  register,
  changePassword,
  addClientCard,
  getClientCard,
  deleteClientCard,
} from "../controllers/client.controller.js";
import isAuthenticated from "../middlewares/iaAuthenticated.js";

const router = express.Router();

router.route("/client/register").post(register);
router.route("/client/login").post(login);
router.route("/client/logout").get(logout);
router.route("/client/:id/profile").get(isAuthenticated, getProfile);
router.route("/client/:id/profile/edit").post(isAuthenticated, editProfile);
router
  .route("/client/:id/profile/edit/password")
  .post(isAuthenticated, changePassword);
router.route("/client/:id/card/add").post(isAuthenticated, addClientCard);
router
  .route("/client/:id/card/delete")
  .delete(isAuthenticated, deleteClientCard);
router.route("/client/:id/card").get(isAuthenticated, getClientCard);

export default router;
