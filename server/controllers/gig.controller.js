import pool from "../utils/db.js";

export const addNewGig = async (req, res) => {
  try {
    const { title, description, price, gig_type } = req.body;
    const freelancerId = req.id;

    if (!title || !description || !price || !gig_type) {
      return res.status(400).json({
        message: "Missing required fields.",
        success: false,
      });
    }

    const cardCheck = await pool.query(
      "SELECT * FROM freelancercardinfo WHERE freelancer_id = $1",
      [freelancerId]
    );

    if (cardCheck.rows.length === 0) {
      return res.status(403).json({
        message: "You must set up your card before posting gigs.",
        success: false,
      });
    }

    const gig = await pool.query(
      "INSERT INTO gigs (title, description, price, gig_type, freelancer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, price, gig_type, freelancerId]
    );

    return res.status(201).json({
      message: "New gig posted successfully.",
      gig: gig.rows[0],
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

export const getAllGigs = async (req, res) => {
  try {
    const gigs = await pool.query(
      "SELECT g.gig_id, g.title, g.price, g.created_at, g.gig_type, f.fullname AS freelancer_name FROM gigs g JOIN freelancer f ON g.freelancer_id = f.freelancer_id"
    );
    return res.status(200).json({
      gigs: gigs.rows,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const getFreelancerGigs = async (req, res) => {
  try {
    const freelancerId = req.id;

    const gigs = await pool.query(
      "SELECT g.gig_id, g.title, g.price, g.created_at, g.gig_type, f.fullname AS freelancer_name FROM gigs g JOIN freelancer f ON g.freelancer_id = f.freelancer_id AND g.freelancer_id = $1",
      [freelancerId]
    );

    return res.status(200).json({
      gigs: gigs.rows,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const getFreelancerGigsCount = async (req, res) => {
  try {
    const freelancerId = req.id;

    const countResult = await pool.query(
      "SELECT COUNT(*) AS gig_count FROM gigs g WHERE g.freelancer_id = $1",
      [freelancerId]
    );

    return res.status(200).json({
      gig_count: countResult.rows[0].gig_count,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const deleteGig = async (req, res) => {
  try {
    const gigId = req.params.id;
    const freelancerId = req.id;

    if (!gigId || !freelancerId) {
      return res.status(400).json({
        message: "Invalid request data",
        success: false,
      });
    }

    await pool.query("BEGIN");

    const gig = await pool.query("SELECT * FROM gigs WHERE gig_id = $1", [
      gigId,
    ]);
    if (gig.rows.length === 0) {
      return res.status(404).json({
        message: "Gig not found",
        success: false,
      });
    }

    if (gig.rows[0].freelancer_id !== freelancerId) {
      return res.status(403).json({
        message: "Unauthorized to delete this gig",
        success: false,
      });
    }

    const pendingOrders = await pool.query(
      "SELECT * FROM orders WHERE gig_id = $1 AND order_status In ('P','C')",
      [gigId]
    );
    if (pendingOrders.rows.length > 0) {
      return res.status(400).json({
        message: "Complete pending order for this gig first",
        success: false,
      });
    }

    await pool.query("DELETE FROM gigs WHERE gig_id = $1", [gigId]);

    await pool.query("COMMIT");

    return res.status(200).json({
      message: "Gig deleted successfully",
      success: true,
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const editGig = async (req, res) => {
  try {
    const gigId = req.params.id;
    const freelancerId = req.id;
    const { title, description, price, gig_type } = req.body;

    await pool.query("BEGIN");

    const gig = await pool.query("SELECT * FROM gigs WHERE gig_id = $1", [
      gigId,
    ]);
    if (gig.rows.length === 0) {
      return res.status(404).json({
        message: "Gig not found",
        success: false,
      });
    }

    if (gig.rows[0].freelancer_id !== freelancerId) {
      return res.status(403).json({
        message: "Unauthorized to edit this gig",
        success: false,
      });
    }

    const pendingOrders = await pool.query(
      "SELECT * FROM orders WHERE gig_id = $1 AND order_status = 'P'",
      [gigId]
    );
    if (pendingOrders.rows.length > 0) {
      return res.status(400).json({
        message: "Complete pending order for this gig first",
        success: false,
      });
    }

    await pool.query(
      "UPDATE gigs SET title = COALESCE($1, title), description = COALESCE($2, description), price = COALESCE($3, price), gig_type = COALESCE($4, gig_type) WHERE gig_id = $5",
      [title, description, price, gig_type, gigId]
    );

    const updatedGig = await pool.query(
      "SELECT * FROM gigs WHERE gig_id = $1",
      [gigId]
    );

    await pool.query("COMMIT");

    return res.status(200).json({
      message: "Gig updated successfully",
      gig: updatedGig.rows[0],
      success: true,
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const getGig = async (req, res) => {
  const gigId = req.params.id;

  try {
    const gig = await pool.query(
      "SELECT g.gig_id, g.title, g.description, g.price, g.gig_type, g.created_at, f.fullname AS freelancer_name, f.freelancer_id FROM gigs g JOIN freelancer f ON g.freelancer_id = f.freelancer_id WHERE g.gig_id = $1",
      [gigId]
    );

    if (gig.rows.length === 0) {
      return res.status(404).json({
        message: "Gig not found",
        success: false,
      });
    }

    return res.status(200).json({
      gig: gig.rows[0],
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

export const buyGig = async (req, res) => {
  try {
    await pool.query("BEGIN");

    const clientId = req.id;

    const client = await pool.query(
      "SELECT * FROM client WHERE client_id = $1",
      [clientId]
    );

    if (client.rows[0].client_id !== clientId) {
      return res.status(403).json({
        message: "Unauthorized to edit this gig",
        success: false,
      });
    }

    const pendingOrdersResult = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE client_id = $1 AND order_status = 'P'",
      [clientId]
    );

    const pendingOrdersCount = parseInt(pendingOrdersResult.rows[0].count);

    if (pendingOrdersCount >= 3) {
      await pool.query("ROLLBACK");
      return res.status(400).json({
        message:
          "You already have 3 pending orders. Please complete or cancel existing orders before purchasing a new gig.",
        success: false,
      });
    }

    const cardResult = await pool.query(
      "SELECT * FROM clientcardinfo WHERE client_id = $1",
      [clientId]
    );

    if (cardResult.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(400).json({
        message: "No card found. Please add a payment method to proceed.",
        success: false,
      });
    }

    const gigId = req.params.id;
    const { amount, description } = req.body;

    const gigResult = await pool.query(
      "SELECT freelancer_id, price FROM gigs WHERE gig_id = $1",
      [gigId]
    );

    if (gigResult.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({
        message: "Gig not found",
        success: false,
      });
    }

    const { freelancer_id } = gigResult.rows[0];

    const orderResult = await pool.query(
      "INSERT INTO orders (order_status, gig_id, freelancer_id, client_id, description) VALUES ('P', $1, $2, $3, $4) RETURNING order_id",
      [gigId, freelancer_id, clientId, description]
    );

    const orderId = orderResult.rows[0].order_id;

    await pool.query(
      "INSERT INTO payment (amount_to_pay, order_id) VALUES ($1, $2)",
      [amount, orderId]
    );

    await pool.query("COMMIT");

    return res.status(201).json({
      message: "Gig purchased successfully",
      success: true,
      orderId: orderId,
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

export const getPendingOrders = async (req, res) => {
  try {
    const clientId = req.id;

    const result = await pool.query(
      `
      SELECT o.order_id, o.order_status, g.title as gig_title, f.fullname as freelancer_name, p.amount_to_pay
      FROM orders o
      JOIN gigs g ON o.gig_id = g.gig_id
      JOIN freelancer f ON o.freelancer_id = f.freelancer_id
      JOIN payment p ON o.order_id = p.order_id
      WHERE o.client_id = $1 AND o.order_status = 'P'
      ORDER BY o.order_id DESC
    `,
      [clientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No Pending Order found",
        success: false,
      });
    }

    res.json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching pending orders",
    });
  }
};

export const getCompletedOrders = async (req, res) => {
  try {
    const clientId = req.id;

    const result = await pool.query(
      `
      SELECT o.order_id, o.order_status, g.title as gig_title, f.fullname as freelancer_name, p.amount_to_pay
      FROM orders o
      JOIN gigs g ON o.gig_id = g.gig_id
      JOIN freelancer f ON o.freelancer_id = f.freelancer_id
      JOIN payment p ON o.order_id = p.order_id
      WHERE o.client_id = $1 AND o.order_status = 'C'
      ORDER BY o.order_id DESC
    `,
      [clientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No Completed Order found",
        success: false,
      });
    }

    res.json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching pending orders",
    });
  }
};

export const getPastOrders = async (req, res) => {
  try {
    const clientId = req.id;

    const result = await pool.query(
      `
      SELECT 
        COALESCE(g.title, '🚫 This gig has been deleted') AS gig_title, 
        COALESCE(f.fullname, 'Anonymous') AS freelancer_name, 
        gch.amount_to_pay, 
        gch.order_status 
      FROM gig_client_history gch
      LEFT JOIN gigs g ON gch.gig_id = g.gig_id
      LEFT JOIN freelancer f ON g.freelancer_id = f.freelancer_id
      WHERE gch.client_id = $1
      ORDER BY gch.gch_id DESC
    `,
      [clientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No History of Orders found",
        success: false,
      });
    }

    res.json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    console.error("Error fetching past orders:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching past orders",
    });
  }
};

export const getFreelancerPastOrders = async (req, res) => {
  try {
    const freelancerId = req.id;

    const result = await pool.query(
      `
      SELECT 
        COALESCE(g.title, '🚫 This gig has been deleted') AS gig_title, 
        COALESCE(c.fullname, '🚫 This user has been deleted') AS client_name, 
        gch.amount_to_pay, 
        gch.order_status 
      FROM gig_client_history gch
      LEFT JOIN gigs g ON gch.gig_id = g.gig_id
      LEFT JOIN client c ON gch.client_id = c.client_id
      WHERE gch.gig_id IN (
        SELECT gig_id FROM gigs WHERE freelancer_id = $1
      )
      ORDER BY gch.gch_id DESC
    `,
      [freelancerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No History of Orders found",
        success: false,
      });
    }

    res.json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    console.error("Error fetching past orders:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching past orders",
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const clientId = req.id;
    const orderId = req.params.orderId;
    const result = await pool.query(
      `
      SELECT o.order_id, g.title as gig_title, f.fullname as freelancer_name, 
             p.amount_to_pay, o.order_status, o.created_at, o.description
      FROM orders o
      JOIN gigs g ON o.gig_id = g.gig_id
      JOIN freelancer f ON o.freelancer_id = f.freelancer_id
      JOIN payment p ON o.order_id = p.order_id
      WHERE o.client_id = $1 AND o.order_id = $2
    `,
      [clientId, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching order details",
    });
  }
};

export const cancelOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const clientId = req.id;
    const orderId = req.params.orderId;

    const orderResult = await client.query(
      "SELECT order_status, gig_id, client_id FROM orders WHERE order_id = $1 AND client_id = $2",
      [orderId, clientId]
    );

    if (orderResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (orderResult.rows[0].order_status !== "P") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled",
      });
    }

    const paymentResult = await client.query(
      "SELECT amount_to_pay FROM payment WHERE order_id = $1",
      [orderId]
    );

    if (paymentResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Payment not found for this order",
      });
    }

    const amountToPay = paymentResult.rows[0].amount_to_pay;

    await client.query(
      "UPDATE orders SET order_status = $1 WHERE order_id = $2",
      ["F", orderId]
    );

    const orderResult2nd = await client.query(
      "SELECT order_status, gig_id, client_id FROM orders WHERE order_id = $1 AND client_id = $2",
      [orderId, clientId]
    );

    if (orderResult2nd.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const { gig_id, client_id, order_status } = orderResult2nd.rows[0];

    await client.query(
      "INSERT INTO gig_client_history (gig_id, client_id, amount_to_pay, order_status) VALUES ($1, $2, $3, $4)",
      [gig_id, client_id, amountToPay, order_status]
    );

    await client.query("DELETE FROM orders WHERE order_id = $1", [orderId]);

    await client.query("DELETE FROM payment WHERE order_id = $1", [orderId]);

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Order cancelled and payment has been retuned",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while cancelling the order",
    });
  } finally {
    client.release();
  }
};

export const getFreelancerPendingOrders = async (req, res) => {
  try {
    const freelancerId = req.id;

    const result = await pool.query(
      `
      SELECT o.order_id, o.order_status, g.title AS gig_title, c.fullname AS client_name, p.amount_to_pay
      FROM orders o
      JOIN gigs g ON o.gig_id = g.gig_id
      JOIN client c ON o.client_id = c.client_id
      JOIN payment p ON o.order_id = p.order_id
      WHERE o.freelancer_id = $1 AND o.order_status = 'P'
      ORDER BY o.created_at DESC
      `,
      [freelancerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No pending orders found",
        success: false,
      });
    }

    res.json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching pending orders",
    });
  }
};

export const getFreelancerOrderDetails = async (req, res) => {
  try {
    const freelancerId = req.id;
    const orderId = req.params.orderId;

    const result = await pool.query(
      `
      SELECT o.order_id, o.order_status, g.title AS gig_title, c.fullname AS client_name, 
              p.amount_to_pay, o.created_at, o.description
      FROM orders o
      JOIN gigs g ON o.gig_id = g.gig_id
      JOIN client c ON o.client_id = c.client_id
      JOIN payment p ON o.order_id = p.order_id
      WHERE o.freelancer_id = $1 AND o.order_id = $2
      ORDER BY o.created_at DESC
    `,
      [freelancerId, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching order details",
    });
  }
};

export const submitOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const freelancerId = req.id;
    const orderId = req.params.orderId;

    const result = await client.query(
      'CALL submit_order($1, $2, $3, $4)',
      [freelancerId, orderId, null, null]
    );

    const { p_success, p_message } = result.rows[0];

    if (p_success) {
      res.json({
        success: true,
        message: p_message
      });
    } else {
      res.status(400).json({
        success: false,
        message: p_message
      });
    }
  } catch (error) {
    console.error("Error submitting order:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while submitting the order: " + error.message
    });
  } finally {
    client.release();
  }
};

export const confirmOrderByClient = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const clientId = req.id;
    const orderId = req.params.orderId;
    const { action, reviewText } = req.body;

    const orderResult = await client.query(
      "SELECT o.order_status, o.gig_id, o.freelancer_id, o.client_id, p.amount_to_pay FROM orders o JOIN payment p ON o.order_id = p.order_id WHERE o.order_id = $1 AND o.client_id = $2",
      [orderId, clientId]
    );

    if (orderResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const order = orderResult.rows[0];

    if (order.order_status !== "C") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Only completed orders can be reviewed or marked as done",
      });
    }

    await client.query(
      "INSERT INTO gig_client_history (gig_id, client_id, amount_to_pay, order_status) VALUES ($1, $2, $3, $4)",
      [order.gig_id, clientId, order.amount_to_pay, "C"]
    );

    await client.query("DELETE FROM payment WHERE order_id = $1", [orderId]);

    await client.query("DELETE FROM orders WHERE order_id = $1", [orderId]);

    if (action === "giveReview" && reviewText) {
      await client.query(
        "INSERT INTO review (review_text, client_id, freelancer_id) VALUES ($1, $2, $3)",
        [reviewText, clientId, order.freelancer_id]
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message:
        action === "markAsDone"
          ? "Order marked as done"
          : "Review submitted successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error processing client action:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  } finally {
    client.release();
  }
};
