import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../utils/db.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    const clientCount = await pool.query(
      "SELECT COUNT(*) FROM client WHERE email = $1",
      [email]
    );
    
    if (clientCount.rows[0].count > 0) {
      return res.status(401).json({
        message: "Email is already registered as a client.",
        success: false,
      });
    }

    const freelancerCount = await pool.query(
      "SELECT COUNT(*) FROM freelancer WHERE email = $1",
      [email]
    );

    if (freelancerCount.rows[0].count > 0) {
      return res.status(401).json({
        message: "Email is already registered as a freelancer.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO freelancer (fullname, email, password) VALUES ($1, $2, $3)",
      [fullname, email, hashedPassword]
    );

    return res.status(201).json({
      message: "Freelancer account created successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    const freelancerResult = await pool.query(
      "SELECT * FROM freelancer WHERE email = $1",
      [email]
    );
    if (freelancerResult.rows.length === 0) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const freelancer = freelancerResult.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, freelancer.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const token = jwt.sign(
      { freelancerId: freelancer.freelancer_id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${freelancer.fullname}`,
        success: true,
        token,
        freelancer: {
          freelancer_id: freelancer.freelancer_id,
          fullname: freelancer.fullname,
          email: freelancer.email,
        },
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const freelancerId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Both old and new passwords are required.",
        success: false,
      });
    }

    const freelancerResult = await pool.query(
      "SELECT password FROM freelancer WHERE freelancer_id = $1",
      [freelancerId]
    );

    if (freelancerResult.rows.length === 0) {
      return res.status(404).json({
        message: "Freelancer not found.",
        success: false,
      });
    }

    const freelancer = freelancerResult.rows[0];

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      freelancer.password
    );
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Old password is incorrect.",
        success: false,
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE freelancer SET password = $1 WHERE freelancer_id = $2",
      [hashedNewPassword, freelancerId]
    );

    return res.status(200).json({
      message: "Password updated successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const freelancerId = req.params.id;

    const freelancerResult = await pool.query(
      "SELECT freelancer_id, fullname, email, bio, education FROM freelancer WHERE freelancer_id = $1",
      [freelancerId]
    );

    if (freelancerResult.rows.length === 0) {
      return res.status(404).json({
        message: "Freelancer not found",
        success: false,
      });
    }

    return res.status(200).json({
      freelancer: freelancerResult.rows[0],
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const freelancerId = req.params.id;
    const { fullname, bio, education, email } = req.body;

    
    await pool.query('BEGIN');

    await pool.query(
      "UPDATE freelancer SET fullname = COALESCE($1, fullname), bio = COALESCE($2, bio), education = COALESCE($3, education), email = COALESCE($4, email) WHERE freelancer_id = $5",
      [fullname, bio, education, email, freelancerId]
    );
    
    await pool.query('COMMIT');

    const updatedFreelancerResult = await pool.query(
      "SELECT freelancer_id, fullname, email, bio, education FROM freelancer WHERE freelancer_id = $1",
      [freelancerId]
    );

    return res.status(200).json({
      message: "Profile updated.",
      success: true,
      freelancer: updatedFreelancerResult.rows[0],
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const getSkills = async (req, res) => {
  try {
    const freelancerId = req.params.id;

    const skillsResult = await pool.query(
      "SELECT skill_name FROM skills WHERE freelancer_id = $1",
      [freelancerId]
    );

    return res.status(200).json({
      skills: skillsResult.rows,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const updateSkills = async (req, res) => {
  try {
    const freelancerId = req.params.id;
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        message: "Skills must be an array",
        success: false,
      });
    }

    await pool.query("BEGIN");

    await pool.query("DELETE FROM skills WHERE freelancer_id = $1", [
      freelancerId,
    ]);

    for (let skill of skills) {
      await pool.query(
        "INSERT INTO skills (skill_name, freelancer_id) VALUES ($1, $2)",
        [skill, freelancerId]
      );
    }

    await pool.query("COMMIT");

    return res.status(200).json({
      message: "Skills updated successfully",
      success: true,
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const getFreelancerCard = async (req, res) => {
  try {
    const freelancerId = req.params.id;
    const result = await pool.query(
      "SELECT * FROM freelancercardinfo WHERE freelancer_id = $1",
      [freelancerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No card found", success: false });
    }

    res.json({ card: result.rows[0], success: true });
  } catch (error) {
    console.error("Error fetching freelancer card:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const addFreelancerCard = async (req, res) => {
  try {
    const freelancerId = req.params.id;
    const { cardNumber } = req.body;

    const clientCardCount = await pool.query(
      "SELECT COUNT(*) FROM clientcardinfo WHERE card_number = $1",
      [cardNumber]
    );
    
    if (clientCardCount.rows[0].count > 0) {
      return res.status(400).json({
        message: "Card is already registered to a client.",
        success: false,
      });
    }

    const freelancerCardCount = await pool.query(
      "SELECT COUNT(*) FROM freelancercardinfo WHERE card_number = $1",
      [cardNumber]
    );

    if (freelancerCardCount.rows[0].count > 0) {
      return res.status(400).json({
        message: "Card is already registered to a freelancer.",
        success: false,
      });
    }

    const result = await pool.query(
      "INSERT INTO freelancercardinfo (card_number, freelancer_id) VALUES ($1, $2) RETURNING *",
      [cardNumber, freelancerId]
    );

    res.status(201).json({ card: result.rows[0], success: true });
  } catch (error) {
    console.error("Error adding freelancer card:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const deleteFreelancerCard = async (req, res) => {
  try {
    const freelancerId = req.params.id;
    const result = await pool.query(
      "DELETE FROM freelancercardinfo WHERE freelancer_id = $1 RETURNING *",
      [freelancerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No card found", success: false });
    }

    res.json({ message: "Card deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting freelancer card:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getReviews = async (req, res) => {
  try {
    const freelancerId = req.params.id;

    const reviewsResult = await pool.query(
      `SELECT review_text, c.fullname FROM review r 
      join client c on c.client_id = r.client_id
      WHERE freelancer_id = $1
      order by r.review_id`,
      [freelancerId]
    );

    return res.status(200).json({
      reviews: reviewsResult.rows,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};
