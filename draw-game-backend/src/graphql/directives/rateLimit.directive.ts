import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { redis } from '../../config/redis';
import { UserInputError } from 'apollo-server-express';

export function rateLimitDirectiveTransformer(schema: GraphQLSchema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const rateLimitDirective = getDirective(schema, fieldConfig, 'rateLimit')?.[0];

      if (rateLimitDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        const { max = 60, window = '60s' } = rateLimitDirective;

        fieldConfig.resolve = async function (source, args, context, info) {
          const key = `rateLimit:${context.user?.id}:${info.fieldName}`;
          const current = await redis.incr(key);

          if (current === 1) {
            await redis.expire(key, parseInt(window));
          }

          if (current > max) {
            throw new UserInputError('Too many requests');
          }

          return resolve(source, args, context, info);
        };
      }
      return fieldConfig;
    },
  });
}