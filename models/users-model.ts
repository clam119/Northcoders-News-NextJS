import db from "../db/connection";
import User from "../lib/usersInterface";

export interface Error {
    status: number,
    msg: string
}

export async function fetchSingleUser(username: string): Promise <User | Error> {
    const usernameQuery = await db.query('SELECT * FROM users;')
    const validUsernames = await usernameQuery.rows.map((user: User): string => user.username)
    
    //Checks to see if the requested username is the correct data type.
    if(typeof username !=='string'){
        return Promise.reject({ status: 400, msg: "Invalid Fields Data" })
    }
    
    //Check the database for queried username, returns promise rejection if not found.
    if(!validUsernames.includes(username)) {
        return Promise.reject({ status: 404, msg: "Username Not Found" });
    }

    
    //If the passed in username is valid - query and return user data
    const response = await db.query(`SELECT * FROM users WHERE username = $1`, [username])
    const responseData = await response;
    const { rows: [singleUserData] } = responseData;

    return singleUserData;
} 

export async function fetchAllUsers(): Promise<User[]> {
    const queryData  = await db.query('SELECT * FROM users;');
    const { rows: allUsersData } = queryData;
    return allUsersData
}

export async function createNewUser(username: string, name: string, avatar_url: string): Promise<User | Error> {
    const usernameQuery = await db.query('SELECT * FROM users;')
    const validUsernames = await usernameQuery.rows.map((user: User): string => user.username)

    if(validUsernames.includes(username)) {
        return Promise.reject({ status: 400, msg: "Username Already Exists" });
    }
    
    if(typeof username !=='string' || typeof name !== 'string' || typeof avatar_url !== 'string'){
        return Promise.reject({ status: 400, msg: "Invalid Fields Data" })
    }
    
    const createUser = await db.query(`INSERT INTO users(username, name, avatar_url) VALUES ($1, $2, $3) RETURNING *;`, [username, name, avatar_url])
    const queryData = await createUser;
    const { rows: [newUserData] } = queryData;
    return newUserData;
}