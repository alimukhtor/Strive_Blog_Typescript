interface IAuthor {
    first_name:string
    last_name:string
    email:string
    password:string
    role:string
    googleId:string
    timestamps:boolean
    _id:string
    checkCredentials:Promise<IAuthor | null>
}

namespace Express{
    // interface Request{
    //     user:IAuthor & { token: string }
    // }

    interface User extends Partial<IAuthor> {
        token?: string
    }
}



    