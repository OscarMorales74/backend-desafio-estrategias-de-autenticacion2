import { Strategy as GithubStrategy } from 'passport-github2';
import UserDaoMongoDB from "../daos/mongodb/users.dao.js";
const userDao = new UserDaoMongoDB();
import passport from 'passport';

const strategyOptions = {
    clientID: 'Iv1.5bf3050451ada204',
    clientSecret: 'aa8ccad2643d299e0a0b147abe3aa469d01110dc',
    callbackURL: 'http://localhost:8080/users/profile-github'
};

//funcion para verificar si hay usuarios buscando por email
/**
 * 
 * @param {*} accessToken 
 * @param {*} refreshToken 
 * @param {*} profile 
 * @param {*} done 
 * @returns 
 */
const registerOrLogin = async(accessToken, refreshToken, profile, done) => {
    console.log('profile::::', profile);
    console.log('calling RegisterOrLogin funtion');
    const email = profile._json.email !== null ? profile._json.email : profile._json.blog;
    const user = await userDao.getUserByEmail(email);
    if(user) {
        console.log('User found', user);
        return done(null, user);}
        const firstName = profile._json.name ? profile._json.name.split(' ')[0] : '';
        const lastName = profile._json.name ? profile._json.name.split(' ').slice(1).join(' ') : '';
        const newUser = await userDao.createUser({
            first_name: firstName,
            last_name: lastName,
            email,
            password: ' ',
            isGithub: true
        });

        
    // const newUser =await userDao.createUser({
    //     first_name: profile._json.name.split(' ')[0],
    //     last_name: profile._json.name.split(' ')[1] + ' ' + profile._json.name.split(' ')[2],
    //     email,
    //     password: ' ',
    //     isGithub: true
    // });
    return done(null, newUser);
}

//inicializamos
passport.use('github', new GithubStrategy(strategyOptions, registerOrLogin));