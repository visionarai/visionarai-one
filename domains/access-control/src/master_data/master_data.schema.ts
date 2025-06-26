import { model, Model, models, Schema } from 'mongoose';
import { type MasterDataType } from './master_data.types.js';

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

const MasterDataModel = (models.MasterData as Model<MasterDataType>) || model<MasterDataType>('MasterData', MasterDataSchema);

export default MasterDataModel as unknown as Model<MasterDataType>;
