CREATE OR REPLACE FUNCTION payment_delete_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    client_email TEXT;
    freelancer_email TEXT;
    order_amount INTEGER;
    client_card_number TEXT;
    freelancer_card_number TEXT;
BEGIN

    SELECT c.email, f.email, OLD.amount_to_pay, SUBSTRING(cc.card_number, 1, 4) || '********' || SUBSTRING(cc.card_number, 13, 4),
           SUBSTRING(fc.card_number, 1, 4) || '********' || SUBSTRING(fc.card_number, 13, 4)
    INTO client_email, freelancer_email, order_amount, client_card_number, freelancer_card_number
    FROM orders o
    JOIN client c ON o.client_id = c.client_id
    JOIN freelancer f ON o.freelancer_id = f.freelancer_id
    LEFT JOIN clientcardinfo cc ON c.client_id = cc.client_id
    LEFT JOIN freelancercardinfo fc ON f.freelancer_id = fc.freelancer_id
    WHERE o.order_id = OLD.order_id AND o.order_status = 'C';

    IF FOUND THEN
        RAISE NOTICE 'Sending email to client: % and freelancer: %', client_email, freelancer_email;

        PERFORM pg_notify('email_channel', json_build_object(
            'to', client_email,
            'subject', 'Payment Confirmation',
            'body', format('Payment of $%s has been deducted from your account from card no %s', order_amount, client_card_number)
        )::text);

        PERFORM pg_notify('email_channel', json_build_object(
            'to', freelancer_email,
            'subject', 'Payment Received',
            'body', format('Payment of $%s has been deposited to your account in card no %s', order_amount, freelancer_card_number)
        )::text);
    ELSE
        RAISE NOTICE 'No matching completed order found for order_id: %', OLD.order_id;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_delete_trigger
AFTER DELETE ON payment
FOR EACH ROW
EXECUTE FUNCTION payment_delete_trigger_function();