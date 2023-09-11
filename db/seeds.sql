-- Inserting dummy data into department table
INSERT INTO department (name)
VALUES 
('Human Resources'),
('Engineering'),
('Marketing'),
('Finance');

-- Inserting dummy data into role table
INSERT INTO role (title, salary, department_id)
VALUES 
('HR Manager', 60000.00, 1),
('Engineer', 80000.00, 2),
('Marketing Manager', 70000.00, 3),
('Finance Manager', 75000.00, 4);

-- Inserting dummy data into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Alice', 'Johnson', 1, NULL),  -- Assuming Alice is the highest authority, no manager for her
('Bob', 'Smith', 2, 1),         -- Bob reports to Alice
('Charlie', 'Davis', 3, 1),     -- Charlie reports to Alice
('Dave', 'Wilson', 4, 1);       -- Dave reports to Alice
