import { Schema, model } from 'mongoose';
import type {
  UserType,
  LinktaFlowType,
  UserInputType,
} from '@/server/types/shcemaTypes';
// import { User } from 'firebase/auth';

const userSchema: Schema<UserType> = new Schema(
  {
    firstName: {
      type: String,
      //optional fields for future consideration
      required: true,
      minLength: 3,
      maxLength: 30,
      trim: true,
    },
    lastName: {
      type: String,
    },
    linktaFlows: [
      {
        type: Schema.Types.ObjectId,
        ref: 'LinktaFlow',
      },
    ],
  },
  { timestamps: true }
);

const userInputSchema: Schema<UserInputType> = new Schema(
  {
    input: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const linktaFlowSchema: Schema<LinktaFlowType> = new Schema({
  nodes: [
    {
      id: String,
      type: String,
      position: { x: Number, y: Number },
      data: { label: String },
    },
  ],
  edges: [
    {
      id: String,
      source: String,
      target: String,
      type: String,
    },
  ],
  userInputId: { type: Schema.Types.ObjectId, ref: 'UserInput' },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const User = model('User', userSchema);
const LinktaFlow = model('LinktaFlow', linktaFlowSchema);
const UserInput = model('UserInput', userInputSchema);

export { User, LinktaFlow, UserInput };
