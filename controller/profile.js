const multer = require('multer');

const { sequelize } = require('../models');
const {updateProfileSchema} = require('../validator/membership')
const { sendError, sendSuccess, STATUS } = require('../utils/errorHandler');


const avatar = async (req, res) => {
    try {
        const userId = req.user.id;
        const { error, value } = updateProfileSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return sendError(res, 400, 'Parameter tidak sesuai format', STATUS.VALIDATION_ERROR);
        }

        const { first_name, last_name } = value;
        const updatedFields = {};
        const replacements = { userId };

        if (first_name) {
            updatedFields.first_name = 'first_name = :first_name';
            replacements.first_name = first_name;
        }

        if (last_name) {
            updatedFields.last_name = 'last_name = :last_name';
            replacements.last_name = last_name;
        }

        if(req.file) {
            const imageUrl = process.env.NODE_ENV === 'production' 
            ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/uploads/${req.file.filename}`
            : `http://localhost:3000/uploads/${req.file.filename}`;
            updatedFields.profile_image = 'profile_image = :profile_image';
            replacements.profile_image = imageUrl;
        }

        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).json({
                status: 102,
                message: 'Tidak ada field yang diupdate'
            });
        }

        const setClause = Object.values(updatedFields).join(', ');

        const query = `
            UPDATE "Users"
            SET ${setClause},
                "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = :userId
        `;

        const [updatedRow] = await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.UPDATE
        });

        if (updatedRow === 0) {
            return res.status(404).json({ status: 108, message: 'User tidak ditemukan' });
        }

        const [result] = await sequelize.query(
            `SELECT email, first_name, last_name, profile_image
             FROM "Users"
             WHERE id = :userId
             LIMIT 1`, {
            replacements: { userId },
            type: sequelize.QueryTypes.SELECT
        });
       
        return sendSuccess(res, 'Update Profile berhasil', result);

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 108,
            message: 'Gagal update profile',
            error: err.message
        });
    }
};

const profile = async (req, res) => {
    const { error, value } = updateProfileSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return sendError(res, 400, 'Parameter tidak sesuai format', STATUS.VALIDATION_ERROR);
    }

    try {
        const userId = req.user.id;
        const { first_name, last_name } = value;

        if (!first_name && !last_name) {
            return sendError(res, 400, 'Minimal salah satu dari first_name atau last_name harus diisi', STATUS.VALIDATION_ERROR);
        }

        const updatedFields = {};
        const replacements = { userId };

        if (first_name) {
            updatedFields.first_name = 'first_name = :first_name';
            replacements.first_name = first_name;
        }

        if (last_name) {
            updatedFields.last_name = 'last_name = :last_name';
            replacements.last_name = last_name;
        }

        const setClause = Object.values(updatedFields).join(', ');

        const query = `
            UPDATE "Users"
            SET ${setClause},
                "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = :userId
        `;

        const [updatedRow] = await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.UPDATE
        });

        if (updatedRow === 0) {
            return sendError(res, 404, 'User tidak ditemukan', STATUS.SERVER_ERROR);
        }

        const [result] = await sequelize.query(
            `SELECT email, first_name, last_name, profile_image
             FROM "Users"
             WHERE id = :userId
             LIMIT 1`, {
            replacements: { userId },
            type: sequelize.QueryTypes.SELECT
        });

        return sendSuccess(res, 'Update nama berhasil', result);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, 'Gagal update nama', err.message, STATUS.SERVER_ERROR);
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const [user] = await sequelize.query(
            `SELECT email, first_name, last_name, profile_image
             FROM "Users"
             WHERE id = :userId
             LIMIT 1`,
            {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (!user) {
            return sendError(res, 404, 'User tidak ditemukan', STATUS.VALIDATION_ERROR);
        }

        return sendSuccess(res, 'Sukses', user);
    } catch (err) {
        console.error(err);
        return sendError(res, 500, 'Gagal mengambil data profil', STATUS.SERVER_ERROR);
    }
};


module.exports = {
    profile,
    avatar,
    getProfile
}