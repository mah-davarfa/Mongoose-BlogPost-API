// const user={
//   id: number,
//   name: string,            // required, min 2 chars
//   email: string,           // required, valid email
//   role: string,            // optional: admin|author|reader (default: author)
//   createdAt: string
// }
const users=[{
  id: 1,
  name: ' boby',            // required, min 2 chars
  email: 'boby@email.com',           // required, valid email
  role: 'admin',            // optional: admin|author|reader (default: author)
  createdAt: new Date().toISOString()
},

{
  id: 2,
  name: ' boby bob',            // required, min 2 chars
  email: 'bobybo@email.com',           // required, valid email
  role: 'author',            // optional: admin|author|reader (default: author)
  createdAt: new Date().toISOString()
},{
   id: 3,
  name: ' bob',            // required, min 2 chars
  email: 'bob@email.com',           // required, valid email
  role: 'reader',            // optional: admin|author|reader (default: author)
  createdAt: new Date().toISOString()    
}]
//helper function
//validat Email
function validateEmail (email){
    const validEmail= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validEmail.test(email)
}
function  indexUserEmail(email){
    return users.findIndex(user=>user.email?.toLowerCase()===email.toLowerCase())
}

//get allowed roles from users DB and avoiding duplicates and undefined(by useing new set() and .add() that creates unique values only)

const defaultRoles = ['admin','author','reader'];    
const ALLOWED_ROLES = new Set(defaultRoles);
//gets roles that is not in defaultRoles from users DB
    users.forEach(user=>{
        const role =user.role?.toLowerCase().trim();
        if(role) {
            ALLOWED_ROLES.add(role);
        }
    })



const errorForNotAllowedRole=()=>{
    const err= new Error(`Allowed Roles are: ${[...ALLOWED_ROLES].join(', ')}`)
    err.status=400
    return err  
} 

const errorNotUserFound=()=>{
    const err= new Error("Could not find user for this request")
    err.status=404
    return err
}

const errorEmailNotValid=()=>{
    const err=new Error('invalid email format')
    err.status=400
    return err
}

const errorDuplicatedEmail=()=>{
    const err = new Error('email already in use, use another email')
    err.status=409
    return err    
}

const errorLeesThanThreeChUser=()=>{
    const err=new Error('name must be more than 2 character')
    err.status=400
    return err    
}   

const idIsNotProvided =()=>{
    {
    const err =new Error(' ID is required')
    err.status=400
    return err
        }
}
// //GET/api/users
// const getAllusers=(req,res,next)=>{
//     try{
//     if(users.length>0) return res.status(200).json({
//         users:users,
//         count:users.length
//     })
//     if(users.length=== 0)return res.status(200).json({
//         users:[]
//     })
//     }catch(err){
//        return next(err)
//     }


// }
// GET /api/users/roles?role=author   and GET/api/users
const getAllUsersAndBasedOnrole=(req,res,next)=>{
    const {role}= req.query;


            
       
    try{
         if(!role) return res.status(200).json({
        users:users,
        count:users.length
    })

        //  Check if role exists in DB
        const requestedRole = role?.toLowerCase().trim();
        if (!ALLOWED_ROLES.has(requestedRole)) return next(errorForNotAllowedRole())
        //  Filter users by role, Return either empty or populated list
        const usersWithRole = users.filter(ur=> ur.role?.toLowerCase().trim()===requestedRole)
        return res.status(200).json({
            users:usersWithRole,
            count:usersWithRole.length,
            message: 
              usersWithRole.length===0
              ? `Role '${requestedRole}' exists but has no members`
              : undefined
        })

    }catch(err){
        return next(err)
        }
    }
   
// GET /api/users/:id
const getUserById =(req,res,next)=>{
    const {id}=req.params;
    if(!id) return next(idIsNotProvided())
    try{
         const user = users.find(u=>u.id === Number(id));
         if(!user) return next(errorNotUserFound( ))
        res.status(200).json({user})

    }catch(err){
        return next(err)
    }
}

// POST /api/users
const createUser =(req,res,next)=>{
   const { name, email, role } = req.body;
   try{
        if(!name || !email || !role){
            const err= new Error('name, email and role are required fields')
            err.status=400;
            return next(err)
        }
        //valid email
            if(!validateEmail(email))return next(errorEmailNotValid())
        // email must not exist
        const emailExited = indexUserEmail(email)
        if(emailExited !== -1 )return next(errorDuplicatedEmail())
        //name min 2 chars
        if(name.length <=2) return next(errorLeesThanThreeChUser())
        //role must be valid role
        const userRole = role?.toLowerCase().trim();
        if(!ALLOWED_ROLES.has(userRole)) return next(errorForNotAllowedRole())
              
        //if passes validations now time to add
        //find higest users.Id
        const biggestId =  users.length ? users.reduce((acc,nextUser)=>{
            return nextUser.id > acc? nextUser.id : acc
        },0) : 0;
        const newUser = {
            id:biggestId +1,
            name: name,
            email:email,
            role: role.toLowerCase().trim(),
            createdAt: new Date().toISOString()
        }
        users.push(newUser);

        res.status(201).json({
            message:'User Created',
            user: newUser
        })
    
    }catch(err){
       return  next(err)
   }
}

// PUT /api/users/:id
const updateUser =(req,res,next)=>{
    const {id}= req.params;
    const  {name,email,role}= req.body;
    
    if(!id) return next(idIsNotProvided())

    const userIndex= users.findIndex(u=>u.id === Number(id))
    if(userIndex===-1) return next(errorNotUserFound())

         
         const NEED_TO_UPDATE ={}
         if(name)NEED_TO_UPDATE.name=name.trim();
         if(email)NEED_TO_UPDATE.email=email.trim().toLowerCase();
         if(role)NEED_TO_UPDATE.role=role.trim().toLowerCase();
       
    try{
        //check 3 char 
       
            if(NEED_TO_UPDATE.name && NEED_TO_UPDATE.name.length<=2) return next(errorLeesThanThreeChUser())
            
                //validate email
           
             if(NEED_TO_UPDATE.email && !validateEmail(NEED_TO_UPDATE.email.trim().toLowerCase())) return next(errorEmailNotValid())
            
            //duplicated email
             const emailExist = users.find((u)=>(u.email?.trim().toLowerCase()===NEED_TO_UPDATE.email && u.id !== Number(id)))

             if(NEED_TO_UPDATE.email && emailExist)  return next(errorDuplicatedEmail())

                //role not allowed
            
           if(NEED_TO_UPDATE.role && !ALLOWED_ROLES.has(NEED_TO_UPDATE.role)) return next(errorForNotAllowedRole())
            
         //update
            users[userIndex]={...users[userIndex],...NEED_TO_UPDATE}

        
            res.status(200).json({
                message:"updated ",
                user:users[userIndex]
            })

    }catch(err){
        return next(err)
    }
}

//DELETE /api/user/:id
const deleteUser=(req,res,next)=>{
    const {id}=req.params
    
    if(!id)return next(idIsNotProvided())
    try{
        const userIdIndex=users.findIndex(us=>us.id===Number(id))
        if(userIdIndex===-1)return next(errorNotUserFound())
           //user avalibility
        const [deletedUser] = users.splice(userIdIndex,1);
        res.status(200).json({
            message:`the user with: ${deletedUser.id}and name:${deletedUser.name} and email:${deletedUser.email} deleted}`
        })
    }catch(err){
return next(err)
    }
}
module.exports={
    deleteUser,
    updateUser,
    createUser,
    getUserById,
    getAllUsersAndBasedOnrole,
   // getAllusers

}

