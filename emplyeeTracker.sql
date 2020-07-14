DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;

USE employee_DB;

CREATE TABLE department(
  department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role(
  role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  department_id INT,
  FOREIGN KEY(department_id) REFERENCES department(department_id) ON DELETE CASCADE
);

CREATE TABLE employee(
  employee_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT, 
  FOREIGN KEY(role_id) REFERENCES role(role_id) ON DELETE CASCADE,
  FOREIGN KEY(manager_id) REFERENCES employee(employee_id) ON DELETE CASCADE
);