import express from "express";
import {
  editProfile,
  getProfile,
  login,
  logout,
  register,
  changePassword,
  getSkills,
  updateSkills,
  addFreelancerCard,
  getFreelancerCard,
  deleteFreelancerCard,
  getReviews
} from "../controllers/freelancer.controller.js";
import isAuthenticated from "../middlewares/iaAuthenticated.js";

const router = express.Router();

router.route("/freelancer/register").post(register);
router.route("/freelancer/login").post(login);
router.route("/freelancer/logout").get(logout);
router.route("/freelancer/:id/profile").get(isAuthenticated, getProfile);
router.route("/freelancer/:id/profile/edit").post(isAuthenticated, editProfile);
router
  .route("/freelancer/:id/profile/edit/password")
  .post(isAuthenticated, changePassword);
router.route("/freelancer/:id/skills").get(isAuthenticated, getSkills);
router.route("/freelancer/:id/skills/edit").post(isAuthenticated, updateSkills);
router.route("/freelancer/:id/card/add").post(isAuthenticated, addFreelancerCard);
router
  .route("/freelancer/:id/card/delete")
  .delete(isAuthenticated, deleteFreelancerCard);
router.route("/freelancer/:id/card").get(isAuthenticated, getFreelancerCard);
router.route("/freelancer/:id/reviews").get(isAuthenticated, getReviews);

export default router;
