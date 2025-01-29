import express from "express";
import {
  addNewGig,
  getAllGigs,
  getFreelancerGigs,
  getFreelancerGigsCount,
  deleteGig,
  editGig,
  getGig,
  buyGig,
  getPendingOrders,
  getPastOrders,
  getFreelancerPastOrders,
  getOrderDetails,
  cancelOrder,
  getFreelancerPendingOrders,
  getCompletedOrders,
  getFreelancerOrderDetails,
  submitOrder,
  confirmOrderByClient
} from "../controllers/gig.controller.js";
import isAuthenticated from "../middlewares/iaAuthenticated.js";

const router = express.Router();

router.route("/gig/addgig").post(isAuthenticated, addNewGig);
router.route("/gigs/all").get(isAuthenticated, getAllGigs);
router.route("/gig/delete/:id").delete(isAuthenticated, deleteGig);
router.route("/gig/edit/:id").post(isAuthenticated, editGig);
router.route("/gig/:id").get(isAuthenticated, getGig);

router.route("/gig/freelancerposts/count/all").get(isAuthenticated, getFreelancerGigsCount);
router.route("/gig/freelancerposts/all").get(isAuthenticated, getFreelancerGigs);
router.route('/gig/freelancer/orders/pending').get(isAuthenticated, getFreelancerPendingOrders);
router.route('/freelancer/order/:orderId').get(isAuthenticated, getFreelancerOrderDetails);
router.route('/freelancer/order/:orderId/submit').post(isAuthenticated, submitOrder);
router.route('/gig/freelancer/orders/history').get(isAuthenticated, getFreelancerPastOrders);

router.route('/gig/:id/buy').post(isAuthenticated, buyGig);
router.route('/gig/client/orders/pending').get(isAuthenticated, getPendingOrders);
router.route('/gig/client/orders/completed').get(isAuthenticated, getCompletedOrders);
router.route('/gig/client/orders/history').get(isAuthenticated, getPastOrders);
router.route('/client/order/:orderId').get(isAuthenticated, getOrderDetails);
router.route('/client/order/:orderId/cancel').post(isAuthenticated, cancelOrder);
router.route('/client/order/:orderId/confirm').post(isAuthenticated, confirmOrderByClient);

export default router;
