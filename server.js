const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console-table");

require("dotenv").config();

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.SQL_USER,
  password: process.env.SQL_PW,
  database: process.env.SQL_DB,
});

connection.connect((err) => {
  if (err) throw err;
  postConnect();
});

postConnect = () => {
  console.log("************************************");
  console.log("*                                  *");
  console.log("*** WELCOME TO EMPLOYEE MANAGER  ***");
  console.log("*                                  *");
  console.log("************************************");
  userPrompt();
};
const userPrompt = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "userChoice",
      message: "How would you like to begin?",
      choices: [
        'View All Roles',
        "View All Employees",
        "View All Departments",
        "Add a Department",
        "Add a role",
        "Add an employee",
        "Update an Employee Role",
      ],
    },
  ])
    .then((answers => {
        const { userChoice } = answers;
        if(userChoice === "View All Roles"){
                    showRoles();
        }
        if(userChoice === "View All Departments"){
                    showDepartments();
        }
        if(userChoice === "View All Employees"){
                    showEmployees();
        }
        if(userChoice === "Add a Department"){
                    addDepartment();
        }
        if(userChoice === "Add a role"){
                    addRole();
        }
        if(userChoice === "Add an employee"){
            addEmployee();
        }
        if(userChoice === "Update an Employee Role"){
            updateEmployee();
        }
    }));
};

showDepartments = () => {
    console.log("SHOWING ALL DEPARTMENTS");
    let sql = `SELECT * FROM department;`;
    connection.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        userPrompt();
    });
};

showEmployees = () => {
    console.log("SHOWING ALL EMPLOYEES");
    let sql = `SELECT employee.id,
                employee.first_name,
                employee.last_name,
                role_title`;
    connection.query(sql, (err, rows) => {
    if(err) throw err;
    console.table(rows);
    userPrompt();
    });
};
showRoles = () => {
    console.log("SHOWING ALL ROLES");
    let sql = `SELECT * FROM role;`;
    connection.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        userPrompt();
    });
};

addDepartment = () => {
    inquirer.prompt([
        {
            type:'input',
            name: 'addDepartment',
            message:'What department would you like to add?',
            validate: addDepartment => {
                if(addDepartment){
                    return true;
                } else {
                    console.log('please enter a department name')
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        let sql = `INSERT INTO department (name)
            VALUES (?)`;
            connection.query(sql, answer.addDepartment, (err, results) => {
                if(err) throw err;
                console.log(`new Department added: ${answer.addDepartment}`);
                showDepartments();
            })
    })
};

addRole = () => {
    inquirer.prompt([
        {
            type:'input',
            name: 'addRole',
            message:'What Role would you like to add?',
            validate: addRole => {
                if(addRole){
                    return true;
                } else {
                    console.log('please enter a role')
                    return false;
                }
            }
        },
        {
            type:'input',
            name: 'addSalary',
            message:'What is the salary to this role?',
            validate: addSalary => {
                if(isNaN(addSalary)){
                    console.log('please enter a salary for given role')
                    return false;;
                } else {
                    return true;
                }
            }
        }
    ])
    .then(answer => {
        let params = [answer.addRole, answer.addSalary];
        let roleSql = `SELECT name, id FROM department`;
            connection.query(roleSql , (err, data) => {
                if(err) throw err;
               const dept = data.map(({name, id}) => ({ name: name, value: id}));

               inquirer.prompt([{
                type:'list',
                name: 'dept',
                message: 'what department does this role belong in?',
                choices: dept
               }])
               .then(deptChoice => {
                const dept = deptChoice.dept;
                params.push(dept);

                let sql = `INSERT INTO role (title, salary, department_id)
                    VALUES (?, ?, ?)`;

                    connection.query(sql, params, (err,results) => {
                        if(err) throw err;
                        console.log(`New role added: ${answer.addRole}`);
                        showRoles();
                    })
               });
           
            });
    });
};

addEmployee = () => {
    inquirer.prompt([
        {
            type:"input",
            name:"addFirstName",
            message:"Please enter new employee's first name",
            validate: addFirstName => {
                if(addFirstName){
                    return true;
                } else {
                    console.log("Please enter employees first name");
                    return false;
                }
            }
        },
        {
            type:"input",
            name:"addLastName",
            message:"Please enter new employee's last name",
            validate: addLastName => {
                if(addLastName){
                    return true;
                } else {
                    console.log("Please enter employees last name");
                    return false;
                }
            }
        },
    ]).then(answer => {
        const params = [answer.addFirstName, answer.addLastName]
        const roleSql = `SELECT role.id, role.title FROM role`;
        connection.query(roleSql , (err, data) => {
            if(err) throw err;
           const roles = data.map(({id, title}) => ({ name: title, value: id}));

           inquirer.prompt([{
            type:'list',
            name: 'role',
            message: "what is the employee's role?",
            choices: roles
           }])
           .then(roleChoice => {
            const role = roleChoice.role;
            params.push(role);
            const managerSql = `SELECT * FROM employee`;
            connection.query(managerSql, (err,data) => {
                if(err) throw err;
                const managers = data.map(({id, first_name, last_name}) => ({ name: first_name + " " + last_name, value: id}));
                inquirer.prompt([
                    {
                        type:"list",
                        name: "manager",
                        message: "Please choose the employee's manager",
                        choices: managers
                    }
                ]).then(chosenManager => {
                    const manager = chosenManager.manager;
                    params.push(manager);
                    const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                    VALUES(?,?,?,?)`;
                    connection.query(sql, params, (err,result) => {
                        if(err) throw err;
                        console.log("New employee added successfully");
                        showEmployees();
                    })
                })
            })

           });
       
        });
    })
}

updateEmployee =()=> {
    const employeesSql = `SELECT * FROM employee`;
    connection.query(employeesSql, (err,data) => {
        if(err) throw err;
        const employees = data.map(({id, first_name, last_name}) => ({name:first_name + " " + last_name, value: id}));
        inquirer.prompt([
            {
                type: "list",
                name: "name",
                message: "which employee would you like to update?",
                choices: employees
            }
        ]).then(employeeChoice => {
            const employee = employeeChoice.name;
            const params = [];
            params.push(employee);
            const roleSql = `SELECT * FROM role;`;
            connection.query(roleSql, (err,data) => {
                if(err) throw err;
                const roles = data.map(({id, title}) => ({name: title, value: id}));
                inquirer.prompt([
                    {
                        type:"list",
                        name:"role",
                        role: "What is the employee's role?",
                        choices: roles
                    }
                ]).then(roleChoice => {
                    const role = roleChoice.role;
                    params.push(role);

                    let employee = params[0]
                    params[0] = role
                    params[1] = employee


                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                    connection.query(sql, params, (err,results) => {
                        if(err) throw err;
                        console.log("chosen employee has been updated");
                        showEmployees();
                    })
                })
            })
        })
    })
}
