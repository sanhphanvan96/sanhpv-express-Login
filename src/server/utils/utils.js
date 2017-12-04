export const ttl = () => {
    let today = new Date();
    let nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    return nextWeek.getTime();
};