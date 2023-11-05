export const requestPermissionBody = (req) => {
    const user = {
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        reason: req.body.reason,
    }

    return user;
}