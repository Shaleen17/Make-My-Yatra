const express = require("express");

const {
  createUser,
  getUserById,
  getUsers,
} = require("../controllers/user.controller");
const asyncHandler = require("../middleware/asyncHandler");
const validateRequest = require("../middleware/validateRequest");
const {
  createUserSchema,
  getUsersSchema,
  getUserByIdSchema,
} = require("../validators/user.validator");

const router = express.Router();

router
  .route("/")
  .post(validateRequest(createUserSchema), asyncHandler(createUser))
  .get(validateRequest(getUsersSchema), asyncHandler(getUsers));
router.get(
  "/:id",
  validateRequest(getUserByIdSchema),
  asyncHandler(getUserById)
);

module.exports = router;
