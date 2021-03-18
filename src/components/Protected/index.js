const Protected = ({ user, render, fail }) => {
    if (!user) {
        if (fail) {
            return fail();
        }
        return null;
    }
    return render();
}

export default Protected;