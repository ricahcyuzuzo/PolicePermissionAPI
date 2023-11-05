import Hapi from '@hapi/joi';

export const validatePermissions = (user) => {
    const schema = Hapi.object().keys({
        startDate: Hapi.string().required(),
        endDate: Hapi.string().required(),
        reason: Hapi.string().required(),
    })

    return schema.validate(user);
}
