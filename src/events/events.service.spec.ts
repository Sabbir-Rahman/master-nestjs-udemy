import { Repository } from 'typeorm'
import { EventService } from './events.service'
import { Event } from './event.entity'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('EventsService', () => {
  let service: EventService
  let repository: Repository<Event>

  const deleteQb = {
    where: jest.fn(),
    execute: jest.fn(),
  }
  const selectQb = {
    delete: jest.fn().mockReturnValue(deleteQb),
    where: jest.fn(),
    execute: jest.fn(),
    orderBy: jest.fn(),
    leftJoinAndSelect: jest.fn(),
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(selectQb),
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

  describe('delete event', () => {
    it('It should delete an event', async () => {
      const createQueryBuilderSpy = jest.spyOn(repository, 'createQueryBuilder')
      const deleteSpy = jest.spyOn(selectQb, 'delete')
      const whereSpy = jest.spyOn(deleteQb, 'where').mockReturnValue(deleteQb)
      const executeSpy = jest.spyOn(deleteQb, 'execute')

      expect(service.deleteEvent(1)).resolves.toBe(undefined)

      expect(createQueryBuilderSpy).toHaveBeenCalledTimes(1)
      expect(createQueryBuilderSpy).toHaveBeenCalledWith('e')

      expect(deleteSpy).toHaveBeenCalledTimes(1)
      expect(whereSpy).toHaveBeenCalledTimes(1)
      expect(whereSpy).toHaveBeenCalledWith('id = :id', { id: 1 })
      expect(executeSpy).toHaveBeenCalledTimes(1)
    })
  })
})
