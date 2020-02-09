const Dev = require('../models/Dev');

module.exports = {
    async store(req,res) {
        const { user } = req.headers;
        const { devId } = req.params;

        // Usuário atualmente logado
        const loggedDev = await Dev.findById(user);

        // Usuário a ser buscado (dar dislike)
        const targetDev = await Dev.findById(devId);

        try {
            // Se usuário não está na lista de dislikes
            if(!loggedDev.dislikes.includes(targetDev._id)) {
    
                loggedDev.dislikes.push(targetDev._id);

                await loggedDev.save();
            }
            
        } catch (error) {
            return res.status(400).json({ error: 'Dev not exist' })
        }

        // loggedDev.likes = loggedDev.likes.filter(i => i != targetDev._id)

        return res.json(loggedDev);
    }
}