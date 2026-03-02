-- =========================================
-- RPC: Atomic order creation
-- Run this in Supabase SQL Editor
-- =========================================

CREATE OR REPLACE FUNCTION public.create_order_with_items(
  p_customer_id UUID,
  p_note TEXT DEFAULT '',
  p_items JSONB DEFAULT '[]'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
  v_total NUMERIC(12,2) := 0;
  v_item JSONB;
  v_variant RECORD;
  v_order_code TEXT;
BEGIN
  -- Validate items array
  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must have at least 1 item';
  END IF;

  -- Validate customer exists
  IF NOT EXISTS (SELECT 1 FROM public.customers WHERE id = p_customer_id) THEN
    RAISE EXCEPTION 'Customer % not found', p_customer_id;
  END IF;

  -- Pre-validate all items and calculate total
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT * INTO v_variant
    FROM public.product_variants
    WHERE id = (v_item->>'variant_id')::UUID
    FOR UPDATE; -- Lock row to prevent race conditions

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Variant % not found', v_item->>'variant_id';
    END IF;

    IF v_variant.stock_quantity < (v_item->>'quantity')::INT THEN
      RAISE EXCEPTION 'Not enough stock for variant % (available: %, requested: %)',
        v_variant.id, v_variant.stock_quantity, (v_item->>'quantity')::INT;
    END IF;

    v_total := v_total + (v_variant.price * (v_item->>'quantity')::INT);
  END LOOP;

  -- Generate unique order code: MC-YYYYMMDD-XXXX
  v_order_code := 'MC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
    UPPER(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 4));

  -- Create order
  INSERT INTO public.orders (customer_id, order_code, total_amount, note, status, payment_status)
  VALUES (p_customer_id, v_order_code, v_total, p_note, 'pending', 'unpaid')
  RETURNING id INTO v_order_id;

  -- Create order items (existing trigger handles stock deduction + inventory logs)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT price INTO v_variant
    FROM public.product_variants
    WHERE id = (v_item->>'variant_id')::UUID;

    INSERT INTO public.order_items (order_id, variant_id, quantity, price)
    VALUES (
      v_order_id,
      (v_item->>'variant_id')::UUID,
      (v_item->>'quantity')::INT,
      v_variant.price
    );
  END LOOP;

  RETURN v_order_id;
END;
$$;

-- Grant execute to authenticated and service_role
GRANT EXECUTE ON FUNCTION public.create_order_with_items TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_order_with_items TO service_role;
