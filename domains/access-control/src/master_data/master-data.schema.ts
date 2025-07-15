import { Schema } from 'mongoose';
import type { MasterDataType } from './master-data.types.js';

export const MasterDataSchema = new Schema<MasterDataType>(
  {
    resources: {
      type: Map,
      of: new Schema({
        attributes: {
          type: Map,
          of: {
            type: String,
            enum: ['string', 'number', 'boolean', 'Date'],
            required: true,
          },
        },
        permissions: [String],
      }),
    },
  },
  { timestamps: true }
);
