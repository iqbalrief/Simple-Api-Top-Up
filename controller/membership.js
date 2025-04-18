const { sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { sendError, sendSuccess, STATUS } = require('../utils/errorHandler');

const {registerSchema, loginSchema} = require('../validator/membership')

const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return sendError(res, 400, 'Parameter email tidak sesuai format', STATUS.VALIDATION_ERROR);
    }

    const { first_name, last_name, email, password, balance = 0 } = value;
    const [existing] = await sequelize.query(
      `SELECT * FROM "Users" WHERE email = :email LIMIT 1`,
      {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (existing) {
      return sendError(res, 409, 'Email sudah terdaftar', STATUS.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await sequelize.query(
      `INSERT INTO "Users"
        (id, first_name, last_name, email, password, balance, "createdAt", "updatedAt")
        VALUES (:id, :first_name, :last_name, :email, :password, :balance, NOW(), NOW())
        RETURNING *`,
      {
        replacements: {
          id: uuidv4(),
          first_name,
          last_name,
          email,
          password: hashedPassword,
          balance
        },
        type: sequelize.QueryTypes.INSERT
      }
    );

    const user = result[0];
    const token = jwt.sign(
      { id: user.id, username: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return sendSuccess(res, 'Registrasi berhasil, silakan login');
  } catch (err) {
    return sendError(res, 500, 'Gagal registrasi', err.message, STATUS.SERVER_ERROR);
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  const { error } = loginSchema.validate({ email, password }, { abortEarly: false });
  if (error) {
    return sendError(res, 400, 'Paramter email tidak sesuai format', STATUS.VALIDATION_ERROR);
  }

  try {
    const [user] = await sequelize.query(
      `SELECT * FROM "Users" WHERE email = :email LIMIT 1`,
      {
        replacements: { email },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return sendError(res, 401, 'Email atau password salah', STATUS.SERVER_ERROR);
      }

    const token = jwt.sign({ 
        id: user.id,
        name: `${user.first_name} ${user.last_name}` 
    }, 
       process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      return sendSuccess(res, 'Login sukses', { token });
  } catch (err) {
    console.error(err);
    await t.rollback(); 
    return sendError(res, 500, 'Gagal registrasi', err.message, STATUS.SERVER_ERROR);
  }
};




module.exports ={
    register,
    login
}