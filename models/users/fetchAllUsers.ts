import db from "../../db/connection";

export async function fetchAllUsers () {
    const queryData  = await db.query('SELECT * FROM users;');
    const { rows: allUsersData } = queryData;
    return allUsersData
}