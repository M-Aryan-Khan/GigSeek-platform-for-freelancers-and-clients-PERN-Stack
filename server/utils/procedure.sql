CREATE OR REPLACE PROCEDURE submit_order(
    IN p_freelancer_id INTEGER,
    IN p_order_id INTEGER,
    OUT p_success BOOLEAN,
    OUT p_message TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_order_status CHAR(1);
    v_gig_id INTEGER;
    v_client_id INTEGER;
    v_amount_to_pay INTEGER;
BEGIN
    SELECT o.order_status, o.gig_id, o.client_id, p.amount_to_pay
    INTO v_order_status, v_gig_id, v_client_id, v_amount_to_pay
    FROM orders o
    JOIN payment p ON o.order_id = p.order_id
    WHERE o.order_id = p_order_id AND o.freelancer_id = p_freelancer_id;

    IF v_order_status IS NULL THEN
        p_success := FALSE;
        p_message := 'Order not found';
        RETURN;
    END IF;

    IF v_order_status != 'P' THEN
        p_success := FALSE;
        p_message := 'Only pending orders can be submitted';
        RETURN;
    END IF;

    UPDATE orders
    SET order_status = 'C'
    WHERE order_id = p_order_id;

    p_success := TRUE;
    p_message := 'Order submitted successfully';

EXCEPTION
    WHEN OTHERS THEN
        p_success := FALSE;
        p_message := 'An error occurred while submitting the order: ' || SQLERRM;
END;
$$;