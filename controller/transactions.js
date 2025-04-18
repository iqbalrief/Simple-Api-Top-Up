const { sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { QueryTypes } = require('sequelize');
const { sendError, sendSuccess, STATUS } = require('../utils/errorHandler');

const topUp = async (req, res) => {
    try {
        const userId = req.user.id;
        const { top_up_amount } = req.body;

        if (isNaN(top_up_amount) || top_up_amount <= 0) {
            return sendError(res, 400, 'Parameter amount harus angka dan lebih kecil dari 0', STATUS.VALIDATION_ERROR);
        }

        const [user] = await sequelize.query(
            'SELECT balance FROM "Users" WHERE id = :userId LIMIT 1',
            {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (!user) {
            return sendError(res, 404, 'User tidak ditemukan', STATUS.VALIDATION_ERROR);
        }

        const newBalance = parseFloat(user.balance) + parseFloat(top_up_amount);

        await sequelize.query(
            'UPDATE "Users" SET balance = :newBalance WHERE id = :userId',
            {
                replacements: { newBalance, userId },
                type: sequelize.QueryTypes.UPDATE
            }
        );

        const invoiceNumber = Math.floor(Math.random() * 1000000);

        await sequelize.query(
            `INSERT INTO "Transactions" (id, user_id, invoice_number, transaction_type, description, total_amount, "createdAt", "updatedAt")
             VALUES (:id, :userId, :invoiceNumber, :transactionType, :description, :total_amount, NOW(), NOW())`,
            {
                replacements: {
                    id: uuidv4(),
                    userId,
                    invoiceNumber,
                    transactionType: 'TOPUP',
                    description: 'Top up saldo',
                    total_amount: top_up_amount
                },
                type: sequelize.QueryTypes.INSERT
            }
        );

        return sendSuccess(res, 'Top Up Balance berhasil', { balance: newBalance });

    } catch (err) {
        console.error(err);
        return sendError(res, 500, 'Gagal top up', STATUS.SERVER_ERROR);
    }
};


const transaction = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const userId = req.user.id;
        const { service_code } = req.body;

        if (!service_code) {
            await t.rollback();
            return sendError(res, 400, 'Service atau Layanan tidak ditemukan', STATUS.VALIDATION_ERROR);
        }

        const [service] = await sequelize.query(
            'SELECT service_tarif, service_name FROM "Services" WHERE service_code = :serviceCode LIMIT 1',
            {
                replacements: { serviceCode: service_code },
                type: sequelize.QueryTypes.SELECT,
                transaction: t
            }
        );

        if (!service) {
            await t.rollback();
            return sendError(res, 400, 'Layanan tidak ditemukan', STATUS.VALIDATION_ERROR);
        }

        const transactionAmount = service.service_tarif;

        const [user] = await sequelize.query(
            'SELECT balance FROM "Users" WHERE id = :userId LIMIT 1',
            {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT,
                transaction: t
            }
        );

        if (!user) {
            await t.rollback();
            return sendError(res, 404, 'User tidak ditemukan', STATUS.VALIDATION_ERROR);
        }

        if (parseFloat(user.balance) < transactionAmount) {
            await t.rollback();
            return sendError(res, 400, 'Saldo tidak mencukupi', STATUS.VALIDATION_ERROR);
        }

        const newBalance = parseFloat(user.balance) - transactionAmount;

        await sequelize.query(
            'UPDATE "Users" SET balance = :newBalance WHERE id = :userId',
            {
                replacements: { newBalance, userId },
                type: sequelize.QueryTypes.UPDATE,
                transaction: t
            }
        );

        const invoiceNumber = `INV${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`;

        await sequelize.query(
            `INSERT INTO "Transactions"
             (id, user_id, invoice_number, transaction_type, description, total_amount, "createdAt", "updatedAt")
             VALUES (:id, :userId, :invoiceNumber, :transactionType, :description, :totalAmount, NOW(), NOW())`,
            {
                replacements: {
                    id: uuidv4(),
                    userId,
                    invoiceNumber,
                    transactionType: 'PAYMENT',
                    description: `Pembayaran untuk layanan ${service_code}`,
                    totalAmount: transactionAmount
                },
                type: sequelize.QueryTypes.INSERT,
                transaction: t
            }
        );

        await t.commit();

        return sendSuccess(res, 'Transaksi berhasil', {
            invoice_number: invoiceNumber,
            service_code: service_code,
            service_name: service.service_name,
            transaction_type: 'PAYMENT',
            total_amount: transactionAmount,
            created_on: new Date().toISOString()
        });

    } catch (err) {
        await t.rollback();
        console.error(err);
        return sendError(res, 500, 'Gagal melakukan transaksi', STATUS.SERVER_ERROR);
    }
};


const getTransactionHistory = async (req, res) => {
    const userId = req.user.id;
    const { offset = 0, limit = 3 } = req.query;
  
    try {
      const transactions = await sequelize.query(
        `SELECT invoice_number, transaction_type, description, total_amount, "createdAt"
         FROM "Transactions"
         WHERE user_id = :userId
         ORDER BY "createdAt" DESC
         LIMIT :limit OFFSET :offset`,
        {
          replacements: {
            userId,
            limit: parseInt(limit),
            offset: parseInt(offset),
          },
          type: QueryTypes.SELECT,
        }
      );
  
      if (transactions.length === 0) {
        return sendError(res, 404, 'Tidak ada riwayat transaksi ditemukan', STATUS.VALIDATION_ERROR);
      }
  
      const formattedTransactions = transactions.map((transaction) => ({
        invoice_number: transaction.invoice_number,
        transaction_type: transaction.transaction_type,
        description: transaction.description,
        total_amount: transaction.total_amount,
        created_on: transaction.createdAt.toISOString(),
      }));
  
      return sendSuccess(res, 'Get History Berhasil', {
        offset: parseInt(offset),
        limit: parseInt(limit),
        records: formattedTransactions,
      });
    } catch (err) {
      console.error(err);
      return sendError(res, 500, 'Gagal mengambil riwayat transaksi');
    }
  };
  

  const getBalance = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const [user] = await sequelize.query(
        'SELECT balance FROM "Users" WHERE id = :userId LIMIT 1',
        {
          replacements: { userId },
          type: sequelize.QueryTypes.SELECT
        }
      );
  
      if (!user) {
        return sendError(res, 404, 'User tidak ditemukan', STATUS.VALIDATION_ERROR);
      }
  
      return sendSuccess(res, 'Get Balance Berhasil', {
        balance: parseFloat(user.balance)
      });
    } catch (err) {
      console.error(err);
      return sendError(res, 500, 'Gagal mendapatkan saldo');
    }
  };
  
  

module.exports = {
    topUp,
    transaction,
    getTransactionHistory,
    getBalance
};