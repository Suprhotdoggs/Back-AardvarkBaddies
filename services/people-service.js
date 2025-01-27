import peopleRepository from '../repositories/people-repository.js'
export default class peopleService{
    addnewpeople = async (name, lastname, gender, age, photo, country) => {
        const repo = new peopleRepository();
        const returnArray = await repo.addnewpeople(name, lastname, gender, age, photo, country);
        return returnArray;
    }
    findPerson = async (name, lastname) => {
        const repo = new peopleRepository();
        const returnArray = await repo.findPerson(name, lastname);
        return returnArray;
    }
    /*
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