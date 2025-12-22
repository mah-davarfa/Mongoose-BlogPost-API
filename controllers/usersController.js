const mongoose = require('mongoose');
const User = require('../models/User');

const htpErrors =(status, message)=>{
    const error = new Error (message);
    error.status = status;
    return error;
}

const ifIdIsValidIdWithMongoose=  (id)=>{
    return  mongoose.isValidObjectId(id)
}
const isValidEmail=(email)=>{
    const emailRegex = /.+\@.+\..+/;
    return emailRegex.test(email);
}
const isNameIsvalidName = (name)=>{
    const nameRegex = /^[^<>&]+$/;
    return nameRegex.test(name);
}
const chekRoleIfIsValid=(role=>{
    const validRoles = ["admin", "author", "reader"];
    return validRoles.includes(role);
})

//GET/api/users
// getAllusers
// GET /api/users/roles?role=author 
const getAllUsersAndBasedOnrole = async (req, res, next) => {
    
        const {role}= req.query;
       const filter = role? {role}: {};
       try{
        
        const users = await User.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            users:users,
            totalUsers: users.length
        })
       }catch(err){
        next(err)
       }

    }



// GET /api/users/:id
const getUserById = async (req, res, next) => {
    const {id}= req.params;
     if (!id) next(htpErrors (400,'user id is required'));

    if(!ifIdIsValidIdWithMongoose(id)) return next(htpErrors(400,'invalid user id format'));

    try{const user = await User.findById(id);
        if(!user) return next(htpErrors(404,'user not found'));
        res.status(200).json({user:user});

}catch(err){
    next(err)
}
}
// POST /api/users
const createUser = async (req, res, next) => {
    const {name,email,role}= req.body;
    if(!name || !email) return next (htpErrors(400,'name and email are required'));
    if(!isValidEmail(email)) return next (htpErrors(400,'invalid email format'));
    const newName = name.trim();
    const newEmail = email.trim().toLowerCase();
    if(newName.length <2) return next (htpErrors(400,'name must be at least 2 characters long'));
    if(!isNameIsvalidName(newName)) return next (htpErrors(400,'name cannot contain <, >, or &'));
    if(role && !chekRoleIfIsValid(role)) return next (htpErrors(400,'role must be one of (admin, author, reader)'));
    try{
        const isemailExist = await User.findOne({email:newEmail});
        if(isemailExist) return next (htpErrors(409,'email already exists'));

        const user = await User.create({
            name: newName,
            email: newEmail,
            role: role
        })
        if(!user) return next (htpErrors(500,'could not create user'));
        res.status(201).json({message:'user created successfully', user:user});


    }catch(err){
        next(err)
    }
}


// PUT /api/users/:id
const updateUser = async (req, res, next) => {
    const {id}=req.params;
    if(!ifIdIsValidIdWithMongoose(id)) return next(htpErrors(400,'invalid user id format'));

    const {name,email,role}= req.body;
   let newUpdate={};
   if(role && !chekRoleIfIsValid(role)) return next (htpErrors(400,'role must be one of (admin, author, reader)'));
   if(name && name.trim().length<2 && !isNameIsvalidName(name.trim())) return next (htpErrors(400,'name must be at least 2 characters long and name cannot contain <, >, or &'));
   if(email && !isValidEmail(email.trim().toLowerCase())) return next (htpErrors(400,'invalid email format'));
    if(name) newUpdate.name= name.trim();
    if(email) newUpdate.email= email.trim().toLowerCase();
    if(role) newUpdate.role= role;
    try{
        if(! await User.findById(id)) return next(htpErrors(404,'user not found to update'));
        const updatedUser = await User.findByIdAndUpdate(id,newUpdate,{ new: true, runValidators: true });
        res.status(200).json({message:'user updated successfully', user:updatedUser});
     } catch(err){
        next(err)
        
}
}

//DELETE /api/user/:id
const deleteUser = async (req, res, next) => {
    const {id}= req.params;
    if(!ifIdIsValidIdWithMongoose(id)) return next(htpErrors(400,'invalid user id format'));
    try{
        const userToDelete = await User.findByIdAndDelete(id);
        if(!userToDelete) return next(htpErrors(404,'user not found to delete'));
        res.status(200).json({message:'user deleted successfully', user:userToDelete});
    }catch(err){
        next(err)
    }
}
module.exports={
deleteUser,
updateUser,
createUser,
getUserById,
getAllUsersAndBasedOnrole
}