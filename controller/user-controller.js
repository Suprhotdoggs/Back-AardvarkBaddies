import { Router } from "express";
import userService from '../services/user-service.js';

const router = Router();
const svc = new userService();

router.post('/register', async (req, res) => {
    let { admin, name, lastname, password, annonymous } = req.body;
    var add = {
        "admin": admin,
        "name": name,
        "lastname": lastname,
        "password": password,
        "annonymous": annonymous
    };

    // Verificar que no falten datos
    if (!name || !lastname || !password || !admin || !annonymous) {
        return res.status(400).json({ message: 'need more data.', add });
    } 

    // Llamar a la función que maneja la inserción de usuario
    const result = await svc.addUsuarioAsync(admin, name, lastname, password, annonymous);

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
export default router;
