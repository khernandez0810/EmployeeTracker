INSERT INTO department (name)
VALUES
('Sales'),
('Human Resources'),
('IT'),
('Marketing');

INSERT INTO role (title, salary, department_id )
VALUES
('Marketing Specialist', 70000, 4),
('HR Specialist', 70000, 2),
('Software Engineer', 100000, 3),
('Account Representative', 60000, 1),
('Account Manager', 78000, 1),
("Technical Specialist", 55000, 3),
('Diversity Coordinator', 60000, 2),
('Junior Software developer', 60000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Kevin', 'Hernandez', 3, 1),
('Cindy', 'Rojas', 2, 2),
('Steve', 'Jones', 3, null),
('Daniel', 'Aviles', 1, null),
('Michael', 'Sierra', 2, 1),
('Stephon', 'Mcfarland', 4, null),
('Alexander', 'Hernandez', 3, 1),
('Charles', 'Franks', 4, null);
