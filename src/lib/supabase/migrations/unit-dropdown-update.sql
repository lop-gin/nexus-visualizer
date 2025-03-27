-- Add a new field to transaction_items table to track which unit type was selected
ALTER TABLE transaction_items ADD COLUMN unit_type VARCHAR(20) NOT NULL DEFAULT 'primary' CHECK (unit_type IN ('primary', 'secondary'));

-- Update the transaction_items table to better handle unit conversions
CREATE OR REPLACE FUNCTION calculate_primary_quantity()
RETURNS TRIGGER AS $$
BEGIN
    -- If using secondary unit, convert to primary units for internal calculations
    IF NEW.unit_type = 'secondary' THEN
        -- Get the conversion factor from the products table
        SELECT conversion_factor INTO NEW.primary_quantity
        FROM products
        WHERE id = NEW.product_id;
        
        -- Calculate the primary quantity
        NEW.primary_quantity := NEW.quantity * NEW.primary_quantity;
    ELSE
        -- If using primary unit, primary_quantity equals quantity
        NEW.primary_quantity := NEW.quantity;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate primary quantity
CREATE TRIGGER calculate_primary_quantity_trigger
BEFORE INSERT OR UPDATE ON transaction_items
FOR EACH ROW EXECUTE FUNCTION calculate_primary_quantity();

-- Add a function to get available units for a product
CREATE OR REPLACE FUNCTION get_product_units(product_id INTEGER)
RETURNS TABLE (
    unit_type VARCHAR(20),
    unit_name VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 'primary'::VARCHAR(20) as unit_type, primary_unit_of_measure as unit_name
    FROM products
    WHERE id = product_id
    UNION
    SELECT 'secondary'::VARCHAR(20) as unit_type, secondary_unit_of_measure as unit_name
    FROM products
    WHERE id = product_id AND secondary_unit_of_measure IS NOT NULL;
END;
$$ LANGUAGE plpgsql;
