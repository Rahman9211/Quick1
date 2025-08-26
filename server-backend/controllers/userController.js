import sql from "../configs/db.js";

export const getUserCreation = async (req, res)=>{
    try {
        const {userId} = req.auth()

        const creations = await sql`SELECT * FROM creations WHERE user_id = ${userId}
        ORDER BY created_at DESC`;

        res.json({ success: true, creations});

    } catch (error) {
        res.json({ success: false, message:error.message});
    }
}

export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await sql`
      SELECT * FROM creations 
      WHERE publish = true 
      ORDER BY created_at DESC
    `;

    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const toggleLikeCreation = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body;

        // Check if id is provided
        if (!id) {
            return res.status(400).json({ success: false, message: "Creation ID is required" });
        }

        // Query should use the correct table name (creation vs creations)
        const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;

        if (!creation) {
            return res.status(404).json({ success: false, message: "Creation not found" });
        }

        const currentLikes = creation.likes || []; // Use lowercase 'likes' and handle null case
        const userIdStr = userId.toString(); // Use toString() instead of string()
        
        let updatedLikes;
        let message;

        if (currentLikes.includes(userIdStr)) {
            updatedLikes = currentLikes.filter(user => user !== userIdStr);
            message = 'Creation unliked';
        } else {
            updatedLikes = [...currentLikes, userIdStr];
            message = 'Creation liked';
        }

        // Properly format the array for PostgreSQL
        await sql`UPDATE creations SET likes = ${updatedLikes} WHERE id = ${id}`;

        res.json({ success: true, message, likes: updatedLikes });
    } catch (error) {
        console.error('Toggle like error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};