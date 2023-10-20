import { logger } from '../../log';
import { SWIZE_AWS_BUCKET, SWIZE_AWS_REGION } from '../../config';
import aws from './aws';

const ACL = 'bucket-owner-full-control';

const client = new aws.S3({
  region: SWIZE_AWS_REGION,
  signatureVersion: 'v4',
});

export const uploadFile = async (file: any, fileName: string): Promise<string> => {
  let params: any = {};

  params = {
    ACL,
    Body: file,
    Bucket: SWIZE_AWS_BUCKET,
    Key: `${fileName}`,
  };

  await client.upload(params, async (uploadErr, _uploadData) => {
    if (uploadErr) {
      throw uploadErr;
    };
  });

  return `https://${SWIZE_AWS_BUCKET}.s3.${SWIZE_AWS_REGION}.amazonaws.com/${fileName}`;
};

export const deleteObject = ({ fileName }: DeleteObjectInput) => {
  try {
    client.deleteObject({
      Bucket: SWIZE_AWS_BUCKET,
      Key: fileName,
    }).promise().catch((error) => logger.error(error));
  } catch (error) {
    error instanceof Error && logger.error(error.message);
  }
};

export interface DeleteObjectInput {
  fileName: string;
}

export interface GetSignedUrlInput {
  fileName: string;
  type: string;
}
