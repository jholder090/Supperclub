const router = require("express").Router();
const {
  models: { User, Booking, Cuisine },
} = require("../db");
module.exports = router;

// USERS GET /api/users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// CHEFS GET /api/users/chefs
router.get("/chefs", async (req, res, next) => {
  try {
    const users = await User.findAll({
      where: {
        role: "CHEF",
      },
      include: {
        model: Booking,
        as: "chefBooking",
      },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// MEMBERS GET /api/users/members
router.get("/members", async (req, res, next) => {
  try {
    const users = await User.findAll({
      where: {
        role: "MEMBER",
      },
      include: {
        model: Booking,
        as: "memberBooking",
      },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// MEMBERS GET /api/users/members/:id
router.get("/members/:id", async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "chefBooking",
        },
        {
          model: User,
          as: "memberBooking",
        },
      ],
    });
    res.json(booking)
  } catch (err) {
    next (err);
  }
})
