import { Repository } from 'typeorm'
import { EventService } from './events.service'
import { Event } from './event.entity'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('EventsService', () => {
  let service: EventService
  let repository: Repository<Event>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
            delete: jest.fn(),
            where: jest.fn(),
            execute: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<EventService>(EventService)
    repository = module.get<Repository<Event>>(getRepositoryToken(Event))
  })

  describe('updateEvent', () => {
    it('should update the events', async () => {
      const repoSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ id: 1 } as Event)
      expect(
        service.updateEvent(new Event({ id: 1 }), {
          name: 'New name',
        }),
      ).resolves.toEqual({ id: 1 })
      expect(repoSpy).toHaveBeenCalledWith({ id: 1, name: 'New name' })
    })
  })
})
