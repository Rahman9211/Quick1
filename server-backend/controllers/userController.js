

export const getUserCreation = async (req, res)=>{
    try {
        const {userId} = req.auth()
    } catch (error) {
        res.json({ success: false, message:error.message});
    }
}