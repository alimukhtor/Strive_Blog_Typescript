export interface IBlogs{
    category:string
    title:string
    cover:string
    content:string
    readTime:{
        value:number
        unit:number
    }
    comments:IComment[]
    authors: Types.ObjectId;
    likes: Types.ObjectId;
}

export interface IComment{
    rate:number
    commentArea:string
    commentedDate:Date
    _id:string
}