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
      "INSERT INTO client (fullname, email, password) VALUES ($1, $2, $3)",
      [fullname, email, hashedPassword]
    );

    return res.status(201).json({
      message: "Client account created successfully.",
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

    const clientResult = await pool.query(
      "SELECT * FROM client WHERE email = $1",
      [email]
    );
    if (clientResult.rows.length === 0) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const client = clientResult.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, client.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const token = jwt.sign(
      { clientId: client.client_id },
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
        message: `Welcome back ${client.fullname}`,
        success: true,
        token,
        client: {
          client_id: client.client_id,
          fullname: client.fullname,
          email: client.email,
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
    const clientId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Both old and new passwords are required.",
        success: false,
      });
    }

    const clientResult = await pool.query(
      "SELECT password FROM client WHERE client_id = $1",
      [clientId]
    );

    if (clientResult.rows.length === 0) {
      return res.status(404).json({
        message: "Client not found.",
        success: false,
      });
    }

    const client = clientResult.rows[0];

    const isPasswordMatch = await bcrypt.compare(oldPassword, client.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Old password is incorrect.",
        success: false,
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE client SET password = $1 WHERE client_id = $2", [
      hashedNewPassword,
      clientId,
    ]);

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
    const clientId = req.params.id;

    const clientResult = await pool.query(
      "SELECT client_id, fullname, email FROM client WHERE client_id = $1",
      [clientId]
    );

    if (clientResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      client: clientResult.rows[0],
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
    const clientId = req.params.id;
    const { fullname, email } = req.body;

    await pool.query(
      "UPDATE client SET fullname = COALESCE($1, fullname), email = COALESCE($2, email) WHERE client_id = $3",
      [fullname, email, clientId]
    );

    const updatedClientResult = await pool.query(
      "SELECT client_id, fullname, email FROM client WHERE client_id = $1",
      [clientId]
    );

    return res.status(200).json({
      message: "Profile updated.",
      success: true,
      client: updatedClientResult.rows[0],
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

export const getClientCard = async (req, res) => {
  try {
    const clientId = req.params.id;
    const result = await pool.query(
      "SELECT * FROM clientcardinfo WHERE client_id = $1",
      [clientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No card found", success: false });
    }

    res.json({ card: result.rows[0], success: true });
  } catch (error) {
    console.error("Error fetching client card:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const addClientCard = async (req, res) => {
  try {
    const clientId = req.params.id;
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
      "INSERT INTO clientcardinfo (card_number, client_id) VALUES ($1, $2) RETURNING *",
      [cardNumber, clientId]
    );

    res.status(201).json({ card: result.rows[0], success: true });
  } catch (error) {
    console.error("Error adding client card:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const deleteClientCard = async (req, res) => {
  try {
    const clientId = req.params.id;
    const result = await pool.query(
      "DELETE FROM clientcardinfo WHERE client_id = $1 RETURNING *",
      [clientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No card found", success: false });
    }

    res.json({ message: "Card deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting client card:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
