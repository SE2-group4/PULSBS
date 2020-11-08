class User{
    constructor(userId,type,firstName,lastName,email,password){
        this.userId=userId;
        this.type=type;
        this.firstName=firstName;
        this.lastName=lastName;
        this.email=email;
        this.password=password;
    }

    static from(json){
        return Object.assign(new User(),json);
    }
}

export default User;