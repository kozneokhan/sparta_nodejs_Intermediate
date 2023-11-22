import { Router } from 'express';
import bcrypt from 'bcrypt';
import db from '../models/index.cjs';
import { PASSWORD_HASH_SALT_ROUNDS } from '../constants/security.constant.js';
const { Users } = db;

const authRouter = Router();

// 회원가입
authRouter.post('/signup', async (req, res) => {
  try {
    const { email, password, passwordconfirm, name } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: '이메일 입력이 필요합니다.',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: '비밀번호 입력이 필요합니다.',
      });
    }

    if (!passwordconfirm) {
      return res.status(400).json({
        success: false,
        message: '비밀번호 확인 입력이 필요합니다.',
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: '이름 입력이 필요합니다.',
      });
    }

    if (password !== passwordconfirm) {
      return res.status(400).json({
        success: false,
        message: '입력한 비밀번호가 서로 일치하지 않습니다.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '비밀번호는 최소 6자리 이상 입력해야합니다.',
      });
    }

    let emailValidationRegex = new RegExp('[a-z0-9._]+@[a-z]+.[a-z]{2,3}');
    const isValidEmail = emailValidationRegex.test(email);
    if (!isValidEmail) {
      return res.status(400).json({
        success: false,
        message: '올바른 이메일 형식이 아닙니다.',
      });
    }

    const existUser = await Users.findOne({ where: { email } });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: '이미 가입 된 이메일입니다.',
      });
    }

    const hashedPassword = bcrypt.hashSync(password, PASSWORD_HASH_SALT_ROUNDS);

    const newUser = (
      await Users.create({ email, password: hashedPassword, name })
    ).toJSON();
    delete newUser.password;

    // console.log({ newUser: newUser.toJSON() });

    return res.status(201).json({
      success: true,
      massage: '회원가입에 성공했습니다.',
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      massage: '예상치 못한 에러가 발생했습니다. 관리자에게 문의하세요.',
    });
  }
});

// 로그인
authRouter.post('/signup', async (req, res) => {});

export { authRouter };
