import DBConfig from '../config/dbconfig.js'
import pkg from 'pg'
import bcrypt from 'bcryptjs'; // Importar bcryptjs para cifrar la contraseña


const { Client, Pool } = pkg;
export default class userRepository {

    addUsuarioAsync = async (admin, name, lastname, password, annonymous) => {
        let returnArray = null;
        const client = new Client(DBConfig);
    
        try {
            await client.connect();

            const sql = `INSERT INTO visitor (admin, name, lastname, password, annonymous)
                        VALUES ($1, $2, $3, $4, $5)`; // Devolver el idperfil insertado
            const values = [admin, name, lastname, password, annonymous];
            const result = await client.query(sql, values);
    
            console.log('Data inserted successfully');
            returnArray = result.rows[0]; // Esto devolverá el idperfil
    
            await client.end();
        } catch (error) {
            console.log(error);
        }
    
        return returnArray;
    };
    /*
    loginUsuarioAsync = async (mail, contraseña) => {
        let userId = null;
        const client = new Client(DBConfig);
        
        try {
            await client.connect();
    
            // Buscar el usuario por el correo
            const sql = 'SELECT idperfil, contraseña FROM perfil WHERE mail = $1';
            const values = [mail];
            const result = await client.query(sql, values);
    
            if (result.rows.length === 0) {
                // No se encontró un usuario con ese correo
                return { error: true, message: 'Correo o contraseña incorrectos' };
            }
    
            const usuario = result.rows[0];
    
            // Comparar la contraseña ingresada con la contraseña cifrada
            const esValida = bcrypt.compareSync(contraseña, usuario.contraseña);
    
            if (!esValida) {
                // La contraseña no coincide
                return { error: true, message: 'Correo o contraseña incorrectos' };
            }
    
            // Si todo está bien, devolver el ID del usuario
            userId = usuario.idperfil;
        } catch (error) {
            console.log(error);
            return { error: true, message: 'Ocurrió un error durante el login' };
        } finally {
            await client.end();
        }
    
        return { error: false, userId };
    };*/
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
    /*
    cambiarContraseñaAsync = async (idperfil, contraseñaActual, nuevaContraseña) => {
        const client = new Client(DBConfig);
        
        try {
            await client.connect();
            
            // 1. Verificar si el usuario existe y obtener su contraseña actual
            const sql = 'SELECT contraseña FROM perfil WHERE idperfil = $1';
            const values = [idperfil];
            const result = await client.query(sql, values);

            if (result.rows.length === 0) {
                // No se encontró el usuario
                return { error: true, message: 'Usuario no encontrado.' };
            }

            const usuario = result.rows[0];

            // 2. Comparar la contraseña actual ingresada con la contraseña cifrada almacenada
            const esValida = bcrypt.compareSync(contraseñaActual, usuario.contraseña);
            if (!esValida) {
                // La contraseña actual no es correcta
                return { error: true, message: 'La contraseña actual es incorrecta.' };
            }

            // 3. Generar el hash de la nueva contraseña
            const salt = bcrypt.genSaltSync(8);
            const hashedNuevaContraseña = bcrypt.hashSync(nuevaContraseña, salt);

            // 4. Actualizar la contraseña en la base de datos
            const updateSql = 'UPDATE perfil SET contraseña = $1 WHERE idperfil = $2 RETURNING *';
            const updateValues = [hashedNuevaContraseña, idperfil];
            const updateResult = await client.query(updateSql, updateValues);

            await client.end();

            // Devolver el usuario actualizado
            return { error: false, message: 'Contraseña actualizada correctamente.', data: updateResult.rows[0] };
        } catch (error) {
            console.log(error);
            return { error: true, message: 'Ocurrió un error al cambiar la contraseña.' };
        }
    };
    cambiarFotoPerfilAsync = async (idperfil, foto) => {
        let returnArray = null;
        const client = new Client(DBConfig);
        try {
            await client.connect();
            const sql = `UPDATE perfil SET foto = $2 WHERE idperfil = $1 RETURNING *`;
            const values = [idperfil, foto];  // Actualizamos el campo "foto" con la URL
            const result = await client.query(sql, values);
            await client.end();
            returnArray = result.rows[0];  // Devolver el perfil actualizado
        } catch (error) {
            console.log(error);
        }
        return returnArray;
    };
    RecuperarContrasenaAsync = async (mail) => {
        let returnArray = null;
        const client = new Client(DBConfig); // Asegúrate de tener la configuración de tu base de datos aquí
        try {
            await client.connect();
            console.log('Connected to the database');
    
            // Consulta para buscar el userId según el correo electrónico
            const sql = `SELECT idperfil FROM perfil WHERE mail = $1`;
            const values = [mail];
            
            const result = await client.query(sql, values);
            await client.end();
            
            returnArray = result.rows; // Almacena los resultados de la consulta
        } catch (error) {
            console.log('Error al buscar el usuario por correo:', error);
        }
        return returnArray; // Devuelve los resultados encontrados
    };
    async recuperarContrasenaAsync(mail) {
        await this.client.connect();

        // Verificar si el usuario existe
        const result = await this.client.query('SELECT idperfil FROM perfil WHERE mail = $1', [mail]);
        if (result.rows.length === 0) {
            return { error: true, message: 'El correo no está registrado.' };
        }

        const userId = result.rows[0].idperfil;

        // Generar un token de restablecimiento
        const { token, expires } = this.generateResetToken();
        await this.saveResetToken(userId, token, expires);

        // Enviar el correo con el enlace de restablecimiento
        await this.sendResetEmail(mail, token);

        return { message: 'Se ha enviado un correo para restablecer la contraseña.' };
    }

    generateResetToken() {
        const token = crypto.randomBytes(32).toString('hex'); // Token de 32 bytes
        const expires = Date.now() + 3600000; // 1 hora de validez
        return { token, expires };
    }

    async saveResetToken(userId, token, expires) {
        const hashedToken = bcrypt.hashSync(token, 8); // Hashear el token
        await this.client.query('UPDATE perfil SET reset_token = $1, reset_token_expiry = $2 WHERE idperfil = $3', [hashedToken, expires, userId]);
    }

    async sendResetEmail(email, token) {
        const resetUrl = `http://localhost:3000/reset-password/${token}`;
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'tuemail@gmail.com',
                pass: 'tucontraseña'
            }
        });

        const mailOptions = {
            from: 'no-reply@tuapp.com',
            to: email,
            subject: 'Restablecimiento de contraseña',
            text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
            html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetUrl}">Restablecer contraseña</a>`
        };

        await transporter.sendMail(mailOptions);
    }

    async validarResetToken(token) {
        const hashedToken = bcrypt.hashSync(token, 8);
        const result = await this.client.query('SELECT * FROM perfil WHERE reset_token = $1 AND reset_token_expiry > $2', [hashedToken, Date.now()]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    async actualizarContraseña(idperfil, nuevaContraseña) {
        const salt = bcrypt.genSaltSync(8);
        const hashedPassword = bcrypt.hashSync(nuevaContraseña, salt);
        await this.client.query('UPDATE perfil SET contraseña = $1, reset_token = null, reset_token_expiry = null WHERE idperfil = $2', [hashedPassword, idperfil]);
    }
    */
}