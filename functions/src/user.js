import { FieldValue } from "firebase-admin/firestore";
import jwt from 'jsonwebtoken'
import { db } from "./dbConnect.js";
import {secretKey} from '../secrets.js'

const collection = db.collection('users')

export async function signup (req,res) {
    const{email, password } = req.body
    if(!email || !password.length > 6) {
        res.status(400).send({message: "Email and password are both required. Password must be more than 6 characters " })
        return
    }

    //TODO: check if email is already in use 
    const newUser = {
        email: email.toLowerCase(), //store email in lowercases
        password,
        createdAt: FieldValue.serverTimestamp(),
    }
    await collection.add(newUser)//waiting for a new user to be added
    //once the user is added login them 
   
    login(req, res)
}
export async function login(req, res) {
    const{ email, password} = req.body
    if(!email || !password) {
        res.status(400).send({message: "Email and password are both required." })
        return
    }
    //Now we check if that user is in the database
    const users = await collection
    .where("email", "==", email.toLowerCase())
    .where("password", "==", password)
    .get()
    let user = users.docs.map(doc => ({...doc.data(), id: doc.id})) [0]
    //
    if(!user) {
        res.status(400).send ({message:"Invalid email and/or password."})
     return
    }
    delete user.password
    const token = jwt.sign(user, secretKey)
    res.send({user, token}) //{email, createdAt, id}
}