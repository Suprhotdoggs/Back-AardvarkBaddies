import userRepository from '../repositories/user-repository.js'
export default class userService{
    addUsuarioAsync = async (admin, name, lastname, password, annonymous) => {
        const repo = new userRepository();
        const returnArray = await repo.addUsuarioAsync(admin, name, lastname, password, annonymous);
        return returnArray;
    }
    /*
    loginUsuarioAsync = async (mail, contraseña) => {
        const repo = new usuarioRepository();
        const returnArray = await repo.loginUsuarioAsync(mail, contraseña);
        return returnArray;
    }*/
    getAllPerfilAsync = async (idvisitor) => {
        const repo = new userRepository();
        const returnArray = await repo.getAllPerfilAsync(idvisitor);
        return returnArray;
    }
    /*cambiarContraseñaAsync = async (idperfil, contraseñaActual, nuevaContraseña) => {
        const repo = new usuarioRepository();
        const returnArray = await repo.cambiarContraseñaAsync(idperfil, contraseñaActual, nuevaContraseña);
        return returnArray;
    }
    cambiarFotoPerfilAsync = async (idperfil, foto) => {
        const repo = new usuarioRepository();
        const returnArray = await repo.cambiarFotoPerfilAsync(idperfil, foto);
        return returnArray;
    }
    RecuperarContrasenaAsync = async (mail) => {
        const repo = new usuarioRepository();
        const returnArray = await repo.RecuperarContrasenaAsync(mail);
        return returnArray;
    }*/
}