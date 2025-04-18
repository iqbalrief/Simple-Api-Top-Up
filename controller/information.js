const { sequelize } = require('../models');

const { sendSuccess, sendError, STATUS } = require('../utils/errorHandler');

const getInformation = async (req, res) => {
    try {
        const banner = await sequelize.query(
            `SELECT banner_name, banner_image, description
             FROM "Banners"`,
            {
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (!banner || banner.length === 0) {
            return sendError(res, 404, 'Banner tidak ditemukan', STATUS.VALIDATION_ERROR);
        }

        return sendSuccess(res, 'Sukses', banner);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, 'Gagal mengambil data banner', STATUS.SERVER_ERROR);
    }
};

const getServices = async (req, res) => {
    try {
        const services = await sequelize.query(
            `SELECT service_code,service_icon,service_name,service_tarif
             FROM "Services"`,
            {
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (!services || services.length === 0) {
            return sendError(res, 404, 'Banner tidak ditemukan', STATUS.VALIDATION_ERROR);
        }

        return sendSuccess(res, 'Sukses', services);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, 'Gagal mengambil data banner', STATUS.SERVER_ERROR);
    }
};

module.exports = {
    getInformation,
    getServices
}
