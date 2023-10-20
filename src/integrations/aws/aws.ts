import AWS from 'aws-sdk';

import { SWIZE_AWS_REGION, SWIZE_AWS_ACCESS_KEY, SWIZE_AWS_SECRET_KEY } from '../../config';

const accessKeyId = SWIZE_AWS_ACCESS_KEY;
const secretAccessKey = SWIZE_AWS_SECRET_KEY;

AWS.config.update({ accessKeyId, region: SWIZE_AWS_REGION, secretAccessKey });

export default AWS;
