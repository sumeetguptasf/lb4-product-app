import {property} from '@loopback/repository';

export function ModifiedDate() {
  return property({
    type: 'string',
    jsonSchema: {
      format: 'date-time',
    },
    postgresql: {
      dataType: 'timestamp',
    },
  });
}