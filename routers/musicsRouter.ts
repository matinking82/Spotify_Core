import express from 'express';
import { protect } from '../core/middlewares';
import { AuthenticatedRequest } from '../interfaces/AuthenticatedRequest';
import { getAllMusics, getArtistsMusic, getHomeMusicsForUser, likeMusic, searchMusic, unlikeMusic } from '../services/musicDbServices';

let router = express.Router();

router.use(protect);


router.get('/home', async (req: AuthenticatedRequest, res) => {
    //#swagger.tags = ['Musics']
    //#swagger.description = 'Get home musics for user'
    let userId = req.user.id;

    let result = await getHomeMusicsForUser(userId);

    if (!result.success) {
        res.status(400).json({
            message: result.message,
        });
        return;
    }

    res.json(result.data);
    return;
});

router.get('/mymusics', async (req: AuthenticatedRequest, res) => {
    //#swagger.tags = ['Musics']
    //#swagger.description = 'Get artist musics'
    let userId = req.user.id;

    let result = await getArtistsMusic(userId, userId);

    if (!result.success) {
        res.status(400).json({
            message: result.message,
        });
        return;
    }

    res.json(result.data);
    return;
});

router.get('/search', async (req: AuthenticatedRequest, res) => {
    //#swagger.tags = ['Musics']
    //#swagger.description = 'Search musics'
    let userId = req.user.id;
    let search = req.query.search as string;

    if (!search) {
        let result = await getAllMusics(userId);

        if (!result.success) {
            res.status(400).json({
                message: result.message,
            });
            return;
        }

        res.json(result.data);
        return;
    }

    let result = await searchMusic(search, userId);

    if (!result.success) {
        res.status(400).json({
            message: result.message,
        });
        return;
    }

    res.json(result.data);
    return;
});

router.post('/like/:id', async (req: AuthenticatedRequest, res) => {
    //#swagger.tags = ['Musics']
    //#swagger.description = 'Like a music'
    let userId = req.user.id;
    let musicId = parseInt(req.params.id);

    let result = await likeMusic(musicId, userId);

    if (!result.success) {
        res.status(400).json({
            success: false,
            message: result.message,
        });
        return;
    }

    res.json(result);
    return;
});

router.delete('/unlike/:id', async (req: AuthenticatedRequest, res) => {
    //#swagger.tags = ['Musics']
    //#swagger.description = 'Unlike a music'
    let userId = req.user.id;
    let musicId = parseInt(req.params.id);

    let result = await unlikeMusic(musicId, userId);

    if (!result.success) {
        res.status(400).json({
            success: false,
            message: result.message,
        });
        return;
    }

    res.json(result);
    return;
});

export default router;