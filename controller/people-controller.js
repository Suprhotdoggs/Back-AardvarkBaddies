import { Router } from "express";
import peopleService from "../services/people-service.js";

const router = Router();
const svc = new peopleService();

router.post('/newpeople', async (req, res) => {
    let { name, lastname, gender, age, photo, country } = req.body;
    var add = {
        "name": name,
        "lastname": lastname,
        "gender": gender,
        "age": age,
        "photo": photo,
        "country": country
    };

    // Verificar que no falten datos
    if (!name || !lastname || !gender || !age || !photo || !country) {
        return res.status(400).json({ message: 'need more data.', add });
    } 

    // Llamar a la función que maneja la inserción de usuario
    const result = await svc.addnewpeople(name, lastname, gender, age, photo, country);

    if (result?.error) {
        // Si hay un error (como el correo ya registrado), devolver el mensaje de error
        return res.status(400).json({ message: result.message });
    }

    // Si la inserción fue exitosa, devolver el idperfil
    return res.status(201).json({ 
        message: 'Perfectly added.', 
        add 
    });
});

router.get('/findperson/:name/:lastname', async (req, res) => {
    const { name = '', lastname = '' } = req.params; // Tomar parámetros con valores predeterminados

    try {
        // Llamar a la función que realiza la búsqueda
        const result = await svc.findPerson(name, lastname);

        if (result?.error) {
            return res.status(500).json({ message: 'Error searching for person.', error: result.error });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'No persons found with the provided criteria.' });
        }

        // Devolver los resultados encontrados
        return res.status(200).json({
            message: 'Persons found successfully.',
            data: result
        });
    } catch (error) {
        console.error('Error in /findperson:', error);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});


router.post('/login', async (req, res) => {
    const { name, lastname, password } = req.body;

    if (!name|| !lastname|| !password) {
        return res.status(400).json({ message: 'Faltan datos.' });
    }

    const result = await svc.loginUsuarioAsync(name, lastname, password);

    if (result.error) {
        return res.status(401).json({ message: result.message });
    }

    return res.status(200).json({ message: 'Login exitoso', idvisitor: result.idvisitor });
});

router.get('/username/:idvisitor', async (req, res) => {
    let respuesta;
    const idvisitor = req.params.idvisitor;

    const returnArray = await svc.getAllPerfilAsync(idvisitor);
    if (returnArray != null) {
        respuesta = res.status(200).json(returnArray);
    } else {
        respuesta = res.status(500).send('Error Interno');
    }
    return respuesta;
});

router.patch('/change-password', async (req, res) => {
    const { idvisitor, actualpassword, newpassword } = req.body;

    if (!idvisitor|| !actualpassword || !newpassword) {
        return res.status(400).json({ message: 'Faltan datos.' });
    }

    const result = await svc.cambiarContraseñaAsync(idvisitor, actualpassword, newpassword);

    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: 'Contraseña cambiada exitosamente.' });
});
/*
router.patch('/cambiar-foto-perfil', async (req, res) => {
    const { idperfil, foto } = req.body;  // Ahora recibimos la URL de la foto desde req.body

    if (!idperfil || !foto) {
        return res.status(400).json({ message: 'Faltan datos.' });
    }

    // Llamamos al servicio para cambiar la URL de la foto
    const result = await svc.cambiarFotoPerfilAsync(idperfil, foto);

    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: 'Foto cambiada exitosamente.' });
});
router.get('/recuperar-contrasena/:mail', async (req, res) => {
    let respuesta;
    const mail = req.params.mail;

    const returnArray = await svc.RecuperarContrasenaAsync(mail);
    if (returnArray != null) {
        respuesta = res.status(200).json(returnArray);
    } else {
        respuesta = res.status(500).send('Error Interno');
    }
    return respuesta;
});
*/
export default router;
