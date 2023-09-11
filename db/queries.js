const conn = require('./config');

class queries{
    constructor(conn){
        this.conn=conn;
    }
// Query needs to be more advanced as it needs to return more info
    findAllEmployees(){
        return this.conn.promise().query("SELECT employee.employee_id AS id,employee.first_name AS first_name,employee.last_name AS last_name,role.title AS title,department.name AS department,role.salary AS salary,CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.role_id INNER JOIN department ON role.department_id = department.department_id LEFT JOIN employee AS mgr ON employee.manager_id = mgr.employee_id;")
    }
    findAllRoles(){
        return this.conn.promise().query("SELECT role.role_id as id, role.title as title, department.name AS department, role.salary as Salary FROM role INNER JOIN department ON role.department_id = department.department_id;")
    }
    findAllDepartments(){
        return this.conn.promise().query("SELECT department.department_id as id ,department.name as title FROM department;")
    }
    addDepartment(department){
        return this.conn.promise().query("INSERT INTO department (name) VALUES (?);", [department.name]);
    }
    addRole(role){
        return this.conn.promise().query("INSERT INTO role SET ?", [role]);
    }    
    addEmployee(employee){
        return this.conn.promise().query("INSERT INTO employee SET ?", [employee]);
    }    
    updateEmployeeRole(employee_id,role_id){
        return this.conn.promise().query("UPDATE employee SET role_id = ? WHERE employee_id = ?", [role_id, employee_id]);
    }    
    deleteDepartments(department_id) {
        return this.conn.promise().query("DELETE FROM department WHERE department.department_id = ?", [department_id]);
    }
    deleteRoles(role_id){
        return this.conn.promise().query("DELETE FROM role WHERE role.role_id = ?", [role_id]);
    }
    deleteEmployees(employee_id){
        return this.conn.promise().query("DELETE FROM employee WHERE employee.employee_id=?",[employee_id]);
    }
    updateEmployeeManager(employee_id, manager_id){
        return this.conn.promise().query("UPDATE employee SET manager_id=? WHERE employee_id=?", [manager_id, employee_id]);
    }   
    viewEmployeesByDepartment(){
        return this.conn.promise().query(
            "SELECT employee.employee_id AS id, employee.first_name AS first_name, employee.last_name AS last_name, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.role_id LEFT JOIN department ON role.department_id = department.department_id;"
        );
    }
    viewDepartmentBudgets(){
        return this.conn.promise().query(
            "SELECT department.name AS department, SUM(role.salary) AS total_utilized_budget FROM employee INNER JOIN role ON employee.role_id = role.role_id INNER JOIN department ON role.department_id = department.department_id GROUP BY department.name;");
    }
}

module.exports = new queries(conn);