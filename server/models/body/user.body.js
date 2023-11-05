
export const addOfficer = (req) => {
    const user = {
        name: req.body.name,
        code: req.body.code,
        email: req.body.email,
    }

    return user;
}

export const registerAndLogin = (req) => {
    const user = {
        code: req.body.code,
        password: req.body.password,
    }

    return user;
}

