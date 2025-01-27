import DBConfig from '../config/dbconfig.js'
import pkg from 'pg'

const { Client, Pool } = pkg;
export default class peopleRepository {

    addnewpeople = async (name, lastname, gender, age, photo, country) => {
        let returnArray = null;
        const client = new Client(DBConfig);
    
        try {
            await client.connect();
    
            // Convertir name y lastname a minúsculas para comparación
            const lowerName = name.toLowerCase();
            const lowerLastname = lastname.toLowerCase();
    
            // Comprobar si ya existe un usuario con el mismo nombre y apellido
            const checkSql = `SELECT * FROM people WHERE LOWER(name) = $1 AND LOWER(lastname) = $2`;
            const checkValues = [lowerName, lowerLastname];
            const checkResult = await client.query(checkSql, checkValues);
    
            if (checkResult.rows.length > 0) {
                console.log('Ya existe un usuario con este nombre y apellido.');
                return { error: 'El usuario ya existe' };
            }
    
            // Si no existe, insertar el nuevo usuario
            const sql = `INSERT INTO people (name, lastname, gender, age, photo, country)
                        VALUES ($1, $2, $3, $4, $5, $6) RETURNING idpeople`;
            const values = [name, lastname, gender, age, photo, country];
            const result = await client.query(sql, values);
    
            console.log('Data inserted successfully');
            returnArray = result.rows[0]; // Esto devolverá el idperfil
    
            await client.end();
        } catch (error) {
            console.log(error);
        }
    
        return returnArray;
    };

    findPerson = async (name, lastname) => {
        const client = new Client(DBConfig);
    
        try {
            await client.connect();
    
            // Consulta simple con OR
            const query = `
                SELECT * 
                FROM people 
                WHERE name ILIKE $1 OR lastname ILIKE $2
            `;
            const values = [`%${name || ''}%`, `%${lastname || ''}%`]; // Búsqueda parcial insensible a mayúsculas
    
            const result = await client.query(query, values);
    
            await client.end();
            return result.rows; // Devolver filas encontradas
        } catch (error) {
            console.error('Error al buscar personas:', error);
            return { error: 'Error al buscar personas' };
        }
    };
    
    

    

    /*
    loginUsuarioAsync = async (name, lastname, password) => {
        let idvisitor = null;
        const client = new Client(DBConfig);
        
        try {
            await client.connect();
    
            // Buscar el usuario por el correo
            const sql = 'SELECT idvisitor, password FROM visitor WHERE name = $1 AND lastname = $2';
            const values = [name, lastname];
            const result = await client.query(sql, values);
    
            if (result.rows.length === 0) {
                // No se encontró un usuario con ese correo
                return { error: true, message: 'Name or Lastname incorrect' };
            }
    
            const usuario = result.rows[0];
    
            // Comparar la contraseña ingresada con la contraseña cifrada
            var samepass = password == usuario.password 
    
            if (!samepass) {
                // La contraseña no coincide
                return { error: true, message: 'Password incorrect' };
            }
    
            // Si todo está bien, devolver el ID del usuario
            idvisitor = usuario.idvisitor;
        } catch (error) {
            console.log(error);
            return { error: true, message: 'Ocurrió un error durante el login' };
        } finally {
            await client.end();
        }
    
        return { error: false, idvisitor };
    };
    getAllPerfilAsync = async (idvisitor) => {
        let returnArray = null;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            console.log('Connected to the database 2');
            const sql = `SELECT *
            FROM visitor  
            WHERE idvisitor = $1`;
            const values = [idvisitor] 
            const result = await client.query(sql,values);
            await client.end();
            returnArray = result.rows;
        } catch (error) {
            console.log(error);
        }
        return returnArray;
    }
    cambiarContraseñaAsync = async (idvisitor, actualpassword, newpassword) => {
        const client = new Client(DBConfig);
        
        try {
            await client.connect();
            
            // 1. Verificar si el usuario existe y obtener su contraseña actual
            const sql = 'SELECT password FROM visitor WHERE idvisitor = $1';
            const values = [idvisitor];
            const result = await client.query(sql, values);

            if (result.rows.length === 0) {
                // No se encontró el usuario
                return { error: true, message: 'Usuario no encontrado.' };
            }

            const usuario = result.rows[0];

            // 2. Comparar la contraseña actual ingresada con la contraseña cifrada almacenada
            const esValida = actualpassword == usuario.password
            if (!esValida) {
                // La contraseña actual no es correcta
                return { error: true, message: 'La contraseña actual es incorrecta.' };
            }

            // 3. Generar el hash de la nueva contraseña

            // 4. Actualizar la contraseña en la base de datos
            const updateSql = 'UPDATE visitor SET password = $1 WHERE idvisitor = $2 RETURNING *';
            const updateValues = [newpassword, idvisitor];
            const updateResult = await client.query(updateSql, updateValues);

            await client.end();

            // Devolver el usuario actualizado
            return { error: false, message: 'Contraseña actualizada correctamente.', data: updateResult.rows[0] };
        } catch (error) {
            console.log(error);
            return { error: true, message: 'Ocurrió un error al cambiar la contraseña.' };
        }
    };*/
}