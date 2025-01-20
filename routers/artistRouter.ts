import express, { Response } from 'express';
import { protect } from '../core/middlewares';
import { AuthenticatedRequest } from '../interfaces/AuthenticatedRequest';
import { body, validationResult } from 'express-validator';
import { addMusic, deleteMusic } from '../services/musicDbServices';

let router = express.Router();

router.use(protect);


let addMusicValidator = [
    body('name').isString().notEmpty(),
    body('releaseDate').isDate().notEmpty(),
    body('imageKey').isString().notEmpty(),
    body('musicKey').isString().notEmpty(),
]

router.post('/add', addMusicValidator, async (req: AuthenticatedRequest, res: Response) => {
    let error = validationResult(req);
    if (!error.isEmpty()) {
        res.status(400).json({ errors: error.array() });
        return;
    }
    let userId = req.user.id;
    let { name, releaseDate, imageKey, musicKey } = req.body;


    let result = await addMusic(name, userId, releaseDate, imageKey, musicKey);

    if (result.success) {
        res.status(200).json(result.data);
    } else {
        res.status(400).json({ message: result.message });
    }
    return;
});


router.delete('/delete/:id', async (req: AuthenticatedRequest, res: Response) => {
    let userId = req.user.id;
    let musicId = parseInt(req.params.id);

    let result = await deleteMusic(musicId, userId);

    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(400).json({ message: result.message });
    }
    return;
});

export default router;