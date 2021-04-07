import dotenv from 'dotenv';
import 'jest-date-mock';
import * as path from 'path';

jest.mock('../functions/common/enhancers');

dotenv.config({ path: path.resolve(`${__dirname}/dev.env`) });
