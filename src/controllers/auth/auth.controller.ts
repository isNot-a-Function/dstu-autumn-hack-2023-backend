import bcrypt from 'bcrypt';
import validate from 'deep-email-validator';

import { ZodError } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';

import prisma from '../../prisma';

import { SuccessReply } from '../../reply/success.reply';
import { ErrorReply } from '../../reply/error.reply';

import { logger } from '../../log';
import { HASH_COIN } from '../../config';
import { refreshTokenConfiguration } from '../../configuration';
import { createRefreshToken, createToken, verifyRefreshToken } from '../../integrations/jwt';

import { SignInSchema, SignUpSchema } from './auth.validator';
import { ISignInUser, ISignUpUser } from './auth.interface';

export const SignUpUserController = async (req: FastifyRequest<{ Body: ISignUpUser }>, reply: FastifyReply) => {
  try {
    const data = SignUpSchema.parse(req.body);

    const existUser = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (existUser) {
      reply
        .status(ErrorReply.UserExistErrorStatus)
        .send({
          message: ErrorReply.UserExistErrorMessage,
        });
      return;
    }

    const isEmailExist = await validate(data.email);

    if (!isEmailExist.valid) {
      reply
        .status(ErrorReply.EmailDoesNotExistErrorStatus)
        .send({
          message: ErrorReply.EmailDoesNotExistErrorMessage,
        });
    }

    const passwordHash = await bcrypt.hash(data.password, HASH_COIN);

    const newUser = await prisma.user.create({
      data: {
        custoremInfo: {
          create: {
            rating: 0,
          },
        },
        email: data.email,
        executorInfo: {
          create: {
            rating: 0,
          },
        },
        passwordHash,
      },
    });

    const accessToken = createToken(newUser);
    const refreshToken = createRefreshToken(newUser);

    reply
      .status(SuccessReply.SignUpSuccessStatus)
      .cookie('refreshToken', refreshToken,
        {
          httpOnly: refreshTokenConfiguration.httpOnly,
          maxAge: refreshTokenConfiguration.maxAge,
          sameSite: refreshTokenConfiguration.sameSite,
          secure: refreshTokenConfiguration.secure,
        },
      )
      .send({
        message: SuccessReply.SignUpSuccessMessage,
        token: accessToken,
        user: {
          email: newUser.email,
          id: newUser.id,
          role: newUser.role,
        },
      });
  } catch (error) {
    if (error instanceof ZodError) {
      reply
        .status(ErrorReply.ValidationErrorStatus)
        .send({
          message: ErrorReply.ValidationErrorMessage,
        });
    }

    if (error instanceof Error) {
      logger.error(error.message);

      reply
        .status(ErrorReply.BaseErrorStatus)
        .send({
          message: error.message,
        });
    }
  }
};

export const SignInUserController = async (req: FastifyRequest<{ Body: ISignInUser }>, reply: FastifyReply) => {
  try {
    const data = SignInSchema.parse(req.body);

    const findUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!findUser) {
      reply
        .status(ErrorReply.EmailValidationErrorStatus)
        .send({
          message: ErrorReply.EmailValidationErrorMessage,
        });

      return;
    }

    const passwordMatch = await bcrypt.compare(data.password, findUser.passwordHash);

    if (!passwordMatch) {
      reply
        .status(ErrorReply.PasswordValidationErrorStatus)
        .send({
          message: ErrorReply.PasswordValidationErrorMessage,
        });

      return;
    }

    const accessToken = createToken(findUser);
    const refreshToken = createRefreshToken(findUser);

    reply
      .status(SuccessReply.SignInSuccessStatus)
      .cookie('refreshToken', refreshToken,
        {
          httpOnly: refreshTokenConfiguration.httpOnly,
          maxAge: refreshTokenConfiguration.maxAge,
          sameSite: refreshTokenConfiguration.sameSite,
          secure: refreshTokenConfiguration.secure,
        },
      )
      .send({
        message: SuccessReply.SignInSuccessMessage,
        token: accessToken,
        user: {
          email: findUser.email,
          id: findUser.id,
          role: findUser.role,
        },
      });
  } catch (error) {
    if (error instanceof ZodError) {
      reply
        .status(ErrorReply.ValidationErrorStatus)
        .send({
          message: ErrorReply.ValidationErrorMessage,
        });
    }

    if (error instanceof Error) {
      logger.error(error.message);

      reply
        .status(ErrorReply.BaseErrorStatus)
        .send({
          message: error.message,
        });
    }
  }
};

export const RefreshTokenController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    if (req.cookies.refreshToken) {
      const verifyToken = verifyRefreshToken(req.cookies.refreshToken);

      if (typeof verifyToken === 'string') {
        reply
          .status(ErrorReply.TokenIsInvalidErrorStatus);

        return;
      }

      const findUser = await prisma.user.findUnique({
        where: {
          id: verifyToken.userId,
        },
      });

      if (!findUser) {
        reply
          .status(ErrorReply.EmailValidationErrorStatus);

        return;
      }

      const accessToken = createToken(findUser);
      const refreshToken = createRefreshToken(findUser);

      reply
        .status(SuccessReply.RefreshTokenSuccessStatus)
        .cookie('refreshToken', refreshToken,
          {
            httpOnly: refreshTokenConfiguration.httpOnly,
            maxAge: refreshTokenConfiguration.maxAge,
            sameSite: refreshTokenConfiguration.sameSite,
            secure: refreshTokenConfiguration.secure,
          },
        )
        .send({
          token: accessToken,
        });
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);

      reply
        .status(ErrorReply.BaseErrorStatus)
        .send({
          message: error.message,
        });
    }
  }
};
