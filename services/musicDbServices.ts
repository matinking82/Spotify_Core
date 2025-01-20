import logger from "../core/logger";
import dbContext from "../prisma/dbContext";


const getMusicWithIsLiked = async (musics, userId: number) => {
    let musicWithIsLiked = [];

    for (let music of musics) {
        let isLiked = await dbContext.like.findFirst({
            where: {
                userId,
                musicId: music.id,
            },
        });

        musicWithIsLiked.push({
            ...music,
            isLiked: isLiked ? true : false,
        });
    }

    return musicWithIsLiked;
};

export const addMusic = async (name: string, artistId: number, releaseDate: Date, imageKey: string, musicKey: string) => {
    try {
        const music = await dbContext.music.create({
            data: {
                name,
                artistId,
                releaseDate: new Date(releaseDate),
                imageKey,
                musicKey,
            }
        });

        return {
            success: true,
            data: music,
        }
    } catch (error) {
        logger.error(error, {
            section: "musicDbServices",
        });

        return {
            success: false,
            message: "Error while adding music",
        }
    }
}

export const getArtistsMusic = async (artistId: number, userId: number) => {
    try {
        const music = await dbContext.music.findMany({
            where: {
                artistId,
            },
        });

        return {
            success: true,
            data: await getMusicWithIsLiked(music, userId),
        }
    } catch (error) {
        logger.error(error, {
            section: "musicDbServices",
        });

        return {
            success: false,
            message: "Error while getting artist's music",
        }
    }
}

export const getHomeMusicsForUser = async (userId: number) => {
    try {
        let likes = await dbContext.like.findMany({
            where: {
                userId,
            },
        });

        let likeIds = likes.map(like => like.musicId);

        let myMusics = await dbContext.music.findMany({
            where: {
                artistId: userId,
            },
        });

        let myMusicIds = myMusics.map(music => music.id);

        let union = [...likeIds, ...myMusicIds];

        let musics = await dbContext.music.findMany({
            where: {
                id: {
                    in: union,
                },
            },
        });

        return {
            success: true,
            data: await getMusicWithIsLiked(musics, userId),
        }
    } catch (error) {
        logger.error(error, {
            section: "musicDbServices",
        });

        return {
            success: false,
            message: "Error while getting home musics for user",
        }
    }
}

export const searchMusic = async (search: string, userId: number) => {
    try {
        const musics = await dbContext.music.findMany({
            where: {
                name: {
                    contains: search,
                },
            },
        });

        return {
            success: true,
            data: await getMusicWithIsLiked(musics, userId),
        }
    } catch (error) {
        logger.error(error, {
            section: "musicDbServices",
        });

        return {
            success: false,
            message: "Error while searching music",
        }
    }
}

export const deleteMusic = async (musicId: number, userId: number) => {
    try {
        const music = await dbContext.music.findFirst({
            where: {
                id: musicId,
                artistId: userId,
            },
        });

        if (!music) {
            return {
                success: false,
                message: "Music not found",
            }
        }

        await dbContext.music.delete({
            where: {
                id: musicId,
            },
        });

        return {
            success: true,
            message: "Music deleted",
        }
    } catch (error) {
        logger.error(error, {
            section: "musicDbServices",
        });

        return {
            success: false,
            message: "Error while deleting music",
        }
    }
}

export const getAllMusics = async (userId: number) => {
    try {
        const musics = await dbContext.music.findMany();

        return {
            success: true,
            data: await getMusicWithIsLiked(musics, userId),
        }
    } catch (error) {
        logger.error(error, {
            section: "musicDbServices",
        });

        return {
            success: false,
            message: "Error while getting all musics",
        }
    }
}

export const likeMusic = async (musicId: number, userId: number) => {
    try {
        const music = await dbContext.music.findFirst({
            where: {
                id: musicId,
            },
        });

        if (!music) {
            return {
                success: false,
                message: "Music not found",
            }
        }

        let liked = await dbContext.like.findFirst({
            where: {
                userId,
                musicId,
            },
        });

        if (liked) {
            return {
                success: true,
                message: "Music already liked",
            }
        }

        await dbContext.like.create({
            data: {
                userId,
                musicId,
            },
        });

        return {
            success: true,
            message: "Music liked",
        }
    } catch (error) {
        logger.error(error, {
            section: "musicDbServices",
        });

        return {
            success: false,
            message: "Error while liking music",
        }
    }
}

export const unlikeMusic = async (musicId: number, userId: number) => {
    try {
        const music = await dbContext.music.findFirst({
            where: {
                id: musicId,
            },
        });

        if (!music) {
            return {
                success: false,
                message: "Music not found",
            }
        }

        let liked = await dbContext.like.findFirst({
            where: {
                userId,
                musicId,
            },
        });

        if (!liked) {
            return {
                success: true,
                message: "Music already unliked",
            }
        }

        await dbContext.like.deleteMany({
            where: {
                userId,
                musicId,
            },
        });

        return {
            success: true,
            message: "Music unliked",
        }
    } catch (error) {
        logger.error(error, {
            section: "musicDbServices",
        });

        return {
            success: false,
            message: "Error while unliking music",
        }
    }
}