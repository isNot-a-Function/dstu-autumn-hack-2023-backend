import cuid from 'cuid';
import { FastifyRequest, FastifyReply } from 'fastify';

import { logger } from '../../log';
import * as awsS3API from '../../integrations/aws/s3';

export const UploadFileController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const parts = req.files();

    // eslint-disable-next-line prefer-const
    let files: string[] = [];

    for await (const part of parts) {
      const file = await part.toBuffer();

      const filename = `${cuid()}`;

      const fileUrl = await awsS3API.uploadFile(file, filename);

      files.push(fileUrl);
    }

    reply
      .status(200)
      .send({
        files,
        message: 'Файлы загружены',
      });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);

      reply
        .status(400)
        .send({
          message: error.message,
        });
    }
  }
};
