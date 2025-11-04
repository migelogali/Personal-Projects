-- Group 33: Avni Gharpurey, Michelino Gali

-- Products
    -- READ: Display all products.  
    select product_id as "Product ID",
    product_count as "Product Count", 
    product_name as "Product Name", 
    product_price as "Product Price", 
    Vendors.vendor_name as "Vendor Name", 
    Departments.department_name as "Department Name",
    Category.category_name as "Category Name"
    from Products 
    left join Vendors on Vendors.vendor_id = Products.vendor_id 
    left join Departments on Departments.department_id = Products.department_id 
    left join Categories on Categories.category_id = Products.category_id; 

    -- CREATE: Add new products.    
    insert into Products (product_count, product_name, product_price, vendor_id, department_id, category_id)
    values(:product_count, :product_name, :product_price, 
        (select vendor_id from Vendors where vendor_name = :vendor_name), 
        (select department_id from Departments where department_name = :department_name),
        (select category_id from Categories where category_name = :category_name)
        );

    -- UPDATE: Add new information into Categories_Vendors if a new Categories-Vendors Combination Exists 
    /* CITATION: The following code is adapted from the article 'PostgreSQL INSERT IF NOT EXISTS' on 
    the Command Prompt, Inc website. LINK: https://www.commandprompt.com/education/postgresql-insert-if-not-exists/ */
    insert into Categories_Vendors (category_id, vendor_id)
    select category_id, vendor_id 
    where not exists
        (select category_vendor_id from Categories_Vendors 
        where category_id <> (select category_id from Categories where category_name = :category_name)
        and vendor_id <> (select vendor_id from Vendors where vendor_name = :vendor_name)
        ); 

    /* SELECTS to dynamically populate drop downs */ 
    -- Vendor Drop Down: Pulls vendor names and "-" to allow users to select no vendor. 
    select "-"
    union
    select vendor_name from Vendors; 

    -- Department Drop Down: Pulls department names and "-" to allow users to select no department.  
    select "-"
    union
    select department_name from Departments; 

    -- Category Drop Down: Pulls category names and "-" to allow users to select no department. 
    select "-"
    union
    select category_name from Categories; 



-- Vendors 
    -- READ: Display all vendors.  
    select vendor_id as "Vendor ID", 
    vendor_name as "Vendor Name", 
    vendor_start_date as "Vendor Start Date"
    from Vendors; 

    -- CREATE: Inserts new vendors. 
    insert into Vendors (vendor_name, vendor_start_date)
    values(:vendor_name, :vendor_start_date); 



-- Categories 
    -- READ: Display all categories.  
    select category_id as "Category ID", 
    category_name as "Category Name"
    from Categories; 

    -- CREATE: Inserts new categories. 
    insert into Categories (category_name)
    values(:category_name); 



-- Categories_Vendors 
    -- READ: Select all category/vendor combinations. 
    select 
    Categories_Vendor.category_vendor_id as "Category/Vendor ID",
    Vendors.vendor_name as "Vendor Name",  
    Categories.category_name as "Category Name"
    from 
    Categories_Vendors 
        left join Vendors on Vendors.vendor_id = Categories_Vendors.vendor_id 
        left join Categories on Categories.category_id = Categories_Vendors.category_id; 

    -- CREATE: Inserts new category/vendor combinations.  
    -- The WHERE NOT EXISTS clause is used here because this relationship can also be entered from the Products table. 

    /* CITATION: The following code is adapted from the article 'PostgreSQL INSERT IF NOT EXISTS' on 
    the Command Prompt, Inc website. LINK: https://www.commandprompt.com/education/postgresql-insert-if-not-exists */ 
    insert into Categories_Vendors (category_id, vendor_id)
    select category_id, vendor_id 
    where not exists
        (select category_vendor_id from Categories_Vendors 
        where category_id <> (select category_id from Categories where category_name = :category_name)
        and vendor_id <> (select vendor_id from Vendors where vendor_name = :vendor_name)
        ); 

    -- UPDATE: Updates category/vendor combinations based on selections.  
    update Categories_Vendors
    set 
    category_id = 
        (select category_id from Category where category_name = :category_name),
    vendor_id = 
        (select vendor_id from Vendors where vendor_name = :vendor_name)
    where category_vendor_id = :category_vendor_id;

    -- DELETE: Deletes category/vendor combinations based on selections.  
    delete from Categories_Vendors
    where category_vendor_id = :category_vendor_id;

    /* SELECTS to dynamically populate drop downs */ 
    -- Vendor Drop Down: Pulls vendor names 
    select vendor_name from Vendors; 

    -- Category Drop Down: Pulls category names 
    select category_name from Categories; 



-- Departments 
    -- READ: Displays department names.  
    select department_id as "Department ID", department_name as "Department Name" from Departments; 

    -- CREATE: Insert new departments.  
    insert into Departments (department_name) 
    values(:department_name); 



-- Customers 
    -- READ: Displays customer names.  
    select customer_id as "Customer ID", customer_name as "Customer Name" from Customers;

    -- CREATE: Inserts new customers. 
    insert into Customers (customer_name)
    values(:customer_name); 




-- Purchases 
    -- READ: Displays purchase details.  
    select purchase_id as "Purchase ID", 
    Customers.customer_name as "Customer Name", 
    Products.product_name as "Product Name", 
    units_bought as "Units Bought",
    purchase_date as "Purchase Date"
    from Purchases
    left join Customers on Customers.customer_id = Purchases.customer_id 
    left join Products on Products.product_id = Purchases.product_id; 

    -- CREATE: Inserts new purchases.  
    insert into Purchases (customer_id, product_id, units_bought, purchase_date)
    values(
        (select customer_id from Customers where customer_name = :customer_name),
        (select product_id from Products where product_name = :product_name),
        :units_bought, :purchase_date
        );

    -- UPDATE: Update purchases based on selections.
    update Purchases 
    set customer_id = 
        (select customer_id from Customers where customer_name = :customer_name),
        product_id = 
        (select product_id from Products where product_name = :product_name)
    where purchase_id = :purchase_id; 

    -- DELETE: Delete purchases based on selection.  
    delete from Purchases 
    where purchase_id = :purchase_id; 

    /* SELECTS to dynamically populate drop downs */ 
    -- Customer Drop Down: Pulls customer names 
    select customer_name from Customers; 

    -- Product Drop Down: Pulls product names 
    select product_name from Products;