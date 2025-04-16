# Service

- Created in `$lib/data/item-service.ts`
- Mock created in `$lib/data/__mocks__/item-service.ts`
- Always needs unit tests
  - Tests are created in `item-service.test.ts`
  - The `prisma` import automatically sets up the mock object; do not create a new mockPrisma

## Service

```typescript
import { type Type } from '@prisma/client';
import prisma from '$lib/data/prisma';

export interface TypeService {
  definitions
}

const typeService: TypeService = {
  // implementation
}

export default typeService;
```

## Mocks

```typescript
import { mockDeep } from 'vitest-mock-extended';
import { type ServiceName } from '$lib/data/service-name';

export default mockDeep<ServiceName>();
```

## Tests

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import itemService from '$lib/data/item-service';
import prisma from '$lib/data/prisma';

vi.mock('$lib/data/prisma');

beforeEach(() => {
  vi.resetAllMocks();
});

describe('example section', () => {
  function setupTest() {
    // setup test data
    const item = {id: 1};

    // configure mocked method implementation
    vi.mocked(prisma.item.findUnique).mockResolvedValue(item as any);

    // return any data
    return {
      item
    };
  }
  
  it('example test', async () => {
    // arrange
    const testData = setupTest();
    const id = testData.item.id;

    // act    
    const result = await itemService.getById(id);

    // assert
    expect(prisma.item.findUnique).toHaveBeenCalledWith({ id });
    expect(result).toEqual(testData);
  });
});
```