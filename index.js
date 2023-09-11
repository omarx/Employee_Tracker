const db = require('./db/queries');
const { prompt } = require('inquirer');

const init = () => {
    startApp();
}

const questions = [
    {
        type: "list",
        name: "choice",
        choices: [
            { name: "View All Departments", value: "VIEW_DEPARTMENTS" },
            { name: "View All Roles", value: "VIEW_ROLE" },
            { name: "View All Employees", value: "VIEW_EMPLOYEES" },
            {
                name: "View All Employees By Department",
                value: "VIEW_EMPLOYEE_BY_DEPARTMENT"
            },
            { name: "View All Department Budgets", value: "VIEW_ALL_DEPARTMENT_BUDGETS" },
            { name: "Add Department", value: "ADD_DEPARTMENT" },
            { name: "Add Role", value: "ADD_ROLE" },
            { name: "Add Employee", value: "ADD_EMPLOYEE" },
            { name: "Update Employee Role", value: "UPDATE_EMPLOYEE_ROLE" },
            { name: "Update Employee Manager", value: "UPDATE_EMPLOYEE_MANAGER" },
            { name: "Delete Department", value: "DELETE_DEPARTMENT" },
            { name: "Delete Role", value: "DELETE_ROLE" },
            { name: "Delete Employee", value: "DELETE_EMPLOYEE" }
        ]
    }
];

const startApp = () => {
    prompt(questions).then((answers) => {
        switch (answers.choice) {
            case "VIEW_DEPARTMENTS":
                viewDepartments();
                break;
            case "VIEW_ROLE":
                viewRoles();
                break;
            case "VIEW_EMPLOYEES":
                viewEmployees();
                break;
            case "VIEW_EMPLOYEE_BY_DEPARTMENT":
                viewEmployeesByDepartment();
                break;
            case "VIEW_ALL_DEPARTMENT_BUDGETS":
                viewAllDepartmentBudgets();
                break;
            case "ADD_DEPARTMENT":
                addDepartment();
                break;
            case "ADD_ROLE":
                addRole();
                break;
            case "ADD_EMPLOYEE":
                addEmployee();
                break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
                break;
            case "UPDATE_EMPLOYEE_MANAGER":
                updateEmployeeManager();
                break;
            case "DELETE_DEPARTMENT":
                deleteDepartment();
                break;
            case "DELETE_ROLE":
                deleteRole();
                break;
            case "DELETE_EMPLOYEE":
                deleteEmployee();
                break;
            default:
                console.error("Invalid choice!");
                startApp();
        }
    })
}

const viewDepartments = () => {
    db.findAllDepartments()
        .then(([data]) => {
            let emp = data;
            console.log('\n');
            console.table(emp);
        })
        .then(() => startApp())
        .catch(err => console.error(err))
}

const viewRoles = () => {
    db.findAllRoles()
        .then(([data]) => {
            let roles = data;
            console.table(roles);
        })
        .then(() => startApp())
        .catch(err => console.error(err))
}

const viewEmployees = () => {
    db.findAllEmployees()
        .then(([data]) => {
            let emp = data;
            console.table(emp);
        })
        .then(() => startApp())
        .catch(err => console.error(err))
}

// Define the missing functions here
const viewEmployeesByDepartment = () => {
    db.viewEmployeesByDepartment()
    .then(([data])=>{
        let emp=data;
        console.table(emp);
    })
    .then(()=>startApp())
    .catch(err=>console.error(err))
}

const viewAllDepartmentBudgets = () => {
    db.viewDepartmentBudgets()
    .then(([data])=>{
        let emp=data;
        console.table(emp)
    }).then(()=>startApp())
    .catch(err=>console.err(err))
}

const addDepartment = () => {
    prompt([{
        name: "Department",
        type: "input",
        message: "Please enter the name of this department"
    }])
    .then(answers => {
        let department = answers.Department;
        let departments = {
            name: department
        };
        db.addDepartment(departments)
        .then(() => {
            console.log(`${department} has been created`);
            startApp();
        })
        .catch(err => console.error(err));
    })
};


const addRole = () => {
    prompt([{
        name: "roleName",
        type: "input",
        message: "What is the name of this role"
    }])
    .then(data => {
        let roleName = data.roleName;
        prompt([{
            name: "roleSalary",
            type: "input",
            message: "What is the salary of this role"
        }])
        .then(data => {
            let roleSalary = data.roleSalary;
            db.findAllDepartments()
            .then(([data]) => {
                const department=data;
                const departments = department.map(({ id, title }) => ({
                    name: title,
                    value: id
                }));
                prompt({
                    type: "list",
                    name: "department_id",
                    message: "Which department does this role belong to?",
                    choices: departments
                })
                .then(data => {
                    let roles = {
                        title: roleName,
                        salary: roleSalary,
                        department_id: data.department_id
                    };
                    db.addRole(roles) 
                    .then(() => console.log(`${roleName} added as a role`))
                    .then(()=>startApp())
                    .catch(err => console.error(err));
                });
            });
        });
    });
};

const addEmployee = () => {
    prompt([
        {
            name:"fname",
            type:"input",
            message:"Enter the employee's first name"
        },
        {
            name:"lname",
            type:"input",
            message:"Enter the employee's last name"
        },
    ]).then(answers=>{
        let fname=answers.fname;
        let lname=answers.lname;
        db.findAllRoles()
        .then(([data])=>{
            let roles=data.map(({id,title})=>({
                    name:title,
                    value:id
                }));
                prompt([
                   { type:"list",
                    name:"role",
                    message:"What role does this employee hold",
                    choices:roles}
                ]).then(data=>{
                    let roleType=data.role;
                    db.findAllEmployees()
                    .then(([data])=>{
                        let employees=data;
                        const managers=employees.map(({id,first_name,last_name})=>({
                            name:`${first_name} ${last_name}`,
                            value:id
                        }));
                        managers.unshift({name:"None",value:null});
                        prompt([{
                            type:"list",
                            name:"managers",
                            message:"Who is their manager",
                            choices:managers
                        }]).then(answers=>{
                            let employee={
                                manager_id:answers.managers,
                                role_id:roleType,
                                first_name:fname,
                                last_name:lname

                            }
                            db.addEmployee(employee);
                        }).then(()=>console.log(`Added ${fname} to the database`)).then(()=>startApp())
                    })
                })
        }); }
    )}

const updateEmployeeRole=()=>{
     db.findAllEmployees()
     .then(([data])=>{
        let emp=data;
        const employee=emp.map(({id,first_name,last_name})=>({
            name:`${first_name} ${last_name}`,
            value:id
        }))
        prompt([{
            name:"getEmp",
            type:"list",
            choices:employee
        }]).then((answer)=>{
            let selectedEmp=answer.getEmp;
            db.findAllRoles()
            .then(([roles])=>{
                let role=roles;
                const allRoles=role.map(({id,title})=>({
                    name:`${title}`,
                    value:id
                }));
                prompt([{
                    name:"selectRole",
                    type:"list",
                    choices:allRoles
                }]).then(answer=>{
                    let selectedRole=answer.selectRole;
                    db.updateEmployeeRole(selectedEmp,selectedRole)
                    .then(()=>console.log(`Employee role has been update`))
                    .then(()=>startApp())
                    .catch(error=>console.error(error))
                })
            })

        })
     })
}

const updateEmployeeManager = () => {
    db.findAllEmployees()
        .then(([data]) => {
            let employee = data;
            const employeeList = employee.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
            prompt([{
                name: "getEmp",
                type: "list",
                choices: employeeList
            }])
                .then((answer) => {
                    let selectedEmp = answer.getEmp;
                    db.findAllEmployees()
                        .then(([data]) => {
                            let employees = data;
                            const managers = employees.map(({ id, first_name, last_name }) => ({
                                name: `${first_name} ${last_name}`,
                                value: id
                            }));
                            managers.unshift({ name: "None", value: null });
                            prompt([{
                                type: "list",
                                name: "managers",
                                message: "Who is their manager",
                                choices: managers
                            }])
                                .then(answer => {
                                    let selectedManager = answer.managers;
                                    db.updateEmployeeManager(selectedEmp, selectedManager)
                                        .then(() => console.log(`The manager has been updated`))
                                        .then(() => startApp())
                                        .catch(error => console.error(error));
                                });
                        });
                });
            });
}

const deleteDepartment = () => {
    db.findAllDepartments()
    .then(([department])=>{
        let departments=department;
        const departmentList=department.map(({id,title})=>({
            name:title,
            value:id
        }))
        prompt([{
            name:"selectDepartment",
            type:"list",
            choices:departmentList
        }]).then(answer=>{
            let selectedDepartment=answer.selectDepartment;
            db.deleteDepartments(selectedDepartment)
            .then(()=>console.log(`The department hase been deleted`))
            .then(()=>startApp())
            .catch(err=>console.error(err))
        })
    })
}

const deleteRole = () => {
    db.findAllRoles()
    .then(([roles])=>{
        let role=roles;
        const roleList=role.map(({id,title})=>({
            name:`${title}`,
            value:id
        }))
        prompt([{
            name:"getRoles",
            type:"list",
            choices:roleList
        }])
        .then((answer)=>{
            let roleToRemove=answer.getRoles;
            console.log(roleToRemove);
            db.deleteRoles(roleToRemove)
            .then(()=>console.log(`The role has been deleted`))
            .then(()=>startApp())
            .catch(error=>console.error(error));
        })
    })
}

const deleteEmployee = () => {
    db.findAllEmployees()
     .then(([data])=>{
        let emp=data;
        const employee=emp.map(({id,first_name,last_name})=>({
            name:`${first_name} ${last_name}`,
            value:id
        }))
        prompt([{
            name:"getEmp",
            type:"list",
            choices:employee
        }])
        .then(answer=>{
            let selectedEmployee=answer.getEmp;
            db.deleteEmployees(selectedEmployee)
            .then(()=>console.log(`The employee has been deleted`))
            .then(()=>startApp())
            .catch(error=>console.error(error))
        })
    })
}

init();
