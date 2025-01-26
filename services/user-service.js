import userRepository from '../repositories/user-repository.js'
export default class userService{
    addUsuarioAsync = async (admin, name, lastname, password, annonymous) => {
        const repo = new userRepository();
        const returnArray = await repo.addUsuarioAsync(admin, name, lastname, password, annonymous);
        return returnArray;
    }
    
    loginUsuarioAsync = async (name, lastname, password) => {
        const repo = new userRepository();
        const returnArray = await repo.loginUsuarioAsync(name, lastname, password);
        return returnArray;
    }
    getAllPerfilAsync = async (idvisitor) => {
        const repo = new userRepository();
        const returnArray = await repo.getAllPerfilAsync(idvisitor);
        return returnArray;
    }
    cambiarContraseñaAsync = async (idvisitor, actualpassword, newpassword) => {
        const repo = new userRepository();
        const returnArray = await repo.cambiarContraseñaAsync(idvisitor, actualpassword, newpassword);
        return returnArray;
    }
    /*cambiarFotoPerfilAsync = async (idperfil, foto) => {
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